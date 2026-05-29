import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleProblemUpvote } from "@/services/problems/problemsService";
import { invalidateProblems } from "@/shared/lib/queryClient";

export function useToggleUpvote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ problemId, hasUpvoted }: { problemId: string; hasUpvoted: boolean }) =>
      toggleProblemUpvote(problemId, hasUpvoted),
    onSuccess: () => invalidateProblems(queryClient),
  });
}
