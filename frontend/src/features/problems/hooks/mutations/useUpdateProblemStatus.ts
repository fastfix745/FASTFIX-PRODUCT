import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProblemStatus } from "@/services/problems/problemsService";
import { invalidateProblems } from "@/shared/lib/queryClient";
import type { ProblemStatus } from "@/types/problem";

export function useUpdateProblemStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProblemStatus }) =>
      updateProblemStatus(id, status),
    onSuccess: () => invalidateProblems(queryClient),
  });
}
