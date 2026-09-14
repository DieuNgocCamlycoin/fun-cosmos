# YOUR TURN — Trung tâm đồng sáng tạo FUN COSMOS (Giai đoạn 1)

Trang chủ, URANTIA, Angel AI, Love Score, FUN Ecosystem, thanh điều hướng và ba thẻ game giữ nguyên hoàn toàn. Chỉ trang YOUR TURN được xây mới, thêm Idea Hub và tài khoản người sáng tạo.

## Giai đoạn 1 sẽ có

1. **Trang YOUR TURN mới** (`/your-turn`)
   - Mở đầu: "VŨ TRỤ BẮT ĐẦU TỪ MỘT Ý TƯỞNG" với hai nút: TẠO Ý TƯỞNG và KHÁM PHÁ Ý TƯỞNG CỘNG ĐỒNG.
   - HOW IT WORKS: bảy chặng Tạo → Chia sẻ → Thảo luận → Cải tiến → Đồng sáng tạo → Prototype → FUN COSMOS.
   - Thẻ MINI GAME "FUN COSMOS CỦA CON" với dòng thưởng 99.999 Happy Camly Coin kèm ghi chú "dành cho bài tham gia hợp lệ theo thể lệ chương trình" (không hứa hẹn lợi nhuận).
   - Khối giới thiệu Idea Hub và dẫn sang trang cộng đồng.
   - Hai ảnh chương trình hiện có được giữ nguyên trong trang.

2. **Tạo ý tưởng 7 bước** (`/your-turn/tao-y-tuong`, cần đăng nhập)
   - Bảy bước: Nhân vật · Ước mơ · Trải nghiệm · Angel AI · Phần thưởng · Thế giới thay đổi · Kết nối đời thật (bước 7 tùy chọn).
   - Thanh tiến trình 1/7, nút Trước / Tiếp theo / Lưu bản nháp; nháp lưu cả trên máy và trong tài khoản.
   - Bước thông tin bài: tiêu đề, tóm tắt, danh mục, thẻ nhiều lựa chọn.
   - Bước 99.999: họ tên hiển thị, email, Facebook, Telegram, FUN.Rich (tùy chọn), ví CAMLY, hai ô cam kết — giữ đúng luồng chương trình hiện tại trong cùng một lần gửi.
   - Màn XEM LẠI Ý TƯỞNG trước khi gửi, có nút Chỉnh sửa và Gửi ý tưởng; nút khóa khi đang gửi.
   - Màn chúc mừng: mã ý tưởng dạng FC-2026-000128, nút sao chép, trạng thái "ĐÃ GỬI • CHỜ DUYỆT", ba nút đi tiếp.

3. **Tài khoản người sáng tạo** (`/tai-khoan`)
   - Đăng ký / đăng nhập bằng email và mật khẩu, kèm đăng nhập Google.
   - Tên hiển thị công khai lưu ở hồ sơ; email, Telegram, Facebook, ví không bao giờ hiện công khai.
   - Nút tài khoản trên thanh điều hướng phản ánh đúng trạng thái đăng nhập, có đăng xuất.
   - Khách vẫn xem Idea Hub thoải mái; muốn tạo hoặc gửi bài thì đăng nhập.

4. **Ý TƯỞNG CỦA TÔI** (`/your-turn/y-tuong-cua-toi`)
   - Danh sách nháp, đã gửi, đang duyệt, đã đăng, cần bổ sung; mỗi mục có mã, trạng thái, ngày, phản hồi của ban quản trị.
   - Sửa được bản nháp và bài cần bổ sung; bài đã đăng không sửa trực tiếp.

5. **IDEA HUB công khai** (`/idea-hub` và `/idea-hub/FC-2026-000128`)
   - Chỉ hiện bài đã được duyệt đăng.
   - Ô tìm kiếm theo tiêu đề, mã bài, tên người sáng tạo, từ khóa; bộ lọc mới nhất / nổi bật / được lựa chọn / đang phát triển và lọc theo danh mục.
   - Thẻ ý tưởng: tiêu đề, mã, tên người sáng tạo, tóm tắt, danh mục, thẻ, ngày đăng. Không hiển thị số liệu giả.
   - Trang chi tiết: bảy phần nội dung ý tưởng và dải hành trình Idea → Discuss → Improve → Select → Prototype → Playtest → FUN COSMOS, làm nổi chặng hiện tại.
   - Trạng thái rỗng đẹp: "VŨ TRỤ ĐANG CHỜ Ý TƯỞNG ĐẦU TIÊN."

6. **Quản trị** — mở rộng trang quản trị hiện có: hàng chờ duyệt, xem toàn bộ bài, Đăng công khai / Yêu cầu bổ sung / Từ chối / Lưu trữ, cập nhật chặng phát triển, và vẫn quản lý phần thưởng 99.999 như hiện nay.

## Để dành Giai đoạn 2

Bình luận, phản hồi, thả tim, đề xuất đồng phát triển, theo dõi, thông báo, đính kèm tệp. Cấu trúc dữ liệu lần này đã chừa sẵn chỗ nên không phải làm lại.

## Phần kỹ thuật

- **Dữ liệu mới:** `profiles` (hồ sơ công khai, tên hiển thị, liên kết `auth.users`, trigger tạo tự động), `ideas` (mã công khai, chủ sở hữu, 7 trường nội dung, tiêu đề, tóm tắt, danh mục, trạng thái, chặng, mốc thời gian), `idea_tags`. Bảng cho Giai đoạn 2 (`idea_comments`, `idea_reactions`, `idea_contributions`) chưa tạo, nhưng `ideas` đã có khóa và chỉ mục để gắn vào.
- **Kế thừa, không thay thế:** giữ nguyên `fun_cosmos_participants/submissions/rewards/audit_events`, `user_roles`, `app_private.has_role`, `src/lib/fun-cosmos-submissions.functions.ts`, trang quản trị và trang tra cứu. Bài gửi mới tạo một `idea` và một `fun_cosmos_submission` liên kết với nhau trong cùng một giao dịch server, giữ nguyên kiểm tra trùng, chống spam, honeypot và bản ghi phần thưởng hiện có.
- **Mã công khai:** sequence trong Postgres, sinh ở phía máy chủ theo dạng `FC-{năm}-{6 chữ số}`, khóa duy nhất, không dùng đếm bản ghi.
- **RLS:** khách chỉ đọc bài `published`; người dùng đọc/sửa bài của chính mình khi còn nháp hoặc cần bổ sung; không ai tự đổi trạng thái duyệt hay chặng phát triển; chỉ vai trò admin mới duyệt. Mọi thao tác ghi đi qua server function có kiểm tra quyền; khóa dịch vụ không bao giờ ra trình duyệt.
- **Giao diện:** dùng đúng hệ màu hiện có (sapphire sáng, ngọc trai, vàng champagne, kính mờ), không nền đen nặng; component mới đặt trong `src/components/idea-hub/` và `src/components/idea-creator/`, style nối tiếp `living.css` và các token sẵn có.
- **Chuỗi chữ:** tách vào một tệp nội dung để sau này thêm tiếng Anh mà không đụng logic.
- **Kiểm thử:** máy tính 1440/1177, máy tính bảng, điện thoại 390/320; khách và người đã đăng nhập; trạng thái rỗng, đang tải, lỗi, chặn gửi trùng; xác nhận các trang và liên kết cũ không hỏng.
