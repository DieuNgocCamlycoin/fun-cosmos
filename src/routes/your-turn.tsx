import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Download, Save } from "lucide-react";
import { TopicWorldShell, WorldSection } from "@/components/topic-world/topic-world";
import { ArchiveDisclosure } from "@/components/topic-world/living-scene";
import { CuratedArchive } from "@/components/topic-world/curated-archive";
import { IDEA_FIELDS, exportIdea } from "@/lib/idea-submission";
import { useIdeaDraft } from "@/lib/use-idea-draft";
import { useI18n } from "@/lib/i18n";
import { externalLink } from "@/lib/links";
import "@/components/topic-world/next-worlds.css";

export const Route = createFileRoute("/your-turn")({
  head: () => ({
    meta: [
      { title: "Your Turn — The cosmos begins with your idea | FUN COSMOS" },
      {
        name: "description",
        content:
          "Sketch your FUN COSMOS game idea in seven steps, save a draft, and send it to the team.",
      },
    ],
    links: [{ rel: "canonical", href: "/your-turn" }],
  }),
  component: YourTurnWorld,
});
const invitations = [
  ["Story", "Câu chuyện"],
  ["Character", "Nhân vật"],
  ["World", "Thế giới"],
  ["Music", "Âm nhạc"],
  ["AI", "Trí tuệ nhân tạo"],
  ["Game", "Trò chơi"],
  ["Code", "Mã code"],
  ["Community", "Cộng đồng"],
] as const;
const stepArt = [1, 2, 5, 4, 0, 2, 7] as const;
function YourTurnWorld() {
  const { locale, t } = useI18n();
  const { draft, update, save: saveDraft, ready, saveError } = useIdeaDraft();
  const ideaFields = IDEA_FIELDS.map((field) => field[locale]);
  const ideaHints = IDEA_FIELDS.map((field) => (locale === "en" ? field.hintEn : field.hintVi));
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState("");
  const input = useRef<HTMLTextAreaElement>(null);
  const count = draft.filter((v) => v.trim()).length;
  function go(next: number) {
    setStep(next);
    requestAnimationFrame(() => input.current?.focus({ preventScroll: true }));
  }
  function save() {
    setNotice(
      saveDraft()
        ? t("Draft saved on this device.", "Đã lưu bản nháp trên trình duyệt này.")
        : t(
            "Could not save locally. Download your idea card to keep it.",
            "Chưa thể lưu trên trình duyệt. Hãy tải thẻ ý tưởng để giữ lại nội dung.",
          ),
    );
  }
  function download() {
    exportIdea(draft, locale);
    setNotice(t("Your idea card is ready to download.", "Đã tạo tệp ý tưởng để tải xuống."));
  }
  return (
    <TopicWorldShell>
      <div className="nw yw">
        <section className="nw-arrival yw-arrival" aria-labelledby="your-turn-title">
          <img
            className="yw-father"
            src="/cosmos/your-turn-father-approved.png"
            alt=""
            aria-hidden="true"
          />
          <img className="yw-angel" src="/cosmos/your-turn-angel.png" alt="" aria-hidden="true" />
          <div className="nw-arrival-copy">
            <h1 id="your-turn-title" className="tw-metal">
              YOUR TURN
            </h1>
            <p className="nw-lead">
              {t("The cosmos begins", "Vũ trụ bắt đầu")}
              <br />
              {t("with your idea.", "từ ý tưởng của bạn.")}
            </p>
            <a className="tw-button" href="#sketch">
              {t("Create an idea card", "Tạo thẻ ý tưởng")} <ArrowDown size={18} />
            </a>
          </div>
          <div
            className="yw-invitations"
            aria-label={t("What will you create?", "Bạn sẽ sáng tạo điều gì?")}
          >
            <p>
              {t("What will you create in FUN COSMOS?", "Bạn sẽ sáng tạo gì trong FUN COSMOS?")}
            </p>
            <div className="yw-invitation-grid">
              {invitations.map(([en, vi], index) => (
                <a href="#sketch" key={en} onClick={() => go([1, 0, 1, 2, 3, 2, 2, 6][index] ?? 0)}>
                  <span
                    className="yw-medallion"
                    style={{
                      backgroundPosition: `${((index % 4) * 100) / 3}% ${Math.floor(index / 4) * 100}%`,
                    }}
                    aria-hidden="true"
                  />
                  <span>{t(en, vi)}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
        <nav className="tw-local" aria-label={t("In Your Turn", "Trong Your Turn")}>
          <a href="#sketch">{t("Seven small steps", "Bảy bước phác thảo")}</a>
          <a href="#idea-preview">{t("Idea card", "Thẻ ý tưởng")}</a>
          <a href="#archive">{t("Original artwork", "Tư liệu gốc")}</a>
        </nav>
        <WorldSection
          id="sketch"
          number="02"
          eyebrow="SEVEN SMALL STEPS"
          title={t("FROM AN IDEA TO A FIRST SKETCH.", "TỪ Ý TƯỞNG ĐẾN MỘT BẢN PHÁC THẢO.")}
        >
          <p className="tw-intro">
            {t(
              "Write in any order. Your draft stays on this device until you send it.",
              "Bạn có thể điền theo thứ tự bất kỳ. Bản nháp ở trên thiết bị cho đến khi bạn gửi.",
            )}
          </p>
          <div className="yw-workshop">
            <div>
              <div
                className="yw-building"
                aria-label={t(
                  `Sketch: ${count} of 7 parts written`,
                  `Bản phác thảo: ${count} trên 7 thành phần đã viết`,
                )}
              >
                <span
                  className="yw-active-medallion yw-medallion"
                  style={{
                    backgroundPosition: `${((stepArt[step]! % 4) * 100) / 3}% ${Math.floor(stepArt[step]! / 4) * 100}%`,
                  }}
                  aria-hidden="true"
                />
                <strong>{ideaFields[step]}</strong>
                <p>{ideaHints[step]}</p>
              </div>
            </div>
            <div className="yw-editor">
              <nav className="yw-steps" aria-label={t("Sketch steps", "Các bước phác thảo")}>
                {ideaFields.map((field, i) => (
                  <button
                    key={field}
                    aria-current={step === i ? "step" : undefined}
                    onClick={() => go(i)}
                  >
                    <small>{String(i + 1).padStart(2, "0")}</small>
                    <span>{field}</span>
                    {draft[i]?.trim() && <span aria-label={t("Completed", "Đã điền")}>✓</span>}
                  </button>
                ))}
              </nav>
              <label htmlFor="idea-answer">{ideaFields[step]}</label>
              <textarea
                id="idea-answer"
                ref={input}
                disabled={!ready}
                maxLength={1000}
                value={draft[step]}
                placeholder={ideaHints[step]}
                aria-describedby="idea-limit"
                onChange={(e) => {
                  update(step, e.target.value);
                  setNotice("");
                }}
              />
              <small id="idea-limit">
                {draft[step]?.length ?? 0} / 1000 {t("characters", "ký tự")}
              </small>
              <div className="yw-step-actions">
                <button className="tw-outline" disabled={step === 0} onClick={() => go(step - 1)}>
                  <ArrowLeft size={16} /> {t("Previous", "Trước")}
                </button>
                {step < 6 ? (
                  <button className="tw-button" onClick={() => go(step + 1)}>
                    {t("Next", "Tiếp theo")} <ArrowRight size={16} />
                  </button>
                ) : (
                  <a className="tw-button" href="#idea-preview">
                    {t("Review idea card", "Xem thẻ ý tưởng")} <ArrowDown size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="yw-save">
            <button className="tw-button" onClick={save} disabled={!ready || !count}>
              <Save size={18} /> {t("Save draft", "Lưu bản nháp")}
            </button>
            <button className="tw-outline" onClick={download} disabled={!count}>
              <Download size={18} /> {t("Download idea card", "Tải thẻ ý tưởng")}
            </button>
            <span>
              {saveError
                ? t("Local saving is unavailable", "Không thể lưu bản nháp trên thiết bị")
                : t("Draft saves as you write", "Bản nháp tự lưu khi bạn viết")}
            </span>
          </div>
          <p className="yw-status" role="status">
            {notice}
          </p>
        </WorldSection>
        <WorldSection
          id="idea-preview"
          number="03"
          eyebrow="REVIEW & SEND"
          title={t("SEND YOUR IDEA INTO THE COSMOS.", "GỬI Ý TƯỞNG VÀO VŨ TRỤ.")}
        >
          <div className="yw-save">
            <p>
              {t(
                "Turn your seven seeds into a story, share it, then submit for review.",
                "Kết nối bảy hạt giống thành câu chuyện, chia sẻ rồi gửi duyệt.",
              )}
            </p>
            <a className="tw-button" href="/tao-y-tuong">
              {t("Continue to Idea Creator", "Tiếp tục tạo câu chuyện")} <ArrowRight size={18} />
            </a>
            <a className="tw-outline" href="/idea-hub">
              {t("Explore Idea Hub", "Khám phá Idea Hub")}
            </a>
          </div>
          <details className="yw-preview-details">
            <summary>{t("Review my idea card", "Xem lại thẻ ý tưởng của tôi")}</summary>
            <article className="yw-preview">
              <header>
                <img src="/cosmos/cosmos.png" alt="" width="64" height="64" />
                <div>
                  <h3>{t("My FUN COSMOS", "FUN COSMOS của tôi")}</h3>
                  <p>
                    {count} / 7 {t("parts · First sketch", "thành phần · Bản phác thảo")}
                  </p>
                </div>
              </header>
              <dl>
                {count ? (
                  ideaFields.map((field, i) =>
                    draft[i]?.trim() ? (
                      <div key={field}>
                        <dt>{field}</dt>
                        <dd>{draft[i].trim()}</dd>
                      </div>
                    ) : null,
                  )
                ) : (
                  <div className="yw-preview-empty">
                    <dt>{t("Your first spark", "Tia sáng đầu tiên của bạn")}</dt>
                    <dd>
                      {t(
                        "Choose a step above, then write one line to begin.",
                        "Chọn một mục phía trên, rồi viết một dòng để bắt đầu.",
                      )}
                    </dd>
                  </div>
                )}
              </dl>
              <div className="yw-preview-actions">
                <a className="tw-outline" href="#sketch">
                  {t("Continue editing", "Tiếp tục chỉnh sửa")} <ArrowRight size={16} />
                </a>
                <button className="tw-button" onClick={download} disabled={!count}>
                  <Download size={18} /> {t("Download idea card", "Tải thẻ ý tưởng")}
                </button>
              </div>
            </article>
          </details>
        </WorldSection>
        <WorldSection
          id="archive"
          number="04"
          eyebrow="KNOWLEDGE ARCHIVE"
          title={t("MORE INSPIRATION FOR YOUR IDEA.", "THÊM CẢM HỨNG CHO Ý TƯỞNG.")}
        >
          <ArchiveDisclosure>
            <CuratedArchive images={[21, 26, 27]} />
          </ArchiveDisclosure>
        </WorldSection>
        <WorldSection
          id="continue"
          number="05"
          eyebrow="CONTINUE YOUR JOURNEY"
          title={t("TAKE YOUR IDEA INTO THE WORLD.", "MANG THEO Ý TƯỞNG. BƯỚC VÀO THẾ GIỚI.")}
          className="tw-finale"
        >
          <div className="tw-actions">
            <a className="tw-button" {...externalLink}>
              {t("PLAY NOW", "CHƠI NGAY")} <ArrowUpRight size={18} />
            </a>
            <a className="tw-outline" href="/angel-ai">
              {t("Meet Angel AI", "Gặp Angel AI")} <ArrowUpRight size={18} />
            </a>
            <a className="tw-outline" href="/ecosystem">
              {t("Explore the ecosystem", "Khám phá hệ sinh thái")}
            </a>
          </div>
        </WorldSection>
      </div>
    </TopicWorldShell>
  );
}
