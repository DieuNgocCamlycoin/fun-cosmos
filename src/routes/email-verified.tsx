import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/email-verified")({
  head: () => ({
    meta: [
      { title: "Email verified | FUN COSMOS" },
      {
        name: "description",
        content: "Your email is verified. Return to the FUN COSMOS home page.",
      },
    ],
    links: [{ rel: "canonical", href: "/email-verified" }],
  }),
  component: EmailVerifiedPage,
});

function EmailVerifiedPage() {
  const { t } = useI18n();
  return (
    <div className="auth-callback-page">
      <SiteHeader />

      <main className="auth-callback-main">
        <section className="auth-callback-card" aria-live="polite">
          <div className="auth-callback-icon" aria-hidden="true">
            <CheckCircle2 size={30} color="#fff7d6" />
          </div>

          <h1 className="auth-callback-title">
            {t("Email verified", "Xác minh email thành công")}
          </h1>

          <div style={{ marginTop: 24, display: "grid", justifyItems: "center" }}>
            <Link to="/" className="auth-action">
              {t("Back to home", "Quay lại trang chủ")}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter paused={false} onPause={() => undefined} />
    </div>
  );
}
