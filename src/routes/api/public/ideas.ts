import { createFileRoute } from "@tanstack/react-router";
import { ideaHasContent, ideaPayloadSchema } from "@/lib/idea-submission";

const noStore = { "Cache-Control": "no-store" };
const maxBodyBytes = 32768;

async function supabaseInbox(method: "ready" | "submit", payload?: Record<string, unknown>) {
  const url = process.env["SUPABASE_URL"] ?? import.meta.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;
  const headers: Record<string, string> = { apikey: key, "content-type": "application/json" };
  if (!key.startsWith("sb_publishable_")) headers["Authorization"] = `Bearer ${key}`;
  try {
    const response = await fetch(
      `${url}/rest/v1/rpc/${method === "ready" ? "fun_cosmos_idea_inbox_ready" : "submit_fun_cosmos_idea"}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload ?? {}),
        cache: "no-store",
      },
    );
    return response.ok ? ((await response.json()) as unknown) : null;
  } catch {
    return null;
  }
}

function fail(status: number, code: string) {
  return Response.json({ ok: false, code }, { status, headers: noStore });
}

async function hashEmail(email: string) {
  const bytes = new TextEncoder().encode(email.toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const Route = createFileRoute("/api/public/ideas")({
  server: {
    handlers: {
      GET: async ({ context }) =>
        Response.json(
          { available: Boolean(context.ideaDb) || (await supabaseInbox("ready")) === true },
          { headers: noStore },
        ),
      POST: async ({ request, context }) => {
        const origin = request.headers.get("origin");
        if (origin && origin !== new URL(request.url).origin) return fail(403, "origin");
        if (!request.headers.get("content-type")?.startsWith("application/json"))
          return fail(415, "format");
        if (Number(request.headers.get("content-length") || 0) > maxBodyBytes)
          return fail(413, "size");

        let body: unknown;
        try {
          const reader = request.body?.getReader();
          if (!reader) return fail(400, "invalid");
          const chunks: Uint8Array[] = [];
          let size = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > maxBodyBytes) {
              await reader.cancel();
              return fail(413, "size");
            }
            chunks.push(value);
          }
          const bytes = new Uint8Array(size);
          let offset = 0;
          for (const chunk of chunks) {
            bytes.set(chunk, offset);
            offset += chunk.byteLength;
          }
          body = JSON.parse(new TextDecoder().decode(bytes));
        } catch {
          return fail(400, "invalid");
        }
        const parsed = ideaPayloadSchema.safeParse(body);
        if (!parsed.success || !ideaHasContent(parsed.data.fields)) return fail(400, "invalid");
        if (parsed.data.website) return fail(400, "invalid");

        const db = context.ideaDb;
        if (!db) {
          const result = (await supabaseInbox("submit", {
            p_fields: parsed.data.fields,
            p_email: parsed.data.email,
            p_locale: parsed.data.locale,
            p_consent: parsed.data.consent,
            p_request_id: parsed.data.requestId,
            p_website: parsed.data.website ?? "",
          })) as { ok?: boolean; id?: string; code?: string } | null;
          if (!result) return fail(503, "unavailable");
          if (result.ok && result.id)
            return Response.json({ ok: true, id: result.id }, { status: 201, headers: noStore });
          return fail(result.code === "rate-limit" ? 429 : 400, result.code ?? "invalid");
        }

        const { fields, email, locale, requestId } = parsed.data;
        const emailHash = await hashEmail(email);
        const now = new Date();
        try {
          const existing = await db
            .prepare("SELECT id FROM idea_submissions WHERE request_id = ?")
            .bind(requestId)
            .first<{ id: string }>();
          if (existing) return Response.json({ ok: true, id: existing.id }, { headers: noStore });

          const recent = await db
            .prepare(
              "SELECT COUNT(*) AS count FROM idea_submissions WHERE email_hash = ? AND created_at > ?",
            )
            .bind(emailHash, new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString())
            .first<{ count: number }>();
          if ((recent?.count ?? 0) >= 5) return fail(429, "rate-limit");

          const id = `FC-${now.toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
          const result = await db
            .prepare(
              "INSERT INTO idea_submissions (id, request_id, email, email_hash, locale, fields_json, consent_at, created_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')",
            )
            .bind(
              id,
              requestId,
              email.toLowerCase(),
              emailHash,
              locale,
              JSON.stringify(fields),
              now.toISOString(),
              now.toISOString(),
            )
            .run();
          if (!result.success) return fail(503, "unavailable");
          return Response.json({ ok: true, id }, { status: 201, headers: noStore });
        } catch {
          return fail(503, "unavailable");
        }
      },
    },
  },
});
