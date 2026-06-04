# Instruções para aplicar a restrição de cidade para gestores

## Problema
Gestores estavam conseguindo ver problemas de todas as cidades. A regra é que cada gestor deve ver apenas problemas da cidade cadastrada no perfil dele.

## Solução
Uma nova policy RLS foi criada para restringir o acesso.

### Execute as migrations no Supabase (SQL Editor)

**Migration 1 - Restrição por cidade (já aplicada):**
```sql
DROP POLICY IF EXISTS "Public problems viewable by all" ON public.problems;

CREATE POLICY "Problems viewable by role and city" ON public.problems FOR SELECT
  USING (
    is_public = true
    OR (auth.uid() IS NOT NULL AND city = public.get_user_city(auth.uid()))
    OR public.has_role(auth.uid(), 'admin')
    OR (
      public.has_role(auth.uid(), 'manager')
      AND city = public.get_user_city(auth.uid())
    )
  );

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

CREATE OR REPLACE FUNCTION public.set_problem_city()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_city TEXT;
BEGIN
  user_city := public.get_user_city(NEW.user_id);
  IF NEW.user_id IS NOT NULL AND user_city IS NOT NULL THEN
    NEW.city := user_city;
  ELSIF NEW.city IS NULL OR NEW.city = '' THEN
    NEW.city := 'fortaleza';
  END IF;
  RETURN NEW;
END;
$$;
```

**Migration 2 - Normalizar cidades (APLICAR ESTA):**
```sql
-- Normalizar cidade para minúsculas
CREATE OR REPLACE FUNCTION public.get_user_city(_user_id uuid)
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT LOWER(city) FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, city)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)),
    LOWER(COALESCE(NEW.raw_user_meta_data->>'city', 'Fortaleza'))
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'citizen');
  RETURN NEW;
END;
$$;

-- Normalizar dados existentes
UPDATE public.profiles SET city = LOWER(city) WHERE city IS NOT NULL;
UPDATE public.problems SET city = LOWER(city) WHERE city IS NOT NULL;
```

## Como funciona

### Para cidadãos:
- Veem problemas públicos (`is_public = true`)
- Veem problemas da cidade deles (`city = perfil.cidade`)

### Para gestores:
- Veem problemas públicos (`is_public = true`)
- Veem problemas da cidade cadastrada no perfil (`city = perfil.cidade`)
- NÃO veem problemas de outras cidades

### Para administradores:
- Veem todos os problemas (acesso total)

## Frontend

O frontend já está configurado corretamente:
- **GestorDashboard**: Usa `useProblemsByCityQuery(managerCity)` - filtra pela cidade do perfil
- **CitizenApp**: Usa `useProblems()` - o RLS filtra automaticamente no banco

O mapa já centraliza na cidade do usuário com `centerCity={profile?.city}`.