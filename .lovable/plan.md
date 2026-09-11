# Kế hoạch: Đưa mục "Chọn thế giới bạn muốn bước vào" lên vị trí thứ 2

## Mục tiêu
Sắp xếp lại thứ tự các cảnh trên trang chủ: ngay sau Hero mở đầu là mục chọn 3 thế giới game (KINGDOM HOTEL ở giữa), sau đó mới đến Urantia và các phần còn lại giữ nguyên thứ tự hiện tại.

## Thứ tự mới
1. Hero mở đầu — giữ nguyên
2. **CHỌN THẾ GIỚI BẠN MUỐN BƯỚC VÀO** (3 thẻ game) — di chuyển lên đây
3. Urantia (cảnh vũ trụ + bộ ảnh Sách Urantia) — lùi từ vị trí 2 xuống 3
4. Video cinematic "FUN COSMOS LÀ GÌ?"
5. Khám phá FUN COSMOS (bộ infographic)
6. Angel AI
7. Love Score
8. FUN Ecosystem
9. Your Turn / CTA cuối
Tất cả các phần từ 4 trở đi giữ nguyên nội dung, thiết kế và thứ tự tương đối như hiện tại.

## Cách làm (kỹ thuật)
- Trong `src/routes/index.tsx`, di chuyển thẻ `<GameWorlds />` từ sau `<CosmosStoryGallery />` lên ngay sau phần Hero (trước `<UrantiaCosmosScene />`).
- Không sửa bất kỳ component, CSS, nội dung hay liên kết nào — chỉ đổi vị trí một dòng.
- Kiểm tra lại bằng Playwright: thứ tự section trên desktop và mobile đúng, không tràn ngang, không lỗi console; ba nút game vẫn mở đúng liên kết.
