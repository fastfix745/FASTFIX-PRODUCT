import { supabase } from "@/services/supabase/client";
import type { SeverityLevel, SeverityVotesData } from "@/types/severity";

export const severityLevels: SeverityLevel[] = ["low", "medium", "high", "critical"];

export async function fetchSeverityVotes(problemId: string): Promise<SeverityVotesData> {
  const { data, error } = await supabase
    .from("problem_severity_votes")
    .select("severity, user_id")
    .eq("problem_id", problemId);
  if (error) throw error;

  const counts: Record<SeverityLevel, number> = { low: 0, medium: 0, high: 0, critical: 0 };
  (data ?? []).forEach((row) => {
    counts[row.severity as SeverityLevel] = (counts[row.severity as SeverityLevel] || 0) + 1;
  });

  const { data: { user } } = await supabase.auth.getUser();
  const userVote = user
    ? ((data ?? []).find((r) => r.user_id === user.id)?.severity as SeverityLevel | undefined) ?? null
    : null;

  const total = severityLevels.reduce((acc, s) => acc + counts[s], 0);
  let topSeverity: SeverityLevel | null = null;
  if (total > 0) {
    topSeverity = severityLevels.reduce((best, s) => (counts[s] > counts[best] ? s : best), severityLevels[0]);
  }

  return { counts, total, topSeverity, userVote };
}

export async function castSeverityVote(problemId: string, severity: SeverityLevel): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Faça login para votar na criticidade");
  const { error } = await supabase
    .from("problem_severity_votes")
    .upsert(
      { problem_id: problemId, user_id: user.id, severity },
      { onConflict: "problem_id,user_id" },
    );
  if (error) throw error;
}
