import { supabase } from "@/services/supabase/client";
import type { Profile, Role } from "@/types/auth";

export interface SignUpInput {
  email: string;
  password: string;
  displayName: string;
  city: string;
}

export async function fetchUserProfileAndRoles(
  userId: string,
): Promise<{ profile: Profile | null; roles: Role[] }> {
  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);
  return {
    profile: profile ?? null,
    roles: (roleRows ?? []).map((x) => x.role as Role),
  };
}

export async function signUp(input: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${window.location.origin}/app`,
      data: { display_name: input.displayName, city: input.city },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function resetPasswordForEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/app` },
  });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0],
) {
  return supabase.auth.onAuthStateChange(callback);
}

export function hasPasswordRecoveryInUrl(): boolean {
  const hash = window.location.hash || "";
  return hash.includes("type=recovery") || hash.includes("access_token");
}
