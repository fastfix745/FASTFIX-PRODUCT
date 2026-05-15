import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

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
  city: string;
  isPublic: boolean;
  beforeImages: string[];
  afterImages: string[];
  createdAt: string;
  imageUrl?: string | null;
  reporterName: string;
  userId: string | null;
}

async function fetchProblems(): Promise<Problem[]> {
  const { data: problems, error } = await supabase
    .from("problems")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const { data: upvoteCounts } = await supabase.from("problem_upvotes").select("problem_id");
  const countMap: Record<string, number> = {};
  upvoteCounts?.forEach((u) => { countMap[u.problem_id] = (countMap[u.problem_id] || 0) + 1; });

  const { data: { user } } = await supabase.auth.getUser();
  const userUpvotes = new Set<string>();
  if (user) {
    const { data: my } = await supabase.from("problem_upvotes").select("problem_id").eq("user_id", user.id);
    my?.forEach((u) => userUpvotes.add(u.problem_id));
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
    city: p.city,
    isPublic: p.is_public,
    beforeImages: p.before_images ?? [],
    afterImages: p.after_images ?? [],
    createdAt: p.created_at,
    imageUrl: p.image_url,
    reporterName: p.reporter_name,
    userId: p.user_id,
  }));
}

export function useProblems() {
  return useQuery({ queryKey: ["problems"], queryFn: fetchProblems });
}

export function useUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ProblemStatus }) => {
      const { error } = await supabase.from("problems").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["problems"] }),
  });
}

export function useTogglePublic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isPublic }: { id: string; isPublic: boolean }) => {
      const { error } = await supabase.from("problems").update({ is_public: isPublic }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["problems"] }),
  });
}

export function useUpdateMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, before, after }: { id: string; before?: string[]; after?: string[] }) => {
      const upd: { before_images?: string[]; after_images?: string[] } = {};
      if (before) upd.before_images = before;
      if (after) upd.after_images = after;
      const { error } = await supabase.from("problems").update(upd).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["problems"] }),
  });
}

export function useToggleUpvote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ problemId, hasUpvoted }: { problemId: string; hasUpvoted: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Login necessário para votar");
      if (hasUpvoted) {
        const { error } = await supabase.from("problem_upvotes").delete()
          .eq("problem_id", problemId).eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("problem_upvotes")
          .insert({ problem_id: problemId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["problems"] }),
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
  city?: string;
}

export function useCreateProblem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewProblemInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("problems").insert({
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
        ...(input.city ? { city: input.city } : {}),
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["problems"] }),
  });
}

export async function uploadProblemMedia(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("problem-media").upload(path, file, {
    cacheControl: "3600", upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("problem-media").getPublicUrl(path);
  return data.publicUrl;
}
