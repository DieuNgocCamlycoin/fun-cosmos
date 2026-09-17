# YOUR TURN — Phase 1.1: nối nốt phần còn lại

Phần lớn hành trình tạo ý tưởng đã được dựng xong ở lượt trước. Kế hoạch này chỉ nối nốt phần còn thiếu, không xây lại và không đụng dữ liệu cũ.

## Đã có sẵn trong mã hiện tại (đã kiểm tra)

- 7 hạt giống: lời hướng dẫn mới, trả lời ngắn vẫn đi tiếp, mục 07 tùy chọn.
- Bước 08 CÂU CHUYỆN: phụ đề "BIẾN Ý TƯỞNG THÀNH MỘT CUỘC PHIÊU LƯU.", dải hành trình, bộ đếm ký tự trực tiếp, tối thiểu 1.000 khi gửi chính thức, lưu nháp không giới hạn.
- Nút "NHỜ ANGEL AI VIẾT CÙNG TÔI" mở bảng ghép sẵn lời nhắc + "SAO CHÉP PROMPT" (không giả lập AI).
- Bước chia sẻ: "SAO CHÉP CÂU CHUYỆN" tự kèm 3 hashtag, "ĐĂNG LÊN FACEBOOK ↗" chỉ mở Facebook, ô dán link có kiểm tra định dạng.
- Màn xem lại 8 phần với nút Chỉnh sửa, câu chuyện trình bày như bài viết; màn chúc mừng với mã FC và 4 lựa chọn.
- Idea Hub: thẻ có đoạn trích từ câu chuyện; trang chi tiết đặt câu chuyện lên trước 7 hạt giống; quản trị đọc được câu chuyện và mở bài viết Facebook.
- Máy chủ chặn gửi khi câu chuyện dưới 1.000 ký tự hoặc thiếu link Facebook hợp lệ.

## Còn thiếu — sẽ làm trong lượt này

### 1. Ô đồng ý hiển thị link Facebook
Thêm vào bước chia sẻ một ô tick rõ ràng, mặc định **không** tick:

"Tôi đồng ý cho FUN COSMOS hiển thị công khai link bài viết Facebook này trên Idea Hub nếu ý tưởng của tôi được duyệt đăng."

Nhập link không đồng nghĩa với đồng ý. Trạng thái này được lưu cùng bản nháp và bài gửi.

### 2. Chỉ hiện link khi có đồng ý
Trang chi tiết công khai chỉ hiện nút "XEM BÀI VIẾT TRÊN FACEBOOK ↗" khi bài đã duyệt đăng **và** người sáng tạo đã tick đồng ý. Không đồng ý thì phần công khai không nhận được link.

### 3. Màn xem lại
Thêm dòng trạng thái đồng ý hiển thị công khai (Có / Không) kèm nút Chỉnh sửa, và khối thông tin chương trình 99.999 theo lời mới.

### 4. Trang quản trị
Hiện thêm trạng thái đồng ý bên cạnh nút "MỞ BÀI VIẾT ↗" để Ban quản trị biết link nào được phép công khai. Giữ nguyên mọi thao tác duyệt bài và quản lý quà tặng.

### 5. Kiểm thử
Chạy đủ các trường hợp: lưu nháp khi chưa đủ 1.000 ký tự; chặn gửi khi thiếu chữ hoặc thiếu link; link sai báo rõ; bấm gửi nhiều lần không tạo bài trùng; bài vừa gửi chưa lên Idea Hub; quản trị duyệt thì mới xuất hiện; bật/tắt đồng ý ảnh hưởng đúng tới link công khai; bài cũ chưa có câu chuyện vẫn mở được; không lộ email, Telegram, Facebook cá nhân, ví CAMLY hay ghi chú nội bộ. Kiểm tra 1440, 1177, 768, 390 và 320. Dữ liệu thử sẽ được dọn sạch.

Không publish sau khi xong; sẽ báo lại kết quả để Cha vào Preview chơi thử.

## Chi tiết kỹ thuật

- Không tạo migration: dùng đúng 3 cột đã có (`story`, `facebook_post_url`, `facebook_post_public_consent`). Không đổi RLS hay grants.
- Lưu ý: công cụ đọc cơ sở dữ liệu hiện báo thiếu quyền (Supabase Forbidden), nên con chưa tự xác minh được 3 cột; con tin theo Cha và bước kiểm thử đầu tiên sẽ xác nhận. Nếu cột `facebook_post_public_consent` khác tên hoặc chưa có, con sẽ dừng và báo Cha ngay.
- `src/lib/ideas.functions.ts`: thêm `facebookPostPublicConsent: z.boolean().default(false)` vào draft schema và `contentRow`; mở rộng `StoryFields`; `getPublicIdea` chỉ trả `facebook_post_url` khi `facebook_post_public_consent` là true (lọc phía máy chủ, không dựa vào giao diện).
- `src/routes/tao-y-tuong.tsx`: thêm trường consent vào draft/emptyDraft/nạp bản nháp, ô tick ở bước chia sẻ, dòng trạng thái ở màn xem lại.
- `src/routes/idea-hub.$code.tsx`: giữ nguyên hiển thị, link chỉ xuất hiện khi máy chủ gửi về.
- `src/routes/admin.fun-cosmos.ideas.tsx`: hiện nhãn trạng thái đồng ý.
- `src/components/idea-hub.css`: kiểu cho ô tick đồng ý, đồng bộ hệ màu sapphire/ngọc trai/vàng champagne.
- Chạy `bunx tsgo --noEmit` và kiểm thử Playwright trên localhost.
