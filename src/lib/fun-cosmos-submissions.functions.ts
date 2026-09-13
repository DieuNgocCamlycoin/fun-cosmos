import { createHash, randomBytes } from "crypto";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const CAMPAIGN_CODE = "fun-cosmos-99999-camly-v1";

const text = z.string().trim().min(2).max(1000);
const url = z.string().trim().url().max(500);
const telegram = z.string().trim().regex(/^(?:@[A-Za-z0-9_]{5,32}|https:\/\/t\.me\/[A-Za-z0-9_]{5,32}\/?$)$/i);
const wallet = z.string().trim().min(20).max(128).regex(/^[A-Za-z0-9:_-]+$/);

export const submissionSchema = z.object({
  answers: z.array(text).length(7),
  displayName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  facebookUrl: url.refine((value) => /^https:\/\/(?:www\.)?facebook\.com\//i.test(value), "Facebook URL không hợp lệ"),
  telegram,
  funRichUrl: z.union([z.literal(""), url]).optional(),
  walletAddress: wallet,
  consentAccuracy: z.literal(true),
  consentPublic: z.boolean().default(false),
  website: z.string().max(0).optional(),
});

const normalize = (value: string) => value.trim().toLowerCase().replace(/\/$/, "");
const makeCode = () => `FC-${new Date().getUTCFullYear()}-${randomBytes(4).toString("hex").slice(0, 6).toUpperCase()}`;
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

async function adminClient() {
  return (await import("@/integrations/supabase/client.server")).supabaseAdmin;
}

async function enforceRateLimit(action: string, identity: string, limit: number) {
  const request = getRequest();
  const ip = request?.headers.get("cf-connecting-ip") ?? request?.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const fingerprint = hash(`${action}:${ip}:${normalize(identity)}`);
  const admin = await adminClient();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin.from("fun_cosmos_rate_limits").select("id", { count: "exact", head: true }).eq("action", action).eq("fingerprint_hash", fingerprint).gte("created_at", since);
  if ((count ?? 0) >= limit) throw new Error("Bạn đã thử quá nhiều lần. Vui lòng quay lại sau.");
  await admin.from("fun_cosmos_rate_limits").insert({ action, fingerprint_hash: fingerprint });
}

export const submitFunCosmosEntry = createServerFn({ method: "POST" })
  .inputValidator((input) => submissionSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) throw new Error("Không thể gửi bài.");
    await enforceRateLimit("submit", data.email, 5);
    const admin = await adminClient();
    const emailNormalized = normalize(data.email);
    const facebookNormalized = normalize(data.facebookUrl);
    const telegramNormalized = normalize(data.telegram).replace(/^https:\/\/t\.me\//, "@");
    const walletNormalized = normalize(data.walletAddress);
    const { data: duplicates } = await admin.from("fun_cosmos_submissions")
      .select("email_normalized,facebook_normalized,telegram_normalized,wallet_normalized")
      .eq("campaign_code", CAMPAIGN_CODE)
      .or(`email_normalized.eq.${emailNormalized},facebook_normalized.eq.${facebookNormalized},telegram_normalized.eq.${telegramNormalized},wallet_normalized.eq.${walletNormalized}`)
      .limit(20);
    const reasons = new Set<string>();
    for (const row of duplicates ?? []) {
      if (row.email_normalized === emailNormalized) reasons.add("email");
      if (row.facebook_normalized === facebookNormalized) reasons.add("facebook");
      if (row.telegram_normalized === telegramNormalized) reasons.add("telegram");
      if (row.wallet_normalized === walletNormalized) reasons.add("wallet");
    }
    const { data: participant, error: participantError } = await admin.from("fun_cosmos_participants").insert({}).select("id").single();
    if (participantError || !participant) throw new Error("Chưa thể ghi nhận bài. Vui lòng thử lại.");
    let code = makeCode();
    const payload = {
      public_submission_code: code, participant_id: participant.id, campaign_code: CAMPAIGN_CODE,
      display_name: data.displayName, email: data.email.trim(), email_normalized: emailNormalized,
      facebook_url: data.facebookUrl.trim(), facebook_normalized: facebookNormalized,
      telegram: data.telegram.trim(), telegram_normalized: telegramNormalized,
      fun_rich_url: data.funRichUrl?.trim() || null, wallet_address: data.walletAddress.trim(), wallet_normalized: walletNormalized,
      character: data.answers[0], dream: data.answers[1], gameplay: data.answers[2], angel_ai_support: data.answers[3],
      desired_reward_or_progress: data.answers[4], world_change: data.answers[5], real_world_connection: data.answers[6],
      consent_accuracy: true, consent_public: data.consentPublic, duplicate_flag: reasons.size > 0, duplicate_reasons: [...reasons],
    };
    let result = await admin.from("fun_cosmos_submissions").insert(payload).select("id,public_submission_code,submitted_at").single();
    if (result.error?.code === "23505") {
      code = makeCode();
      result = await admin.from("fun_cosmos_submissions").insert({ ...payload, public_submission_code: code }).select("id,public_submission_code,submitted_at").single();
    }
    if (result.error || !result.data) throw new Error("Chưa thể ghi nhận bài. Vui lòng thử lại.");
    const { data: reward, error: rewardError } = await admin.from("fun_cosmos_rewards").insert({ submission_id: result.data.id, participant_id: participant.id, campaign_code: CAMPAIGN_CODE, wallet_address: data.walletAddress.trim(), wallet_normalized: walletNormalized }).select("id").single();
    if (rewardError || !reward) throw new Error("Bài đã được lưu nhưng chưa tạo được hồ sơ phần thưởng. Vui lòng liên hệ hỗ trợ.");
    await admin.from("fun_cosmos_audit_events").insert({ submission_id: result.data.id, reward_id: reward.id, actor_type: "guest", action: "submission_created", new_status: "submitted" });
    return { code: result.data.public_submission_code, submittedAt: result.data.submitted_at, status: "submitted" as const, rewardStatus: "pending" as const };
  });

