import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import kingdomAsset from "@/assets/cosmos/kingdom-hotel-cover.png.asset.json";
import cityAsset from "@/assets/cosmos/fun-city-beach-cover.png.asset.json";
import treasureAsset from "@/assets/cosmos/fun-treasure-city-cover.png.asset.json";
import { GAME_URL } from "@/lib/links";

const games = [
  {
    title: "FUN CITY & BEACH",
    cta: "KHÁM PHÁ CITY & BEACH",
    href: "https://funkingdom.itch.io/funcosmos5d",
    image: cityAsset.url,
    featured: false,
  },
  {
    title: "KINGDOM HOTEL",
    cta: "BƯỚC VÀO KINGDOM HOTEL",
    href: GAME_URL,
    image: kingdomAsset.url,
    featured: true,
  },
  {
    title: "FUN TREASURE CITY",
    cta: "BẮT ĐẦU FUN TREASURE CITY",
    href: "https://fun-cosmos.pages.dev/",
    image: treasureAsset.url,
    featured: false,
  },
] as const;

export function GameWorlds() {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const cards = [...element.querySelectorAll<HTMLElement>(".gw-world")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setCurrent(cards.indexOf(visible.target as HTMLElement));
      },
      { root: element, threshold: [0.5, 0.75] },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    const card = track.current?.querySelectorAll<HTMLElement>(".gw-world")[index];
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setCurrent(index);
  };

  return (
    <section id="games" className="gw-section" aria-labelledby="gw-title">
      <header className="gw-heading">
        <h2 id="gw-title">CHỌN THẾ GIỚI BẠN MUỐN BƯỚC VÀO</h2>
      </header>
      <div className="gw-track" ref={track}>
        {games.map((game) => (
          <article
            key={game.title}
            className={game.featured ? "gw-world gw-world--featured" : "gw-world"}
          >
            <img
              src={game.image}
              alt={`Bìa game ${game.title}`}
              width="1129"
              height="1456"
              loading="lazy"
            />
            <div className="gw-overlay">
              <Button asChild variant="cosmos" size="lg">
                <a href={game.href} target="_blank" rel="noreferrer">
                  {game.cta} <ArrowUpRight />
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
      <div className="gw-dots" aria-label="Chọn thẻ game">
        {games.map((game, index) => (
          <button
            key={game.title}
            type="button"
            aria-label={game.title}
            aria-current={current === index}
            onClick={() => goTo(index)}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
