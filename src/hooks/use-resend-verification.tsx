import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const VERIFY_REDIRECT = "/tai-khoan/xac-minh";
const COOLDOWN_SECONDS = 60;

/** Resend the Supabase confirmation email with an anti-spam cooldown. */
export function useResendVerification() {
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  function startCooldown() {
    setCooldown(COOLDOWN_SECONDS);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setCooldown((value) => {
        if (value <= 1) {
          if (timer.current) clearInterval(timer.current);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
  }

  async function send(email: string) {
    if (!email || busy || cooldown > 0) return;
    setBusy(true);
    setMessage("");
    try {
      await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: window.location.origin + VERIFY_REDIRECT },
      });
      // Không tiết lộ trạng thái tài khoản: luôn báo cùng một thông điệp.
      setMessage("Nếu email này cần xác minh, liên kết mới đã được gửi. Hãy kiểm tra hộp thư.");
    } catch {
      setMessage("Nếu email này cần xác minh, liên kết mới đã được gửi. Hãy kiểm tra hộp thư.");
    } finally {
      startCooldown();
      setBusy(false);
    }
  }

  return { cooldown, busy, message, send };
}
