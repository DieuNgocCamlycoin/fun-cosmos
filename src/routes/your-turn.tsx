import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Download, Save } from "lucide-react";
import { TopicWorldShell, WorldSection } from "@/components/topic-world/topic-world";
import { LivingScene, ArchiveDisclosure } from "@/components/topic-world/living-scene";
import { CuratedArchive } from "@/components/topic-world/curated-archive";
import { IDEA_STORAGE_KEY, ideaFields, ideaHints } from "@/components/topic-world/idea-draft";
import { externalLink } from "@/lib/links";
import "@/components/topic-world/next-worlds.css";

export const Route = createFileRoute("/your-turn")({
  head: () => ({
    meta: [
      { title: "Your Turn — Vũ trụ bắt đầu từ ý tưởng của bạn | FUN COSMOS" },
      {
        name: "description",
        content:
          "Phác thảo ý tưởng FUN COSMOS qua bảy bước: nhân vật, ước mơ, trải nghiệm, Angel AI và kết nối đời thật. Lưu bản nháp hoặc tải thẻ ý tưởng.",
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
  const [draft, setDraft] = useState<string[]>(Array(7).fill(""));
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false);
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(IDEA_STORAGE_KEY) || "null");
      if (
        Array.isArray(stored) &&
        stored.length === 7 &&
        stored.every((v) => typeof v === "string")
      ) {
        setDraft(stored);
        setNotice("Đã mở bản nháp lưu trên trình duyệt này.");
      }
    } catch {
      setNotice("Không đọc được bản nháp. Bạn vẫn có thể viết và tải thẻ ý tưởng.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const count = draft.filter((v) => v.trim()).length;
  function go(next: number) {
    setStep(next);
    requestAnimationFrame(() => input.current?.focus());
  }
  function save() {
    try {
      localStorage.setItem(IDEA_STORAGE_KEY, JSON.stringify(draft));
      setDirty(false);
      setNotice("Đã lưu bản nháp trên trình duyệt này.");
    } catch {
      setNotice("Chưa thể lưu trên trình duyệt. Hãy tải thẻ ý tưởng để giữ lại nội dung.");
    }
  }
  function download() {
    const blob = new Blob(
      [
        "FUN COSMOS — Ý tưởng của tôi\n\n" +
          ideaFields.map((f, i) => `${f}: ${draft[i]}`).join("\n\n"),
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fun-cosmos-y-tuong.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Đã tạo tệp ý tưởng để tải xuống.");
  }
  return (
    <TopicWorldShell>
      <div className="nw yw">
        <section className="nw-arrival yw-arrival" aria-labelledby="your-turn-title">
          <div className="nw-arrival-copy">
            <a className="tw-back" href="/">
              ← Về FUN COSMOS
            </a>
            <p className="tw-eyebrow">IMAGINE IT · CREATE IT · SHARE IT</p>
            <h1 id="your-turn-title" className="tw-metal">
              YOUR TURN
            </h1>
            <p className="nw-lead">
              Vũ trụ bắt đầu
              <br />
              từ ý tưởng của bạn.
            </p>
            <p>
              Bạn không cần biết tất cả.
              <br />
              Hãy bắt đầu từ điều mình yêu thích nhất.
            </p>
            <a className="tw-button" href="#sketch">
              Tạo thẻ ý tưởng <ArrowDown size={18} />
            </a>
          </div>
          <div className="yw-seed" aria-hidden="true">
            <img src="/cosmos/urantia-traveler.png" alt="" width="640" height="640" />
            <i />
            <i />
          </div>
        </section>
        <nav className="tw-local" aria-label="Trong Your Turn">
          <a href="#inspiration">Tìm cảm hứng</a>
          <a href="#sketch">Bảy bước phác thảo</a>
          <a href="#idea-preview">Thẻ ý tưởng</a>
          <a href="#archive">Tư liệu gốc</a>
        </nav>
        <WorldSection
          id="inspiration"
          number="02"
          eyebrow="START WITH WHAT YOU LOVE"
          title="ĐIỀU GÌ KHIẾN BẠN MUỐN BẮT ĐẦU?"
        >
          <LivingScene
            label="Chọn nguồn cảm hứng"
            character="/cosmos/urantia-traveler.png"
            moments={starts.map(([title, text], i) => ({
              title: title!,
              text: text!,
              asset: `/cosmos/${["planet", "profile", "earth", "play", "cosmos", "lovehub"][i]}.png`,
            }))}
          />
        </WorldSection>
        <WorldSection
          id="sketch"
          number="03"
          eyebrow="SEVEN SMALL STEPS"
          title="TỪ Ý TƯỞNG ĐẾN MỘT BẢN PHÁC THẢO."
        >
          <p className="tw-intro">
            Bản nháp lưu trên trình duyệt của bạn; chưa gửi đến hệ thống. Bạn có thể điền theo thứ
            tự bất kỳ.
          </p>
          <div className="yw-workshop">
            <div>
              <div
                className="yw-building"
                aria-label={`Bản phác thảo: ${count} trên 7 thành phần đã viết`}
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
                      style={{
                        width: 64,
                        height: 64,
                        left: `${12 + (i % 3) * 29}%`,
                        top: `${14 + Math.floor(i / 3) * 25}%`,
                        opacity: draft[i]?.trim() ? 1 : 0.18,
                        transform: `scale(${draft[i]?.trim() ? 1 : 0.75})`,
                      }}
                    />
                  ),
                )}
                <small>{count} / 7 · Minh họa tiến độ phác thảo</small>
              </div>
              <nav className="yw-steps" aria-label="Các bước phác thảo">
                {ideaFields.map((field, i) => (
                  <button
                    key={field}
                    aria-current={step === i ? "step" : undefined}
                    onClick={() => go(i)}
                  >
                    <small>{String(i + 1).padStart(2, "0")}</small>
                    <span>{field}</span>
                    {draft[i]?.trim() && <span aria-label="Đã điền">✓</span>}
                  </button>
                ))}
              </nav>
            </div>
            <div className="yw-editor">
              <p className="tw-eyebrow">
                {step + 1} / 7 · {count} phần đã viết
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
                  setDraft((d) => d.map((v, i) => (i === step ? e.target.value : v)));
                  setDirty(true);
                  setNotice("");
                }}
              />
              <small id="idea-limit">{draft[step]?.length ?? 0} / 1000 ký tự</small>
              <div className="yw-step-actions">
                <button className="tw-outline" disabled={step === 0} onClick={() => go(step - 1)}>
                  <ArrowLeft size={16} /> Trước
                </button>
                {step < 6 ? (
                  <button className="tw-button" onClick={() => go(step + 1)}>
                    Tiếp theo <ArrowRight size={16} />
                  </button>
                ) : (
                  <a className="tw-button" href="#idea-preview">
                    Xem thẻ ý tưởng <ArrowDown size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="yw-save">
            <button className="tw-button" onClick={save} disabled={!ready || !count}>
              <Save size={18} /> Lưu bản nháp
            </button>
            <button className="tw-outline" onClick={download} disabled={!count}>
              <Download size={18} /> Tải thẻ ý tưởng
            </button>
            <span>{dirty ? "Có thay đổi chưa lưu" : ""}</span>
          </div>
          <p className="yw-status" role="status">
            {notice}
          </p>
        </WorldSection>
        <WorldSection
          id="idea-preview"
          number="04"
          eyebrow="YOUR IDEA CARD"
          title="ĐÂY LÀ KHỞI ĐẦU CỦA BẠN."
        >
          <article className="yw-preview">
            <header>
              <img src="/cosmos/cosmos.png" alt="" width="64" height="64" />
              <div>
                <h3>FUN COSMOS của tôi</h3>
                <p>{count} / 7 thành phần · Bản phác thảo</p>
              </div>
            </header>
            <dl>
              {ideaFields.map((field, i) => (
                <div key={field}>
                  <dt>{field}</dt>
                  <dd>{draft[i]?.trim() || "Chưa phác thảo"}</dd>
                </div>
              ))}
            </dl>
            <button className="tw-button" onClick={download} disabled={!count}>
              <Download size={18} /> Tải thẻ ý tưởng
            </button>
          </article>
        </WorldSection>
        <WorldSection
          id="archive"
          number="05"
          eyebrow="KNOWLEDGE ARCHIVE"
          title="THÊM CẢM HỨNG CHO Ý TƯỞNG."
        >
          <ArchiveDisclosure>
            <CuratedArchive images={[21, 26, 27]} />
          </ArchiveDisclosure>
        </WorldSection>
        <WorldSection
          id="continue"
          number="06"
          eyebrow="CONTINUE YOUR JOURNEY"
          title="MANG THEO Ý TƯỞNG. BƯỚC VÀO THẾ GIỚI."
          className="tw-finale"
        >
          <div className="tw-actions">
            <a className="tw-button" {...externalLink}>
              CHƠI NGAY <ArrowUpRight size={18} />
            </a>
            <a className="tw-outline" href="/angel-ai">
              Gặp Angel AI <ArrowUpRight size={18} />
            </a>
            <a className="tw-outline" href="/ecosystem">
              Khám phá hệ sinh thái
            </a>
          </div>
        </WorldSection>
      </div>
    </TopicWorldShell>
  );
}
