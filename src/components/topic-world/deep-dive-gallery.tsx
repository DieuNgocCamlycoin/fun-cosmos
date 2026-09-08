import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { descriptions } from "../artwork-descriptions";

export function DeepDiveGallery({ images }: { images: readonly number[] }) {
  const opener = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const start = useRef<{ x: number; y: number } | null>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const id = images[selected]!;
  const change = (next: number) => {
    setSelected(Math.max(0, Math.min(images.length - 1, next)));
    setZoom(1);
    viewport.current?.scrollTo(0, 0);
  };
  return (
    <>
      <div className="tw-artifacts">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={(event) => {
              opener.current = event.currentTarget;
              change(index);
              setOpen(true);
            }}
            aria-label={`Mở infographic: ${descriptions[image]}`}
          >
            <img
              src={`/cosmos/topic-world/angel-concept-${image}.jpg`}
              alt=""
              width="1920"
              height="1080"
              loading="lazy"
            />
            <span>
              {index === 0 ? "Năm vai trò đồng hành" : "Angel AI hỗ trợ bạn như thế nào?"}{" "}
              <span aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </div>
      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          setZoom(1);
        }}
      >
        <DialogContent
          className="tw-viewer"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
          onKeyDown={(e) => {
            if (zoom === 1 && e.key === "ArrowRight") {
              e.preventDefault();
              change(selected + 1);
            }
            if (zoom === 1 && e.key === "ArrowLeft") {
              e.preventDefault();
              change(selected - 1);
            }
          }}
        >
          <DialogTitle>{descriptions[id]}</DialogTitle>
          <DialogDescription>
            Phóng lớn và cuộn để đọc. Khi ảnh vừa khung, vuốt hoặc dùng phím trái/phải để đổi ảnh.
          </DialogDescription>
          <div className="tw-viewer-tools">
            <button
              disabled={selected === 0}
              onClick={() => change(selected - 1)}
              aria-label="Ảnh trước"
            >
              ←
            </button>
            <span aria-live="polite">
              {selected + 1} / {images.length}
            </span>
            <button
              disabled={selected === images.length - 1}
              onClick={() => change(selected + 1)}
              aria-label="Ảnh sau"
            >
              →
            </button>
            <button
              disabled={zoom === 1}
              onClick={() => setZoom(Math.max(1, zoom - 0.5))}
              aria-label="Thu nhỏ"
            >
              −
            </button>
            <button
              onClick={() => {
                setZoom(1);
                viewport.current?.scrollTo(0, 0);
              }}
            >
              Vừa khung
            </button>
            <button
              disabled={zoom === 4}
              onClick={() => setZoom(Math.min(4, zoom + 0.5))}
              aria-label="Phóng to"
            >
              +
            </button>
            <span>{zoom * 100}%</span>
          </div>
          <div
            className="tw-viewer-image"
            ref={viewport}
            tabIndex={0}
            role="region"
            aria-label="Ảnh infographic, cuộn khi phóng lớn"
            onTouchStart={(e) => {
              const t = e.touches[0];
              start.current = t ? { x: t.clientX, y: t.clientY } : null;
            }}
            onTouchEnd={(e) => {
              const t = e.changedTouches[0];
              if (t && start.current && zoom === 1) {
                const dx = t.clientX - start.current.x,
                  dy = t.clientY - start.current.y;
                if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy))
                  change(selected + (dx < 0 ? 1 : -1));
              }
              start.current = null;
            }}
          >
            <img
              src={`/slides/${id}.jpg`}
              alt={descriptions[id]}
              style={{ width: `${zoom * 100}%` }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
