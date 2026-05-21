import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type SeverityLevel = Database["public"]["Enums"]["problem_severity"];

export const severityLevels: SeverityLevel[] = ["low", "medium", "high", "critical"];

export const severityConfig: Record<SeverityLevel, { label: string; classes: string; activeClasses: string; dot: string }> = {
  low: {
    label: "Baixa",
    classes: "border-success/30 text-success hover:bg-success/10",
    activeClasses: "bg-success/15 border-success text-success ring-2 ring-success/40",
    dot: "bg-success",
  },
  medium: {
    label: "Média",
    classes: "border-warning/30 text-warning hover:bg-warning/10",
    activeClasses: "bg-warning/15 border-warning text-warning ring-2 ring-warning/40",
    dot: "bg-warning",
  },
  high: {
    label: "Alta",
    classes: "border-accent/30 text-accent hover:bg-accent/10",
    activeClasses: "bg-accent/15 border-accent text-accent ring-2 ring-accent/40",
    dot: "bg-accent",
  },
  critical: {
    label: "Urgente",
    classes: "border-destructive/30 text-destructive hover:bg-destructive/10",
    activeClasses: "bg-destructive/15 border-destructive text-destructive ring-2 ring-destructive/40",
    dot: "bg-destructive",
  },
};

export interface SeverityVotesData {
  counts: Record<SeverityLevel, number>;
  total: number;
  topSeverity: SeverityLevel | null;
  userVote: SeverityLevel | null;
}

async function fetchSeverityVotes(problemId: string): Promise<SeverityVotesData> {
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
  const userVote = user ? ((data ?? []).find((r) => r.user_id === user.id)?.severity as SeverityLevel | undefined) ?? null : null;

  const total = severityLevels.reduce((acc, s) => acc + counts[s], 0);
  let topSeverity: SeverityLevel | null = null;
  if (total > 0) {
    topSeverity = severityLevels.reduce((best, s) => (counts[s] > counts[best] ? s : best), severityLevels[0]);
  }

  return { counts, total, topSeverity, userVote };
}

export function useSeverityVotes(problemId: string | undefined) {
  return useQuery({
    queryKey: ["severity-votes", problemId],
    queryFn: () => fetchSeverityVotes(problemId as string),
    enabled: !!problemId,
  });
}

export function useCastSeverityVote(problemId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (severity: SeverityLevel) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Faça login para votar na criticidade");
      if (!problemId) throw new Error("Ocorrência inválida");
      const { error } = await supabase
        .from("problem_severity_votes")
        .upsert(
          { problem_id: problemId, user_id: user.id, severity },
          { onConflict: "problem_id,user_id" },
        );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["severity-votes", problemId] }),
  });
}
