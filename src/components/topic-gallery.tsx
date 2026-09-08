import { useState, useRef } from "react";
import { ArtworkViewer } from "./story-artwork";
import { descriptions } from "./artwork-descriptions";

export function TopicGallery({
  id,
  title,
  images,
  labels,
  chapter,
}: {
  id: string;
  title: string;
  images: number[];
  labels: string[];
  chapter: string;
}) {
  const [selected, setSelected] = useState(0);
  const touchStart = useRef<number | null>(null);
  const imageId = images[selected] ?? images[0]!;
  return (
    <section id={id} data-chapter={chapter} className="tg-section">
      <div className="tg-copy">
        <span className="lc-eyebrow">{chapter === "about" ? "FUN COSMOS" : "Khám phá"}</span>
        <h2>{title}</h2>
        {images.length > 1 && (
          <div className="tg-choices" aria-label={`Nội dung ${title}`}>
            {images.map((image, index) => (
              <button
                key={image}
                aria-pressed={selected === index}
                aria-controls={`${id}-art`}
                onClick={() => setSelected(index)}
              >
                <span>{labels[index]}</span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        )}
        <p aria-live="polite">{descriptions[imageId]}</p>
        <small>Chạm vào hình để phóng lớn và đọc chi tiết.</small>
      </div>
      <div
        id={`${id}-art`}
        className="tg-art"
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null || !event.changedTouches[0]) return;
          const delta = event.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(delta) > 60)
            setSelected((value) =>
              Math.max(0, Math.min(images.length - 1, value + (delta < 0 ? 1 : -1))),
            );
          touchStart.current = null;
        }}
      >
        <ArtworkViewer key={imageId} id={imageId} />
        {images.length > 1 && (
          <div className="tg-thumbnails" aria-label={`Chọn ảnh: ${title}`}>
            {images.map((image, index) => (
              <button
                key={image}
                aria-label={labels[index]}
                aria-pressed={selected === index}
                aria-controls={`${id}-art`}
                onClick={() => setSelected(index)}
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
