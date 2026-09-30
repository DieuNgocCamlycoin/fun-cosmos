-- Moderated community feedback for published FUN COSMOS ideas.
CREATE TABLE public.idea_community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  author_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT '',
  kind text NOT NULL CHECK (kind IN ('feedback','experience')),
  body text NOT NULL CHECK (char_length(trim(body)) BETWEEN 3 AND 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idea_comments_idea_status_time ON public.idea_community_comments(idea_id,status,created_at DESC);
CREATE INDEX idea_comments_moderation ON public.idea_community_comments(status,created_at DESC);
ALTER TABLE public.idea_community_comments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.idea_community_comments FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.idea_community_comments TO service_role;

CREATE TABLE public.idea_community_likes (
  idea_id uuid NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (idea_id,user_id)
);
CREATE INDEX idea_likes_by_idea ON public.idea_community_likes(idea_id);
ALTER TABLE public.idea_community_likes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.idea_community_likes FROM PUBLIC,anon,authenticated;
GRANT ALL ON public.idea_community_likes TO service_role;
