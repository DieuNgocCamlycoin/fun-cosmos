import { createFileRoute } from "@tanstack/react-router";
import { useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, X } from "lucide-react";
import { TopicWorldShell, WorldSection } from "@/components/topic-world/topic-world";
import { ArchiveDisclosure } from "@/components/topic-world/living-scene";
import { CuratedArchive } from "@/components/topic-world/curated-archive";
import { platforms } from "@/components/living-data";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import "@/components/topic-world/next-worlds.css";

export const Route = createFileRoute("/ecosystem")({
  head: () => ({
    meta: [
      { title: "FUN Ecosystem — Một vũ trụ kết nối | FUN COSMOS" },
      {
        name: "description",
        content:
          "Khám phá bản đồ FUN Ecosystem: các nền tảng kết nối quanh FUN COSMOS, từ học hỏi và sáng tạo đến hành động ngoài đời thật.",
      },
    ],
    links: [{ rel: "canonical", href: "/ecosystem" }],
  }),
  component: EcosystemWorld,
});
const destinations = [
  ...platforms,
  [
    "urantia",
    "Sách Urantia",
    "Khởi nguồn",
    "Khám phá Sách Urantia tiếng Việt.",
    "https://urantia.fun.rich/",
  ] as const,
];
const outer = destinations.filter((p) => !["cosmos", "money", "camly"].includes(p[0]));
const paths = [
  {
    title: "Học một điều mới",
    text: "Tìm người đồng hành và mở rộng kiến thức qua trải nghiệm.",
    ids: ["cosmos", "angel", "academy"],
  },
  {
    title: "Sáng tạo và chia sẻ",
    text: "Từ ý tưởng của bạn đến nội dung để cùng chia sẻ với cộng đồng.",
    ids: ["cosmos", "play", "profile"],
  },
  {
    title: "Kết nối với đời thật",
    text: "Khám phá những điểm đến về thiên nhiên, cộng đồng và sự sẻ chia.",
    ids: ["cosmos", "earth", "farm", "lovehub"],
  },
];
function EcosystemWorld() {
  const [opened, setOpened] = useState<string | null>(null);
  const [path, setPath] = useState(0);
  const route = paths[path]!;
  const point = (angle: number, radius: number): CSSProperties => ({
    left: `${50 + radius * Math.cos(angle)}%`,
    top: `${50 + radius * Math.sin(angle)}%`,
  });
  function logo(id: string, className: string, key = id) {
    const item = destinations.find((p) => p[0] === id)!;
    return (
      <Popover
        key={key}
        open={opened === key}
        onOpenChange={(open) => setOpened(open ? key : null)}
      >
        <PopoverTrigger asChild>
          <button className={className} aria-label={`Khám phá ${item[1]}`}>
            <img src={`/cosmos/${id}.png`} alt="" width="100" height="100" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="nw-popover"
          collisionPadding={16}
          sideOffset={12}
          aria-label={item[1]}
        >
          <button
            className="nw-close"
            aria-label="Đóng thông tin nền tảng"
            onClick={() => setOpened(null)}
          >
            <X size={18} />
          </button>
          <img src={`/cosmos/${id}.png`} alt="" width="64" height="64" />
          <h3>{item[1]}</h3>
          <p>{item[3]}</p>
          <a href={item[4]} target="_blank" rel="noreferrer">
            Mở nền tảng <ArrowUpRight size={16} />
          </a>
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <TopicWorldShell>
      <div className="nw ew">
        <section className="nw-arrival ew-arrival" aria-labelledby="ecosystem-title">
          <div className="nw-arrival-copy">
            <a className="tw-back" href="/">
              ← Về FUN COSMOS
            </a>
            <p className="tw-eyebrow">ONE CONNECTED ECOSYSTEM</p>
            <h1 id="ecosystem-title" className="tw-metal">
              FUN
              <br />
              ECOSYSTEM
            </h1>
            <p className="nw-lead">
              Một vũ trụ.
              <br />
              Nhiều điểm đến kết nối.
            </p>
            <a className="tw-button" href="#connections">
              Tìm hành trình của bạn <ArrowDown size={18} />
            </a>
          </div>
          <div
            className="ew-map"
            data-path={path}
            data-open={opened !== null}
            aria-label="Bản đồ FUN Ecosystem"
          >
            <div className="ew-orbit-line" />
            <div className="ew-orbit-line ew-inner-line" />
            <a className="ew-center" href="/cosmos" aria-label="Khám phá FUN COSMOS">
              <img src="/cosmos/cosmos.png" alt="FUN COSMOS" width="140" height="140" />
            </a>
            <div className="ew-orbit ew-outer">
              {outer.map((p, i) => (
                <div
                  className="ew-position"
                  data-related={route.ids.includes(p[0])}
                  key={p[0]}
                  style={point((i / outer.length) * Math.PI * 2 - Math.PI / 2, 42)}
                >
                  {logo(p[0], "ew-logo")}
                </div>
              ))}
            </div>
            <div className="ew-orbit ew-inner">
              {Array.from({ length: 6 }, (_, i) => (
                <div className="ew-position" key={i} style={point((i / 6) * Math.PI * 2, 24)}>
                  {logo(i % 2 ? "camly" : "money", "ew-coin", `coin-${i}`)}
                </div>
              ))}
            </div>
          </div>
        </section>
        <nav className="tw-local" aria-label="Trong FUN Ecosystem">
          <a href="#connections">Những kết nối</a>
          <a href="#directory">Các nền tảng</a>
          <a href="#archive">Tư liệu gốc</a>
          <a href="#continue">Cùng sáng tạo</a>
        </nav>
        <WorldSection
          id="connections"
          number="02"
          eyebrow="CHOOSE YOUR PATH"
          title="BẮT ĐẦU TỪ ĐIỀU BẠN MUỐN LÀM."
        >
          <div className="nw-selector" aria-label="Chọn hành trình">
            {paths.map((p, i) => (
              <button
                key={p.title}
                aria-pressed={path === i}
                aria-controls="connection-story"
                onClick={() => setPath(i)}
              >
                {p.title}
              </button>
            ))}
          </div>
          <div id="connection-story" className="ew-connection" aria-live="polite">
            <div>
              <h3>{route.title}</h3>
              <p>{route.text}</p>
              <p className="nw-note">Một cách khám phá các nền tảng trong hệ sinh thái.</p>
            </div>
            <div className="ew-path">
              {route.ids.map((id) => {
                const p = destinations.find((v) => v[0] === id)!;
                return (
                  <a
                    key={id}
                    href={id === "cosmos" ? "/cosmos" : id === "angel" ? "/angel-ai" : p[4]}
                    target={["cosmos", "angel"].includes(id) ? undefined : "_blank"}
                    rel="noreferrer"
                  >
                    <img src={`/cosmos/${id}.png`} alt="" width="92" height="92" loading="lazy" />
                    <span>{p[1]}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </WorldSection>
        <WorldSection
          id="directory"
          number="03"
          eyebrow="EXPLORE THE ECOSYSTEM"
          title="MỖI NỀN TẢNG, MỘT CÁNH CỬA."
        >
          <ArchiveDisclosure title="Tra cứu tất cả nền tảng">
            <div className="ew-directory">
              {destinations.map((p) => (
                <details key={p[0]}>
                  <summary>
                    <img src={`/cosmos/${p[0]}.png`} alt="" width="52" height="52" loading="lazy" />
                    <span>{p[1]}</span>
                    <span aria-hidden="true">+</span>
                  </summary>
                  <div>
                    <p>{p[3]}</p>
                    <a className="tw-text-link" href={p[4]} target="_blank" rel="noreferrer">
                      Mở nền tảng <ArrowUpRight size={16} />
                    </a>
                  </div>
                </details>
              ))}
            </div>
          </ArchiveDisclosure>
        </WorldSection>
        <WorldSection
          id="archive"
          number="04"
          eyebrow="KNOWLEDGE ARCHIVE"
          title="BỨC TRANH HỆ SINH THÁI."
        >
          <ArchiveDisclosure>
            <CuratedArchive images={[24]} />
          </ArchiveDisclosure>
        </WorldSection>
        <WorldSection
          id="continue"
          number="05"
          eyebrow="YOUR TURN"
          title="BẠN SẼ THÊM ĐIỀU GÌ VÀO THẾ GIỚI?"
          className="tw-finale"
        >
          <p>Một câu chuyện, một khu vườn, một ý tưởng để cùng kiến tạo.</p>
          <div className="tw-actions">
            <a className="tw-button" href="/your-turn">
              Phác thảo ý tưởng <ArrowUpRight size={18} />
            </a>
            <a className="tw-outline" href="/cosmos">
              Khám phá FUN COSMOS
            </a>
          </div>
        </WorldSection>
      </div>
    </TopicWorldShell>
  );
}
