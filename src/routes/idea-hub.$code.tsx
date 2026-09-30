import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { getPublicIdea } from "@/lib/ideas.functions";
import { getIdeaCommunity, sendIdeaComment, toggleIdeaLike } from "@/lib/idea-community.functions";
import { useCreatorAuth } from "@/hooks/use-creator-auth";
import { categoryLabel, ideaStatusLabel, journeyStages, phaseTwoNote } from "@/lib/idea-content";
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
  const fetchCommunity = useServerFn(getIdeaCommunity);
  const postComment = useServerFn(sendIdeaComment);
  const toggleLike = useServerFn(toggleIdeaLike);
  const { session } = useCreatorAuth();
  const [community, setCommunity] = useState<Awaited<ReturnType<typeof getIdeaCommunity>> | null>(
    null,
  );
  const [body, setBody] = useState("");
  const [kind, setKind] = useState<"feedback" | "experience">("feedback");
  const [communityError, setCommunityError] = useState("");
  const [communityStatus, setCommunityStatus] = useState("");
  const [communityBusy, setCommunityBusy] = useState(false);
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

  useEffect(() => {
    let active = true;
    void fetchCommunity({ data: { code } })
      .then((data) => {
        if (active) setCommunity(data);
      })
      .catch(() => {
        if (active) setCommunityError("Chưa tải được thảo luận.");
      });
    return () => {
      active = false;
    };
  }, [code, fetchCommunity]);
  async function like() {
    setCommunityBusy(true);
    setCommunityError("");
    try {
      const result = await toggleLike({ data: { code } });
      setCommunity((current) =>
        current
          ? { ...current, likes: Math.max(0, current.likes + (result.liked ? 1 : -1)) }
          : current,
      );
      setCommunityStatus(result.liked ? "Đã thích ý tưởng." : "Đã bỏ thích.");
    } catch (cause) {
      setCommunityError(cause instanceof Error ? cause.message : "Chưa thích được ý tưởng.");
    } finally {
      setCommunityBusy(false);
    }
  }
  async function comment() {
    setCommunityBusy(true);
    setCommunityError("");
    try {
      await postComment({ data: { code, kind, body } });
      setBody("");
      setCommunityStatus("Đã nhận góp ý. Bình luận sẽ hiện sau khi Admin duyệt.");
    } catch (cause) {
      setCommunityError(cause instanceof Error ? cause.message : "Chưa gửi được góp ý.");
    } finally {
      setCommunityBusy(false);
    }
  }
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
                fun_rich_post_url?: string | null;
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
                  {extra.fun_rich_post_url && (
                    <a
                      className="lc-button"
                      href={extra.fun_rich_post_url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      XEM BÀI ĐĂNG FUN.RICH ↗
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
                Mỗi ý tưởng có hành trình riêng. Một số ý tưởng có thể được lựa chọn để tiếp tục
                đồng phát triển và thử nghiệm.
              </p>
            </section>

            <section className="ih-card ih-community">
              <h2>💬 BUILD &amp; BOUNTY · THẢO LUẬN</h2>
              <p>Cùng chia sẻ trải nghiệm và góp ý để phát triển ý tưởng.</p>
              <button
                type="button"
                className="lc-button"
                disabled={!session || communityBusy}
                onClick={() => void like()}
              >
                ♡ Thích · {community?.likes ?? 0}
              </button>
              {!session && (
                <a href="/tai-khoan?redirect=%2Fidea-hub">Đăng nhập FUN COSMOS để thích và góp ý</a>
              )}
              <div className="ih-community-comments">
                {community?.comments.map((item) => (
                  <article key={item.id}>
                    <strong>{item.author_name}</strong> ·{" "}
                    {item.kind === "experience" ? "Chia sẻ trải nghiệm" : "Góp ý"}
                    <p>{item.body}</p>
                    <small>{new Date(item.created_at).toLocaleDateString("vi-VN")}</small>
                  </article>
                ))}
                {community && community.comments.length === 0 && (
                  <p>Chưa có góp ý được duyệt. Hãy chia sẻ suy nghĩ đầu tiên.</p>
                )}
              </div>
              {session && (
                <div className="ih-community-form">
                  <label htmlFor="ih-comment-kind">Bạn muốn chia sẻ</label>
                  <select
                    id="ih-comment-kind"
                    value={kind}
                    onChange={(e) => setKind(e.target.value as "feedback" | "experience")}
                  >
                    <option value="feedback">Góp ý ý tưởng</option>
                    <option value="experience">Trải nghiệm của tôi</option>
                  </select>
                  <label htmlFor="ih-comment-body">Nội dung</label>
                  <textarea
                    id="ih-comment-body"
                    value={body}
                    maxLength={1000}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Ý tưởng này khiến bạn nghĩ đến điều gì?"
                  />
                  <button
                    type="button"
                    className="lc-button"
                    disabled={communityBusy || body.trim().length < 3}
                    onClick={() => void comment()}
                  >
                    GỬI GÓP Ý
                  </button>
                </div>
              )}
              {communityStatus && <p role="status">{communityStatus}</p>}
              {communityError && (
                <p role="alert" className="fc-form-error">
                  {communityError}
                </p>
              )}
              <Button onClick={() => navigate({ to: "/your-turn" })}>TẠO Ý TƯỞNG CỦA TÔI</Button>
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
