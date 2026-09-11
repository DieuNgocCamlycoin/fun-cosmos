# Kế hoạch: phóng lớn Cha trong hero Love Score + tối ưu mobile

## Phạm vi
Chỉ chỉnh hình Cha và tinh chỉnh hero Love Score trên điện thoại. Không thay nền, Angel, chữ, CTA, đầu trang hay các phần bên dưới.

## Thay đổi

### Cha lớn hơn, chạm viền trái khung
- Tăng kích thước khối Cha (`.ls-figure.ls-father`) lên rõ rệt so với hiện tại (max-width 470px), cho Cha tràn sát và chạm viền trái của khung hero thay vì đứng gọn trong cột lưới.
- Dùng căn chỉnh tràn trái (canh về mép trái section, có thể kéo nhẹ ra ngoài lưới) để Cha trở thành nhân vật lớn thật sự, cân xứng với Angel bên phải.
- Giữ nguyên ảnh gốc, khuôn mặt, tay, quyền trượng; giữ mép áo choàng tan mềm vào mây như hiện tại, không lộ chân, không méo hình.
- Đảm bảo Cha lớn hơn không đè lên tiêu đề LOVE SCORE và cổng trung tâm ở mức khó chịu; vẫn nằm dưới lớp chữ (z-index hợp lý).

### Tối ưu hero trên điện thoại
- Nút vàng "Bước vào thế giới" to hơn: chữ lớn hơn, vùng bấm rộng, dễ chạm.
- Tiêu đề LOVE SCORE rõ ràng, cỡ chữ phù hợp màn nhỏ, không bị chật.
- Kiểm tra toàn bộ hero không tràn ngang, không phải cuộn lên xuống mới thấy hết nội dung chính; Cha và Angel vẫn đẹp ở bố cục xếp dưới chữ như hiện tại.

## Kiểm tra
- Playwright desktop: Cha lớn chạm viền trái, không che mất tiêu đề, không tràn trang.
- Playwright mobile (390px): nút vàng lớn dễ bấm, tiêu đề rõ, overflow ngang = 0.
