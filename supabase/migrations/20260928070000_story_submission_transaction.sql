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
     OR char_length(trim(i.title)) < 3 OR char_length(trim(i.summary)) < 10
     OR (trim(i.character_name) = '' AND trim(i.character_description) = '')
     OR trim(d.email) = '' OR trim(d.telegram) = '' OR trim(d.facebook_url) = ''
     OR trim(d.fun_rich_url) = '' OR char_length(trim(d.recipient_wallet)) < 20 THEN
    RAISE EXCEPTION 'Incomplete submission';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext(lower(trim(d.email))));
  IF (SELECT count(*) FROM public.fun_cosmos_submissions
      WHERE user_id = p_creator_id AND submitted_at > now() - interval '1 hour') >= 5 THEN
    RAISE EXCEPTION 'Submission rate limit';
  END IF;
  SELECT coalesce(array_agg(DISTINCT reason), '{}') INTO reasons FROM (
    SELECT unnest(ARRAY[
      CASE WHEN email_normalized = lower(trim(d.email)) THEN 'email' END,
      CASE WHEN facebook_normalized = lower(rtrim(trim(d.facebook_url), '/')) THEN 'facebook' END,
      CASE WHEN telegram_normalized = lower(regexp_replace(rtrim(trim(d.telegram), '/'), '^https://t\.me/', '@', 'i')) THEN 'telegram' END,
      CASE WHEN wallet_normalized = lower(trim(d.recipient_wallet)) THEN 'wallet' END
    ]) AS reason
    FROM public.fun_cosmos_submissions WHERE campaign_code = campaign
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
      d.email, lower(trim(d.email)), d.facebook_url, lower(rtrim(trim(d.facebook_url), '/')),
      d.telegram, lower(regexp_replace(rtrim(trim(d.telegram), '/'), '^https://t\.me/', '@', 'i')),
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
      facebook_url = d.facebook_url, facebook_normalized = lower(rtrim(trim(d.facebook_url), '/')),
      telegram = d.telegram, telegram_normalized = lower(regexp_replace(rtrim(trim(d.telegram), '/'), '^https://t\.me/', '@', 'i')),
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
