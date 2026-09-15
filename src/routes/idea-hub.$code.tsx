import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { getPublicIdea } from "@/lib/ideas.functions";
import {
  categoryLabel,
  ideaStatusLabel,
  journeyStages,
  phaseTwoNote,
} from "@/lib/idea-content";
import "@/living.css";
import "@/components/idea-hub.css";

export const Route = createFileRoute("/idea-hub/$code")({
  head: () => ({
    meta: [
      { title: "Ý tưởng cộng đồng | FUN COSMOS IDEA HUB" },
      {
        name: "description",
        content:
          "Đọc trọn vẹn một ý tưởng cộng đồng FUN COSMOS: nhân vật, ước mơ, trải nghiệm, Angel AI và hành trình đồng sáng tạo.",
      },
      { property: "og:title", content: "Ý tưởng cộng đồng | FUN COSMOS IDEA HUB" },
      {
        property: "og:description",
        content: "Khám phá một ý tưởng được cộng đồng FUN COSMOS gửi về và hành trình của nó.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IdeaDetailPage,
});

function IdeaDetailPage() {
  const { code } = useParams({ from: "/idea-hub/$code" });
  const fetchIdea = useServerFn(getPublicIdea);
  const navigate = useNavigate();
  const [state, setState] = useState<{
    busy: boolean;
    data: Awaited<ReturnType<typeof getPublicIdea>> | null;
    error: string;
  }>({ busy: true, data: null, error: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetchIdea({ data: { code } });
        if (!cancelled) setState({ busy: false, data: response, error: "" });
      } catch {
        if (!cancelled)
          setState({ busy: false, data: null, error: "Chưa tải được ý tưởng. Hãy thử lại." });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, fetchIdea]);

  const found = state.data?.found ? state.data : null;
  const idea = found?.idea;

  return (
    <div className="tw yt-hub">
      <SiteHeader />
      <main className="ih-page">
        <Link to="/idea-hub">← Về Idea Hub</Link>
        {state.busy && <p>Đang tải ý tưởng…</p>}
        {state.error && (
          <p className="fc-form-error" role="alert">
            {state.error}
          </p>
        )}
        {!state.busy && !idea && !state.error && (
          <section className="ih-empty">
            <h1>KHÔNG TÌM THẤY Ý TƯỞNG NÀY</h1>
            <p>Ý tưởng có thể chưa được duyệt đăng hoặc mã chưa đúng.</p>
            <Button onClick={() => navigate({ to: "/idea-hub" })}>Khám phá Idea Hub</Button>
          </section>
        )}
        {idea && (
          <>
            <header>
              <div className="ih-meta">
                <span className="ih-badge">{idea.public_code}</span>
                <span className="ih-badge">{ideaStatusLabel[idea.status] ?? idea.status}</span>
                <span className="ih-badge">{categoryLabel(idea.category)}</span>
                {found?.tags.map((tag) => (
                  <span className="ih-badge" key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>
              <h1>{idea.title}</h1>
              <p>{idea.summary}</p>
              <p className="ih-meta">
                <span>Người sáng tạo: {idea.creator_display_name_snapshot}</span>
                {idea.published_at && (
                  <span>Đăng ngày {new Date(idea.published_at).toLocaleDateString("vi-VN")}</span>
                )}
              </p>
            </header>

            {(() => {
              const extra = idea as typeof idea & {
                story?: string | null;
                facebook_post_url?: string | null;
              };
              const paragraphs = (extra.story ?? "")
                .split(/\n+/)
                .map((p) => p.trim())
                .filter(Boolean);
              if (!paragraphs.length) return null;
              return (
                <section className="ih-card ih-story-read">
                  <h2>📖 CÂU CHUYỆN FUN COSMOS</h2>
                  {paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  {extra.facebook_post_url && (
                    <a
                      className="lc-button"
                      href={extra.facebook_post_url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      XEM BÀI ĐĂNG FACEBOOK ↗
                    </a>
                  )}
                </section>
              );
            })()}

            <section className="ih-card">
              <h2>7 HẠT GIỐNG Ý TƯỞNG</h2>
              <dl className="ih-list">
                <div>
                  <dt>1. Nhân vật</dt>
                  <dd>
                    <strong>{idea.character_name}</strong> — {idea.character_description}
                  </dd>
                </div>
                <div>
                  <dt>2. Ước mơ</dt>
                  <dd>{idea.dream}</dd>
                </div>
                <div>
                  <dt>3. Trải nghiệm</dt>
                  <dd>{idea.gameplay}</dd>
                </div>
                <div>
                  <dt>4. Angel AI</dt>
                  <dd>{idea.angel_ai}</dd>
                </div>
                <div>
                  <dt>5. Phần thưởng / ghi nhận</dt>
                  <dd>{idea.reward}</dd>
                </div>
                <div>
                  <dt>6. Thế giới thay đổi</dt>
                  <dd>{idea.world_change}</dd>
                </div>
                <div>
                  <dt>7. Kết nối đời thật</dt>
                  <dd>{idea.real_world_connection || "Chưa có / Không áp dụng."}</dd>
                </div>
              </dl>
            </section>

            <section className="ih-card">
              <h2>HÀNH TRÌNH CỦA Ý TƯỞNG</h2>
              <ol className="ih-journey">
                {journeyStages.map(([status, label]) => (
                  <li key={label} aria-current={status === idea.status ? "step" : undefined}>
                    {label}
                  </li>
                ))}
              </ol>
              <p className="ih-note">
                Mỗi ý tưởng có hành trình riêng. Một số ý tưởng có thể được lựa chọn để tiếp tục đồng
                phát triển và thử nghiệm.
              </p>
            </section>

            <section className="ih-card">
              <h2>💬 THẢO LUẬN &amp; GÓP Ý</h2>
              <p className="ih-note">{phaseTwoNote}</p>
              <Button onClick={() => navigate({ to: "/tao-y-tuong" })}>TẠO Ý TƯỞNG CỦA TÔI</Button>
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
