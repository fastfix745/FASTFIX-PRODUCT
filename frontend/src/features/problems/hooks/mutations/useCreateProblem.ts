import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProblem } from "@/services/problems/problemsService";
import { invalidateProblems } from "@/shared/lib/queryClient";
import type { NewProblemInput } from "@/types/problem";

export function useCreateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewProblemInput) => createProblem(input),
    onSuccess: () => invalidateProblems(queryClient),
  });
}
