-- One participation: idea card, story, public posts and FUN.Rich reward identity.
-- Apply after the story submission transaction migration.
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS fun_rich_post_url text NOT NULL DEFAULT '';
ALTER TABLE public.ideas ADD CONSTRAINT ideas_fun_rich_post_url_len CHECK (char_length(fun_rich_post_url) <= 500);
-- One creator may earn rewards for several distinct ideas with the same wallet.
DROP INDEX IF EXISTS public.fun_cosmos_one_active_reward_per_wallet_campaign;

-- Phase 1.1: additive server-only transaction. Requires the three story columns
-- already present in ideas. Does not rewrite old rows, rewards, policies or grants.
CREATE OR REPLACE FUNCTION public.submit_cosmos_story(p_idea_id uuid, p_creator_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  i public.ideas%ROWTYPE;
  d public.idea_private_details%ROWTYPE;
  participant uuid;
  entry uuid;
  reward_id uuid;
  code text;
  reasons text[] := '{}';
  previous_status text;
  campaign constant text := 'fun-cosmos-99999-camly-v1';
BEGIN
  SELECT * INTO i FROM public.ideas WHERE id = p_idea_id AND creator_user_id = p_creator_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Idea not found'; END IF;
  -- A retry after a lost response returns the same result, without another reward.
  IF i.status NOT IN ('draft', 'needs_revision') THEN
    IF i.public_code IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.fun_cosmos_submissions WHERE public_submission_code = i.public_code AND user_id = p_creator_id
    ) THEN
      RETURN jsonb_build_object('id', i.id, 'code', i.public_code, 'submittedAt', i.submitted_at);
    END IF;
    RAISE EXCEPTION 'Idea is not editable';
  END IF;
  SELECT * INTO d FROM public.idea_private_details WHERE idea_id = i.id FOR UPDATE;
  IF NOT FOUND OR d.consent_accuracy IS DISTINCT FROM true THEN RAISE EXCEPTION 'Verification required'; END IF;
  IF char_length(trim(coalesce(i.story, ''))) < 1000 OR char_length(coalesce(i.story, '')) > 30000
     OR coalesce(i.facebook_post_url, '') !~ '^https://(www\.|m\.|web\.|business\.)?facebook\.com/.+'
     OR coalesce(i.fun_rich_post_url, '') !~ '^https://(www\.)?fun\.rich/.+'
     OR char_length(trim(i.title)) < 3 OR char_length(trim(i.summary)) < 10
     OR trim(d.email) = ''
     OR trim(d.fun_rich_url) = '' OR char_length(trim(d.recipient_wallet)) < 20 THEN
    RAISE EXCEPTION 'Incomplete submission';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext(lower(trim(d.email))));
  SELECT coalesce(array_agg(DISTINCT reason), '{}') INTO reasons FROM (
    SELECT unnest(ARRAY[
      CASE WHEN email_normalized = lower(trim(d.email)) THEN 'email' END,
      CASE WHEN wallet_normalized = lower(trim(d.recipient_wallet)) THEN 'wallet' END
    ]) AS reason
    FROM public.fun_cosmos_submissions WHERE campaign_code = campaign AND user_id <> p_creator_id
  ) matches WHERE reason IS NOT NULL;
  code := coalesce(i.public_code, public.next_idea_public_code());
  -- Revisions reuse their existing participation and reward records.
  SELECT id INTO entry FROM public.fun_cosmos_submissions WHERE public_submission_code = code AND user_id = p_creator_id;
  IF entry IS NULL THEN
    INSERT INTO public.fun_cosmos_participants(user_id) VALUES (p_creator_id) RETURNING id INTO participant;
    INSERT INTO public.fun_cosmos_submissions (
      public_submission_code, participant_id, user_id, campaign_code, display_name,
      email, email_normalized, facebook_url, facebook_normalized, telegram, telegram_normalized,
      fun_rich_url, wallet_address, wallet_normalized, character, dream, gameplay, angel_ai_support,
      desired_reward_or_progress, world_change, real_world_connection,
      consent_accuracy, consent_public, duplicate_flag, duplicate_reasons
    ) VALUES (
      code, participant, p_creator_id, campaign, i.creator_display_name_snapshot,
      d.email, lower(trim(d.email)), i.facebook_post_url, lower(rtrim(trim(i.facebook_post_url), '/')),
      '', '',
      d.fun_rich_url, d.recipient_wallet, lower(trim(d.recipient_wallet)),
      concat_ws(' — ', nullif(i.character_name, ''), i.character_description), i.dream, i.gameplay, i.angel_ai,
      i.reward, i.world_change, i.real_world_connection,
      true, d.consent_public, cardinality(reasons) > 0, reasons
    ) RETURNING id INTO entry;
    INSERT INTO public.fun_cosmos_rewards (
      submission_id, participant_id, campaign_code, wallet_address, wallet_normalized
    ) VALUES (entry, participant, campaign, d.recipient_wallet, lower(trim(d.recipient_wallet))) RETURNING id INTO reward_id;
  ELSE
    -- Preserve approved/payment records. Wallet changes need an admin review.
    IF EXISTS (SELECT 1 FROM public.fun_cosmos_rewards WHERE submission_id = entry AND wallet_normalized <> lower(trim(d.recipient_wallet))) THEN
      RAISE EXCEPTION 'Wallet change requires admin review';
    END IF;
    UPDATE public.fun_cosmos_submissions SET
      character = concat_ws(' — ', nullif(i.character_name, ''), i.character_description),
      dream = i.dream, gameplay = i.gameplay, angel_ai_support = i.angel_ai,
      desired_reward_or_progress = i.reward, world_change = i.world_change,
      real_world_connection = i.real_world_connection, consent_public = d.consent_public,
      facebook_url = i.facebook_post_url, facebook_normalized = lower(rtrim(trim(i.facebook_post_url), '/')),
      telegram = '', telegram_normalized = '',
      fun_rich_url = d.fun_rich_url,
      status = 'submitted', participant_message = NULL
    WHERE id = entry;
    SELECT id INTO reward_id FROM public.fun_cosmos_rewards WHERE submission_id = entry;
  END IF;
  previous_status := i.status::text;
  UPDATE public.ideas SET public_code = code, status = 'submitted', submitted_at = now(),
    duplicate_flag = cardinality(reasons) > 0, duplicate_reasons = reasons, creator_message = NULL
  WHERE id = i.id;
  INSERT INTO public.idea_audit_events(idea_id, actor_user_id, actor_type, action, old_status, new_status)
    VALUES (i.id, p_creator_id, 'creator', 'idea_submitted', previous_status, 'submitted');
  INSERT INTO public.fun_cosmos_audit_events(submission_id, reward_id, actor_user_id, actor_type, action, new_status)
    VALUES (entry, reward_id, p_creator_id, 'creator', 'story_submission_created', 'submitted');
  RETURN jsonb_build_object('id', i.id, 'code', code, 'submittedAt', now());
