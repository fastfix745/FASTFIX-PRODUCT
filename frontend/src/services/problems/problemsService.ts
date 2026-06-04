import { supabase } from "@/services/supabase/client";
import type { NewProblemInput, Problem, ProblemStatus } from "@/types/problem";

const normalizeCity = (city: string) => city.trim().toLowerCase();

export async function fetchProblems(city?: string): Promise<Problem[]> {
  let query = supabase.from("problems").select("*").order("created_at", { ascending: false });

  // Só filtra se city for uma string válida (não objeto, não vazio)
  if (city && typeof city === "string" && city.trim().length > 0) {
    const normalizedCity = normalizeCity(city);
    console.log("Filtrando problemas pela cidade:", normalizedCity);
    query = query.eq("city", normalizedCity);
  } else {
    console.log("Buscando todos os problemas (sem filtro de cidade)");
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
  }));
}

export async function updateProblemStatus(id: string, status: ProblemStatus): Promise<void> {
  const { error } = await supabase.from("problems").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateProblemPublic(id: string, isPublic: boolean): Promise<void> {
  const { error } = await supabase.from("problems").update({ is_public: isPublic }).eq("id", id);
  if (error) throw error;
}

export async function updateProblemMedia(
  id: string,
  before?: string[],
  after?: string[],
): Promise<void> {
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
    ...(input.city ? { city: normalizeCity(input.city) } : {}),
  }).select().single();
  if (error) {
    console.error("Erro ao criar problema:", error);
    throw error;
  }
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
