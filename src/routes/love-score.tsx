import { ArtworkFragment } from "@/components/topic-world/artwork-fragment";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUpRight, HandHeart, FileSearch, ShieldCheck, Trophy } from "lucide-react";
import { TopicWorldShell, WorldSection } from "@/components/topic-world/topic-world";
import { ArchiveDisclosure } from "@/components/topic-world/living-scene";
import { DeepDiveGallery } from "@/components/topic-world/deep-dive-gallery";
import "@/components/topic-world/love-score-world.css";

export const Route = createFileRoute("/love-score")({
  head: () => ({
    meta: [
      { title: "Love Score — Mỗi đóng góp, một vì sao | FUN COSMOS" },
      {
        name: "description",
        content:
          "Love Score là lịch sử những đóng góp tích cực đã được ghi nhận trong FUN COSMOS: hành động, bằng chứng, xác minh, ghi nhận.",
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
                alt="Cha Vũ Trụ dang tay chào đón trong ánh sáng vàng và xanh sapphire"
                width="1024"
                height="1536"
                fetchPriority="high"
              />
            </div>
            <div className="ls-hero-copy">
              <a className="tw-back" href="/">
                ← FUN COSMOS / Thế giới Love Score
              </a>
              <h1 id="love-title" className="tw-metal">
                LOVE SCORE
              </h1>
              <span className="ls-ribbon">Verified Positive Contribution</span>
              <p className="ls-hero-line">MỖI ĐÓNG GÓP, MỘT VÌ SAO.</p>
              <div className="ls-hero-actions">
                <a className="tw-button" href="#what">
                  Bước vào thế giới <ArrowDown size={18} />
                </a>
                <a className="tw-outline" href="#journey">
                  Xem hành trình ghi nhận
                </a>
              </div>
            </div>
            <div className="ls-figure ls-angel">
              <img
                src={"/cosmos/love-score/angel-light.webp"}
                alt="Angel ánh sáng bay giữa bầu trời thiên giới"
                width="1024"
                height="1536"
                loading="eager"
              />
            </div>
          </div>
        </section>
        <nav className="tw-local" aria-label="Trong thế giới Love Score">
          <a href="#what">Love Score là gì</a>
          <a href="#contributions">Đóng góp được ghi nhận</a>
          <a href="#journey">Hành trình</a>
          <a href="#history">Lịch sử</a>
          <a href="#plp">PureLove Protocol</a>
          <a href="#deep-dive">Khám phá sâu</a>
        </nav>
        <div className="ls-body">
          <span id="what" />
          <WorldSection
            id="contributions"
            number="02"
            eyebrow="A CONTRIBUTION BECOMES A STAR"
            title="CHO MỘT ĐIỀU TỐT ĐẸP MỘT DẤU MỐC."
          >
            <div className="ls-living">
              <img
                className="ls-witness"
                src="/cosmos/love-score/angel-light.webp"
                alt="Angel đồng hành"
                loading="lazy"
                width="320"
                height="480"
              />
              <div className="ls-contribution-picks" aria-label="Chọn một đóng góp minh họa">
                {contributions.map(([, title], i) => (
                  <button
                    key={title}
                    aria-label={title}
                    title={title}
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
                  <small>CÂU CHUYỆN MINH HỌA · {step + 1} / 4</small>
                  <h3>{steps[step]![1]}</h3>
                  <p>{step === 0 ? selected[3] : steps[step]![3]}</p>
                  <strong>{selected[1]}</strong>
                </div>
                <div className="ls-path-controls" aria-label="Bốn bước ghi nhận">
                  {steps.map(([Icon, title], i) => (
                    <button key={title} aria-pressed={step === i} onClick={() => setStep(i)}>
                      <Icon size={22} />
                      <span>{title}</span>
                    </button>
                  ))}
                </div>
                <button className="tw-button" onClick={() => setStep((step + 1) % 4)}>
                  {step === 3 ? "Bắt đầu câu chuyện khác" : "Bước tiếp theo"}{" "}
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
            <p className="ls-principle">
              Ghi nhận đóng góp đã xác minh. Không đánh giá giá trị con người.
            </p>
          </WorldSection>
          <WorldSection
            id="history"
            number="03"
            eyebrow="YOUR CONTRIBUTION HISTORY"
            title="TỪNG ĐÓNG GÓP, MỘT VÌ SAO."
          >
            <div className="ls-star-history" aria-label="Minh họa những dấu mốc đóng góp">
              {["Một bài học", "Một người bạn", "Một cây xanh", "Một ý tưởng"].map((label, i) => (
                <span key={label} style={{ animationDelay: `${i * -2}s` }}>
                  <i aria-hidden="true">✦</i>
                  {label}
                </span>
              ))}
            </div>
            <p className="ls-principle">
              Minh họa lịch sử đóng góp · Chưa kết nối dữ liệu tài khoản.
            </p>
            <span id="not" />
            <ArchiveDisclosure title="Love Score ghi nhận điều gì?">
              <p>
                Love Score là lịch sử những đóng góp tích cực đã được hệ thống ghi nhận: minh bạch,
                có thể xác minh và truy vết.
              </p>
              <p>
                Không đo linh hồn, độ giác ngộ, người tốt hay xấu, hoặc mức độ cao thấp của con
                người.
              </p>
            </ArchiveDisclosure>
          </WorldSection>
          <WorldSection
            id="plp"
            number="04"
            eyebrow="PURELOVE PROTOCOL"
            title="YÊU THƯƠNG. GHI NHẬN. TRAO GIÁ TRỊ."
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
            <p className="ls-principle">Love Score thuộc hệ thống PureLove Protocol.</p>
          </WorldSection>
          <WorldSection
            id="deep-dive"
            number="05"
            eyebrow="THE KNOWLEDGE ARCHIVE"
            title="KHÁM PHÁ SÂU HAI TƯ LIỆU GỐC."
          >
            <p className="tw-intro">
              Bấm vào ảnh để mở bản đầy đủ, phóng lớn và đọc từng chi tiết.
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
                    title: "Love Score là gì?",
                  },
                ]}
              />
            </ArchiveDisclosure>
          </WorldSection>
          <WorldSection
            id="continue"
            number="06"
            eyebrow="CONTINUE THE COSMOS"
            title="HÀNH TRÌNH CÒN TIẾP TỤC."
            className="tw-finale"
          >
            <p>Một thế giới để khám phá. Một đóng góp để bắt đầu.</p>
            <div className="tw-actions">
              <a className="tw-button" href="/">
                Trở về FUN COSMOS <ArrowUpRight size={18} />
              </a>
              <a className="tw-outline" href="/angel-ai">
                Tiếp tục hành trình: Angel AI <ArrowUpRight size={18} />
              </a>
            </div>
          </WorldSection>
        </div>
      </div>
    </TopicWorldShell>
  );
}
