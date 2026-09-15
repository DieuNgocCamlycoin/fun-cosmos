/** Display strings for the co-creation experience. Logic never depends on these values. */

export const ideaCategories = [
  ["world", "🌍 Thế giới / Môi trường"],
  ["gameplay", "🎮 Lối chơi"],
  ["story", "📖 Câu chuyện"],
  ["character", "🧑 Nhân vật"],
  ["art", "🎨 Mỹ thuật"],
  ["music", "🎵 Âm nhạc"],
  ["ai", "🤖 Angel AI"],
  ["code", "💻 Lập trình"],
  ["green_earth", "🌱 Green Earth"],
  ["lovehub", "🏠 LoveHUB"],
  ["learning", "🎓 Học tập"],
  ["other", "✨ Khác"],
] as const;

export const categoryLabel = (value: string) =>
  ideaCategories.find(([id]) => id === value)?.[1] ?? "✨ Khác";

export const ideaStatusLabel: Record<string, string> = {
  draft: "Bản nháp",
  submitted: "Đã gửi • chờ duyệt",
  under_review: "Đang xem xét",
  needs_revision: "Cần bổ sung",
  published: "Đã đăng",
  selected: "Được lựa chọn",
  in_development: "Đang phát triển",
  prototype: "Prototype",
  playtest: "Playtest",
  implemented: "Đã đưa vào FUN COSMOS",
  archived: "Lưu trữ",
};

export const rewardStatusLabel: Record<string, string> = {
  not_selected: "Chưa được lựa chọn",
  eligible: "Đủ điều kiện xét quà",
  approved: "Đã phê duyệt quà tặng",
  reward_pending: "Đang chuẩn bị trao quà",
  rewarded: "Đã trao 99.999 CAMLY",
  reward_failed: "Trao quà chưa thành công",
};

export const journeyStages = [
  ["submitted", "IDEA"],
  ["under_review", "DISCUSS"],
  ["published", "IMPROVE"],
  ["selected", "SELECT"],
  ["prototype", "PROTOTYPE"],
  ["playtest", "PLAYTEST"],
  ["implemented", "FUN COSMOS"],
] as const;

export const howItWorks = [
  ["01", "TẠO Ý TƯỞNG", "Create"],
  ["02", "CHIA SẺ", "Share"],
  ["03", "THẢO LUẬN", "Discuss"],
  ["04", "CẢI TIẾN", "Improve"],
  ["05", "ĐỒNG SÁNG TẠO", "Co-Create"],
  ["06", "PROTOTYPE & PLAYTEST", "TẠO BẢN THỬ · CHƠI THỬ"],
  ["07", "FUN COSMOS", "IN GAME · TRỞ THÀNH TRẢI NGHIỆM THẬT"],
] as const;

export const rewardNotice =
  "Những ý tưởng được lựa chọn và Admin phê duyệt sẽ nhận quà tặng 99.999 Happy Camly Coin (CAMLY trên BNB Smart Chain). Phần quà dành cho bài tham gia hợp lệ theo thể lệ chương trình, không phải khoản đầu tư hay lợi nhuận.";

/** The 7 seeds. Short answers are welcome — no minimum length is enforced anywhere. */
export const creatorSteps = [
  {
    key: "character",
    title: "NHÂN VẬT CỦA BẠN LÀ AI?",
    english: "Character",
    helper: "Tên, tuổi, nghề nghiệp hoặc vai trò. Viết ngắn gọn cũng được.",
    placeholder: "Ví dụ: Anna, 22 tuổi, yêu thiên nhiên và thích sáng tạo.",
    optional: false,
  },
  {
    key: "dream",
    title: "ƯỚC MƠ CỦA NHÂN VẬT LÀ GÌ?",
    english: "Dream",
    helper: "Điều nhân vật thật sự muốn đạt được, trải nghiệm hoặc trở thành.",
    placeholder: "Ví dụ: Anna ước mơ tạo nên một khu vườn chữa lành cho cộng đồng.",
    optional: false,
  },
  {
    key: "gameplay",
    title: "BẠN MUỐN KIẾN TẠO ĐIỀU GÌ TRONG FUN COSMOS?",
    english: "Create",
    helper:
      "Có thể là một ngôi nhà, khu vườn, thành phố, doanh nghiệp, thế giới, cộng đồng, hành trình hoặc bất kỳ điều gì bạn tưởng tượng.",
    placeholder:
      "Ví dụ: Một khu vườn xanh bên hồ dành cho mọi người gặp gỡ và học về thiên nhiên.",
    optional: false,
  },
  {
    key: "angelAi",
    title: "ANGEL AI SẼ ĐỒNG HÀNH NHƯ THẾ NÀO?",
    english: "Angel AI",
    helper: "Angel AI có thể hướng dẫn, gợi ý, dạy học, giao nhiệm vụ hoặc cùng nhân vật sáng tạo.",
    placeholder: "Ví dụ: Angel AI hướng dẫn Anna thiết kế khu vườn và học cách chăm sóc cây.",
    optional: false,
  },
  {
    key: "reward",
    title: "THÀNH QUẢ BẠN MONG MUỐN LÀ GÌ?",
    english: "Outcome",
    helper: "Nhân vật học được gì, tạo ra gì hoặc thay đổi như thế nào?",
    placeholder:
      "Ví dụ: Anna hoàn thành khu vườn, học được kỹ năng mới và kết nối thêm nhiều người bạn.",
    optional: false,
  },
  {
    key: "worldChange",
    title: "THẾ GIỚI FUN COSMOS THAY ĐỔI RA SAO?",
    english: "World Change",
    helper: "Ý tưởng của bạn làm thế giới trở nên đẹp hơn, thú vị hơn hoặc hữu ích hơn như thế nào?",
    placeholder: "Ví dụ: Một vùng đất trống trở thành khu vườn xanh nơi cộng đồng cùng chăm sóc.",
    optional: false,
  },
  {
    key: "realWorldConnection",
    title: "KẾT NỐI VỚI ĐỜI THẬT",
    english: "Real-world Connection",
    helper: "Điều gì trong câu chuyện có thể được học, thực hành hoặc kiến tạo ngoài đời thật?",
    placeholder: "Ví dụ: Người chơi có thể tham gia một hoạt động Green Earth và trồng cây thật.",
    optional: true,
  },
] as const;

