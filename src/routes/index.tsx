import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { UrantiaCosmosScene } from "@/components/urantia-cosmos-scene";
import { TopicGallery } from "@/components/topic-gallery";
import { CosmosCinema } from "@/components/cosmos-cinema";
import { CosmosStoryGallery } from "@/components/cosmos-story-gallery";
import { GameWorlds } from "@/components/game-worlds";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowDown, ArrowRight, ExternalLink, Download, Check, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { platforms, roles } from "@/components/living-data";

import fatherPortrait from "@/assets/father-welcome.jpg";
const heroFallback = "/cosmos/portal.jpg";
import angelFallback from "@/assets/angel-web.jpg";
import "@/living.css";
import "@/components/cosmos-consolidation.css";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FUN COSMOS — Play the Cosmos, Live in Heaven" },
      {
        name: "description",
        content: "Khám phá, học hỏi, sáng tạo và kết nối trong vũ trụ nhập vai 5D FUN COSMOS.",
      },
      { property: "og:title", content: "FUN COSMOS — Play the Cosmos, Live in Heaven" },
      {
        property: "og:description",
        content: "Khám phá, học hỏi, sáng tạo và cùng nhau kiến tạo tương lai trong FUN COSMOS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});
const fields = [
  "Nhân vật",
  "Ước mơ",
  "Trải nghiệm / nhiệm vụ",
  "Angel AI hỗ trợ gì?",
  "Ghi nhận mong muốn",
  "Thế giới thay đổi thế nào?",
  "Kết nối với đời thật",
];
function Heading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="lc-heading">
      <span className="lc-eyebrow">✧ {label}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
function Index() {
  const [active, setActive] = useState("home"),
    [paused, setPaused] = useState(false),
    [role, setRole] = useState(1),
    [planet, setPlanet] = useState(0),
    [ideaOpen, setIdeaOpen] = useState(false),
    [draft, setDraft] = useState<string[]>(Array(7).fill("")),
    [notice, setNotice] = useState("");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const header = document.querySelector(".fc-header")?.getBoundingClientRect().height ?? 76;
      const sections = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
      const readingLine = Math.max(header + 80, window.innerHeight * 0.45);
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= readingLine && rect.bottom > readingLine;
      });
      if (current) {
        const chapter = current.dataset["chapter"];
        setActive(chapter && chapter !== "true" ? chapter : current.id);
      }
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  function openIdea() {
    try {
      const stored = JSON.parse(localStorage.getItem("fun-cosmos-idea-v2") || "null");
      if (
        Array.isArray(stored) &&
        stored.length === 7 &&
        stored.every((v) => typeof v === "string")
      )
        setDraft(stored);
    } catch {
      /* Optional local draft. */
    }
    setNotice("");
    setIdeaOpen(true);
  }
  function save() {
    try {
      localStorage.setItem("fun-cosmos-idea-v2", JSON.stringify(draft));
      setNotice("Đã lưu ý tưởng trên trình duyệt này.");
    } catch {
      setNotice("Chưa thể lưu trên trình duyệt. Bạn có thể tải thẻ ý tưởng.");
    }
  }
  function download() {
    const blob = new Blob(
      ["FUN COSMOS — Ý tưởng của tôi\n\n" + fields.map((f, i) => f + ": " + draft[i]).join("\n\n")],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fun-cosmos-y-tuong.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const selected = platforms[planet] ?? platforms[0];
  return (
    <main className={`lc-page ${paused ? "lc-paused" : ""}`}>
      <a className="lc-skip" href="#about">
        Đến nội dung chính
      </a>
      <SiteHeader home active={active} />
      <section
        id="home"
        data-chapter
        className="lc-hero"
        style={{ "--scene": `url(${heroFallback})` } as CSSProperties}
      >
        <div className="lc-scene lc-hero-scene" />
        <div className="lc-stars" aria-hidden="true" />
        <div className="lc-portal-aura" aria-hidden="true" />
        <div className="lc-crystals" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="lc-hero-copy">
          <span className="lc-eyebrow">5D NEW EARTH ROLE-PLAYING GAME</span>
          <h1>
            <span className="lc-metal-blue">Chơi Vũ Trụ.</span>
            <br />
            <em>Sống Thiên Đàng.</em>
          </h1>
          <p>
            Một thế giới để tự do khám phá, học điều bạn yêu, sáng tạo điều bạn mơ và cùng nhau kiến
            tạo tương lai.
          </p>
          <div className="lc-actions">
            <a href="#games" className="lc-gold">
              Chơi game <ArrowRight size={18} />
            </a>
            <a className="lc-outline" href="#about">
              Khám phá FUN COSMOS
            </a>
          </div>
          <div className="lc-hero-note">
            <span>✧</span> Từ một ước mơ · Đến một thế giới mới
          </div>
        </div>
        <img
          className="lc-father"
          src={fatherPortrait}
          alt="Cha Vũ Trụ dang tay chào đón"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <a className="lc-scroll" href="#origin">
          HÀNH TRÌNH BẮT ĐẦU <ArrowDown size={15} />
        </a>
      </section>
      <UrantiaCosmosScene background="/cosmos/cosmic-orbits.png" />
      <TopicGallery
        id="urantia-gallery"
        chapter="origin"
        title="Urantia — Lời mời khám phá"
        images={[1, 2, 3, 4, 5]}
        labels={[
          "Bức tranh vũ trụ",
          "Khám phá Sách Urantia",
          "Trường học vĩ đại",
          "Bảy thế giới dinh thự",
          "Hành trình hoàn thiện",
        ]}
      />
      <CosmosCinema />
      <CosmosStoryGallery />
      <GameWorlds />

      <section id="angel" data-chapter className="lc-section lc-angel">
        <div className="lc-split">
          <div className="lc-angel-art">
            <img
              src="/cosmos/angel-cutout.png"
              onError={(e) => {
                e.currentTarget.src = angelFallback;
              }}
              alt="Angel AI, người bạn đồng hành"
              loading="lazy"
            />
            <span className="lc-float-label">✧ ALWAYS WITH YOU</span>
          </div>
          <div>
            <Heading label="Angel AI" title="Cùng bạn, trên mỗi bước đi.">
              Người bạn đồng hành giúp bạn khám phá, học hỏi và biến ý tưởng thành trải nghiệm.
            </Heading>
            <div className="lc-role-tabs">
              {roles.map(([t], i) => (
                <button key={t} onClick={() => setRole(i)} aria-pressed={role === i}>
                  {t}
                </button>
              ))}
            </div>
            <div className="lc-conversation" aria-live="polite">
              <small>ANGEL AI · {roles[role]![1]} · MINH HỌA</small>
              <p>“{roles[role]![2]}”</p>
            </div>
            <a
              className="lc-outline"
              href="/angel-ai"
              style={{ marginRight: 12, marginBottom: 12 }}
            >
              Khám phá Angel AI <ArrowRight size={16} />
            </a>
            <a className="lc-gold" href="https://angel.fun.rich/" target="_blank" rel="noreferrer">
              Gặp Angel AI <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>
      <TopicGallery
        id="angel-gallery"
        chapter="angel"
        title="Angel AI luôn đồng hành"
        images={[16, 17]}
        labels={["Năm vai trò đồng hành", "Angel AI hỗ trợ bạn như thế nào?"]}
      />
      <section id="love" data-chapter className="lc-section lc-love">
        <Heading label="Love Score" title="Mỗi đóng góp, một vì sao.">
          Love Score ghi nhận những đóng góp tích cực đã được xác minh.
        </Heading>
        <div className="lc-proof">
          {["Hành động", "Bằng chứng", "Xác minh", "Ghi nhận"].map((t, i) => (
            <div key={t}>
              <span>{["♡", "◇", "✓", "✧"][i]}</span>
              <h3>{t}</h3>
              <p>
                {
                  [
                    "Học hỏi, sáng tạo, giúp đỡ và đóng góp.",
                    "Ghi lại kết quả phù hợp với hoạt động.",
                    "Kiểm tra đóng góp trước khi ghi nhận.",
                    "Lưu dấu những giá trị bạn đã tạo ra.",
                  ][i]
                }
              </p>
            </div>
          ))}
        </div>
        <p className="lc-love-note">
          Love Score là lịch sử đóng góp — không đo linh hồn, mức độ giác ngộ hay giá trị con người.
        </p>
      </section>
      <TopicGallery
        id="love-gallery"
        chapter="love"
        title="Ghi nhận những điều tốt đẹp"
        images={[18, 19]}
        labels={["Hành động đến ghi nhận", "Những đóng góp có ý nghĩa"]}
      />
      <section id="ecosystem" data-chapter className="lc-section lc-ecosystem">
        <Heading label="FUN Ecosystem" title="Một vũ trụ kết nối.">
          NỀN KINH TẾ ÁNH SÁNG 5D
        </Heading>
        <a className="lc-outline" href="/ecosystem">
          Khám phá FUN Ecosystem ↗
        </a>
        <p className="lc-equation">
          A.I. + BLOCKCHAIN + <em>PURELOVE</em> = INFINITE ASSETS
        </p>
        <p className="lc-equation-vi">A.I. + Blockchain + Tình Yêu Thuần Khiết = Tài Sản Vô Hạn</p>
        <div className="lc-solar-system">
          <div className="lc-solar-ring" />
          <div className="lc-solar-ring outer" />
          <a className="lc-sun" href="https://cosmos.fun.rich/" target="_blank" rel="noreferrer">
            <img src="/cosmos/cosmos.png" alt="Mở FUN COSMOS" />
            <span>FUN COSMOS</span>
          </a>
          <div className="eco-outer-orbit">
            {[
              ...platforms.filter((p) => !["cosmos", "money", "camly"].includes(p[0])),
              ["urantia", "Sách Urantia", "", "", "https://urantia.fun.rich/"],
            ].map((p, i, all) => (
              <div
                className="eco-position"
                key={p[0]}
                style={{
                  left: `${(50 + 43 * Math.cos((i / all.length) * 2 * Math.PI - Math.PI / 2)).toFixed(4)}%`,
                  top: `${(50 + 43 * Math.sin((i / all.length) * 2 * Math.PI - Math.PI / 2)).toFixed(4)}%`,
                }}
              >
                <a
                  className="eco-logo"
                  href={p[4]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={p[1]}
                  onMouseEnter={() => {
                    const index = platforms.findIndex((v) => v[0] === p[0]);
                    if (index >= 0) setPlanet(index);
                  }}
                  onFocus={() => {
                    const index = platforms.findIndex((v) => v[0] === p[0]);
                    if (index >= 0) setPlanet(index);
                  }}
                >
                  <img src={`/cosmos/${p[0]}.png`} alt={p[1]} loading="lazy" />
                </a>
              </div>
            ))}
          </div>
          <div className="eco-money-orbit">
            {Array.from({ length: 12 }, (_, i) => {
              const type = i % 2 === 0 ? "money" : "camly";
              return (
                <div
                  className="eco-position"
                  key={i}
                  style={{
                    left: `${(50 + 25 * Math.cos((i * Math.PI) / 6)).toFixed(4)}%`,
                    top: `${(50 + 25 * Math.sin((i * Math.PI) / 6)).toFixed(4)}%`,
                  }}
                >
                  <a
                    className="eco-coin"
                    href={type === "money" ? "https://money.fun.rich/" : "https://camly.co/"}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={type === "money" ? "FUN Money" : "Camly Coin"}
                  >
                    <img src={`/cosmos/${type}.png`} alt="" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lc-planet-detail" aria-live="polite">
          <img src={`/cosmos/${selected[0]}.png`} alt="" loading="lazy" />
          <div>
            <small>{selected[2]}</small>
            <h3>{selected[1]}</h3>
            <p>{selected[3]}</p>
          </div>
          <a className="lc-outline" href={selected[4]} target="_blank" rel="noreferrer">
            Khám phá <ExternalLink size={16} />
          </a>
        </div>
        <details className="lc-platform-list">
          <summary>Tất cả nền tảng — mở danh sách</summary>
          <div>
            {platforms.map((p) => (
              <a key={p[0]} href={p[4]} target="_blank" rel="noreferrer">
                <img src={`/cosmos/${p[0]}.png`} alt="" loading="lazy" />
                <div>
                  <h3>{p[1]} ↗</h3>
                  <p>{p[3]}</p>
                </div>
              </a>
            ))}
          </div>
        </details>
        <a
          className="lc-consensus"
          href="https://urantia.fun.rich/"
          target="_blank"
          rel="noreferrer"
        >
          Tài liệu đồng thuận toàn cầu · Sách Urantia ↗
        </a>
      </section>
      <TopicGallery
        id="ecosystem-gallery"
        chapter="ecosystem"
        title="Kết nối FUN Ecosystem"
        images={[24]}
        labels={["Một thế giới — nhiều điểm đến"]}
      />
      <section id="create" data-chapter className="lc-section lc-create">
        <Heading label="Your turn" title="Vũ trụ bắt đầu từ ý tưởng của bạn.">
          Bạn không cần biết tất cả. Hãy bắt đầu từ điều mình yêu thích nhất.
        </Heading>
        <div className="lc-questions">
          {[
            "Bạn muốn làm điều gì đầu tiên?",
            "Bạn muốn nhân vật trở thành ai?",
            "Bạn muốn xây dựng nơi nào?",
            "Bạn muốn Angel AI giúp điều gì?",
            "Bạn muốn đóng góp bằng tài năng nào?",
          ].map((q, i) => (
            <button key={q} onClick={openIdea}>
              <small>0{i + 1}</small>
              <span>{q}</span>
              <ArrowRight size={20} />
            </button>
          ))}
        </div>
        <div className="lc-create-cta">
          <Sparkles />
          <h3>Imagine it. Create it. Share it.</h3>
          <button className="lc-gold" onClick={openIdea}>
            Tạo thẻ ý tưởng <ArrowRight size={18} />
          </button>
          <p>Bảy bước nhỏ để phác thảo thế giới bạn muốn tạo.</p>
          <a className="lc-outline" href="/your-turn">
            Khám phá Your Turn ↗
          </a>
        </div>
      </section>
      <TopicGallery
        id="create-gallery"
        chapter="create"
        title="Ý tưởng của bạn bắt đầu từ đây"
        images={[21, 26, 27]}
        labels={[
          "Your Turn — Bạn muốn tạo điều gì?",
          "Năm câu hỏi tìm ý tưởng",
          "Mini game — 99.999 Happy Camly Coin",
        ]}
      />
      <SiteFooter paused={paused} onPause={() => setPaused(!paused)} />
      <Dialog open={ideaOpen} onOpenChange={setIdeaOpen}>
        <DialogContent className="lc-idea-dialog">
          <DialogTitle>FUN COSMOS của bạn</DialogTitle>
          <DialogDescription>
            Phác thảo ý tưởng qua bảy thành phần. Bản nháp lưu trên trình duyệt của bạn; chưa gửi
            đến hệ thống.
          </DialogDescription>
          <div className="lc-idea-fields">
            {fields.map((f, i) => (
              <label key={f}>
                {i + 1}. {f}
                <textarea
                  maxLength={1000}
                  value={draft[i]}
                  onChange={(e) => {
                    setDraft((d) => d.map((v, j) => (j === i ? e.target.value : v)));
                    setNotice("");
                  }}
                  placeholder={
                    [
                      "Một người làm vườn…",
                      "Tạo một nơi mọi người gặp nhau…",
                      "Trồng cây và thiết kế khu vườn…",
                      "Hướng dẫn chăm sóc cây…",
                      "Kỹ năng mới, dấu mốc đóng góp…",
                      "Một khu đất trở nên xanh hơn…",
                      "Tham gia trồng cây cùng cộng đồng…",
                    ][i]
                  }
                />
              </label>
            ))}
          </div>
          <div className="lc-actions">
            <button className="lc-gold" disabled={!draft.some((v) => v.trim())} onClick={save}>
              <Check size={16} /> Lưu bản nháp
            </button>
            <button
              className="lc-outline"
              disabled={!draft.some((v) => v.trim())}
              onClick={download}
            >
              <Download size={16} /> Tải thẻ ý tưởng
            </button>
          </div>
          <p role="status">{notice}</p>
        </DialogContent>
      </Dialog>
    </main>
  );
}
