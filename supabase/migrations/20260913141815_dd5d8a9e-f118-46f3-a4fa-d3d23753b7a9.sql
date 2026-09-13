CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TYPE public.fun_cosmos_submission_status AS ENUM ('submitted','under_review','needs_revision','approved','rejected');
CREATE TYPE public.fun_cosmos_reward_status AS ENUM ('pending','eligible','approved','processing','sent','failed','cancelled');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

CREATE TABLE public.fun_cosmos_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  fun_id text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.fun_cosmos_participants TO service_role;
GRANT SELECT ON public.fun_cosmos_participants TO authenticated;
ALTER TABLE public.fun_cosmos_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read participants"
ON public.fun_cosmos_participants FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_fun_cosmos_participants_updated_at
BEFORE UPDATE ON public.fun_cosmos_participants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fun_cosmos_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_submission_code text UNIQUE NOT NULL,
  participant_id uuid NOT NULL REFERENCES public.fun_cosmos_participants(id) ON DELETE RESTRICT,
  user_id uuid NULL,
  fun_id text NULL,
  campaign_code text NOT NULL DEFAULT 'fun-cosmos-99999-camly-v1',
  display_name text NOT NULL,
  email text NOT NULL,
  email_normalized text NOT NULL,
  facebook_url text NOT NULL,
  facebook_normalized text NOT NULL,
  telegram text NOT NULL,
  telegram_normalized text NOT NULL,
  fun_rich_url text NULL,
  wallet_address text NOT NULL,
  wallet_normalized text NOT NULL,
  character text NOT NULL,
  dream text NOT NULL,
  gameplay text NOT NULL,
  angel_ai_support text NOT NULL,
  desired_reward_or_progress text NOT NULL,
  world_change text NOT NULL,
  real_world_connection text NOT NULL,
  consent_accuracy boolean NOT NULL,
  consent_public boolean NOT NULL DEFAULT false,
  status public.fun_cosmos_submission_status NOT NULL DEFAULT 'submitted',
  duplicate_flag boolean NOT NULL DEFAULT false,
  duplicate_reasons text[] NOT NULL DEFAULT '{}',
  admin_note text NULL,
  participant_message text NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.fun_cosmos_submissions TO service_role;
GRANT SELECT ON public.fun_cosmos_submissions TO authenticated;
ALTER TABLE public.fun_cosmos_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read submissions"
ON public.fun_cosmos_submissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX fun_cosmos_submissions_campaign_status_idx ON public.fun_cosmos_submissions(campaign_code, status, submitted_at DESC);
CREATE INDEX fun_cosmos_submissions_email_idx ON public.fun_cosmos_submissions(email_normalized);
CREATE INDEX fun_cosmos_submissions_facebook_idx ON public.fun_cosmos_submissions(facebook_normalized);
CREATE INDEX fun_cosmos_submissions_telegram_idx ON public.fun_cosmos_submissions(telegram_normalized);
CREATE INDEX fun_cosmos_submissions_wallet_idx ON public.fun_cosmos_submissions(wallet_normalized);
CREATE INDEX fun_cosmos_submissions_participant_idx ON public.fun_cosmos_submissions(participant_id);
CREATE TRIGGER set_fun_cosmos_submissions_updated_at
BEFORE UPDATE ON public.fun_cosmos_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fun_cosmos_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL UNIQUE REFERENCES public.fun_cosmos_submissions(id) ON DELETE RESTRICT,
  participant_id uuid NOT NULL REFERENCES public.fun_cosmos_participants(id) ON DELETE RESTRICT,
  campaign_code text NOT NULL,
  reward_type text NOT NULL DEFAULT 'campaign_participation',
  reward_amount numeric(20,4) NOT NULL DEFAULT 99999,
  token_symbol text NOT NULL DEFAULT 'CAMLY',
  wallet_address text NOT NULL,
  wallet_normalized text NOT NULL,
  status public.fun_cosmos_reward_status NOT NULL DEFAULT 'pending',
  tx_hash text NULL,
  approved_by uuid NULL,
  approved_at timestamptz NULL,
  sent_at timestamptz NULL,
  notes text NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.fun_cosmos_rewards TO service_role;
GRANT SELECT ON public.fun_cosmos_rewards TO authenticated;
ALTER TABLE public.fun_cosmos_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read rewards"
ON public.fun_cosmos_rewards FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX fun_cosmos_rewards_campaign_status_idx ON public.fun_cosmos_rewards(campaign_code, status, updated_at DESC);
CREATE INDEX fun_cosmos_rewards_participant_idx ON public.fun_cosmos_rewards(participant_id);
CREATE UNIQUE INDEX fun_cosmos_one_active_reward_per_wallet_campaign
ON public.fun_cosmos_rewards(campaign_code, wallet_normalized)
WHERE status IN ('approved','processing','sent');
CREATE TRIGGER set_fun_cosmos_rewards_updated_at
BEFORE UPDATE ON public.fun_cosmos_rewards
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fun_cosmos_audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NULL REFERENCES public.fun_cosmos_submissions(id) ON DELETE RESTRICT,
  reward_id uuid NULL REFERENCES public.fun_cosmos_rewards(id) ON DELETE RESTRICT,
  actor_user_id uuid NULL,
  actor_type text NOT NULL,
  action text NOT NULL,
  old_status text NULL,
  new_status text NULL,
  note text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.fun_cosmos_audit_events TO service_role;
GRANT SELECT ON public.fun_cosmos_audit_events TO authenticated;
ALTER TABLE public.fun_cosmos_audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read audit events"
ON public.fun_cosmos_audit_events FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX fun_cosmos_audit_submission_idx ON public.fun_cosmos_audit_events(submission_id, created_at DESC);
CREATE INDEX fun_cosmos_audit_reward_idx ON public.fun_cosmos_audit_events(reward_id, created_at DESC);

CREATE TABLE public.fun_cosmos_rate_limits (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action text NOT NULL,
  fingerprint_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.fun_cosmos_rate_limits TO service_role;
ALTER TABLE public.fun_cosmos_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE INDEX fun_cosmos_rate_limits_lookup_idx ON public.fun_cosmos_rate_limits(action, fingerprint_hash, created_at DESC);

CREATE OR REPLACE FUNCTION public.prevent_invalid_reward_transition()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'sent' AND (NEW.tx_hash IS NULL OR length(trim(NEW.tx_hash)) < 6) THEN
    RAISE EXCEPTION 'A real transaction hash is required before marking a reward sent';
  END IF;
  IF NEW.status IN ('approved','processing','sent') AND NEW.approved_by IS NULL THEN
    RAISE EXCEPTION 'An approving admin is required for this reward status';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER validate_fun_cosmos_reward_transition
BEFORE INSERT OR UPDATE ON public.fun_cosmos_rewards
FOR EACH ROW EXECUTE FUNCTION public.prevent_invalid_reward_transition();