export const seedLabels = [
  "01 Nhân vật",
  "02 Ước mơ",
  "03 Điều muốn kiến tạo",
  "04 Angel AI",
  "05 Thành quả",
  "06 Thế giới thay đổi",
  "07 Kết nối đời thật",
] as const;

/** Story step */
export const STORY_MIN = 1000;
export const STORY_MAX = 30000;

export const storyJourney = [
  "ƯỚC MƠ",
  "BƯỚC VÀO FUN COSMOS",
  "GẶP ANGEL AI",
  "KHÁM PHÁ",
  "HỌC HỎI",
  "SÁNG TẠO",
  "THỬ THÁCH",
  "THÀNH QUẢ",
  "THẾ GIỚI THAY ĐỔI",
  "KẾT NỐI ĐỜI THẬT",
] as const;

export const storyEncouragement =
  "Bạn không cần phải là nhà văn. Hãy kể câu chuyện bằng trí tưởng tượng của mình. Bạn cũng có thể nhờ Angel AI giúp phát triển 7 hạt giống ý tưởng phía trên thành một câu chuyện FUN COSMOS hoàn chỉnh.";

export const storyPlaceholder =
  "Một ngày nọ, Anna bước qua cánh cổng FUN COSMOS...\nCô mang theo một ước mơ...\nAngel AI xuất hiện và hỏi cô rằng...";

export const storyTooShortMessage =
  "Câu chuyện cần ít nhất 1.000 ký tự để đủ không gian phát triển hành trình FUN COSMOS của bạn.";

export type SeedAnswers = {
  character: string;
  dream: string;
  gameplay: string;
  angelAi: string;
  reward: string;
  worldChange: string;
  realWorldConnection: string;
};

/** Angel AI co-writing prompt. Swap the copy button for a real Angel AI call later. */
export const buildAngelPrompt = (seeds: SeedAnswers) =>
  [
    "Hãy giúp tôi phát triển ý tưởng sau thành một câu chuyện FUN COSMOS hấp dẫn.",
    "",
    `NHÂN VẬT:\n${seeds.character || "(chưa điền)"}`,
    `ƯỚC MƠ:\n${seeds.dream || "(chưa điền)"}`,
    `ĐIỀU MUỐN KIẾN TẠO:\n${seeds.gameplay || "(chưa điền)"}`,
    `ANGEL AI:\n${seeds.angelAi || "(chưa điền)"}`,
    `THÀNH QUẢ:\n${seeds.reward || "(chưa điền)"}`,
    `THẾ GIỚI THAY ĐỔI:\n${seeds.worldChange || "(chưa điền)"}`,
    `KẾT NỐI ĐỜI THẬT:\n${seeds.realWorldConnection || "(chưa điền)"}`,
    "",
    "Hãy viết thành một câu chuyện có mở đầu, hành trình, thử thách, khám phá, sáng tạo, cao trào và kết thúc.",
    "Giữ tinh thần FUN COSMOS: khám phá → học hỏi → sáng tạo → kết nối → đóng góp → phát triển.",
    "Không biến câu chuyện thành quảng cáo. Ưu tiên trải nghiệm nhân vật và thế giới game.",
  ].join("\n");

/** Facebook sharing */
export const PROGRAM_HASHTAGS = "#FUNCOSMOS #FUNCOSMOSCuaCon #99999HappyCamlyCoin";

export const buildShareText = (title: string, story: string) =>
  `${title ? `${title}\n\n` : ""}${story}\n\n${PROGRAM_HASHTAGS}`;

export const FACEBOOK_POST_PATTERN = /^https?:\/\/(www\.|m\.|web\.|business\.)?facebook\.com\/.+/i;

export const storyExcerpt = (story: string, length = 220) => {
  const text = story.replace(/\s+/g, " ").trim();
  return text.length <= length ? text : `${text.slice(0, length).trimEnd()}…`;
};

export const programHeadline = "🎁 THỰC HÀNH NGAY — NHẬN LIỀN TAY · 99.999 HAPPY CAMLY COIN";
export const programSubline = "Dành cho bài tham gia hợp lệ theo thể lệ chương trình.";

export const loveScoreNote =
  "Love Score ghi nhận những đóng góp được hệ thống xác minh. Love Score không đánh giá giá trị con người.";

export const phaseTwoNote =
  "Tính năng thảo luận & đồng phát triển cộng đồng sẽ được mở trong giai đoạn tiếp theo.";

export const DRAFT_CACHE_KEY = "fun-cosmos-idea-draft-v3";
