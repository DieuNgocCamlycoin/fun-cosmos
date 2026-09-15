import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Save,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { useCreatorAuth } from "@/hooks/use-creator-auth";
import { useResendVerification } from "@/hooks/use-resend-verification";
import { saveIdeaDraft, submitIdea, getMyIdea } from "@/lib/ideas.functions";
import {
  DRAFT_CACHE_KEY,
  FACEBOOK_POST_PATTERN,
  PROGRAM_HASHTAGS,
  STORY_MAX,
  STORY_MIN,
  buildAngelPrompt,
  buildShareText,
  creatorSteps,
  ideaCategories,
  loveScoreNote,
  programHeadline,
  programSubline,
  rewardNotice,
  seedLabels,
  storyEncouragement,
  storyJourney,
  storyPlaceholder,
  storyTooShortMessage,
} from "@/lib/idea-content";
import "@/living.css";
import "@/components/idea-hub.css";

export const Route = createFileRoute("/tao-y-tuong")({
  head: () => ({
    meta: [
      { title: "Tạo ý tưởng FUN COSMOS — Viết câu chuyện của bạn" },
      {
        name: "description",
        content:
          "Gieo 7 hạt giống ý tưởng rồi viết câu chuyện FUN COSMOS của riêng bạn, chia sẻ lên Facebook và gửi tới cộng đồng đồng sáng tạo.",
      },
      { property: "og:title", content: "Tạo ý tưởng FUN COSMOS — Viết câu chuyện của bạn" },
      {
        property: "og:description",
        content: "Biến ý tưởng thành một cuộc phiêu lưu trong FUN COSMOS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/tao-y-tuong" }],
  }),
  component: CreateIdeaPage,
});

type Draft = {
  id?: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  characterName: string;
  characterDescription: string;
  dream: string;
  gameplay: string;
  angelAi: string;
  reward: string;
  worldChange: string;
  realWorldConnection: string;
  story: string;
  facebookPostUrl: string;
  facebookUrl: string;
  telegram: string;
  funRichUrl: string;
  recipientWallet: string;
  consentAccuracy: boolean;
  consentPublic: boolean;
};

const emptyDraft = (): Draft => ({
  title: "",
  summary: "",
  category: "other",
  tags: [],
  characterName: "",
  characterDescription: "",
  dream: "",
  gameplay: "",
  angelAi: "",
  reward: "",
  worldChange: "",
  realWorldConnection: "",
  story: "",
  facebookPostUrl: "",
  facebookUrl: "",
  telegram: "",
  funRichUrl: "",
  recipientWallet: "",
  consentAccuracy: false,
  consentPublic: false,
});

const stepKeys = [
  "characterDescription",
  "dream",
  "gameplay",
  "angelAi",
  "reward",
  "worldChange",
  "realWorldConnection",
] as const;

const STORY_STEP = 7;
const SHARE_STEP = 8;
const META_STEP = 9;
const VERIFY_STEP = 10;
const REVIEW_STEP = 11;
const TOTAL_STEPS = 12;

const formatNumber = (value: number) => value.toLocaleString("vi-VN");

