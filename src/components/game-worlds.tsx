import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { useI18n } from "@/lib/i18n";
import { GAME_URL } from "@/lib/links";

const games = [
  {
    title: "FUN CITY & BEACH",
    cta: "KHÁM PHÁ CITY & BEACH",
    href: "https://funkingdom.itch.io/funcosmos5d",
    image: "/cosmos/imported/fun-city-beach-card.png?v=2",
  },
  {
    title: "KINGDOM HOTEL",
    cta: "BƯỚC VÀO KINGDOM HOTEL",
    href: GAME_URL,
    image: "/cosmos/imported/kingdom-hotel-card.png?v=2",
  },
  {
    title: "FUN TREASURE CITY",
    cta: "BẮT ĐẦU FUN TREASURE CITY",
    href: "https://fun-cosmos.pages.dev/",
    image: "/cosmos/imported/fun-treasure-city-card.png",
  },
] as const;

export function GameWorlds() {
  const { t } = useI18n();
  return (
    <section id="games" className="gw-section" aria-labelledby="gw-title">
      <header className="gw-heading">
        <h2 id="gw-title">{t("CHOOSE A WORLD TO ENTER", "CHỌN THẾ GIỚI BẠN MUỐN BƯỚC VÀO")}</h2>
      </header>
      <div className="gw-track">
        {games.map((game) => (
          <article key={game.title} className="gw-world">
            <img
              src={game.image}
              alt={t(`${game.title} game cover`, `Bìa game ${game.title}`)}
              width="1122"
              height="1402"
              loading="lazy"
            />
            <div className="gw-overlay">
              <Button asChild variant="cosmos" size="lg">
                <a href={game.href} target="_blank" rel="noreferrer">
                  {t(
                    game.title === "FUN CITY & BEACH"
                      ? "EXPLORE CITY & BEACH"
                      : game.title === "KINGDOM HOTEL"
                        ? "ENTER KINGDOM HOTEL"
                        : "START FUN TREASURE CITY",
                    game.cta,
                  )}{" "}
                  <ArrowUpRight />
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
