import { createFileRoute } from "@tanstack/react-router";
import { ideaHasContent, ideaPayloadSchema } from "@/lib/idea-submission";

const noStore = { "Cache-Control": "no-store" };

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
      GET: ({ context }) =>
        Response.json({ available: Boolean(context.ideaDb) }, { headers: noStore }),
      POST: async ({ request, context }) => {
        const origin = request.headers.get("origin");
        if (origin && origin !== new URL(request.url).origin) return fail(403, "origin");
        if (!request.headers.get("content-type")?.startsWith("application/json"))
          return fail(415, "format");
        if (Number(request.headers.get("content-length") || 0) > 12000) return fail(413, "size");

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
            if (size > 12000) {
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
        if (!db) return fail(503, "unavailable");

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
