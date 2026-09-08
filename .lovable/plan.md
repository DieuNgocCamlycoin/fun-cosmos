# FUN COSMOS — Kết nối Game + Angel AI + Love Score World

## 1. Nút "CHƠI NGAY" dẫn thẳng vào game

- Thêm một nơi duy nhất lưu địa chỉ game (`https://funkingdom.itch.io/funcosmos10d`) để sau này đổi sang tên miền chính thức chỉ cần sửa một chỗ.
- Trang chủ: nút "Đăng ký tài khoản" trên thanh trên cùng đổi thành **CHƠI NGAY**, giữ nguyên kiểu vàng sang trọng, mở tab mới.
- Mục "Chơi game": hai thẻ phiên bản hiện đang bị khoá ("chờ liên kết") sẽ được bật, dẫn vào game, mở tab mới.
- Cửa sổ "Bắt đầu hành trình" và nút "Chơi FUN COSMOS" ở các trang thế giới cũng dẫn vào game.

## 2. Thanh điều hướng

- **ANGEL AI** trên thanh trên cùng → mở thẳng trang Angel AI World.
- **LOVE SCORE** → mở thẳng trang Love Score World mới.
- Giữ nguyên phần Angel AI và Love Score trên trang chủ cùng các nút "Khám phá Angel AI".

## 3. Love Score World — trang mới

Dùng chung khung thế giới của Angel AI (thanh trên, chân trang, nút tạm dừng chuyển động, trình xem ảnh lớn) nhưng có diện mạo riêng: bầu trời sapphire sáng, ánh vàng kim loại, pha lê tím-xanh, thành phố ánh sáng.

Mạch chuyện:

1. **Mở màn** — Cha Vũ Trụ bên trái, Angel bên phải, ở giữa là dòng chữ LOVE SCORE, phụ đề "Verified Positive Contribution" và thông điệp "Mỗi đóng góp, một vì sao". Nền là thành phố ánh sáng, cổng vũ trụ, pha lê trôi nhẹ.
2. **Love Score là gì** — trái tim pha lê và khiên ánh sáng kể ý chính: lịch sử những đóng góp tích cực đã được ghi nhận.
3. **Những đóng góp được ghi nhận** — 8 nội dung đúng theo hình gốc, hiện thành các điểm sáng nằm rải trong không gian; chạm hoặc rê chuột thì điểm sáng bừng lên và hiện tên cùng một dòng mô tả. Trên điện thoại chuyển thành danh sách chạm dễ dùng.
4. **Hành trình Love Score** — cảnh tương tác chính: Hành động → Bằng chứng → Xác minh → Ghi nhận, ánh sáng chạy nối từng bước khi cuộn trang hoặc bấm; bước cuối bừng sáng.
5. **Lịch sử đóng góp** — dựng lại bảng LOVE SCORE 12,450 cùng biểu đồ cột phát sáng, ghi rõ đây là con số minh họa.
6. **Love Score không phải là gì** — bốn điều loại trừ, trình bày bình an, kết bằng câu song ngữ "Love Score ghi nhận đóng góp, không đánh giá giá trị con người".
7. **PureLove Protocol (PLP)** — huy hiệu PLP xoay nhẹ, chỉ dùng đúng thông tin đã có, không thêm khẳng định mới.
8. **Khám phá sâu** — hai hình gốc Love Score ở dạng ảnh nhỏ, bấm để mở xem toàn màn hình, đóng bằng nút X hoặc phím Esc.
9. **Tiếp tục hành trình** — "Trở về FUN COSMOS" và "Khám phá Angel AI".

Chuyển động nhẹ nhàng, tôn trọng cài đặt giảm chuyển động; không tràn ngang trên màn hình nhỏ.

## 4. Hình ảnh

- Cha Vũ Trụ và Angel dùng đúng hai ảnh đã tách nền cha gửi (đưa lên kho ảnh của dự án).
- Hai hình Love Score đầy đủ dùng cho phần khám phá sâu.
- Tờ asset (ảnh thứ ba) đang có **nền trắng, chưa tách nền**. Con sẽ cắt các thành phần cần dùng (PLP, 4 biểu tượng bước, thành phố, pha lê) và tự khử nền trắng. Nếu kết quả viền chưa sạch, con sẽ dùng cách trình bày trong khung tròn/khung kính để vẫn đẹp, và báo lại để cha gửi PNG tách nền riêng nếu có.

## Ghi chú kỹ thuật

- Route mới `src/routes/love-score.tsx` + `love-score-world.css`, tái sử dụng `TopicWorldShell`, `WorldSection`, dialog viewer sẵn có.
- `DeepDiveGallery` hiện hard-code đường dẫn `angel-concept-*`; sẽ mở rộng nhận danh sách ảnh + nhãn để dùng lại cho Love Score (không đổi hành vi trang Angel AI).
- `destinations` trong `topic-world.tsx`: `/#love` → `/love-score`, đánh dấu trang hiện tại theo route thực tế thay vì so sánh cứng với `/angel-ai`.
- Địa chỉ game đặt trong `src/lib/links.ts` (`GAME_URL`), dùng ở trang chủ và topic world; mọi liên kết `target="_blank" rel="noreferrer"`.
- Ảnh mới đưa lên qua `lovable-assets` (pointer `.asset.json`), không thêm file nhị phân vào repo.
- Kiểm tra bằng Playwright ở 1280 và 390: không tràn ngang, không lỗi console, các liên kết điều hướng đúng.
