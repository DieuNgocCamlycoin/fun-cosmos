# FUN COSMOS — Vũ trụ điện ảnh sống động từ 27 chương

## Hướng thiết kế đã chọn
- Phát triển theo bản **Vũ trụ điện ảnh tương phản**: bố cục mạnh, chữ lớn, hình ảnh có chiều sâu, tiến trình 27 chương rõ ràng.
- Giữ bảng **Aurora Celestial**: `#09164A`, `#2575E6`, `#7668D8`, `#CFF7FF`, `#E2C57A`; nền sapphire sâu thay cho nền đen đặc.
- Dùng **Space Grotesk** cho tiêu đề và **DM Sans** cho nội dung.
- Cảm giác xuyên suốt: cao cấp, điện ảnh, thông minh, hy vọng; không trẻ con, không cyberpunk tối, không neon tím hồng gắt.

## Trải nghiệm tổng thể
- Giữ đủ **27 hình** làm 27 cánh cổng/chương chính, nhưng không còn là một danh sách ảnh tĩnh.
- Mỗi chương có bố cục riêng theo nội dung: hình chính, số chương, tiêu đề ngắn, câu dẫn ngắn, nhãn chủ đề và chi tiết minh họa chuyển động.
- Các chương nối nhau bằng đường ánh sáng, quỹ đạo, bụi sao và chuyển cảnh để tạo cảm giác đang đi xuyên qua một vũ trụ sống.
- Xen giữa các cụm chương là các cảnh tương tác nổi bật: 5 trụ cột, Core Loop, Angel AI, Anna’s Journey, Love Score, O2O, FUN Ecosystem và Your Turn.

## Thanh điều hướng hai dòng
- **Dòng 1:** logo FUN COSMOS, tên thương hiệu, bộ đếm chương hiện tại, nút mở hành trình và menu trên điện thoại.
- **Dòng 2:** các chủ đề được gom theo nội dung, không lặp tiêu đề khi hai hình cùng chủ đề:
  - Khởi nguồn
  - FUN COSMOS
  - Khám phá & Sáng tạo
  - 5 Trụ cột
  - Core Loop
  - Angel AI
  - Anna’s Journey
  - Love Score
  - O2O
  - FUN Ecosystem
  - Your Turn
- Bấm tên chủ đề sẽ cuộn chính xác tới chương tương ứng; mục đang xem được phát sáng và thanh tiến trình cập nhật theo cuộn.

## Thiết kế 27 chương
- Mỗi hình được dùng đúng một lần và vẫn nhìn thấy rõ nội dung gốc.
- Không lặp lại toàn bộ chữ đã có sẵn trong hình; chỉ bổ sung tiêu đề chương, câu dẫn hoặc điểm nhấn ngắn để tăng nhịp kể.
- Luân phiên ba kiểu dàn cảnh trong cùng một ngôn ngữ thiết kế:
  1. Chữ lớn bên trái, hình điện ảnh bên phải.
  2. Hình tràn rộng như cổng không gian, chữ nổi ở lớp trước.
  3. Hình trung tâm với các quỹ đạo/thành phần nhỏ chuyển động xung quanh.
- Các hình có nội dung gần nhau được nối thành một phân cảnh liền mạch thay vì hai phần rời rạc.

## Chuyển động và tách lớp hình ảnh
- Với 27 hình phẳng hiện tại: tạo chiều sâu bằng chuyển động nhiều lớp quanh ảnh—sao, ánh sáng, quỹ đạo, viền khúc xạ, lớp sương và các chi tiết nổi được dựng lại từ giao diện.
- Có thể cắt riêng một số vùng nổi bật của hình để tạo parallax nhẹ khi đủ rõ và không làm giảm chất lượng.
- Để tách chính xác nhân vật, biểu tượng hoặc vật thể bên trong ảnh và cho chúng chuyển động độc lập, cần file gốc có layer hoặc PNG nền trong suốt. Khi cha gửi, con sẽ đặt chúng vào đúng chương.
- Chuyển động gồm: drift chậm, orbital motion, reveal khi cuộn, pointer parallax nhẹ và ánh sáng quét; giảm hoặc tắt khi thiết bị yêu cầu reduced motion.

## Hệ sinh thái hành tinh
- FUN COSMOS là hành tinh/trung tâm ánh sáng chính.
- Logo các platform được đặt thành các hành tinh/vệ tinh trên nhiều quỹ đạo, có kích thước và tốc độ khác nhau.
- Khi rê hoặc chạm: hành tinh nổi sáng, hiện tên và vai trò; bấm sẽ dẫn đến phần tương ứng hoặc đường dẫn được cung cấp.
- Trên điện thoại, quỹ đạo chuyển thành bản đồ thiên hà dọc dễ đọc và dễ chạm.

## Nội dung và nguyên tắc
- Giữ tinh thần **FUN first**: khám phá, sáng tạo, thử, sai và phát triển.
- Angel AI là người bạn đồng hành, không kiểm soát người chơi.
- Love Score chỉ ghi nhận đóng góp tích cực đã xác minh; không đánh giá linh hồn, mức giác ngộ hay giá trị con người.
- Nội dung bổ sung sẽ ngắn, giàu cảm xúc và không biến trang thành bài giảng.

## Tối ưu và kiểm tra
- Tải trước hai cảnh đầu; các hình và lớp chuyển động phía sau tải theo tiến trình cuộn.
- Chỉ dùng chuyển động nhẹ, ưu tiên CSS và hiệu ứng con trỏ tiết chế để giữ độ mượt.
- Kiểm tra tại màn hình lớn và điện thoại từ 320px: không tràn ngang, không che chữ, thanh hai dòng dễ dùng, các liên kết cuộn đúng, 27 hình tải đủ và không có lỗi.
- Giữ metadata tìm kiếm/chia sẻ riêng cho trang FUN COSMOS và mô tả ảnh đầy đủ.

## Tư liệu cha cần gửi thêm
- Logo từng platform, ưu tiên PNG nền trong suốt hoặc SVG; kèm **tên platform** và **đường dẫn khi bấm**.
- Nhân vật, hành tinh, biểu tượng hoặc vật thể muốn chuyển động riêng; ưu tiên PNG trong suốt hoặc file thiết kế có layer.
- Nếu có: logo FUN COSMOS bản nét cao, nhạc nền/video ngắn, và thứ tự ưu tiên của các platform quanh hệ sinh thái.
- Nếu chưa gửi đủ, con vẫn dựng trước toàn bộ cấu trúc và để sẵn vị trí thay thế; sau đó gắn asset thật mà không đổi bố cục.
