-- Ver estrutura da tabela notifications
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

-- Dropar o trigger problemático
DROP TRIGGER IF EXISTS problems_response_notify ON public.problems;

-- Recriar a função sem a coluna problem_id
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

-- Recriar o trigger
CREATE TRIGGER problems_response_notify AFTER UPDATE ON public.problems
  FOR EACH ROW EXECUTE FUNCTION public.notify_response();