END;
$$;
REVOKE ALL ON FUNCTION public.submit_cosmos_story(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_cosmos_story(uuid, uuid) TO service_role;

-- Admin reward decisions stay consistent in the idea and participation records.
CREATE OR REPLACE FUNCTION public.update_cosmos_idea_reward(
  p_idea_id uuid, p_status public.idea_reward_status, p_amount numeric,
  p_reference text, p_admin_id uuid
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_submission_id uuid;
  mapped_status public.fun_cosmos_reward_status;
BEGIN
  IF p_amount < 99999 OR p_amount > 1000000000000 OR p_amount <> trunc(p_amount) THEN
    RAISE EXCEPTION 'Invalid reward amount';
  END IF;
  IF p_status = 'rewarded' AND char_length(trim(coalesce(p_reference,''))) < 6 THEN
    RAISE EXCEPTION 'Reward receipt required';
  END IF;
  UPDATE public.ideas SET reward_status = p_status, reward_amount = p_amount,
    reward_tx_hash = nullif(trim(p_reference),''),
    rewarded_at = CASE WHEN p_status = 'rewarded' THEN now() ELSE NULL END,
    rewarded_by = CASE WHEN p_status = 'rewarded' THEN p_admin_id ELSE NULL END
  WHERE id = p_idea_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Idea not found'; END IF;
  SELECT s.id INTO v_submission_id FROM public.fun_cosmos_submissions s
    JOIN public.ideas i ON i.public_code = s.public_submission_code
    WHERE i.id = p_idea_id;
  IF v_submission_id IS NULL THEN RETURN; END IF;
  mapped_status := CASE p_status
    WHEN 'not_selected' THEN 'cancelled'::public.fun_cosmos_reward_status
    WHEN 'eligible' THEN 'eligible'::public.fun_cosmos_reward_status
    WHEN 'approved' THEN 'approved'::public.fun_cosmos_reward_status
    WHEN 'reward_pending' THEN 'processing'::public.fun_cosmos_reward_status
    WHEN 'rewarded' THEN 'sent'::public.fun_cosmos_reward_status
    ELSE 'failed'::public.fun_cosmos_reward_status
  END;
  UPDATE public.fun_cosmos_rewards SET status = mapped_status, reward_amount = p_amount,
    tx_hash = nullif(trim(p_reference),''),
    approved_by = CASE WHEN mapped_status IN ('approved','processing','sent') THEN p_admin_id ELSE NULL END,
    approved_at = CASE WHEN mapped_status IN ('approved','processing','sent') THEN now() ELSE NULL END,
    sent_at = CASE WHEN mapped_status = 'sent' THEN now() ELSE NULL END
  WHERE submission_id = v_submission_id;
END;
$$;
REVOKE ALL ON FUNCTION public.update_cosmos_idea_reward(uuid,public.idea_reward_status,numeric,text,uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_cosmos_idea_reward(uuid,public.idea_reward_status,numeric,text,uuid) TO service_role;
