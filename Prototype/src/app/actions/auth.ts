"use server";

import { redirect } from "next/navigation";
import type { Route } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { actorHome } from "@/lib/auth";

export type AuthState = { error?: string };

export async function loginAction(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "That email and password did not match a Locally account." };
  const { data: profile } = await supabase.from("profiles").select("role, active").eq("id", data.user.id).single();
  if (!profile?.active) { await supabase.auth.signOut(); return { error: "This account is inactive. Ask the agency owner to restore access." }; }
  if (next.startsWith("/") && !next.startsWith("//")) redirect(next as Route);
  redirect(actorHome(profile.role));
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
