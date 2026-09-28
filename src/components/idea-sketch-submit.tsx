import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useCreatorAuth } from "@/hooks/use-creator-auth";
import { saveIdeaDraft, submitIdeaSketch } from "@/lib/ideas.functions";
import { SKETCH_RECEIPT_KEY, sketchContent } from "@/lib/idea-sketch";
import { ideaHasContent } from "@/lib/idea-submission";
import { useI18n } from "@/lib/i18n";

type Recovery = {
  owner: string;
  signature: string;
  id?: string;
  updatedAt?: string;
  code?: string;
};
export function IdeaSketchSubmit({ fields }: { fields: readonly string[] }) {
  const { t } = useI18n();
  const { ready, session, emailVerified } = useCreatorAuth();
  const save = useServerFn(saveIdeaDraft);
  const send = useServerFn(submitIdeaSketch);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const recovery = useRef<Recovery | null>(null);
  const locked = useRef(false);
  const signature = JSON.stringify(fields);
  const owner = session?.user.id;
  useEffect(() => {
    if (!owner) return;
    try {
      const value = JSON.parse(
        localStorage.getItem(SKETCH_RECEIPT_KEY) || "null",
      ) as Recovery | null;
      recovery.current = value?.owner === owner ? value : null;
      setCode(value?.owner === owner && value.signature === signature ? value.code || "" : "");
    } catch {
      recovery.current = null;
    }
  }, [owner, signature]);
  function remember(value: Recovery) {
    recovery.current = value;
    try {
      localStorage.setItem(SKETCH_RECEIPT_KEY, JSON.stringify(value));
    } catch {
      /* In-memory recovery remains available. */
    }
  }
  async function submit() {
    if (!owner || !consent || !ideaHasContent(fields) || locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      let current = recovery.current;
      if (current?.signature !== signature && current?.code) current = null;
      if (!current?.code) {
        const saved = await save({
          data: {
            ...sketchContent(fields),
            id: current?.id,
            clientUpdatedAt: current?.updatedAt,
            consentAccuracy: true,
            consentPublic: false,
          },
        });
        current = { owner, signature, id: saved.id, updatedAt: saved.updatedAt };
        remember(current);
      }
      const receipt = await send({ data: { id: current.id! } });
      remember({ ...current, code: receipt.code });
      setCode(receipt.code);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Chưa gửi được. Nội dung của bạn vẫn được giữ lại.",
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return (
    <section className="idea-submit-form" aria-label={t("Send idea", "Gửi ý tưởng")}>
      <h3>{t("Your idea is ready to send", "Ý tưởng của bạn đã sẵn sàng để gửi")}</h3>
      <p>
        {t(
          "Your seven answers are the submission. No minimum story length.",
          "Bảy ý bạn vừa viết chính là nội dung gửi. Không yêu cầu câu chuyện 1.000 ký tự.",
        )}
      </p>
      {code ? (
        <p role="status">
          {t("Received · Reference:", "Đã tiếp nhận · Mã xác nhận:")} <strong>{code}</strong>
        </p>
      ) : (
        <>
          <label className="idea-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              disabled={busy}
            />
            <span>
              {t(
                "This is my idea. I agree to send it to FUN COSMOS for review.",
                "Đây là ý tưởng của tôi. Tôi đồng ý gửi đến FUN COSMOS để xem xét.",
              )}
            </span>
          </label>
          {!ready ? (
            <p role="status">{t("Loading account…", "Đang tải tài khoản…")}</p>
          ) : !session ? (
            <a className="tw-button" href="/tai-khoan?redirect=%2Fyour-turn%23idea-preview">
              {t("Sign in to send", "Đăng nhập để gửi")}
            </a>
          ) : !emailVerified ? (
            <a className="tw-button" href="/tai-khoan?redirect=%2Fyour-turn%23idea-preview">
              {t("Verify email to send", "Xác minh email để gửi")}
            </a>
          ) : (
            <button
              className="tw-button"
              disabled={busy || !consent || !ideaHasContent(fields)}
              onClick={() => void submit()}
            >
              {busy
                ? t("Sending…", "Đang gửi…")
                : t("Send idea to FUN COSMOS", "GỬI Ý TƯỞNG VÀO FUN COSMOS")}
            </button>
          )}
          {error && (
            <p className="idea-submit-error" role="alert">
              {error}
            </p>
          )}
        </>
      )}
      <small>
        {t(
          "Your draft stays on this device. Reward program applications are separate.",
          "Bản nháp vẫn được giữ trên thiết bị. Tham gia chương trình quà tặng là phần riêng.",
        )}
      </small>
      <a href="/tao-y-tuong?program=1">
        {t(
          "Apply for the story reward program (optional)",
          "Tham gia chương trình quà tặng câu chuyện (tùy chọn)",
        )}
      </a>
    </section>
  );
}
