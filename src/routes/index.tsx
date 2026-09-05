import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronDown, Globe2, Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/fun-cosmos-logo.png.asset.json";
import heroImage from "@/assets/cosmos-hero.jpg";
import cityImage from "@/assets/new-earth-city.jpg";
import angelImage from "@/assets/angel-ai.jpg";
import finaleImage from "@/assets/cosmos-finale.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FUN COSMOS — 5D New Earth Role-Playing Game" },
      { name: "description", content: "Explore, learn, create, connect and bring meaningful experiences from a virtual world into real life with FUN COSMOS." },
      { property: "og:title", content: "FUN COSMOS — 5D New Earth Role-Playing Game" },
      { property: "og:description", content: "Play the cosmos, create your world, and bring meaningful experiences into real life." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const possibilities = [
  ["RPG", "Avatar · Quest · Skills · Progression"],
  ["LIFE SIMULATION", "Thử nghiệm những vai trò và tương lai khác nhau."],
  ["SOCIAL WORLD", "Gặp gỡ · Kết nối · Làm việc · Xây cộng đồng"],
  ["CREATOR PLATFORM", "Tạo nhà · Thời trang · Âm nhạc · Quest · Thế giới"],
  ["LEARNING WORLD", "Học thông qua trải nghiệm và nhiệm vụ."],
  ["AI + O2O WORLD", "Angel AI cá nhân hóa hành trình và kết nối game với đời thực."],
];

const pillars = [
  ["01", "EXPLORE", "Khám phá thành phố, khu vườn, đảo, hành tinh, cổng không gian và những thế giới mới."],
  ["02", "CREATE", "Tạo nhà, vườn, nhạc, trang phục, cửa hàng, quest, nhân vật và thế giới."],
  ["03", "CONNECT", "Kết nối bạn bè, gia đình, cộng đồng, creators, mentors và đội nhóm."],
  ["04", "EVOLVE", "Phát triển kỹ năng, kiến thức, khả năng sáng tạo và lịch sử đóng góp."],
  ["05", "REALIZE", "Đưa những điều tốt đẹp được trải nghiệm trong game trở thành hành động thật."],
];

const loop = [
  ["DREAM", "Mình muốn trở thành ai?"], ["SIMULATE", "Thử tương lai đó trong game."],
  ["LEARN", "Angel AI và hệ thống hướng dẫn."], ["CREATE", "Tạo ra một điều mới."],
  ["ACT", "Hành động trong game hoặc ngoài đời."], ["VERIFY", "Xác minh bằng bằng chứng phù hợp."],
  ["REWARD", "Nhận ghi nhận, Love Score và unlock."], ["EVOLVE", "Nhân vật và thế giới phát triển."],
];

const roles = ["Architect", "Creator", "Farmer", "Artist", "Explorer", "Entrepreneur", "Designer", "Builder", "Teacher"];
const creatorPaths = [["STORY", "Quest Narrative"], ["CHARACTER", "Identity Design"], ["WORLD", "Environment Design"], ["MUSIC", "Cosmic Sound"], ["3D ART", "Living Objects"], ["GAME DESIGN", "Play Systems"], ["AI", "Angel AI Systems"], ["CODE", "Unity / Gameplay"], ["COMMUNITY", "Shared Missions"], ["ARCHITECTURE", "Future Cities"], ["EDUCATION", "Learning Worlds"]];
const ecosystem = ["FUN Profile", "Angel AI", "FUN Academy", "FUN Farm", "Green Earth", "LoveHUB", "FUN Wallet", "FUN Money", "Camly Coin", "PureLove Protocol"];

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-glow"><Sparkles className="size-4" />{children}</p>;
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
          <div className="ml-auto hidden items-center gap-7 lg:flex">
            {[["Cosmos","cosmos"],["Experience","experience"],["Angel AI","angel"],["Love Score","love-score"],["O2O","o2o"],["Ecosystem","ecosystem"],["Create","create"]].map(([label,id]) => <button key={id} onClick={() => jump(id)} className="text-xs font-semibold text-muted-foreground transition hover:text-foreground">{label}</button>)}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <div className="hidden items-center rounded-full border border-border bg-surface-glass p-1 sm:flex" aria-label="Language">
              {["EN","VI"].map(lang => <button key={lang} onClick={() => setLanguage(lang)} className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${language === lang ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{lang}</button>)}
            </div>
            <Button variant="cosmos" size="lg" className="hidden xl:inline-flex" onClick={() => jump("finale")}>Enter the cosmos <ArrowRight /></Button>
            <button className="grid size-11 place-items-center rounded-full border border-border bg-surface-glass lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {menuOpen && <div className="glass-panel mx-4 mb-4 grid gap-1 rounded-3xl p-4 lg:hidden">{["Cosmos","Experience","Angel AI","Love Score","O2O","Ecosystem","Create"].map(label => <button key={label} onClick={() => jump(label.toLowerCase().replace(" ", "-"))} className="rounded-xl px-4 py-3 text-left text-sm text-foreground hover:bg-accent/20">{label}</button>)}</div>}
      </nav>

      <section id="cosmos" className="relative flex min-h-[96svh] items-center justify-center overflow-hidden">
        <img src={heroImage} width={1920} height={1088} alt="A traveler enters a luminous gateway toward the future New Earth" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--background),transparent_28%,transparent_62%,var(--background))] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,var(--background)_100%)] opacity-65" />
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-5 pt-24 text-center">
          <img src={logoAsset.url} alt="" aria-hidden="true" className="mb-3 w-32 object-contain drop-shadow-[0_0_25px_var(--color-primary)] md:w-44" />
          <h1 className="pearl-text font-display text-6xl font-bold leading-[.85] md:text-8xl lg:text-[8.5rem]">FUN COSMOS</h1>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.28em] text-glow md:text-base">5D New Earth · Role-Playing Game</p>
          <p className="mt-3 font-display text-xl font-semibold text-foreground md:text-3xl">PLAY THE COSMOS — LIVE IN HEAVEN</p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">Một thế giới nơi bạn khám phá, học hỏi, sáng tạo, kết nối và cùng kiến tạo tương lai.</p>
          <div className="mt-8 flex w-full max-w-lg flex-col justify-center gap-3 sm:flex-row">
            <Button variant="cosmos" size="lg" onClick={() => jump("experience")}>Enter the cosmos <ArrowRight /></Button>
            <Button variant="starlight" size="lg" onClick={() => jump("about")}>Discover how it works</Button>
          </div>
        </div>
        <button onClick={() => jump("about")} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Scroll to explore <ChevronDown className="mx-auto mt-2 animate-bounce" /></button>
      </section>

      <section id="about" className="section-glow relative mx-auto grid min-h-[80svh] max-w-7xl items-center gap-12 px-5 py-28 md:grid-cols-2 lg:px-10">
        <div className="reveal"><Kicker>FUN COSMOS LÀ GÌ?</Kicker><h2 className="font-display text-5xl font-bold leading-[.95] md:text-7xl">KHÔNG CHỈ LÀ<br/><span className="pearl-text">MỘT GAME.</span></h2></div>
        <div className="reveal space-y-8"><p className="text-xl leading-9 text-foreground md:text-2xl">Một thế giới nhập vai tương lai, nơi mỗi người khám phá mình muốn trở thành ai, học điều mình yêu thích và cùng cộng đồng kiến tạo một thế giới tốt đẹp hơn.</p><div className="glass-panel flex items-center justify-center gap-4 rounded-3xl p-7 font-display text-2xl font-bold md:text-4xl"><span>GAME</span><span className="text-glow">↔</span><span>REAL LIFE</span></div><p className="text-muted-foreground">Điều bạn học và tạo trong game có thể kết nối với cuộc sống thật.</p></div>
      </section>

      <section id="experience" className="relative py-28"><div className="mx-auto max-w-7xl px-5 lg:px-10"><Kicker>ONE WORLD. MANY POSSIBILITIES.</Kicker><h2 className="max-w-4xl font-display text-5xl font-bold leading-none md:text-7xl">MỘT VŨ TRỤ.<br/><span className="pearl-text">VÔ SỐ CÁCH ĐỂ SỐNG.</span></h2><div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{possibilities.map(([title,desc], i) => <article key={title} className={`glass-panel reveal group relative min-h-64 overflow-hidden rounded-[2rem] p-7 transition duration-500 hover:-translate-y-2 hover:border-glow ${i === 0 || i === 5 ? "lg:col-span-2" : ""}`}><span className="text-xs font-bold text-glow">0{i+1}</span><div className="absolute -right-10 -top-10 size-40 rounded-full border border-border transition duration-700 group-hover:scale-125 group-hover:border-glow"/><h3 className="mt-20 font-display text-2xl font-bold">{title}</h3><p className="mt-3 max-w-md leading-7 text-muted-foreground">{desc}</p></article>)}</div></div></section>

      <section className="relative min-h-[90svh] overflow-hidden py-28"><img src={cityImage} loading="lazy" width={1920} height={1088} alt="A thriving future city woven into forests and rivers" className="absolute inset-0 size-full object-cover"/><div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_5%,color-mix(in_oklab,var(--background)_70%,transparent)_52%,var(--background))]"/><div className="relative mx-auto max-w-7xl px-5 lg:px-10"><div className="max-w-2xl"><Kicker>YOUR FUTURE SELF</Kicker><h2 className="font-display text-5xl font-bold md:text-7xl">BẠN MUỐN<br/><span className="pearl-text">TRỞ THÀNH AI?</span></h2><p className="mt-8 text-lg text-muted-foreground">FUN COSMOS không chỉ hỏi: “Bạn muốn chơi gì?”</p><p className="mt-5 font-display text-2xl font-bold md:text-4xl">Mà hỏi: “Bạn muốn trở thành ai?”</p><div className="mt-10 flex flex-wrap gap-2">{roles.map(role => <span key={role} className="glass-panel rounded-full px-4 py-2 text-sm">{role}</span>)}</div><Button variant="cosmos" size="lg" className="mt-10" onClick={() => jump("pillars")}>Begin your journey <ArrowRight /></Button></div></div></section>

      <section id="pillars" className="py-28"><div className="mx-auto max-w-[1500px] px-5 lg:px-10"><Kicker>5 PILLARS OF FUN COSMOS</Kicker><h2 className="max-w-6xl font-display text-4xl font-bold leading-tight md:text-6xl">KHÁM PHÁ. SÁNG TẠO. KẾT NỐI.<br/><span className="pearl-text">PHÁT TRIỂN. HIỆN THỰC HÓA.</span></h2><div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-5">{pillars.map(([num,title,desc],i) => <article key={title} className={`glass-panel reveal flex min-h-96 flex-col rounded-[2rem] p-6 ${i===4 ? "border-glow shadow-cosmos" : ""}`}><span className="font-display text-sm text-glow">{num}</span><div className={`my-auto mx-auto grid size-24 place-items-center rounded-full border ${i===4 ? "border-gold text-gold" : "border-border text-glow"}`}><Sparkles className="size-8"/></div><h3 className="font-display text-xl font-bold">{title}</h3><p className="mt-4 text-sm leading-6 text-muted-foreground">{desc}</p></article>)}</div></div></section>

      <section className="section-glow py-28"><div className="mx-auto max-w-7xl px-5 lg:px-10"><div className="text-center"><Kicker>THE CORE LOOP</Kicker><h2 className="font-display text-5xl font-bold md:text-7xl">FROM A DREAM<br/><span className="pearl-text">TO A NEW REALITY.</span></h2></div><div className="relative mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="absolute left-0 right-0 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-primary to-transparent lg:block"/>{loop.map(([title,desc],i)=><article key={title} className="glass-panel reveal relative rounded-3xl p-6"><span className="mb-6 grid size-10 place-items-center rounded-full border border-glow bg-background font-display text-xs text-glow">{i+1}</span><h3 className="font-display text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{desc}</p></article>)}</div></div></section>

      <section id="angel" className="relative overflow-hidden bg-foreground py-28 text-background"><div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,var(--glow),transparent_48%)] opacity-20"/><div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-[.85fr_1.15fr] lg:px-10"><div className="relative"><img src={angelImage} loading="lazy" width={1280} height={1600} alt="Angel AI, a warm luminous intelligence companion" className="mx-auto aspect-[4/5] max-h-[760px] w-full rounded-[2rem] object-cover shadow-2xl"/></div><div><p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-secondary">YOUR PERSONAL GAME MASTER</p><h2 className="font-display text-6xl font-bold md:text-8xl">MEET<br/>ANGEL AI</h2><div className="mt-9 flex flex-wrap gap-2">{["Companion","Guide","Teacher","Game Master","Creator Assistant"].map(x=><span key={x} className="rounded-full border border-background/20 px-4 py-2 text-xs font-bold uppercase">{x}</span>)}</div><div className="mt-10 space-y-3 rounded-[2rem] bg-background/10 p-6 backdrop-blur-xl"><p className="max-w-sm rounded-2xl bg-background/10 p-4"><strong>Angel AI</strong><br/>“Hôm nay bạn muốn khám phá điều gì?”</p><p className="ml-auto max-w-sm rounded-2xl bg-primary p-4 text-primary-foreground"><strong>Anna</strong><br/>“I want to create a garden.”</p><div className="flex flex-wrap items-center gap-2 pt-4 text-xs font-bold">IDEA <ArrowRight/> QUEST <ArrowRight/> LEARNING <ArrowRight/> CREATION</div></div></div></div></section>

      <section className="py-28"><div className="mx-auto max-w-7xl px-5 lg:px-10"><Kicker>ANNA'S JOURNEY</Kicker><h2 className="font-display text-5xl font-bold md:text-7xl">ONE IDEA CAN<br/><span className="pearl-text">CHANGE A WORLD.</span></h2><div className="mt-16 grid gap-4 md:grid-cols-5">{[["01","A blank space"],["02","Plant a seed"],["03","Shape the water"],["04","Choose the flowers"],["05","Design the light"]].map(([num,text],i)=><article key={num} className="glass-panel reveal rounded-3xl p-5"><span className="text-xs text-glow">{num}</span><div className="my-7 h-28 rounded-2xl bg-[radial-gradient(circle_at_center,var(--primary),transparent_68%)] opacity-80"/><h3 className="font-display text-lg font-bold">{text}</h3>{i<4 && <ArrowRight className="mt-4 text-muted-foreground"/>}</article>)}</div><div className="mt-10 grid gap-4 md:grid-cols-2"><div className="glass-panel rounded-[2rem] p-8"><p className="text-sm text-glow">ANGEL AI ASKS</p><p className="mt-3 text-xl">“Bạn có muốn học cách chăm một loại cây thật ngoài đời không?”</p></div><div className="glass-panel rounded-[2rem] border-glow p-8"><p className="font-display text-3xl font-bold">GAME <span className="text-glow">↔</span> REAL LIFE</p><p className="mt-3 text-muted-foreground">Khi Anna trở lại, khu vườn đã phát triển thành một hệ sinh thái rộng lớn.</p></div></div></div></section>

      <section id="love-score" className="section-glow py-28"><div className="mx-auto max-w-7xl px-5 lg:px-10"><div className="grid gap-12 md:grid-cols-2"><div><Kicker>VERIFIED POSITIVE CONTRIBUTION</Kicker><h2 className="font-display text-6xl font-bold md:text-8xl">LOVE<br/><span className="pearl-text">SCORE</span></h2><p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Love Score ghi nhận những đóng góp tích cực đã được xác minh.</p><div className="mt-8 flex flex-wrap gap-2">{["Learning","Creating","Helping","Building","Coding","Planting","Mentoring","Community"].map(x=><span key={x} className="rounded-full border border-border px-4 py-2 text-xs">{x}</span>)}</div></div><div className="glass-panel rounded-[2rem] p-7"><div className="space-y-7">{["ACTION","EVIDENCE","VERIFICATION","RECOGNITION"].map((x,i)=><div key={x} className="flex items-center gap-5"><span className="grid size-12 shrink-0 place-items-center rounded-full border border-glow text-glow">{i===3?<Check/>:i+1}</span><strong className="font-display">{x}</strong></div>)}</div><div className="mt-8 border-t border-border pt-6 text-sm leading-7 text-muted-foreground">Không đo linh hồn. Không đo giác ngộ.<br/>Không đánh giá giá trị con người.<br/>Không xếp con người thành cao hay thấp.</div></div></div></div></section>

      <section id="o2o" className="py-28"><div className="mx-auto max-w-5xl px-5 text-center"><Kicker>ONLINE ↔ OFFLINE</Kicker><h2 className="font-display text-5xl font-bold md:text-7xl">YOUR ACTIONS CAN<br/><span className="pearl-text">CROSS WORLDS.</span></h2><div className="mt-16 flex flex-col items-center">{[["VIRTUAL QUEST","Plant a Virtual Tree"],["REAL WORLD","Join Green Earth"],["ACTION","Plant a Real Tree"],["VERIFY","Verified Contribution"],["RECOGNITION","Love Score"],["WORLD EVOLVES","A Virtual Forest Unlocks"]].map(([title,desc],i)=><div key={title} className="contents"><div className="glass-panel reveal w-full max-w-xl rounded-3xl px-6 py-5"><span className="text-xs font-bold text-glow">{title}</span><p className="mt-1 text-lg">{desc}</p></div>{i<5 && <ArrowDown className="my-3 text-primary"/>}</div>)}</div><p className="mt-12 font-display text-4xl font-bold">THIS IS O2O.</p><p className="mt-3 text-muted-foreground">Online to Offline. Offline back to Online.</p></div></section>

      <section id="ecosystem" className="section-glow overflow-hidden py-28"><div className="mx-auto max-w-7xl px-5 text-center"><Kicker>FUN ECOSYSTEM</Kicker><h2 className="font-display text-5xl font-bold md:text-7xl">ONE COSMOS.<br/><span className="pearl-text">ONE CONNECTED ECOSYSTEM.</span></h2><div className="relative mx-auto mt-20 min-h-[620px] max-w-4xl"><div className="absolute left-1/2 top-1/2 grid size-44 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-glow bg-primary/20 shadow-cosmos"><div><Globe2 className="mx-auto mb-2 size-10 text-glow"/><strong className="font-display">FUN COSMOS</strong></div></div><div className="absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border animate-[orbit_70s_linear_infinite]"/>{ecosystem.map((name,i)=>{const angle=(i/ecosystem.length)*Math.PI*2; return <div key={name} className="glass-panel absolute grid min-h-16 w-36 place-items-center rounded-2xl p-3 text-xs font-bold" style={{left:`calc(50% + ${Math.cos(angle)*43}% - 4.5rem)`,top:`calc(50% + ${Math.sin(angle)*43}% - 2rem)`}}>{name}</div>})}</div><p className="mx-auto max-w-2xl text-muted-foreground">FUN COSMOS có thể trở thành lớp trải nghiệm chung của toàn FUN Ecosystem.</p></div></section>

      <section id="create" className="py-28"><div className="mx-auto max-w-7xl px-5 lg:px-10"><Kicker>CREATE THE FUTURE</Kicker><h2 className="font-display text-5xl font-bold md:text-7xl">THE COSMOS IS NOT FINISHED.<br/><span className="pearl-text">BECAUSE YOU ARE PART OF ITS CREATION.</span></h2><div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{creatorPaths.map(([title,desc],i)=><article key={title} className={`glass-panel group reveal min-h-44 rounded-3xl p-5 transition duration-500 hover:-translate-y-2 hover:border-glow ${i===2||i===6 ? "md:col-span-2" : ""}`}><Sparkles className="mb-10 text-glow"/><h3 className="font-display font-bold">{title}</h3><p className="mt-2 text-xs text-muted-foreground opacity-60 transition group-hover:opacity-100">{desc}</p></article>)}</div><p className="mt-12 text-xl">Bạn không cần biết tất cả. <span className="text-glow">Hãy bắt đầu từ điều bạn yêu thích nhất.</span></p></div></section>

      <section id="finale" className="relative flex min-h-[95svh] items-center justify-center overflow-hidden py-28"><img src={finaleImage} loading="lazy" width={1920} height={1088} alt="People of many generations look through a gateway toward a hopeful future Earth" className="absolute inset-0 size-full object-cover"/><div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--background),transparent_35%,var(--background))] opacity-85"/><div className="relative z-10 mx-auto max-w-5xl px-5 text-center"><h2 className="font-display text-5xl font-bold leading-none md:text-8xl">WHAT WILL YOU CREATE<br/><span className="pearl-text">IN FUN COSMOS?</span></h2><p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-foreground">A Story? &nbsp; A Character? &nbsp; A Garden? &nbsp; A City?<br/>A World? &nbsp; An AI? &nbsp; A Game? &nbsp; A Better Future?</p><div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Button variant="cosmos" size="lg">Enter the cosmos <ArrowRight/></Button><Button variant="starlight" size="lg">Start with one idea</Button></div><p className="mt-20 font-display text-3xl font-bold md:text-5xl">THE COSMOS BEGINS WITH ONE IDEA.</p><p className="mt-3 text-muted-foreground">And that idea can be yours.</p></div></section>

      <footer className="relative border-t border-border px-5 py-12"><div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-3"><img src={logoAsset.url} alt="FUN COSMOS" className="size-14 object-contain"/><strong className="font-display text-lg">FUN COSMOS</strong></div><p className="mt-2 text-xs text-muted-foreground">PLAY THE COSMOS — LIVE IN HEAVEN</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">{["About","FUN Ecosystem","Creators","Learning","Community","Privacy"].map(x=><a href="#about" key={x} className="hover:text-foreground">{x}</a>)}</div><span className="text-xs font-bold">EN &nbsp;|&nbsp; VI</span></div></footer>
    </main>
  );
}