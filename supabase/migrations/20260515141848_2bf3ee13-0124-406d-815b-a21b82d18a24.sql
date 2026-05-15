
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('citizen', 'manager', 'admin');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  city TEXT NOT NULL DEFAULT 'Fortaleza',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.get_user_city(_user_id uuid)
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT city FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ PROBLEMS UPDATES ============
ALTER TABLE public.problems
  ADD COLUMN city TEXT NOT NULL DEFAULT 'Fortaleza',
  ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN before_images TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN after_images TEXT[] NOT NULL DEFAULT '{}';

-- Replace old SELECT policy with city-based filter
DROP POLICY IF EXISTS "Anyone can view problems" ON public.problems;
DROP POLICY IF EXISTS "Authenticated users can update problems" ON public.problems;

CREATE POLICY "Public problems viewable by all" ON public.problems FOR SELECT
  USING (
    is_public = true
    OR (auth.uid() IS NOT NULL AND city = public.get_user_city(auth.uid()))
    OR public.has_role(auth.uid(), 'manager')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Managers and admins update problems" ON public.problems FOR UPDATE
  USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin'));

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System inserts notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- ============ TRIGGERS ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, city)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)),
    COALESCE(NEW.raw_user_meta_data->>'city', 'Fortaleza')
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'citizen');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.notify_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, body, link)
    VALUES (
      NEW.user_id,
      'Status atualizado: ' || NEW.title,
      'Sua denúncia agora está como "' || NEW.status || '".',
      '/app'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER problems_status_notify AFTER UPDATE ON public.problems
  FOR EACH ROW EXECUTE FUNCTION public.notify_status_change();

CREATE OR REPLACE FUNCTION public.notify_new_upvote()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  owner_id UUID;
  prob_title TEXT;
BEGIN
  SELECT user_id, title INTO owner_id, prob_title FROM public.problems WHERE id = NEW.problem_id;
  IF owner_id IS NOT NULL AND owner_id <> NEW.user_id THEN
    INSERT INTO public.notifications (user_id, title, body, link)
    VALUES (owner_id, 'Sua denúncia recebeu apoio!', '"' || prob_title || '" recebeu um novo voto.', '/app');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER upvotes_notify AFTER INSERT ON public.problem_upvotes
  FOR EACH ROW EXECUTE FUNCTION public.notify_new_upvote();

-- Auto-fill city on problem insert from authenticated user's profile
CREATE OR REPLACE FUNCTION public.set_problem_city()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.user_id IS NOT NULL AND (NEW.city IS NULL OR NEW.city = 'Fortaleza') THEN
    NEW.city := COALESCE(public.get_user_city(NEW.user_id), NEW.city, 'Fortaleza');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER problems_set_city BEFORE INSERT ON public.problems
  FOR EACH ROW EXECUTE FUNCTION public.set_problem_city();

-- ============ STORAGE ============
INSERT INTO storage.buckets (id, name, public) VALUES ('problem-media', 'problem-media', true);

CREATE POLICY "Public can view problem media" ON storage.objects FOR SELECT USING (bucket_id = 'problem-media');
CREATE POLICY "Authenticated upload problem media" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'problem-media' AND auth.uid() IS NOT NULL);
CREATE POLICY "Managers update problem media" ON storage.objects FOR UPDATE
  USING (bucket_id = 'problem-media' AND (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Managers delete problem media" ON storage.objects FOR DELETE
  USING (bucket_id = 'problem-media' AND (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'admin')));
