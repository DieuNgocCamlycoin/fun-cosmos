import { z } from "zod";

export const IDEA_STORAGE_KEY = "fun-cosmos-idea-v2";
export const IDEA_FIELDS = [
  {
    en: "Character",
    vi: "Nhân vật",
    hintEn: "A gardener who helps people meet…",
    hintVi: "Một người làm vườn…",
  },
  {
    en: "Dream",
    vi: "Ước mơ",
    hintEn: "A place where everyone can gather…",
    hintVi: "Tạo một nơi mọi người gặp nhau…",
  },
  {
    en: "Experience or quest",
    vi: "Trải nghiệm / nhiệm vụ",
    hintEn: "Plant trees and design a garden…",
    hintVi: "Trồng cây và thiết kế khu vườn…",
  },
  {
    en: "How could Angel AI help?",
    vi: "Angel AI hỗ trợ gì?",
    hintEn: "Help me learn how to care for plants…",
    hintVi: "Hướng dẫn chăm sóc cây…",
  },
  {
    en: "What would you like to recognize?",
    vi: "Ghi nhận mong muốn",
    hintEn: "A new skill or meaningful contribution…",
    hintVi: "Kỹ năng mới, dấu mốc đóng góp…",
  },
  {
    en: "How would the world change?",
    vi: "Thế giới thay đổi thế nào?",
    hintEn: "A bare plot becomes greener…",
    hintVi: "Một khu đất trở nên xanh hơn…",
  },
  {
    en: "Connection to real life",
    vi: "Kết nối với đời thật",
    hintEn: "Join a local tree planting day…",
    hintVi: "Tham gia trồng cây cùng cộng đồng…",
  },
] as const;

export const ideaPayloadSchema = z.object({
  fields: z.array(z.string().trim().max(1000)).length(7),
  email: z.string().trim().email().max(254),
  consent: z.literal(true),
  locale: z.enum(["en", "vi"]),
  requestId: z.string().uuid(),
  website: z.string().max(0).optional(),
});

export type IdeaPayload = z.infer<typeof ideaPayloadSchema>;

export function ideaHasContent(fields: readonly string[]) {
  return fields.some((value) => value.trim().length > 0);
}

export function exportIdea(fields: readonly string[], locale: "en" | "vi") {
  const heading = locale === "en" ? "FUN COSMOS — My game idea" : "FUN COSMOS — Ý tưởng của tôi";
  const content = IDEA_FIELDS.map(
    (field, index) => `${field[locale]}: ${fields[index] ?? ""}`,
  ).join("\n\n");
  const blob = new Blob([`${heading}\n\n${content}`], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = locale === "en" ? "fun-cosmos-my-idea.txt" : "fun-cosmos-y-tuong.txt";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
