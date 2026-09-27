import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { UrantiaCosmosScene } from "@/components/urantia-cosmos-scene";
import { TopicGallery } from "@/components/topic-gallery";
import { ArtworkViewer } from "@/components/story-artwork";
import { CosmosCinema } from "@/components/cosmos-cinema";
import { CosmosStoryGallery } from "@/components/cosmos-story-gallery";
import { GameWorlds } from "@/components/game-worlds";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { ArrowDown, ArrowRight, ExternalLink, Download, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { platforms, roles, platformDescriptionsEn, roleAnswersEn } from "@/components/living-data";
import { IDEA_FIELDS, exportIdea } from "@/lib/idea-submission";
import { useIdeaDraft } from "@/lib/use-idea-draft";
import { useI18n } from "@/lib/i18n";

import fatherPortrait from "@/assets/father-cosmos-framed.jpg";
const heroFallback = "/cosmos/portal.jpg";
import angelFallback from "@/assets/angel-web.jpg";
import "@/living.css";
import "@/components/cosmos-consolidation.css";
export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search["token"] === "string" ? search["token"] : undefined,
  }),
  beforeLoad: ({ search }) => {
    const token = typeof search?.token === "string" ? search.token : "";

    if (token) {
      throw redirect({
        to: "/reset-password",
        search: { token },
      });
    }
  },
  head: () => ({
    meta: [
      { title: "FUN COSMOS — Play the Cosmos, Live in Heaven" },
      {
        name: "description",
        content: "Explore, learn, create and connect in the FUN COSMOS 5D role-playing universe.",
      },
      { property: "og:title", content: "FUN COSMOS — Play the Cosmos, Live in Heaven" },
      {
        property: "og:description",
        content: "Explore, learn, create and build the future together in FUN COSMOS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});
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
  const { locale, t } = useI18n();
  const { draft, update, save: saveDraft } = useIdeaDraft();
  const fields = IDEA_FIELDS.map((field) => field[locale]);
  const [active, setActive] = useState("home"),
    [paused, setPaused] = useState(false),
    [role, setRole] = useState(1),
    [planet, setPlanet] = useState(2),
    [ideaOpen, setIdeaOpen] = useState(false),
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
    setNotice("");
    setIdeaOpen(true);
  }
  function save() {
    setNotice(
      saveDraft()
        ? t("Your draft is saved on this device.", "Đã lưu ý tưởng trên trình duyệt này.")
        : t(
            "Local saving is unavailable. Download your idea card to keep it.",
            "Chưa thể lưu trên trình duyệt. Bạn có thể tải thẻ ý tưởng.",
          ),
    );
  }
  function download() {
    exportIdea(draft, locale);
  }
  const ecosystemPlatforms = [
    ...platforms,
    [
      "urantia",
      t("The Urantia Book", "Sách Urantia"),
      t("A universe of learning", "Vũ trụ học hỏi"),
      "Khám phá vũ trụ có trật tự, giáo dục và hành trình tiến hóa.",
      "https://urantia.fun.rich/",
    ],
  ];
  const selected = ecosystemPlatforms[planet] ?? ecosystemPlatforms[2]!;
  const selectPlanet = (slug: string) => {
    const index = ecosystemPlatforms.findIndex((platform) => platform[0] === slug);
    if (index >= 0) setPlanet(index);
  };
  const handlePlanetClick = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (window.matchMedia("(hover: none)").matches && selected[0] !== slug) {
      event.preventDefault();
      selectPlanet(slug);
    }
  };
  const ideaQuestions =
    locale === "en"
      ? [
          "What would you like to do first?",
          "Who would you like your character to become?",
          "What place would you like to build?",
          "How could Angel AI help?",
          "What talent would you like to contribute?",
        ]
      : [
          "Bạn muốn làm điều gì đầu tiên?",
          "Bạn muốn nhân vật trở thành ai?",
          "Bạn muốn xây dựng nơi nào?",
          "Bạn muốn Angel AI giúp điều gì?",
          "Bạn muốn đóng góp bằng tài năng nào?",
        ];
  return (
    <main className={`lc-page ${paused ? "lc-paused" : ""}`}>
      <a className="lc-skip" href="#about">
        {t("Skip to main content", "Đến nội dung chính")}
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
            <span className="lc-metal-blue">{t("Play the Cosmos.", "CHƠI TRONG VŨ TRỤ.")}</span>
            <br />
            <em>{t("Live in Heaven.", "SỐNG GIỮA THIÊN ĐÀNG.")}</em>
          </h1>
          <p>
            {t(
              "A world to explore freely, learn what you love, create what you dream and build the future together.",
              "Một thế giới để tự do khám phá, học điều bạn yêu, sáng tạo điều bạn mơ và cùng nhau kiến tạo tương lai.",
            )}
          </p>
          <div className="lc-actions">
            <a href="#games" className="lc-gold">
              {t("Play the game", "Chơi game")} <ArrowRight size={18} />
            </a>
            <a className="lc-outline" href="#about">
              {t("Discover FUN COSMOS", "Khám phá FUN COSMOS")}
            </a>
          </div>
          <div className="lc-hero-note">
            <span>✧</span>{" "}
            {t("From a dream · To a new world", "Từ một ước mơ · Đến một thế giới mới")}
          </div>
        </div>
        <img
          className="lc-father"
          src={fatherPortrait}
          alt={t("A welcoming figure reaching out", "Cha Vũ Trụ dang tay chào đón")}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <a className="lc-scroll" href="#origin">
          {t("THE JOURNEY BEGINS", "HÀNH TRÌNH BẮT ĐẦU")} <ArrowDown size={15} />
        </a>
      </section>
      <GameWorlds />
      <UrantiaCosmosScene background="/cosmos/cosmic-orbits.png" />
      <TopicGallery
        id="urantia-gallery"
        chapter="origin"
        title={t("Urantia — An invitation to explore", "Urantia — Lời mời khám phá")}
        images={[1, 2, 3, 4, 5]}
        labels={[
          t("A picture of the cosmos", "Bức tranh vũ trụ"),
          t("Explore The Urantia Book", "Khám phá Sách Urantia"),
          t("The great school", "Trường học vĩ đại"),
          t("Seven mansion worlds", "Bảy thế giới dinh thự"),
          t("A journey of growth", "Hành trình hoàn thiện"),
        ]}
      />
      <CosmosCinema />
      <CosmosStoryGallery />

      <section id="angel" data-chapter className="lc-section lc-angel">
        <div className="lc-split">
          <div className="lc-angel-art">
            <img
              src="/cosmos/angel-cutout.png"
              onError={(e) => {
                e.currentTarget.src = angelFallback;
              }}
              alt={t("Angel AI, your companion", "Angel AI, người bạn đồng hành")}
              loading="lazy"
            />
            <span className="lc-float-label">✧ ALWAYS WITH YOU</span>
          </div>
          <div>
            <Heading
              label="Angel AI"
              title={t("With you, every step of the way.", "Cùng bạn, trên mỗi bước đi.")}
            >
              {t(
                "A companion who helps you explore, learn and turn ideas into experiences.",
                "Người bạn đồng hành giúp bạn khám phá, học hỏi và biến ý tưởng thành trải nghiệm.",
              )}
            </Heading>
            <div className="lc-role-tabs">
              {roles.map(([name, english], i) => (
                <button key={name} onClick={() => setRole(i)} aria-pressed={role === i}>
                  {locale === "en" ? english : name}
                </button>
              ))}
            </div>
            <div className="lc-conversation" aria-live="polite">
              <small>
                ANGEL AI · {roles[role]![1]} · {t("ILLUSTRATION", "MINH HỌA")}
              </small>
              <p>“{locale === "en" ? roleAnswersEn[role] : roles[role]![2]}”</p>
            </div>
            <a
              className="lc-outline"
              href="/angel-ai"
              style={{ marginRight: 12, marginBottom: 12 }}
            >
              {t("Explore Angel AI", "Khám phá Angel AI")} <ArrowRight size={16} />
            </a>
            <a className="lc-gold" href="https://angel.fun.rich/" target="_blank" rel="noreferrer">
              {t("Meet Angel AI", "Gặp Angel AI")} <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>
      <TopicGallery
        id="angel-gallery"
        chapter="angel"
        title={t("Angel AI is with you", "Angel AI luôn đồng hành")}
        images={[16, 17]}
        labels={[
          t("Five companion roles", "Năm vai trò đồng hành"),
          t("How can Angel AI help?", "Angel AI hỗ trợ bạn như thế nào?"),
        ]}
      />
      <TopicGallery
        id="love"
        chapter="love"
        title={t("Recognizing positive contributions", "Ghi nhận những điều tốt đẹp")}
        images={[18, 19]}
        labels={[
          t("From action to recognition", "Hành động đến ghi nhận"),
          t("Meaningful contributions", "Những đóng góp có ý nghĩa"),
        ]}
      />
      <section id="ecosystem" data-chapter className="lc-section lc-ecosystem">
        <Heading label="FUN Ecosystem" title={t("One connected cosmos.", "Một vũ trụ kết nối.")}>
          {t("5D LIGHT ECONOMY", "NỀN KINH TẾ ÁNH SÁNG 5D")}
        </Heading>
        <a className="lc-outline" href="/ecosystem">
          {t("Explore FUN Ecosystem", "Khám phá FUN Ecosystem")} ↗
        </a>
        <p className="lc-equation">
          A.I. + BLOCKCHAIN + <em>PURELOVE</em> = INFINITE ASSETS
        </p>
        <p className="lc-equation-vi">
          {t(
            "AI + Blockchain + Pure Love = Infinite Assets",
            "A.I. + Blockchain + Tình Yêu Thuần Khiết = Tài Sản Vô Hạn",
          )}
        </p>
        <div className="lc-solar-system">
          <div className="lc-solar-ring" />
          <div className="lc-solar-ring outer" />
          <a
            className="lc-sun"
            href="https://cosmos.fun.rich/"
            target="_blank"
            rel="noreferrer"
            data-selected={selected[0] === "cosmos"}
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch") selectPlanet("cosmos");
            }}
            onFocus={() => {
              if (!window.matchMedia("(hover: none)").matches) selectPlanet("cosmos");
            }}
            onClick={(event) => handlePlanetClick(event, "cosmos")}
          >
            <img src="/cosmos/cosmos.png" alt={t("Open FUN COSMOS", "Mở FUN COSMOS")} />
            <span>FUN COSMOS</span>
          </a>
          <div className="eco-outer-orbit">
            {ecosystemPlatforms
              .filter((p) => !["cosmos", "money", "camly"].includes(p[0]))
              .map((p, i, all) => (
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
                    data-selected={selected[0] === p[0]}
                    onPointerEnter={(event) => {
                      if (event.pointerType !== "touch") selectPlanet(p[0]);
                    }}
                    onFocus={() => {
                      if (!window.matchMedia("(hover: none)").matches) selectPlanet(p[0]);
                    }}
                    onClick={(event) => handlePlanetClick(event, p[0])}
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
                    data-selected={selected[0] === type}
                    onPointerEnter={(event) => {
                      if (event.pointerType !== "touch") selectPlanet(type);
                    }}
                    onFocus={() => {
                      if (!window.matchMedia("(hover: none)").matches) selectPlanet(type);
                    }}
                    onClick={(event) => handlePlanetClick(event, type)}
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
            <p>
              {locale === "en"
                ? (platformDescriptionsEn[selected[0]] ??
                  "Explore the Urantia Book and a universe of learning.")
                : selected[3]}
            </p>
          </div>
          <a className="lc-outline" href={selected[4]} target="_blank" rel="noreferrer">
            {t("Explore", "Khám phá")} <ExternalLink size={16} />
          </a>
        </div>
        <details className="lc-platform-list">
          <summary>{t("All platforms — open list", "Tất cả nền tảng — mở danh sách")}</summary>
          <div>
            {ecosystemPlatforms.map((p) => (
              <a key={p[0]} href={p[4]} target="_blank" rel="noreferrer">
                <img src={`/cosmos/${p[0]}.png`} alt="" loading="lazy" />
                <div>
                  <h3>{p[1]} ↗</h3>
                  <p>
                    {locale === "en"
                      ? (platformDescriptionsEn[p[0]] ??
                        "Explore the Urantia Book and a universe of learning.")
                      : p[3]}
                  </p>
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
          {t(
            "Global consensus document · The Urantia Book",
            "Tài liệu đồng thuận toàn cầu · Sách Urantia",
          )}{" "}
          ↗
        </a>
      </section>
      <section
        id="ecosystem-gallery"
        data-chapter="ecosystem"
        className="lc-feature-artwork"
        aria-label={t("FUN Ecosystem map", "Bản đồ FUN Ecosystem")}
      >
        <ArtworkViewer id={24} />
      </section>
      <section
        id="create"
        data-chapter
        className="lc-your-turn-gallery"
        aria-label={t("Your Turn", "Đến lượt bạn")}
      >
        <aside className="lc-your-turn-guide">
          <span className="lc-eyebrow">✧ YOUR TURN</span>
          <h2>{t("Your idea begins here", "Ý tưởng của bạn bắt đầu từ đây")}</h2>
          <ol>
            {ideaQuestions.map((question, index) => (
              <li key={question}>
                <span>0{index + 1}</span>
                {question}
              </li>
            ))}
          </ol>
          <button className="lc-gold" onClick={openIdea}>
            {t("Create an idea card", "Tạo thẻ ý tưởng")} <ArrowRight size={18} />
          </button>
        </aside>
        <div className="lc-your-turn-scenes">
          {[
            [27, "99.999 Happy Camly Coin"],
            [21, t("What will you create?", "Bạn sẽ tạo điều gì?")],
            [26, t("Five questions to begin", "Năm câu hỏi khởi đầu")],
          ].map(([id, label], index) => (
            <figure className="lc-your-turn-scene" key={id}>
              <ArtworkViewer id={Number(id)} />
              <figcaption>
                <span>0{index + 1} / 03</span>
                {label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <SiteFooter paused={paused} onPause={() => setPaused(!paused)} />
      <Dialog open={ideaOpen} onOpenChange={setIdeaOpen}>
        <DialogContent className="lc-idea-dialog">
          <DialogTitle>{t("Your FUN COSMOS", "FUN COSMOS của bạn")}</DialogTitle>
          <DialogDescription>
            {t(
              "Sketch your idea in seven parts. Your draft stays on this device until you choose to send it.",
              "Phác thảo ý tưởng qua bảy thành phần. Bản nháp lưu trên trình duyệt của bạn; chưa gửi đến hệ thống.",
            )}
          </DialogDescription>
          <div className="lc-idea-fields">
            {fields.map((f, i) => (
              <label key={f}>
                {i + 1}. {f}
                <textarea
                  maxLength={1000}
                  value={draft[i]}
                  onChange={(e) => {
                    update(i, e.target.value);
                    setNotice("");
                  }}
                  placeholder={locale === "en" ? IDEA_FIELDS[i]?.hintEn : IDEA_FIELDS[i]?.hintVi}
                />
              </label>
            ))}
          </div>
          <div className="lc-actions">
            <button className="lc-gold" disabled={!draft.some((v) => v.trim())} onClick={save}>
              <Check size={16} /> {t("Save draft", "Lưu bản nháp")}
            </button>
            <button
              className="lc-outline"
              disabled={!draft.some((v) => v.trim())}
              onClick={download}
            >
              <Download size={16} /> {t("Download idea card", "Tải thẻ ý tưởng")}
            </button>
            <a className="lc-outline" href="/your-turn#idea-preview">
              {t("Review and send", "Xem lại và gửi")} <ArrowRight size={16} />
            </a>
          </div>
          <p role="status">{notice}</p>
        </DialogContent>
      </Dialog>
    </main>
  );
}
