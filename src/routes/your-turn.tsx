import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Download, Save } from "lucide-react";
import { TopicWorldShell, WorldSection } from "@/components/topic-world/topic-world";
import { LivingScene, ArchiveDisclosure } from "@/components/topic-world/living-scene";
import { CuratedArchive } from "@/components/topic-world/curated-archive";
import { IDEA_FIELDS, exportIdea } from "@/lib/idea-submission";
import { useIdeaDraft } from "@/lib/use-idea-draft";
import { useI18n } from "@/lib/i18n";
import { IdeaSubmissionForm } from "@/components/idea-submission-form";
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
const starts = [
  ["Câu chuyện", "Một câu chuyện bạn muốn kể bắt đầu ở đâu?"],
  ["Nhân vật", "Người bạn muốn trở thành có điều gì đặc biệt?"],
  ["Thế giới", "Bạn muốn tạo khu vườn, thành phố hay một nơi gặp gỡ?"],
  ["Âm nhạc", "Âm thanh nào khiến thế giới của bạn trở nên sống động?"],
  ["Game & code", "Bạn muốn tạo một nhiệm vụ hay một trải nghiệm mới?"],
  ["Cộng đồng", "Bạn muốn cùng ai làm nên điều gì?"],
];
function YourTurnWorld() {
  const { locale, t } = useI18n();
  const startsEn = [
    ["Story", "Where does the story you want to tell begin?"],
    ["Character", "What is special about the person you want to become?"],
    ["World", "Would you build a garden, a city or a place to meet?"],
    ["Music", "What sound makes your world come alive?"],
    ["Game & code", "Would you make a quest or a new experience?"],
    ["Community", "Who would you create something with?"],
  ];
  const { draft, update, save: saveDraft, ready, saveError } = useIdeaDraft();
  const ideaFields = IDEA_FIELDS.map((field) => field[locale]);
  const ideaHints = IDEA_FIELDS.map((field) => (locale === "en" ? field.hintEn : field.hintVi));
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState("");
  const input = useRef<HTMLTextAreaElement>(null);
  const count = draft.filter((v) => v.trim()).length;
  function go(next: number) {
    setStep(next);
    requestAnimationFrame(() => input.current?.focus());
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
          <div className="nw-arrival-copy">
            <a className="tw-back" href="/">
              ← {t("Back to FUN COSMOS", "Về FUN COSMOS")}
            </a>
            <p className="tw-eyebrow">IMAGINE IT · CREATE IT · SHARE IT</p>
            <h1 id="your-turn-title" className="tw-metal">
              YOUR TURN
            </h1>
            <p className="nw-lead">
              {t("The cosmos begins", "Vũ trụ bắt đầu")}
              <br />
              {t("with your idea.", "từ ý tưởng của bạn.")}
            </p>
            <p>
              {t("You don't need to know everything.", "Bạn không cần biết tất cả.")}
              <br />
              {t("Start with what you love most.", "Hãy bắt đầu từ điều mình yêu thích nhất.")}
            </p>
            <a className="tw-button" href="#sketch">
              {t("Create an idea card", "Tạo thẻ ý tưởng")} <ArrowDown size={18} />
            </a>
          </div>
          <div className="yw-seed" aria-hidden="true">
            <img src="/cosmos/urantia-traveler.png" alt="" width="640" height="640" />
            <i />
            <i />
          </div>
        </section>
        <nav className="tw-local" aria-label={t("In Your Turn", "Trong Your Turn")}>
          <a href="#inspiration">{t("Find inspiration", "Tìm cảm hứng")}</a>
          <a href="#sketch">{t("Seven small steps", "Bảy bước phác thảo")}</a>
          <a href="#idea-preview">{t("Idea card", "Thẻ ý tưởng")}</a>
          <a href="#archive">{t("Original artwork", "Tư liệu gốc")}</a>
        </nav>
        <WorldSection
          id="inspiration"
          number="02"
          eyebrow="START WITH WHAT YOU LOVE"
          title={t("WHAT INSPIRES YOU TO BEGIN?", "ĐIỀU GÌ KHIẾN BẠN MUỐN BẮT ĐẦU?")}
        >
          <LivingScene
            label={t("Choose an inspiration", "Chọn nguồn cảm hứng")}
            character="/cosmos/urantia-traveler.png"
            onChoose={(index) => go([1, 0, 1, 2, 2, 6][index] ?? 0)}
            moments={starts.map(([title, text], i) => ({
              title: locale === "en" ? startsEn[i]![0]! : title!,
              text: locale === "en" ? startsEn[i]![1]! : text!,
              asset: `/cosmos/${["planet", "profile", "earth", "play", "cosmos", "lovehub"][i]}.png`,
            }))}
          />
        </WorldSection>
        <WorldSection
          id="sketch"
          number="03"
          eyebrow="SEVEN SMALL STEPS"
          title={t("FROM AN IDEA TO A FIRST SKETCH.", "TỪ Ý TƯỞNG ĐẾN MỘT BẢN PHÁC THẢO.")}
        >
          <p className="tw-intro">
            {t(
              "Your draft is saved on this device and has not been submitted. Fill the steps in any order.",
              "Bản nháp lưu trên trình duyệt của bạn; chưa gửi đến hệ thống. Bạn có thể điền theo thứ tự bất kỳ.",
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
                {["cosmos", "planet", "play", "angel", "plp", "earth", "lovehub"].map(
                  (asset, i) => (
                    <img
                      key={asset}
                      src={`/cosmos/${asset}.png`}
                      alt=""
                      width="72"
                      height="72"
                      loading="lazy"
                      data-active={step === i}
                      style={{
                        width: 64,
                        height: 64,
                        left: `${12 + (i % 3) * 29}%`,
                        top: `${14 + Math.floor(i / 3) * 25}%`,
                        opacity: draft[i]?.trim() || step === i ? 1 : 0.26,
                        transform: `scale(${draft[i]?.trim() || step === i ? 1 : 0.75})`,
                      }}
                    />
                  ),
                )}
                <small>
                  {count} / 7 · {t("Sketch progress", "Minh họa tiến độ phác thảo")}
                </small>
              </div>
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
            </div>
            <div className="yw-editor">
              <p className="tw-eyebrow">
                {step + 1} / 7 · {count} {t("parts written", "phần đã viết")}
              </p>
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
          number="04"
          eyebrow="YOUR IDEA CARD"
          title={t("THIS IS YOUR BEGINNING.", "ĐÂY LÀ KHỞI ĐẦU CỦA BẠN.")}
        >
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
                      "Choose an inspiration above, then write one line to begin.",
                      "Chọn một cảm hứng phía trên, rồi viết một dòng để bắt đầu.",
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
          <IdeaSubmissionForm fields={draft} />
        </WorldSection>
        <WorldSection
          id="archive"
          number="05"
          eyebrow="KNOWLEDGE ARCHIVE"
          title={t("MORE INSPIRATION FOR YOUR IDEA.", "THÊM CẢM HỨNG CHO Ý TƯỞNG.")}
        >
          <ArchiveDisclosure>
            <CuratedArchive images={[21, 26, 27]} />
          </ArchiveDisclosure>
        </WorldSection>
        <WorldSection
          id="continue"
          number="06"
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
