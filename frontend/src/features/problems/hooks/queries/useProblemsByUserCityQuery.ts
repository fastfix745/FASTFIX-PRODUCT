import { useQuery } from "@tanstack/react-query";
import { fetchProblems } from "@/services/problems/problemsService";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { Problem } from "@/types/problem";

export function useProblemsByUserCityQuery() {
  const { profile, roles, user } = useAuth();
  const userCity = profile?.city;

  // Admin vê todas as cidades
  const isAdmin = roles.includes("admin");
  // Gestor vê apenas problemas da cidade dele
  const isManager = roles.includes("manager");

  // Cidadão e Admin veem todas as cidades
  // Gestor ve apenas problemas da cidade dele
  const cityToFetch = isManager ? (userCity || undefined) : undefined;

  return useQuery<Problem[]>({
    queryKey: queryKeys.problems.byCity(cityToFetch ?? "all"),
    queryFn: () => fetchProblems(cityToFetch),
    enabled: true,
  });
}