import { integrationLimit, type IntegrationKind } from "@/domain/quotas";
import type { Profile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function ensureQuotaAvailable(actor: Profile, integration: IntegrationKind) {
  const db = await createSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await db
    .from("integration_usage")
    .select("count")
    .eq("user_id", actor.id)
    .eq("integration", integration)
    .eq("usage_date", today)
    .maybeSingle();
  if (error) throw error;
  const used = data?.count ?? 0;
  const limit = integrationLimit(integration);
  if (used >= limit) {
    throw new Error(`Daily ${integration} limit reached. Try again tomorrow.`);
  }
  return { used, limit };
}

export async function consumeQuota(actor: Profile, integration: IntegrationKind) {
  const db = await createSupabaseServerClient();
  const today = new Date().toISOString().slice(0,10);
  const { data } = await db.from("integration_usage").select("id,count").eq("user_id",actor.id).eq("integration",integration).eq("usage_date",today).maybeSingle();
  const next = (data?.count ?? 0) + 1;
  if (next > integrationLimit(integration)) throw new Error(`Daily ${integration} limit reached. Try again tomorrow.`);
  const result = data
    ? await db.from("integration_usage").update({ count: next }).eq("id",data.id)
    : await db.from("integration_usage").insert({ user_id:actor.id,integration,usage_date:today,count:next });
  if (result.error) throw result.error;
  return { used: next, limit: integrationLimit(integration) };
}
