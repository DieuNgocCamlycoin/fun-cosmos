import { useState, useRef, useEffect, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "../site-chrome";
import "./scene-refinement.css";
import "./topic-world.css";

export function TopicWorldShell({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) =>
          entry.target.setAttribute("data-visible", String(entry.isIntersecting)),
        ),
      { rootMargin: "80px" },
    );
    el.querySelectorAll("section").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="tw" ref={root} data-paused={paused}>
      <a className="tw-skip" href="#world-content">
        Đến nội dung chính
      </a>
      <SiteHeader />
      <main id="world-content">{children}</main>
      <SiteFooter paused={paused} onPause={() => setPaused(!paused)} />
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
        <a className="tw-outline" href="/your-turn">
          Bắt đầu với một ý tưởng <ArrowUpRight size={18} />
        </a>
      </div>
      <a className="tw-text-link" href="/love-score">
        Khám phá tiếp: Thế giới Love Score →
      </a>
    </WorldSection>
  );
}
