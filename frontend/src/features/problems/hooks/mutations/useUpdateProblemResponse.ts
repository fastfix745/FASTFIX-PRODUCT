import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProblemResponse } from "@/services/problems/problemsService";
import { invalidateProblems } from "@/shared/lib/queryClient";

export function useUpdateProblemResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, response }: { id: string; response: string }) =>
      updateProblemResponse(id, response),
    onSuccess: () => invalidateProblems(queryClient),
  });
}