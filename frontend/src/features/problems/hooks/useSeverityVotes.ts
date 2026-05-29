export type { SeverityLevel, SeverityVotesData } from "@/types/severity";
export { severityLevels } from "@/services/severity/severityVotesService";
export { severityConfig } from "@/features/problems/config/severityVoting";

export { useSeverityVotesQuery as useSeverityVotes } from "./queries/useSeverityVotesQuery";
export { useCastSeverityVote } from "./mutations/useCastSeverityVote";
