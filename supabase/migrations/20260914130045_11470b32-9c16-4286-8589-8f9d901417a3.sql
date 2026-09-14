-- ENUMS
CREATE TYPE public.idea_status AS ENUM ('draft','submitted','under_review','needs_revision','published','selected','in_development','prototype','playtest','implemented','archived');
CREATE TYPE public.idea_reward_status AS ENUM ('not_selected','eligible','approved','reward_pending','rewarded','reward_failed');
CREATE TYPE public.idea_category AS ENUM ('world','gameplay','story','character','art','music','ai','code','green_earth','lovehub','learning','other');

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Người sáng tạo FUN COSMOS',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read display names" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users manage own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'display_name'), ''), NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''), 'Người sáng tạo FUN COSMOS'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PUBLIC CODE SEQUENCE
CREATE SEQUENCE public.idea_public_code_seq START 128;
CREATE OR REPLACE FUNCTION public.next_idea_public_code()
RETURNS text LANGUAGE sql VOLATILE SET search_path = public AS $$
  SELECT 'FC-' || to_char(now() AT TIME ZONE 'UTC', 'YYYY') || '-' || lpad(nextval('public.idea_public_code_seq')::text, 6, '0');
$$;

-- IDEAS (public-safe columns only)
CREATE TABLE public.ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_code text UNIQUE,
  creator_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_display_name_snapshot text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  category public.idea_category NOT NULL DEFAULT 'other',
  cover_image_url text,
  character_name text NOT NULL DEFAULT '',
  character_description text NOT NULL DEFAULT '',
  dream text NOT NULL DEFAULT '',
  gameplay text NOT NULL DEFAULT '',
  angel_ai text NOT NULL DEFAULT '',
  reward text NOT NULL DEFAULT '',
  world_change text NOT NULL DEFAULT '',
  real_world_connection text NOT NULL DEFAULT '',
  status public.idea_status NOT NULL DEFAULT 'draft',
  admin_note text,
  creator_message text,
  duplicate_flag boolean NOT NULL DEFAULT false,
  duplicate_reasons text[] NOT NULL DEFAULT '{}',
  reward_status public.idea_reward_status NOT NULL DEFAULT 'not_selected',
  reward_amount numeric NOT NULL DEFAULT 99999,
  reward_token text NOT NULL DEFAULT 'CAMLY',
  reward_chain text NOT NULL DEFAULT 'BNB Smart Chain',
  reward_contract text NOT NULL DEFAULT '0x0910320181889fefDE0BB1Ca63962b0A8882e413',
  reward_tx_hash text,
  rewarded_at timestamptz,
  rewarded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  published_at timestamptz,
  CONSTRAINT ideas_title_len CHECK (char_length(title) <= 140),
  CONSTRAINT ideas_summary_len CHECK (char_length(summary) <= 500)
);
CREATE INDEX ideas_creator_idx ON public.ideas (creator_user_id, updated_at DESC);
CREATE INDEX ideas_status_idx ON public.ideas (status, published_at DESC);
CREATE INDEX ideas_category_idx ON public.ideas (category);
CREATE INDEX ideas_public_code_idx ON public.ideas (public_code);

GRANT SELECT ON public.ideas TO anon;
GRANT SELECT, INSERT, UPDATE ON public.ideas TO authenticated;
GRANT ALL ON public.ideas TO service_role;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published ideas" ON public.ideas FOR SELECT TO anon, authenticated
  USING (status IN ('published','selected','in_development','prototype','playtest','implemented'));
