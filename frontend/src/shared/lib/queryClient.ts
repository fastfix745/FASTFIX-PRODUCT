import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/services/queryKeys";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function invalidateProblems(client: QueryClient) {
  return client.invalidateQueries({ queryKey: queryKeys.problems.all });
}

export function invalidateProblemsByCity(client: QueryClient, city: string) {
  return client.invalidateQueries({ queryKey: queryKeys.problems.byCity(city) });
}

export function invalidateSeverityVotes(client: QueryClient, problemId: string) {
  return client.invalidateQueries({ queryKey: queryKeys.severityVotes.byProblem(problemId) });
}

export function invalidateNotifications(client: QueryClient, userId: string) {
  return client.invalidateQueries({ queryKey: queryKeys.notifications.byUser(userId) });
}
