import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ChevronRight, Menu, Orbit, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/fun-cosmos-logo.png.asset.json";
import slide1 from "@/assets/slide-1.webp.asset.json";
import slide2 from "@/assets/slide-2.webp.asset.json";
import slide3 from "@/assets/slide-3.webp.asset.json";
import slide4 from "@/assets/slide-4.webp.asset.json";
import slide5 from "@/assets/slide-5.webp.asset.json";
import slide6 from "@/assets/slide-6.webp.asset.json";
import slide7 from "@/assets/slide-7.webp.asset.json";
import slide8 from "@/assets/slide-8.webp.asset.json";
import slide9 from "@/assets/slide-9.webp.asset.json";
import slide10 from "@/assets/slide-10.webp.asset.json";
import slide11 from "@/assets/slide-11.webp.asset.json";
import slide12 from "@/assets/slide-12.webp.asset.json";
import slide13 from "@/assets/slide-13.webp.asset.json";
import slide14 from "@/assets/slide-14.webp.asset.json";
import slide15 from "@/assets/slide-15.webp.asset.json";
import slide16 from "@/assets/slide-16.webp.asset.json";
import slide17 from "@/assets/slide-17.webp.asset.json";
import slide18 from "@/assets/slide-18.webp.asset.json";
import slide19 from "@/assets/slide-19.png.asset.json";
import slide20 from "@/assets/slide-20.png.asset.json";
import slide21 from "@/assets/slide-21.webp.asset.json";
import slide22 from "@/assets/slide-22.webp.asset.json";
import slide23 from "@/assets/slide-23.webp.asset.json";
import slide24 from "@/assets/slide-24.webp.asset.json";
import slide25 from "@/assets/slide-25.webp.asset.json";
import slide26 from "@/assets/slide-26.webp.asset.json";
import slide27 from "@/assets/slide-27.webp.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FUN COSMOS — Hành Trình 5D New Earth" },
      { name: "description", content: "Khám phá trọn vẹn hành trình FUN COSMOS qua 27 chương hình ảnh — từ bức tranh vũ trụ đến một thế giới mới do chính bạn sáng tạo." },
      { property: "og:title", content: "FUN COSMOS — Hành Trình 5D New Earth" },
      { property: "og:description", content: "27 chương hình ảnh kể trọn hành trình Play the Cosmos — Live in Heaven." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const slideAssets = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9, slide10, slide11, slide12, slide13, slide14, slide15, slide16, slide17, slide18, slide19, slide20, slide21, slide22, slide23, slide24, slide25, slide26, slide27];

const slideAlt = [
  "Sách Urantia mở ra bức tranh vũ trụ",
  "Sách Urantia và hành trình khám phá vũ trụ",
  "Vũ trụ là một trường học vĩ đại",
  "Bảy thế giới dinh thự",
  "Một hành trình hướng về sự hoàn thiện",
  "FUN COSMOS — The Journey Home",
  "FUN COSMOS là gì?",
  "FUN COSMOS không chỉ là game",
  "FUN COSMOS kết nối game, học tập, sáng tạo và đời thật",
  "Bảy thế giới trải nghiệm trong FUN COSMOS",
  "Người chơi có thể khám phá, sáng tạo, kết nối, tiến hóa và hiện thực hóa",
  "Anna’s Journey — Game và Real Life",
  "Core Loop — vòng lặp cốt lõi FUN COSMOS",
  "Core Idea — phiên bản tương lai tốt đẹp hơn của chính mình",
  "Năm trụ cột của FUN COSMOS",
  "Angel AI — Your Personal Game Master",
  "Angel AI là người bạn đồng hành thông minh",
  "Love Score — Verified Positive Contribution",
  "Love Score ghi nhận đóng góp tích cực đã xác minh",
  "Từ trồng cây trong game đến hành động thật ngoài đời",
  "Your Turn — bạn sẽ sáng tạo gì trong FUN COSMOS?",
  "Core Idea — cùng xây dựng một thế giới tốt đẹp hơn",
  "O2O kết nối online, offline, xác minh và Love Score",
  "Hệ sinh thái FUN COSMOS",
  "Điều làm FUN COSMOS hấp dẫn",
  "Năm câu hỏi để cùng sáng tạo FUN COSMOS",
  "Mini game FUN COSMOS và 99.999 Happy Camly Coin",
];

