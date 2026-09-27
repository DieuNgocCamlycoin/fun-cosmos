import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { roles, roleAnswersEn } from "@/components/living-data";
import { useI18n } from "@/lib/i18n";
import { TopicWorldShell, WorldSection, NextWorldCTA } from "@/components/topic-world/topic-world";
import { LivingScene, ArchiveDisclosure } from "@/components/topic-world/living-scene";
import { DeepDiveGallery } from "@/components/topic-world/deep-dive-gallery";

export const Route = createFileRoute("/angel-ai")({
  head: () => ({
    meta: [
      { title: "Angel AI — Your companion through the cosmos | FUN COSMOS" },
      {
        name: "description",
        content: "Explore Angel AI's five roles and a sample conversation in FUN COSMOS.",
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
  const { locale, t } = useI18n();
  const roleNotesEn = [
    "Choose where to explore; begin with something that sparks curiosity.",
    "A friendly check-in and one small step together.",
    "A question about a garden can open a lesson about nature.",
    "Explore what you want to make, from people to places.",
    "Turn an intention into small steps in your play journey.",
  ];
  const choicesEn = [
    "I want to explore",
    "I want to learn",
    "I want to create",
    "I need a friend",
    "Suggest a quest",
  ];
  const journeyEn = [
    [
      "EXPLORE",
      "A place to begin",
      "Anna chooses a plot of land and imagines her garden. Angel AI acts as a guide.",
    ],
    [
      "CREATE",
      "From idea to garden",
      "Anna arranges trees, a pond and paths. Angel AI asks questions that clarify her idea.",
    ],
    [
      "LEARN",
      "Understand what grows",
      "Learn about sunlight and plant care within the garden story.",
    ],
    ["PLAY", "A small quest", "Choose a seed, learn to care for it and design where it will grow."],
    [
      "ACT",
      "Bring learning into real life",
      "Continue the story by caring for a real plant or exploring Green Earth activities.",
    ],
  ];
  const [choice, setChoice] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  return (
    <TopicWorldShell>
      <section className="tw-hero" aria-labelledby="angel-title">
        <div className="tw-hero-copy">
          <a className="tw-back" href="/">
            ← FUN COSMOS / {t("Angel AI world", "Thế giới Angel AI")}
          </a>
          <p className="tw-eyebrow">YOUR COMPANION THROUGH THE COSMOS</p>
          <h1 id="angel-title" className="tw-metal">
            ANGEL AI
          </h1>
          <p className="tw-hero-line">
            {t("With you.", "Cùng bạn.")}
            <br />
            {t("Through every world.", "Qua mỗi thế giới.")}
          </p>
          <p>
            {t(
              "A companion who helps you explore, learn, create and shape your own journey.",
              "Người đồng hành cùng bạn khám phá, học hỏi, sáng tạo và kiến tạo hành trình của riêng mình.",
            )}
          </p>
          <a className="tw-button" href="#meet">
            {t("Meet your companion", "Gặp người đồng hành")} <ArrowDown size={18} />
          </a>
        </div>
        <div className="tw-hero-art">
          <div className="tw-halo" aria-hidden="true" />
          <img
            src="/cosmos/topic-world/angel-640.png"
            srcSet="/cosmos/topic-world/angel-640.png 640w, /cosmos/angel-cutout.png 1024w"
            sizes="(max-width: 600px) 240px, 480px"
            alt={t("Angel AI in white and golden light", "Angel AI trong ánh sáng trắng và vàng")}
            width="1024"
            height="1536"
            fetchPriority="high"
          />
          <span className="tw-art-caption">✧ ALWAYS WITH YOU</span>
        </div>
      </section>
      <nav className="tw-local" aria-label={t("In the Angel AI world", "Trong thế giới Angel AI")}>
        <a href="#meet">{t("Meet Angel", "Gặp Angel")}</a>
        <a href="#roles">{t("Five roles", "Năm vai trò")}</a>
        <a href="#conversation">{t("Experience", "Trải nghiệm")}</a>
        <a href="#journey">{t("Inside FUN COSMOS", "Trong FUN COSMOS")}</a>
        <a href="#deep-dive">{t("Explore deeper", "Khám phá sâu")}</a>
      </nav>
      <span id="meet" />
      <WorldSection
        id="roles"
        number="02"
        eyebrow="FIVE ROLES · ONE COMPANION"
        title={t("WHERE WOULD YOU LIKE TO GO TODAY?", "HÔM NAY, BẠN MUỐN ĐI ĐÂU?")}
      >
        <LivingScene
          label={t("Choose an Angel AI role", "Chọn vai trò Angel AI")}
          moments={roleOrder.map((index, i) => ({
            title: locale === "en" ? roles[index]![1]! : roles[index]![0]!,
            text: locale === "en" ? roleNotesEn[i]! : roleNotes[i]![1]!,
            asset: `/cosmos/${["planet", "lovehub", "academy", "play", "cosmos"][i]}.png`,
            background: i === 2 ? "/cosmos/garden.jpg" : undefined,
          }))}
        />
      </WorldSection>
      <WorldSection
        id="conversation"
        number="03"
        eyebrow="EXPERIENCE ANGEL AI"
        title={t("BEGIN WITH A HELLO.", "BẮT ĐẦU BẰNG MỘT LỜI CHÀO.")}
        className="tw-conversation-section"
      >
        <div className="tw-dialogue">
          <div className="tw-dialogue-heading">
            <img src="/cosmos/angel.png" alt="" width="52" height="52" loading="lazy" />
            <div>
              <strong>Angel AI</strong>
              <small>
                {t(
                  "Illustrative conversation · not connected to live AI",
                  "Hội thoại minh họa · không kết nối AI trực tiếp",
                )}
              </small>
            </div>
          </div>
          <p className="tw-greeting">
            {t(
              "What would you like to begin with today?",
              "Hôm nay bạn muốn bắt đầu bằng điều gì?",
            )}
          </p>
          <div
            className="tw-prompts"
            aria-label={t("Choose an opening message", "Chọn lời mở đầu")}
          >
            {choices.map((text, i) => (
              <button key={text} aria-pressed={choice === i} onClick={() => setChoice(i)}>
                {locale === "en" ? choicesEn[i] : text} <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div className="tw-answer" role="status">
            {choice === null ? (
              <p>
                {t(
                  "Choose an opening message to see how Angel AI might accompany you.",
                  "Chọn một lời mở đầu để xem ví dụ Angel AI đồng hành cùng bạn.",
                )}
              </p>
            ) : (
              <>
                <small>ANGEL AI · {t("ILLUSTRATION", "MINH HỌA")}</small>
                <p>
                  “{locale === "en" ? roleAnswersEn[[1, 2, 4, 0, 3][choice]!] : answers[choice]}”
                </p>
                <button className="tw-text-link" onClick={() => setChoice(null)}>
                  {t("Start again", "Bắt đầu lại")} ↺
                </button>
              </>
            )}
          </div>
        </div>
        <a className="tw-text-link" href="https://angel.fun.rich/" target="_blank" rel="noreferrer">
          {t("Open Angel AI platform", "Mở nền tảng Angel AI")} <ArrowUpRight size={16} />
        </a>
      </WorldSection>
      <WorldSection
        id="journey"
        number="04"
        eyebrow="ANGEL AI INSIDE FUN COSMOS"
        title={t("FROM ONE SMALL DREAM.", "TỪ MỘT ƯỚC MƠ NHỎ.")}
      >
        <p className="tw-intro">
          {t(
            "Anna's garden illustrates how those roles can work together in one journey.",
            "Khu vườn của Anna là một câu chuyện minh họa về những vai trò ấy trong cùng một hành trình.",
          )}
        </p>
        <div className="tw-journey">
          <div className="tw-journey-image">
            <img
              src="/cosmos/topic-world/garden-640.jpg"
              alt={t(
                "A garden illustrating Anna's journey",
                "Khu vườn thiên giới minh họa cho hành trình Anna",
              )}
              width="1536"
              height="1024"
              loading="lazy"
            />
            <span>{t("ILLUSTRATIVE STORY", "CÂU CHUYỆN MINH HỌA")}</span>
          </div>
          <div>
            <div
              className="tw-step-selector"
              aria-label={t("Choose a journey step", "Chọn bước hành trình")}
            >
              {journey.map(([label], i) => (
                <button
                  key={label}
                  aria-pressed={step === i}
                  aria-controls="journey-story"
                  onClick={() => setStep(i)}
                >
                  <small>0{i + 1}</small>
                  {locale === "en" ? journeyEn[i]?.[0] : label}
                </button>
              ))}
            </div>
            <div id="journey-story" className="tw-step-story" aria-live="polite">
              <h3>{locale === "en" ? journeyEn[step]?.[1] : journey[step]![1]}</h3>
              <p>{locale === "en" ? journeyEn[step]?.[2] : journey[step]![2]}</p>
            </div>
            <a className="tw-text-link" href="/#anna">
              {t("Follow Anna's journey on Home", "Theo dõi hành trình Anna trên Home")} →
            </a>
          </div>
        </div>
      </WorldSection>
      <WorldSection
        id="deep-dive"
        number="05"
        eyebrow="THE KNOWLEDGE ARCHIVE"
        title={t("EXPLORE THE WHOLE IDEA.", "KHÁM PHÁ TRỌN VẸN Ý TƯỞNG.")}
      >
        <p className="tw-intro">
          {t(
            "Two visual references to explore at your own pace.",
            "Hai tư liệu hình ảnh để tìm hiểu sâu hơn, theo nhịp của riêng bạn.",
          )}
        </p>
        <ArchiveDisclosure>
          <DeepDiveGallery images={[16, 17]} />
        </ArchiveDisclosure>
      </WorldSection>
      <NextWorldCTA />
    </TopicWorldShell>
  );
}
