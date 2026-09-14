import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, Plus } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { listPublicIdeas } from "@/lib/ideas.functions";
import { categoryLabel, ideaCategories, ideaStatusLabel, phaseTwoNote } from "@/lib/idea-content";
import "@/living.css";
import "@/components/idea-hub.css";

const filters = [
  ["all", "TẤT CẢ"],
  ["newest", "MỚI NHẤT"],
  ["selected", "ĐƯỢC LỰA CHỌN"],
  ["in_development", "ĐANG PHÁT TRIỂN"],
  ["prototype", "PROTOTYPE"],
] as const;

export const Route = createFileRoute("/idea-hub/")({
  head: () => ({
    meta: [
      { title: "FUN COSMOS IDEA HUB — Cộng đồng đồng sáng tạo" },
      {
        name: "description",
        content:
          "Khám phá những ý tưởng được cộng đồng FUN COSMOS gửi về: thế giới, lối chơi, câu chuyện, nhân vật, Angel AI và kết nối đời thật.",
      },
      { property: "og:title", content: "FUN COSMOS IDEA HUB — Cộng đồng đồng sáng tạo" },
      {
        property: "og:description",
        content: "Khám phá. Thảo luận. Cùng phát triển những ý tưởng của cộng đồng FUN COSMOS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/idea-hub" }],
  }),
  component: IdeaHubPage,
});

function IdeaHubPage() {
  const fetchIdeas = useServerFn(listPublicIdeas);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number][0]>("all");
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listPublicIdeas>>["ideas"]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(
    async (nextFilter = filter, nextCategory = category, term = search) => {
      setBusy(true);
      setError("");
      try {
        const response = await fetchIdeas({
          data: { search: term, category: nextCategory, filter: nextFilter },
        });
        setRows(response.ideas);
        if (response.error) setError(response.error);
      } catch {
        setError("Chưa tải được danh sách ý tưởng. Hãy thử lại.");
      } finally {
        setBusy(false);
      }
    },
    [fetchIdeas, filter, category, search],
  );

  useEffect(() => {
    void load("all", "", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tw yt-hub">
      <SiteHeader />
      <main className="ih-page">
        <header>
          <p className="lc-eyebrow">✧ FUN COSMOS IDEA HUB • CỘNG ĐỒNG ĐỒNG SÁNG TẠO</p>
          <h1>KHÁM PHÁ. THẢO LUẬN. CÙNG PHÁT TRIỂN.</h1>
          <p>
            Mỗi ý tưởng là một hạt giống. Cộng đồng có thể cùng nhau giúp những hạt giống tốt phát
            triển.
          </p>
        </header>

        <form
          className="ih-search"
          onSubmit={(event) => {
            event.preventDefault();
            void load();
          }}
          role="search"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔎 Tìm ý tưởng, người sáng tạo hoặc mã bài…"
            aria-label="Tìm ý tưởng"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              void load(filter, e.target.value, search);
            }}
            aria-label="Lọc theo danh mục"
          >
            <option value="">Tất cả danh mục</option>
            {ideaCategories.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Button type="submit">
            <Search aria-hidden="true" /> Tìm
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/tao-y-tuong" })}>
            <Plus aria-hidden="true" /> Tạo ý tưởng
          </Button>
        </form>

        <div className="ih-filters">
          {filters.map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => {
                setFilter(value);
                void load(value, category, search);
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <p className="fc-form-error" role="alert">
            {error}
          </p>
        )}

        <div className="ih-grid" aria-busy={busy}>
          {busy && <p>Đang tải ý tưởng…</p>}
          {!busy &&
            rows.map((row) => (
              <article className="ih-idea-card" key={row.public_code}>
                {row.cover_image_url && (
                  <img src={row.cover_image_url} alt="" loading="lazy" width="600" height="340" />
                )}
                <div className="ih-meta">
                  <span className="ih-badge">{ideaStatusLabel[row.status] ?? row.status}</span>
                  <span className="ih-badge">{categoryLabel(row.category)}</span>
                </div>
                <h3>{row.title}</h3>
                <p>{row.summary}</p>
                <p className="ih-meta">
                  <span>{row.creator_display_name_snapshot}</span>
                  <span>{row.public_code}</span>
                  {row.published_at && (
                    <span>{new Date(row.published_at).toLocaleDateString("vi-VN")}</span>
                  )}
                </p>
                <Link
                  className="lc-button"
                  to="/idea-hub/$code"
                  params={{ code: row.public_code ?? "" }}
                >
                  KHÁM PHÁ &amp; CÙNG PHÁT TRIỂN →
                </Link>
              </article>
            ))}
        </div>

        {!busy && rows.length === 0 && !error && (
          <section className="ih-empty">
            <h2>VŨ TRỤ ĐANG CHỜ Ý TƯỞNG ĐẦU TIÊN.</h2>
            <p>Hãy gieo hạt giống đầu tiên cho cộng đồng đồng sáng tạo FUN COSMOS.</p>
            <Button onClick={() => navigate({ to: "/tao-y-tuong" })}>✨ TẠO Ý TƯỞNG ĐẦU TIÊN</Button>
          </section>
        )}

        <p className="ih-note">{phaseTwoNote}</p>
      </main>
      <SiteFooter />
    </div>
  );
}
