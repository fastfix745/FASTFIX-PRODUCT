import { useQuery } from "@tanstack/react-query";
import { fetchSeverityVotes } from "@/services/severity/severityVotesService";
import { queryKeys } from "@/services/queryKeys";

export function useSeverityVotesQuery(problemId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.severityVotes.byProblem(problemId ?? ""),
    queryFn: () => fetchSeverityVotes(problemId as string),
    enabled: !!problemId,
  });
}
