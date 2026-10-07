# Landing Page Bán Trứng Cào Cào Cốm Giống Chất Lượng Cao

Website landing page chuyên nghiệp, chuẩn chuyển đổi cao (CRO), tối ưu hiển thị mượt mà trên cả thiết bị di động (Mobile) lẫn máy tính (Desktop).

---

## 🌟 Điểm nổi bật & Tính năng vượt trội

1. **Giao diện hiện đại & thẩm mỹ cao:**
   - Gam màu xanh nông nghiệp sinh thái tự nhiên kết hợp cam/vàng mật ong tạo cảm giác uy tín, gần gũi và kích thích mua hàng.
   - Logo thương hiệu vector sắc nét kèm dấu tích xanh xác minh trại giống uy tín.
   - Thiết kế chuẩn Mobile-first, hiển thị mượt mà như một ứng dụng Native trên điện thoại và cân đối trên màn hình lớn.

2. **Khung Video & Thư viện ảnh sống động (Swiper Gallery):**
   - Video cào cào non nở rộ tại trại kèm nút bấm xem trực tiếp, tự động dừng/chạy thông minh khi xem.
   - Toàn bộ hình ảnh thực tế chất lượng cao về phôi trứng mẩy và cào cào xanh non bám kín thùng ấp.

3. **Công cụ tương tác độc quyền - Tính Mật Độ Nuôi Theo Lồng:**
   - Cho phép khách hàng nhập hoặc kéo chọn diện tích lồng (m²).
   - Tự động tính: số lượng trứng giống cần thả (chuẩn 100 trứng/m²), ước tính số con non thu hoạch (~20 con/trứng), quà tặng +10% trứng và gợi ý gói phù hợp kèm nút 1 chạm chốt gói ngay.

4. **Kích thích chuyển đổi mạnh mẽ (Urgency & Social Proof):**
   - Thanh đếm ngược Giờ vàng giá sốc (Flash sale) cập nhật theo thời gian thực.
   - Thanh tiến độ hàng tồn kho "Đã bán 856 / 862 combo (98%)".
   - Popup thông báo đơn hàng ngẫu nhiên mô phỏng khách vừa đặt mua ở các tỉnh thành trên cả nước.

5. **Quy trình đặt hàng 2 bước (2-Step Bottom Sheet):**
   - **Bước 1:** Lựa chọn gói sản phẩm trực quan, tính toán tự động số lượng quà tặng kèm (+10% trứng), cho phép tăng giảm số combo hoặc nhập số lượng sỉ tùy ý (từ 2.500 trứng trở lên @ 1.600đ/trứng).
   - **Bước 2:** Điền thông tin giao hàng với bộ lọc Tỉnh/Thành, Quận/Huyện, Phường/Xã chuẩn Việt Nam (có cơ chế dự phòng hoạt động 100% không lo lỗi mạng).
   - Nút săn mã **FREESHIP** kích thích khách hàng nhận ưu đãi miễn phí vận chuyển 30.000₫.

6. **Các Popup thông minh giữ chân khách:**
   - **Confirm Modal:** Bảng tóm tắt hóa đơn chi tiết trước khi xác nhận đơn.
   - **Forgot Freeship Modal:** Nhắc nhở nếu khách quên bấm lấy mã miễn ship.
   - **Exit Intent Modal:** Giữ chân khách khi có hành vi bấm nút quay lại hoặc rê chuột rời trang.
   - **Success Modal:** Chúc mừng kèm mã đơn hàng và nút kết bạn Zalo nhận video hướng dẫn.

7. **Tích hợp gửi đơn hàng về Google Sheets:**
   - Tự động chuyển toàn bộ dữ liệu đơn (Tên, SĐT, Địa chỉ, Gói hàng, Số lượng, Ghi chú, Tổng tiền) về Google Sheets thông qua Google Apps Script Web App mà không tốn chi phí thuê máy chủ.

---

## 📁 Cấu trúc thư mục

```text
├── index.html          # Trang chủ landing page hoàn chỉnh
├── style.css           # Toàn bộ CSS phong cách hiện đại, responsive
├── script.js           # Xử lý tính toán, popup, slider, form đặt hàng
├── assets/
│   ├── logo.svg        # Logo thương hiệu vector
│   ├── logo.png        # Logo biểu tượng
│   ├── provinces.js    # Dữ liệu danh mục 63 tỉnh thành Việt Nam
│   ├── video.mp4       # Video thực tế cào cào nở tại trại
│   ├── 22.jpg          # Ảnh cào cào non xanh bám kín nắp thùng xốp
│   ├── trung-cao-cao-1.jpg
│   ├── trung-cao-cao-2.jpg
│   ├── trung-cao-cao-3.jpg
│   └── trung-cao-cao-5.jpg
└── README.md
```

---

## ⚙️ Hướng dẫn tùy chỉnh nhanh

### 1. Đổi số Hotline và Zalo
Mở tệp `index.html` và `script.js`, tìm kiếm số điện thoại `0935127132` và thay thế bằng số điện thoại của bạn:
- Link gọi điện: `tel:0935127132`
- Link Zalo: `https://zalo.me/0935127132`

### 2. Đổi URL Google Sheet nhận đơn
Mở tệp `script.js`, dòng chứa:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxR55m-6TAXw8hmAlI4tj5rv9TZIAc7RbyYzWlCgi2RZqtQIUQnrH0WTPhfeEqN3QN4Zw/exec';
```
Thay thế link trên bằng URL Google Apps Script Web App của bạn (nếu có trang tính mới).

---

## 🚀 Cách mở và đưa lên môi trường mạng

- **Xem trực tiếp trên máy tính:** Chỉ cần nhấp đúp vào tệp `index.html` để mở trong trình duyệt Chrome, Safari hoặc Edge.
- **Đưa lên mạng (Host):**
  - Có thể đưa lên **GitHub Pages** (hoàn toàn miễn phí).
  - Hoặc tải cả thư mục này lên hosting CPanel, Netlify, Vercel, Hostinger...
