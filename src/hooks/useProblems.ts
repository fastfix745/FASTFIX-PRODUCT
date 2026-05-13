import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DbProblem = Database["public"]["Tables"]["problems"]["Row"];
type ProblemCategory = Database["public"]["Enums"]["problem_category"];
type ProblemSeverity = Database["public"]["Enums"]["problem_severity"];
type ProblemStatus = Database["public"]["Enums"]["problem_status"];

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
  createdAt: string;
  imageUrl?: string | null;
  reporterName: string;
}

async function fetchProblems(): Promise<Problem[]> {
  const { data: problems, error } = await supabase
    .from("problems")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Get upvote counts
  const { data: upvoteCounts, error: upErr } = await supabase
    .from("problem_upvotes")
    .select("problem_id");

  if (upErr) throw upErr;

  const countMap: Record<string, number> = {};
  upvoteCounts?.forEach((u) => {
    countMap[u.problem_id] = (countMap[u.problem_id] || 0) + 1;
  });

  // Check user upvotes
  const { data: { user } } = await supabase.auth.getUser();
  let userUpvotes = new Set<string>();
  if (user) {
    const { data: myUpvotes } = await supabase
      .from("problem_upvotes")
      .select("problem_id")
      .eq("user_id", user.id);
    myUpvotes?.forEach((u) => userUpvotes.add(u.problem_id));
  }

  return (problems || []).map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    severity: p.severity,
    status: p.status,
    upvotes: countMap[p.id] || 0,
    hasUpvoted: userUpvotes.has(p.id),
    lat: p.lat,
    lng: p.lng,
    address: p.address,
    createdAt: p.created_at,
    imageUrl: p.image_url,
    reporterName: p.reporter_name,
  }));
}

export function useProblems() {
  return useQuery({
    queryKey: ["problems"],
    queryFn: fetchProblems,
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ProblemStatus }) => {
      const { error } = await supabase
        .from("problems")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["problems"] }),
  });
}

export function useToggleUpvote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ problemId, hasUpvoted }: { problemId: string; hasUpvoted: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Login necessário para votar");

      if (hasUpvoted) {
        const { error } = await supabase
          .from("problem_upvotes")
          .delete()
          .eq("problem_id", problemId)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("problem_upvotes")
          .insert({ problem_id: problemId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["problems"] }),
  });
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
}

export function useCreateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewProblemInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("problems")
        .insert({
          title: input.title,
          description: input.description,
          category: input.category,
          severity: input.severity,
          address: input.address,
          lat: input.lat,
          lng: input.lng,
          reporter_name: input.reporterName,
          image_url: input.imageUrl ?? null,
          user_id: user?.id ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["problems"] }),
  });
}
