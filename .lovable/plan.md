# Làm lại cảnh “FUN COSMOS LÀ GÌ?” theo ngôn ngữ Hero đầu trang

## Phạm vi

Chỉ sửa section **FUN COSMOS LÀ GÌ?** ngay sau Urantia. Giữ nguyên Opening Hero, Urantia, header/navigation và toàn bộ Story Gallery, game worlds, Angel AI, Love Score, Ecosystem, Your Turn phía sau.

## Hiện trạng đã xác nhận

- Hero đầu trang đang là một cảnh lớn gần trọn màn hình, artwork phủ toàn bộ section, chữ và CTA nằm trực tiếp trong cảnh, toàn cảnh có bo góc và viền nhẹ.
- Section FUN COSMOS hiện tại đang tách thành ba tầng: tiêu đề bên ngoài, video thấp trong khung riêng, CTA bên dưới; toàn section còn có nền gradient navy.
- Video nguồn là 1920×1080 và hiện đang dùng `object-fit: cover`; ở viewport đang xem, video chỉ cao khoảng 368px trong khi Hero cao khoảng 573px, nên tạo cảm giác banner thay vì một thế giới cinematic.

## Composition mới

```text
Nền vũ trụ chung của trang
╭────────────────────────────────────────────────────────╮
│ Video FUN COSMOS phủ toàn bộ cảnh chuyển động           │
│                                                        │
│ FUN COSMOS LÀ GÌ?                                      │
│ câu giới thiệu ngắn                                    │
│                                                        │
│ Angel          cổng / thế giới trung tâm          Cha  │
│                                                        │
│ [KHÁM PHÁ FUN COSMOS] [CHỌN THẾ GIỚI]        [âm thanh]│
╰────────────────────────────────────────────────────────╯
```

## Thay đổi thiết kế

1. **Biến toàn section thành một cinematic scene**
   - Video là lớp hình nền chuyển động của toàn bộ section, không còn là banner con.
   - Tiêu đề, câu hỗ trợ, CTA và nút âm thanh đều nằm bên trong cùng một khung cảnh.
   - Bỏ nền gradient navy phẳng và khoảng trống phân tầng hiện tại.

2. **Kế thừa ngôn ngữ từ Hero, không sao chép nội dung**
   - Dùng cùng nguyên tắc: cảnh gần trọn viewport, artwork phủ nền, chữ đặt theo negative space, CTA nằm trong cảnh.
   - Khung bao toàn cảnh có viền champagne-gold mảnh, bo góc sang trọng và ánh vàng rất nhẹ.
   - Dùng hệ chữ vàng đúc FUN Money/FUN COSMOS đang được duyệt trên trang.

3. **Bảo vệ bố cục thực của video**
   - Desktop dùng tỉ lệ gần 16:9, chiều cao đủ lớn để đọc như một scene gần trọn màn hình thay vì banner.
   - Chỉ crop nhẹ môi trường ở cạnh hoặc phía dưới khi viewport yêu cầu.
   - Chỉnh `object-position` riêng theo desktop và mobile để luôn giữ khuôn mặt Cha, khuôn mặt Angel, cử chỉ nhân vật và cổng sáng trung tâm.
   - Không bóp méo, kéo giãn hoặc dùng một crop cố định máy móc cho mọi màn hình.

4. **Đặt chữ trực tiếp trên video**
   - Tiêu đề duy nhất: **FUN COSMOS LÀ GÌ?**, giữ một hàng trên desktop.
   - Chỉ giữ câu: “Một thế giới nơi bạn khám phá, học hỏi, sáng tạo và cùng nhau kiến tạo tương lai.”
   - Đặt cụm chữ vào vùng trống an toàn thực tế của video, ưu tiên composition hơn căn giữa.
   - Chỉ dùng text-shadow, vignette cục bộ hoặc lớp kính rất nhẹ đúng phía sau vùng chữ; không làm tối toàn cảnh.

5. **CTA và âm thanh nằm trong scene**
   - Đưa **KHÁM PHÁ FUN COSMOS** và **CHỌN THẾ GIỚI** vào vùng thấp an toàn của video.
   - Giữ liên kết `/cosmos` và cuộn đến `#games` như hiện tại.
   - Giữ nút âm thanh HTML nhỏ ở góc dưới bên phải, không che chi tiết quan trọng.

6. **Responsive theo nội dung video**
   - Desktop: scene gần như vừa một màn hình thông thường bên dưới navigation.
   - Mobile: giữ cảnh rộng và dễ đọc, điều chỉnh vị trí video/chữ/nút theo vùng an toàn; không biến video thành banner thấp và không che mặt nhân vật.
   - Giữ poster tĩnh cho người dùng bật reduced motion.

## Kiểm tra hoàn tất

- So sánh trực tiếp Hero đầu trang và scene mới ở đúng viewport hiện tại để xác nhận cùng ngôn ngữ hình ảnh.
- Kiểm tra desktop và mobile: khuôn mặt Cha/Angel, cổng trung tâm và cử chỉ chính không bị cắt hoặc bị chữ che.
- Xác nhận scene gần trọn màn hình nhưng không tạo một Hero lặp lại; video vẫn sáng, xanh, trắng, vàng và có chiều sâu.
- Kiểm tra hai CTA, nút âm thanh, poster reduced-motion và không tràn ngang.
- Xác nhận không có thay đổi ngoài section FUN COSMOS LÀ GÌ?.