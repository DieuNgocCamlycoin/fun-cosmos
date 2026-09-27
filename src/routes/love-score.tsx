import { ArtworkFragment } from "@/components/topic-world/artwork-fragment";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, HandHeart, FileSearch, ShieldCheck, Trophy } from "lucide-react";
import { TopicWorldShell, WorldSection } from "@/components/topic-world/topic-world";
import { ArchiveDisclosure } from "@/components/topic-world/living-scene";
import { DeepDiveGallery } from "@/components/topic-world/deep-dive-gallery";
import "@/components/topic-world/love-score-world.css";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/love-score")({
  head: () => ({
    meta: [
      { title: "Love Score — Every contribution, a star | FUN COSMOS" },
      {
        name: "description",
        content:
          "Love Score records verified positive contributions in FUN COSMOS: action, evidence, verification and recognition.",
      },
      { property: "og:title", content: "Love Score — Mỗi đóng góp, một vì sao | FUN COSMOS" },
      {
        property: "og:description",
        content: "Khám phá thế giới Love Score: đóng góp được ghi nhận, không đánh giá con người.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/love-score" }],
  }),
  component: LoveScoreWorld,
});

const contributions = [
  ["📖", "Hoàn thành một bài học", "Complete a lesson", "Học xong một nội dung trong FUN COSMOS."],
  [
    "🧊",
    "Giúp hoàn thiện một asset",
    "Help complete an asset",
    "Góp phần hoàn thiện một tài nguyên chung.",
  ],
  ["💻", "Đóng góp code", "Contribute code", "Đóng góp kỹ thuật cho thế giới đang được xây dựng."],
  [
    "👥",
    "Tham gia hoạt động cộng đồng",
    "Join community activities",
    "Có mặt và cùng làm với cộng đồng.",
  ],
  ["🌱", "Trồng cây thật", "Plant real trees", "Một hành động ngoài đời thật được ghi nhận."],
  [
    "📜",
    "Tạo quest được sử dụng",
    "Create a quest that is used",
    "Nhiệm vụ bạn tạo được người khác trải nghiệm.",
  ],
  ["💜", "Giúp một người mới", "Help a new player", "Đồng hành cùng người vừa bước vào thế giới."],
  [
    "🎬",
    "Tạo nội dung hữu ích",
    "Create helpful content",
    "Nội dung giúp người khác hiểu và tham gia.",
  ],
] as const;

const steps = [
  [HandHeart, "HÀNH ĐỘNG", "Action", "Bạn làm một điều tích cực."],
  [FileSearch, "BẰNG CHỨNG", "Evidence", "Kết quả được ghi lại phù hợp với hoạt động."],
  [ShieldCheck, "XÁC MINH", "Verification", "Đóng góp được kiểm tra trước khi ghi nhận."],
  [Trophy, "GHI NHẬN", "Recognition", "Đóng góp trở thành một dấu mốc trong lịch sử của bạn."],
] as const;

