import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Search } from "lucide-react";
import { lookupFunCosmosEntry } from "@/lib/fun-cosmos-submissions.functions";
import { Button } from "@/components/ui/button";
import "@/living.css";

export const Route = createFileRoute("/fun-cosmos/tra-cuu")({
  head: () => ({ meta: [{ title: "Tra cứu bài tham gia | FUN COSMOS" }, { name: "description", content: "Tra cứu an toàn trạng thái bài tham gia FUN COSMOS bằng mã bài và email." }, { property: "og:title", content: "Tra cứu bài tham gia | FUN COSMOS" }, { property: "og:description", content: "Kiểm tra trạng thái bài tham gia và phần thưởng 99.999 Happy Camly Coin." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: LookupPage,
});

function LookupPage() {
  const lookup = useServerFn(lookupFunCosmosEntry); const [code, setCode] = useState(""); const [email, setEmail] = useState(""); const [result, setResult] = useState<Awaited<ReturnType<typeof lookupFunCosmosEntry>> | null>(null); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  return <main className="fc-lookup-page"><a href="/">← Về FUN COSMOS</a><section><p className="lc-eyebrow">✧ 99.999 HAPPY CAMLY COIN</p><h1>TRA CỨU BÀI THAM GIA</h1><p>Nhập đúng mã bài và email đã dùng khi gửi. Thông tin của người khác sẽ không được hiển thị.</p><form onSubmit={async (e) => { e.preventDefault(); setBusy(true); setError(""); try { setResult(await lookup({ data: { code, email } })); } catch (cause) { setError(cause instanceof Error ? cause.message : "Chưa thể tra cứu."); } finally { setBusy(false); } }}><label>Mã bài tham gia<input required placeholder="FC-2026-ABC123" value={code} onChange={(e) => setCode(e.target.value)} /></label><label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><Button disabled={busy}><Search /> {busy ? "Đang tra cứu…" : "Tra cứu"}</Button></form>{error && <p role="alert" className="fc-form-error">{error}</p>}{result && (!result.found ? <p role="status">Không tìm thấy bài phù hợp. Hãy kiểm tra lại mã và email.</p> : <dl className="fc-lookup-result"><div><dt>Mã bài</dt><dd>{result.code}</dd></div><div><dt>Ngày gửi</dt><dd>{new Date(result.submittedAt).toLocaleString("vi-VN")}</dd></div><div><dt>Trạng thái bài</dt><dd>{result.status}</dd></div><div><dt>Phần thưởng</dt><dd>{result.reward ? `${result.reward.amount.toLocaleString("vi-VN")} ${result.reward.symbol} — ${result.reward.status}` : "Chưa tạo"}</dd></div>{result.participantMessage && <div><dt>Thông báo</dt><dd>{result.participantMessage}</dd></div>}</dl>)}</section></main>;
}