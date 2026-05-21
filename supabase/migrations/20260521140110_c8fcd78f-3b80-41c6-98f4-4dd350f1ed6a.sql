CREATE TABLE public.problem_severity_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id UUID NOT NULL,
  user_id UUID NOT NULL,
  severity public.problem_severity NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (problem_id, user_id)
);

CREATE INDEX idx_psv_problem ON public.problem_severity_votes(problem_id);

ALTER TABLE public.problem_severity_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view severity votes"
ON public.problem_severity_votes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can cast severity vote"
ON public.problem_severity_votes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own severity vote"
ON public.problem_severity_votes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own severity vote"
ON public.problem_severity_votes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_psv_updated_at
BEFORE UPDATE ON public.problem_severity_votes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();