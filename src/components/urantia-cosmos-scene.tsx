import { useState, type CSSProperties } from "react";
import "./urantia-cosmos-scene.css";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

const worlds = [
  ["Bổ sung", "Cân bằng kinh nghiệm", "Học hỏi và cân bằng kinh nghiệm."],
  ["Học hỏi", "Phát triển trí tuệ", "Phát triển trí tuệ và hiểu biết."],
  ["Hiểu biết", "Mở rộng tầm nhìn", "Mở rộng tầm nhìn và nhận thức."],
  ["Trưởng thành", "Hoàn thiện nhân cách", "Hoàn thiện nhân cách qua trải nghiệm."],
  ["Phụng sự", "Sống và đóng góp", "Sống vì người khác và đóng góp."],
  ["Mở rộng nhận thức", "Hiểu sâu về sự sống", "Hiểu biết sâu hơn về vũ trụ và sự sống."],
  ["Tiếp tục hành trình", "Mở ra bước tiếp theo", "Chuẩn bị cho những bước phát triển tiếp theo."],
];
const positions = [
  [12, 45],
  [24, 16],
  [43, 3],
  [65, 12],
  [84, 40],
  [70, 74],
  [37, 78],
];

/** The supplied, text-free spiral background is passed explicitly by the page. */
export function UrantiaCosmosScene({ background }: { background: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <section
      id="origin"
      data-chapter
      className="uc-scene"
      style={{ backgroundImage: `url("${background}")` }}
    >
      <header className="uc-heading">
        <p>U-RAN-TI-A OPENS THE COSMOS</p>
        <h2>
          Sách <em>U-RAN-TI-A</em> mở ra <em>bức tranh vũ trụ</em>
        </h2>
        <p>Một vũ trụ có trật tự, giáo dục và hành trình tiến hóa</p>
      </header>
      <img
        className="uc-traveler"
        src="/cosmos/urantia-traveler.png"
        alt="Nhân vật đứng ngắm bức tranh vũ trụ"
      />
      <div
        className="uc-orbit lc-mansions"
        data-reading={selected !== null}
        aria-label="Bảy thế giới dinh thự"
      >
        <div className="uc-orbit-rings" aria-hidden="true" />
        {worlds.map(([name, , detail], i) => (
          <Popover
            key={name}
            open={selected === i}
            onOpenChange={(open) => setSelected(open ? i : null)}
          >
            <PopoverTrigger asChild>
              <button
                key={name}
                aria-label={`Khám phá thế giới ${name}`}
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
                style={
                  {
                    "--x": `${positions[i]?.[0] ?? 50}%`,
                    "--y": `${positions[i]?.[1] ?? 50}%`,
                    "--orbit-delay": `${(-i * 90) / 7}s`,
                    "--world-position": `${(i / 6) * 100}%`,
                  } as CSSProperties
                }
              >
                <span className="lc-mansion-world">
                  <i role="img" aria-label={`Thế giới ${name}`} />
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="uc-world-note"
              side="right"
              sideOffset={10}
              collisionPadding={16}
              aria-label={name}
            >
              <button
                className="uc-note-close"
                aria-label="Đóng thông tin hành tinh"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
              <h3>{name}</h3>
              <p>{detail}</p>
            </PopoverContent>
          </Popover>
        ))}
      </div>
      <a
        className="uc-urantia-logo"
        href="https://urantia.fun.rich/"
        target="_blank"
        rel="noreferrer"
        aria-label="Khám phá Sách Urantia"
      >
        <img src="/cosmos/urantia.png" alt="Sách Urantia Tiếng Việt" />
      </a>
    </section>
  );
}
