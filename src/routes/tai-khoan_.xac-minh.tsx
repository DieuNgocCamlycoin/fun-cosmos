import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { useResendVerification } from "@/hooks/use-resend-verification";
import "@/living.css";

export const Route = createFileRoute("/tai-khoan_/xac-minh")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Xác minh email người sáng tạo | FUN COSMOS" },
      {
        name: "description",
        content:
          "Hoàn tất xác minh email để kích hoạt tài khoản người sáng tạo FUN COSMOS và bắt đầu gửi ý tưởng.",
      },
      { property: "og:title", content: "Xác minh email người sáng tạo | FUN COSMOS" },
      {
        property: "og:description",
        content: "Kích hoạt tài khoản người sáng tạo FUN COSMOS sau khi xác minh email.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tai-khoan/xac-minh" }],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "ok" | "failed">("checking");
  const [email, setEmail] = useState("");
  const [retryEmail, setRetryEmail] = useState("");
  const resend = useResendVerification();

  useEffect(() => {
    let active = true;
    async function check() {
      // Nguồn xác thực duy nhất: Supabase Auth.
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      const user = data.user as
        | ({ email?: string; email_confirmed_at?: string | null; confirmed_at?: string | null })
        | null;
      if (user && (user.email_confirmed_at || user.confirmed_at)) {
        setEmail(user.email ?? "");
        setState("ok");
      } else {
        setState("failed");
      }
    }
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => void check());
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="tw yt-hub">
      <SiteHeader />
      <main className="fc-account-page">
        <section aria-live="polite">
          <p className="lc-eyebrow">✧ YOUR TURN • CO-CREATE FUN COSMOS</p>
          {state === "checking" && (
            <>
              <h1>ĐANG XÁC MINH…</h1>
              <p>Chúng tôi đang kiểm tra liên kết xác minh của bạn.</p>
            </>
          )}
          {state === "ok" && (
            <div className="fc-account-signed">
              <h1>XÁC MINH THÀNH CÔNG! ✨</h1>
              <p>Chào mừng bạn trở thành Người sáng tạo FUN COSMOS.</p>
              <p>
                Giờ đây bạn có thể tạo ý tưởng, lưu hành trình sáng tạo và tham gia cộng đồng đồng
                sáng tạo.
              </p>
              {email && <p>Tài khoản: {email}</p>}
              <div className="lc-actions">
                <Button onClick={() => navigate({ to: "/tao-y-tuong" })}>
                  Tạo ý tưởng đầu tiên
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: "/idea-hub" })}>
                  Khám phá Idea Hub
                </Button>
              </div>
            </div>
          )}
          {state === "failed" && (
            <div className="fc-account-signed">
              <h1>LIÊN KẾT CHƯA HỢP LỆ</h1>
              <p>
                Liên kết xác minh có thể đã hết hạn hoặc đã được dùng. Bạn có thể nhận một liên kết
                mới.
              </p>
              <label>
                Email của bạn
                <input
                  type="email"
                  value={retryEmail}
                  onChange={(event) => setRetryEmail(event.target.value)}
                />
              </label>
              <div className="lc-actions">
                <Button
                  disabled={resend.busy || resend.cooldown > 0 || !retryEmail}
                  onClick={() => resend.send(retryEmail)}
                >
                  {resend.cooldown > 0
                    ? `Gửi lại sau ${resend.cooldown}s`
                    : "Gửi lại email xác minh"}
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: "/tai-khoan" })}>
                  Quay lại đăng nhập
                </Button>
              </div>
              {resend.message && <p role="status">{resend.message}</p>}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
