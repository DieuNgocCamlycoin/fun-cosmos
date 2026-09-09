# Kế hoạch nâng cấp “Khám phá FUN COSMOS” theo thiết kế Urantia

## Phạm vi
Chỉ chỉnh section **KHÁM PHÁ FUN COSMOS**. Không thay đổi Hero, Urantia, video FUN COSMOS, thanh điều hướng hoặc các section phía dưới.

## Bố cục mới
- Tái sử dụng đúng ngôn ngữ thiết kế và tỷ lệ của gallery Urantia: một bảng nội dung kính sapphire, một khung ảnh lớn viền vàng, hàng thumbnail nhỏ phía dưới ảnh.
- Đảo vị trí để tạo khác biệt: **ảnh lớn bên trái, bảng nội dung bên phải** trên desktop.
- Bảng bên phải gồm tiêu đề vàng `KHÁM PHÁ FUN COSMOS`, danh sách 12 chủ đề có số thứ tự, trạng thái đang chọn màu pearl/gold và mô tả ngắn phía dưới.
- Danh sách 12 mục có vùng cuộn gọn bên trong để giữ section gần một màn hình, không kéo trang quá dài.
- Ảnh infographic luôn hiển thị trọn vẹn bằng `contain`, không crop và không chèn chữ lên artwork.
- Giữ khung ảnh, bo góc, viền champagne-gold, độ trong và chiều sâu giống Urantia; loại bỏ quầng chữ rời rạc hiện tại.

## Điều khiển và chuyển động
- Đưa pause/play và next lên góc trên phải của khung ảnh như Urantia.
- Khôi phục dải thumbnail phía dưới; thumbnail đang chọn có viền vàng rõ ràng.
- Autoplay 5 giây, tạm dừng khi tương tác, khi gallery ngoài màn hình, khi mở ảnh lớn hoặc khi bật reduced motion.
- Chuyển slide theo hướng ngược Urantia: ảnh mới đi từ trái vào, ảnh cũ trượt sang phải, kết hợp fade và depth nhẹ; không bounce hoặc zoom mạnh.
- Giữ bàn phím, swipe trên điện thoại và khả năng mở ảnh lớn.

## Mobile
- Xếp ảnh lớn trước, bảng nội dung sau.
- Danh sách chủ đề chuyển thành dải chọn ngang gọn để không chiếm quá nhiều chiều cao.
- Thumbnail cuộn ngang, controls nằm trên ảnh, không tràn màn hình từ 320px.

## Kiểm tra
- So sánh trực quan hai section để xác nhận cùng ngôn ngữ thiết kế nhưng bố cục đối xứng.
- Kiểm tra desktop và mobile: ảnh không crop, danh sách/thumbnail sử dụng được, autoplay/pause/swipe/bàn phím hoạt động, không tràn ngang và không lỗi hiển thị.
