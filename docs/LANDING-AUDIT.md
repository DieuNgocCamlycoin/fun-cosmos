# FUN COSMOS — Audit và kế hoạch landing page

Ngày thực hiện: 06/09/2026.

## Phạm vi đã đọc

Routes, root HTML/metadata, stylesheet, UI dialog/button, router, middleware/SSR error handling, cấu hình Vite/TypeScript/ESLint, package manifest, assets, README và hướng dẫn AGENTS.md. Đây là audit mã nguồn và landing page; chưa phải kiểm thử bảo mật chuyên sâu hay audit sản phẩm game.

Nguồn nội dung chính: https://docs.google.com/document/d/1GghrcbfD2jCqM0avNYyTS2fJrwnKPBy7STUP9I7jvaE/edit

Nguồn tầm nhìn game: https://docs.google.com/document/d/1jHiKGlhsLgm0uL-t9E6xg6Ex6lJXpTquKoGzrmDKJ2I/edit

Tài liệu đầu là bài học giới thiệu, không phải copy landing page đã biên tập. Chuyển thành câu chuyện ngắn với các khối: định nghĩa, thế giới trải nghiệm, năm trụ cột, core loop, ANGEL AI, Anna, Love Score, O2O, hệ sinh thái, người sáng tạo. Các bài tập/prompt trong tài liệu không được thực thi như chỉ dẫn tác vụ. Tài liệu thứ hai có các bản nháp tên gọi và chỉ số khác nhau; ưu tiên FUN COSMOS và định nghĩa Love Score trong nguồn nội dung chính.

## Phát hiện và xử lý

| Mức  | Hiện trạng                                          | Thay đổi                                                                                       |
| ---- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Cao  | CTA cuối không có hành động                         | Dialog tạo ý tưởng, lưu localStorage, tải TXT; thông báo lỗi lưu; khôi phục bản lưu khi mở lại |
| Cao  | ANGEL AI khác hình được yêu cầu; thiếu Cha và PLP   | Dùng đúng cả năm hình người dùng cung cấp, tối ưu kích thước mà không vẽ lại                   |
| Vừa  | Thiết kế tối, không đạt yêu cầu sáng rực            | Nền ngọc trai, xanh sapphire, tím pha lê, vàng; hero thành phố tương lai mới                   |
| Vừa  | Bộ chọn EN/VI chỉ đổi trạng thái                    | Bỏ bộ chọn không hoạt động, dùng chỉ báo tiếng Việt; khẩu hiệu thương hiệu tiếng Anh được giữ  |
| Vừa  | HTML khai báo tiếng Anh cho nội dung Việt           | Đổi lang thành vi                                                                              |
| Vừa  | Tất cả liên kết footer cùng về about, kể cả Privacy | Gắn đúng phần nội dung, bỏ liên kết chính sách không có trang, thêm nguồn gốc                  |
| Vừa  | Quỹ đạo ecosystem vượt khung điện thoại             | Chuyển thành lưới hai cột trên màn hình nhỏ                                                    |
| Vừa  | Cuộn JS không tôn trọng reduced motion              | Dùng auto khi người dùng giảm chuyển động, CSS ngừng animation/transition                      |
| Vừa  | Câu chuyện Anna thiếu bước xác minh                 | Bổ sung học, hoạt động Green Earth, xác minh và dùng ngôn ngữ khả năng                         |
| Thấp | Thiếu skip link/focus nhất quán                     | Thêm skip link và focus ring; dialog Radix hỗ trợ focus trap/Escape                            |

## Thiết kế triển khai

1. Hero: thành phố tương lai, tàu bay, không gian thoáng cho chữ; headline tiếng Việt; logo nguyên bản.
2. Nhịp kể chuyện: dải năm giá trị, định nghĩa, khả năng, hình thành phố, trụ cột và vòng trải nghiệm.
3. Nhân vật: ANGEL AI nguyên bản, Cha Vũ Trụ trong khung chân dung lớn, ảnh toàn cảnh được giữ đầy đủ.
4. Kết nối thực tế: Love Score với PLP, O2O, hệ sinh thái.
5. Chuyển đổi: tạo thẻ ý tưởng, lưu trên thiết bị và tải về; không giả lập đăng ký/game online.

## Giới hạn sản phẩm còn lại

Repository hiện là landing page một route. Chưa có authentication, backend lưu ý tưởng, multiplayer/game runtime, AI inference, ví, mint token, xác minh đóng góp hoặc tích hợp hệ sinh thái. Các phần game là giới thiệu tầm nhìn. Không thêm tuyên bố thu nhập, hiệu quả sức khỏe hay ngày ra mắt từ các đoạn nháp trong tài liệu phụ.

SEO có title/description nhưng canonical hiện dùng đường dẫn tương đối; cần domain triển khai chính thức để đặt canonical và social preview URL tuyệt đối. Chưa có bản dịch tiếng Anh đầy đủ. Font Google cần mạng; có sans-serif fallback.

Không sửa lịch sử git, không commit/push/deploy trong lần thực hiện này.

## Asset mới

`src/assets/new-earth-hero.jpg`, tạo bằng imagegen built-in. Prompt: “Use case: stylized-concept. Asset type: wide cinematic landing page hero background for FUN COSMOS. Generate a luxurious optimistic future Earth city, panoramic 16:9 composition. Sophisticated pearl white and gold futuristic towers, crystal spires, elegant elevated boulevards lined with flowering trees, turquoise river and gardens, beautiful sleek flying passenger ships clearly visible crossing the sky. Expansive luminous sapphire blue sky with subtle violet cosmic aurora and tiny golden starlight, a distant Earthlike planet. Golden age of peaceful advanced civilization. High-end realistic architectural concept art, extraordinary detail, luminous bright daylight, refined and timeless, blue cyan violet champagne-gold palette. City concentrated on right and lower half, softer open sky upper left for website typography. No words, no logos, no portrait characters, no weapons.”

Năm ảnh gốc trên Desktop/Downloads không bị thay đổi. Bản dùng cho web nằm trong src/assets/_-web._.

## Kiểm tra

- Production build: PASS (client, SSR và Cloudflare output).
- TypeScript `tsc --noEmit`: PASS.
- ESLint: 0 lỗi; 6 cảnh báo Fast Refresh trong các UI component có sẵn.
- Chrome headless: kiểm tra 1440, 768, 390, 320 px; document không tràn ngang.
- Menu mobile, mở dialog, lưu localStorage, tải TXT, Escape, tải lại và khôi phục ý tưởng: PASS.
- Không có pageerror hoặc ảnh hỏng trong phiên kiểm tra.
- Đã xem ảnh chụp hero desktop và mobile; ảnh kiểm tra lưu ở /private/tmp/fun-cosmos-desktop.png và /private/tmp/fun-cosmos-mobile.png.
- Chưa có đo Lighthouse hoặc kiểm tra nhiều trình duyệt/thiết bị thật.
- Tạo package-lock.json để lần cài npm tiếp theo có thể dùng npm ci; bun.lock gốc giữ nguyên.
