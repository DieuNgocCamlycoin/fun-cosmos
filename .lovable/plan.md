# Tinh chỉnh cảnh video và Cinematic Story Gallery FUN COSMOS

## Phạm vi

Chỉ nâng cấp hai section mới của FUN COSMOS: cảnh video “FUN COSMOS LÀ GÌ?” và bộ infographic ngay sau đó. Giữ nguyên Hero mở đầu, Urantia, navigation/header, game portals và toàn bộ các section còn lại.

## 1. Hoàn thiện cảnh video “FUN COSMOS LÀ GÌ?”

- Mở rộng khung video thêm theo chiều ngang và chiều cao để hình ảnh đã mắt hơn, nhưng luôn giữ đúng 16:9, không kéo méo và không cắt đầu Cha.
- Tận dụng tối đa vùng nhìn dưới navigation, giảm khoảng trống ngoài khung và vẫn giữ cảnh gọn trong màn hình desktop thông thường.
- Giữ viền champagne-gold mảnh; bổ sung ánh sáng chạy rất nhẹ trên viền để cảnh sinh động hơn, không dùng hiệu ứng neon hoặc nền navy riêng.
- Thêm lại dòng `5D NEW EARTH ROLE-PLAYING GAME` phía trên tiêu đề, nhỏ và tinh tế.
- Giữ `FUN COSMOS LÀ GÌ?` trên một hàng ở desktop. Làm màu vàng kim ổn định ở mọi mức zoom, thêm màu dự phòng và khoảng thở cho nét chữ để phần `Ì?` không bị rỗng hoặc cắt.
- Tăng cỡ câu “Một thế giới…” và đặt trong một nền kính tối mỏng chỉ vừa quanh chữ để dễ đọc. Chủ động ngắt thành hai dòng cân đối thay vì một dòng dài và một dòng chỉ còn vài chữ.
- Giữ hai nút kim loại gọn; có thể hạ thấp nhẹ để nhường không gian cho câu mô tả và tránh Angel.
- Giữ nút âm thanh tại góc dưới bên phải và ảnh tĩnh khi người dùng bật chế độ giảm chuyển động.

## 2. Nâng cấp bộ infographic thành Cinematic Story Gallery

### Bố cục desktop

- Biến section hiện đang cao hơn một màn hình thành một bố cục ngang gần trọn một viewport: infographic khoảng 70% bên trái, nội dung khoảng 30% bên phải.
- Bỏ phần tiêu đề lớn nằm phía trên, hàng progress riêng và dải 12 thumbnail phía dưới để không lãng phí chiều cao.
- Không tạo card, panel nội dung hoặc nền gradient/navy riêng; toàn bộ section hòa vào nền cosmic đang có.

### Infographic và nội dung đồng bộ

- Giữ đủ 12 infographic hiện có, hiển thị bằng `object-fit: contain`, không crop và không đặt chữ website lên nội dung ảnh.
- Phần phải dùng tiêu đề chính `KHÁM PHÁ FUN COSMOS` trên một hàng ở desktop.
- Bên dưới hiển thị số dạng `03 / 12`, tiêu đề riêng của infographic đang chọn và tối đa 1–3 dòng giải thích ngắn từ nội dung hiện có.
- Khi đổi ảnh, số thứ tự, tiêu đề và mô tả đổi đồng bộ bằng crossfade nhẹ.
- Giữ khả năng mở ảnh lớn hiện có để người dùng đọc chi tiết.

### Progress và điều khiển

- Tích hợp progress trực tiếp vào viền dưới của khung ảnh; đường champagne-gold mảnh chạy liên tục theo chu kỳ hiện tại.
- Gắn ba nút tròn nhỏ `trước / tạm dừng hoặc tiếp tục / sau` ở góc dưới bên phải trên ảnh, với nền kính nhẹ và vùng tương phản cục bộ để không che nội dung quan trọng.
- Không tạo thêm hàng điều khiển. Thao tác thủ công tiếp tục tạm dừng chu kỳ tự động trong tám giây rồi mới chạy tiếp.

### Chuyển động và mobile

- Ảnh cũ mờ và lùi chiều sâu rất nhẹ; ảnh mới fade/depth-in nhẹ. Không bounce, xoay hoặc zoom mạnh.
- Mobile chuyển thành infographic phía trên, tiêu đề/số/nội dung ngắn phía dưới; progress vẫn nằm trên viền ảnh và controls vẫn overlay.
- Giữ vuốt trái/phải, bàn phím, trạng thái tạm dừng, dừng khi section ra ngoài màn hình và tôn trọng reduced motion.

## Kiểm tra hoàn tất

- Kiểm tra video ở kích thước màn hình hiện tại và các mức zoom phổ biến: đúng 16:9, thấy trọn đầu Cha, chữ `GÌ?` luôn có màu và không bị cắt.
- Kiểm tra câu mô tả dễ đọc, xuống dòng cân đối; hai nút và sound control không che Angel hoặc nội dung chính.
- Kiểm tra gallery desktop gần như nằm gọn trong một viewport, ảnh là phần lớn nhất và không còn hàng thumbnail/progress riêng.
- Kiểm tra đủ 12 ảnh, ảnh không crop, số/tiêu đề/mô tả chuyển đồng bộ, autoplay/pause/next/previous/zoom/swipe/keyboard hoạt động.
- Kiểm tra desktop và mobile không tràn ngang, không lỗi hiển thị và không thay đổi các section ngoài phạm vi.
