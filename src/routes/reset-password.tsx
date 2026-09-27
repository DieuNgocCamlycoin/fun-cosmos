import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Eye, EyeOff, Check, X, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: typeof search["token"] === "string" ? search["token"] : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Reset password | FUN COSMOS" },
      {
        name: "description",
        content: "Reset your FUN COSMOS password using your secure email link.",
      },
    ],
    links: [{ rel: "canonical", href: "/reset-password" }],
  }),
  component: ResetPasswordPage,
});

type ViewState = "idle" | "loading" | "success" | "error";

function ResetPasswordPage() {
  const { t } = useI18n();
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
      : t(
          "The reset link is missing its token. Open the link from your email or request a new one.",
          "Không tìm thấy mã đặt lại trong liên kết. Hãy mở lại liên kết trong email, hoặc yêu cầu gửi email mới.",
        ),
  );

  const passwordLengthOk = password.length >= 6;
  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const confirmDirty = confirmPassword.length > 0;
  const canSubmit = passwordLengthOk && passwordsMatch && hasToken && viewState !== "loading";

  const matchIndicator = useMemo(() => {
    if (!confirmDirty) return null;
    if (passwordsMatch) {
      return <Check size={16} color="#dfe8a0" aria-label={t("Passwords match", "Mật khẩu khớp")} />;
    }
    return (
      <X size={16} color="#ffb8b8" aria-label={t("Passwords do not match", "Mật khẩu chưa khớp")} />
    );
  }, [confirmDirty, passwordsMatch, t]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasToken) {
      setViewState("error");
      setInlineError(
        t(
          "The reset link is missing its token. Open the link from your email or request a new one.",
          "Không tìm thấy mã đặt lại trong liên kết. Hãy mở lại liên kết trong email, hoặc yêu cầu gửi email mới.",
        ),
      );
      return;
    }

    if (!passwordLengthOk) {
      setViewState("error");
      setInlineError(
        t("Password must have at least 6 characters.", "Mật khẩu cần tối thiểu 6 ký tự."),
      );
      return;
    }

    if (!passwordsMatch) {
      setViewState("error");
      setInlineError(t("Passwords do not match.", "Hai mật khẩu không khớp."));
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

      const message = t(
        "We couldn't reset your password. Check the link and try again.",
        payload.message || "Mất kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại.",
      );

      setViewState("error");
      setInlineError(message);
    } catch {
      setViewState("error");
      setInlineError(
        t(
          "Connection lost. Check your network and try again.",
          "Mất kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại.",
        ),
      );
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

          <h1 className="auth-callback-title">{t("Reset password", "Đặt lại mật khẩu")}</h1>

          {!hasToken && (
            <p className="auth-callback-subtitle">
              {t(
                "The reset link is missing its token. Open the link from your email or request a new one.",
                "Không tìm thấy mã đặt lại trong liên kết. Hãy mở lại liên kết trong email, hoặc yêu cầu gửi email mới.",
              )}
            </p>
          )}

          {showForm && (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label htmlFor="new-password">{t("New password", "Mật khẩu mới")}</label>
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
                    placeholder={t("Enter a new password", "Nhập mật khẩu mới")}
                  />
                  <button
                    type="button"
                    className="auth-toggle"
                    aria-label={
                      showPassword
                        ? t("Hide password", "Ẩn mật khẩu")
                        : t("Show password", "Hiện mật khẩu")
                    }
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="confirm-password">
                  {t("Confirm new password", "Xác nhận mật khẩu mới")}
                </label>
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
                    placeholder={t("Enter password again", "Nhập lại mật khẩu")}
                  />
                  {matchIndicator && <span className="auth-match-indicator">{matchIndicator}</span>}
                  <button
                    type="button"
                    className="auth-toggle"
                    aria-label={
                      showConfirmPassword
                        ? t("Hide confirmation", "Ẩn mật khẩu xác nhận")
                        : t("Show confirmation", "Hiện mật khẩu xác nhận")
                    }
                    onClick={() => setShowConfirmPassword((value) => !value)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <p className="auth-field-note">
                {t(
                  "Use at least 6 characters. The reset link can be used once.",
                  "Mật khẩu cần tối thiểu 6 ký tự. Liên kết đặt lại chỉ dùng được một lần.",
                )}
              </p>

              {inlineError && <p className="auth-inline-error">{inlineError}</p>}

              <button className="auth-submit" type="submit" disabled={!canSubmit}>
                {viewState === "loading" ? (
                  <span className="auth-submit-content">
                    <span className="auth-spinner" aria-hidden="true" />
                    {t("Processing…", "Đang xử lý…")}
                  </span>
                ) : (
                  t("Reset password", "Đặt lại mật khẩu")
                )}
              </button>
            </form>
          )}

          {viewState === "success" && (
            <div className="auth-success" aria-live="polite">
              <div className="auth-success-panel">
                <h3>{t("Done!", "Hoàn tất!")}</h3>
                <p>
                  {t(
                    "Return to the game and sign in with your new password.",
                    "Quay lại game và đăng nhập bằng mật khẩu mới.",
                  )}
                </p>
              </div>

              <Link to="/" className="auth-action">
                {t("Back to home", "Quay lại trang chủ")}
              </Link>
            </div>
          )}

          <p className="auth-footer-note">
            {t(
              "Need help? Open the game and request a new password reset email.",
              "Gặp trục trặc? Hãy mở game và yêu cầu gửi lại email đặt lại mật khẩu.",
            )}
          </p>
        </section>
      </main>

      <SiteFooter paused={false} onPause={() => undefined} />
    </div>
  );
}
