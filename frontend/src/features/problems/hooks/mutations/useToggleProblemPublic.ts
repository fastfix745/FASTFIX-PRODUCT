import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProblemPublic } from "@/services/problems/problemsService";
import { invalidateProblems } from "@/shared/lib/queryClient";

export function useToggleProblemPublic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublic }: { id: string; isPublic: boolean }) =>
      updateProblemPublic(id, isPublic),
    onSuccess: () => invalidateProblems(queryClient),
  });
}
