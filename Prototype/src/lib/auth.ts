import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getActor(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const { data: claimData } = await supabase.auth.getClaims();
  const claims = claimData?.claims;
  if (!claims?.sub) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", claims.sub).maybeSingle();
  return profile?.active ? profile : null;
}

export async function requireActor(roles?: Profile["role"][]) {
  const actor = await getActor();
  if (!actor) redirect("/login");
  if (roles && !roles.includes(actor.role)) redirect(actor.role === "client_owner" ? "/client" : "/agency");
  return actor;
}

export function actorHome(role: Profile["role"]): "/client" | "/agency" {
  return role === "client_owner" ? "/client" : "/agency";
}
