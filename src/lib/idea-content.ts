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
  ["03", "CỘNG ĐỒNG THẢO LUẬN", "Discuss"],
  ["04", "CÙNG CẢI TIẾN", "Improve"],
  ["05", "ĐỒNG SÁNG TẠO", "Co-Create"],
  ["06", "PROTOTYPE", "Prototype"],
  ["07", "FUN COSMOS", "Live"],
] as const;

export const rewardNotice =
  "Những ý tưởng được lựa chọn và Admin phê duyệt sẽ nhận quà tặng 99.999 Happy Camly Coin (CAMLY trên BNB Smart Chain). Phần quà dành cho bài tham gia hợp lệ theo thể lệ chương trình, không phải khoản đầu tư hay lợi nhuận.";

export const creatorSteps = [
  {
    key: "character",
    title: "NHÂN VẬT",
    english: "Character",
    question: "Ai sẽ sống trong câu chuyện của con?",
    hint: "Anna — một cô bé yêu thiên nhiên, thích khám phá và trồng cây.",
  },
  {
    key: "dream",
    title: "ƯỚC MƠ / MỤC TIÊU",
    english: "Dream",
    question: "Nhân vật đang mong muốn điều gì?",
    hint: "Anna muốn tạo một khu vườn đẹp cho Green City.",
  },
  {
    key: "gameplay",
    title: "TRẢI NGHIỆM",
    english: "Gameplay",
    question: "Người chơi sẽ làm gì?",
    hint: "Khám phá · Xây dựng · Trồng cây · Giải câu đố · Thiết kế · Học tập · Kết nối",
  },
  {
    key: "angelAi",
    title: "ANGEL AI — NGƯỜI ĐỒNG HÀNH",
    english: "Angel AI",
    question: "Angel AI sẽ giúp người chơi như thế nào?",
    hint: "Hướng dẫn · đặt câu hỏi · gợi ý nhiệm vụ · giúp học · hỗ trợ sáng tạo · phản hồi",
  },
  {
    key: "reward",
    title: "PHẦN THƯỞNG / GHI NHẬN",
    english: "Reward",
    question: "Sau khi hoàn thành, người chơi nhận được điều gì?",
    hint: "Love Score · huy hiệu · vật phẩm · khu vực mới · kỹ năng · ghi nhận từ cộng đồng",
  },
  {
    key: "worldChange",
    title: "THẾ GIỚI THAY ĐỔI",
    english: "World Change",
    question: "Sau hành động của người chơi, thế giới thay đổi như thế nào?",
    hint: "Khu đất khô trở thành một khu vườn xanh.",
  },
  {
    key: "realWorldConnection",
    title: "KẾT NỐI ĐỜI THẬT (tùy chọn)",
    english: "Real-world Connection",
    question: "Ý tưởng này có thể kết nối với đời thật như thế nào?",
    hint: "Green Earth · LoveHUB · FUN Academy · FUN Farm · hoạt động cộng đồng · “Chưa có / Không áp dụng.”",
  },
] as const;

export const loveScoreNote =
  "Love Score ghi nhận những đóng góp được hệ thống xác minh. Love Score không đánh giá giá trị con người.";

export const phaseTwoNote =
  "Tính năng thảo luận & đồng phát triển cộng đồng sẽ được mở trong giai đoạn tiếp theo.";

export const DRAFT_CACHE_KEY = "fun-cosmos-idea-draft-v3";
