import { isFacebookPostUrl, STORY_MAX, STORY_MIN } from "./idea-content.ts";

export function isFunRichUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      ["fun.rich", "www.fun.rich"].includes(url.hostname) &&
      url.pathname !== "/"
    );
  } catch {
    return false;
  }
}
export function isBnbWallet(value: string) {
  return /^0x[a-f\d]{40}$/i.test(value.trim());
}
export type ProgramCheck = { stage: 0 | 1 | 2; message: string } | null;
export function checkProgram(
  fields: {
    title: string;
    story: string;
    facebookPostUrl: string;
    funRichPostUrl: string;
    funRichUrl: string;
    recipientWallet: string;
  },
  consent: boolean,
): ProgramCheck {
  if (fields.title.trim().length < 3)
    return { stage: 0, message: "Tên ý tưởng cần ít nhất 3 ký tự." };
  const length = fields.story.trim().length;
  if (length < STORY_MIN)
    return { stage: 0, message: `Câu chuyện còn thiếu ${STORY_MIN - length} ký tự.` };
  if (fields.story.length > STORY_MAX) return { stage: 0, message: "Câu chuyện quá dài." };
  if (!isFacebookPostUrl(fields.facebookPostUrl))
    return { stage: 1, message: "Hãy nhập link bài đăng Facebook công khai." };
  if (!isFunRichUrl(fields.funRichPostUrl))
    return { stage: 1, message: "Hãy nhập link bài đăng FUN.Rich công khai." };
  if (!isFunRichUrl(fields.funRichUrl) || !isBnbWallet(fields.recipientWallet))
    return { stage: 1, message: "Cần link hồ sơ FUN.Rich và ví BNB Smart Chain hợp lệ." };
  if (!consent) return { stage: 2, message: "Vui lòng xác nhận đây là bài tham gia của bạn." };
  return null;
}
export function makeFunRichBatch(
  rows: readonly { rewardStatus: string; rewardAmount: number; wallet: string }[],
) {
  const totals = new Map<string, number>();
  for (const row of rows) {
    if (
      !["approved", "reward_pending"].includes(row.rewardStatus) ||
      !isBnbWallet(row.wallet) ||
      !Number.isSafeInteger(row.rewardAmount) ||
      row.rewardAmount < 99999
    )
      continue;
    const wallet = row.wallet.trim();
    const combined = (totals.get(wallet) || 0) + row.rewardAmount;
    if (!Number.isSafeInteger(combined)) continue;
    totals.set(wallet, combined);
  }
  return (
    [...totals].map(([wallet, amount]) => `${wallet},${amount}`).join("\n") +
    (totals.size ? "\n" : "")
  );
}
export function splitFunRichBatch(csv: string, maxRecipients = 99) {
  const lines = csv.trim().split("\n").filter(Boolean);
  if (!lines.length) return [];
  const files: string[] = [];
  for (let i = 0; i < lines.length; i += maxRecipients)
    files.push(lines.slice(i, i + maxRecipients).join("\n") + "\n");
  return files;
}
