import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export const IDEA_CATEGORIES = [
  "world",
  "gameplay",
  "story",
  "character",
  "art",
  "music",
  "ai",
  "code",
  "green_earth",
  "lovehub",
  "learning",
  "other",
] as const;
export type IdeaCategory = (typeof IDEA_CATEGORIES)[number];

const PUBLIC_STATUSES = [
  "published",
  "selected",
  "in_development",
  "prototype",
  "playtest",
  "implemented",
] as const;

const optionalText = (max: number) => z.string().trim().max(max).default("");
const url = z.string().trim().url().max(500);

const draftSchema = z.object({
  id: z.string().uuid().optional(),
  title: optionalText(140),
  summary: optionalText(500),
  category: z.enum(IDEA_CATEGORIES).default("other"),
  tags: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  characterName: optionalText(140),
  characterDescription: optionalText(2000),
  dream: optionalText(2000),
  gameplay: optionalText(2000),
  angelAi: optionalText(2000),
  reward: optionalText(2000),
  worldChange: optionalText(2000),
  realWorldConnection: optionalText(2000),
  facebookUrl: optionalText(500),
  telegram: optionalText(200),
  funRichUrl: optionalText(500),
  recipientWallet: optionalText(128),
  consentAccuracy: z.boolean().default(false),
  consentPublic: z.boolean().default(false),
  clientUpdatedAt: z.string().optional(),
});
export type IdeaDraftInput = z.input<typeof draftSchema>;

const submitSchema = z.object({
  id: z.string().uuid(),
  website: z.string().max(0).optional(),
});

