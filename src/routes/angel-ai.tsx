import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { roles } from "@/components/living-data";
import { TopicWorldShell, WorldSection, NextWorldCTA } from "@/components/topic-world/topic-world";
import { LivingScene, ArchiveDisclosure } from "@/components/topic-world/living-scene";
import { DeepDiveGallery } from "@/components/topic-world/deep-dive-gallery";

export const Route = createFileRoute("/angel-ai")({
  head: () => ({
    meta: [
      { title: "Angel AI — Người đồng hành qua vũ trụ | FUN COSMOS" },
      {
        name: "description",
        content:
          "Khám phá năm vai trò Angel AI và trải nghiệm hội thoại minh họa trong thế giới FUN COSMOS.",
      },
    ],
  }),
  component: AngelWorld,
});
const roleOrder = [1, 0, 2, 4, 3] as const;
const roleNotes = [
  [
    "Mỗi khám phá, một hướng đi.",
    "Chọn nơi bạn muốn khám phá; bắt đầu từ một điều khiến bạn tò mò.",
  ],
  ["Một người bạn bên cạnh.", "Một lời hỏi thăm, một bước nhỏ để cùng bắt đầu hành trình."],
  ["Học từ chính trải nghiệm.", "Một câu hỏi về khu vườn có thể mở ra bài học về thiên nhiên."],
  ["Cho ý tưởng một hình hài.", "Từ người sử dụng đến không gian: cùng làm rõ điều bạn muốn tạo."],
  ["Một nhiệm vụ, một khám phá.", "Biến một ý định thành những bước nhỏ trong hành trình chơi."],
];
const choices = [
  "Tôi muốn khám phá",
  "Tôi muốn học",
  "Tôi muốn sáng tạo",
  "Tôi cần một người bạn",
  "Gợi ý một nhiệm vụ",
];
const answers = [roles[1]![2], roles[2]![2], roles[4]![2], roles[0]![2], roles[3]![2]];
const journey = [
  [
    "KHÁM PHÁ",
    "Một nơi để bắt đầu",
    "Anna chọn một khu đất và hình dung khu vườn của mình. Angel AI đóng vai người hướng dẫn.",
  ],
  [
    "SÁNG TẠO",
    "Từ ý tưởng đến khu vườn",
    "Anna thử bố trí cây, hồ nước và lối đi. Angel AI gợi mở những câu hỏi để làm rõ ý tưởng.",
  ],
  [
    "HỌC HỎI",
    "Hiểu điều đang lớn lên",
    "Tìm hiểu ánh sáng và cách chăm sóc cây ngay trong câu chuyện khu vườn.",
  ],
  [
    "CHƠI",
    "Một nhiệm vụ nhỏ",
    "Chọn một hạt giống, tìm hiểu cách chăm và thiết kế nơi trồng: một ví dụ về vai trò Game Master.",
  ],
  [
    "HÀNH ĐỘNG",
    "Mang điều đã học ra đời thật",
    "Câu chuyện có thể tiếp nối bằng việc chăm một cây thật hoặc tìm hiểu hoạt động Green Earth.",
  ],
];
function AngelWorld() {
  const [choice, setChoice] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  return (
    <TopicWorldShell>
      <section className="tw-hero" aria-labelledby="angel-title">
        <div className="tw-hero-copy">
          <a className="tw-back" href="/">
            ← FUN COSMOS / Thế giới Angel AI
          </a>
          <p className="tw-eyebrow">YOUR COMPANION THROUGH THE COSMOS</p>
          <h1 id="angel-title" className="tw-metal">
            ANGEL AI
          </h1>
          <p className="tw-hero-line">
            Cùng bạn.
            <br />
            Qua mỗi thế giới.
          </p>
          <p>
            Người đồng hành cùng bạn khám phá, học hỏi, sáng tạo và kiến tạo hành trình của riêng
            mình.
          </p>
          <a className="tw-button" href="#meet">
            Gặp người đồng hành <ArrowDown size={18} />
          </a>
        </div>
        <div className="tw-hero-art">
          <div className="tw-halo" aria-hidden="true" />
          <img
            src="/cosmos/topic-world/angel-640.png"
            srcSet="/cosmos/topic-world/angel-640.png 640w, /cosmos/angel-cutout.png 1024w"
            sizes="(max-width: 600px) 240px, 480px"
            alt="Angel AI trong ánh sáng trắng và vàng"
            width="1024"
            height="1536"
            fetchPriority="high"
          />
          <span className="tw-art-caption">✧ ALWAYS WITH YOU</span>
        </div>
      </section>
      <nav className="tw-local" aria-label="Trong thế giới Angel AI">
        <a href="#meet">Gặp Angel</a>
        <a href="#roles">Năm vai trò</a>
        <a href="#conversation">Trải nghiệm</a>
        <a href="#journey">Trong FUN COSMOS</a>
        <a href="#deep-dive">Khám phá sâu</a>
      </nav>
      <span id="meet" />
      <WorldSection
        id="roles"
        number="02"
        eyebrow="FIVE ROLES · ONE COMPANION"
        title="HÔM NAY, BẠN MUỐN ĐI ĐÂU?"
      >
        <LivingScene
          label="Chọn vai trò Angel AI"
          moments={roleOrder.map((index, i) => ({
            title: roles[index]![0]!,
            text: roleNotes[i]![1]!,
            asset: `/cosmos/${["planet", "lovehub", "academy", "play", "cosmos"][i]}.png`,
            background: i === 2 ? "/cosmos/garden.jpg" : undefined,
          }))}
        />
      </WorldSection>
      <WorldSection
        id="conversation"
        number="03"
        eyebrow="EXPERIENCE ANGEL AI"
        title="BẮT ĐẦU BẰNG MỘT LỜI CHÀO."
        className="tw-conversation-section"
      >
        <div className="tw-dialogue">
          <div className="tw-dialogue-heading">
            <img src="/cosmos/angel.png" alt="" width="52" height="52" loading="lazy" />
            <div>
              <strong>Angel AI</strong>
              <small>Hội thoại minh họa · không kết nối AI trực tiếp</small>
            </div>
          </div>
          <p className="tw-greeting">Hôm nay bạn muốn bắt đầu bằng điều gì?</p>
          <div className="tw-prompts" aria-label="Chọn lời mở đầu">
            {choices.map((text, i) => (
              <button key={text} aria-pressed={choice === i} onClick={() => setChoice(i)}>
                {text} <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div className="tw-answer" role="status">
            {choice === null ? (
              <p>Chọn một lời mở đầu để xem ví dụ Angel AI đồng hành cùng bạn.</p>
            ) : (
              <>
                <small>ANGEL AI · MINH HỌA</small>
                <p>“{answers[choice]}”</p>
                <button className="tw-text-link" onClick={() => setChoice(null)}>
                  Bắt đầu lại ↺
                </button>
              </>
            )}
          </div>
        </div>
        <a className="tw-text-link" href="https://angel.fun.rich/" target="_blank" rel="noreferrer">
          Mở nền tảng Angel AI <ArrowUpRight size={16} />
        </a>
      </WorldSection>
      <WorldSection
        id="journey"
        number="04"
        eyebrow="ANGEL AI INSIDE FUN COSMOS"
        title="TỪ MỘT ƯỚC MƠ NHỎ."
      >
        <p className="tw-intro">
          Khu vườn của Anna là một câu chuyện minh họa về những vai trò ấy trong cùng một hành
          trình.
        </p>
        <div className="tw-journey">
          <div className="tw-journey-image">
            <img
              src="/cosmos/topic-world/garden-640.jpg"
              alt="Khu vườn thiên giới minh họa cho hành trình Anna"
              width="1536"
              height="1024"
              loading="lazy"
            />
            <span>CÂU CHUYỆN MINH HỌA</span>
          </div>
          <div>
            <div className="tw-step-selector" aria-label="Chọn bước hành trình">
              {journey.map(([label], i) => (
                <button
                  key={label}
                  aria-pressed={step === i}
                  aria-controls="journey-story"
                  onClick={() => setStep(i)}
                >
                  <small>0{i + 1}</small>
                  {label}
                </button>
              ))}
            </div>
            <div id="journey-story" className="tw-step-story" aria-live="polite">
              <h3>{journey[step]![1]}</h3>
              <p>{journey[step]![2]}</p>
            </div>
            <a className="tw-text-link" href="/#anna">
              Theo dõi hành trình Anna trên Home →
            </a>
          </div>
        </div>
      </WorldSection>
      <WorldSection
        id="deep-dive"
        number="05"
        eyebrow="THE KNOWLEDGE ARCHIVE"
        title="KHÁM PHÁ TRỌN VẸN Ý TƯỞNG."
      >
        <p className="tw-intro">
          Hai tư liệu hình ảnh để tìm hiểu sâu hơn, theo nhịp của riêng bạn.
        </p>
        <ArchiveDisclosure>
          <DeepDiveGallery images={[16, 17]} />
        </ArchiveDisclosure>
      </WorldSection>
      <NextWorldCTA />
    </TopicWorldShell>
  );
}