function CreateIdeaPage() {
  const { ready, session, email, emailVerified } = useCreatorAuth();
  const resend = useResendVerification();
  const navigate = useNavigate();
  const save = useServerFn(saveIdeaDraft);
  const send = useServerFn(submitIdea);
  const load = useServerFn(getMyIdea);

  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [serverUpdatedAt, setServerUpdatedAt] = useState<string | undefined>();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [promptOpen, setPromptOpen] = useState(false);
  const [result, setResult] = useState<{ code: string; submittedAt: string } | null>(null);
  const firstField = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (ready && !session)
      void navigate({ to: "/tai-khoan", search: { redirect: "/tao-y-tuong" } as never });
  }, [ready, session, navigate]);

  // Database is the source of truth; the local cache is only a recovery fallback.
  useEffect(() => {
    if (!session) return;
    const editing = new URLSearchParams(window.location.search).get("id");
    let cancelled = false;
    (async () => {
      if (editing) {
        try {
          const remote = await load({ data: { id: editing } });
          if (cancelled) return;
          const idea = remote.idea as typeof remote.idea & {
            story?: string | null;
            facebook_post_url?: string | null;
          };
          setDraft({
            id: idea.id,
            title: idea.title,
            summary: idea.summary,
            category: idea.category,
            tags: remote.tags,
            characterName: idea.character_name,
            characterDescription: idea.character_description,
            dream: idea.dream,
            gameplay: idea.gameplay,
            angelAi: idea.angel_ai,
            reward: idea.reward,
            worldChange: idea.world_change,
            realWorldConnection: idea.real_world_connection,
            story: idea.story ?? "",
            facebookPostUrl: idea.facebook_post_url ?? "",
            facebookUrl: remote.details?.facebook_url ?? "",
            telegram: remote.details?.telegram ?? "",
            funRichUrl: remote.details?.fun_rich_url ?? "",
            recipientWallet: remote.details?.recipient_wallet ?? "",
            consentAccuracy: remote.details?.consent_accuracy ?? false,
            consentPublic: remote.details?.consent_public ?? false,
          });
          setServerUpdatedAt(idea.updated_at);
          return;
        } catch {
          setError("Không mở được ý tưởng này.");
          return;
        }
      }
      try {
        const cached = JSON.parse(localStorage.getItem(DRAFT_CACHE_KEY) || "null") as Draft | null;
        if (cached && !cached.id && !cancelled) setDraft({ ...emptyDraft(), ...cached });
      } catch {
        /* cache is optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session, load]);

  useEffect(() => {
    if (!draft.id) {
      try {
        localStorage.setItem(DRAFT_CACHE_KEY, JSON.stringify(draft));
      } catch {
        /* storage may be unavailable */
      }
    }
  }, [draft]);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const storyLength = draft.story.trim().length;
  const storyReady = storyLength >= STORY_MIN;
  const facebookReady = FACEBOOK_POST_PATTERN.test(draft.facebookPostUrl.trim());

  const angelPrompt = useMemo(
    () =>
      buildAngelPrompt({
        character: [draft.characterName, draft.characterDescription].filter(Boolean).join(" — "),
        dream: draft.dream,
        gameplay: draft.gameplay,
        angelAi: draft.angelAi,
        reward: draft.reward,
        worldChange: draft.worldChange,
        realWorldConnection: draft.realWorldConnection,
      }),
    [draft],
  );

  async function copy(text: string, token: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(token);
      window.setTimeout(() => setCopied(""), 4000);
    } catch {
      setError("Trình duyệt không cho phép sao chép. Hãy chọn và sao chép thủ công.");
    }
  }

  async function persist(silent = false) {
    setBusy(true);
    setError("");
    try {
      const saved = await save({ data: { ...draft, clientUpdatedAt: serverUpdatedAt } });
      setDraft((current) => ({ ...current, id: saved.id }));
      setServerUpdatedAt(saved.updatedAt);
      localStorage.removeItem(DRAFT_CACHE_KEY);
      if (!silent) setStatus("Đã lưu bản nháp.");
      return saved.id;
    } catch (cause) {
      setStatus("");
      setError(cause instanceof Error ? cause.message : "Không thể lưu — thử lại.");
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function finalSubmit() {
    if (busy) return;
    if (!storyReady) {
      setStep(STORY_STEP);
      setError(storyTooShortMessage);
      return;
    }
    if (!facebookReady) {
      setStep(SHARE_STEP);
      setError("Hãy dán link bài viết Facebook của câu chuyện để hoàn tất bài tham gia.");
      return;
    }
    const id = await persist(true);
    if (!id) return;
    setBusy(true);
    setError("");
    try {
      const response = await send({ data: { id, website: "" } });
      setResult({ code: response.code, submittedAt: response.submittedAt });
      localStorage.removeItem(DRAFT_CACHE_KEY);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Chưa gửi được ý tưởng. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  function go(next: number) {
    setStep(next);
    setStatus("");
    requestAnimationFrame(() => firstField.current?.focus());
  }

  if (!ready)
    return (
      <div className="tw yt-hub">
        <SiteHeader />
        <main className="ih-page">
          <p>Đang tải…</p>
        </main>
        <SiteFooter />
      </div>
    );

  if (session && !emailVerified)
    return (
      <div className="tw yt-hub">
        <SiteHeader />
        <main className="ih-page">
          <section className="ih-card" aria-live="polite">
            <p className="lc-eyebrow">✧ YOUR TURN • CO-CREATE FUN COSMOS</p>
            <h1>XÁC MINH EMAIL ĐỂ GỬI Ý TƯỞNG</h1>
            <p>Vui lòng xác minh email để gửi ý tưởng.</p>
            <p>
              Liên kết xác minh đã được gửi tới <strong>{email}</strong>.
            </p>
            <div className="lc-actions">
              <Button
                disabled={resend.busy || resend.cooldown > 0}
                onClick={() => resend.send(email)}
              >
                {resend.cooldown > 0 ? `Gửi lại sau ${resend.cooldown}s` : "Gửi lại email xác minh"}
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: "/idea-hub" })}>
                Khám phá Idea Hub
              </Button>
            </div>
            {resend.message && <p role="status">{resend.message}</p>}
          </section>
        </main>
        <SiteFooter />
      </div>
    );

  if (result)
    return (
      <div className="tw yt-hub">
        <SiteHeader />
        <main className="ih-page">
          <section className="ih-success">
            <h1>✨ Ý TƯỞNG ĐÃ BAY VÀO FUN COSMOS!</h1>
            <dl>
              <div>
                <dt>MÃ Ý TƯỞNG</dt>
                <dd>{result.code}</dd>
              </div>
              <div>
                <dt>TRẠNG THÁI</dt>
                <dd>ĐÃ GỬI • CHỜ DUYỆT</dd>
              </div>
              <div>
                <dt>NGÀY GỬI</dt>
                <dd>{new Date(result.submittedAt).toLocaleString("vi-VN")}</dd>
              </div>
            </dl>
            <p>
              Câu chuyện của bạn đã được gửi đến FUN COSMOS. Sau khi được Ban quản trị duyệt đăng, ý
              tưởng sẽ xuất hiện trong IDEA HUB để cộng đồng cùng khám phá.
            </p>
            <p className="ih-note">{rewardNotice}</p>
            <div className="lc-actions">
              <Button onClick={() => void copy(result.code, "code")}>
                <Copy aria-hidden="true" /> {copied === "code" ? "✓ Đã sao chép" : "Sao chép mã ý tưởng"}
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: "/y-tuong-cua-toi" })}>
                Xem ý tưởng của tôi
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: "/idea-hub" })}>
                Khám phá Idea Hub
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setDraft(emptyDraft());
                  setServerUpdatedAt(undefined);
                  go(0);
                }}
              >
                Tạo ý tưởng mới
              </Button>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );

  const contentStep = step < 7 ? creatorSteps[step]! : null;
  const stepLabel =
    step < 7
      ? `${step + 1} / 7 hạt giống · ${contentStep?.english}`
      : step === STORY_STEP
        ? "08 · Câu chuyện FUN COSMOS"
        : step === SHARE_STEP
          ? "Chia sẻ Facebook"
          : step === META_STEP
            ? "Thông tin bài"
            : step === VERIFY_STEP
              ? "Xác minh tham gia"
              : "Xem lại ý tưởng";

  return (
    <div className="tw yt-hub">
      <SiteHeader />
      <main className="ih-page ih-creator">
        <header className="ih-creator-head">
          <p className="lc-eyebrow">✧ YOUR TURN • CO-CREATE FUN COSMOS</p>
          <h1>TẠO Ý TƯỞNG CỦA BẠN</h1>
          <div className="ih-progress" aria-label={`Bước ${step + 1} trên ${TOTAL_STEPS}`}>
            <span style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
          </div>
          <p className="ih-progress-label">{stepLabel}</p>
        </header>

        {step < 7 && contentStep && (
          <section className="ih-card">
            <p className="lc-eyebrow">
              HẠT GIỐNG {String(step + 1).padStart(2, "0")} · {contentStep.english}
            </p>
            <h2>
              {contentStep.title}{" "}
              {contentStep.optional && <span className="ih-optional">TÙY CHỌN</span>}
            </h2>
            <p className="ih-question">{contentStep.helper}</p>
            {step === 0 && (
              <label>
                Tên nhân vật
                <input
                  value={draft.characterName}
                  maxLength={140}
                  onChange={(e) => set("characterName", e.target.value)}
                  placeholder="Anna"
                />
              </label>
            )}
            <label>
              {step === 0 ? "Mô tả nhân vật" : "Nội dung"}
              <textarea
                ref={firstField as React.RefObject<HTMLTextAreaElement>}
                maxLength={2000}
                value={draft[stepKeys[step]!]}
                placeholder={contentStep.placeholder}
                onChange={(e) => set(stepKeys[step]!, e.target.value)}
              />
            </label>
            <p className="ih-note">Viết ngắn gọn cũng được — đây chỉ là hạt giống ý tưởng.</p>
            {step === 4 && <p className="ih-note">{loveScoreNote}</p>}
          </section>
        )}

        {step === STORY_STEP && (
          <section className="ih-card ih-story-card">
            <p className="lc-eyebrow">08 · YOUR FUN COSMOS STORY</p>
            <h2>CÂU CHUYỆN FUN COSMOS CỦA BẠN</h2>
            <p className="ih-story-sub">BIẾN Ý TƯỞNG THÀNH MỘT CUỘC PHIÊU LƯU.</p>
            <p>
              Hãy kết nối những ý tưởng phía trên thành một câu chuyện hoàn chỉnh về nhân vật của bạn
              trong FUN COSMOS.
            </p>
            <ol className="ih-story-journey">
              {storyJourney.map((stage) => (
                <li key={stage}>{stage}</li>
              ))}
            </ol>
            <p className="ih-note">{storyEncouragement}</p>
            <div className="lc-actions">
              <Button type="button" onClick={() => setPromptOpen(true)}>
                <Sparkles aria-hidden="true" /> NHỜ ANGEL AI VIẾT CÙNG TÔI
              </Button>
            </div>
            <label className="ih-story-label">
              Câu chuyện của bạn
              <textarea
                ref={firstField as React.RefObject<HTMLTextAreaElement>}
                className="ih-story-editor"
                maxLength={STORY_MAX}
                value={draft.story}
                placeholder={storyPlaceholder}
                onChange={(e) => set("story", e.target.value)}
              />
            </label>
            <p className={`ih-counter${storyReady ? " is-ready" : ""}`} aria-live="polite">
              {storyReady
                ? `${formatNumber(storyLength)} ký tự ✓`
                : `${formatNumber(storyLength)} / ${formatNumber(STORY_MIN)} ký tự tối thiểu`}
            </p>
            {!storyReady && <p className="ih-note">{storyTooShortMessage}</p>}
          </section>
        )}

        {promptOpen && (
          <div className="ih-modal" role="dialog" aria-modal="true" aria-label="Nhờ Angel AI phát triển câu chuyện">
            <div className="ih-modal-panel">
              <header>
                <h2>NHỜ ANGEL AI PHÁT TRIỂN CÂU CHUYỆN</h2>
                <button type="button" onClick={() => setPromptOpen(false)} aria-label="Đóng">
                  <X aria-hidden="true" />
                </button>
              </header>
              <p className="ih-note">
                Sao chép lời nhắc dưới đây, nhờ Angel AI phát triển, rồi dán câu chuyện trở lại ô
                viết truyện.
              </p>
              <pre className="ih-prompt">{angelPrompt}</pre>
              <div className="lc-actions">
                <Button onClick={() => void copy(angelPrompt, "prompt")}>
                  <Copy aria-hidden="true" /> {copied === "prompt" ? "✓ Đã sao chép prompt" : "SAO CHÉP PROMPT"}
                </Button>
                <Button variant="outline" onClick={() => setPromptOpen(false)}>
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === SHARE_STEP && (
          <section className="ih-card">
            <p className="lc-eyebrow">📣 CHIA SẺ CÂU CHUYỆN CỦA BẠN</p>
            <h2>ĐƯA Ý TƯỞNG RA CỘNG ĐỒNG</h2>
            <p>
              Hãy chia sẻ câu chuyện FUN COSMOS của bạn lên Facebook để bạn bè cùng đọc, trao đổi và
              khám phá ý tưởng.
            </p>
            <ol className="ih-share-steps">
              <li>Hoàn thành câu chuyện</li>
              <li>Sao chép câu chuyện</li>
              <li>Đăng lên Facebook</li>
              <li>Quay lại và dán link bài viết</li>
            </ol>
            <p className="ih-note">
              Khi sao chép, ba hashtag của chương trình được thêm sẵn: <b>{PROGRAM_HASHTAGS}</b>
            </p>
            <div className="lc-actions">
              <Button
                type="button"
                disabled={!draft.story.trim()}
                onClick={() => void copy(buildShareText(draft.title, draft.story), "story")}
              >
                <Copy aria-hidden="true" /> {copied === "story" ? "✓ Đã sao chép câu chuyện" : "SAO CHÉP CÂU CHUYỆN"}
              </Button>
              <a
                className="lc-button"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer noopener"
              >
                ĐĂNG LÊN FACEBOOK <ExternalLink aria-hidden="true" size={14} />
              </a>
            </div>
            <label>
              LINK BÀI VIẾT FACEBOOK
              <input
                ref={firstField as React.RefObject<HTMLInputElement>}
                type="url"
                inputMode="url"
                maxLength={500}
                value={draft.facebookPostUrl}
                placeholder="Dán link bài viết Facebook của bạn tại đây..."
                onChange={(e) => set("facebookPostUrl", e.target.value)}
                aria-invalid={draft.facebookPostUrl.trim() !== "" && !facebookReady}
              />
              <small>
                Đảm bảo đường dẫn có thể được Ban quản trị mở để kiểm tra bài tham gia.
              </small>
            </label>
            {draft.facebookPostUrl.trim() !== "" && !facebookReady && (
              <p className="fc-form-error">Đây chưa phải là đường dẫn bài viết Facebook hợp lệ.</p>
            )}
            <div className="ih-program">
              <h3>{programHeadline}</h3>
              <p>{programSubline}</p>
              <p className="ih-note">
                Bài đăng cần kèm 3 hashtag: <b>{PROGRAM_HASHTAGS}</b>
              </p>
            </div>
          </section>
        )}

        {step === META_STEP && (
          <section className="ih-card">
            <h2>THÔNG TIN BÀI</h2>
            <label>
              Tiêu đề ý tưởng
              <input
                ref={firstField as React.RefObject<HTMLInputElement>}
                maxLength={140}
                value={draft.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </label>
            <label>
              Tóm tắt ngắn
              <textarea
                maxLength={500}
                value={draft.summary}
                onChange={(e) => set("summary", e.target.value)}
              />
            </label>
            <label>
              Danh mục
              <select value={draft.category} onChange={(e) => set("category", e.target.value)}>
                {ideaCategories.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Thẻ (cách nhau bằng dấu phẩy, tối đa 8)
              <input
                value={draft.tags.join(", ")}
                onChange={(e) =>
                  set(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .slice(0, 8),
                  )
                }
              />
            </label>
          </section>
        )}

        {step === VERIFY_STEP && (
          <section className="ih-card">
            <h2>XÁC MINH THAM GIA</h2>
            <h3 className="ih-program-title">{programHeadline}</h3>
            <p>{programSubline}</p>
            <p className="ih-note">{rewardNotice}</p>
            <label>
              Email tài khoản
              <input value={email} readOnly aria-readonly="true" />
              <small>Lấy từ tài khoản của bạn và không bao giờ hiển thị công khai.</small>
            </label>
            <label>
              Facebook Profile URL
              <input
                ref={firstField as React.RefObject<HTMLInputElement>}
                placeholder="https://facebook.com/..."
                value={draft.facebookUrl}
                onChange={(e) => set("facebookUrl", e.target.value)}
              />
            </label>
            <label>
              Telegram
              <input
                placeholder="@username hoặc https://t.me/username"
                value={draft.telegram}
                onChange={(e) => set("telegram", e.target.value)}
              />
            </label>
            <label>
              FUN.Rich Profile
              <input
                placeholder="https://fun.rich/..."
                value={draft.funRichUrl}
                onChange={(e) => set("funRichUrl", e.target.value)}
              />
              <small>Bắt buộc khi gửi bài để xác minh người tham gia. Không hiển thị công khai.</small>
            </label>
            <label>
              Ví nhận CAMLY (BNB Smart Chain)
              <input
                value={draft.recipientWallet}
                onChange={(e) => set("recipientWallet", e.target.value)}
              />
              <small>Hãy kiểm tra kỹ địa chỉ ví. Ví không bao giờ hiển thị công khai.</small>
            </label>
            <div className="fc-consents">
              <label>
                <input
                  type="checkbox"
                  checked={draft.consentAccuracy}
                  onChange={(e) => set("consentAccuracy", e.target.checked)}
                />{" "}
                Tôi xác nhận thông tin trên là chính xác và đây là ý tưởng của tôi.
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={draft.consentPublic}
                  onChange={(e) => set("consentPublic", e.target.checked)}
                />{" "}
                Tôi đồng ý để FUN COSMOS chia sẻ ý tưởng của tôi trong cộng đồng nếu được duyệt.
              </label>
            </div>
          </section>
        )}

        {step === REVIEW_STEP && (
          <section className="ih-card ih-review">
            <h2>XEM LẠI Ý TƯỞNG CỦA BẠN</h2>
            <h3>{draft.title || "Chưa có tiêu đề"}</h3>
            <p>{draft.summary}</p>
            <dl>
              {[
                draft.characterName
                  ? `${draft.characterName} — ${draft.characterDescription}`
                  : draft.characterDescription,
                draft.dream,
                draft.gameplay,
                draft.angelAi,
                draft.reward,
                draft.worldChange,
                draft.realWorldConnection || "Chưa có / Không áp dụng.",
              ].map((value, index) => (
                <div key={seedLabels[index]}>
                  <dt>
                    {seedLabels[index]}
                    <button type="button" className="ih-edit" onClick={() => go(index)}>
                      Chỉnh sửa
                    </button>
                  </dt>
                  <dd>{value || "—"}</dd>
                </div>
              ))}
            </dl>

            <section className="ih-review-story">
              <h3>
                08 CÂU CHUYỆN FUN COSMOS
                <button type="button" className="ih-edit" onClick={() => go(STORY_STEP)}>
                  Chỉnh sửa
                </button>
              </h3>
              {draft.story
                .split(/\n{1,}/)
                .filter((paragraph) => paragraph.trim())
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              {!draft.story.trim() && <p className="ih-note">{storyTooShortMessage}</p>}
            </section>

            <dl>
              <div>
                <dt>
                  LINK BÀI VIẾT FACEBOOK
                  <button type="button" className="ih-edit" onClick={() => go(SHARE_STEP)}>
                    Chỉnh sửa
                  </button>
                </dt>
                <dd>{draft.facebookPostUrl || "—"}</dd>
              </div>
              <div>
                <dt>
                  THÔNG TIN CHƯƠNG TRÌNH 99.999
                  <button type="button" className="ih-edit" onClick={() => go(VERIFY_STEP)}>
                    Chỉnh sửa
                  </button>
                </dt>
                <dd>
                  Telegram: {draft.telegram || "—"} · FUN.Rich: {draft.funRichUrl || "—"} · Ví
                  CAMLY: {draft.recipientWallet ? "đã nhập" : "—"}
                </dd>
              </div>
              <div>
                <dt>Danh mục</dt>
                <dd>{ideaCategories.find(([id]) => id === draft.category)?.[1]}</dd>
              </div>
              <div>
                <dt>Thẻ</dt>
                <dd>{draft.tags.join(" · ") || "—"}</dd>
              </div>
            </dl>
            <p className="ih-note">
              Khi bấm gửi, ý tưởng sẽ được chuyển tới ban quản trị xem xét trước khi hiển thị công
              khai.
            </p>
          </section>
        )}

        {error && (
          <p className="fc-form-error" role="alert">
            {error}
          </p>
        )}
        {status && <p role="status">{status}</p>}

        <div className="ih-step-actions">
          <Button variant="outline" disabled={step === 0 || busy} onClick={() => go(step - 1)}>
            <ArrowLeft aria-hidden="true" /> Trước
          </Button>
          <Button variant="outline" disabled={busy} onClick={() => void persist()}>
            <Save aria-hidden="true" /> {busy ? "Đang lưu…" : "Lưu bản nháp"}
          </Button>
          {step < REVIEW_STEP ? (
            <Button
              disabled={busy}
              onClick={async () => {
                if (step === VERIFY_STEP) await persist(true);
                go(step + 1);
              }}
            >
              Tiếp theo <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button disabled={busy} aria-busy={busy} onClick={() => void finalSubmit()}>
              <Send aria-hidden="true" /> {busy ? "Đang gửi…" : "🚀 GỬI Ý TƯỞNG VÀO FUN COSMOS"}
            </Button>
          )}
        </div>
        <p className="ih-note">
          <Sparkles aria-hidden="true" size={14} /> Bản nháp được lưu trong tài khoản của bạn — câu
          chuyện ngắn hơn 1.000 ký tự vẫn lưu nháp được.
          <Check aria-hidden="true" size={14} />
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
