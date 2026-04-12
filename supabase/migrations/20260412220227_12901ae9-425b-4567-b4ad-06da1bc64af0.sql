
-- Create enum types
CREATE TYPE public.problem_category AS ENUM ('buraco', 'iluminacao', 'calcada', 'saneamento', 'area_verde', 'outro');
CREATE TYPE public.problem_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE public.problem_status AS ENUM ('pending', 'in_progress', 'resolved');

-- Create problems table
CREATE TABLE public.problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category public.problem_category NOT NULL DEFAULT 'outro',
  severity public.problem_severity NOT NULL DEFAULT 'medium',
  status public.problem_status NOT NULL DEFAULT 'pending',
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  reporter_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create upvotes table
CREATE TABLE public.problem_upvotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (problem_id, user_id)
);

-- Enable RLS
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_upvotes ENABLE ROW LEVEL SECURITY;

-- Problems policies
CREATE POLICY "Anyone can view problems" ON public.problems FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create problems" ON public.problems FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own problems" ON public.problems FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own problems" ON public.problems FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Upvotes policies
CREATE POLICY "Anyone can view upvotes" ON public.problem_upvotes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upvote" ON public.problem_upvotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their own upvote" ON public.problem_upvotes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_problems_updated_at
  BEFORE UPDATE ON public.problems
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with mock data
INSERT INTO public.problems (title, description, category, severity, status, address, lat, lng, reporter_name, created_at) VALUES
  ('Buraco enorme na Av. Beira Mar', 'Buraco de quase 1 metro na pista principal, causando acidentes.', 'buraco', 'critical', 'pending', 'Av. Beira Mar, 120 - Meireles, Fortaleza', -3.7227, -38.5270, 'Ricardo S.', '2026-03-20'),
  ('Poste sem iluminação na Rua 24 de Maio', 'Trecho de 200m completamente escuro à noite, gerando insegurança.', 'iluminacao', 'high', 'in_progress', 'Rua 24 de Maio, 500 - Centro, Fortaleza', -3.7172, -38.5433, 'Beatriz M.', '2026-03-18'),
  ('Calçada quebrada na Praça do Ferreira', 'Calçada com diversos buracos, idosos já caíram no local.', 'calcada', 'medium', 'pending', 'Praça do Ferreira - Centro, Juazeiro do Norte', -7.2131, -39.3266, 'Jorge A.', '2026-03-22'),
  ('Esgoto a céu aberto no Bairro Aldeota', 'Vazamento de esgoto na esquina, mau cheiro e risco de doenças.', 'saneamento', 'critical', 'pending', 'Rua Torres Câmara, 45 - Aldeota, Fortaleza', -3.7340, -38.5090, 'Maria L.', '2026-03-15'),
  ('Praça degradada sem manutenção', 'Brinquedos quebrados, mato alto e bancos destruídos.', 'area_verde', 'low', 'resolved', 'Praça da Sé - Centro, Sobral', -3.6910, -40.3500, 'Ana C.', '2026-03-10');
