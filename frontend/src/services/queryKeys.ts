export const queryKeys = {
  problems: {
    all: ["problems"] as const,
    byCity: (city: string) => ["problems", "city", city] as const,
  },
  severityVotes: {
    all: ["severity-votes"] as const,
    byProblem: (problemId: string) => ["severity-votes", problemId] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    byUser: (userId: string) => ["notifications", userId] as const,
  },
} as const;
