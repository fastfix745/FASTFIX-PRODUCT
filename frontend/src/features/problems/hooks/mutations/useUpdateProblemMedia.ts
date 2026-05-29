import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProblemMedia } from "@/services/problems/problemsService";
import { invalidateProblems } from "@/shared/lib/queryClient";

export function useUpdateProblemMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, before, after }: { id: string; before?: string[]; after?: string[] }) =>
      updateProblemMedia(id, before, after),
    onSuccess: () => invalidateProblems(queryClient),
  });
}
