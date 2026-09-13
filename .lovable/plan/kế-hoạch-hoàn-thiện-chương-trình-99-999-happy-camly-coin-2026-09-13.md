# Kế hoạch hoàn thiện chương trình 99.999 HAPPY CAMLY COIN

## Kết quả audit hiện tại
- Supabase đang kết nối nhưng schema `public` chưa có bảng, dữ liệu, grant hay RLS policy; hiện cũng chưa có Supabase Auth user.
- Chưa có trang Admin, RBAC, server function nghiệp vụ, CAPTCHA hoặc rate limit.
- Đã có Supabase browser client, server admin client, auth middleware và CSRF middleware để tái sử dụng.
- Modal **“FUN COSMOS của bạn”** trên trang chủ và trang `/your-turn` đều dùng 7 trường hiện tại; bản nháp là mảng 7 chuỗi lưu tại `fun-cosmos-idea-v2` trong localStorage.
- `/reset-password` hiện phục vụ tài khoản Game/PlayFab; giữ nguyên và không kết nối với flow mới.
- Admin sẽ dùng Supabase email/password riêng, không cần hồ sơ Admin. Người tham gia không cần đăng nhập, FUN ID hay tài khoản Game.

## 1. Mô hình dữ liệu và bảo mật
Tạo migration cho các enum/trạng thái, hàm cập nhật thời gian và các bảng:

### `fun_cosmos_participants`
- `id`, `user_id nullable`, `fun_id nullable`, `created_at`, `updated_at`.
- Là identity cầu nối cho Phase 2; guest hiện tại nhận `participant_id` ngẫu nhiên từ server.

### `fun_cosmos_submissions`
- UUID nội bộ, mã công khai duy nhất, `participant_id`, `user_id/fun_id nullable`, campaign.
- Thông tin liên hệ, ví, đủ 7 câu trả lời, hai consent.
- Trạng thái: `submitted`, `under_review`, `needs_revision`, `approved`, `rejected`.
- `duplicate_flag`, lý do trùng, ghi chú cho participant/Admin, các mốc thời gian.

### `fun_cosmos_rewards`
- Liên kết submission/participant, campaign, loại thưởng, `99999 CAMLY`, ví, trạng thái reward, TX hash và các mốc duyệt/gửi.
- Trạng thái: `pending`, `eligible`, `approved`, `processing`, `sent`, `failed`, `cancelled`.
- Chỉ tạo reward ở trạng thái `pending`; tuyệt đối không tự chuyển token hoặc tự đánh dấu `sent`.

### `fun_cosmos_audit_events`
- Lưu actor, action, trạng thái cũ/mới, thời gian và ghi chú cho mọi thay đổi quan trọng.

### Quyền Admin và chống spam
- Tạo enum role, bảng `user_roles` riêng và hàm `has_role`; không lưu role trong profile hay trình duyệt.
- Tạo bảng giới hạn request chỉ chứa fingerprint một chiều và thời gian, không lưu IP thô.
- Bật RLS trên tất cả bảng; không cấp quyền đọc/cập nhật submissions hoặc rewards cho `anon`.
- Chỉ Admin đã đăng nhập và có role thật mới đọc hoặc thay đổi dữ liệu qua server.
- Thêm index cho mã bài, campaign/status/ngày, email/Facebook/Telegram/ví chuẩn hóa và các màn hình tìm kiếm.
- Thêm guard database ngăn cùng một ví + campaign có hơn một reward ở các trạng thái `approved/processing/sent`; bản nghi trùng vẫn được lưu để Admin xét, không tự reject.

## 2. Server functions an toàn
Tạo các server function dùng Zod và server-only Supabase client:

