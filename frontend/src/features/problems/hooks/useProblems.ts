export type { Problem, NewProblemInput } from "@/types/problem";
export { uploadProblemMedia } from "@/services/problems/problemsService";

export { useProblemsQuery as useProblems } from "./queries/useProblemsQuery";
export { useProblemsByCityQuery } from "./queries/useProblemsByCityQuery";
export { useProblemsByUserCityQuery } from "./queries/useProblemsByUserCityQuery";
export { useUpdateProblemStatus as useUpdateStatus } from "./mutations/useUpdateProblemStatus";
export { useToggleProblemPublic as useTogglePublic } from "./mutations/useToggleProblemPublic";
export { useUpdateProblemMedia as useUpdateMedia } from "./mutations/useUpdateProblemMedia";
export { useToggleUpvote } from "./mutations/useToggleUpvote";
export { useCreateProblem } from "./mutations/useCreateProblem";
export { useUpdateProblemResponse as useResponse } from "./mutations/useUpdateProblemResponse";
