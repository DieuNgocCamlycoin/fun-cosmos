import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Plus, RefreshCw } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { useCreatorAuth } from "@/hooks/use-creator-auth";
import { listMyIdeas } from "@/lib/ideas.functions";
import { categoryLabel, ideaStatusLabel, rewardStatusLabel } from "@/lib/idea-content";
import "@/living.css";
import "@/components/idea-hub.css";

export const Route = createFileRoute("/y-tuong-cua-toi")({
  head: () => ({
    meta: [
      { title: "Ý tưởng của tôi | FUN COSMOS" },
      {
        name: "description",
        content:
          "Theo dõi bản nháp, bài đã gửi, trạng thái duyệt và hành trình đồng sáng tạo của từng ý tưởng FUN COSMOS.",
      },
      { property: "og:title", content: "Ý tưởng của tôi | FUN COSMOS" },
      {
        property: "og:description",
        content: "Quản lý ý tưởng bạn đã tạo và theo dõi trạng thái duyệt trong FUN COSMOS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/y-tuong-cua-toi" }],
  }),
  component: MyIdeasPage,
});

function MyIdeasPage() {
  const { ready, session } = useCreatorAuth();
  const navigate = useNavigate();
  const list = useServerFn(listMyIdeas);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listMyIdeas>>>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      setRows(await list());
    } catch {
      setError("Chưa tải được danh sách. Hãy thử lại.");
    } finally {
      setBusy(false);
    }
  }, [list]);

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      void navigate({ to: "/tai-khoan", search: { redirect: "/y-tuong-cua-toi" } as never });
      return;
    }
    void load();
  }, [ready, session, load, navigate]);

  return (
    <div className="tw yt-hub">
      <SiteHeader />
      <main className="ih-page">
        <header>
          <p className="lc-eyebrow">✧ YOUR TURN</p>
          <h1>Ý TƯỞNG CỦA TÔI</h1>
        </header>
        <div className="ih-filters">
          <Button onClick={() => navigate({ to: "/tao-y-tuong" })}>
            <Plus aria-hidden="true" /> Tạo ý tưởng
          </Button>
          <Button variant="outline" onClick={() => void load()}>
            <RefreshCw aria-hidden="true" /> Làm mới
          </Button>
        </div>
        {error && (
          <p className="fc-form-error" role="alert">
            {error}
          </p>
        )}
        <div className="ih-list" aria-busy={busy}>
          {busy && <p>Đang tải…</p>}
          {!busy && rows.length === 0 && (
            <section className="ih-empty">
              <h2>BẠN CHƯA CÓ Ý TƯỞNG NÀO</h2>
              <p>Hãy bắt đầu từ điều bạn yêu thích nhất.</p>
              <Button onClick={() => navigate({ to: "/tao-y-tuong" })}>✨ Tạo ý tưởng đầu tiên</Button>
            </section>
          )}
          {rows.map((row) => (
            <article className="ih-idea-card" key={row.id}>
              <div className="ih-meta">
                <span className="ih-badge">{ideaStatusLabel[row.status] ?? row.status}</span>
                {row.public_code && <span className="ih-badge">{row.public_code}</span>}
                <span className="ih-badge">{categoryLabel(row.category)}</span>
              </div>
              <h3>{row.title || "Bản nháp chưa đặt tên"}</h3>
              <p>{row.summary}</p>
              <p className="ih-meta">
                <span>Cập nhật {new Date(row.updated_at).toLocaleString("vi-VN")}</span>
                <span>Quà tặng: {rewardStatusLabel[row.reward_status] ?? row.reward_status}</span>
              </p>
              {row.creator_message && <p className="ih-note">Phản hồi: {row.creator_message}</p>}
              <div className="ih-filters">
                {["draft", "needs_revision"].includes(row.status) ? (
                  <Button
                    variant="outline"
                    onClick={() => navigate({ to: "/tao-y-tuong", search: { id: row.id } as never })}
                  >
                    Tiếp tục chỉnh sửa
                  </Button>
                ) : row.public_code &&
                  ["published", "selected", "in_development", "prototype", "playtest", "implemented"].includes(
                    row.status,
                  ) ? (
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate({ to: "/idea-hub/$code", params: { code: row.public_code! } })
                    }
                  >
                    Xem trong Idea Hub
                  </Button>
                ) : (
                  <span className="ih-note">Đang chờ ban quản trị xem xét.</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
