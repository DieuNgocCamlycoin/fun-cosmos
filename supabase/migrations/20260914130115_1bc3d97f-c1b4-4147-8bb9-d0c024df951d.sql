REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.next_idea_public_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_idea_state() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_idea_public_code() TO service_role;
REVOKE ALL ON SEQUENCE public.idea_public_code_seq FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SEQUENCE public.idea_public_code_seq TO service_role;