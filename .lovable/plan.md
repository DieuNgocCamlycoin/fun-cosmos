# Căn chỉnh mục "CHỌN THẾ GIỚI BẠN MUỐN BƯỚC VÀO"

## Tình trạng đã đo trên preview (1170×657)
- Khung tiêu đề bị chặn ngang 950px, trong khi hàng chữ thật cần 967px. Phần chữ vượt ra ngoài khung không được tô lớp vàng kim, nên đuôi "VÀO" bị mất màu và hàng chữ trông lệch.
- Khoảng từ tiêu đề xuống thẻ: 21px. Khe giữa các thẻ: 22px — cả hai đang sát.
- KINGDOM HOTEL đang đứng ở vị trí đầu tiên (trái).

## Thay đổi
1. **Tiêu đề căn giữa tuyệt đối, đều màu**: bỏ giới hạn 950px, để khung chữ ôm đúng bề rộng hàng chữ. Nhờ đó chữ "VÀO" nằm trọn trong vùng tô vàng kim, hai bên trái/phải cân nhau. Giữ nguyên cỡ chữ và kiểu kim loại hiện tại; màn hình hẹp vẫn tự xuống dòng và căn giữa.
2. **Nới khoảng cách**: tiêu đề → thẻ tăng lên khoảng 40–52px; khe giữa các thẻ tăng lên khoảng 32–40px trên máy tính, 20px trên điện thoại.
3. **Đổi chỗ thẻ KINGDOM HOTEL vào giữa**: thứ tự mới là FUN CITY & BEACH — KINGDOM HOTEL — FUN TREASURE CITY. Ảnh, tên, nút và link của từng game giữ nguyên hoàn toàn.
4. **Vẫn gọn trong một màn hình**: chiều cao thẻ và bề rộng dải thẻ được tính lại theo khe mới để không phải kéo lên xuống, không tràn ngang.
5. Các section khác (Hero, Urantia, video FUN COSMOS, Khám phá FUN COSMOS, Angel AI, Love Score, Ecosystem, Your Turn, header/footer) không đụng tới.

## Kỹ thuật
- `src/components/game-worlds.tsx`: đổi thứ tự mảng `games` (KINGDOM HOTEL xuống phần tử thứ hai).
- `src/components/cosmos-consolidation.css` (khối Game Worlds):
  - `.gw-heading { max-width: none; width: 100%; text-align: center; margin-bottom: clamp(30px, 4vw, 52px); }`
  - `.gw-heading h2 { display: inline-block; white-space: nowrap; }` (dưới 1100px: `white-space: normal`)
  - thêm `--gw-gap: clamp(28px, 3vw, 40px)`; `.gw-track { gap: var(--gw-gap); max-width: min(1240px, calc((100svh - var(--lc-nav-height) - 190px) * 0.775 * 3 + 2 * var(--gw-gap))); }`
  - `.gw-world { height: clamp(380px, calc(100svh - var(--lc-nav-height) - 190px), 700px); }`
  - mobile: `--gw-gap: 20px`.
- Kiểm tra bằng Playwright ở 1170×657, 1440×900 và 390×844: tiêu đề căn giữa đều, "VÀO" có màu vàng kim, KINGDOM HOTEL ở giữa, ba nút mở đúng link, không tràn ngang, không lỗi.
