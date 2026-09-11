import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import kingdomAsset from "@/assets/cosmos/kingdom-hotel-cover.png.asset.json";
import cityAsset from "@/assets/cosmos/fun-city-beach-cover.png.asset.json";
import treasureAsset from "@/assets/cosmos/fun-treasure-city-cover.png.asset.json";

const games = [
  {
    title: "FUN CITY & BEACH",
    cta: "KHÁM PHÁ CITY & BEACH",
    href: "https://funkingdom.itch.io/funcosmos5d",
    image: cityAsset.url,
  },
  {
    title: "KINGDOM HOTEL",
    cta: "BƯỚC VÀO KINGDOM HOTEL",
    href: "https://funkingdom.itch.io/funcosmos10d",
    image: kingdomAsset.url,
  },
  {
    title: "FUN TREASURE CITY",
    cta: "BẮT ĐẦU FUN TREASURE CITY",
    href: "https://fun-cosmos.pages.dev/",
    image: treasureAsset.url,
  },
] as const;

export function GameWorlds() {
  return (
    <section id="games" className="gw-section" aria-labelledby="gw-title">
      <header className="gw-heading">
        <h2 id="gw-title">CHỌN THẾ GIỚI BẠN MUỐN BƯỚC VÀO</h2>
      </header>
      <div className="gw-track">
        {games.map((game) => (
          <article key={game.title} className="gw-world">
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
    </section>
  );
}