const chapterCopy = [
  ["Khởi nguồn", "The cosmos opens", "Mở ra một bức tranh vũ trụ rộng lớn."],
  ["Khởi nguồn", "A journey of discovery", "Từ một trang sách đến hành trình khám phá vô tận."],
  ["Khởi nguồn", "The cosmic school", "Mỗi thế giới là một nơi để trải nghiệm và trưởng thành."],
  ["Khởi nguồn", "Seven mansion worlds", "Bảy thế giới, bảy tầng trải nghiệm đang chờ được mở khóa."],
  ["Khởi nguồn", "Toward perfection", "Một hành trình hướng về phiên bản tốt đẹp hơn của chính mình."],
  ["FUN COSMOS", "The journey home", "Chơi giữa vũ trụ. Sống trong một thế giới đầy yêu thương."],
  ["FUN COSMOS", "A living universe", "Không chỉ là một trò chơi — đây là nơi ý tưởng trở thành trải nghiệm."],
  ["FUN COSMOS", "Beyond a game", "Một không gian để học, tạo, kết nối và hiện thực hóa."],
  ["FUN COSMOS", "One connected experience", "Game, học tập, sáng tạo và đời thật cùng tồn tại trong một hành trình."],
  ["FUN COSMOS", "Seven worlds to explore", "Mỗi cánh cổng mở ra một khả năng mới."],
  ["Khám phá & Sáng tạo", "Your possibilities", "Khám phá. Sáng tạo. Kết nối. Tiến hóa. Hiện thực hóa."],
  ["Anna’s Journey", "From dream to action", "Một ý tưởng trong game có thể nảy mầm ngoài đời thật."],
  ["Core Loop", "The creation cycle", "Mơ ước, mô phỏng, học hỏi, sáng tạo, hành động và tiến hóa."],
  ["Khám phá & Sáng tạo", "Meet your future self", "Trải nghiệm hôm nay phiên bản tương lai tốt đẹp hơn của bạn."],
  ["5 Trụ cột", "Five ways to grow", "Năm trụ cột giữ cho mọi trải nghiệm luôn tự do, vui và có ý nghĩa."],
  ["Angel AI", "Your personal game master", "Một người bạn đồng hành hiểu hành trình của riêng bạn."],
  ["Angel AI", "Always with you", "Gợi mở và hỗ trợ — không kiểm soát, không quyết định thay bạn."],
  ["Love Score", "Positive contribution", "Ghi nhận những đóng góp tích cực đã được xác minh."],
  ["Love Score", "Recognition, not judgment", "Không đo giá trị con người — chỉ phản chiếu hành động tốt đẹp."],
  ["O2O", "Game meets real life", "Điều bạn tạo trong thế giới số có thể trở thành tác động thật."],
  ["Your Turn", "What will you create?", "Một nhân vật, một thế giới, một bài hát hay một cộng đồng mới?"],
  ["Khám phá & Sáng tạo", "Build a better world", "Mỗi ý tưởng là một hạt giống cho tương lai."],
  ["O2O", "Online to offline", "Nhận nhiệm vụ, hành động, xác minh và mở khóa hành trình tiếp theo."],
  ["FUN Ecosystem", "One connected cosmos", "Mọi platform trở thành một hành tinh trong cùng hệ sinh thái."],
  ["FUN COSMOS", "Fun is still fun", "Chơi trước tiên — rồi khám phá điều bạn có thể trở thành."],
  ["Your Turn", "Five questions", "Mỗi câu trả lời là một viên gạch xây nên FUN COSMOS."],
  ["Your Turn", "Imagine it. Create it. Share it.", "Vũ trụ bắt đầu từ một ý tưởng của bạn."],
] as const;

const topicNavigation = [
  ["Khởi nguồn", 1], ["FUN COSMOS", 6], ["Khám phá & Sáng tạo", 11],
  ["5 Trụ cột", 15], ["Core Loop", 13], ["Angel AI", 16],
  ["Anna’s Journey", 12], ["Love Score", 18], ["O2O", 20],
  ["FUN Ecosystem", 24], ["Your Turn", 21],
] as const;

