-- ============ RESTRINGIR ACESSO DE GESTORES POR CIDADE ============
-- Gestores só podem ver problemas da cidade cadastrada no perfil deles

-- 1. Remover a política antiga que dá acesso total a gestores
DROP POLICY IF EXISTS "Public problems viewable by all" ON public.problems;

-- 2. Criar nova política que filtra gestores pela cidade do perfil
-- Cidadãos veem problemas públicos OU problemas da cidade deles
-- Gestores veem problemas públicos OU problemas da cidade cadastrada no perfil
-- Administradores veem tudo
CREATE POLICY "Problems viewable by role and city" ON public.problems FOR SELECT
  USING (
    -- Problemas públicos são visíveis por todos
    is_public = true
    -- Usuários autenticados veem problemas da cidade deles
    OR (auth.uid() IS NOT NULL AND city = public.get_user_city(auth.uid()))
    -- Administradores veem tudo
    OR public.has_role(auth.uid(), 'admin')
    -- Gestores veem problemas da cidade cadastrada no perfil
    OR (
      public.has_role(auth.uid(), 'manager')
      AND city = public.get_user_city(auth.uid())
    )
  );

-- 3. Atualizar a política de UPDATE para gestores editarem apenas problemas da cidade deles
DROP POLICY IF EXISTS "Managers and admins update problems" ON public.problems;

CREATE POLICY "Managers and admins update problems in their city" ON public.problems FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin')
    OR (
      public.has_role(auth.uid(), 'manager')
      AND city = public.get_user_city(auth.uid())
    )
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR (
      public.has_role(auth.uid(), 'manager')
      AND city = public.get_user_city(auth.uid())
    )
  );

-- 4. Garantir que ao criar problema, a cidade seja preenchida automaticamente
-- O trigger set_problem_city já faz isso, mas vamos melhorar para usar a cidade do perfil
CREATE OR REPLACE FUNCTION public.set_problem_city()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_city TEXT;
BEGIN
  -- Pegar a cidade do perfil do usuário
  user_city := public.get_user_city(NEW.user_id);

  -- Se o usuário tem perfil, usar a cidade dele
  IF NEW.user_id IS NOT NULL AND user_city IS NOT NULL THEN
    NEW.city := user_city;
  -- Caso contrário, manter o valor fornecido ou usar padrão
  ELSIF NEW.city IS NULL OR NEW.city = '' THEN
    NEW.city := 'fortaleza';
  END IF;

  RETURN NEW;
END;
$$;