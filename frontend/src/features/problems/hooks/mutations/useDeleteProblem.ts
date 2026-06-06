import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProblem } from "@/services/problems/problemsService";
import { invalidateProblems } from "@/shared/lib/queryClient";

export function useDeleteProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProblem(id),
    onSuccess: () => invalidateProblems(queryClient),
  });
}