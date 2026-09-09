import { ArtworkFragment } from "./artwork-fragment";
import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { X, ArrowRight } from "lucide-react";

export type SceneMoment = {
  title: string;
  text: string;
  asset: string;
  background?: string | undefined;
};
/** Supplied cutouts stay separate from the scenery and all text stays in the DOM. */
export function LivingScene({
  moments,
  background = "/cosmos/cosmic-clouds.png",
  character = "/cosmos/topic-world/angel-640.png",
  label,
}: {
  moments: SceneMoment[];
  background?: string | undefined;
  character?: string;
  label: string;
}) {
  const [selected, setSelected] = useState(0);
  const [details, setDetails] = useState(true);
  const id = useId();
  const current = moments[selected]!;
  return (
    <div
      className="story-scene"
      aria-label={label}
      style={
        { "--scene-background": `url("${current.background || background}")` } as CSSProperties
      }
    >
      <div className="story-orbit" aria-hidden="true" />
      <img
        className="story-character"
        src={character}
        alt=""
        loading="lazy"
        width="640"
        height="640"
      />
      <div className="story-object" key={current.asset}>
        {current.asset.startsWith("world:") ? (
          <ArtworkFragment kind="world" index={Number(current.asset.split(":")[1])} />
        ) : (
          <img src={current.asset} alt={current.title} loading="lazy" width="240" height="240" />
        )}
      </div>
      <div className="story-stops" aria-label={label}>
        {moments.map((moment, i) => (
          <button
            key={moment.title}
            aria-pressed={i === selected}
            aria-controls={id}
            onClick={() => {
              setSelected(i);
              setDetails(true);
            }}
          >
            {moment.asset.startsWith("world:") ? (
              <ArtworkFragment kind="world" index={Number(moment.asset.split(":")[1])} />
            ) : (
              <img src={moment.asset} alt="" width="56" height="56" loading="lazy" />
            )}
            <span>{moment.title}</span>
          </button>
        ))}
      </div>
      <div id={id} className="story-caption" aria-live="polite">
        {details ? (
          <>
            <button
              className="story-close"
              aria-label="Đóng chi tiết"
              onClick={() => setDetails(false)}
            >
              <X size={18} />
            </button>
            <small>
              {String(selected + 1).padStart(2, "0")} / {String(moments.length).padStart(2, "0")}
            </small>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
            <button
              className="story-next"
              onClick={() => setSelected((selected + 1) % moments.length)}
            >
              Khám phá tiếp <ArrowRight size={16} />
            </button>
          </>
        ) : (
          <button className="story-next" onClick={() => setDetails(true)}>
            Mở câu chuyện: {current.title}
          </button>
        )}
      </div>
    </div>
  );
}
export function ArchiveDisclosure({
  children,
  title = "Mở thư viện hình ảnh gốc",
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <details className="story-library">
      <summary>
        {title} <span aria-hidden="true">＋</span>
      </summary>
      <div>{children}</div>
    </details>
  );
}
