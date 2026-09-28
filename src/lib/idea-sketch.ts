/** A sketch is already useful content; it does not need a second long story. */
export const SKETCH_RECEIPT_KEY = "fun-cosmos-sketch-receipt-v1";
export const sketchKeys = [
  "characterDescription",
  "dream",
  "gameplay",
  "angelAi",
  "reward",
  "worldChange",
  "realWorldConnection",
] as const;
const labels = [
  "Nhân vật",
  "Ước mơ",
  "Trải nghiệm / nhiệm vụ",
  "Angel AI",
  "Thành quả",
  "Thế giới thay đổi",
  "Kết nối đời thật",
];
export function sketchContent(fields: readonly string[]) {
  const answers = fields.map((value) => value.trim());
  return {
    title: (answers[1] || answers[2] || answers[0] || "Ý tưởng FUN COSMOS").slice(0, 140),
    summary: answers.filter(Boolean).join(" · ").slice(0, 500),
    story: answers
      .map((value, index) => (value ? `${labels[index]}: ${value}` : ""))
      .filter(Boolean)
      .join("\n\n"),
    ...Object.fromEntries(sketchKeys.map((key, index) => [key, answers[index] || ""])),
  };
}
