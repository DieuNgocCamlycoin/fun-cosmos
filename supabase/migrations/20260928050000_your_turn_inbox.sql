-- A private inbox for public Your Turn sketches. The browser may call only the
-- validated, rate-limited function; it cannot read or write the table directly.
CREATE TABLE IF NOT EXISTS public.cosmos_idea_inbox (
  id text PRIMARY KEY,
  request_id uuid NOT NULL UNIQUE,
  email text NOT NULL,
  locale text NOT NULL CHECK (locale IN ('en', 'vi')),
  fields jsonb NOT NULL,
  consent_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS cosmos_idea_inbox_email_time ON public.cosmos_idea_inbox (email, created_at DESC);
ALTER TABLE public.cosmos_idea_inbox ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.cosmos_idea_inbox FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.cosmos_idea_inbox TO service_role;

CREATE OR REPLACE FUNCTION public.fun_cosmos_idea_inbox_ready()
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = '' AS $$
  SELECT true;
$$;
REVOKE ALL ON FUNCTION public.fun_cosmos_idea_inbox_ready() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.fun_cosmos_idea_inbox_ready() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_fun_cosmos_idea(
  p_fields jsonb, p_email text, p_locale text, p_consent boolean,
  p_request_id uuid, p_website text DEFAULT ''
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  normalized_email text := lower(trim(p_email));
  answer jsonb;
  new_id text;
  existing_id text;
BEGIN
  IF coalesce(p_website, '') <> '' OR p_consent IS DISTINCT FROM true
     OR p_request_id IS NULL OR p_locale IS NULL OR p_locale NOT IN ('en', 'vi')
     OR normalized_email IS NULL
     OR char_length(normalized_email) > 254
     OR normalized_email !~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
     OR jsonb_typeof(p_fields) IS DISTINCT FROM 'array' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'invalid');
  END IF;
  IF jsonb_array_length(p_fields) <> 7 THEN
    RETURN jsonb_build_object('ok', false, 'code', 'invalid');
  END IF;
  FOR answer IN SELECT value FROM jsonb_array_elements(p_fields) AS value LOOP
    IF jsonb_typeof(answer) <> 'string' OR char_length(trim(answer #>> '{}')) > 1000 THEN
      RETURN jsonb_build_object('ok', false, 'code', 'invalid');
    END IF;
  END LOOP;
  IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements_text(p_fields) AS value WHERE length(trim(value)) > 0) THEN
    RETURN jsonb_build_object('ok', false, 'code', 'invalid');
  END IF;

  SELECT id INTO existing_id FROM public.cosmos_idea_inbox WHERE request_id = p_request_id;
  IF existing_id IS NOT NULL THEN
    RETURN jsonb_build_object('ok', true, 'id', existing_id);
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext(normalized_email));
  IF (SELECT count(*) FROM public.cosmos_idea_inbox
      WHERE email = normalized_email AND created_at > now() - interval '24 hours') >= 5 THEN
    RETURN jsonb_build_object('ok', false, 'code', 'rate-limit');
  END IF;
  new_id := 'FC-' || to_char(now() AT TIME ZONE 'UTC', 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  INSERT INTO public.cosmos_idea_inbox (id, request_id, email, locale, fields)
  VALUES (new_id, p_request_id, normalized_email, p_locale, p_fields)
  ON CONFLICT (request_id) DO NOTHING;
  SELECT id INTO existing_id FROM public.cosmos_idea_inbox WHERE request_id = p_request_id;
  RETURN jsonb_build_object('ok', true, 'id', existing_id);
END;
$$;
REVOKE ALL ON FUNCTION public.submit_fun_cosmos_idea(jsonb,text,text,boolean,uuid,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_fun_cosmos_idea(jsonb,text,text,boolean,uuid,text) TO anon, authenticated;
