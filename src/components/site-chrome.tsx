import { useEffect, useId, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Check, Menu, X, Pause, Play } from "lucide-react";
import { GAME_URL } from "@/lib/links";
import { useI18n } from "@/lib/i18n";
import goldGlobe from "@/assets/language-gold-globe.jpg";
import "./site-chrome.css";

function LanguageMenu() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const optionsId = useId();

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <div
      className="fc-language"
      ref={root}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="fc-language-trigger"
        aria-label={t(
          `Language: ${locale === "en" ? "English" : "Vietnamese"}. Choose language`,
          `Ngôn ngữ: ${locale === "en" ? "Tiếng Anh" : "Tiếng Việt"}. Chọn ngôn ngữ`,
        )}
        aria-expanded={open}
        aria-controls={open ? optionsId : undefined}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        <img className="fc-language-icon" src={goldGlobe} alt="" width="24" height="24" />
        <span>{locale.toUpperCase()}</span>
      </button>
      {open && (
        <div
          id={optionsId}
          className="fc-language-options"
          role="group"
          aria-label={t("Choose language", "Chọn ngôn ngữ")}
        >
          {(["en", "vi"] as const).map((option) => (
            <button
              key={option}
              type="button"
              lang={option}
              aria-pressed={locale === option}
              onClick={() => {
                setLocale(option);
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              <span>{option === "en" ? "English" : "Tiếng Việt"}</span>
              {locale === option && <Check size={15} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader({ home = false, active = "" }: { home?: boolean; active?: string }) {
  const { t } = useI18n();
  const links = [
    ["/#home", t("HOME", "TRANG CHỦ")],
    ["/#origin", "URANTIA"],
    ["/cosmos", "FUN COSMOS"],
    ["/angel-ai", "ANGEL AI"],
    ["/love-score", "LOVE SCORE"],
    ["/ecosystem", "FUN ECOSYSTEM"],
    ["/your-turn", "YOUR TURN"],
  ];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeHref = home
    ? ({
        home: "/#home",
        origin: "/#origin",
        angel: "/angel-ai",
        love: "/love-score",
        ecosystem: "/ecosystem",
        create: "/your-turn",
      }[active] ?? "/cosmos")
    : pathname;
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  const header = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let previous = window.scrollY;
    let travel = 0;
    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - previous;
      previous = y;
      if (
        y < 64 ||
        open ||
        header.current?.matches(":focus-within") ||
        header.current?.querySelector("details[open]")
      ) {
        travel = 0;
        setHidden(false);
        return;
      }
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
      if (Math.abs(travel) >= 18) {
        setHidden(travel > 0);
        travel = 0;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <header
      ref={header}
      className="fc-header"
      data-hidden={hidden && !open}
      onFocusCapture={() => setHidden(false)}
    >
      <a
        className="fc-brand"
        href={home ? "#home" : "/"}
        aria-label={t("FUN COSMOS — Home", "FUN COSMOS — Về đầu trang")}
      >
        <img src="/cosmos/cosmos.png" width="52" height="52" alt="" />
      </a>
      <nav
        id="fc-navigation"
        className="fc-navigation"
        data-open={open}
        aria-label={t("FUN COSMOS navigation", "Điều hướng FUN COSMOS")}
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
              <summary aria-current={activeHref === "/cosmos" ? "location" : undefined}>
                FUN COSMOS ⌄
              </summary>
              <div>
                <a href="/cosmos">{t("Explore the world", "Khám phá thế giới")} ↗</a>
                {[
                  { id: "cosmos-cinema", title: "Cinematic World" },
                  { id: "discover", title: "Discover FUN COSMOS" },
                  { id: "games", title: t("Choose a world", "Chọn thế giới") },
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
              aria-current={activeHref === href ? (home ? "location" : "page") : undefined}
            >
              {title}
            </a>
          ),
        )}
      </nav>
      <LanguageMenu />
      <a
        className="fc-play"
        href={GAME_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={t("PLAY NOW", "CHƠI NGAY")}
      >
        <span>{t("PLAY NOW", "CHƠI NGAY")}</span> <ArrowUpRight size={16} />
      </a>
      <button
        ref={trigger}
        className="fc-menu"
        aria-controls="fc-navigation"
        aria-expanded={open}
        aria-label={open ? t("Close menu", "Đóng danh mục") : t("Open menu", "Mở danh mục")}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
export function SiteFooter({ paused, onPause }: { paused: boolean; onPause: () => void }) {
  const { t } = useI18n();
  return (
    <footer className="fc-footer">
      <a href="/" className="fc-footer-brand">
        <img src="/cosmos/cosmos.png" width="42" height="42" alt="" />
        <span>
          FUN COSMOS
          <small>
            {t("PLAY THE COSMOS · LIVE IN HEAVEN", "CHƠI TRONG VŨ TRỤ · SỐNG GIỮA THIÊN ĐÀNG")}
          </small>
        </span>
      </a>
      <a href="/ecosystem">{t("Ecosystem", "Hệ sinh thái")}</a>
      <a href="/your-turn">{t("Create together", "Cùng sáng tạo")}</a>
      <button aria-pressed={paused} onClick={onPause}>
        {paused ? <Play size={16} /> : <Pause size={16} />}{" "}
        {paused ? t("Resume motion", "Bật chuyển động") : t("Pause motion", "Tạm dừng chuyển động")}
      </button>
      <LanguageMenu />
    </footer>
  );
}
