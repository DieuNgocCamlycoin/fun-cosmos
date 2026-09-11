# Làm lại mục "CHỌN THẾ GIỚI BẠN MUỐN BƯỚC VÀO"

## Phạm vi
Chỉ sửa mục ba thẻ game (Game Worlds). Giữ nguyên Hero, Urantia, video FUN COSMOS, Khám phá FUN COSMOS, Angel AI, Love Score, Ecosystem, Your Turn, header/footer.

## Tiêu đề
- Xóa dòng nhỏ "05 · CHOOSE YOUR WORLD".
- Tiêu đề "CHỌN THẾ GIỚI BẠN MUỐN BƯỚC VÀO" viết liền một hàng ngang, chữ vàng kim lớn; tự xuống dòng trên màn hình hẹp.

## Ba thẻ game
- Phóng to thẻ hơn hiện tại, kéo giãn chiều cao để thẻ nổi bật, vẫn gọn trong một màn hình desktop.
- Xóa toàn bộ chữ phủ trên ảnh (dòng "Sáng tạo bởi...", tên game, mô tả) vì trên hình đã có sẵn — nhân vật trong ảnh không còn bị che.
- Ảnh hiển thị nguyên vẹn, không cắt tiêu đề game trong hình.

## Hiệu ứng động
- Thêm quầng sáng vàng nhẹ quanh viền thẻ (glow champagne).
- Đưa chuột/chạm vào thẻ nào: thẻ đó nổi lên (phóng nhẹ, sáng hơn, viền sáng mạnh hơn), hai thẻ còn lại dịu xuống.
- Chuyển động mượt; tôn trọng chế độ giảm chuyển động (reduced motion thì tắt hiệu ứng).
- Nút chơi kim loại vàng giữ nguyên thiết kế hiện tại, đặt ở đáy thẻ; bấm vẫn mở đúng ba link game hiện có.

## Điện thoại
- Ba thẻ vẫn lướt ngang từng thẻ, rộng vừa màn hình, không tràn ngang từ 320px.

## Kỹ thuật
- `src/components/game-worlds.tsx`: bỏ dòng eyebrow, gộp tiêu đề một hàng, bỏ khối chữ overlay trên ảnh (giữ nút CTA).
- `src/components/cosmos-consolidation.css`: tăng kích thước `.gw-world`, thêm glow viền, hiệu ứng hover/focus nổi bật, `@media (prefers-reduced-motion: reduce)` tắt hiệu ứng.
- Kiểm tra bằng Playwright desktop và mobile: không tràn ngang, mục vừa màn hình, hover nổi bật đúng, nút mở đúng link.
