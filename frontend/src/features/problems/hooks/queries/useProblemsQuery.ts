import { useQuery } from "@tanstack/react-query";
import { fetchProblems } from "@/services/problems/problemsService";
import { queryKeys } from "@/services/queryKeys";

export function useProblemsQuery() {
  return useQuery({
    queryKey: queryKeys.problems.all,
    queryFn: fetchProblems,
  });
}
