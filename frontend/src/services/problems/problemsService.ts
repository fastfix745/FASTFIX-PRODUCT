import { supabase } from "@/services/supabase/client";
import type { NewProblemInput, Problem, ProblemStatus } from "@/types/problem";

export async function fetchProblems(city?: string): Promise<Problem[]> {
  let query = supabase
    .from("problems")
    .select("*")
    .order("created_at", { ascending: false });

  if (city) {
    query = query.eq("city", city);
  }

  const { data: problems, error } = await query;
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
    response: p.response ?? null,
    responseCreatedAt: p.response_created_at ?? null,
  }));
}

export async function updateProblemResponse(id: string, response: string): Promise<void> {
  const { error } = await supabase
    .from("problems")
    .update({ response, response_created_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function updateProblemStatus(id: string, status: ProblemStatus): Promise<void> {
  const { error } = await supabase.from("problems").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateProblemPublic(id: string, isPublic: boolean): Promise<void> {
  const { error } = await supabase.from("problems").update({ is_public: isPublic }).eq("id", id);
  if (error) throw error;
}

export async function updateProblemMedia(id: string, before?: string[], after?: string[]): Promise<void> {
  const upd: { before_images?: string[]; after_images?: string[] } = {};
  if (before) upd.before_images = before;
  if (after) upd.after_images = after;
  const { error } = await supabase.from("problems").update(upd).eq("id", id);
  if (error) throw error;
}

export async function toggleProblemUpvote(problemId: string, hasUpvoted: boolean): Promise<void> {
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
}

export async function createProblem(input: NewProblemInput) {
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
}

export async function uploadProblemMedia(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("problem-media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("problem-media").getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProblem(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Login necessário para excluir");

  // Verifica se o usuário é o criador do problema
  const { data: problem, error: fetchError } = await supabase
    .from("problems")
    .select("user_id")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;

  if (problem.user_id !== user.id) {
    throw new Error("Você só pode excluir suas próprias denúncias");
  }

  const { error } = await supabase.from("problems").delete().eq("id", id);
  if (error) throw error;
}