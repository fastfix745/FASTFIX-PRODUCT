import { useMutation, useQueryClient } from "@tanstack/react-query";
import { castSeverityVote } from "@/services/severity/severityVotesService";
import { invalidateSeverityVotes } from "@/shared/lib/queryClient";
import type { SeverityLevel } from "@/types/severity";

export function useCastSeverityVote(problemId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (severity: SeverityLevel) => {
      if (!problemId) throw new Error("Ocorrência inválida");
      await castSeverityVote(problemId, severity);
    },
    onSuccess: () => {
      if (problemId) invalidateSeverityVotes(queryClient, problemId);
    },
  });
}
