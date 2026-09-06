import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronDown, Globe2, Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/fun-cosmos-logo.png.asset.json";
import heroImage from "@/assets/cosmos-hero.jpg";
import cityImage from "@/assets/new-earth-city.jpg";
import angelImage from "@/assets/angel-ai.jpg";
import finaleImage from "@/assets/cosmos-finale.jpg";
import slide7 from "@/assets/slide-7.webp.asset.json";
import slide11 from "@/assets/slide-11.webp.asset.json";
import slide12 from "@/assets/slide-12.webp.asset.json";
import slide13 from "@/assets/slide-13.webp.asset.json";
import slide15 from "@/assets/slide-15.webp.asset.json";
import slide16 from "@/assets/slide-16.webp.asset.json";
import slide18 from "@/assets/slide-18.webp.asset.json";
import slide20 from "@/assets/slide-20.png.asset.json";
import slide21 from "@/assets/slide-21.webp.asset.json";
import slide23 from "@/assets/slide-23.webp.asset.json";
import slide24 from "@/assets/slide-24.webp.asset.json";
import slide25 from "@/assets/slide-25.webp.asset.json";
import slide26 from "@/assets/slide-26.webp.asset.json";
import slide27 from "@/assets/slide-27.webp.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FUN COSMOS — 5D New Earth Role-Playing Game" },
      { name: "description", content: "Chơi để trải nghiệm, học để phát triển, hành động để yêu thương: khám phá, sáng tạo, kết nối và đưa điều tốt đẹp từ thế giới ảo vào đời thật cùng FUN COSMOS." },
      { property: "og:title", content: "FUN COSMOS — 5D New Earth Role-Playing Game" },
      { property: "og:description", content: "Play the Cosmos — Live in Heaven. Khám phá, sáng tạo, kết nối, tiến hóa và hiện thực hóa cùng Angel AI, Love Score và O2O." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const navItems: Array<[string, string]> = [
  ["Cosmos", "cosmos"], ["Ý tưởng", "core-idea"], ["Trụ cột", "pillars"], ["Core Loop", "loop"],
  ["Angel AI", "angel"], ["Love Score", "love-score"], ["O2O", "o2o"], ["Ecosystem", "ecosystem"], ["Sáng tạo", "create"],
];

const coreIdeaSteps = [
  ["01", "PHIÊN BẢN TỐT HƠN", "Trải nghiệm phiên bản tương lai tốt đẹp hơn của chính mình."],
  ["02", "TRẢI NGHIỆM", "Sống thử những vai trò, kỹ năng và lựa chọn mới."],
  ["03", "SÁNG TẠO", "Tạo ra điều mới từ chính điều mình yêu thích."],
  ["04", "KẾT NỐI", "Gặp gỡ, cùng làm, cùng chia sẻ với cộng đồng."],
  ["05", "XÂY DỰNG", "Cùng nhau xây một thế giới tốt đẹp hơn — trong game và ngoài đời."],
];

const playerActions = [
  ["EXPLORE", "KHÁM PHÁ", "Thành phố, khu vườn, đảo, hành tinh, cổng không gian, thế giới mới."],
  ["CREATE", "SÁNG TẠO", "Nhà, vườn, âm nhạc, thời trang, cửa hàng, quest, nhân vật."],
  ["CONNECT", "KẾT NỐI", "Bạn bè, gia đình, mentor, creator, đội nhóm, cộng đồng."],
  ["EVOLVE", "TIẾN HÓA", "Kỹ năng, kiến thức, sáng tạo và lịch sử đóng góp của bạn."],
  ["REALIZE", "HIỆN THỰC HÓA", "Đưa điều tốt đẹp trong game thành hành động thật ngoài đời."],
];

const notFocus = ["Đánh quái vô tận", "Cày level cho nhanh", "Săn đồ hiếm bằng mọi giá", "Đánh boss để hơn thua"];
const isFocus = ["Khám phá", "Học hỏi", "Sáng tạo", "Đóng góp", "Kết nối", "Phát triển"];
const funStuff = ["Mini game", "Sự kiện theo mùa", "Âm nhạc & lễ hội", "Bạn bè · Team · Guild", "Thử thách sáng tạo", "Phần thưởng bất ngờ"];

const pillars = [
  ["01", "EXPLORE", "Đi đến những vùng đất, thành phố và hành tinh chưa từng thấy — mỗi nơi mở ra một câu chuyện."],
  ["02", "CREATE", "Tạo nhà, vườn, nhạc, trang phục, cửa hàng, quest, nhân vật và cả thế giới của riêng bạn."],
  ["03", "CONNECT", "Kết nối bạn bè, gia đình, mentor, creator — cùng làm những điều không thể làm một mình."],
  ["04", "EVOLVE", "Phát triển kỹ năng, kiến thức và khả năng sáng tạo qua từng trải nghiệm."],
  ["05", "REALIZE", "Biến điều tốt đẹp trong game thành hành động thật, được xác minh ngoài đời."],
];

const loop = [
  ["DREAM", "Mình muốn trở thành ai?"], ["SIMULATE", "Thử tương lai đó trong game."],
  ["LEARN", "Angel AI và hệ thống đồng hành hướng dẫn."], ["CREATE", "Tạo ra một điều mới."],
  ["ACT", "Hành động trong game hoặc ngoài đời."], ["VERIFY", "Xác minh bằng bằng chứng phù hợp."],
  ["REWARD", "Nhận ghi nhận, Love Score và unlock."], ["EVOLVE", "Nhân vật và thế giới cùng phát triển."],
];
const loopChips = ["Play with purpose", "Grow beyond limits", "Co-create New Earth", "Fun · Freedom · Flow", "Together we evolve"];

const angelRoles = [
  ["GUIDE", "Gợi ý bước tiếp theo, không ra lệnh."],
  ["COMPANION", "Đồng hành, lắng nghe, ở bên bạn."],
  ["TEACHER", "Giải thích điều bạn muốn học, theo cách của bạn."],
  ["CREATOR ASSISTANT", "Hỗ trợ bạn biến ý tưởng thành tác phẩm."],
  ["GAME MASTER", "Tạo quest và trải nghiệm riêng cho hành trình của bạn."],
];
const angelPersonal = [
  "Hiểu điều bạn thích và cách bạn học.",
  "Cá nhân hóa nhiệm vụ theo nhịp của bạn.",
  "Nối ý tưởng trong game với việc thật ngoài đời.",
  "Đồng hành — không kiểm soát, không phán xét.",
];

const annaSteps = [
  ["01", "Một khoảng đất trống", "Anna bắt đầu từ con số không."],
  ["02", "Gieo hạt đầu tiên", "Angel AI gợi ý cách bắt đầu."],
  ["03", "Học ngoài đời thật", "Anna học cách chăm một cái cây thật."],
  ["04", "Hành động & xác minh", "Trồng cây thật cùng Green Earth."],
  ["05", "Được ghi nhận", "Love Score cập nhật đóng góp đã xác minh."],
  ["06", "Thế giới tiến hóa", "Khu vườn trong game lớn thành cả hệ sinh thái."],
];

const loveExamples = ["Học một kỹ năng mới", "Giúp một người bạn", "Tạo một tác phẩm", "Trồng cây thật", "Dạy lại điều mình biết", "Xây dựng cộng đồng", "Viết code hữu ích", "Dọn sạch một nơi công cộng"];
const loveNots = ["Không đo linh hồn", "Không đo giác ngộ", "Không đánh giá giá trị con người", "Không xếp hạng cao — thấp"];
const loveQualities = ["Minh bạch", "Công bằng", "Truy vết được", "Không giả mạo", "Giá trị thật"];

const o2oSteps = [
  ["01", "Nhận quest trong game", "Trồng một cái cây trong thế giới ảo."],
  ["02", "Đăng ký Green Earth", "Kết nối với chương trình ngoài đời thật."],
  ["03", "Trồng cây thật", "Hành động thật, ở nơi thật."],
  ["04", "Xác minh", "Bằng chứng được kiểm tra và xác nhận."],
  ["05", "Love Score cập nhật", "Đóng góp tích cực được ghi nhận."],
  ["06", "Mở khóa khu rừng mới", "Thế giới ảo tiến hóa theo hành động thật."],
];
const o2oRewards = ["Love Score", "Kinh nghiệm", "Mở khóa vùng đất", "Phần thưởng đặc biệt"];

const ecosystem = ["FUN Profile", "Angel AI", "FUN Academy", "FUN Farm", "Green Earth", "LoveHUB", "FUN Wallet", "FUN Money", "Camly Coin", "PureLove Protocol"];
const orbitPositions = [["50%","7%"],["76%","17%"],["91%","39%"],["87%","66%"],["66%","84%"],["34%","84%"],["13%","66%"],["9%","39%"],["24%","17%"],["50%","91%"]];
const ecoValues = [
  "Một danh tính, một hành trình xuyên suốt.",
  "Học — làm — đóng góp trong cùng một dòng chảy.",
  "Đóng góp thật được ghi nhận thật.",
  "Sáng tạo có nơi để sống và lan tỏa.",
  "Không phải một menu — là trải nghiệm tự nhiên.",
];

const questions = [
  ["01", "Bước đầu tiên của bạn trong FUN COSMOS là gì?"],
  ["02", "Bạn muốn tạo nhân vật như thế nào?"],
  ["03", "Khu vực nào bạn muốn xây dựng đầu tiên?"],
  ["04", "Bạn muốn Angel AI đồng hành với mình ra sao?"],
  ["05", "Đóng góp sáng tạo đầu tiên của bạn sẽ là gì?"],
];

const miniSteps = ["Character", "Dream", "Gameplay", "Angel AI", "Reward", "World Change", "Real-world Connection"];
const miniHow = [
  ["01", "Nhận nhiệm vụ", "Đề bài mở, không có đáp án sai."],
  ["02", "Tạo ý tưởng", "10 phút để hình dung thế giới của bạn."],
  ["03", "Pitch 60–90 giây", "Kể lại điều bạn vừa tưởng tượng."],
  ["04", "Nhận thưởng", "99.999 Happy Camly Coin."],
];
const talents = ["Art", "Character", "Music", "Story", "Game Design", "AI", "Code"];
const yourTurn = ["A Story?", "A Character?", "A World?", "Music?", "An AI?", "A Game?", "Code?", "A Community?"];

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-glow"><Sparkles className="size-4" />{children}</p>;
}

