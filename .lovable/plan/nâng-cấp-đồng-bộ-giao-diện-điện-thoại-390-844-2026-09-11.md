# Nâng cấp đồng bộ giao diện điện thoại (390×844)

## Đã kiểm tra trên điện thoại
- Trang 1: tiêu đề "CHƠI VŨ TRỤ. SỐNG THIÊN ĐÀNG." đang 42px, xuống tận 4 dòng, cao 252px; ảnh Cha cao 778px gần bằng cả màn hình nên khuôn mặt bị cắt và chữ đè lên râu tóc. Khối chữ + 2 nút + dòng "Từ một ước mơ" làm trang dài, phải cuộn mới thấy hết.
- Thẻ game: ổn, 3 thẻ lướt ngang nhưng không có dấu hiệu nào cho biết còn thẻ phía sau.
- Urantia: có 2 màn liên tiếp gần như trùng nội dung — màn vẽ lại (tiêu đề + 7 hành tinh, cao 792px) và màn danh sách chữ "URANTIA — LỜI MỜI KHÁM PHÁ" (05 mục, cao 828px) — trước khi tới phần ảnh trình chiếu.
- Nhiều khối bị ép dọc trên điện thoại: video FUN COSMOS và các bộ ảnh đều thu nhỏ trong khung hẹp, chữ mô tả chiếm nhiều chỗ hơn chính hình.

## Kế hoạch (chỉ ảnh hưởng điện thoại, máy tính giữ nguyên)

### 1. Trang mở đầu gọn lại
- Giảm cỡ tiêu đề để còn 2–3 dòng, không bị vỡ chữ; rút cỡ dòng mô tả và khoảng cách.
- Ảnh Cha đặt lại: nhỏ hơn, canh sao cho thấy rõ khuôn mặt và bàn tay, không bị chữ đè lên mặt; vẫn tan mềm vào nền.
- Bỏ bớt phần dư ở đáy (dòng "HÀNH TRÌNH BẮT ĐẦU" gộp vào), để cả khối chào mở vừa đúng một màn hình.

### 2. Thẻ thế giới game
- Giữ nguyên thiết kế thẻ và nút vàng.
- Thêm một hàng chấm/thẻ nhỏ ngay dưới dải thẻ, hiện rõ đang ở thẻ nào trong 3 thẻ; bấm vào chấm sẽ trượt tới thẻ đó.

### 3. Sách Urantia
- Xóa màn vẽ lại (tiêu đề lớn + 7 hành tinh) và màn danh sách chữ.
- Chỉ giữ phần ảnh trình chiếu 5 hình, kèm tiêu đề chính "URANTIA" và logo Sách Urantia dẫn sang trang sách.

### 4. Ưu tiên hình và video trên điện thoại
- Các khối bị ép dọc chuyển sang khung ngang đúng tỉ lệ hình, rộng gần hết bề ngang màn hình.
- Rút gọn chữ: chỉ giữ tiêu đề chính và một dòng ngắn theo ảnh; bỏ các đoạn mô tả dài trên điện thoại.
- Thêm nút mở rộng: chạm là hình/video mở toàn màn hình, tự xoay ngang để xem cho đã mắt, có nút đóng; giữ vuốt trái/phải và nút tạm dừng.

### 5. Đồng bộ chung
- Cùng một bề ngang, cùng khoảng cách trên/dưới cho mọi khối; không tràn ngang từ 320px.
- Tôn trọng chế độ giảm chuyển động; các nút đủ lớn để chạm.

## Kỹ thuật
- `src/living.css` (khối `@media (max-width: 700px)`): giảm `font-size` `.lc-hero h1` xuống ~clamp(30px, 8.5vw, 38px), rút `.lc-hero p`, chỉnh `.lc-father` width/`object-position`, ẩn `.lc-scroll` thừa.
- `src/components/game-worlds.tsx` + `cosmos-consolidation.css`: thêm hàng chấm chỉ mục dưới `.gw-track`, đồng bộ với `scroll-snap` bằng `IntersectionObserver`, `aria-current` cho chấm đang chọn.
- `src/routes/index.tsx`: bỏ `<UrantiaCosmosScene />`; đưa tiêu đề + logo Urantia vào `TopicGallery id="urantia-gallery"`.
- `src/components/topic-gallery.tsx` và `cosmos-story-gallery.tsx`: khung `aspect-ratio` 16/10 trên mobile, ẩn khối mô tả dài ở `max-width: 700px`, thêm nút mở rộng dùng `requestFullscreen()` + `screen.orientation.lock('landscape')` (bọc try/catch vì iOS Safari không hỗ trợ, khi đó dùng lớp phủ toàn màn hình xoay bằng CSS).
- `src/components/cosmos-cinema.tsx`: thêm nút mở rộng cho video (`video.requestFullscreen()`, fallback `webkitEnterFullscreen`), giữ nút âm thanh.
- Kiểm tra Playwright ở 320/390/430px và 844/932px chiều cao: không tràn ngang, hero vừa một màn, chấm chỉ mục đúng, Urantia chỉ còn phần ảnh, nút mở rộng hoạt động, không lỗi console.
