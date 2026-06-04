-- ============ EMAIL VERIFICATION CODES ============
CREATE TABLE public.email_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (for registration flow)
CREATE POLICY "Anyone can insert verification code"
ON public.email_verification_codes FOR INSERT WITH CHECK (true);

-- Only the user can view their own codes
CREATE POLICY "Users view own verification codes"
ON public.email_verification_codes FOR SELECT USING (auth.uid() = user_id);

-- Only the user can update (mark as used)
CREATE POLICY "Users update own verification codes"
ON public.email_verification_codes FOR UPDATE USING (auth.uid() = user_id);

-- Clean up old unused codes (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_verification_codes()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  DELETE FROM public.email_verification_codes
  WHERE created_at < now() - interval '24 hours';
END;
$$;

-- Function to verify a code
CREATE OR REPLACE FUNCTION public.verify_email_code(p_user_id uuid, p_code text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_record record;
  v_valid boolean := false;
BEGIN
  -- Find matching unused code that hasn't expired
  SELECT * INTO v_record
  FROM public.email_verification_codes
  WHERE user_id = p_user_id
    AND code = p_code
    AND used = false
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_record.id IS NOT NULL THEN
    -- Mark code as used
    UPDATE public.email_verification_codes
    SET used = true
    WHERE id = v_record.id;

    -- Update user's email confirmed status
    UPDATE auth.users
    SET email_confirmed_at = now()
    WHERE id = p_user_id;

    v_valid := true;
  END IF;

  RETURN v_valid;
END;
$$;