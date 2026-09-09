import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { ArtworkViewer } from "./story-artwork";
import { descriptions } from "./artwork-descriptions";
import { Button } from "./ui/button";

const story = [7, 8, 9, 10, 11, 12, 14, 13, 15, 20, 23, 25];
const storyTitles: Record<number, string> = {
  7: "FUN COSMOS là gì?",
  8: "Không chỉ là một trò chơi",
  9: "Từ thiết kế đến đời thật",
  10: "Bảy thế giới trải nghiệm",
  11: "Người chơi có thể làm gì?",
  12: "Câu chuyện của Anna",
  13: "Core Loop",
  14: "Core Idea",
  15: "Năm trụ cột",
  20: "Game — Real Life",
  23: "Online ↔ Offline",
  25: "Niềm vui trong FUN COSMOS",
};

export function CosmosStoryGallery() {
  const root = useRef<HTMLElement>(null);
  const selectedRef = useRef(0);
  const touchStart = useRef<number | null>(null);
  const idleUntil = useRef(0);
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cycle, setCycle] = useState(0);
  const currentImage = story[selected] ?? 7;

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
      <div className="csg-layout">
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
          <div className="csg-progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
            <div className="csg-markers">
              {story.map((image, index) => <i key={image} className={index === selected ? "is-active" : ""} />)}
            </div>
          </div>
        </div>
        <header className="csg-heading">
          <h2 id="csg-title">KHÁM PHÁ FUN COSMOS</h2>
          <div className="csg-caption" key={currentImage}>
            <p className="csg-count"><strong>{String(selected + 1).padStart(2, "0")}</strong> / {String(story.length).padStart(2, "0")}</p>
            <h3>{storyTitles[currentImage]}</h3>
            <p>{descriptions[currentImage]}</p>
          </div>
        </header>
      </div>
    </section>
  );
}