export const lookupFunCosmosEntry = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ code: z.string().trim().regex(/^FC-\d{4}-[A-Z0-9]{6}$/i), email: z.string().trim().email() }).parse(input))
  .handler(async ({ data }) => {
    await enforceRateLimit("lookup", data.email, 20);
    const admin = await adminClient();
    const { data: submission } = await admin.from("fun_cosmos_submissions").select("id,public_submission_code,submitted_at,status,participant_message").eq("public_submission_code", data.code.toUpperCase()).eq("email_normalized", normalize(data.email)).maybeSingle();
    if (!submission) return { found: false as const };
    const { data: reward } = await admin.from("fun_cosmos_rewards").select("status,reward_amount,token_symbol,tx_hash").eq("submission_id", submission.id).maybeSingle();
    return { found: true as const, code: submission.public_submission_code, submittedAt: submission.submitted_at, status: submission.status, participantMessage: submission.participant_message, reward: reward ? { status: reward.status, amount: reward.reward_amount, symbol: reward.token_symbol, txHash: reward.status === "sent" ? reward.tx_hash : null } : null };
  });

async function requireAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (!data) throw new Error("Forbidden");
}

export const listAdminSubmissions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ search: z.string().max(200).default(""), status: z.string().max(30).default("") }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context); const admin = await adminClient();
    let query = admin.from("fun_cosmos_submissions").select("*,fun_cosmos_rewards(*)").order("submitted_at", { ascending: false }).limit(100);
    if (data.status) query = query.eq("status", data.status as any);
    if (data.search) query = query.or(`public_submission_code.ilike.%${data.search}%,display_name.ilike.%${data.search}%,email.ilike.%${data.search}%,wallet_address.ilike.%${data.search}%`);
    const { data: rows, error } = await query; if (error) throw error; return rows ?? [];
  });

export const updateAdminSubmission = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), status: z.enum(["under_review","needs_revision","approved","rejected"]), note: z.string().max(2000).default("") }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context); const admin = await adminClient();
    const { data: current } = await admin.from("fun_cosmos_submissions").select("status").eq("id", data.id).single(); if (!current) throw new Error("Không tìm thấy bài.");
    const { error } = await admin.from("fun_cosmos_submissions").update({ status: data.status, admin_note: data.note || null, participant_message: data.note || null }).eq("id", data.id); if (error) throw error;
    if (data.status === "approved") await admin.from("fun_cosmos_rewards").update({ status: "eligible" }).eq("submission_id", data.id).eq("status", "pending");
    await admin.from("fun_cosmos_audit_events").insert({ submission_id: data.id, actor_user_id: context.userId, actor_type: "admin", action: data.status, old_status: current.status, new_status: data.status, note: data.note || null });
    return { ok: true };
  });

export const listAdminRewards = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  await requireAdmin(context); const admin = await adminClient();
  const { data, error } = await admin.from("fun_cosmos_rewards").select("*,fun_cosmos_submissions(public_submission_code,display_name,duplicate_flag)").order("updated_at", { ascending: false }).limit(100); if (error) throw error; return data ?? [];
});

export const updateAdminReward = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), status: z.enum(["approved","processing","sent","failed"]), txHash: z.string().trim().max(200).default(""), note: z.string().max(2000).default("") }).parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context); if (data.status === "sent" && data.txHash.length < 6) throw new Error("Cần TX Hash thật trước khi đánh dấu đã gửi.");
    const admin = await adminClient(); const { data: current } = await admin.from("fun_cosmos_rewards").select("status,submission_id").eq("id", data.id).single(); if (!current) throw new Error("Không tìm thấy phần thưởng.");
    const patch = { status: data.status, tx_hash: data.txHash || null, notes: data.note || null, approved_by: context.userId, approved_at: data.status === "approved" ? new Date().toISOString() : undefined, sent_at: data.status === "sent" ? new Date().toISOString() : null };
    const { error } = await admin.from("fun_cosmos_rewards").update(patch).eq("id", data.id); if (error?.code === "23505") throw new Error("Ví này đã có phần thưởng được duyệt trong chiến dịch."); if (error) throw error;
    await admin.from("fun_cosmos_audit_events").insert({ submission_id: current.submission_id, reward_id: data.id, actor_user_id: context.userId, actor_type: "admin", action: `reward_${data.status}`, old_status: current.status, new_status: data.status, note: data.note || null }); return { ok: true };
  });