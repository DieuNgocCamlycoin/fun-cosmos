import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import kingdomAsset from "@/assets/cosmos/kingdom-hotel-cover.png.asset.json";
import cityAsset from "@/assets/cosmos/fun-city-beach-cover.png.asset.json";
import treasureAsset from "@/assets/cosmos/fun-treasure-city-cover.png.asset.json";

const games = [
  {
    title: "KINGDOM HOTEL",
    creator: "Bé Trí",
    description: "Tham quan và khám phá một khách sạn trong mơ.",
    cta: "BƯỚC VÀO KINGDOM HOTEL",
    href: "https://funkingdom.itch.io/funcosmos10d",
    image: kingdomAsset.url,
  },
  {
    title: "FUN CITY & BEACH",
    creator: "Bé Trí",
    description: "Thời trang, thành phố và bãi biển trong cùng một thế giới.",
    cta: "KHÁM PHÁ CITY & BEACH",
    href: "https://funkingdom.itch.io/funcosmos5d",
    image: cityAsset.url,
  },
  {
    title: "FUN TREASURE CITY",
    creator: "Bé Hoàng",
    description: "Khám phá thành phố và thu thập Camly Coin cùng FUN Money.",
    cta: "BẮT ĐẦU FUN TREASURE CITY",
    href: "https://fun-cosmos.pages.dev/",
    image: treasureAsset.url,
  },
] as const;

export function GameWorlds() {
  return (
    <section id="games" className="gw-section" aria-labelledby="gw-title">
      <header className="gw-heading">
        <span>05 · CHOOSE YOUR WORLD</span>
        <h2 id="gw-title">
          CHỌN THẾ GIỚI
          <br />
          BẠN MUỐN BƯỚC VÀO
        </h2>
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
              <p>Sáng tạo bởi {game.creator}</p>
              <h3>{game.title}</h3>
              <span>{game.description}</span>
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
