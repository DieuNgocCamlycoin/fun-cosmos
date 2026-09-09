import { useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X, Pause, Play } from "lucide-react";
import { GAME_URL } from "@/lib/links";
import { cosmosContents } from "./cosmos-contents";
import "./site-chrome.css";

const links = [
  ["/#home", "TRANG CHỦ"],
  ["/#origin", "URANTIA"],
  ["/cosmos", "FUN COSMOS"],
  ["/angel-ai", "ANGEL AI"],
  ["/love-score", "LOVE SCORE"],
  ["/ecosystem", "FUN ECOSYSTEM"],
  ["/your-turn", "YOUR TURN"],
];
export function SiteHeader({ home = false, active = "" }: { home?: boolean; active?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <header className="fc-header">
      <a className="fc-brand" href={home ? "#home" : "/"} aria-label="FUN COSMOS — Về đầu trang">
        <img src="/cosmos/cosmos.png" width="52" height="52" alt="" />
      </a>
      <nav
        id="fc-navigation"
        className="fc-navigation"
        data-open={open}
        aria-label="Điều hướng FUN COSMOS"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            trigger.current?.focus();
          }
        }}
        onClick={() => setOpen(false)}
      >
        {links.map(([href, title]) =>
          home && href === "/cosmos" ? (
            <details key={href} className="fc-topics" onClick={(e) => e.stopPropagation()}>
              <summary>FUN COSMOS ⌄</summary>
              <div>
                <a href="/cosmos">Khám phá thế giới ↗</a>
                {[
                  { id: "about", title: "Hành trình trở về" },
                  ...cosmosContents,
                  { id: "games", title: "Chơi game" },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      setOpen(false);
                      const parent = e.currentTarget.closest("details");
                      if (parent) parent.open = false;
                    }}
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </details>
          ) : (
            <a
              key={href}
              href={home && href?.startsWith("/#") ? href.slice(1) : href}
              aria-current={
                pathname === href ? "page" : home && href === `/#${active}` ? "location" : undefined
              }
            >
              {title}
            </a>
          ),
        )}
      </nav>
      <a className="fc-play" href={GAME_URL} target="_blank" rel="noreferrer">
        CHƠI NGAY <ArrowUpRight size={16} />
      </a>
      <button
        ref={trigger}
        className="fc-menu"
        aria-controls="fc-navigation"
        aria-expanded={open}
        aria-label={open ? "Đóng danh mục" : "Mở danh mục"}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
export function SiteFooter({ paused, onPause }: { paused: boolean; onPause: () => void }) {
  return (
    <footer className="fc-footer">
      <a href="/" className="fc-footer-brand">
        <img src="/cosmos/cosmos.png" width="42" height="42" alt="" />
        <span>
          FUN COSMOS<small>PLAY THE COSMOS · LIVE IN HEAVEN</small>
        </span>
      </a>
      <a href="/ecosystem">Hệ sinh thái</a>
      <a href="/your-turn">Cùng sáng tạo</a>
      <button aria-pressed={paused} onClick={onPause}>
        {paused ? <Play size={16} /> : <Pause size={16} />}{" "}
        {paused ? "Bật chuyển động" : "Tạm dừng chuyển động"}
      </button>
      <small>VI · Tiếng Việt</small>
    </footer>
  );
}