function LoveScoreWorld() {
  const { locale, t } = useI18n();
  const contributionDescriptionsEn = [
    "Complete a learning activity in FUN COSMOS.",
    "Help improve a shared asset.",
    "Contribute code to the world being built.",
    "Take part in a community activity.",
    "A real-world action that can be recognized.",
    "Others experience the quest you created.",
    "Welcome someone who has just joined.",
    "Create content that helps others understand and participate.",
  ];
  const stepDescriptionsEn = [
    "You do something positive.",
    "Evidence relevant to the action is recorded.",
    "The contribution is reviewed before recognition.",
    "Your contribution becomes a milestone in your history.",
  ];
  const [node, setNode] = useState(0);
  const [step, setStep] = useState(0);
  const selected = contributions[node]!;
  return (
    <TopicWorldShell>
      <div className="ls">
        <section className="ls-hero" aria-labelledby="love-title">
          <div className="ls-hero-sky" aria-hidden="true" />
          <div className="ls-hero-city" aria-hidden="true" />
          <div className="ls-hero-beam" aria-hidden="true" />
          <div className="ls-hero-inner">
            <div className="ls-figure ls-father">
              <img
                src={"/cosmos/love-score/father-cutout.png"}
                alt={t(
                  "A welcoming figure in gold and sapphire light",
                  "Cha Vũ Trụ dang tay chào đón trong ánh sáng vàng và xanh sapphire",
                )}
                width="1024"
                height="1536"
                fetchPriority="high"
              />
            </div>
            <div className="ls-hero-copy">
              <a className="tw-back" href="/">
                ← FUN COSMOS / {t("Love Score world", "Thế giới Love Score")}
              </a>
              <h1 id="love-title" className="tw-metal">
                LOVE SCORE
              </h1>
              <span className="ls-ribbon">Verified Positive Contribution</span>
              <p className="ls-hero-line">
                {t("EVERY CONTRIBUTION, A STAR.", "MỖI ĐÓNG GÓP, MỘT VÌ SAO.")}
              </p>
              <div className="ls-hero-actions">
                <a className="tw-button" href="#what">
                  {t("Enter the world", "Bước vào thế giới")} <ArrowDown size={18} />
                </a>
                <a className="tw-outline" href="#journey">
                  {t("See the recognition journey", "Xem hành trình ghi nhận")}
                </a>
              </div>
            </div>
            <div className="ls-figure ls-angel">
              <img
                src={"/cosmos/love-score/angel-light.webp"}
                alt={t(
                  "A luminous angel in the sky",
                  "Angel ánh sáng bay giữa bầu trời thiên giới",
                )}
                width="1024"
                height="1536"
                loading="eager"
              />
            </div>
          </div>
        </section>
        <nav
          className="tw-local"
          aria-label={t("In the Love Score world", "Trong thế giới Love Score")}
        >
          <a href="#what">{t("What is Love Score?", "Love Score là gì")}</a>
          <a href="#contributions">{t("Recognized contributions", "Đóng góp được ghi nhận")}</a>
          <a href="#journey">{t("Journey", "Hành trình")}</a>
          <a href="#history">{t("History", "Lịch sử")}</a>
          <a href="#plp">PureLove Protocol</a>
          <a href="#deep-dive">{t("Explore deeper", "Khám phá sâu")}</a>
        </nav>
        <div className="ls-body">
          <span id="what" />
          <WorldSection
            id="contributions"
            number="02"
            eyebrow="A CONTRIBUTION BECOMES A STAR"
            title={t(
              "GIVE A GOOD DEED A PLACE IN YOUR STORY.",
              "CHO MỘT ĐIỀU TỐT ĐẸP MỘT DẤU MỐC.",
            )}
          >
            <div className="ls-living">
              <img
                className="ls-witness"
                src="/cosmos/love-score/angel-light.webp"
                alt={t("Angel companion", "Angel đồng hành")}
                loading="lazy"
                width="320"
                height="480"
              />
              <div
                className="ls-contribution-picks"
                aria-label={t("Choose an example contribution", "Chọn một đóng góp minh họa")}
              >
                {contributions.map(([, title], i) => (
                  <button
                    key={title}
                    aria-label={locale === "en" ? contributions[i]![2] : title}
                    title={locale === "en" ? contributions[i]![2] : title}
                    aria-pressed={node === i}
                    onClick={() => {
                      setNode(i);
                      setStep(0);
                    }}
                  >
                    <ArtworkFragment kind="contribution" index={i} />
                  </button>
                ))}
              </div>
              <div className="ls-light-path" id="journey">
                <div className="ls-beacon" data-step={step} aria-hidden="true">
                  <ArtworkFragment kind="journey" index={step} />
                </div>
                <div className="ls-current" aria-live="polite">
                  <small>
                    {t("ILLUSTRATIVE STORY", "CÂU CHUYỆN MINH HỌA")} · {step + 1} / 4
                  </small>
                  <h3>{locale === "en" ? steps[step]![2] : steps[step]![1]}</h3>
                  <p>
                    {locale === "en"
                      ? step === 0
                        ? contributionDescriptionsEn[node]
                        : stepDescriptionsEn[step]
                      : step === 0
                        ? selected[3]
                        : steps[step]![3]}
                  </p>
                  <strong>{locale === "en" ? selected[2] : selected[1]}</strong>
                </div>
                <div
                  className="ls-path-controls"
                  aria-label={t("Four recognition steps", "Bốn bước ghi nhận")}
                >
                  {steps.map(([Icon, title], i) => (
                    <button key={title} aria-pressed={step === i} onClick={() => setStep(i)}>
                      <Icon size={22} />
                      <span>{locale === "en" ? steps[i]![2] : title}</span>
                    </button>
                  ))}
                </div>
                <button className="tw-button" onClick={() => setStep((step + 1) % 4)}>
                  {step === 3
                    ? t("Start another story", "Bắt đầu câu chuyện khác")
                    : t("Next step", "Bước tiếp theo")}{" "}
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
            <p className="ls-principle">
              {t(
                "Recognize verified contributions. Never judge human worth.",
                "Ghi nhận đóng góp đã xác minh. Không đánh giá giá trị con người.",
              )}
            </p>
          </WorldSection>
          <WorldSection
            id="history"
            number="03"
            eyebrow="YOUR CONTRIBUTION HISTORY"
            title={t("EVERY CONTRIBUTION, A STAR.", "TỪNG ĐÓNG GÓP, MỘT VÌ SAO.")}
          >
            <div
              className="ls-star-history"
              aria-label={t(
                "Illustrated contribution milestones",
                "Minh họa những dấu mốc đóng góp",
              )}
            >
              {(locale === "en"
                ? ["A lesson", "A friend", "A tree", "An idea"]
                : ["Một bài học", "Một người bạn", "Một cây xanh", "Một ý tưởng"]
              ).map((label, i) => (
                <span key={label} style={{ animationDelay: `${i * -2}s` }}>
                  <i aria-hidden="true">✦</i>
                  {label}
                </span>
              ))}
            </div>
            <p className="ls-principle">
              {t(
                "Illustrative contribution history · Not connected to account data.",
                "Minh họa lịch sử đóng góp · Chưa kết nối dữ liệu tài khoản.",
              )}
            </p>
            <span id="not" />
            <ArchiveDisclosure
              title={t("What does Love Score recognize?", "Love Score ghi nhận điều gì?")}
            >
              <p>
                {t(
                  "Love Score is a history of positive contributions recognized by the system: transparent, verifiable and traceable.",
                  "Love Score là lịch sử những đóng góp tích cực đã được hệ thống ghi nhận: minh bạch, có thể xác minh và truy vết.",
                )}
              </p>
              <p>
                {t(
                  "It does not measure the soul, enlightenment, whether someone is good or bad, or human worth.",
                  "Không đo linh hồn, độ giác ngộ, người tốt hay xấu, hoặc mức độ cao thấp của con người.",
                )}
              </p>
            </ArchiveDisclosure>
          </WorldSection>
          <WorldSection
            id="plp"
            number="04"
            eyebrow="PURELOVE PROTOCOL"
            title={t("LOVE. RECOGNIZE. GIVE VALUE.", "YÊU THƯƠNG. GHI NHẬN. TRAO GIÁ TRỊ.")}
          >
            <div className="ls-plp-flow">
              <img
                src="/cosmos/love-score/plp-seal.webp"
                alt="PureLove Protocol"
                width="260"
                height="260"
                loading="lazy"
              />
              <span aria-hidden="true">✦</span>
              <img
                src="/cosmos/money.png"
                alt="FUN Money"
                width="180"
                height="180"
                loading="lazy"
              />
            </div>
            <p className="ls-principle">
              {t(
                "Love Score is part of PureLove Protocol.",
                "Love Score thuộc hệ thống PureLove Protocol.",
              )}
            </p>
          </WorldSection>
          <WorldSection
            id="deep-dive"
            number="05"
            eyebrow="THE KNOWLEDGE ARCHIVE"
            title={t("EXPLORE TWO ORIGINAL INFOGRAPHICS.", "KHÁM PHÁ SÂU HAI TƯ LIỆU GỐC.")}
          >
            <p className="tw-intro">
              {t(
                "Open an image to zoom in and read every detail.",
                "Bấm vào ảnh để mở bản đầy đủ, phóng lớn và đọc từng chi tiết.",
              )}
            </p>
            <ArchiveDisclosure>
              <DeepDiveGallery
                items={[
                  {
                    thumb: "/cosmos/love-score/love-score-info-1.webp",
                    full: "/cosmos/love-score/love-score-info-1.webp",
                    title: "Love Score — Verified Positive Contribution",
                  },
                  {
                    thumb: "/cosmos/love-score/love-score-info-2.webp",
                    full: "/cosmos/love-score/love-score-info-2.webp",
                    title: t("What is Love Score?", "Love Score là gì?"),
                  },
                ]}
              />
            </ArchiveDisclosure>
          </WorldSection>
          <WorldSection
            id="continue"
            number="06"
            eyebrow="CONTINUE THE COSMOS"
            title={t("THE JOURNEY CONTINUES.", "HÀNH TRÌNH CÒN TIẾP TỤC.")}
            className="tw-finale"
          >
            <p>
              {t(
                "A world to explore. One contribution to begin.",
                "Một thế giới để khám phá. Một đóng góp để bắt đầu.",
              )}
            </p>
            <div className="tw-actions">
              <a className="tw-button" href="/">
                {t("Back to FUN COSMOS", "Trở về FUN COSMOS")} <ArrowUpRight size={18} />
              </a>
              <a className="tw-outline" href="/angel-ai">
                {t("Continue with Angel AI", "Tiếp tục hành trình: Angel AI")}{" "}
                <ArrowUpRight size={18} />
              </a>
            </div>
          </WorldSection>
        </div>
      </div>
    </TopicWorldShell>
  );
}
