import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
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

const chapters = [
  { label: "Khởi nguồn", id: "chapter-1", range: "01—05" },
  { label: "FUN Cosmos", id: "chapter-6", range: "06—10" },
  { label: "Trải nghiệm", id: "chapter-11", range: "11—17" },
  { label: "Đóng góp", id: "chapter-18", range: "18—20" },
  { label: "Cùng sáng tạo", id: "chapter-21", range: "21—27" },
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(1);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-slide]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSlide(Number((visible.target as HTMLElement).dataset.slide ?? 1));
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

  return (
    <main className="cosmic-bg min-h-screen overflow-x-hidden">
      <h1 className="sr-only">FUN COSMOS — 5D New Earth Role-Playing Game</h1>
      <div aria-hidden="true" className="stars pointer-events-none fixed inset-0 opacity-25" />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/75 backdrop-blur-2xl" aria-label="Điều hướng hành trình">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-4 px-4 lg:h-20 lg:px-8">
          <Button variant="ghost" size="icon" onClick={() => jump("chapter-1")} aria-label="Về trang đầu" className="size-11 shrink-0">
            <img src={logoAsset.url} alt="" className="size-10 object-contain" />
          </Button>
          <button onClick={() => jump("chapter-1")} className="hidden font-display text-sm font-bold tracking-[0.12em] text-foreground sm:block">FUN COSMOS</button>
          <div className="mx-auto hidden items-center gap-7 lg:flex">
            {chapters.map((chapter) => (
              <button key={chapter.id} onClick={() => jump(chapter.id)} className="group text-left text-xs font-semibold text-muted-foreground transition hover:text-foreground">
                <span className="mr-2 text-gold">{chapter.range}</span>{chapter.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="min-w-16 text-right font-display text-xs font-bold text-muted-foreground"><strong className="text-foreground">{String(activeSlide).padStart(2, "0")}</strong> / 27</span>
            <Button variant="ghost" size="icon" className="size-11 lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Mở danh mục">
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        <div className="h-px bg-border"><div className="h-full bg-gold transition-[width] duration-500" style={{ width: `${(activeSlide / 27) * 100}%` }} /></div>
        {menuOpen && (
          <div className="glass-panel mx-3 mt-2 grid gap-1 rounded-2xl p-3 lg:hidden">
            {chapters.map((chapter) => <Button key={chapter.id} variant="ghost" className="justify-between" onClick={() => jump(chapter.id)}><span>{chapter.label}</span><span className="text-gold">{chapter.range}</span></Button>)}
          </div>
        )}
      </nav>

      <div className="relative z-10 pt-16 lg:pt-20">
        {slideAssets.map((asset, index) => {
          const slideNumber = index + 1;
          return (
            <section
              key={slideNumber}
              id={`chapter-${slideNumber}`}
              data-slide={slideNumber}
              aria-label={`Trang ${slideNumber} trên 27`}
              className={`slide-stage ${slideNumber === 1 ? "slide-stage-first" : ""}`}
            >
              <div className="slide-shell reveal">
                <img
                  src={asset.url}
                  alt={slideAlt[index] ?? `FUN COSMOS — trang ${slideNumber}`}
                  width={1920}
                  height={1080}
                  loading={slideNumber <= 2 ? "eager" : "lazy"}
                  fetchPriority={slideNumber === 1 ? "high" : "auto"}
                  className="slide-image"
                />
                <span className="slide-number" aria-hidden="true">{String(slideNumber).padStart(2, "0")}</span>
              </div>
              {slideNumber === 1 && (
                <button onClick={() => jump("chapter-2")} className="mt-5 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                  Khám phá 27 trang <ChevronDown className="size-4 animate-bounce" />
                </button>
              )}
            </section>
          );
        })}
      </div>

      <footer className="relative z-10 border-t border-border px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3"><img src={logoAsset.url} alt="FUN COSMOS" className="size-12 object-contain" /><div><strong className="font-display text-sm tracking-[0.12em]">FUN COSMOS</strong><p className="text-xs text-muted-foreground">PLAY THE COSMOS — LIVE IN HEAVEN</p></div></div>
          <Button variant="starlight" onClick={() => jump("chapter-1")}>Xem lại từ đầu</Button>
        </div>
      </footer>
    </main>
  );
}