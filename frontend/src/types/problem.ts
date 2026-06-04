import type { Database } from "@/services/supabase/types";

export type ProblemCategory = Database["public"]["Enums"]["problem_category"];
export type ProblemSeverity = Database["public"]["Enums"]["problem_severity"];
export type ProblemStatus = Database["public"]["Enums"]["problem_status"];

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: ProblemCategory;
  severity: ProblemSeverity;
  status: ProblemStatus;
  upvotes: number;
  hasUpvoted: boolean;
  lat: number;
  lng: number;
  address: string;
  city: string;
  isPublic: boolean;
  beforeImages: string[];
  afterImages: string[];
  createdAt: string;
  imageUrl?: string | null;
  reporterName: string;
  userId: string | null;
  response?: string | null;
  responseCreatedAt?: string | null;
}

export interface NewProblemInput {
  title: string;
  description: string;
  category: ProblemCategory;
  severity: ProblemSeverity;
  address: string;
  lat: number;
  lng: number;
  reporterName: string;
  imageUrl?: string | null;
  city?: string;
}
