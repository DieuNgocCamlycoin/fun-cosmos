import { ArtworkFragment } from "./artwork-fragment";
import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { X, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

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
  onChoose,
}: {
  moments: SceneMoment[];
  background?: string | undefined;
  character?: string;
  label: string;
  onChoose?: (index: number) => void;
}) {
  const { t } = useI18n();
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
              aria-label={t("Close details", "Đóng chi tiết")}
              onClick={() => setDetails(false)}
            >
              <X size={18} />
            </button>
            <small>
              {String(selected + 1).padStart(2, "0")} / {String(moments.length).padStart(2, "0")}
            </small>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
            {onChoose && (
              <button className="story-choose" onClick={() => onChoose(selected)}>
                {t("Begin with this idea", "Bắt đầu từ cảm hứng này")} <ArrowRight size={16} />
              </button>
            )}
            <button
              className="story-next"
              onClick={() => setSelected((selected + 1) % moments.length)}
            >
              {t("Explore next", "Khám phá tiếp")} <ArrowRight size={16} />
            </button>
          </>
        ) : (
          <button className="story-next" onClick={() => setDetails(true)}>
            {t("Open story", "Mở câu chuyện")}: {current.title}
          </button>
        )}
      </div>
    </div>
  );
}
export function ArchiveDisclosure({ children, title }: { children: ReactNode; title?: string }) {
  const { t } = useI18n();
  return (
    <details className="story-library">
      <summary>
        {title ?? t("Open the original artwork gallery", "Mở thư viện hình ảnh gốc")}{" "}
        <span aria-hidden="true">＋</span>
      </summary>
      <div>{children}</div>
    </details>
  );
}
