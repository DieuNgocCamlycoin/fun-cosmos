import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { externalLink } from "@/lib/links";
import "./cosmos-arrival.css";

/** A static DOM scene first; scroll depth is an optional desktop enhancement. */
export function CosmosArrival() {
  const scene = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const shell = el.closest(".tw");
    const media = matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let visible = false;
    let listening = false;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      el.style.setProperty("--portal-progress", progress.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const sync = () => {
      const enabled =
        media.matches &&
        visible &&
        !document.hidden &&
        !paused &&
        shell?.getAttribute("data-paused") !== "true";
      if (enabled && !listening) {
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        listening = true;
        schedule();
      } else if (!enabled && listening) {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        cancelAnimationFrame(frame);
        frame = 0;
        listening = false;
      }
      if (!media.matches) el.style.removeProperty("--portal-progress");
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    });
    observer.observe(el);
    const motion = new MutationObserver(sync);
    if (shell) motion.observe(shell, { attributes: true, attributeFilter: ["data-paused"] });
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      motion.disconnect();
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [paused]);
  return (
    <section className="cp-arrival" ref={scene} aria-labelledby="cosmos-title">
      <div className="cp-sky" aria-hidden="true" />
      <div className="cp-stage" aria-hidden="true">
        <div className="cp-gateway">
          <div className="cp-world" />
          <div className="cp-rim" />
          <div className="cp-threshold" />
        </div>
        <img
          className="cp-traveler"
          src="/cosmos/urantia-traveler.png"
          width="1024"
          height="1536"
          alt=""
        />
      </div>
      <div className="cp-copy">
        <a href="/" className="tw-back">
          ← Về trang chủ FUN COSMOS
        </a>
        <p className="tw-eyebrow">5D NEW EARTH ROLE-PLAYING GAME</p>
        <h1 id="cosmos-title" className="tw-metal">
          FUN COSMOS
        </h1>
        <p className="cp-tagline">PLAY THE COSMOS · LIVE IN HEAVEN</p>
        <p>
          Một thế giới để khám phá.
          <br />
          Một nơi để cùng kiến tạo.
        </p>
        <div className="cw-actions">
          <a className="tw-button" {...externalLink}>
            CHƠI NGAY <ArrowUpRight size={18} />
          </a>
          <a className="tw-outline" href="#definition">
            Khám phá thế giới <ArrowDown size={18} />
          </a>
        </div>
      </div>
      <div className="cp-foot">
        <a href="#definition">
          BƯỚC QUA CÁNH CỔNG <ArrowDown size={16} />
        </a>
        <button className="cp-motion" aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? <Play size={14} /> : <Pause size={14} />}
          {paused ? "Bật chiều sâu" : "Tạm dừng chiều sâu"}
        </button>
      </div>
    </section>
  );
}
