-- ============ ADICIONAR COLUNA DE RESPOSTA AOS PROBLEMAS ============
-- Permite que gestores e admins enviem respostas aos cidadãos

ALTER TABLE public.problems
ADD COLUMN IF NOT EXISTS response TEXT,
ADD COLUMN IF NOT EXISTS response_created_at TIMESTAMPTZ;

-- Atualizar política para permitir que managers e admins vejam a coluna response
-- A policy já permite SELECT para managers e admins, então não precisa modificar

-- Criar trigger para notificar quando uma resposta for enviada
CREATE OR REPLACE FUNCTION public.notify_response()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.response IS DISTINCT FROM OLD.response AND NEW.response IS NOT NULL AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, body, link)
    VALUES (
      NEW.user_id,
      'Você recebeu uma resposta!',
      'Sua denúncia "' || NEW.title || '" recebeu uma resposta do gestor.',
      '/app'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS problems_response_notify ON public.problems;
CREATE TRIGGER problems_response_notify AFTER UPDATE ON public.problems
  FOR EACH ROW EXECUTE FUNCTION public.notify_response();