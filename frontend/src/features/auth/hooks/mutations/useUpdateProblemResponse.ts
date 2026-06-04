import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProblemResponse } from "@/services/problems/problemsService";
import { toast } from "sonner";

export function useUpdateProblemResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, response }: { id: string; response: string }) =>
      updateProblemResponse(id, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      toast.success("Resposta enviada ao cidadão!");
    },
    onError: (e: Error) => toast.error("Erro ao enviar resposta", { description: e.message }),
  });
}