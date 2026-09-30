import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useCreatorAuth } from "@/hooks/use-creator-auth";
import {
  getMyIdea,
  getMyRewardIdentity,
  getUnifiedProgramStatus,
  saveIdeaDraft,
  submitIdea,
} from "@/lib/ideas.functions";
import { buildShareText, PROGRAM_HASHTAGS, STORY_MAX, STORY_MIN } from "@/lib/idea-content";
import { sketchContent } from "@/lib/idea-sketch";
import { checkProgram } from "@/lib/idea-program";
import { useI18n } from "@/lib/i18n";

type ProgramDraft = {
  id?: string;
  updatedAt?: string;
  title: string;
  story: string;
  facebookPostUrl: string;
  funRichPostUrl: string;
  funRichUrl: string;
  recipientWallet: string;
};
const KEY = "fun-cosmos-unified-idea-program-v1";
const blank = (): ProgramDraft => ({
  title: "",
  story: "",
  facebookPostUrl: "",
  funRichPostUrl: "",
  funRichUrl: "",
  recipientWallet: "",
});

export function IdeaProgramSubmit({
  fields,
  restoreFields,
}: {
  fields: readonly string[];
  restoreFields: (values: string[]) => void;
}) {
  const { t } = useI18n();
  const { ready, session, emailVerified } = useCreatorAuth();
  const save = useServerFn(saveIdeaDraft);
  const submitIdeaFn = useServerFn(submitIdea);
  const load = useServerFn(getMyIdea);
  const loadIdentity = useServerFn(getMyRewardIdentity);
  const programStatus = useServerFn(getUnifiedProgramStatus);
  const [serviceReady, setServiceReady] = useState<boolean | null>(null);
  const [draft, setDraft] = useState<ProgramDraft>(blank);
  const [stage, setStage] = useState(0);
  const [consent, setConsent] = useState(false);
  const [publicLinksConsent, setPublicLinksConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [saveState, setSaveState] = useState("");
  const lock = useRef(false);
  const owner = session?.user.id;
  const storyLength = draft.story.trim().length;

  useEffect(() => {
    void programStatus()
      .then((result) => setServiceReady(result.ready))
      .catch(() => setServiceReady(false));
  }, [programStatus]);
  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(KEY) || "null") as ProgramDraft | null;
      if (cached) setDraft({ ...blank(), ...cached });
    } catch {
      setSaveState("Chưa đọc được bản lưu trên thiết bị.");
    }
  }, []);
  useEffect(() => {
    const editing = new URLSearchParams(location.search).get("id");
    if (!owner) return;
    if (!editing) {
      void loadIdentity()
        .then((identity) =>
          setDraft((current) => ({
            ...current,
            funRichUrl: current.funRichUrl || identity.funRichUrl,
            recipientWallet: current.recipientWallet || identity.recipientWallet,
          })),
        )
        .catch(() => {});
      return;
    }
    let active = true;
    void load({ data: { id: editing } })
      .then((remote) => {
        if (!active) return;
        const idea = remote.idea as typeof remote.idea & {
          story?: string;
          facebook_post_url?: string;
          fun_rich_post_url?: string;
          facebook_post_public_consent?: boolean;
        };
        const values = [
          idea.character_description,
          idea.dream,
          idea.gameplay,
          idea.angel_ai,
          idea.reward,
          idea.world_change,
          idea.real_world_connection,
        ];
        restoreFields(values);
        let cached: ProgramDraft | null = null;
        try {
          cached = JSON.parse(localStorage.getItem(KEY) || "null");
        } catch {
          /* use server draft */
        }
        const fromServer: ProgramDraft = {
          id: idea.id,
          updatedAt: idea.updated_at,
          title: idea.title,
          story: idea.story || "",
          facebookPostUrl: idea.facebook_post_url || "",
          funRichPostUrl: idea.fun_rich_post_url || "",
          funRichUrl: remote.details?.fun_rich_url || "",
          recipientWallet: remote.details?.recipient_wallet || "",
        };
        setDraft(cached?.id === idea.id ? { ...fromServer, ...cached } : fromServer);
        setPublicLinksConsent(Boolean(idea.facebook_post_public_consent));
      })
      .catch(() => {
        if (active)
          setError("Chưa mở được bài từ tài khoản. Bản lưu trên thiết bị vẫn được giữ lại.");
      });
    return () => {
      active = false;
    };
    // Only initialize editing once per account/idea. Draft edits must not trigger another load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner]);
  function change<K extends keyof ProgramDraft>(key: K, value: ProgramDraft[K]) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    setError("");
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setSaveState("Đã lưu trên thiết bị");
    } catch {
      setSaveState("Chưa lưu được trên thiết bị — hãy sao chép nội dung trước khi rời trang.");
    }
  }
  async function saveToAccount(quiet = false) {
    if (!owner) throw new Error("Đăng nhập để lưu bản nháp vào tài khoản.");
    if (!serviceReady)
      throw new Error("Cơ sở dữ liệu chương trình chưa sẵn sàng. Bản nháp vẫn lưu trên thiết bị.");
    const content = sketchContent(fields);
    const title = draft.title.trim() || content.title;
    const summary = (content.summary.length >= 10 ? content.summary : draft.story.trim()).slice(
      0,
      500,
    );
    const saved = await save({
      data: {
        ...content,
        title,
        summary,
        story: draft.story,
        facebookPostUrl: draft.facebookPostUrl,
        funRichPostUrl: draft.funRichPostUrl,
        funRichUrl: draft.funRichUrl,
        recipientWallet: draft.recipientWallet,
        consentAccuracy: consent,
        consentPublic: publicLinksConsent,
        facebookPostPublicConsent: publicLinksConsent,
        id: draft.id,
        clientUpdatedAt: draft.updatedAt,
      },
    });
    const next = { ...draft, id: saved.id, updatedAt: saved.updatedAt };
    setDraft(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* server copy succeeded */
    }
    if (!quiet) setSaveState("Đã lưu vào tài khoản");
    return saved.id;
  }
  async function saveDraft() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      await saveToAccount();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Chưa lưu được. Nội dung trên màn hình vẫn còn.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function send() {
    if (lock.current) return;
    const problem = checkProgram(draft, consent);
    if (problem) {
      setStage(problem.stage);
      setError(problem.message);
      return;
    }
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const id = await saveToAccount(true);
      const result = await submitIdeaFn({ data: { id, website: "" } });
      setCode(result.code);
      setSaveState("Đã gửi thành công");
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* receipt remains visible */
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Chưa gửi được. Bản nháp vẫn được giữ lại.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  async function copyPost() {
    try {
      await navigator.clipboard.writeText(buildShareText(draft.title, draft.story));
      setSaveState("Đã sao chép bài viết và 3 hashtag.");
    } catch {
      setError("Chưa sao chép được. Hãy chọn và sao chép nội dung thủ công.");
    }
  }
  return (
    <section className="idea-submit-form yw-program" aria-labelledby="yw-program-heading">
      <h3 id="yw-program-heading">
        {t(
          "Share your story & join the reward program",
          "CHIA SẺ CÂU CHUYỆN · THAM GIA NHẬN THƯỞNG",
        )}
      </h3>
      <p>
        {t(
          "Selected ideas receive 99,999 CAMLY or more, after admin review.",
          "Ý tưởng được chọn nhận từ 99.999 CAMLY, theo quyết định của Admin.",
        )}
      </p>
      <nav className="yw-program-steps" aria-label="Các bước tham gia">
        {[
          ["1 · Ý tưởng & câu chuyện", "1 · Idea & story"],
          ["2 · Đăng bài & nhận thưởng", "2 · Posts & reward"],
          ["3 · Xem lại & gửi", "3 · Review & send"],
        ].map(([vi, en], i) => (
          <button
            key={i}
            type="button"
            aria-current={stage === i ? "step" : undefined}
            onClick={() => {
              setStage(i);
              setError("");
            }}
          >
            {t(en!, vi!)}
          </button>
        ))}
      </nav>
      {code ? (
        <div role="status" className="idea-submit-success">
          <strong>Đã gửi bài tham gia</strong>
          <p>
            Mã tiếp nhận: <code>{code}</code>
          </p>
          <a href="/y-tuong-cua-toi">Mở Ý tưởng của tôi →</a>
        </div>
      ) : (
        <>
          {stage === 0 && (
            <div className="yw-program-panel">
              <label htmlFor="yw-title">Tên ý tưởng</label>
              <input
                id="yw-title"
                maxLength={140}
                value={draft.title}
                onChange={(e) => change("title", e.target.value)}
                placeholder="Ví dụ: Khách sạn trong FUN COSMOS"
              />
              <label htmlFor="yw-story">Câu chuyện về ý tưởng · tối thiểu 1.000 ký tự</label>
              <textarea
                id="yw-story"
                value={draft.story}
                maxLength={STORY_MAX}
                onChange={(e) => change("story", e.target.value)}
                placeholder="Nhân vật bắt đầu hành trình như thế nào? Họ gặp ai, khám phá và tạo ra điều gì?"
              />
              <p role="status">
                {storyLength.toLocaleString("vi-VN")} / 1.000 ký tự{" "}
                {storyLength < STORY_MIN
                  ? `· còn ${STORY_MIN - storyLength} ký tự`
                  : "· đã đủ độ dài"}
              </p>
              <p>Bảy ý phía trên là gợi ý tùy chọn, không cần điền lại.</p>
              <button
                type="button"
                className="tw-button"
                onClick={() => {
                  if (storyLength < STORY_MIN) {
                    setError(`Câu chuyện còn thiếu ${STORY_MIN - storyLength} ký tự.`);
                    return;
                  }
                  setStage(1);
                  setError("");
                }}
              >
                Tiếp tục đăng bài →
              </button>
            </div>
          )}
          {stage === 1 && (
            <div className="yw-program-panel">
              <p>
                Đăng cùng câu chuyện ở chế độ công khai trên Facebook và FUN.Rich, kèm ba hashtag:
              </p>
              <strong>{PROGRAM_HASHTAGS}</strong>
              <button type="button" className="tw-outline" onClick={() => void copyPost()}>
                Sao chép bài viết và hashtag
              </button>
              <label htmlFor="yw-facebook-post">Link bài đăng Facebook</label>
              <input
                id="yw-facebook-post"
                type="url"
                value={draft.facebookPostUrl}
                onChange={(e) => change("facebookPostUrl", e.target.value)}
                placeholder="https://www.facebook.com/..."
              />
              <label htmlFor="yw-fun-post">Link bài đăng FUN.Rich</label>
              <input
                id="yw-fun-post"
                type="url"
                value={draft.funRichPostUrl}
                onChange={(e) => change("funRichPostUrl", e.target.value)}
                placeholder="https://fun.rich/..."
              />
              <label htmlFor="yw-fun-profile">Link hồ sơ FUN.Rich nhận thưởng</label>
              <input
                id="yw-fun-profile"
                type="url"
                value={draft.funRichUrl}
                onChange={(e) => change("funRichUrl", e.target.value)}
                placeholder="https://fun.rich/username"
              />
              <label htmlFor="yw-wallet">Ví BNB Smart Chain nhận CAMLY</label>
              <input
                id="yw-wallet"
                value={draft.recipientWallet}
                onChange={(e) => change("recipientWallet", e.target.value)}
                placeholder="0x…"
              />
              <p>
                Chỉ Ban quản trị xem ví. Kết nối tài khoản FUN.Rich trực tiếp sẽ mở khi FUN.Rich
                cung cấp cách xác minh tài khoản.
              </p>
              <button
                type="button"
                className="tw-button"
                onClick={() => {
                  setStage(2);
                  setError("");
                }}
              >
                Xem lại bài →
              </button>
            </div>
          )}
          {stage === 2 && (
            <div className="yw-program-panel">
              <h4>{draft.title || "Chưa có tên ý tưởng"}</h4>
              <p>
                {storyLength.toLocaleString("vi-VN")} ký tự ·{" "}
                {fields.filter((x) => x.trim()).length}/7 ý gợi ý
              </p>
              <p>Facebook: {draft.facebookPostUrl || "Chưa có"}</p>
              <p>FUN.Rich: {draft.funRichPostUrl || "Chưa có"}</p>
              <p>Tài khoản nhận thưởng: {draft.funRichUrl || "Chưa có"}</p>
              <p>
                Ví:{" "}
                {draft.recipientWallet
                  ? `${draft.recipientWallet.slice(0, 8)}…${draft.recipientWallet.slice(-6)}`
                  : "Chưa có"}
              </p>
              <label className="idea-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  Đây là ý tưởng của tôi. Tôi đồng ý gửi xét duyệt; chỉ bài được duyệt mới hiển thị
                  trong cộng đồng Build &amp; Bounty.
                </span>
              </label>
              <label className="idea-consent">
                <input
                  type="checkbox"
                  checked={publicLinksConsent}
                  onChange={(e) => setPublicLinksConsent(e.target.checked)}
                />
                <span>
                  Cho phép hiển thị hai link bài đăng công khai trên Build &amp; Bounty khi ý tưởng
                  được duyệt (tùy chọn).
                </span>
              </label>
              <button
                type="button"
                className="tw-button"
                disabled={busy || !consent || !ready || !session || !emailVerified || !serviceReady}
                onClick={() => void send()}
              >
                {busy ? "Đang gửi…" : "GỬI THAM GIA CHƯƠNG TRÌNH"}
              </button>
            </div>
          )}
          {serviceReady === false && (
            <p role="status">
              Hệ thống nhận bài đang nâng cấp. Nội dung vẫn được lưu trên thiết bị; vui lòng thử lại
              sau.
            </p>
          )}
          {!ready ? (
            <p>Đang kiểm tra tài khoản…</p>
          ) : !session ? (
            <a className="tw-button" href="/tai-khoan?redirect=%2Fyour-turn%23idea-preview">
              Đăng nhập FUN COSMOS để gửi
            </a>
          ) : !emailVerified ? (
            <a className="tw-button" href="/tai-khoan?redirect=%2Fyour-turn%23idea-preview">
              Xác minh email để gửi
            </a>
          ) : (
            <button
              type="button"
              className="tw-outline"
              disabled={busy}
              onClick={() => void saveDraft()}
            >
              Lưu vào Ý tưởng của tôi
            </button>
          )}
          {error && (
            <p className="idea-submit-error" role="alert">
              {error}
            </p>
          )}
          {saveState && <p role="status">{saveState}</p>}
          <a href="/y-tuong-cua-toi">Mở Ý tưởng của tôi →</a>
        </>
      )}
    </section>
  );
}
