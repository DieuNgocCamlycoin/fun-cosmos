import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { chapters } from "./living-data";

import { descriptions } from "./artwork-descriptions";

// Retain original narrative artwork until its corresponding scene is fully rebuilt.
// Source 22 duplicates 14 and is intentionally absent from the chapter mapping.
export function StoryArtwork({
  topic,
  images,
}: {
  topic: (typeof chapters)[number][0];
  images: readonly number[];
}) {
  const chapter = chapters.find(([id]) => id === topic)!;
  return (
    <div className="lc-story-artwork" aria-label={chapter[1]}>
      {images.map((id) => (
        <figure key={id} data-chapter={topic} className="lc-story-picture">
          <ArtworkViewer id={id} />
          <figcaption>{descriptions[id]}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function ArtworkViewer({ id }: { id: number }) {
  const [zoom, setZoom] = useState(1);
  return (
    <Dialog onOpenChange={() => setZoom(1)}>
      <DialogTrigger asChild>
        <button className="lc-art-open" aria-label={`Phóng lớn: ${descriptions[id]}`}>
          <img
            src={`/slides/${id}.jpg`}
            alt={descriptions[id]}
            width={1920}
            height={1080}
            loading="lazy"
            decoding="async"
          />
          <span className="lc-art-zoom" aria-hidden="true">
            ⤢
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="lc-art-dialog">
        <DialogTitle>{descriptions[id]}</DialogTitle>
        <DialogDescription>
          Phóng to để đọc chi tiết. Dùng thanh cuộn để di chuyển trong ảnh.
        </DialogDescription>
        <div className="lc-art-tools">
          <button
            onClick={() => setZoom((v) => Math.max(1, v - 0.5))}
            disabled={zoom === 1}
            aria-label="Thu nhỏ"
          >
            −
          </button>
          <button onClick={() => setZoom(1)}>Vừa khung</button>
          <button
            onClick={() => setZoom((v) => Math.min(4, v + 0.5))}
            disabled={zoom === 4}
            aria-label="Phóng to"
          >
            +
          </button>
          <span aria-live="polite">{zoom * 100}%</span>
        </div>
        <div className="lc-art-scroll" data-fit={zoom === 1} tabIndex={0}>
          <img
            src={`/slides/${id}.jpg`}
            alt={descriptions[id]}
            style={zoom === 1 ? undefined : { width: `${zoom * 100}%`, maxWidth: "none" }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
