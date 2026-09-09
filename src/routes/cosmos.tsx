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
import "@/components/topic-world/cosmos-world.css";
import "@/components/topic-world/next-worlds.css";
export const Route = createFileRoute("/cosmos")({
  head: () => ({
    meta: [
      { title: "FUN COSMOS — 5D New Earth Role-Playing Game" },
      {
        name: "description",
        content:
          "Khám phá, học hỏi, sáng tạo, kết nối và mang những trải nghiệm trong FUN COSMOS vào cuộc sống thật.",
      },
    ],
    links: [{ rel: "canonical", href: "/cosmos" }],
  }),
  component: CosmosWorld,
});

function CosmosWorld() {
  const [archive, setArchive] = useState(0);
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
        <nav className="tw-local" aria-label="Trong thế giới FUN COSMOS">
          <a href="#definition">Khám phá thế giới</a>
          <a href="#core-loop">Ước mơ thành trải nghiệm</a>
          <a href="#real-life">Game ↔ Đời thật</a>
          <a href="#archive">Tư liệu gốc</a>
        </nav>
        <WorldSection
          id="definition"
          number="02"
          eyebrow="FIVE WAYS TO LIVE"
          title="BẠN MUỐN KHÁM PHÁ ĐIỀU GÌ?"
        >
          <span id="pillars" />
          <LivingScene
            label="Năm trụ cột FUN COSMOS"
            character="/cosmos/urantia-traveler.png"
            moments={pillars.map((p, i) => ({
              title: p[1]!,
              text: p[3]!,
              asset: `world:${assets[i]}`,
            }))}
          />
        </WorldSection>
        <WorldSection
          id="core-loop"
          number="03"
          eyebrow="DREAM → REALITY"
          title="MỘT ƯỚC MƠ BẮT ĐẦU LỚN LÊN."
        >
          <LivingScene
            label="Hành trình từ ước mơ đến trải nghiệm"
            background="/cosmos/garden.jpg"
            moments={loop.map((p, i) => ({
              title: p[0]!,
              text: p[2]!,
              asset: `/cosmos/${journeyAssets[i]}.png`,
            }))}
          />
        </WorldSection>
        <WorldSection
          id="real-life"
          number="04"
          eyebrow="GAME ↔ REAL LIFE"
          title="MANG MỘT ĐIỀU ĐẸP RA ĐỜI THẬT."
        >
          <div className="cw-world-links">
            <a href="/angel-ai">
              <img src="/cosmos/topic-world/angel-640.png" alt="" loading="lazy" />
              <span>
                Người đồng hành<small>Gặp Angel AI ↗</small>
              </span>
            </a>
            <a href="/love-score">
              <img src="/cosmos/love-score/plp-seal.webp" alt="" loading="lazy" />
              <span>
                Dấu mốc đóng góp<small>Khám phá Love Score ↗</small>
              </span>
            </a>
            <a href="/ecosystem">
              <img src="/cosmos/earth.png" alt="" loading="lazy" />
              <span>
                Những kết nối mới<small>Bước vào hệ sinh thái ↗</small>
              </span>
            </a>
          </div>
        </WorldSection>
        <WorldSection
          id="archive"
          number="05"
          eyebrow="KNOWLEDGE ARCHIVE"
          title="GIỮ LẠI TOÀN BỘ CÂU CHUYỆN."
        >
          <ArchiveDisclosure>
            <div className="cw-archive-nav" aria-label="Chủ đề tư liệu">
              {cosmosContents.map((group, i) => (
                <button key={group.id} aria-pressed={archive === i} onClick={() => setArchive(i)}>
                  {group.title}
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
          title="ĐẾN LƯỢT BẠN KIẾN TẠO."
          className="tw-finale"
        >
          <div className="tw-actions">
            <a className="tw-button" {...externalLink}>
              CHƠI NGAY <ArrowUpRight size={18} />
            </a>
            <a className="tw-outline" href="/your-turn">
              Phác thảo thế giới của bạn ↗
            </a>
          </div>
        </WorldSection>
      </div>
    </TopicWorldShell>
  );
}
