import { useState, useRef, useEffect, type ReactNode } from "react";
import { ArrowRight, Pause, Play, Maximize2 } from "lucide-react";
import { ArtworkViewer } from "./story-artwork";
import { descriptions } from "./artwork-descriptions";
import { openFullscreen } from "@/lib/fullscreen";

export function TopicGallery({
  id,
  title,
  images,
  labels,
  chapter,
  footer,
}: {
  id: string;
  title: string;
  images: number[];
  labels: string[];
  chapter: string;
  footer?: ReactNode;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const idleUntil = useRef(0);
  const noteActivity = () => {
    idleUntil.current = performance.now() + 8000;
  };
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const element = root.current;
    if (!element || images.length < 2) return;
    let visible = false;
    let elapsed = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    const timer = window.setInterval(() => {
      if (
        !visible ||
        paused ||
        reduced.matches ||
        document.hidden ||
        element.closest(".lc-paused") ||
        element.querySelector(":focus-visible") ||
        document.querySelector('[role="dialog"]')
      ) {
        elapsed = 0;

        return;
      }
      if (performance.now() < idleUntil.current) return;
      elapsed += 250;
      setProgress((value) => value + 5);
      if (elapsed >= 5000) {
        elapsed = 0;
        const next = (selectedRef.current + 1) % images.length;
        setPrevious(selectedRef.current);
        selectedRef.current = next;
        setSelected(next);
      }
    }, 250);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [images.length, paused, cycle]);
  const [selected, setSelected] = useState(0);
  const [previous, setPrevious] = useState(0);
  const selectedRef = useRef(0);
  const dragStartX = useRef<number | null>(null);
  const dragOffset = useRef(0);

  const transitionTo = (index: number) => {
    if (images.length <= 1) return;

    const next = (index + images.length) % images.length;
    if (next === selectedRef.current) return;

    setPrevious(selectedRef.current);
    selectedRef.current = next;
    setSelected(next);
  };

  const goTo = (index: number) => {
    noteActivity();
    setCycle((value) => value + 1);
    transitionTo(index);
  };

  const moveForward = () => {
    goTo(selectedRef.current + 1);
  };

  const onDragStart = (clientX: number) => {
    dragStartX.current = clientX;
    dragOffset.current = 0;
  };

  const onDragMove = (clientX: number) => {
    if (dragStartX.current === null) return;
    dragOffset.current = clientX - dragStartX.current;
  };

  const onDragEnd = () => {
    if (dragStartX.current === null) return;
    const delta = dragOffset.current;
    dragStartX.current = null;
    dragOffset.current = 0;

    if (delta < -70) {
      moveForward();
    }
  };

  const getSlideStyle = (index: number) => {
    const isActive = index === selected;
    const isPrevious = index === previous && !isActive;
    const x = isActive ? 0 : isPrevious ? -100 : 100;

    return {
      transform: `translate(-50%, -50%) translateX(${x}%) scale(${isActive ? 1 : 0.97})`,
      opacity: isActive || isPrevious ? 1 : 0,
      zIndex: isActive ? 2 : 1,
    };
  };

  return (
    <section ref={root} id={id} data-chapter={chapter} className="tg-section">
      <div className="tg-copy">
        <h2>{title}</h2>

        {images.length > 1 && (
          <div className="tg-choices" aria-label={`Nội dung ${title}`}>
            {images.map((image, index) => (
              <button
                key={image}
                aria-pressed={selected === index}
                aria-controls={`${id}-art`}
                onClick={() => goTo(index)}
              >
                <span className="tg-choice-label">
                  <small className="tg-choice-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </small>
                  {labels[index]}
                </span>
                <span aria-hidden="true" className="tg-choice-arrow">
                  ↗
                </span>
              </button>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="tg-progress" aria-hidden="true">
            {images.map((image, index) => (
              <span
                key={image}
                className={index === selected ? "is-current" : ""}
                style={index === selected ? { backgroundPosition: `${progress}px 0` } : undefined}
              />
            ))}
          </div>
        )}
        <div className="tg-caption-stack">
          {images.map((image, index) => (
            <div
              key={image}
              className="tg-story-caption"
              aria-hidden={selected !== index}
              style={{ visibility: selected === index ? "visible" : "hidden" }}
            >
              <p>{descriptions[image]}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        id={`${id}-art`}
        className="tg-art"
        onPointerEnter={noteActivity}
        onPointerMove={noteActivity}
        onPointerDown={noteActivity}
        onTouchStart={(event) => onDragStart(event.touches[0]?.clientX ?? 0)}
        onTouchMove={(event) => onDragMove(event.touches[0]?.clientX ?? 0)}
        onTouchEnd={onDragEnd}
        onMouseDown={(event) => onDragStart(event.clientX)}
        onMouseMove={(event) => onDragMove(event.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
      >
        <div className="tg-art-stage">
          {images.length > 1 && (
            <div className="tg-controls">
              <button
                aria-label={paused ? "Tiếp tục trình chiếu" : "Tạm dừng trình chiếu"}
                aria-pressed={paused}
                onClick={() => setPaused(!paused)}
              >
                {paused ? <Play size={18} /> : <Pause size={18} />}
              </button>
              <button aria-label="Xem ảnh tiếp theo" onClick={moveForward}>
                <ArrowRight size={20} />
              </button>
            </div>
          )}
          {images.map((image, index) => (
            <div
              key={image}
              className={`tg-art-slide${selected === index ? " is-active" : ""}`}
              style={getSlideStyle(index)}
              aria-hidden={selected !== index}
              inert={selected !== index}
            >
              <ArtworkViewer id={image} />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <div className="tg-thumbnails" aria-label={`Chọn ảnh: ${title}`}>
            {images.map((image, index) => (
              <button
                key={image}
                aria-label={labels[index]}
                aria-pressed={selected === index}
                aria-controls={`${id}-art`}
                onClick={() => goTo(index)}
              >
                <img
                  src={`/slides/${image}.jpg`}
                  alt={labels[index]}
                  loading="lazy"
                  width="160"
                  height="90"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
