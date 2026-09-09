# FUN COSMOS — Nâng cấp Home điện ảnh (gộp phần FUN COSMOS)

## Báo cáo khảo sát nhanh

1. **Các mục sẽ gộp vào một Story Gallery** — chín khối FUN COSMOS hiện có trong `src/components/cosmos-contents.ts`: FUN COSMOS là gì, Không chỉ là một trò chơi, Người chơi có thể làm gì, Game–Real Life/Anna, Core Idea, Core Loop, Năm trụ cột, O2O, FUN COSMOS thu hút vì điều gì — cộng thêm tác phẩm mở đầu "Hành trình trở về". Hiện mỗi mục là một section dọc riêng; toàn bộ hình ảnh được giữ nguyên, không chuyển thành card hay đoạn chữ.
2. **Thành phần tái sử dụng** — `TopicGallery` hiện có (tự chuyển, vạch tiến trình vàng, thumbnail, vuốt, nút tạm dừng) và `ArtworkViewer` (phóng to xem ảnh) đã đủ dùng. Gallery mới được dựng trên nền này, mở rộng để mang tiêu đề theo từng ảnh — không làm một viewer mới.
3. **Video** — dùng `Fun_Cosmos_HERO_202609091213.mp4` cho phần FUN COSMOS điện ảnh. Có thêm một file `VD.mp4` nữa; chưa dùng trừ khi cha nói nó thuộc về đâu.
4. **Ảnh bìa game** — đã có bìa Kingdom Hotel và FUN CITY & BEACH. Ảnh bìa Camly Coin Adventure chưa có trong lần gửi này, nên con tạm dùng tác phẩm Camly đã duyệt sẵn trong dự án (cảnh mini game 99.999 Happy Camly Coin) làm bìa. Khi nào cha gửi bìa thật, con thay ngay.
5. **Link game thật** — Kingdom Hotel: funkingdom.itch.io/funcosmos10d · City & Beach: funkingdom.itch.io/funcosmos5d · Camly/Treasure City: fun-cosmos.pages.dev. Không tự bịa link.
6. **Giữ nguyên tuyệt đối** — Hero mở đầu, phần Urantia và gallery Urantia, cơ chế header ẩn khi cuộn xuống/hiện khi cuộn lên, Angel AI, Love Score, FUN Ecosystem, Your Turn và mọi route khác.

## Nhịp trang Home mới

```text
01 Hero mở đầu            (giữ nguyên)
02 Urantia                (giữ nguyên)
03 Sân khấu video FUN COSMOS điện ảnh   (mới)
04 Khám phá FUN COSMOS — một Story Gallery duy nhất   (thay cho 9 section chồng nhau)
05 Chọn thế giới — 3 bìa game   (mới, thay khối "games" chỉ có chữ)
06 Angel AI · 07 Love Score · 08 Ecosystem · 09 Your Turn  (giữ nguyên)
10 CTA / cổng cuối trang  (theo hướng hiện có)
```

## 03 — Sân khấu video điện ảnh

Sân khấu căn giữa, rộng tối đa khoảng 90vw và cao khoảng 66vh trên máy tính, xung quanh là khoảng thở vũ trụ, viền vàng mảnh và quầng sáng nhẹ. Video tự phát ở chế độ tắt tiếng, lặp vô hạn, phát inline, không thanh điều khiển mặc định của trình duyệt, `object-fit: cover` với điểm lấy nét tinh chỉnh theo từng mức màn hình. Nút bật/tắt âm thanh nhỏ, tinh tế ở một góc (HTML thật, dùng được bằng bàn phím). Với chế độ giảm chuyển động hoặc khi không tự phát được: hiển thị một khung hình tĩnh lấy từ video.

Chữ phủ lên video bằng HTML, giữ ngôn ngữ tiêu đề vàng kim loại đã duyệt:
dòng mở đầu `5D NEW EARTH ROLE-PLAYING GAME`, tiêu đề `CHƠI VŨ TRỤ. / SỐNG THIÊN ĐÀNG.`, một câu hỗ trợ ngắn, nút chính `KHÁM PHÁ FUN COSMOS` → `/cosmos`, nút phụ `CHƠI NGAY` → giữ hành vi vào game hiện tại.

## 04 — Khám phá FUN COSMOS: một Story Gallery duy nhất

Một sân khấu kể chuyện thống trị: ảnh infographic lớn đang chọn, dải thumbnail, chỉ số vị trí, nút qua/lại, vạch tiến trình vàng, chuyển cảnh chậm kiểu ánh sáng với ảnh cũ lùi nhẹ và mờ dần. Tự chuyển tiếp như hiện tại và tạm dừng sau khi người xem tương tác trực tiếp; nút tạm dừng được giữ. Bên cạnh tác phẩm chỉ có tiêu đề chương cộng một câu ngắn — không gõ lại nội dung trong ảnh. Bấm vào ảnh mở trình xem phóng to hiện có. Hỗ trợ phím mũi tên và vuốt trên di động.

## 05 — Chọn thế giới bạn muốn bước vào

Tiêu đề `CHỌN THẾ GIỚI BẠN MUỐN BƯỚC VÀO`, một câu phụ. Trên máy tính: ba bìa xếp thành một hàng ngang bằng nhau, hình bìa là nhân vật chính, không card trắng. Khi rê/chọn: cánh cổng được chọn nhô nhẹ về phía trước, viền phát sáng và quầng sáng phản hồi, hai bìa còn lại lùi nhẹ, mô tả và nút CTA hiện rõ hơn.

- Kingdom Hotel — Bé Trí — tham quan và khám phá thế giới khách sạn trong mơ — `BƯỚC VÀO KINGDOM HOTEL`
- FUN City & Beach — Bé Trí — thay đổi trang phục, phong cách thời trang không giới hạn, tham quan thành phố và biển — `KHÁM PHÁ CITY & BEACH`
- Camly Coin Adventure — Bé Hoàng — khám phá thành phố và sưu tầm Camly Coin — `BẮT ĐẦU CAMLY COIN ADVENTURE`

Mỗi CTA mở link game thật trong tab mới. Website không làm đăng ký/đăng nhập — game giữ nguyên luồng riêng.

Trên di động: một bìa mỗi lần, vuốt ngang có điểm dừng, phần bìa kế lộ nhẹ, chấm báo vị trí, CTA to dễ bấm.

## Ghi chú kỹ thuật

- File mới: `src/components/cosmos-cinema.tsx` + css (sân khấu video), `src/components/cosmos-story-gallery.tsx` + css (dựng trên `TopicGallery`/`ArtworkViewer`), `src/components/game-worlds.tsx` + css.
- `src/routes/index.tsx`: gỡ chín section từ `cosmosContents` và khối `#games` hiện tại, chèn các phần 03–05. Neo chương `about` và `games` được giữ để menu header hoạt động như cũ.
- Video, logo và hai bìa game đưa lên CDN qua `lovable-assets` (file con trỏ `.asset.json`), không để file nặng trong repo.
- Chuyển động chỉ bằng CSS (transform/opacity), không thêm Three.js/GSAP, tôn trọng reduced-motion, lazy-load ảnh ngoài màn hình.
