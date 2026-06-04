import { useQuery } from "@tanstack/react-query";
import { fetchProblems } from "@/services/problems/problemsService";
import { queryKeys } from "@/services/queryKeys";
import type { Problem } from "@/types/problem";

export function useProblemsByCityQuery(city: string) {
  return useQuery<Problem[]>({
    queryKey: queryKeys.problems.byCity(city),
    queryFn: () => fetchProblems(city),
    enabled: !!city,
  });
}