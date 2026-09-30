import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const codeSchema = z.object({ code: z.string().trim().max(32) });
async function admin() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}
async function publishedIdea(code: string) {
  const db = await admin();
  const { data } = await db
    .from("ideas")
    .select("id")
    .eq("public_code", code.toUpperCase())
    .in("status", [
      "published",
      "selected",
      "in_development",
      "prototype",
      "playtest",
      "implemented",
    ])
    .maybeSingle();
  if (!data) throw new Error("Ý tưởng chưa được duyệt đăng.");
  return data.id;
}
async function assertAdmin(userId: string) {
  const db = await admin();
  const { data } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Bạn không có quyền duyệt góp ý.");
}
export const getIdeaCommunity = createServerFn({ method: "POST" })
  .inputValidator((input) => codeSchema.parse(input))
  .handler(async ({ data }) => {
    const db = await admin();
    const id = await publishedIdea(data.code);
    const [comments, likes] = await Promise.all([
      db
        .from("idea_community_comments")
        .select("id,author_name,kind,body,created_at")
        .eq("idea_id", id)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(100),
      db
        .from("idea_community_likes")
        .select("idea_id", { count: "exact", head: true })
        .eq("idea_id", id),
    ]);
    if (comments.error || likes.error) throw new Error("Chưa tải được góp ý cộng đồng.");
    return { comments: comments.data ?? [], likes: likes.count ?? 0 };
  });
export const sendIdeaComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    codeSchema
      .extend({
        kind: z.enum(["feedback", "experience"]),
        body: z.string().trim().min(3).max(1000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const db = await admin();
    const id = await publishedIdea(data.code);
    const { data: profile } = await db
      .from("profiles")
      .select("display_name")
      .eq("id", context.userId)
      .maybeSingle();
    const { error } = await db.from("idea_community_comments").insert({
      idea_id: id,
      author_user_id: context.userId,
      author_name: profile?.display_name || "Người chơi FUN COSMOS",
      kind: data.kind,
      body: data.body,
    });
    if (error) throw new Error("Chưa lưu được góp ý. Hãy thử lại.");
    return { ok: true };
  });
export const toggleIdeaLike = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => codeSchema.parse(input))
  .handler(async ({ data, context }) => {
    const db = await admin();
    const id = await publishedIdea(data.code);
    const { data: existing } = await db
      .from("idea_community_likes")
      .select("idea_id")
      .eq("idea_id", id)
      .eq("user_id", context.userId)
      .maybeSingle();
    const result = existing
      ? await db
          .from("idea_community_likes")
          .delete()
          .eq("idea_id", id)
          .eq("user_id", context.userId)
      : await db.from("idea_community_likes").insert({ idea_id: id, user_id: context.userId });
    if (result.error) throw new Error("Chưa cập nhật được lượt thích.");
    return { liked: !existing };
  });
export const listPendingIdeaComments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const db = await admin();
    const { data, error } = await db
      .from("idea_community_comments")
      .select("id,idea_id,author_name,kind,body,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) throw new Error("Chưa tải được góp ý cần duyệt.");
    return data ?? [];
  });
export const moderateIdeaComment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ id: z.string().uuid(), status: z.enum(["approved", "rejected"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const db = await admin();
    const { error } = await db
      .from("idea_community_comments")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("status", "pending");
    if (error) throw new Error("Chưa duyệt được góp ý.");
    return { ok: true };
  });
