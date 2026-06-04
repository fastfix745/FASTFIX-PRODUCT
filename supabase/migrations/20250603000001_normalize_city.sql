-- ============ NORMALIZAR CIDADE PARA MINÚSCULAS ============
-- Garante que todas as cidades sejam armazenadas em minúsculas para consistência

-- 1. Atualizar a função get_user_city para retornar cidade em minúsculas
CREATE OR REPLACE FUNCTION public.get_user_city(_user_id uuid)
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT LOWER(city) FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- 2. Atualizar trigger de novo usuário para normalizar a cidade
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

-- 3. Normalizar cidades existentes nos perfis (para dados antigos)
UPDATE public.profiles SET city = LOWER(city) WHERE city IS NOT NULL;

-- 4. Normalizar cidades existentes nos problemas
UPDATE public.problems SET city = LOWER(city) WHERE city IS NOT NULL;