- **Submit guest entry:** chuẩn hóa/validate dữ liệu, honeypot, rate limit theo fingerprint IP + email, phát hiện trùng theo email/Facebook/Telegram/ví/participant, tạo participant + submission + reward pending + audit event và mã dạng `FC-2026-XXXXXX`.
- **Public lookup:** nhận đúng cặp mã bài + email, rate limit và chỉ trả DTO an toàn gồm trạng thái, ngày gửi, reward, TX hash công khai và lời nhắn dành cho participant.
- **Admin list/detail:** bắt buộc Supabase session và role Admin; hỗ trợ search, filter, phân trang, xem đủ bài và cảnh báo trùng.
- **Admin transitions:** kiểm tra chuyển trạng thái hợp lệ, cập nhật submission/reward, ghi audit event; reward approval kiểm tra lại ví + campaign ở server và database.
- Service Role chỉ được import động bên trong handler sau khi kiểm tra quyền; không gửi key hoặc dữ liệu riêng tư ra frontend.
- Thêm bearer middleware cho protected server functions trong cấu hình TanStack hiện có; giữ CSRF middleware.

## 3. Form người tham gia
Nâng cấp modal hiện có thay vì thiết kế lại:
- Giữ nguyên 7 câu hỏi và dữ liệu localStorage hiện tại.
- Thêm phần **THÔNG TIN NGƯỜI THAM GIA**: tên, email, Facebook URL, Telegram, FUN.Rich tùy chọn, ví CAMLY và helper kiểm tra ví.
- Thêm checkbox xác nhận bắt buộc và đồng ý chia sẻ tùy chọn.
- Validation rõ ràng, focus/scroll tới lỗi đầu tiên, trạng thái đang gửi và lỗi mạng có thể thử lại.
- Footer sticky gồm **LƯU BẢN NHÁP** và **GỬI BÀI THAM GIA**; desktop 2 cột, mobile 1 cột và modal cuộn tốt.
- Nút **THAM GIA 99.999** tại bảng chương trình sẽ mở trực tiếp form này thay vì trạng thái “Sắp mở”.
- Đồng bộ `/your-turn` với cùng schema/draft để không tạo hai flow submission khác nhau.

## 4. Thành công và tra cứu công khai
- Sau submit, giữ modal mở và thay bằng màn hình thành công: mã bài, ngày gửi, “Đã gửi — đang chờ xác minh”, reward “Đang chờ xét duyệt”.
- Có nút sao chép mã và mở trang `/fun-cosmos/tra-cuu`.
- Trang tra cứu yêu cầu mã bài + email; thông báo sai dùng nội dung chung, không tiết lộ mã hay email nào tồn tại.
- Chỉ hiển thị “Đã trao thưởng” khi reward thật sự là `sent`; TX hash chỉ xuất hiện khi đã gửi và có giá trị thật.

## 5. Đăng nhập và khu vực Admin
- Tạo `/admin/login` dùng Supabase email/password, quên mật khẩu và callback/reset riêng cho Admin; không sửa auth Game/PlayFab.
- Tạo protected Admin layout kiểm tra session và `has_role('admin')` ở server.
- `/admin/fun-cosmos/submissions`: danh sách, search/filter, chi tiết 7 câu trả lời, liên hệ, ví, duplicate warning, ghi chú và các action review.
- `/admin/fun-cosmos/rewards`: queue reward, trạng thái, ví, TX hash, action Approve/Processing/Sent/Failed.
- Có lịch sử audit trong chi tiết; mọi mutation được authorization ở server, không dựa vào ẩn nút.
- Bước vận hành sau triển khai: tạo Supabase Auth user Admin đầu tiên và gán role `admin`; không mở đăng ký Admin công khai.

## 6. Kiểm thử và nghiệm thu
- Migration, grants, RLS và database linter; xác nhận anonymous Data API không đọc/sửa được bảng riêng tư.
- Test submit thành công, validation, honeypot/rate limit, duplicate flag và guard trùng reward.
- Test lookup đúng/sai cặp mã + email và xác nhận không rò rỉ PII.
- Test Admin chưa đăng nhập, đã đăng nhập nhưng không có role, Admin hợp lệ và toàn bộ state transitions/audit.
- Test desktop 1440×900, 1177×657; mobile 390×844, 320×568; bàn phím, focus, sticky CTA và reduced motion.
- Chạy typecheck, lint phù hợp, build và kiểm tra console/network.

## Ngoài phạm vi
- Không kết nối hoặc thay đổi authentication của Game.
- Không yêu cầu FUN ID hoặc tài khoản người tham gia.
- Không chuyển token, không tạo transaction giả và không tích hợp blockchain trong phase này.
