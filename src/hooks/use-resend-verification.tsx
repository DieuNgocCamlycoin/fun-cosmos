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
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: window.location.origin + VERIFY_REDIRECT },
      });
      if (error) throw error;
      // Không tiết lộ trạng thái tài khoản.
      setMessage(
        "Nếu email này cần xác minh, yêu cầu gửi liên kết đã được tiếp nhận. Hãy kiểm tra cả thư rác.",
      );
    } catch (cause) {
      const code = (cause as { code?: string })?.code;
      setMessage(
        code === "over_email_send_rate_limit" || code === "over_request_rate_limit"
          ? "Hệ thống đã chạm giới hạn gửi email. Vui lòng thử lại sau; quản trị viên cần kiểm tra cấu hình email Supabase."
          : "Chưa thể gửi yêu cầu xác minh. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
      );
    } finally {
      startCooldown();
      setBusy(false);
    }
  }

  return { cooldown, busy, message, send };
}
