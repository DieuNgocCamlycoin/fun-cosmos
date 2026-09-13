import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import "@/living.css";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Đăng nhập quản trị | FUN COSMOS" }, { name: "description", content: "Khu vực quản trị chương trình FUN COSMOS." }, { property: "og:title", content: "Đăng nhập quản trị | FUN COSMOS" }, { property: "og:description", content: "Khu vực dành cho quản trị viên FUN COSMOS." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  return <main className="fc-admin-auth"><section><a href="/">← Về FUN COSMOS</a><p className="lc-eyebrow">✧ ADMIN</p><h1>QUẢN TRỊ CHƯƠNG TRÌNH</h1><form onSubmit={async (event) => { event.preventDefault(); setBusy(true); setError(""); const { error: signInError } = await supabase.auth.signInWithPassword({ email, password }); setBusy(false); if (signInError) { setError("Email hoặc mật khẩu không đúng."); return; } await navigate({ to: "/admin/fun-cosmos/submissions" }); }}><label>Email<input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Mật khẩu<input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <p role="alert" className="fc-form-error">{error}</p>}<Button disabled={busy}><LogIn /> {busy ? "Đang đăng nhập…" : "Đăng nhập"}</Button></form></section></main>;
}