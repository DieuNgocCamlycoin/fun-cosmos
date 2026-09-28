import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ideaHasContent, type IdeaPayload } from "@/lib/idea-submission";

export function IdeaSubmissionForm({ fields }: { fields: readonly string[] }) {
  const { locale, t } = useI18n();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [website, setWebsite] = useState("");
  const [service, setService] = useState<"checking" | "ready" | "unavailable">("checking");
  const requestId = useRef<string | null>(null);
  const submittedFields = useRef("");

  async function checkInbox(signal?: AbortSignal) {
    setService("checking");
    try {
      const response = await fetch("/api/public/ideas", {
        cache: "no-store",
        ...(signal ? { signal } : {}),
      });
      const result = (await response.json()) as { available?: boolean };
      if (!signal?.aborted) setService(response.ok && result.available ? "ready" : "unavailable");
    } catch {
      if (!signal?.aborted) setService("unavailable");
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void checkInbox(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (state === "sent" && submittedFields.current !== JSON.stringify(fields)) {
      setState("idle");
      setCode("");
      requestId.current = null;
    }
  }, [fields, state]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      service !== "ready" ||
      state === "sending" ||
      state === "sent" ||
      !ideaHasContent(fields) ||
      !consent
    )
      return;
    const fieldSignature = JSON.stringify(fields);
    if (!requestId.current || submittedFields.current !== fieldSignature)
      requestId.current = crypto.randomUUID();
    submittedFields.current = fieldSignature;
    setState("sending");
    setError("");

    const payload: IdeaPayload = {
      fields: [...fields],
      email: email.trim(),
      consent: true,
      locale,
      requestId: requestId.current,
      website,
    };
    try {
      const response = await fetch("/api/public/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; id?: string; code?: string };
      if (response.ok && result.ok && result.id) {
        setCode(result.id);
        setState("sent");
        return;
      }
      setState("error");
      setError(
        result.code === "rate-limit"
          ? t(
              "You have sent several ideas today. Please try again tomorrow.",
              "Bạn đã gửi nhiều ý tưởng hôm nay. Vui lòng thử lại vào ngày mai.",
            )
          : result.code === "unavailable"
            ? t(
                "The submission service is temporarily unavailable. Your draft is still saved on this device.",
                "Dịch vụ gửi ý tưởng tạm thời chưa hoạt động. Bản nháp vẫn được giữ trên thiết bị này.",
              )
            : t(
                "We couldn't send your idea. Please check the form and try again.",
                "Chưa gửi được ý tưởng. Vui lòng kiểm tra biểu mẫu và thử lại.",
              ),
      );
    } catch {
      setState("error");
      setError(
        t(
          "Connection lost. Your draft is safe on this device; please try again.",
          "Mất kết nối. Bản nháp vẫn còn trên thiết bị này; vui lòng thử lại.",
        ),
      );
    }
  }

  if (state === "sent") {
    return (
      <div className="idea-submit-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <strong>
          {t("Your game idea has been received", "Ý tưởng làm game của bạn đã được tiếp nhận")}
        </strong>
        <p>
          {t("Keep this reference code:", "Hãy giữ mã xác nhận này:")} <code>{code}</code>
        </p>
        <small>
          {t(
            "Your idea is private while the FUN COSMOS team reviews it.",
            "Ý tưởng của bạn được giữ riêng tư trong khi đội ngũ FUN COSMOS xem xét.",
          )}
        </small>
      </div>
    );
  }

  return (
    <form className="idea-submit-form" onSubmit={submit}>
      <h3>{t("Send your game idea", "Gửi ý tưởng làm game")}</h3>
      <p>
        {t(
          "Review your idea above, then send it to the FUN COSMOS team.",
          "Xem lại ý tưởng ở trên, rồi gửi đến đội ngũ FUN COSMOS.",
        )}
      </p>
      {service !== "ready" && (
        <p className="idea-service-note" role="status">
          {service === "checking"
            ? t("Checking the idea inbox…", "Đang kiểm tra hộp nhận ý tưởng…")
            : t(
                "The idea inbox is not connected yet. Your draft stays on this device; you can download the card above.",
                "Hộp nhận ý tưởng chưa được kết nối. Bản nháp vẫn lưu trên thiết bị; bạn có thể tải thẻ ở phía trên.",
              )}
        </p>
      )}
      {service === "unavailable" && (
        <button type="button" className="tw-outline" onClick={() => void checkInbox()}>
          {t("Check connection again", "Kiểm tra kết nối lại")}
        </button>
      )}
      <label htmlFor="idea-contact-email">{t("Contact email", "Email liên hệ")}</label>
      <input
        id="idea-contact-email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          requestId.current = null;
        }}
        placeholder="you@example.com"
      />
      <input
        className="idea-honeypot"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        name="website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
      />
      <label className="idea-consent">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>
          {t(
            "I agree that FUN COSMOS may store my idea and contact email to review it and reply. My idea will not be published without my permission.",
            "Tôi đồng ý để FUN COSMOS lưu ý tưởng và email liên hệ nhằm xem xét, phản hồi. Ý tưởng sẽ không được công bố nếu tôi chưa cho phép.",
          )}
        </span>
      </label>
      <button
        className="tw-button"
        type="submit"
        disabled={service !== "ready" || !ideaHasContent(fields) || !consent || state === "sending"}
      >
        {state === "sending" ? t("Sending…", "Đang gửi…") : t("Send idea", "Gửi ý tưởng")}{" "}
        <ArrowUpRight size={18} />
      </button>
      {error && (
        <p className="idea-submit-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
