import { useState, useRef, useEffect, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Menu, Pause, Play, X } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { GAME_URL } from "@/lib/links";
import "./topic-world.css";

const destinations = [
  ["/#origin", "URANTIA"],
  ["/#about", "FUN COSMOS"],
  ["/angel-ai", "ANGEL AI"],
  ["/love-score", "LOVE SCORE"],
  ["/#ecosystem", "FUN ECOSYSTEM"],
  ["/#create", "YOUR TURN"],
];


export function TopicWorldShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const hero = root.current?.querySelector(".tw-hero");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => {
      root.current?.setAttribute("data-hero-visible", String(entry?.isIntersecting ?? false));
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  const [menu, setMenu] = useState(false);
  const [paused, setPaused] = useState(false);
  return (
    <div className="tw" ref={root} data-paused={paused}>
      <a className="tw-skip" href="#world-content">
        Đến nội dung chính
      </a>
      <header className="tw-header">
        <a className="tw-brand" href="/" aria-label="Về FUN COSMOS">
          <img src="/cosmos/cosmos.png" alt="" width="54" height="54" />
        </a>
        <nav
          id="world-nav"
          className={menu ? "tw-nav is-open" : "tw-nav"}
          aria-label="Điều hướng FUN COSMOS"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setMenu(false);
              menuButton.current?.focus();
            }
          }}
        >
          {destinations.map(([href, title]) => (
            <a key={href} href={href} aria-current={href === "/angel-ai" ? "page" : undefined}>
              {title}
            </a>
          ))}
        </nav>
        <a className="tw-enter" href="/#games">
          Chơi FUN COSMOS <ArrowUpRight size={16} />
        </a>
        <button
          className="tw-menu"
          ref={menuButton}
          aria-label={menu ? "Đóng danh mục" : "Mở danh mục"}
          aria-expanded={menu}
          aria-controls="world-nav"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main id="world-content">{children}</main>
      <footer className="tw-footer">
        <a href="/">
          <ArrowLeft size={16} /> Về FUN COSMOS
        </a>
        <span>PLAY THE COSMOS · LIVE IN HEAVEN</span>
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? <Play size={16} /> : <Pause size={16} />}{" "}
          {paused ? "Bật chuyển động" : "Tạm dừng chuyển động"}
        </button>
        <small>VI · Tiếng Việt</small>
      </footer>
    </div>
  );
}

export function WorldSection({
  id,
  number,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`tw-section ${className}`} aria-labelledby={`${id}-title`}>
      <div className="tw-section-heading">
        <p className="tw-eyebrow">
          {number} / {eyebrow}
        </p>
        <h2 id={`${id}-title`} className="tw-metal">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function NextWorldCTA() {
  return (
    <WorldSection
      id="continue"
      number="07"
      eyebrow="HÀNH TRÌNH TIẾP TỤC"
      title="BẠN MUỐN ĐI ĐÂU TIẾP?"
      className="tw-finale"
    >
      <p>Một thế giới để khám phá. Một ý tưởng để bắt đầu.</p>
      <div className="tw-actions">
        <a className="tw-button" href="/">
          Trở về FUN COSMOS <ArrowUpRight size={18} />
        </a>
        <a className="tw-outline" href="/#create">
          Bắt đầu với một ý tưởng <ArrowUpRight size={18} />
        </a>
      </div>
      <a className="tw-text-link" href="/#love">
        Khám phá tiếp: Love Score trên trang chủ →
      </a>
    </WorldSection>
  );
}
