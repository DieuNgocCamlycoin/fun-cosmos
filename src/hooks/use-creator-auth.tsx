import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useCreatorAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setReady(true);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setReady(true);
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);
  return {
    session,
    ready,
    user: session?.user ?? null,
    email: session?.user?.email ?? "",
    displayName:
      (session?.user?.user_metadata?.["display_name"] as string | undefined) ??
      session?.user?.email?.split("@")[0] ??
      "",
  };
}
