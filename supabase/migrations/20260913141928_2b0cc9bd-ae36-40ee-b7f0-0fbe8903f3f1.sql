CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
GRANT USAGE ON SCHEMA app_private TO authenticated, service_role;
CREATE OR REPLACE FUNCTION app_private.has_role(_user_id uuid, _role public.app_role)
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
REVOKE ALL ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated, service_role;
DROP POLICY "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);
DROP POLICY "Admins can read participants" ON public.fun_cosmos_participants;
CREATE POLICY "Admins can read participants"
ON public.fun_cosmos_participants FOR SELECT TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'));
DROP POLICY "Admins can read submissions" ON public.fun_cosmos_submissions;
CREATE POLICY "Admins can read submissions"
ON public.fun_cosmos_submissions FOR SELECT TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'));
DROP POLICY "Admins can read rewards" ON public.fun_cosmos_rewards;
CREATE POLICY "Admins can read rewards"
ON public.fun_cosmos_rewards FOR SELECT TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'));
DROP POLICY "Admins can read audit events" ON public.fun_cosmos_audit_events;
CREATE POLICY "Admins can read audit events"
ON public.fun_cosmos_audit_events FOR SELECT TO authenticated
USING (app_private.has_role(auth.uid(), 'admin'));
DROP FUNCTION public.has_role(uuid, public.app_role);