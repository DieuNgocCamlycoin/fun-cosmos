# Kế hoạch hiển thị chương trình Your Turn trong một màn hình

## Phạm vi
Chỉ thiết kế lại bảng ảnh **“Ý tưởng của bạn bắt đầu từ đây”** gần cuối trang chủ. Giữ nguyên mục **“Vũ trụ bắt đầu từ ý tưởng của bạn”** đang nằm cuối trang và mọi phần khác.

## Nội dung hiển thị
- Bỏ ảnh giới thiệu Your Turn số 21 khỏi bảng này vì nội dung đã được thể hiện ở mục ngay bên dưới.
- Đưa hai ảnh sau ra hiển thị đồng thời:
  - **5 câu hỏi thảo luận** — ảnh số 26.
  - **99.999 Happy Camly Coin** — ảnh số 27.
- Không dùng trình chiếu luân phiên cho bảng này; người dùng nhìn thấy ngay cả hai chương trình mà không phải bấm chuyển ảnh.

## Bố cục trong một trang
- Desktop: tiêu đề gọn ở trên, hai ảnh đặt cạnh nhau thành hai ô cân đối, vừa chiều rộng và chiều cao còn lại của một màn hình.
- Điện thoại: hai ảnh xếp dọc trong cùng mục, thu theo tỷ lệ để không tràn ngang; ưu tiên nhìn rõ nội dung chính và cho phép mở ảnh lớn để đọc chi tiết.
- Loại bỏ bảng nội dung bên trái, dãy ảnh nhỏ và nút chuyển/tạm dừng không còn cần thiết.
- Giới hạn kích thước theo chiều cao màn hình để mục không bị kéo dài thành nhiều trang hoặc tạo khoảng trống lớn.

## Tham gia chương trình
- Mỗi ảnh có tên rõ ràng và nút hành động riêng:
  - **XEM 5 CÂU HỎI**: mở ảnh lớn để đọc và thảo luận.
  - **THAM GIA 99.999**: chuẩn bị sẵn vị trí nút nhưng chưa điều hướng khi chưa có liên kết chính thức.
- Nút 99.999 hiển thị trạng thái **“Sắp mở”** hoặc tương đương, không tạo liên kết giả. Khi con gửi đường dẫn, chỉ cần gắn link vào nút đã có.
- Toàn bộ ảnh vẫn hỗ trợ mở lớn, điều khiển bằng bàn phím và đóng dễ dàng.

## Kiểm tra
- Desktop 1177×657 và 1440×900: hai ảnh cùng xuất hiện trọn trong một mục, không tràn và không tạo thêm một màn hình thừa.
- Điện thoại 390×844 và 320×568: ảnh, tiêu đề và nút không chồng nhau hoặc tràn ngang; người dùng mở ảnh lớn được.
- Kiểm tra bàn phím, trình đọc màn hình, chế độ giảm chuyển động và lỗi hiển thị.

## Chi tiết kỹ thuật
- Tạo biến thể trình bày hai chương trình dành riêng cho bảng `create-gallery`, không thay đổi Topic Gallery đang dùng ở URANTIA, Love Score và FUN Ecosystem.
- Dùng lại ảnh 26, 27 và trình xem ảnh lớn hiện có; không sao chép ảnh chụp màn hình tham chiếu vào website.
