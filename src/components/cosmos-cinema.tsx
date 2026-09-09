import { useEffect, useRef, useState } from "react";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import videoAsset from "@/assets/cosmos/fun-cosmos-cinematic.mp4.asset.json";
import posterAsset from "@/assets/cosmos/fun-cosmos-cinematic-poster.jpg.asset.json";

export function CosmosCinema() {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const toggleSound = () => {
    const media = video.current;
    if (!media) return;
    const next = !muted;
    media.muted = next;
    setMuted(next);
    if (!next) void media.play();
  };

  return (
    <section id="cosmos-cinema" className="cc-cinema" aria-labelledby="cosmos-cinema-title">
      <div className="cc-frame">
        <div className="cc-media" aria-hidden={reducedMotion}>
          {reducedMotion ? (
            <img src={posterAsset.url} alt="" width="1920" height="1080" />
          ) : (
            <video
              ref={video}
              src={videoAsset.url}
              poster={posterAsset.url}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          )}
        </div>
        <div className="cc-shade" />
        <div className="cc-overlay">
          <div className="cc-copy">
            <p className="cc-kicker">5D NEW EARTH ROLE-PLAYING GAME</p>
            <h2 id="cosmos-cinema-title">FUN COSMOS LÀ GÌ?</h2>
          </div>
          <div className="cc-lower">
            <p>
              Một thế giới nơi bạn khám phá, học hỏi, sáng tạo<br className="cc-copy-break" />
              và cùng nhau kiến tạo tương lai.
            </p>
            <div className="cc-actions">
              <Button asChild variant="cosmos" size="lg">
                <a href="/cosmos">KHÁM PHÁ FUN COSMOS <ArrowRight /></a>
              </Button>
              <Button asChild variant="starlight" size="lg">
                <a href="#games">CHỌN THẾ GIỚI</a>
              </Button>
            </div>
          </div>
        </div>
        {!reducedMotion && (
          <Button
            type="button"
            variant="starlight"
            size="icon"
            className="cc-sound"
            aria-label={muted ? "Bật âm thanh video" : "Tắt âm thanh video"}
            aria-pressed={!muted}
            onClick={toggleSound}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </Button>
        )}
      </div>
    </section>
  );
}
