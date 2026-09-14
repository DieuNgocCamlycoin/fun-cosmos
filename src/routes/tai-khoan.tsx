import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCreatorAuth } from "@/hooks/use-creator-auth";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import "@/living.css";

export const Route = createFileRoute("/tai-khoan")({
  head: () => ({
    meta: [
      { title: "Tài khoản người sáng tạo | FUN COSMOS" },
      {
        name: "description",
        content:
          "Đăng nhập hoặc tạo tài khoản người sáng tạo FUN COSMOS để gửi ý tưởng và theo dõi hành trình đồng sáng tạo.",
      },
      { property: "og:title", content: "Tài khoản người sáng tạo | FUN COSMOS" },
      {
        property: "og:description",
        content: "Tạo tài khoản để gửi ý tưởng và theo dõi trạng thái trong FUN COSMOS Idea Hub.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tai-khoan" }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { session, ready, email: accountEmail } = useCreatorAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [redirectTo, setRedirectTo] = useState("/tao-y-tuong");

  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get("redirect");
    if (target && target.startsWith("/")) setRedirectTo(target);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/tai-khoan",
            data: { display_name: displayName.trim() || email.split("@")[0] },
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setNotice("Hãy mở email và bấm liên kết xác nhận để hoàn tất việc tạo tài khoản.");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
      await navigate({ to: redirectTo });
    } catch (cause) {
      setError(
        cause instanceof Error && /Invalid login/i.test(cause.message)
          ? "Email hoặc mật khẩu chưa đúng."
          : cause instanceof Error
            ? cause.message
            : "Chưa thể hoàn tất. Vui lòng thử lại.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tw yt-hub">
      <SiteHeader />
      <main className="fc-account-page">
        <section>
          <p className="lc-eyebrow">✧ YOUR TURN • CO-CREATE FUN COSMOS</p>
          <h1>TÀI KHOẢN NGƯỜI SÁNG TẠO</h1>
          {!ready ? (
            <p>Đang kiểm tra tài khoản…</p>
          ) : session ? (
            <div className="fc-account-signed">
              <p>
                Bạn đang đăng nhập với <strong>{accountEmail}</strong>.
              </p>
              <div className="lc-actions">
                <Button onClick={() => navigate({ to: "/tao-y-tuong" })}>Tạo ý tưởng</Button>
                <Button variant="outline" onClick={() => navigate({ to: "/y-tuong-cua-toi" })}>
                  Ý tưởng của tôi
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    await navigate({ to: "/your-turn" });
                  }}
                >
                  <LogOut aria-hidden="true" /> Đăng xuất
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="fc-account-form">
              <div className="fc-account-tabs" role="tablist" aria-label="Chế độ tài khoản">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "signin"}
                  onClick={() => setMode("signin")}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "signup"}
                  onClick={() => setMode("signup")}
                >
                  Tạo tài khoản
                </button>
              </div>
              {mode === "signup" && (
                <label>
                  Tên hiển thị công khai
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={60}
                    placeholder="Tên bạn muốn cộng đồng nhìn thấy"
                  />
                </label>
              )}
              <label>
                Email
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label>
                Mật khẩu
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              {error && (
                <p className="fc-form-error" role="alert">
                  {error}
                </p>
              )}
              {notice && <p role="status">{notice}</p>}
              <Button disabled={busy}>
                {mode === "signup" ? <UserPlus aria-hidden="true" /> : <LogIn aria-hidden="true" />}
                {busy ? "Đang xử lý…" : mode === "signup" ? "Tạo tài khoản" : "Đăng nhập"}
              </Button>
              <small>
                Email của bạn chỉ dùng để xác minh bài tham gia và không bao giờ hiển thị công khai.
              </small>
            </form>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
