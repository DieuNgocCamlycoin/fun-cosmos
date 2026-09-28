-- Apply with the Phase 1.1 server code. RLS policies and existing rows stay intact.
-- Public and creator UI use authenticated server functions for private fields.
-- Direct REST access can read only approved-content columns, still subject to RLS.
REVOKE SELECT ON public.ideas FROM anon, authenticated;
-- Remove any older per-column grants too, so private fields cannot bypass the list.
DO $$
DECLARE columns text;
BEGIN
  SELECT string_agg(quote_ident(column_name), ', ') INTO columns
  FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ideas';
  EXECUTE 'REVOKE SELECT (' || columns || ') ON public.ideas FROM anon, authenticated';
END;
$$;
GRANT SELECT (
  id, public_code, title, summary, category, status, creator_display_name_snapshot,
  cover_image_url, character_name, character_description, dream, gameplay, angel_ai,
  reward, world_change, real_world_connection, story, published_at, created_at, updated_at
) ON public.ideas TO anon, authenticated;
-- facebook_post_url, contact data, auth IDs, moderation notes and reward verification
-- are intentionally absent. The server releases a post link only with explicit consent.
