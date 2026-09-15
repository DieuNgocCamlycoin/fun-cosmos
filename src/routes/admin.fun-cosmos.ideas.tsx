import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, RefreshCw, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { listAdminIdeas, updateAdminIdea, updateAdminIdeaReward } from "@/lib/ideas.functions";
import { categoryLabel, ideaStatusLabel, rewardStatusLabel } from "@/lib/idea-content";
import "@/living.css";
import "@/components/idea-hub.css";

export const Route = createFileRoute("/admin/fun-cosmos/ideas")({
  head: () => ({
    meta: [
      { title: "Duyệt ý tưởng | FUN COSMOS Admin" },
      { name: "description", content: "Hàng chờ duyệt ý tưởng cộng đồng FUN COSMOS." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Duyệt ý tưởng | FUN COSMOS Admin" },
      { property: "og:description", content: "Khu vực quản trị ý tưởng FUN COSMOS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminIdeasPage,
});

const ideaStatuses = [
  "under_review",
  "needs_revision",
  "published",
  "selected",
  "in_development",
  "prototype",
  "playtest",
  "implemented",
  "archived",
] as const;
const rewardStatuses = [
  "not_selected",
  "eligible",
  "approved",
  "reward_pending",
  "rewarded",
  "reward_failed",
] as const;

function AdminIdeasPage() {
  const navigate = useNavigate();
  const list = useServerFn(listAdminIdeas);
  const updateIdea = useServerFn(updateAdminIdea);
  const updateReward = useServerFn(updateAdminIdeaReward);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listAdminIdeas>>>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        await navigate({ to: "/admin/login" });
        return;
      }
      setRows(await list({ data: { search, status } }));
    } catch {
      setError("Bạn không có quyền quản trị hoặc phiên đăng nhập đã hết hạn.");
    } finally {
      setBusy(false);
    }
  }, [list, navigate, search, status]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="fc-admin-page">
      <header>
        <div>
          <p className="lc-eyebrow">✧ FUN COSMOS ADMIN</p>
          <h1>DUYỆT Ý TƯỞNG</h1>
        </div>
        <nav>
          <a href="/admin/fun-cosmos/submissions">Bài 99.999</a>
          <a href="/admin/fun-cosmos/rewards">Phần thưởng</a>
          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.signOut();
              await navigate({ to: "/admin/login" });
            }}
          >
            <LogOut aria-hidden="true" /> Đăng xuất
          </Button>
        </nav>
      </header>

      <form
        className="fc-admin-filters"
        onSubmit={(event) => {
          event.preventDefault();
          void load();
        }}
      >
        <label>
          Tìm kiếm
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mã ý tưởng, tiêu đề hoặc người sáng tạo"
          />
        </label>
        <label>
          Trạng thái
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="submitted">Đã gửi</option>
            {ideaStatuses.map((value) => (
              <option key={value} value={value}>
                {ideaStatusLabel[value]}
              </option>
            ))}
          </select>
        </label>
        <Button>
          <Search aria-hidden="true" /> Lọc
        </Button>
        <Button type="button" variant="outline" onClick={() => void load()}>
          <RefreshCw aria-hidden="true" /> Làm mới
        </Button>
      </form>

      {error && (
        <p className="fc-form-error" role="alert">
          {error}
        </p>
      )}

      <div className="fc-admin-list" aria-busy={busy}>
        {busy && <p>Đang tải…</p>}
        {!busy && rows.length === 0 && <p>Chưa có ý tưởng nào.</p>}
        {rows.map((row) => {
          const details = Array.isArray(row.idea_private_details)
            ? row.idea_private_details[0]
            : row.idea_private_details;
          return (
            <article key={row.id}>
              <header>
                <div>
                  <strong>{row.public_code ?? "—"}</strong>
                  <h2>{row.title || "(chưa có tiêu đề)"}</h2>
                </div>
                <span>{ideaStatusLabel[row.status] ?? row.status}</span>
              </header>
              <dl>
                <div>
                  <dt>Người sáng tạo</dt>
                  <dd>{row.creator_display_name_snapshot}</dd>
                </div>
                <div>
                  <dt>Danh mục</dt>
                  <dd>{categoryLabel(row.category)}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{details?.email || "—"}</dd>
                </div>
                <div>
                  <dt>FUN.Rich</dt>
                  <dd>{details?.fun_rich_url || "—"}</dd>
                </div>
                <div>
                  <dt>Facebook</dt>
                  <dd>{details?.facebook_url || "—"}</dd>
                </div>
                <div>
                  <dt>Telegram</dt>
                  <dd>{details?.telegram || "—"}</dd>
                </div>
                <div>
                  <dt>Ví CAMLY</dt>
                  <dd>{details?.recipient_wallet || "—"}</dd>
                </div>
                <div>
                  <dt>Quà tặng</dt>
                  <dd>{rewardStatusLabel[row.reward_status] ?? row.reward_status}</dd>
                </div>
              </dl>
              {row.duplicate_flag && (
                <p className="fc-duplicate">
                  Cần kiểm tra trùng nội dung: {row.duplicate_reasons.join(", ")}
                </p>
              )}
              <details>
                <summary>Xem toàn bộ nội dung</summary>
                <p>
                  <b>Tóm tắt:</b> {row.summary}
                </p>
                <p>
                  <b>1. Nhân vật:</b> {row.character_name} — {row.character_description}
                </p>
                <p>
                  <b>2. Ước mơ:</b> {row.dream}
                </p>
                <p>
                  <b>3. Trải nghiệm:</b> {row.gameplay}
                </p>
                <p>
                  <b>4. Angel AI:</b> {row.angel_ai}
                </p>
                <p>
                  <b>5. Phần thưởng:</b> {row.reward}
                </p>
                <p>
                  <b>6. Thế giới thay đổi:</b> {row.world_change}
                </p>
                <p>
                  <b>7. Kết nối đời thật:</b> {row.real_world_connection}
                </p>
                {(() => {
                  const extra = row as typeof row & {
                    story?: string | null;
                    facebook_post_url?: string | null;
                  };
                  return (
                    <>
                      <h4>CÂU CHUYỆN FUN COSMOS</h4>
                      {(extra.story ?? "")
                        .split(/\n+/)
                        .map((p) => p.trim())
                        .filter(Boolean)
                        .map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      {!extra.story?.trim() && <p>(Bài cũ — chưa có câu chuyện)</p>}
                      <h4>BÀI ĐĂNG FACEBOOK</h4>
                      {extra.facebook_post_url ? (
                        <a
                          className="lc-button"
                          href={extra.facebook_post_url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          MỞ BÀI VIẾT ↗
                        </a>
                      ) : (
                        <p>Chưa có link bài viết.</p>
                      )}
                    </>
                  );
                })()}
              </details>

              <div className="fc-admin-actions">
                <select defaultValue={row.status} id={`idea-status-${row.id}`} aria-label="Trạng thái ý tưởng">
                  {ideaStatuses.map((value) => (
                    <option key={value} value={value}>
                      {ideaStatusLabel[value]}
                    </option>
                  ))}
                </select>
                <input id={`idea-note-${row.id}`} placeholder="Phản hồi cho người sáng tạo" />
                <Button
                  onClick={async () => {
                    const statusEl = document.getElementById(
                      `idea-status-${row.id}`,
                    ) as HTMLSelectElement | null;
                    const noteEl = document.getElementById(
                      `idea-note-${row.id}`,
                    ) as HTMLInputElement | null;
                    if (!statusEl) return;
                    try {
                      await updateIdea({
                        data: {
                          id: row.id,
                          status: statusEl.value as (typeof ideaStatuses)[number],
                          note: noteEl?.value ?? "",
                        },
                      });
                      await load();
                    } catch (cause) {
                      setError(cause instanceof Error ? cause.message : "Không thể cập nhật.");
                    }
                  }}
                >
                  Cập nhật ý tưởng
                </Button>
              </div>

              <div className="fc-admin-actions">
                <select
                  defaultValue={row.reward_status}
                  id={`idea-reward-${row.id}`}
                  aria-label="Trạng thái quà tặng"
                >
                  {rewardStatuses.map((value) => (
                    <option key={value} value={value}>
                      {rewardStatusLabel[value]}
                    </option>
                  ))}
                </select>
                <input
                  id={`idea-tx-${row.id}`}
                  defaultValue={row.reward_tx_hash ?? ""}
                  placeholder="TX hash thật trên BNB Smart Chain"
                />
                <Button
                  onClick={async () => {
                    const statusEl = document.getElementById(
                      `idea-reward-${row.id}`,
                    ) as HTMLSelectElement | null;
                    const txEl = document.getElementById(
                      `idea-tx-${row.id}`,
                    ) as HTMLInputElement | null;
                    if (!statusEl) return;
                    try {
                      await updateReward({
                        data: {
                          id: row.id,
                          rewardStatus: statusEl.value as (typeof rewardStatuses)[number],
                          txHash: txEl?.value ?? "",
                          note: "",
                        },
                      });
                      await load();
                    } catch (cause) {
                      setError(cause instanceof Error ? cause.message : "Không thể cập nhật quà tặng.");
                    }
                  }}
                >
                  Cập nhật quà tặng
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
