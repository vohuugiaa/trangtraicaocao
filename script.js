document.addEventListener('DOMContentLoaded', function() {
    
    // Khởi tạo Swiper (Image Carousel)
    var swiper = new Swiper(".mySwiper", {
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });

    // -------- LOGIC TÍNH TIỀN --------
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    const totalInput = document.getElementById('totalInput');

    function formatCurrency(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";
    }

    function calculateTotal() {
        // Lấy giá trị data-price từ option đang chọn
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const price = parseInt(selectedOption.getAttribute('data-price'));
        const quantity = parseInt(quantityInput.value);
        
        const total = price * quantity;
        
        // Cập nhật giao diện
        totalPriceDisplay.textContent = formatCurrency(total);
        // Lưu giá trị vào thẻ input ẩn để gửi đi
        totalInput.value = total;
    }

    productSelect.addEventListener('change', calculateTotal);

    btnMinus.addEventListener('click', () => {
        let qty = parseInt(quantityInput.value);
        if (qty > 1) {
            quantityInput.value = qty - 1;
            calculateTotal();
        }
    });

    btnPlus.addEventListener('click', () => {
        let qty = parseInt(quantityInput.value);
        quantityInput.value = qty + 1;
        calculateTotal();
    });

    // Tính toán lần đầu lúc mới load trang
    calculateTotal();

    // -------- LOGIC GỬI FORM LÊN GOOGLE SHEETS --------
    // QUAN TRỌNG: Bạn cần thay thế URL dưới đây bằng "Web App URL" của Google Apps Script của bạn
    const GOOGLE_SCRIPT_URL = 'THAY_URL_CUA_BAN_VAO_DAY'; 

    const orderForm = document.getElementById('orderForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successModal = document.getElementById('successModal');

    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Kiểm tra xem đã thay URL chưa
        if(GOOGLE_SCRIPT_URL === 'THAY_URL_CUA_BAN_VAO_DAY') {
            alert('LỖI: Chưa cấu hình đường dẫn Google Apps Script. Vui lòng cập nhật biến GOOGLE_SCRIPT_URL trong file script.js');
            return;
        }

        const formData = new FormData(orderForm);

        // Hiển thị loading, vô hiệu hóa nút submit
        loadingOverlay.style.display = 'flex';
        submitBtn.disabled = true;

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Sử dụng no-cors để tránh lỗi bảo mật trên trình duyệt khi gọi Google Script
            body: formData
        })
        .then(response => {
            // Khi dùng mode no-cors, fetch sẽ không đọc được response trả về. 
            // Tuy nhiên promise vẫn resolve khi gửi thành công.
            loadingOverlay.style.display = 'none';
            successModal.style.display = 'flex';
            orderForm.reset();
            calculateTotal(); // reset lại giá
            submitBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error!', error.message);
            loadingOverlay.style.display = 'none';
            submitBtn.disabled = false;
            alert('Có lỗi xảy ra, vui lòng thử lại sau hoặc liên hệ Hotline.');
        });
    });
});

// Hàm đóng popup thành công
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}
