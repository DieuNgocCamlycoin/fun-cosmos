import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Compass, Rocket, Sparkles } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { ArtworkViewer } from "@/components/story-artwork";
import { useCreatorAuth } from "@/hooks/use-creator-auth";
import { creatorSteps, howItWorks, rewardNotice } from "@/lib/idea-content";
import "@/living.css";
import "@/components/idea-hub.css";

export const Route = createFileRoute("/your-turn")({
  head: () => ({
    meta: [
      { title: "YOUR TURN — Vũ trụ bắt đầu từ một ý tưởng | FUN COSMOS" },
      {
        name: "description",
        content:
          "Tạo ý tưởng FUN COSMOS qua bảy bước, gửi tới cộng đồng và theo dõi hành trình đồng sáng tạo trong Idea Hub.",
      },
      { property: "og:title", content: "YOUR TURN — Vũ trụ bắt đầu từ một ý tưởng" },
      {
        property: "og:description",
        content: "Imagine it. Create it. Share it. Build it together — cùng kiến tạo FUN COSMOS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/your-turn" }],
  }),
  component: YourTurnPage,
});

function YourTurnPage() {
  const navigate = useNavigate();
  const { session, ready } = useCreatorAuth();
  const createHref = ready && !session ? "/tai-khoan" : "/tao-y-tuong";

  return (
    <div className="tw">
      <SiteHeader />
      <main className="ih-page">
        <section className="ih-hero">
          <p className="lc-eyebrow">YOUR TURN • CO-CREATE FUN COSMOS</p>
          <h1>
            VŨ TRỤ BẮT ĐẦU
            <br />
            TỪ MỘT Ý TƯỞNG.
          </h1>
          <p>
            Bạn không cần biết tất cả. Hãy bắt đầu từ điều mình yêu thích nhất.
            <br />
            Mỗi ý tưởng đều có thể trở thành một phần của FUN COSMOS.
          </p>
          <p className="ih-note">Imagine it. Create it. Share it. Build it together.</p>
          <div className="lc-actions">
            <Button onClick={() => navigate({ to: createHref })}>
              <Sparkles aria-hidden="true" /> TẠO Ý TƯỞNG
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: "/idea-hub" })}>
              <Compass aria-hidden="true" /> KHÁM PHÁ Ý TƯỞNG CỘNG ĐỒNG
            </Button>
          </div>
          <p className="ih-note">
            {session ? (
              <Link to="/y-tuong-cua-toi">Ý tưởng của tôi →</Link>
            ) : (
              <Link to="/tai-khoan">Đăng nhập hoặc tạo tài khoản người sáng tạo →</Link>
            )}
          </p>
        </section>

        <section className="ih-card" aria-labelledby="how-it-works">
          <h2 id="how-it-works">HÀNH TRÌNH ĐỒNG SÁNG TẠO</h2>
          <ol className="ih-steps">
            {howItWorks.map(([number, title, english]) => (
              <li key={number}>
                <b>
                  {number} · {title}
                </b>
                <small>{english}</small>
              </li>
            ))}
          </ol>
          <p className="ih-note">
            Ý tưởng nhỏ hôm nay có thể trở thành một trải nghiệm trong FUN COSMOS ngày mai.
          </p>
        </section>

        <section className="ih-card" aria-labelledby="mini-game">
          <p className="lc-eyebrow">IMAGINE IT • CREATE IT • SHARE IT</p>
          <h2 id="mini-game">MINI GAME “FUN COSMOS CỦA CON”</h2>
          <div className="yt-feature">
            <ArtworkViewer id={27} />
          </div>
          <p>
            <strong>THỰC HÀNH NGAY — 99.999 HAPPY CAMLY COIN</strong>
          </p>
          <p className="ih-note">{rewardNotice}</p>
          <div className="lc-actions">
            <Button onClick={() => navigate({ to: createHref })}>
              <Rocket aria-hidden="true" /> BẮT ĐẦU TẠO Ý TƯỞNG
            </Button>
          </div>
        </section>

        <section className="ih-card" aria-labelledby="seven-steps">
          <h2 id="seven-steps">BẢY BƯỚC PHÁC THẢO</h2>
          <ol className="ih-steps">
            {creatorSteps.map((step, index) => (
              <li key={step.key}>
                <b>
                  {String(index + 1).padStart(2, "0")} · {step.title}
                </b>
                <small>{step.question}</small>
              </li>
            ))}
          </ol>
        </section>

        <section className="ih-card" aria-labelledby="hub-intro">
          <h2 id="hub-intro">FUN COSMOS IDEA HUB</h2>
          <p>
            Mỗi ý tưởng là một hạt giống. Cộng đồng có thể cùng nhau giúp những hạt giống tốt phát
            triển.
          </p>
          <div className="lc-actions">
            <Button variant="outline" onClick={() => navigate({ to: "/idea-hub" })}>
              Khám phá Idea Hub <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </section>

        <section className="ih-card" aria-labelledby="discussion-images">
          <h2 id="discussion-images">CÙNG XEM · CÙNG THẢO LUẬN</h2>
          <div className="yt-feature">
            <ArtworkViewer id={26} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
