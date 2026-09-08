import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, HandHeart, FileSearch, ShieldCheck, Trophy } from "lucide-react";
import { TopicWorldShell, WorldSection } from "@/components/topic-world/topic-world";
import { DeepDiveGallery } from "@/components/topic-world/deep-dive-gallery";
import "@/components/topic-world/love-score-world.css";
import fatherAsset from "@/assets/father-cutout.png.asset.json";
import angelAsset from "@/assets/angel-light.png.asset.json";
import plpAsset from "@/assets/plp-seal.png.asset.json";
import infoOne from "@/assets/love-score-info-1.png.asset.json";
import infoTwo from "@/assets/love-score-info-2.png.asset.json";

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
  ["🧊", "Giúp hoàn thiện một asset", "Help complete an asset", "Góp phần hoàn thiện một tài nguyên chung."],
  ["💻", "Đóng góp code", "Contribute code", "Đóng góp kỹ thuật cho thế giới đang được xây dựng."],
  ["👥", "Tham gia hoạt động cộng đồng", "Join community activities", "Có mặt và cùng làm với cộng đồng."],
  ["🌱", "Trồng cây thật", "Plant real trees", "Một hành động ngoài đời thật được ghi nhận."],
  ["📜", "Tạo quest được sử dụng", "Create a quest that is used", "Nhiệm vụ bạn tạo được người khác trải nghiệm."],
  ["💜", "Giúp một người mới", "Help a new player", "Đồng hành cùng người vừa bước vào thế giới."],
  ["🎬", "Tạo nội dung hữu ích", "Create helpful content", "Nội dung giúp người khác hiểu và tham gia."],
] as const;

const steps = [
  [HandHeart, "HÀNH ĐỘNG", "Action", "Bạn làm một điều tích cực."],
  [FileSearch, "BẰNG CHỨNG", "Evidence", "Kết quả được ghi lại phù hợp với hoạt động."],
  [ShieldCheck, "XÁC MINH", "Verification", "Đóng góp được kiểm tra trước khi ghi nhận."],
  [Trophy, "GHI NHẬN", "Recognition", "Đóng góp trở thành một dấu mốc trong lịch sử của bạn."],
] as const;

const notList = [
  ["Điểm đo linh hồn", "A measure of the soul"],
  ["Độ giác ngộ", "Enlightenment level"],
  ["Đánh giá người tốt hay người xấu", "A judge of good or bad"],
  ["Mức độ “cao thấp” của con người", "A rank of human worth"],
] as const;

const bars = [34, 52, 40, 66, 48, 78, 60, 92, 70, 84, 58, 74];

