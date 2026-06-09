import { useQuery } from "@tanstack/react-query";
import { fetchProblems } from "@/services/problems/problemsService";
import { queryKeys } from "@/services/queryKeys";
import type { Problem } from "@/types/problem";

export function useProblemsByCityQuery(city: string | undefined) {
  // Se city for undefined ou string vazia, busca todos os problemas
  const cityParam = city || undefined;

  return useQuery<Problem[]>({
    queryKey: queryKeys.problems.byCity(cityParam ?? "all"),
    queryFn: () => fetchProblems(cityParam),
    enabled: true, // Sempre habilita - se não tiver city, busca todos
  });
}