CREATE POLICY "Creators read own ideas" ON public.ideas FOR SELECT TO authenticated USING (auth.uid() = creator_user_id);
CREATE POLICY "Admins read all ideas" ON public.ideas FOR SELECT TO authenticated USING (app_private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Creators create own ideas" ON public.ideas FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = creator_user_id AND status = 'draft' AND reward_status = 'not_selected');
CREATE POLICY "Creators edit own editable ideas" ON public.ideas FOR UPDATE TO authenticated
  USING (auth.uid() = creator_user_id AND status IN ('draft','needs_revision'))
  WITH CHECK (auth.uid() = creator_user_id);
CREATE POLICY "Admins update ideas" ON public.ideas FOR UPDATE TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_ideas_updated_at BEFORE UPDATE ON public.ideas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Guard: non-admin callers may never change moderation/reward state
CREATE OR REPLACE FUNCTION public.guard_idea_state()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT app_private.has_role(auth.uid(), 'admin'::app_role) THEN
    IF NEW.status IS DISTINCT FROM OLD.status
       OR NEW.reward_status IS DISTINCT FROM OLD.reward_status
       OR NEW.reward_tx_hash IS DISTINCT FROM OLD.reward_tx_hash
       OR NEW.rewarded_at IS DISTINCT FROM OLD.rewarded_at
       OR NEW.rewarded_by IS DISTINCT FROM OLD.rewarded_by
       OR NEW.public_code IS DISTINCT FROM OLD.public_code
       OR NEW.creator_user_id IS DISTINCT FROM OLD.creator_user_id
       OR NEW.admin_note IS DISTINCT FROM OLD.admin_note
       OR NEW.published_at IS DISTINCT FROM OLD.published_at THEN
      RAISE EXCEPTION 'Không thể thay đổi trạng thái duyệt hoặc phần thưởng của ý tưởng';
    END IF;
  END IF;
  IF NEW.reward_status = 'rewarded' AND (NEW.reward_tx_hash IS NULL OR char_length(trim(NEW.reward_tx_hash)) < 6) THEN
    RAISE EXCEPTION 'Cần mã giao dịch thật trước khi đánh dấu đã trao thưởng';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER guard_ideas_state BEFORE UPDATE ON public.ideas FOR EACH ROW EXECUTE FUNCTION public.guard_idea_state();

-- TAGS
CREATE TABLE public.idea_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (idea_id, tag),
  CONSTRAINT idea_tags_len CHECK (char_length(tag) BETWEEN 1 AND 40)
);
CREATE INDEX idea_tags_tag_idx ON public.idea_tags (tag);
GRANT SELECT ON public.idea_tags TO anon;
GRANT SELECT, INSERT, DELETE ON public.idea_tags TO authenticated;
GRANT ALL ON public.idea_tags TO service_role;
ALTER TABLE public.idea_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read tags of visible ideas" ON public.idea_tags FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.ideas i WHERE i.id = idea_id AND (i.status IN ('published','selected','in_development','prototype','playtest','implemented') OR i.creator_user_id = auth.uid())));
CREATE POLICY "Creators manage own tags" ON public.idea_tags FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.ideas i WHERE i.id = idea_id AND i.creator_user_id = auth.uid() AND i.status IN ('draft','needs_revision')));
CREATE POLICY "Creators delete own tags" ON public.idea_tags FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.ideas i WHERE i.id = idea_id AND i.creator_user_id = auth.uid() AND i.status IN ('draft','needs_revision')));

-- PRIVATE DETAILS (never public)
CREATE TABLE public.idea_private_details (
  idea_id uuid PRIMARY KEY REFERENCES public.ideas(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  facebook_url text NOT NULL DEFAULT '',
  telegram text NOT NULL DEFAULT '',
  fun_rich_url text NOT NULL DEFAULT '',
  recipient_wallet text NOT NULL DEFAULT '',
  consent_accuracy boolean NOT NULL DEFAULT false,
  consent_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.idea_private_details TO authenticated;
GRANT ALL ON public.idea_private_details TO service_role;
ALTER TABLE public.idea_private_details ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators read own details" ON public.idea_private_details FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.ideas i WHERE i.id = idea_id AND i.creator_user_id = auth.uid()));
CREATE POLICY "Admins read details" ON public.idea_private_details FOR SELECT TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Creators write own details" ON public.idea_private_details FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.ideas i WHERE i.id = idea_id AND i.creator_user_id = auth.uid()));
CREATE POLICY "Creators update own details" ON public.idea_private_details FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.ideas i WHERE i.id = idea_id AND i.creator_user_id = auth.uid() AND i.status IN ('draft','needs_revision')))
  WITH CHECK (EXISTS (SELECT 1 FROM public.ideas i WHERE i.id = idea_id AND i.creator_user_id = auth.uid()));
CREATE TRIGGER set_idea_private_details_updated_at BEFORE UPDATE ON public.idea_private_details FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- AUDIT for ideas
CREATE TABLE public.idea_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES public.ideas(id) ON DELETE CASCADE,
  actor_user_id uuid,
  actor_type text NOT NULL,
  action text NOT NULL,
  old_status text,
  new_status text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.idea_audit_events TO authenticated;
GRANT ALL ON public.idea_audit_events TO service_role;
ALTER TABLE public.idea_audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read idea audit" ON public.idea_audit_events FOR SELECT TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::app_role));

-- Reward rule lives on rewards per idea, not per wallet: drop the one-reward-per-wallet guard
DROP INDEX IF EXISTS public.fun_cosmos_rewards_wallet_campaign_unique;