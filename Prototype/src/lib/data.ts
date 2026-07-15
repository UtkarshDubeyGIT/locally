import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
type Row<K extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][K]["Row"];
export type ActionWithRelations=Row<"actions">&{clients:{business_name:string}|null;locations:{name:string}|null};
export type ReportWithRelations=Row<"monthly_updates">&{clients:{business_name:string}|null};
export type AuditWithRelations=Row<"website_audits">&{locations:{name:string;clients:{business_name:string}|null}};
export type CompetitorWithRelations=Row<"competitors">&{locations:{name:string;clients:{business_name:string}|null}};

export async function getAgencyOverview() {
  const db = await createSupabaseServerClient();
  const [clients, locations, reviews, actions, reports] = await Promise.all([
    db.from("clients").select("*", { count: "exact" }).order("business_name"),
    db.from("locations").select("id,client_id,name,status"),
    db.from("reviews").select("id,status,severity,rating,review_date,location_id").order("review_date", { ascending: false }),
    db.from("actions").select("*").order("due_date"),
    db.from("monthly_updates").select("*").order("month", { ascending: false }),
  ]);
  if (clients.error) throw clients.error;
  return { clients: clients.data, locations: locations.data ?? [], reviews: reviews.data ?? [], actions: actions.data ?? [], reports: reports.data ?? [] };
}

export async function getClients() {
  const db = await createSupabaseServerClient();
  const { data, error } = await db.from("clients").select("*, locations(*), client_assignments(user_id)").order("business_name");
  if (error) throw error; return data;
}

export async function getClient(clientId: string) {
  const db = await createSupabaseServerClient();
  const [client, locations, health, performance, actions, reports, onboarding] = await Promise.all([
    db.from("clients").select("*").eq("id", clientId).single(),
    db.from("locations").select("*").eq("client_id", clientId).order("name"),
    db.from("gbp_health_checks").select("*, locations!inner(client_id,name)").eq("locations.client_id", clientId),
    db.from("location_performance_snapshots").select("*, locations!inner(client_id,name)").eq("locations.client_id", clientId).order("period", { ascending: false }),
    db.from("actions").select("*").eq("client_id", clientId).order("due_date"),
    db.from("monthly_updates").select("*").eq("client_id", clientId).order("month", { ascending: false }),
    db.from("onboarding_submissions").select("*").eq("client_id", clientId).maybeSingle(),
  ]);
  if (client.error) throw client.error;
  return { client: client.data, locations: locations.data ?? [], health: health.data ?? [], performance: performance.data ?? [], actions: actions.data ?? [], reports: reports.data ?? [], onboarding: onboarding.data };
}

export async function getReviews() {
  const db = await createSupabaseServerClient();
  const { data, error } = await db.from("reviews").select("*, locations!inner(name,client_id,clients!inner(business_name)), review_replies(*)").order("review_date", { ascending: false });
  if (error) throw error; return data;
}

export async function getReview(reviewId: string) {
  const db = await createSupabaseServerClient();
  const [review, notes] = await Promise.all([
    db.from("reviews").select("*, locations!inner(name,client_id,clients!inner(business_name)), review_replies(*)").eq("id", reviewId).single(),
    db.from("review_internal_notes").select("*, profiles(full_name)").eq("review_id", reviewId).order("created_at", { ascending: false }),
  ]);
  if (review.error) throw review.error; return { review: review.data, notes: notes.data ?? [] };
}

export function getAgencyTable(kind:"actions"):Promise<ActionWithRelations[]>;
export function getAgencyTable(kind:"monthly_updates"):Promise<ReportWithRelations[]>;
export function getAgencyTable(kind:"website_audits"):Promise<AuditWithRelations[]>;
export function getAgencyTable(kind:"competitors"):Promise<CompetitorWithRelations[]>;
export async function getAgencyTable(kind: "actions" | "monthly_updates" | "website_audits" | "competitors"):Promise<ActionWithRelations[]|ReportWithRelations[]|AuditWithRelations[]|CompetitorWithRelations[]> {
  const db = await createSupabaseServerClient();
  if (kind === "actions") return ((await db.from(kind).select("*, clients(business_name), locations(name)").order("created_at", { ascending: false })).data ?? []) as ActionWithRelations[];
  if (kind === "monthly_updates") return ((await db.from(kind).select("*, clients(business_name)").order("month", { ascending: false })).data ?? []) as ReportWithRelations[];
  if (kind === "website_audits") return ((await db.from(kind).select("*, locations!inner(name,clients(business_name))").order("created_at", { ascending: false })).data ?? []) as AuditWithRelations[];
  return ((await db.from(kind).select("*, locations!inner(name,clients(business_name))").order("captured_at", { ascending: false })).data ?? []) as CompetitorWithRelations[];
}

export async function getProfiles() { const db=await createSupabaseServerClient(); const {data}=await db.from("profiles").select("*").order("role"); return data ?? []; }

export async function getReport(reportId:string){const db=await createSupabaseServerClient();const [report,feedback,deliveries]=await Promise.all([db.from("monthly_updates").select("*,clients!inner(business_name,id)").eq("id",reportId).single(),db.from("report_feedback").select("*").eq("monthly_update_id",reportId),db.from("email_deliveries").select("*").eq("monthly_update_id",reportId).order("attempted_at",{ascending:false})]);if(report.error)throw report.error;return {report:report.data,feedback:feedback.data??[],deliveries:deliveries.data??[]}}

export async function getClientWorkspace(clientId: string) {
  return getClient(clientId);
}
