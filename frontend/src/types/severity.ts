import type { Database } from "@/services/supabase/types";

export type SeverityLevel = Database["public"]["Enums"]["problem_severity"];

export interface SeverityVotesData {
  counts: Record<SeverityLevel, number>;
  total: number;
  topSeverity: SeverityLevel | null;
  userVote: SeverityLevel | null;
}
