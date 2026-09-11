# Làm lại màn hình mở đầu trên điện thoại theo dạng banner ngang

## Vấn đề hiện tại
Trên điện thoại, khung mở đầu vẫn bị ép cao gần hết màn hình: chữ nằm bên trái, hình Cha bị thu nhỏ và cắt ở mép phải, nên mất bố cục gốc (Cha một bên — cổng ở giữa — chữ một bên).

## Hướng làm mới (chỉ điện thoại, máy tính giữ nguyên)
Xếp ba tầng rõ ràng, cùng bề ngang, khoảng cách đều nhau:

```text
  ┌───────────────────────────────┐
  │ 5D NEW EARTH ROLE-PLAYING GAME│
  │ CHƠI VŨ TRỤ. SỐNG THIÊN ĐÀNG. │  ← tiêu đề vàng, 2–3 hàng
  ├───────────────────────────────┤
  │   [ BANNER NGANG: cổng vũ trụ │  ← khung ngang, bo góc, viền vàng
  │     ở giữa, Cha bên phải ]    │
  ├───────────────────────────────┤
  │  [ PLAY ]  [ FUN COSMOS LÀ GÌ?]│  ← hai nút gọn, cùng hàng
  └───────────────────────────────┘
```

- Banner là một khung ngang (khoảng 16:10) chứa đúng bối cảnh hiện có: nền cổng vũ trụ và hình Cha đặt bên phải, tỉ lệ tự nhiên, không cắt mặt, không kéo dãn. Kích thước vừa phải, không chiếm hết màn hình.
- Tiêu đề đặt phía trên banner, cỡ chữ vừa đọc thoải mái, giữ nguyên kiểu vàng kim.
- Câu mô tả ngắn giữ một dòng nhỏ dưới tiêu đề; bỏ dòng "Từ một ước mơ" trên điện thoại cho gọn.
- Hai nút nằm dưới cùng, cùng cỡ, dễ chạm.

## Đổi nút (áp dụng cả điện thoại và máy tính)
- "Chơi game" → **PLAY**.
- "Khám phá FUN COSMOS" nay dẫn thẳng tới mục **FUN COSMOS LÀ GÌ?** thay vì điểm đến cũ.

## Kỹ thuật
- `src/routes/index.tsx`: nhãn nút đổi thành `PLAY`; nút thứ hai `href="#cosmos-cinema"` (id sẵn có của `CosmosCinema`).
- `src/living.css`, khối cuối `@media (max-width: 700px)`:
  - `.lc-hero` chuyển sang `display:flex; flex-direction:column; min-height:auto` với `gap` đều; bỏ `max-width:66%` của `.lc-hero-copy`.
  - Thêm lớp khung banner: dùng chính `.lc-scene`/`.lc-hero-scene` (nền `--scene`) làm phần tử tĩnh trong luồng với `aspect-ratio:16/10`, `border-radius`, viền champagne, `background-size:cover; background-position:center`.
  - `.lc-father` chuyển từ `position:absolute` toàn section sang định vị tuyệt đối *bên trong* khung banner, `right:2%`, `height:100%`, `object-fit:contain; object-position:right bottom`.
  - `.lc-hero-note`, `.lc-scroll` ẩn; `.lc-actions` thành hàng ngang `grid-template-columns:1fr 1fr`, nút cao 44px, chữ ngắn.
  - Giữ `.lc-stars`, `.lc-portal-aura`, `.lc-crystals` ở mức trang trí nhẹ hoặc ẩn nếu chồng lấn.
- Kiểm tra Playwright ở 320/390/430px: không tràn ngang, banner đúng tỉ lệ ngang, mặt Cha hiện rõ, hai nút đúng nhãn/liên kết, cuộn tới `#cosmos-cinema` hoạt động, không lỗi console; kiểm tra lại desktop 1440px không đổi.