function Artwork({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="reveal mt-14">
      <img src={src} loading="lazy" alt={alt} className="gold-frame w-full object-cover" />
      <figcaption className="mt-4 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("VI");
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <main className="cosmic-bg relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className="stars pointer-events-none fixed inset-0 z-0 opacity-35" />

      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-border bg-background/70 backdrop-blur-2xl" : "bg-transparent"}`} aria-label="Main navigation">
        <div className="mx-auto grid h-20 max-w-[1500px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 lg:flex lg:px-10">
          <button onClick={() => jump("cosmos")} className="flex min-w-0 items-center gap-3" aria-label="FUN COSMOS home">
            <img src={logoAsset.url} alt="FUN COSMOS" className="size-12 shrink-0 object-contain drop-shadow-[0_0_12px_var(--color-primary)]" />
            <span className="truncate font-display text-base font-bold tracking-[0.12em] text-foreground">FUN COSMOS</span>
          </button>
          <div className="ml-auto hidden items-center gap-6 xl:flex">
            {navItems.map(([label, id]) => <button key={id} onClick={() => jump(id)} className="text-xs font-semibold text-muted-foreground transition hover:text-foreground">{label}</button>)}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <div className="hidden items-center rounded-full border border-border bg-surface-glass p-1 sm:flex" aria-label="Language">
              {["EN", "VI"].map(lang => <button key={lang} onClick={() => setLanguage(lang)} className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${language === lang ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{lang}</button>)}
            </div>
            <Button variant="cosmos" size="lg" className="hidden xl:inline-flex" onClick={() => jump("finale")}>Enter the cosmos <ArrowRight /></Button>
            <button className="grid size-11 place-items-center rounded-full border border-border bg-surface-glass xl:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {menuOpen && <div className="glass-panel mx-4 mb-4 grid gap-1 rounded-3xl p-4 xl:hidden">{navItems.map(([label, id]) => <button key={label} onClick={() => jump(id)} className="rounded-xl px-4 py-3 text-left text-sm text-foreground hover:bg-accent/20">{label}</button>)}</div>}
      </nav>

      {/* HERO */}
      <section id="cosmos" className="relative flex min-h-[96svh] items-center justify-center overflow-hidden">
        <img src={heroImage} width={1920} height={1088} alt="Một lữ khách bước qua cánh cổng ánh sáng hướng về Trái Đất Mới" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--background),transparent_28%,transparent_62%,var(--background))] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,var(--background)_100%)] opacity-65" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pt-24 text-center">
          <img src={logoAsset.url} alt="" aria-hidden="true" className="mb-3 w-32 object-contain drop-shadow-[0_0_25px_var(--color-primary)] md:w-44" />
          <h1 className="gold-text font-display text-6xl font-bold leading-[.85] md:text-8xl lg:text-[8.5rem]">FUN COSMOS</h1>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.28em] text-glow md:text-base">5D New Earth · Role-Playing Game</p>
          <p className="mt-3 font-display text-xl font-semibold text-foreground md:text-3xl">PLAY THE COSMOS — LIVE IN HEAVEN</p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">Một thế giới nơi bạn khám phá, học hỏi, sáng tạo, kết nối và cùng kiến tạo tương lai.</p>
          <div className="mt-8 flex w-full max-w-lg flex-col justify-center gap-3 sm:flex-row">
            <Button variant="cosmos" size="lg" onClick={() => jump("core-idea")}>Enter the cosmos <ArrowRight /></Button>
            <Button variant="starlight" size="lg" onClick={() => jump("players")}>Khám phá cách hoạt động</Button>
          </div>
        </div>
        <button onClick={() => jump("core-idea")} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Scroll to explore <ChevronDown className="mx-auto mt-2 animate-bounce" /></button>
      </section>

      {/* CORE IDEA */}
      <section id="core-idea" className="section-glow relative py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="reveal">
              <Kicker>CORE IDEA · FUN COSMOS LÀ GÌ?</Kicker>
              <h2 className="font-display text-5xl font-bold leading-[.95] md:text-7xl">KHÔNG CHỈ LÀ<br /><span className="gold-text">MỘT GAME.</span></h2>
              <p className="mt-8 text-xl leading-9 text-foreground md:text-2xl">FUN COSMOS là nơi người chơi <strong>trải nghiệm phiên bản tương lai tốt đẹp hơn của chính mình</strong> — và cùng nhau xây dựng một thế giới tốt đẹp hơn.</p>
              <div className="glass-panel mt-8 rounded-[2rem] p-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-glow">Chỉ cần nhớ một câu</p>
                <p className="mt-3 font-display text-2xl font-bold md:text-3xl">Chơi để trải nghiệm. Học để phát triển.<br />Hành động để yêu thương.</p>
              </div>
            </div>
            <figure className="reveal">
              <img src={slide7.url} loading="lazy" alt="FUN COSMOS — 5D New Earth Role-Playing Game, Play the Cosmos, Live in Heaven" className="gold-frame w-full object-cover" />
            </figure>
          </div>
          <div className="mt-16 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {coreIdeaSteps.map(([num, title, desc]) => (
              <article key={num} className="glass-panel reveal rounded-3xl p-6">
                <span className="font-display text-sm text-glow">{num}</span>
                <h3 className="mt-6 font-display text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* NGƯỜI CHƠI CÓ THỂ LÀM GÌ */}
      <section id="players" className="py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Kicker>NGƯỜI CHƠI CÓ THỂ LÀM GÌ?</Kicker>
          <h2 className="max-w-4xl font-display text-5xl font-bold leading-none md:text-7xl">NĂM CÁCH ĐỂ<br /><span className="gold-text">SỐNG TRONG VŨ TRỤ NÀY.</span></h2>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {playerActions.map(([en, vi, desc]) => (
              <article key={en} className="glass-panel reveal flex flex-col items-center rounded-[2rem] p-7 text-center">
                <div className="medallion size-24"><Sparkles className="size-8 text-gold" /></div>
                <h3 className="mt-6 font-display text-xl font-bold">{en}</h3>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-glow">{vi}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
          <Artwork src={slide11.url} alt="Người chơi có thể khám phá, sáng tạo, kết nối, tiến hóa và hiện thực hóa trong FUN COSMOS" caption="Explore · Create · Connect · Evolve · Realize" />
        </div>
      </section>

      {/* FUN COSMOS THU HÚT VÌ ĐIỀU GÌ */}
      <section className="section-glow py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Kicker>FUN COSMOS THU HÚT VÌ ĐIỀU GÌ?</Kicker>
          <h2 className="font-display text-5xl font-bold md:text-7xl">FUN VẪN <span className="gold-text">RẤT FUN.</span></h2>
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            <div className="glass-panel rounded-[2rem] p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Không tập trung vào</p>
              <ul className="mt-5 space-y-3">
                {notFocus.map(x => <li key={x} className="flex items-center gap-3 text-muted-foreground"><X className="size-4 shrink-0" />{x}</li>)}
              </ul>
            </div>
            <div className="glass-panel rounded-[2rem] border-glow p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-glow">Tập trung vào</p>
              <ul className="mt-5 space-y-3">
                {isFocus.map(x => <li key={x} className="flex items-center gap-3 font-semibold text-foreground"><Check className="size-4 shrink-0 text-gold" />{x}</li>)}
              </ul>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {funStuff.map(x => <span key={x} className="glass-panel rounded-full px-4 py-2 text-sm">{x}</span>)}
          </div>
          <p className="mt-8 text-lg text-muted-foreground">Vui trước đã. Không có bài giảng đạo đức — bạn tự do khám phá, thử, sai và trưởng thành.</p>
          <Artwork src={slide25.url} alt="FUN COSMOS thu hút vì khám phá, học, sáng tạo, đóng góp, kết nối và phát triển" caption="Khám phá · Học · Sáng tạo · Đóng góp · Kết nối · Phát triển" />
        </div>
      </section>

      {/* FUTURE SELF */}
      <section className="relative min-h-[80svh] overflow-hidden py-28">
        <img src={cityImage} loading="lazy" width={1920} height={1088} alt="Một thành phố tương lai hòa cùng rừng và sông" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_5%,color-mix(in_oklab,var(--background)_70%,transparent)_52%,var(--background))]" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-10">
          <div className="max-w-2xl">
            <Kicker>YOUR FUTURE SELF</Kicker>
            <h2 className="font-display text-5xl font-bold md:text-7xl">BẠN MUỐN<br /><span className="gold-text">TRỞ THÀNH AI?</span></h2>
            <p className="mt-8 text-lg text-muted-foreground">FUN COSMOS không chỉ hỏi: “Bạn muốn chơi gì?”</p>
            <p className="mt-5 font-display text-2xl font-bold md:text-4xl">Mà hỏi: “Bạn muốn trở thành ai?”</p>
            <Button variant="cosmos" size="lg" className="mt-10" onClick={() => jump("pillars")}>Bắt đầu hành trình <ArrowRight /></Button>
          </div>
        </div>
      </section>

      {/* 5 PILLARS */}
      <section id="pillars" className="py-28">
        <div className="mx-auto max-w-[1500px] px-5 lg:px-10">
          <Kicker>5 PILLARS OF FUN COSMOS</Kicker>
          <h2 className="max-w-6xl font-display text-4xl font-bold leading-tight md:text-6xl">KHÁM PHÁ. SÁNG TẠO. KẾT NỐI.<br /><span className="gold-text">PHÁT TRIỂN. HIỆN THỰC HÓA.</span></h2>
          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {pillars.map(([num, title, desc], i) => (
              <article key={title} className={`glass-panel reveal flex min-h-96 flex-col rounded-[2rem] p-6 ${i === 4 ? "border-glow shadow-cosmos" : ""}`}>
                <span className="font-display text-sm text-glow">{num}</span>
                <div className="medallion mx-auto my-auto size-24"><Sparkles className="size-8 text-gold" /></div>
                <h3 className="font-display text-xl font-bold">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
          <div className="glass-panel mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full px-8 py-5 text-center font-display text-sm font-bold tracking-[0.14em] md:text-lg">
            <span>CHƠI</span><span className="text-gold">–</span><span>HỌC</span><span className="text-gold">–</span><span>TẠO</span><span className="text-gold">–</span><span>KẾT NỐI</span><span className="text-gold">–</span><span>HIỆN THỰC HÓA</span>
          </div>
          <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">Angel AI companion · PureLove Protocol</p>
          <Artwork src={slide15.url} alt="Năm trụ cột của FUN COSMOS cùng Angel AI và PureLove Protocol" caption="5 Pillars · Angel AI · PureLove Protocol" />
        </div>
      </section>

      {/* CORE LOOP */}
      <section id="loop" className="section-glow py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="text-center">
            <Kicker>THE CORE LOOP · VÒNG LẶP CỐT LÕI</Kicker>
            <h2 className="font-display text-5xl font-bold md:text-7xl">FROM A DREAM<br /><span className="gold-text">TO A NEW REALITY.</span></h2>
          </div>
          <div className="relative mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-primary to-transparent lg:block" />
            {loop.map(([title, desc], i) => (
              <article key={title} className="glass-panel reveal relative rounded-3xl p-6">
                <span className="mb-6 grid size-10 place-items-center rounded-full border border-glow bg-background font-display text-xs text-glow">{i + 1}</span>
                <h3 className="font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {loopChips.map(x => <span key={x} className="glass-panel rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]">{x}</span>)}
          </div>
          <p className="mt-10 text-center font-display text-2xl font-bold md:text-3xl">You dream it. We simulate it. You learn it.<br /><span className="gold-text">You create it. You live it.</span></p>
          <Artwork src={slide13.url} alt="Vòng lặp cốt lõi: Dream, Simulate, Learn, Create, Act, Verify, Reward, Evolve" caption="Dream → Simulate → Learn → Create → Act → Verify → Reward → Evolve" />
        </div>
      </section>

      {/* ANGEL AI */}
      <section id="angel" className="relative overflow-hidden bg-foreground py-28 text-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,var(--glow),transparent_48%)] opacity-20" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-[.85fr_1.15fr] lg:px-10">
          <img src={angelImage} loading="lazy" width={1280} height={1600} alt="Angel AI — người bạn đồng hành ánh sáng ấm áp" className="mx-auto aspect-[4/5] max-h-[760px] w-full rounded-[2rem] object-cover shadow-2xl" />
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-secondary">YOUR PERSONAL GAME MASTER</p>
            <h2 className="font-display text-6xl font-bold md:text-8xl">MEET<br />ANGEL AI</h2>
            <p className="mt-6 max-w-xl text-lg">Angel AI không chỉ là một chatbot. Đó là người bạn đồng hành thông minh, hiểu bạn và đi cùng bạn — <strong>không kiểm soát, không phán xét</strong>.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {angelRoles.map(([role, desc]) => (
                <div key={role} className="rounded-2xl bg-background/10 p-4 backdrop-blur-xl">
                  <strong className="text-xs font-bold uppercase tracking-[0.14em]">{role}</strong>
                  <p className="mt-1 text-sm opacity-80">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-3 rounded-[2rem] bg-background/10 p-6 backdrop-blur-xl">
              <p className="max-w-sm rounded-2xl bg-background/10 p-4"><strong>Angel AI</strong><br />“Hôm nay bạn muốn khám phá điều gì?”</p>
              <p className="ml-auto max-w-sm rounded-2xl bg-primary p-4 text-primary-foreground"><strong>Anna</strong><br />“I want to create a garden.”</p>
              <div className="flex flex-wrap items-center gap-2 pt-4 text-xs font-bold">IDEA <ArrowRight /> QUEST <ArrowRight /> LEARNING <ArrowRight /> CREATION</div>
            </div>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {angelPersonal.map(x => <li key={x} className="flex items-start gap-2 text-sm opacity-85"><Check className="mt-0.5 size-4 shrink-0" />{x}</li>)}
            </ul>
            <p className="mt-8 font-display text-xl font-bold">Always with you, always for you.</p>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl px-5 lg:px-10">
          <img src={slide16.url} loading="lazy" alt="Angel AI với năm vai trò: Guide, Companion, Teacher, Creator Assistant, Game Master" className="gold-frame w-full object-cover" />
        </div>
      </section>

      {/* ANNA'S JOURNEY */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Kicker>ANNA'S JOURNEY · GAME ↔ REAL LIFE</Kicker>
          <h2 className="font-display text-5xl font-bold md:text-7xl">ONE IDEA CAN<br /><span className="gold-text">CHANGE A WORLD.</span></h2>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {annaSteps.map(([num, title, desc]) => (
              <article key={num} className="glass-panel reveal rounded-3xl p-6">
                <span className="text-xs text-glow">{num}</span>
                <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
          <div className="glass-panel mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full px-8 py-5 font-display text-sm font-bold tracking-[0.12em] md:text-base">
            HỌC – TẠO – HÀNH ĐỘNG – KẾT NỐI – LAN TỎA – TIẾN HÓA
          </div>
          <Artwork src={slide12.url} alt="Hành trình của Anna: tạo vườn trong game, học và trồng cây ngoài đời, khu vườn lớn lên trong game" caption="Anna's Journey · Game ↔ Real Life" />
        </div>
      </section>

      {/* LOVE SCORE */}
      <section id="love-score" className="section-glow py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <Kicker>VERIFIED POSITIVE CONTRIBUTION</Kicker>
              <h2 className="font-display text-6xl font-bold md:text-8xl">LOVE<br /><span className="gold-text">SCORE</span></h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Love Score chỉ ghi nhận những đóng góp tích cực đã được xác minh.</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {loveExamples.map(x => <span key={x} className="rounded-full border border-border px-4 py-2 text-xs">{x}</span>)}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {loveQualities.map(x => <span key={x} className="medallion px-5 py-3 text-xs font-bold uppercase tracking-[0.14em]">{x}</span>)}
              </div>
            </div>
            <div className="glass-panel rounded-[2rem] p-7">
              <div className="space-y-7">
                {["ACTION", "EVIDENCE", "VERIFICATION", "RECOGNITION"].map((x, i) => (
                  <div key={x} className="flex items-center gap-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border border-glow text-glow">{i === 3 ? <Check /> : i + 1}</span>
                    <strong className="font-display">{x}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Love Score KHÔNG phải là</p>
                <ul className="mt-4 space-y-2">
                  {loveNots.map(x => <li key={x} className="flex items-center gap-3 text-sm text-muted-foreground"><X className="size-4 shrink-0" />{x}</li>)}
                </ul>
              </div>
            </div>
          </div>
          <Artwork src={slide18.url} alt="Love Score: Action, Evidence, Verification, Recognition" caption="Action → Evidence → Verification → Recognition" />
        </div>
      </section>

      {/* O2O */}
      <section id="o2o" className="py-28">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <Kicker>ONLINE ↔ OFFLINE · O2O</Kicker>
          <h2 className="font-display text-5xl font-bold md:text-7xl">HÀNH ĐỘNG CỦA BẠN<br /><span className="gold-text">ĐI XUYÊN HAI THẾ GIỚI.</span></h2>
          <div className="mt-16 flex flex-col items-center">
            {o2oSteps.map(([title, subtitle, desc], i) => (
              <div key={title} className="contents">
                <div className="glass-panel reveal w-full max-w-xl rounded-3xl px-6 py-5 text-left">
                  <span className="text-xs font-bold text-glow">{title}</span>
                  <p className="mt-1 text-lg font-semibold">{subtitle}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
                {i < o2oSteps.length - 1 && <ArrowDown className="my-3 text-primary" />}
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {o2oRewards.map(x => <span key={x} className="medallion px-5 py-3 text-xs font-bold uppercase tracking-[0.14em]">{x}</span>)}
          </div>
          <p className="mt-12 font-display text-4xl font-bold">THIS IS O2O.</p>
          <p className="mt-3 text-muted-foreground">Online to Offline. Offline back to Online.</p>
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            <img src={slide20.url} loading="lazy" alt="Từ trồng cây trong game đến trồng cây thật, được xác minh và ghi nhận" className="gold-frame w-full object-cover" />
            <img src={slide23.url} loading="lazy" alt="O2O là gì: online, offline, xác minh, Love Score và mở khóa khu vực mới" className="gold-frame w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section id="ecosystem" className="section-glow overflow-hidden py-28">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-10">
          <Kicker>FUN ECOSYSTEM</Kicker>
          <h2 className="font-display text-5xl font-bold md:text-7xl">ONE COSMOS.<br /><span className="gold-text">ONE CONNECTED ECOSYSTEM.</span></h2>
          <div className="relative mx-auto mt-20 hidden min-h-[620px] max-w-4xl md:block">
            <div className="absolute left-1/2 top-1/2 grid size-44 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-glow bg-primary/20 shadow-cosmos">
              <div><Globe2 className="mx-auto mb-2 size-10 text-glow" /><strong className="font-display">FUN COSMOS</strong></div>
            </div>
            <div className="absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border animate-[orbit_70s_linear_infinite]" />
            {ecosystem.map((name, i) => (
              <div key={name} className="glass-panel absolute grid min-h-16 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl p-3 text-xs font-bold" style={{ left: orbitPositions[i]?.[0] ?? "50%", top: orbitPositions[i]?.[1] ?? "50%" }}>{name}</div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-2 gap-3 md:hidden">
            {ecosystem.map(name => <div key={name} className="glass-panel grid min-h-16 place-items-center rounded-2xl p-3 text-xs font-bold">{name}</div>)}
          </div>
          <ul className="mx-auto mt-12 grid max-w-4xl gap-3 text-left sm:grid-cols-2">
            {ecoValues.map(x => <li key={x} className="glass-panel flex items-start gap-3 rounded-2xl p-4 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-gold" />{x}</li>)}
          </ul>
          <Artwork src={slide24.url} alt="Hệ sinh thái FUN: FUN Profile, Academy, Farm, Wallet, Angel AI, Green Earth, LoveHUB, Camly Coin, PureLove Protocol" caption="FUN COSMOS — lớp trải nghiệm chung của toàn hệ sinh thái" />
        </div>
      </section>

      {/* 5 CÂU HỎI */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Kicker>5 CÂU HỎI ĐÚNG ĐỂ THẢO LUẬN</Kicker>
          <h2 className="font-display text-5xl font-bold md:text-7xl">CÂU TRẢ LỜI CỦA BẠN<br /><span className="gold-text">LÀ MỘT VIÊN GẠCH.</span></h2>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {questions.map(([num, q]) => (
              <article key={num} className="glass-panel reveal rounded-3xl p-7">
                <span className="font-display text-sm text-gold">{num}</span>
                <p className="mt-5 text-lg leading-8">{q}</p>
              </article>
            ))}
          </div>
          <Artwork src={slide26.url} alt="Năm câu hỏi thảo luận về hành trình trong FUN COSMOS" caption="Mỗi câu trả lời là một viên gạch của vũ trụ này" />
        </div>
      </section>

      {/* MINI GAME */}
      <section className="section-glow py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Kicker>THỰC HÀNH NGAY · NHẬN LIỀN TAY</Kicker>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">99.999 <span className="gold-text">HAPPY CAMLY COIN</span></h2>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">FUN COSMOS của bạn — Imagine it · Create it · Share it.</p>
          <div className="mt-10 flex flex-wrap gap-2">
            {miniSteps.map((s, i) => <span key={s} className="glass-panel rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em]"><span className="text-gold">{i + 1}.</span> {s}</span>)}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {miniHow.map(([num, title, desc]) => (
              <article key={num} className="glass-panel reveal rounded-3xl p-6">
                <span className="font-display text-sm text-glow">{num}</span>
                <h3 className="mt-5 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {talents.map(x => <span key={x} className="medallion px-5 py-3 text-xs font-bold uppercase tracking-[0.14em]">{x}</span>)}
          </div>
          <Artwork src={slide27.url} alt="Mini game FUN COSMOS với phần thưởng 99.999 Happy Camly Coin" caption="Character → Dream → Gameplay → Angel AI → Reward → World Change → Real-world Connection" />
        </div>
      </section>

      {/* CREATE / YOUR TURN */}
      <section id="create" className="py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <Kicker>YOUR TURN</Kicker>
          <h2 className="font-display text-5xl font-bold md:text-7xl">WHAT WILL YOU CREATE<br /><span className="gold-text">IN FUN COSMOS?</span></h2>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {yourTurn.map(x => (
              <div key={x} className="medallion reveal aspect-square p-4 text-center font-display text-sm font-bold md:text-lg">{x}</div>
            ))}
          </div>
          <Artwork src={slide21.url} alt="Your turn: Story, Character, World, Music, AI, Game, Code, Community" caption="The Cosmos begins with one idea · Vũ trụ bắt đầu từ một ý tưởng" />
        </div>
      </section>

      {/* FINALE */}
      <section id="finale" className="relative flex min-h-[95svh] items-center justify-center overflow-hidden py-28">
        <img src={finaleImage} loading="lazy" width={1920} height={1088} alt="Nhiều thế hệ cùng nhìn qua cánh cổng hướng về một Trái Đất tươi sáng" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--background),transparent_35%,var(--background))] opacity-85" />
        <div className="relative z-10 mx-auto max-w-5xl px-5 text-center">
          <h2 className="font-display text-5xl font-bold leading-none md:text-8xl">THE COSMOS BEGINS<br /><span className="gold-text">WITH ONE IDEA.</span></h2>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-foreground">Vũ trụ bắt đầu từ một ý tưởng — và ý tưởng đó có thể là của bạn.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="cosmos" size="lg">Enter the cosmos <ArrowRight /></Button>
            <Button variant="starlight" size="lg">Start with one idea</Button>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-border px-5 py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoAsset.url} alt="FUN COSMOS" className="size-14 object-contain" />
              <strong className="font-display text-lg">FUN COSMOS</strong>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">PLAY THE COSMOS — LIVE IN HEAVEN</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
            {navItems.map(([label, id]) => <button key={id} onClick={() => jump(id)} className="hover:text-foreground">{label}</button>)}
          </div>
          <span className="text-xs font-bold">EN &nbsp;|&nbsp; VI</span>
        </div>
        <p className="mx-auto mt-10 max-w-5xl text-center font-display text-xs font-bold tracking-[0.14em] text-muted-foreground md:text-sm">
          CHƠI ĐỂ TRẢI NGHIỆM – HỌC ĐỂ PHÁT TRIỂN – HÀNH ĐỘNG ĐỂ YÊU THƯƠNG – CÙNG NHAU XÂY DỰNG THẾ GIỚI TỐT ĐẸP HƠN
        </p>
      </footer>
    </main>
  );
}
