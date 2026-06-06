import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProblem } from "@/services/problems/problemsService";
import { invalidateProblems } from "@/shared/lib/queryClient";
import type { NewProblemInput } from "@/types/problem";

export function useUpdateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<NewProblemInput> }) =>
      updateProblem(id, input),
    onSuccess: () => invalidateProblems(queryClient),
  });
}