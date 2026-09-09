import type { CSSProperties } from "react";

/** Non-destructive windows onto supplied artwork; source files remain intact. */
export function ArtworkFragment({
  kind,
  index,
  className = "",
}: {
  kind: "contribution" | "journey" | "world";
  index: number;
  className?: string;
}) {
  const positions =
    kind === "contribution"
      ? {
          x: (([672, 850, 1030, 1207][index % 4]! - 70) / 1780) * 100,
          y: (((index < 4 ? 280 : 495) - 70) / 940) * 100,
        }
      : kind === "journey"
        ? { x: (([713, 1006, 1290, 1590][index]! - 70) / 1780) * 100, y: ((718 - 70) / 940) * 100 }
        : { x: (index / 6) * 100, y: 52 };
  return (
    <span
      aria-hidden="true"
      className={`art-fragment art-${kind} ${className}`}
      style={
        { "--fragment-x": `${positions.x}%`, "--fragment-y": `${positions.y}%` } as CSSProperties
      }
    />
  );
}
