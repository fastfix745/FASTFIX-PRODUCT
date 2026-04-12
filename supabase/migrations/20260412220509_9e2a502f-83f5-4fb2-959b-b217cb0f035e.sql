
-- Drop the restrictive update policy
DROP POLICY "Users can update their own problems" ON public.problems;

-- Allow any authenticated user to update problem status (gestor access)
CREATE POLICY "Authenticated users can update problems" 
ON public.problems 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);