async function adminClient() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`)
          headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

async function requireAdmin(context: { supabase: { rpc?: unknown }; userId: string }) {
  const client = context.supabase as unknown as {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          eq: (column: string, value: string) => { maybeSingle: () => Promise<{ data: unknown }> };
        };
      };
    };
  };
  const { data } = await client
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden");
}

function contentRow(data: z.output<typeof draftSchema>) {
  return {
    title: data.title,
    summary: data.summary,
    category: data.category,
    character_name: data.characterName,
    character_description: data.characterDescription,
    dream: data.dream,
    gameplay: data.gameplay,
    angel_ai: data.angelAi,
    reward: data.reward,
    world_change: data.worldChange,
    real_world_connection: data.realWorldConnection,
  };
}

/** Save (create or update) a draft. Database is the source of truth for drafts. */
export const saveIdeaDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => draftSchema.parse(input))
  .handler(async ({ data, context }) => {
    const admin = await adminClient();
    const displayName =
      (
        await admin
          .from("profiles")
          .select("display_name")
          .eq("id", context.userId)
          .maybeSingle()
      ).data?.display_name ?? "Người sáng tạo FUN COSMOS";

    let ideaId = data.id ?? null;
    if (ideaId) {
      const { data: existing } = await admin
        .from("ideas")
        .select("id,creator_user_id,status,updated_at")
        .eq("id", ideaId)
        .maybeSingle();
      if (!existing || existing.creator_user_id !== context.userId)
        throw new Error("Không tìm thấy ý tưởng của bạn.");
      if (!["draft", "needs_revision"].includes(existing.status))
        throw new Error("Ý tưởng này đã gửi nên không thể chỉnh sửa trực tiếp.");
      if (
        data.clientUpdatedAt &&
        new Date(data.clientUpdatedAt).getTime() < new Date(existing.updated_at).getTime() - 1000
      )
        throw new Error(
          "Bản nháp trên máy chủ mới hơn bản trên trình duyệt. Hãy tải lại trang trước khi lưu.",
        );
      const { error } = await admin
        .from("ideas")
        .update({ ...contentRow(data), creator_display_name_snapshot: displayName })
        .eq("id", ideaId);
      if (error) throw new Error("Chưa lưu được bản nháp. Vui lòng thử lại.");
    } else {
      const { data: created, error } = await admin
        .from("ideas")
        .insert({
          ...contentRow(data),
          creator_user_id: context.userId,
          creator_display_name_snapshot: displayName,
        })
        .select("id")
        .single();
      if (error || !created) throw new Error("Chưa tạo được bản nháp. Vui lòng thử lại.");
      ideaId = created.id;
    }

    await admin.from("idea_private_details").upsert(
      {
        idea_id: ideaId!,
        email: context.claims["email"] ? String(context.claims["email"]) : "",
        facebook_url: data.facebookUrl,
        telegram: data.telegram,
        fun_rich_url: data.funRichUrl,
        recipient_wallet: data.recipientWallet,
        consent_accuracy: data.consentAccuracy,
        consent_public: data.consentPublic,
      },
      { onConflict: "idea_id" },
    );

    await admin.from("idea_tags").delete().eq("idea_id", ideaId!);
    const tags = [...new Set(data.tags.map((tag) => tag.trim()).filter(Boolean))];
    if (tags.length)
      await admin.from("idea_tags").insert(tags.map((tag) => ({ idea_id: ideaId!, tag })));

    const { data: saved } = await admin
      .from("ideas")
      .select("updated_at")
      .eq("id", ideaId!)
      .maybeSingle();
    return { id: ideaId!, updatedAt: saved?.updated_at ?? new Date().toISOString() };
  });

/** Final submission. Requires the complete idea plus verification details. */
export const submitIdea = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => submitSchema.parse(input))
  .handler(async ({ data, context }) => {
    if (data.website) throw new Error("Không thể gửi bài.");
    const admin = await adminClient();
    const { data: idea } = await admin
      .from("ideas")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (!idea || idea.creator_user_id !== context.userId)
      throw new Error("Không tìm thấy ý tưởng của bạn.");
    if (!["draft", "needs_revision"].includes(idea.status))
      throw new Error("Ý tưởng này đã được gửi trước đó.");

    const { data: details } = await admin
      .from("idea_private_details")
      .select("*")
      .eq("idea_id", data.id)
      .maybeSingle();

    const missing: string[] = [];
    if (idea.title.trim().length < 3) missing.push("tiêu đề ý tưởng");
    if (idea.summary.trim().length < 10) missing.push("tóm tắt ngắn");
    if (idea.character_name.trim().length < 2) missing.push("tên nhân vật");
    if (idea.character_description.trim().length < 10) missing.push("mô tả nhân vật");
    if (idea.dream.trim().length < 10) missing.push("ước mơ");
    if (idea.gameplay.trim().length < 10) missing.push("trải nghiệm");
    if (idea.angel_ai.trim().length < 10) missing.push("Angel AI");
    if (idea.reward.trim().length < 5) missing.push("phần thưởng / ghi nhận");
    if (idea.world_change.trim().length < 10) missing.push("thế giới thay đổi");
    if (!details?.consent_accuracy) missing.push("xác nhận thông tin chính xác");
    if (!details || !/^https:\/\/(www\.)?facebook\.com\//i.test(details.facebook_url))
      missing.push("liên kết Facebook hợp lệ");
    if (
      !details ||
      !/^(?:@[A-Za-z0-9_]{5,32}|https:\/\/t\.me\/[A-Za-z0-9_]{5,32}\/?)$/i.test(details.telegram)
    )
      missing.push("Telegram hợp lệ");
    if (!details || !url.safeParse(details.fun_rich_url).success)
      missing.push("liên kết hồ sơ FUN.Rich");
    if (!details || details.recipient_wallet.trim().length < 20) missing.push("ví nhận CAMLY");
    if (missing.length) throw new Error(`Cần hoàn thiện: ${missing.join(", ")}.`);

    // Duplicate signal only — a creator may submit as many ideas as they wish.
    const { data: similar } = await admin
      .from("ideas")
      .select("id")
      .neq("id", idea.id)
      .ilike("title", idea.title.trim())
      .in("status", ["submitted", "under_review", ...PUBLIC_STATUSES])
      .limit(1);
    const duplicateFlag = (similar ?? []).length > 0;

    let code = idea.public_code;
    if (!code) {
      const { data: generated, error: codeError } = await admin.rpc("next_idea_public_code");
      if (codeError || !generated) throw new Error("Chưa thể tạo mã ý tưởng. Vui lòng thử lại.");
      code = generated as string;
    }

    const submittedAt = new Date().toISOString();
    const { error } = await admin
      .from("ideas")
      .update({
        public_code: code,
        status: "submitted",
        submitted_at: submittedAt,
        duplicate_flag: duplicateFlag,
        duplicate_reasons: duplicateFlag ? ["title"] : [],
        creator_message: null,
      })
      .eq("id", idea.id)
      .in("status", ["draft", "needs_revision"]);
    if (error) throw new Error("Chưa gửi được ý tưởng. Vui lòng thử lại.");

    await admin.from("idea_audit_events").insert({
      idea_id: idea.id,
      actor_user_id: context.userId,
      actor_type: "creator",
      action: "idea_submitted",
      old_status: idea.status,
      new_status: "submitted",
    });
    return { id: idea.id, code: code!, submittedAt };
  });

export const listMyIdeas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("ideas")
      .select(
        "id,public_code,title,summary,category,status,reward_status,creator_message,created_at,updated_at,submitted_at,published_at",
      )
      .eq("creator_user_id", context.userId)
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw new Error("Chưa tải được danh sách ý tưởng.");
    return data ?? [];
  });

export const getMyIdea = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const admin = await adminClient();
    const { data: idea } = await admin.from("ideas").select("*").eq("id", data.id).maybeSingle();
    if (!idea || idea.creator_user_id !== context.userId)
      throw new Error("Không tìm thấy ý tưởng của bạn.");
    const { data: details } = await admin
      .from("idea_private_details")
      .select("*")
      .eq("idea_id", data.id)
      .maybeSingle();
    const { data: tags } = await admin.from("idea_tags").select("tag").eq("idea_id", data.id);
    return { idea, details, tags: (tags ?? []).map((row) => row.tag) };
  });

const hubSchema = z.object({
  search: z.string().trim().max(120).default(""),
  category: z.string().trim().max(30).default(""),
  filter: z.enum(["all", "newest", "selected", "in_development", "prototype"]).default("all"),
});

export const listPublicIdeas = createServerFn({ method: "POST" })
  .inputValidator((input) => hubSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    let query = supabase
      .from("ideas")
      .select(
        "public_code,title,summary,category,status,creator_display_name_snapshot,cover_image_url,published_at",
      )
      .in("status", [...PUBLIC_STATUSES])
      .order("published_at", { ascending: false })
      .limit(60);
    if (data.filter === "selected") query = query.eq("status", "selected");
    if (data.filter === "in_development") query = query.eq("status", "in_development");
    if (data.filter === "prototype") query = query.eq("status", "prototype");
    if (data.category) query = query.eq("category", data.category as IdeaCategory);
    if (data.search) {
      const term = data.search.replace(/[%,()]/g, " ").trim();
      query = query.or(
        `title.ilike.%${term}%,summary.ilike.%${term}%,public_code.ilike.%${term}%,creator_display_name_snapshot.ilike.%${term}%`,
      );
    }
    const { data: rows, error } = await query;
    if (error) return { ideas: [], error: "Chưa tải được danh sách ý tưởng." };
    return { ideas: rows ?? [], error: null };
  });

export const getPublicIdea = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ code: z.string().trim().max(32) }).parse(input),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: idea } = await supabase
      .from("ideas")
      .select(
        "id,public_code,title,summary,category,status,creator_display_name_snapshot,cover_image_url,character_name,character_description,dream,gameplay,angel_ai,reward,world_change,real_world_connection,published_at",
      )
      .eq("public_code", data.code.toUpperCase())
      .in("status", [...PUBLIC_STATUSES])
      .maybeSingle();
    if (!idea) return { found: false as const };
    const { data: tags } = await supabase.from("idea_tags").select("tag").eq("idea_id", idea.id);
    return { found: true as const, idea, tags: (tags ?? []).map((row) => row.tag) };
  });

/* ---------------------------- Admin moderation ---------------------------- */

export const listAdminIdeas = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({ search: z.string().trim().max(120).default(""), status: z.string().max(30).default("") })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const admin = await adminClient();
    let query = admin
      .from("ideas")
      .select("*,idea_private_details(*),idea_tags(tag)")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (data.status) query = query.eq("status", data.status as never);
    if (data.search)
      query = query.or(
        `public_code.ilike.%${data.search}%,title.ilike.%${data.search}%,creator_display_name_snapshot.ilike.%${data.search}%`,
      );
    const { data: rows, error } = await query;
    if (error) throw new Error("Chưa tải được danh sách ý tưởng.");
    return rows ?? [];
  });

export const updateAdminIdea = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum([
          "under_review",
          "needs_revision",
          "published",
          "selected",
          "in_development",
          "prototype",
          "playtest",
          "implemented",
          "archived",
        ]),
        note: z.string().max(2000).default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const admin = await adminClient();
    const { data: current } = await admin
      .from("ideas")
      .select("status,published_at")
      .eq("id", data.id)
      .maybeSingle();
    if (!current) throw new Error("Không tìm thấy ý tưởng.");
    const publishing = (
      ["published", "selected", "in_development", "prototype", "playtest", "implemented"] as const
    ).includes(data.status as never);
    const { error } = await admin
      .from("ideas")
      .update({
        status: data.status,
        admin_note: data.note || null,
        creator_message: data.note || null,
        published_at: publishing ? (current.published_at ?? new Date().toISOString()) : null,
      })
      .eq("id", data.id);
    if (error) throw new Error("Chưa cập nhật được ý tưởng.");
    await admin.from("idea_audit_events").insert({
      idea_id: data.id,
      actor_user_id: context.userId,
      actor_type: "admin",
      action: `idea_${data.status}`,
      old_status: current.status,
      new_status: data.status,
      note: data.note || null,
    });
    return { ok: true };
  });

export const updateAdminIdeaReward = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        rewardStatus: z.enum([
          "not_selected",
          "eligible",
          "approved",
          "reward_pending",
          "rewarded",
          "reward_failed",
        ]),
        txHash: z.string().trim().max(200).default(""),
        note: z.string().max(2000).default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    if (data.rewardStatus === "rewarded" && data.txHash.trim().length < 6)
      throw new Error("Cần mã giao dịch thật trên BNB Smart Chain trước khi đánh dấu đã trao quà.");
    const admin = await adminClient();
    const { data: current } = await admin
      .from("ideas")
      .select("reward_status")
      .eq("id", data.id)
      .maybeSingle();
    if (!current) throw new Error("Không tìm thấy ý tưởng.");
    const { error } = await admin
      .from("ideas")
      .update({
        reward_status: data.rewardStatus,
        reward_tx_hash: data.txHash.trim() || null,
        rewarded_at: data.rewardStatus === "rewarded" ? new Date().toISOString() : null,
        rewarded_by: data.rewardStatus === "rewarded" ? context.userId : null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await admin.from("idea_audit_events").insert({
      idea_id: data.id,
      actor_user_id: context.userId,
      actor_type: "admin",
      action: `reward_${data.rewardStatus}`,
      old_status: current.reward_status,
      new_status: data.rewardStatus,
      note: data.note || null,
    });
    return { ok: true };
  });