function LoveScoreWorld() {
  const [node, setNode] = useState(0);
  const [step, setStep] = useState(0);
  const journeyRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  useEffect(() => {
    const target = journeyRef.current;
    if (!target) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || played.current) return;
        played.current = true;
        if (reduced) {
          setStep(steps.length - 1);
          return;
        }
        timer = setInterval(() => {
          setStep((value) => {
            if (value >= steps.length - 1) {
              if (timer) clearInterval(timer);
              return value;
            }
            return value + 1;
          });
        }, 1100);
      },
      { threshold: 0.4 },
    );
    observer.observe(target);
    return () => {
      observer.disconnect();
      if (timer) clearInterval(timer);
    };
  }, []);
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
                src={fatherAsset.url}
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
              <h1 id="love-title">LOVE SCORE</h1>
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
                src={angelAsset.url}
                alt="Angel ánh sáng bay giữa bầu trời thiên giới"
                width="1024"
                height="1536"
                loading="lazy"
              />
            </div>
          </div>
        </section>
        <nav className="tw-local" aria-label="Trong thế giới Love Score">
          <a href="#what">Love Score là gì</a>
          <a href="#contributions">Đóng góp được ghi nhận</a>
          <a href="#journey">Hành trình</a>
          <a href="#history">Lịch sử</a>
          <a href="#not">Không phải là gì</a>
          <a href="#plp">PureLove Protocol</a>
          <a href="#deep-dive">Khám phá sâu</a>
        </nav>
        <div className="ls-body">
          <WorldSection
            id="what"
            number="02"
            eyebrow="WHAT IS LOVE SCORE"
            title="LỊCH SỬ NHỮNG ĐIỀU TỐT ĐẸP BẠN ĐÃ LÀM."
          >
            <div className="ls-define">
              <div className="ls-heart" aria-hidden="true">
                <span>♥</span>
              </div>
              <div className="ls-card">
                <p className="tw-lead">
                  Love Score là lịch sử những đóng góp tích cực đã được hệ thống ghi nhận.
                </p>
                <p>
                  Là hệ thống ghi nhận các đóng góp tích cực <strong>có thể xác minh</strong> — minh
                  bạch, công bằng, truy vết được và không thể giả mạo.
                </p>
                <p>
                  <em>Love Score is simply the history of positive contributions recorded by the
                  system.</em>
                </p>
              </div>
            </div>
          </WorldSection>
          <WorldSection
            id="contributions"
            number="03"
            eyebrow="VERIFIED POSITIVE CONTRIBUTIONS"
            title="NHỮNG ĐÓNG GÓP ĐƯỢC GHI NHẬN."
          >
            <p className="tw-intro">
              Chạm vào một điểm sáng để xem đóng góp ấy trong thế giới FUN COSMOS.
            </p>
            <div className="ls-constellation">
              {contributions.map(([icon, title, en], index) => (
                <button
                  key={title}
                  className="ls-node"
                  aria-pressed={node === index}
                  aria-controls="ls-node-detail"
                  onClick={() => setNode(index)}
                  onMouseEnter={() => setNode(index)}
                  onFocus={() => setNode(index)}
                >
                  <em aria-hidden="true">{icon}</em>
                  <strong>{title}</strong>
                  <small>{en}</small>
                </button>
              ))}
            </div>
            <div id="ls-node-detail" className="ls-node-detail ls-card" aria-live="polite">
              <h3>{selected[1]}</h3>
              <p>{selected[3]}</p>
              <p>
                <small>{selected[2]}</small>
              </p>
            </div>
          </WorldSection>
          <WorldSection
            id="journey"
            number="04"
            eyebrow="THE LOVE SCORE JOURNEY"
            title="TỪ HÀNH ĐỘNG ĐẾN GHI NHẬN."
          >
            <div className="ls-journey" ref={journeyRef}>
              <div
                className="ls-journey-progress"
                style={{ width: `${(step / (steps.length - 1)) * 88}%` }}
                aria-hidden="true"
              />
              {steps.map(([Icon, title, en, note], index) => (
                <button
                  key={title}
                  className="ls-step"
                  data-on={index <= step}
                  aria-pressed={index === step}
                  onClick={() => setStep(index)}
                >
                  <i aria-hidden="true">
                    <Icon size={30} />
                  </i>
                  <strong>{title}</strong>
                  <small>
                    {en} · {note}
                  </small>
                </button>
              ))}
            </div>
          </WorldSection>
          <WorldSection
            id="history"
            number="05"
            eyebrow="POSITIVE CONTRIBUTION HISTORY"
            title="LỊCH SỬ ĐÓNG GÓP TÍCH CỰC."
          >
            <div className="ls-history">
              <div className="ls-card ls-score">
                <p className="tw-eyebrow">LOVE SCORE</p>
                <b>12,450</b>
                <p>
                  <small>Số minh họa — không phải Love Score thật của bạn.</small>
                </p>
              </div>
              <div className="ls-card">
                <div className="ls-chart" role="img" aria-label="Biểu đồ minh họa lịch sử đóng góp">
                  {bars.map((height, index) => (
                    <span
                      key={index}
                      style={{ height: `${height}%`, animationDelay: `${index * 60}ms` }}
                    />
                  ))}
                </div>
                <p>
                  Mỗi cột là một quãng thời gian đóng góp đã được ghi nhận. Love Score lớn lên theo
                  những điều bạn thật sự đã làm.
                </p>
              </div>
            </div>
          </WorldSection>
          <WorldSection
            id="not"
            number="06"
            eyebrow="LOVE SCORE SHOULD NOT BE MISUNDERSTOOD AS"
            title="LOVE SCORE KHÔNG PHẢI LÀ GÌ?"
          >
            <div className="ls-not">
              {notList.map(([vi, en]) => (
                <div key={vi}>
                  <span aria-hidden="true">✕</span>
                  {vi}
                  <br />
                  <small>{en}</small>
                </div>
              ))}
            </div>
            <div className="ls-statement">
              <p>Love Score ghi nhận đóng góp, không đánh giá giá trị con người.</p>
              <p>Love Score recognizes contributions; it does not judge human worth.</p>
            </div>
          </WorldSection>
          <WorldSection
            id="plp"
            number="07"
            eyebrow="PURELOVE PROTOCOL"
            title="PLP — TRONG CÙNG MỘT HỆ THỐNG."
          >
            <div className="ls-plp">
              <img src={plpAsset.url} alt="Huy hiệu PureLove Protocol (PLP)" loading="lazy" />
              <div className="ls-card">
                <p className="tw-lead">PureLove Protocol (PLP) · Love Score · FUN Money</p>
                <p>
                  Trong FUN COSMOS, PureLove Protocol là tên gọi chung của hệ thống mà Love Score
                  thuộc về: yêu thương — ghi nhận — trao giá trị — xây dựng thế giới tốt đẹp hơn.
                </p>
                <p>
                  <small>Love — Recognize — Give value — Build a better world.</small>
                </p>
              </div>
            </div>
          </WorldSection>
          <WorldSection
            id="deep-dive"
            number="08"
            eyebrow="THE KNOWLEDGE ARCHIVE"
            title="KHÁM PHÁ SÂU HAI TƯ LIỆU GỐC."
          >
            <p className="tw-intro">Bấm vào ảnh để mở bản đầy đủ, phóng lớn và đọc từng chi tiết.</p>
            <DeepDiveGallery
              items={[
                {
                  thumb: infoOne.url,
                  full: infoOne.url,
                  title: "Love Score — Verified Positive Contribution",
                },
                { thumb: infoTwo.url, full: infoTwo.url, title: "Love Score là gì?" },
              ]}
            />
          </WorldSection>
          <WorldSection
            id="continue"
            number="09"
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
