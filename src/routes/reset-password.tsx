import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Eye, EyeOff, Check, X, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: typeof search["token"] === "string" ? (search["token"] as string) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Đặt lại mật khẩu | FUN COSMOS" },
      {
        name: "description",
        content: "Đặt lại mật khẩu tài khoản FUN COSMOS bằng liên kết an toàn từ PlayFab.",
      },
    ],
    links: [{ rel: "canonical", href: "/reset-password" }],
  }),
  component: ResetPasswordPage,
});

type ViewState = "idle" | "loading" | "success" | "error";

function ResetPasswordPage() {
  const search = Route.useSearch();
  const token = search.token ?? "";
  const hasToken = token.trim().length > 0 && token.length <= 512;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(hasToken ? "idle" : "error");
  const [inlineError, setInlineError] = useState(
    hasToken
      ? ""
      : "Không tìm thấy mã đặt lại trong liên kết. Hãy mở lại liên kết trong email, hoặc yêu cầu gửi email mới.",
  );

  const passwordLengthOk = password.length >= 6;
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const confirmDirty = confirmPassword.length > 0;
  const canSubmit = passwordLengthOk && passwordsMatch && hasToken && viewState !== "loading";

  const matchIndicator = useMemo(() => {
    if (!confirmDirty) return null;
    if (passwordsMatch) {
      return <Check size={16} color="#dfe8a0" aria-label="Mật khẩu khớp" />;
    }
    return <X size={16} color="#ffb8b8" aria-label="Mật khẩu chưa khớp" />;
  }, [confirmDirty, passwordsMatch]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasToken) {
      setViewState("error");
      setInlineError(
        "Không tìm thấy mã đặt lại trong liên kết. Hãy mở lại liên kết trong email, hoặc yêu cầu gửi email mới.",
      );
      return;
    }

    if (!passwordLengthOk) {
      setViewState("error");
      setInlineError("Mật khẩu cần tối thiểu 6 ký tự.");
      return;
    }

    if (!passwordsMatch) {
      setViewState("error");
      setInlineError("Hai mật khẩu không khớp.");
      return;
    }

    setViewState("loading");
    setInlineError("");

    try {
      const response = await fetch("/api/public/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }),
      });

      const payload = (await response.json().catch(() => ({ ok: false, message: "" }))) as {
        ok?: boolean;
        message?: string;
      };

      if (response.ok && payload.ok) {
        setViewState("success");
        setPassword("");
        setConfirmPassword("");
        setInlineError("");
        return;
      }

      const message =
        payload.message ||
        "Mất kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại.";

      setViewState("error");
      setInlineError(message);
    } catch {
      setViewState("error");
      setInlineError("Mất kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại.");
    }
  }

  const showForm = viewState !== "success";

  return (
    <div className="auth-callback-page">
      <SiteHeader />

      <main className="auth-callback-main">
        <section className="auth-callback-card" aria-live="polite">
          <div className="auth-callback-icon" aria-hidden="true">
            <ShieldCheck size={30} color="#fff7d6" />
          </div>

          <h1 className="auth-callback-title">Đặt lại mật khẩu</h1>

          {!hasToken && (
            <p className="auth-callback-subtitle">
              Không tìm thấy mã đặt lại trong liên kết. Hãy mở lại liên kết trong email, hoặc yêu cầu gửi email mới.
            </p>
          )}

          {showForm && (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label htmlFor="new-password">Mật khẩu mới</label>
                <div className="auth-input-wrap">
                  <input
                    id="new-password"
                    name="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value.slice(0, 100))}
                    maxLength={100}
                    autoComplete="new-password"
                    aria-invalid={password.length > 0 && !passwordLengthOk}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    className="auth-toggle"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
                <div className="auth-input-wrap">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value.slice(0, 100))}
                    maxLength={100}
                    autoComplete="new-password"
                    aria-invalid={confirmDirty && !passwordsMatch}
                    placeholder="Nhập lại mật khẩu"
                  />
                  {matchIndicator && <span className="auth-match-indicator">{matchIndicator}</span>}
                  <button
                    type="button"
                    className="auth-toggle"
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
                    onClick={() => setShowConfirmPassword((value) => !value)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <p className="auth-field-note">
                Mật khẩu cần tối thiểu 6 ký tự. Liên kết đặt lại chỉ dùng được một lần.
              </p>

              {inlineError && <p className="auth-inline-error">{inlineError}</p>}

              <button className="auth-submit" type="submit" disabled={!canSubmit}>
                {viewState === "loading" ? (
                  <span className="auth-submit-content">
                    <span className="auth-spinner" aria-hidden="true" />
                    Đang xử lý…
                  </span>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </button>
            </form>
          )}

          {viewState === "success" && (
            <div className="auth-success" aria-live="polite">
              <div className="auth-success-panel">
                <h3>Hoàn tất!</h3>
                <p>Quay lại game và đăng nhập bằng mật khẩu mới.</p>
              </div>

              <Link to="/" className="auth-action">
                Quay lại trang chủ
              </Link>
            </div>
          )}

          <p className="auth-footer-note">Gặp trục trặc? Hãy mở game và yêu cầu gửi lại email đặt lại mật khẩu.</p>
        </section>
      </main>

      <SiteFooter paused={false} onPause={() => undefined} />
    </div>
  );
}
