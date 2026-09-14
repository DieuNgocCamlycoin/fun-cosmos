import { Maximize2, Send } from "lucide-react";
import { ArtworkViewer } from "./story-artwork";
import { Button } from "./ui/button";

const programs = [
  {
    image: 26,
    title: "5 câu hỏi thảo luận",
    action: "Xem 5 câu hỏi",
    pending: false,
  },
  {
    image: 27,
    title: "99.999 Happy Camly Coin",
    action: "Tham gia 99.999",
    pending: false,
  },
] as const;

export function YourTurnPrograms({ onJoin }: { onJoin: () => void }) {
  return (
    <section id="create-gallery" data-chapter="create" className="yt-programs">
      <header className="yt-programs-head">
        <span className="lc-eyebrow">✧ YOUR TURN</span>
        <h2>Cùng xem. Cùng thảo luận. Cùng tham gia.</h2>
      </header>
      <div className="yt-feature">
        <ArtworkViewer id={21} />
      </div>
      <div className="yt-programs-grid">
        {programs.map((program) => (
          <article className="yt-program" key={program.image}>
            <div className="yt-program-art">
              <ArtworkViewer id={program.image} />
            </div>
            <footer className="yt-program-footer">
              <h3>{program.title}</h3>
              {program.image === 27 ? (
                <Button className="yt-program-action" onClick={onJoin} aria-label="Tham gia 99.999 Happy Camly Coin">
                  <Send aria-hidden="true" /> {program.action}
                </Button>
              ) : (
                <span className="yt-program-action" aria-hidden="true">
                  <Maximize2 /> {program.action}
                </span>
              )}
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}