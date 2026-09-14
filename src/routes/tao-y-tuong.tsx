import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Check, Copy, Save, Send, Sparkles } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { useCreatorAuth } from "@/hooks/use-creator-auth";
import { saveIdeaDraft, submitIdea, getMyIdea } from "@/lib/ideas.functions";
import {
  DRAFT_CACHE_KEY,
  creatorSteps,
  ideaCategories,
  loveScoreNote,
  rewardNotice,
} from "@/lib/idea-content";
import "@/living.css";
import "@/components/idea-hub.css";

export const Route = createFileRoute("/tao-y-tuong")({
  head: () => ({
    meta: [
      { title: "Tạo ý tưởng FUN COSMOS — 7 bước đồng sáng tạo" },
      {
        name: "description",
        content:
          "Phác thảo ý tưởng FUN COSMOS qua bảy bước: nhân vật, ước mơ, trải nghiệm, Angel AI, phần thưởng, thế giới thay đổi và kết nối đời thật.",
      },
      { property: "og:title", content: "Tạo ý tưởng FUN COSMOS — 7 bước đồng sáng tạo" },
      {
        property: "og:description",
        content: "Viết ý tưởng của bạn, lưu bản nháp và gửi tới cộng đồng FUN COSMOS.",
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
  facebookUrl: "",
  telegram: "",
  funRichUrl: "",
  recipientWallet: "",
  consentAccuracy: false,
  consentPublic: false,
});

const stepKeys = ["characterDescription", "dream", "gameplay", "angelAi", "reward", "worldChange", "realWorldConnection"] as const;

function CreateIdeaPage() {
  const { ready, session, email } = useCreatorAuth();
  const navigate = useNavigate();
  const save = useServerFn(saveIdeaDraft);
  const send = useServerFn(submitIdea);
  const load = useServerFn(getMyIdea);

  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [serverUpdatedAt, setServerUpdatedAt] = useState<string | undefined>();
  const [step, setStep] = useState(0); // 0..6 content, 7 metadata, 8 verification, 9 review
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ code: string; submittedAt: string } | null>(null);
  const firstField = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (ready && !session) void navigate({ to: "/tai-khoan", search: { redirect: "/tao-y-tuong" } as never });
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
          setDraft({
            id: remote.idea.id,
            title: remote.idea.title,
            summary: remote.idea.summary,
            category: remote.idea.category,
            tags: remote.tags,
            characterName: remote.idea.character_name,
            characterDescription: remote.idea.character_description,
            dream: remote.idea.dream,
            gameplay: remote.idea.gameplay,
            angelAi: remote.idea.angel_ai,
            reward: remote.idea.reward,
            worldChange: remote.idea.world_change,
            realWorldConnection: remote.idea.real_world_connection,
            facebookUrl: remote.details?.facebook_url ?? "",
            telegram: remote.details?.telegram ?? "",
            funRichUrl: remote.details?.fun_rich_url ?? "",
            recipientWallet: remote.details?.recipient_wallet ?? "",
            consentAccuracy: remote.details?.consent_accuracy ?? false,
            consentPublic: remote.details?.consent_public ?? false,
          });
          setServerUpdatedAt(remote.idea.updated_at);
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

  async function persist(silent = false) {
    setBusy(true);
    setError("");
    try {
      const saved = await save({
        data: { ...draft, clientUpdatedAt: serverUpdatedAt },
      });
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
      <div className="tw">
        <SiteHeader />
        <main className="ih-page">
          <p>Đang tải…</p>
        </main>
        <SiteFooter />
      </div>
    );

  if (result)
    return (
      <div className="tw">
        <SiteHeader />
        <main className="ih-page">
          <section className="ih-success">
            <h1>🎉 Ý TƯỞNG ĐÃ ĐƯỢC GỬI!</h1>
            <p>Cảm ơn bạn đã cùng kiến tạo FUN COSMOS.</p>
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
            <p className="ih-note">{rewardNotice}</p>
            <div className="lc-actions">
              <Button onClick={() => navigator.clipboard.writeText(result.code)}>
                <Copy aria-hidden="true" /> Sao chép mã
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
                Tạo ý tưởng khác
              </Button>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );

  const totalSteps = 10;
  const contentStep = step < 7 ? creatorSteps[step]! : null;

  return (
    <div className="tw">
      <SiteHeader />
      <main className="ih-page ih-creator">
        <header className="ih-creator-head">
          <p className="lc-eyebrow">✧ YOUR TURN • CO-CREATE FUN COSMOS</p>
          <h1>TẠO Ý TƯỞNG CỦA BẠN</h1>
          <div className="ih-progress" aria-label={`Bước ${step + 1} trên ${totalSteps}`}>
            <span style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
          </div>
          <p className="ih-progress-label">
            {step < 7 ? `${step + 1} / 7 · ${contentStep?.english}` : step === 7 ? "Thông tin bài" : step === 8 ? "Xác minh tham gia" : "Xem lại ý tưởng"}
          </p>
        </header>

        {step < 7 && contentStep && (
          <section className="ih-card">
            <p className="lc-eyebrow">
              BƯỚC {String(step + 1).padStart(2, "0")} · {contentStep.english}
            </p>
            <h2>{contentStep.title}</h2>
            <p className="ih-question">{contentStep.question}</p>
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
                placeholder={contentStep.hint}
                onChange={(e) => set(stepKeys[step]!, e.target.value)}
              />
            </label>
            {step === 4 && <p className="ih-note">{loveScoreNote}</p>}
            {step === 6 && <p className="ih-note">Bước này là tùy chọn — bạn có thể ghi “Chưa có / Không áp dụng.”</p>}
          </section>
        )}

        {step === 7 && (
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

        {step === 8 && (
          <section className="ih-card">
            <h2>XÁC MINH THAM GIA</h2>
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

        {step === 9 && (
          <section className="ih-card ih-review">
            <h2>XEM LẠI Ý TƯỞNG</h2>
            <h3>{draft.title || "Chưa có tiêu đề"}</h3>
            <p>{draft.summary}</p>
            <dl>
              <div>
                <dt>Nhân vật</dt>
                <dd>
                  {draft.characterName} — {draft.characterDescription}
                </dd>
              </div>
              <div>
                <dt>Ước mơ</dt>
                <dd>{draft.dream}</dd>
              </div>
              <div>
                <dt>Trải nghiệm</dt>
                <dd>{draft.gameplay}</dd>
              </div>
              <div>
                <dt>Angel AI</dt>
                <dd>{draft.angelAi}</dd>
              </div>
              <div>
                <dt>Phần thưởng / ghi nhận</dt>
                <dd>{draft.reward}</dd>
              </div>
              <div>
                <dt>Thế giới thay đổi</dt>
                <dd>{draft.worldChange}</dd>
              </div>
              <div>
                <dt>Kết nối đời thật</dt>
                <dd>{draft.realWorldConnection || "Chưa có / Không áp dụng."}</dd>
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
          {step < 9 ? (
            <Button
              disabled={busy}
              onClick={async () => {
                if (step === 8) await persist(true);
                go(step + 1);
              }}
            >
              Tiếp theo <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button disabled={busy} onClick={() => void finalSubmit()}>
              <Send aria-hidden="true" /> {busy ? "Đang gửi…" : "Gửi ý tưởng"}
            </Button>
          )}
        </div>
        <p className="ih-note">
          <Sparkles aria-hidden="true" size={14} /> Bản nháp được lưu trong tài khoản của bạn.
          <Check aria-hidden="true" size={14} />
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
