import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { ArtworkViewer } from "./story-artwork";
import { descriptions } from "./artwork-descriptions";
import { Button } from "./ui/button";

const story = [7, 8, 9, 10, 11, 12, 14, 13, 15, 20, 23, 25];

export function CosmosStoryGallery() {
  const root = useRef<HTMLElement>(null);
  const selectedRef = useRef(0);
  const touchStart = useRef<number | null>(null);
  const idleUntil = useRef(0);
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cycle, setCycle] = useState(0);

  const goTo = (index: number, manual = true) => {
    const next = (index + story.length) % story.length;
    selectedRef.current = next;
    setSelected(next);
    setProgress(0);
    if (manual) {
      idleUntil.current = performance.now() + 8000;
      setCycle((value) => value + 1);
    }
  };

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let visible = false;
    let elapsed = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    }, { threshold: 0.35 });
    observer.observe(element);
    const timer = window.setInterval(() => {
      if (paused || !visible || reduced.matches || document.hidden || document.querySelector('[role="dialog"]')) return;
      if (performance.now() < idleUntil.current) return;
      elapsed += 250;
      setProgress(Math.min(100, (elapsed / 5000) * 100));
      if (elapsed >= 5000) {
        elapsed = 0;
        goTo(selectedRef.current + 1, false);
      }
    }, 250);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [paused, cycle]);

  return (
    <section
      ref={root}
      id="discover"
      className="csg-gallery"
      aria-labelledby="csg-title"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") goTo(selectedRef.current - 1);
        if (event.key === "ArrowRight") goTo(selectedRef.current + 1);
      }}
    >
      <header className="csg-heading">
        <span>04 · DISCOVER FUN COSMOS</span>
        <h2 id="csg-title">MỘT HÀNH TRÌNH.<br />VÔ SỐ KHẢ NĂNG.</h2>
        <p>{descriptions[story[selected]]}</p>
      </header>
      <div
        className="csg-stage"
        onPointerMove={() => { idleUntil.current = performance.now() + 8000; }}
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          const end = event.changedTouches[0]?.clientX;
          if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 60) {
            goTo(selectedRef.current + (end < touchStart.current ? 1 : -1));
          }
          touchStart.current = null;
        }}
      >
        {story.map((image, index) => (
          <div key={image} className={`csg-slide${selected === index ? " is-active" : ""}`} aria-hidden={selected !== index} inert={selected !== index}>
            <ArtworkViewer id={image} />
          </div>
        ))}
        <div className="csg-controls">
          <Button variant="starlight" size="icon" aria-label="Ảnh trước" onClick={() => goTo(selected - 1)}><ArrowLeft /></Button>
          <Button variant="starlight" size="icon" aria-label={paused ? "Tiếp tục trình chiếu" : "Tạm dừng trình chiếu"} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play /> : <Pause />}</Button>
          <Button variant="starlight" size="icon" aria-label="Ảnh tiếp theo" onClick={() => goTo(selected + 1)}><ArrowRight /></Button>
        </div>
      </div>
      <div className="csg-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <div className="csg-thumbs" aria-label="Chọn chương câu chuyện">
        {story.map((image, index) => (
          <button key={image} aria-label={`Chương ${index + 1}: ${descriptions[image]}`} aria-pressed={selected === index} onClick={() => goTo(index)}>
            <img src={`/slides/${image}.jpg`} alt="" width="160" height="90" loading="lazy" />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
