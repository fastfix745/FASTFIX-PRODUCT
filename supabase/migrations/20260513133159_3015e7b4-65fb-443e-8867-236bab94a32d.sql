CREATE POLICY "Anonymous users can create problems"
ON public.problems
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);