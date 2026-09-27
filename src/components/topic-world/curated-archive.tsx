import { useRef, useState } from "react";
import { DeepDiveGallery } from "./deep-dive-gallery";
import { descriptions, descriptionsEn } from "../artwork-descriptions";
import { useI18n } from "@/lib/i18n";

export function CuratedArchive({ images }: { images: readonly number[] }) {
  const { locale, t } = useI18n();
  const copy = locale === "en" ? descriptionsEn : descriptions;
  const [selected, setSelected] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const current = images[selected]!;
  return (
    <div className="nw-archive">
      <div
        onTouchStart={(e) => {
          const t = e.touches[0];
          touch.current = t ? { x: t.clientX, y: t.clientY } : null;
        }}
        onTouchEnd={(e) => {
          const t = e.changedTouches[0];
          if (t && touch.current) {
            const dx = t.clientX - touch.current.x;
            const dy = t.clientY - touch.current.y;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy))
              setSelected((s) => Math.max(0, Math.min(images.length - 1, s + (dx < 0 ? 1 : -1))));
          }
          touch.current = null;
        }}
      >
        <DeepDiveGallery
          items={[
            {
              thumb: `/slides/${current}.jpg`,
              full: `/slides/${current}.jpg`,
              title: copy[current]!,
            },
          ]}
        />
      </div>
      {images.length > 1 && (
        <div className="nw-thumbnails" aria-label={t("Choose artwork", "Chọn tư liệu")}>
          {images.map((n, i) => (
            <button
              key={n}
              aria-label={t(`Choose image: ${copy[n]}`, `Chọn ảnh: ${copy[n]}`)}
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              <img src={`/slides/${n}.jpg`} alt="" width="160" height="90" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
