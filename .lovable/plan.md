# Chỉnh mục "CHỌN THẾ GIỚI BẠN MUỐN BƯỚC VÀO"

## Phạm vi
Chỉ sửa mục ba thế giới game. Giữ nguyên Hero, Urantia, video FUN COSMOS, Khám phá FUN COSMOS, Angel AI, Love Score, Ecosystem, Your Turn, header/footer.

## Thay ảnh
- Thay ba ảnh bìa bằng ba ảnh mới vừa gửi (Kingdom Hotel, Fun City & Beach, Fun Treasure City), tỷ lệ ảnh mới gần 4:5 thay vì ảnh dọc rất cao hiện tại.
- Đưa ảnh lên kho ảnh CDN của dự án, không để file nặng trong mã nguồn.
- Ảnh hiển thị trọn tiêu đề game phía trên, không bị cắt mất chữ vàng.

## Căn chỉnh cho vừa một màn hình
- Khung mỗi ảnh chuyển sang tỷ lệ 4:5, bỏ chiều cao tối thiểu quá lớn hiện nay.
- Tiêu đề mục, ba ảnh và nút bấm cùng nằm gọn trong một màn hình desktop, dưới thanh điều hướng; không còn khoảng trắng thừa hai bên hay phải cuộn nhiều lần.
- Chiều cao ba ảnh tự co theo chiều cao màn hình, có giới hạn nhỏ nhất và lớn nhất để không bị bé quá.
- Chữ mô tả và tên người sáng tạo trong lớp phủ thu gọn tương ứng để không che phần đẹp của ảnh.

## Điện thoại
- Ba ảnh vẫn lướt ngang từng thẻ như hiện tại, chiều rộng vừa màn hình, không tràn ngang từ 320px.

## Giữ nguyên
- Nút chơi kim loại vàng trên ảnh giữ đúng thiết kế và chữ hiện tại, chỉ đổi kích thước nếu cần cho vừa khung.
- Ba đường dẫn game không đổi.

## Kỹ thuật
- `src/components/game-worlds.tsx`: đổi nguồn ảnh sang pointer `.asset.json` mới, cập nhật `width`/`height`.
- `src/components/cosmos-consolidation.css`: đổi `aspect-ratio` `.gw-world` sang `4/5`, bỏ/giảm `min-height`, đặt chiều cao theo `svh` với `clamp`, giảm padding mục và cỡ tiêu đề để mục vừa một viewport.
- Kiểm tra desktop và mobile bằng Playwright: không tràn ngang, mục vừa màn hình, ảnh không cắt tiêu đề.