const platforms = ["Profile", "Academy", "Green Earth", "LoveHUB", "FUN Farm", "Wallet", "FUN Money", "PLP"];

const layoutFor = (index: number) => index % 3;

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(1);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-slide]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSlide(Number((visible.target as HTMLElement).dataset["slide"] ?? 1));
      },
      { threshold: [0.25, 0.55, 0.8] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const activeTopic = [...topicNavigation].reverse().find(([, start]) => activeSlide >= start)?.[0] ?? "Khởi nguồn";

  return (
    <main className="living-cosmos min-h-screen overflow-x-hidden">
      <div aria-hidden="true" className="cosmic-nebula pointer-events-none fixed inset-0" />
      <div aria-hidden="true" className="stars stars-near pointer-events-none fixed inset-0" />
      <div aria-hidden="true" className="stars stars-far pointer-events-none fixed inset-0" />

      <nav className="cosmos-nav fixed inset-x-0 top-0 z-50" aria-label="Điều hướng hành trình">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-4 lg:px-8">
          <Button variant="ghost" size="icon" onClick={() => jump("chapter-1")} aria-label="Về trang đầu" className="size-10 shrink-0">
            <img src={logoAsset.url} alt="" className="size-10 object-contain" />
          </Button>
          <Button variant="ghost" onClick={() => jump("chapter-1")} className="hidden h-auto px-2 font-display text-sm font-bold text-foreground sm:inline-flex">FUN COSMOS</Button>
          <span className="hidden h-5 w-px bg-border sm:block" />
          <span className="hidden text-[10px] font-semibold uppercase text-muted-foreground md:block">5D New Earth Role-Playing Game</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-2 text-[10px] font-semibold uppercase text-celestial sm:flex"><Sparkles className="size-3" />{activeTopic}</span>
            <span className="min-w-14 text-right font-display text-xs font-bold text-muted-foreground"><strong className="text-foreground">{String(activeSlide).padStart(2, "0")}</strong> / 27</span>
            <Button variant="starlight" size="sm" className="hidden sm:inline-flex" onClick={() => jump("chapter-1")}>Mở hành trình</Button>
            <Button variant="ghost" size="icon" className="size-11 lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Mở danh mục">
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        <div className="hidden h-11 items-center border-t border-border px-8 lg:flex">
          <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-3">
            {topicNavigation.map(([label, start]) => (
              <Button key={label} variant="ghost" size="sm" onClick={() => jump(`chapter-${start}`)} className={`topic-link h-8 px-2 text-[10px] ${activeTopic === label ? "topic-link-active" : ""}`}>{label}</Button>
            ))}
          </div>
        </div>
        <div className="h-px bg-border"><div className="journey-progress h-full transition-[width] duration-500" style={{ width: `${(activeSlide / 27) * 100}%` }} /></div>
        {menuOpen && (
          <div className="glass-panel mx-3 mt-2 grid max-h-[70vh] gap-1 overflow-auto rounded-lg p-3 lg:hidden">
            {topicNavigation.map(([label, start]) => <Button key={label} variant="ghost" className="justify-between" onClick={() => jump(`chapter-${start}`)}><span>{label}</span><span className="text-gold">{String(start).padStart(2, "0")}</span></Button>)}
          </div>
        )}
      </nav>

      <header className="cosmic-hero relative z-10 flex min-h-[92svh] items-end px-5 pb-16 pt-28 lg:px-10 lg:pb-20 lg:pt-36">
        <div className="mx-auto grid w-full max-w-[1500px] items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase text-celestial"><span className="h-px w-12 bg-celestial" /> A living universe</div>
            <h1 className="font-display text-5xl font-light leading-[0.95] text-foreground sm:text-7xl lg:text-8xl xl:text-9xl">PLAY THE<br /><span className="aurora-text font-bold">COSMOS</span></h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">Một hành trình qua 27 cánh cổng — nơi bạn tự do khám phá, sáng tạo, thử, sai và trở thành phiên bản tương lai tốt đẹp hơn của chính mình.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button variant="cosmos" size="lg" onClick={() => jump("chapter-1")}>Bắt đầu hành trình <ChevronRight /></Button>
              <span className="text-xs font-semibold uppercase text-muted-foreground">Live in heaven</span>
            </div>
          </div>
          <div className="relative hidden min-h-72 lg:col-span-5 lg:block">
            <div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" />
            <div className="hero-planet"><img src={logoAsset.url} alt="Biểu tượng FUN COSMOS" /></div>
            <span className="orbit-dot orbit-dot-one" /><span className="orbit-dot orbit-dot-two" /><span className="orbit-dot orbit-dot-three" />
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => jump("chapter-1")} className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full" aria-label="Đi đến chương đầu"><ArrowDown /></Button>
      </header>

      <div className="relative z-10">
        {slideAssets.map((asset, index) => {
          const slideNumber = index + 1;
          const [group, title, description] = chapterCopy[index] ?? chapterCopy[0];
          const layout = layoutFor(index);
          return (
            <section
              key={slideNumber}
              id={`chapter-${slideNumber}`}
              data-slide={slideNumber}
              aria-label={`Trang ${slideNumber} trên 27`}
              className={`cinematic-chapter chapter-layout-${layout}`}
            >
              <div aria-hidden="true" className="chapter-light" />
              <div className="chapter-inner reveal">
                <div className="chapter-copy">
                  <div className="chapter-kicker"><span>{String(slideNumber).padStart(2, "0")}</span><span className="chapter-line" />{group}</div>
                  <h2>{title}</h2>
                  <p>{description}</p>
                  <div className="chapter-index"><strong>27</strong><span>Cánh cổng<br />một hành trình</span></div>
                </div>
                <div className="chapter-visual">
                  <div aria-hidden="true" className="frame-aura" />
                  <div className="slide-shell">
                    <img
                      src={asset.url}
                      alt={slideAlt[index] ?? `FUN COSMOS — trang ${slideNumber}`}
                      width={1920}
                      height={1080}
                      loading={slideNumber <= 2 ? "eager" : "lazy"}
                      fetchPriority={slideNumber === 1 ? "high" : "auto"}
                      className="slide-image"
                    />
                    <div aria-hidden="true" className="image-refraction" />
                    <span className="slide-number" aria-hidden="true">{String(slideNumber).padStart(2, "0")}</span>
                  </div>
                  <span aria-hidden="true" className="satellite-ring" />
                  <span aria-hidden="true" className="floating-spark spark-one" />
                  <span aria-hidden="true" className="floating-spark spark-two" />
                </div>
              </div>
              {slideNumber === 24 && <EcosystemOrbit />}
            </section>
          );
        })}
      </div>

      <footer className="cosmic-footer relative z-10 px-5 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-4"><img src={logoAsset.url} alt="FUN COSMOS" className="size-14 object-contain" /><div><strong className="font-display text-base">FUN COSMOS</strong><p className="mt-1 text-xs uppercase text-muted-foreground">Play the cosmos — live in heaven</p></div></div>
          <Button variant="starlight" size="lg" onClick={() => jump("chapter-1")}>Xem lại từ đầu <ArrowUp /></Button>
        </div>
      </footer>
    </main>
  );
}

function EcosystemOrbit() {
  return (
    <div className="ecosystem-orbit" aria-label="Các platform trong hệ sinh thái FUN COSMOS">
      <div className="ecosystem-core"><img src={logoAsset.url} alt="FUN COSMOS" /><span>FUN COSMOS</span></div>
      {platforms.map((platform, index) => (
        <div key={platform} className={`platform-planet platform-${index + 1}`}>
          <span className="platform-mark">{platform.split(" ").map((word) => word[0]).join("")}</span>
          <span className="platform-name">{platform}</span>
        </div>
      ))}
      <div aria-hidden="true" className="ecosystem-ring ring-one" /><div aria-hidden="true" className="ecosystem-ring ring-two" /><div aria-hidden="true" className="ecosystem-ring ring-three" />
    </div>
  );
}