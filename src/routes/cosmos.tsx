import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { TopicWorldShell, WorldSection } from "@/components/topic-world/topic-world";
import { LivingScene, ArchiveDisclosure } from "@/components/topic-world/living-scene";
import { CuratedArchive } from "@/components/topic-world/curated-archive";
import { pillars, loop } from "@/components/living-data";
import { cosmosContents } from "@/components/cosmos-contents";
import { CosmosArrival } from "@/components/topic-world/cosmos-arrival";
import { externalLink } from "@/lib/links";
import { useI18n } from "@/lib/i18n";
import "@/components/topic-world/cosmos-world.css";
import "@/components/topic-world/next-worlds.css";
export const Route = createFileRoute("/cosmos")({
  head: () => ({
    meta: [
      { title: "FUN COSMOS — 5D New Earth Role-Playing Game" },
      {
        name: "description",
        content:
          "Explore, learn, create and connect in FUN COSMOS, then bring those experiences into real life.",
      },
    ],
    links: [{ rel: "canonical", href: "/cosmos" }],
  }),
  component: CosmosWorld,
});

function CosmosWorld() {
  const { locale, t } = useI18n();
  const pillarDescriptionsEn = [
    "Cities, gardens, islands and new worlds await you.",
    "Design homes, characters, music, quests and worlds of your own.",
    "Meet friends, mentors and people who share your interests.",
    "Grow knowledge, skills and creativity through experience.",
    "Bring what is good in the virtual world into real life.",
  ];
  const loopDescriptionsEn = [
    "You dream of a garden where people can rest together.",
    "Try arranging trees, a pond and paths in a digital world.",
    "Learn about light, soil and plant care with Angel AI.",
    "Design a garden that reflects your own ideas.",
    "Take one thing you learned into real life: care for a real plant.",
    "Provide suitable evidence so the action can be reviewed.",
    "Verified contributions become part of your journey.",
    "Your skills grow and new possibilities open up.",
  ];
  const [archive, setArchive] = useState(0);
  const archiveTitlesEn = [
    "What is FUN COSMOS?",
    "More than a game",
    "What can players do?",
    "Game and real life",
    "The core idea",
    "Experience loop",
    "Five pillars",
    "Online to offline",
    "Why is FUN COSMOS inviting?",
  ];
  const assets = [0, 3, 1, 4, 5];
  const journeyAssets = [
    "planet",
    "cosmos",
    "academy",
    "play",
    "earth",
    "profile",
    "plp",
    "cosmos",
  ];
  return (
    <TopicWorldShell>
      <div className="cw">
        <CosmosArrival />
        <nav
          className="tw-local"
          aria-label={t("In the FUN COSMOS world", "Trong thế giới FUN COSMOS")}
        >
          <a href="#definition">{t("Explore the world", "Khám phá thế giới")}</a>
          <a href="#core-loop">{t("Dream into experience", "Ước mơ thành trải nghiệm")}</a>
          <a href="#real-life">{t("Game ↔ Real life", "Game ↔ Đời thật")}</a>
          <a href="#archive">{t("Original artwork", "Tư liệu gốc")}</a>
        </nav>
        <WorldSection
          id="definition"
          number="02"
          eyebrow="FIVE WAYS TO LIVE"
          title={t("WHAT WOULD YOU LIKE TO EXPLORE?", "BẠN MUỐN KHÁM PHÁ ĐIỀU GÌ?")}
        >
          <span id="pillars" />
          <LivingScene
            label={t("Five FUN COSMOS pillars", "Năm trụ cột FUN COSMOS")}
            character="/cosmos/urantia-traveler.png"
            moments={pillars.map((p, i) => ({
              title: locale === "en" ? p[2]! : p[1]!,
              text: locale === "en" ? pillarDescriptionsEn[i]! : p[3]!,
              asset: `world:${assets[i]}`,
            }))}
          />
        </WorldSection>
        <WorldSection
          id="core-loop"
          number="03"
          eyebrow="DREAM → REALITY"
          title={t("A DREAM BEGINS TO GROW.", "MỘT ƯỚC MƠ BẮT ĐẦU LỚN LÊN.")}
        >
          <LivingScene
            label={t("From dream to experience", "Hành trình từ ước mơ đến trải nghiệm")}
            background="/cosmos/garden.jpg"
            moments={loop.map((p, i) => ({
              title: locale === "en" ? p[1]! : p[0]!,
              text: locale === "en" ? loopDescriptionsEn[i]! : p[2]!,
              asset: `/cosmos/${journeyAssets[i]}.png`,
            }))}
          />
        </WorldSection>
        <WorldSection
          id="real-life"
          number="04"
          eyebrow="GAME ↔ REAL LIFE"
          title={t("BRING SOMETHING BEAUTIFUL INTO REAL LIFE.", "MANG MỘT ĐIỀU ĐẸP RA ĐỜI THẬT.")}
        >
          <div className="cw-world-links">
            <a href="/angel-ai">
              <img src="/cosmos/topic-world/angel-640.png" alt="" loading="lazy" />
              <span>
                {t("Your companion", "Người đồng hành")}
                <small>{t("Meet Angel AI", "Gặp Angel AI")} ↗</small>
              </span>
            </a>
            <a href="/love-score">
              <img src="/cosmos/love-score/plp-seal.webp" alt="" loading="lazy" />
              <span>
                {t("Contribution milestones", "Dấu mốc đóng góp")}
                <small>{t("Explore Love Score", "Khám phá Love Score")} ↗</small>
              </span>
            </a>
            <a href="/ecosystem">
              <img src="/cosmos/earth.png" alt="" loading="lazy" />
              <span>
                {t("New connections", "Những kết nối mới")}
                <small>{t("Enter the ecosystem", "Bước vào hệ sinh thái")} ↗</small>
              </span>
            </a>
          </div>
        </WorldSection>
        <WorldSection
          id="archive"
          number="05"
          eyebrow="KNOWLEDGE ARCHIVE"
          title={t("EXPLORE THE WHOLE STORY.", "GIỮ LẠI TOÀN BỘ CÂU CHUYỆN.")}
        >
          <ArchiveDisclosure>
            <div className="cw-archive-nav" aria-label={t("Archive topics", "Chủ đề tư liệu")}>
              {cosmosContents.map((group, i) => (
                <button key={group.id} aria-pressed={archive === i} onClick={() => setArchive(i)}>
                  {locale === "en" ? archiveTitlesEn[i] : group.title}
                </button>
              ))}
            </div>
            <CuratedArchive key={archive} images={cosmosContents[archive]!.images} />
          </ArchiveDisclosure>
        </WorldSection>
        <WorldSection
          id="play"
          number="06"
          eyebrow="YOUR TURN"
          title={t("NOW IT'S YOUR TURN TO CREATE.", "ĐẾN LƯỢT BẠN KIẾN TẠO.")}
          className="tw-finale"
        >
          <div className="tw-actions">
            <a className="tw-button" {...externalLink}>
              {t("PLAY NOW", "CHƠI NGAY")} <ArrowUpRight size={18} />
            </a>
            <a className="tw-outline" href="/your-turn">
              {t("Sketch your world", "Phác thảo thế giới của bạn")} ↗
            </a>
          </div>
        </WorldSection>
      </div>
    </TopicWorldShell>
  );
}
