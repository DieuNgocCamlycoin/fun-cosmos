import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Send } from "lucide-react";
import { submitFunCosmosEntry } from "@/lib/fun-cosmos-submissions.functions";
import { Button } from "./ui/button";

const labels = ["Nhân vật", "Ước mơ", "Trải nghiệm / nhiệm vụ", "Angel AI hỗ trợ gì?", "Ghi nhận mong muốn", "Thế giới thay đổi thế nào?", "Kết nối với đời thật"];
export type SubmissionDraft = { answers: string[]; displayName: string; email: string; facebookUrl: string; telegram: string; funRichUrl: string; walletAddress: string; consentAccuracy: boolean; consentPublic: boolean };
export const emptySubmissionDraft = (): SubmissionDraft => ({ answers: Array(7).fill(""), displayName: "", email: "", facebookUrl: "", telegram: "", funRichUrl: "", walletAddress: "", consentAccuracy: false, consentPublic: false });

export function SubmissionForm({ initialAnswers, onSave }: { initialAnswers: string[]; onSave: (answers: string[]) => void }) {
  const [form, setForm] = useState<SubmissionDraft>({ ...emptySubmissionDraft(), answers: initialAnswers });
  const [result, setResult] = useState<{ code: string; submittedAt: string } | null>(null);
  const [error, setError] = useState(""); const [sending, setSending] = useState(false);
  const firstInvalid = useRef<HTMLInputElement>(null); const submit = useServerFn(submitFunCosmosEntry); const navigate = useNavigate();
  const update = (key: keyof SubmissionDraft, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const complete = form.answers.every((v) => v.trim().length >= 2) && form.displayName.trim().length >= 2 && /\S+@\S+\.\S+/.test(form.email) && /^https:\/\/(www\.)?facebook\.com\//i.test(form.facebookUrl) && /^(?:@[A-Za-z0-9_]{5,32}|https:\/\/t\.me\/[A-Za-z0-9_]{5,32}\/?$)/i.test(form.telegram) && form.walletAddress.trim().length >= 20 && form.consentAccuracy;
  async function send() { if (!complete) { setError("Vui lòng hoàn thành các trường bắt buộc."); firstInvalid.current?.focus(); return; } setSending(true); setError(""); try { const response = await submit({ data: { ...form, website: "" } }); setResult(response); localStorage.removeItem("fun-cosmos-idea-v2"); } catch (cause) { setError(cause instanceof Error ? cause.message : "Chưa thể gửi bài. Vui lòng thử lại."); } finally { setSending(false); } }
  if (result) return <div className="fc-submit-success"><span aria-hidden="true">✦</span><h2>BÀI THAM GIA ĐÃ ĐƯỢC GHI NHẬN!</h2><p>Cảm ơn bạn đã cùng FUN COSMOS biến ý tưởng thành một hành trình sáng tạo.</p><dl><div><dt>Mã bài tham gia</dt><dd>{result.code}</dd></div><div><dt>Ngày gửi</dt><dd>{new Date(result.submittedAt).toLocaleString("vi-VN")}</dd></div><div><dt>Trạng thái</dt><dd>ĐÃ GỬI — ĐANG CHỜ XÁC MINH</dd></div><div><dt>Phần thưởng</dt><dd>99.999 HAPPY CAMLY COIN — Đang chờ xét duyệt</dd></div></dl><p>Hãy lưu lại Mã bài tham gia để tra cứu trạng thái sau này.</p><div className="lc-actions"><Button onClick={() => navigator.clipboard.writeText(result.code)}><Copy /> Sao chép mã bài</Button><Button variant="outline" onClick={() => navigate({ to: "/fun-cosmos/tra-cuu" })}>Tra cứu bài tham gia</Button></div></div>;
  return <form className="fc-submission-form" onSubmit={(e) => { e.preventDefault(); void send(); }} noValidate>
    <div className="lc-idea-fields">{labels.map((label, i) => <label key={label}>{i + 1}. {label}<textarea required maxLength={1000} value={form.answers[i]} onChange={(e) => setForm((current) => ({ ...current, answers: current.answers.map((v, j) => j === i ? e.target.value : v) }))} /></label>)}</div>
    <fieldset><legend>THÔNG TIN NGƯỜI THAM GIA</legend><div className="fc-contact-grid">
      <label>Họ và tên / Tên hiển thị<input ref={firstInvalid} required value={form.displayName} onChange={(e) => update("displayName", e.target.value)} /></label>
      <label>Email<input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} /></label>
      <label>Facebook Profile URL<input type="url" required placeholder="https://facebook.com/..." value={form.facebookUrl} onChange={(e) => update("facebookUrl", e.target.value)} /></label>
      <label>Telegram<input required placeholder="@username hoặc https://t.me/username" value={form.telegram} onChange={(e) => update("telegram", e.target.value)} /></label>
      <label>FUN.Rich Profile (nếu có)<input type="url" value={form.funRichUrl} onChange={(e) => update("funRichUrl", e.target.value)} /></label>
      <label>Địa chỉ ví nhận CAMLY<input required value={form.walletAddress} onChange={(e) => update("walletAddress", e.target.value)} /><small>Hãy kiểm tra chính xác địa chỉ ví trước khi gửi.</small></label>
    </div></fieldset>
    <div className="fc-consents"><label><input type="checkbox" checked={form.consentAccuracy} onChange={(e) => update("consentAccuracy", e.target.checked)} /> Tôi xác nhận các thông tin trên là chính xác và đây là bài tham gia của tôi.</label><label><input type="checkbox" checked={form.consentPublic} onChange={(e) => update("consentPublic", e.target.checked)} /> Tôi đồng ý để FUN COSMOS chia sẻ bài tham gia của tôi trong cộng đồng nếu bài được lựa chọn.</label></div>
    {error && <p className="fc-form-error" role="alert">{error}</p>}
    <div className="fc-submit-actions"><Button type="button" variant="outline" onClick={() => onSave(form.answers)}><Check /> Lưu bản nháp</Button><Button type="submit" disabled={!complete || sending}><Send /> {sending ? "Đang gửi…" : "Gửi bài tham gia"}</Button><small>Hoàn thành trải nghiệm FUN COSMOS để tham gia chương trình 99.999 HAPPY CAMLY COIN.</small></div>
  </form>;
}