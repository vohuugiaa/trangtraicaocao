document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Khởi tạo Swiper
    var swiper = new Swiper(".mySwiper", {
        pagination: { el: ".swiper-pagination", clickable: true },
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
    });

    // 2. Logic Đếm ngược thời gian Flash Sale
    function startCountdown() {
        // Đặt mặc định luôn đếm ngược 2 tiếng 15 phút từ lúc load trang (Tạo FOMO ảo)
        let totalSeconds = 2 * 3600 + 15 * 60 + 30;
        const timerElement = document.getElementById('countdownTimer');
        
        setInterval(() => {
            if (totalSeconds <= 0) totalSeconds = 2 * 3600 + 15 * 60 + 30; // Lặp lại
            
            const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            
            timerElement.textContent = `${h}:${m}:${s}`;
            totalSeconds--;
        }, 1000);
    }
    startCountdown();

    // 3. Logic Fetch API Tỉnh/Huyện/Xã
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const wardSelect = document.getElementById('ward');

    fetch('https://provinces.open-api.vn/api/?depth=3')
        .then(response => response.json())
        .then(data => {
            // Đổ dữ liệu Tỉnh
            data.forEach(p => {
                const option = document.createElement('option');
                option.value = p.name;
                option.dataset.code = p.code;
                option.textContent = p.name;
                provinceSelect.appendChild(option);
            });

            // Khi chọn Tỉnh -> Xử lý Huyện
            provinceSelect.addEventListener('change', function() {
                districtSelect.innerHTML = '<option value="" disabled selected>Chọn Quận/Huyện</option>';
                wardSelect.innerHTML = '<option value="" disabled selected>Chọn Phường/Xã</option>';
                districtSelect.disabled = false;
                wardSelect.disabled = true;

                const selectedProvince = data.find(p => p.name === this.value);
                if(selectedProvince && selectedProvince.districts) {
                    selectedProvince.districts.forEach(d => {
                        const option = document.createElement('option');
                        option.value = d.name;
                        option.dataset.code = d.code;
                        option.textContent = d.name;
                        districtSelect.appendChild(option);
                    });
                }
            });

            // Khi chọn Huyện -> Xử lý Xã
            districtSelect.addEventListener('change', function() {
                wardSelect.innerHTML = '<option value="" disabled selected>Chọn Phường/Xã</option>';
                wardSelect.disabled = false;

                const selectedProvince = data.find(p => p.name === provinceSelect.value);
                const selectedDistrict = selectedProvince.districts.find(d => d.name === this.value);
                if(selectedDistrict && selectedDistrict.wards) {
                    selectedDistrict.wards.forEach(w => {
                        const option = document.createElement('option');
                        option.value = w.name;
                        option.textContent = w.name;
                        wardSelect.appendChild(option);
                    });
                }
            });
        })
        .catch(error => console.log('Lỗi tải dữ liệu Tỉnh/Thành', error));

    // 4. Logic Tính tiền & Số lượng
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
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const price = parseInt(selectedOption.getAttribute('data-price'));
        const quantity = parseInt(quantityInput.value);
        const total = price * quantity;
        
        totalPriceDisplay.textContent = formatCurrency(total);
        totalInput.value = total;
    }

    productSelect.addEventListener('change', calculateTotal);
    btnMinus.addEventListener('click', () => {
        let qty = parseInt(quantityInput.value);
        if (qty > 1) { quantityInput.value = qty - 1; calculateTotal(); }
    });
    btnPlus.addEventListener('click', () => {
        let qty = parseInt(quantityInput.value);
        quantityInput.value = qty + 1; calculateTotal();
    });
    calculateTotal();

    // 5. Logic Validate Số điện thoại
    const phoneInput = document.getElementById('phone');
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

    phoneInput.addEventListener('input', function() {
        if(this.value.length > 0 && !phoneRegex.test(this.value)) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    // 6. Xử lý Nút Xác Nhận (Preview) trước khi gửi
    const previewBtn = document.getElementById('previewBtn');
    const confirmModal = document.getElementById('confirmModal');
    const orderForm = document.getElementById('orderForm');
    
    previewBtn.addEventListener('click', function() {
        // Kiểm tra form validation của HTML5
        if (!orderForm.checkValidity()) {
            orderForm.reportValidity(); // Hiển thị popup nhắc điền
            return;
        }

        // Kiểm tra lỗi sđt
        if(phoneInput.classList.contains('is-invalid')) {
            alert('Vui lòng kiểm tra lại số điện thoại cho hợp lệ.');
            phoneInput.focus();
            return;
        }

        // Lấy dữ liệu ghép thành địa chỉ full
        const addressFull = `${document.getElementById('street').value}, ${document.getElementById('ward').value}, ${document.getElementById('district').value}, ${document.getElementById('province').value}`;
        
        // Điền vào Confirm Modal
        document.getElementById('confName').textContent = document.getElementById('fullname').value;
        document.getElementById('confPhone').textContent = phoneInput.value;
        document.getElementById('confAddress').textContent = addressFull;
        document.getElementById('confProduct').textContent = productSelect.options[productSelect.selectedIndex].text;
        document.getElementById('confQuantity').textContent = quantityInput.value;
        document.getElementById('confTotal').textContent = formatCurrency(totalInput.value);

        // Hiện modal
        confirmModal.style.display = 'flex';
    });


    // 7. Logic Gửi form lên Google Sheets (khi bấm CHỐT ĐƠN trong Modal)
    const GOOGLE_SCRIPT_URL = 'THAY_URL_CUA_BAN_VAO_DAY'; 
    const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successModal = document.getElementById('successModal');

    confirmSubmitBtn.addEventListener('click', function() {
        if(GOOGLE_SCRIPT_URL === 'THAY_URL_CUA_BAN_VAO_DAY') {
            alert('LỖI: Chưa cấu hình đường dẫn Google Apps Script (GOOGLE_SCRIPT_URL trong file script.js).');
            return;
        }

        // Đóng confirm modal, bật loading
        confirmModal.style.display = 'none';
        loadingOverlay.style.display = 'flex';

        // Khởi tạo FormData giả lập (vì địa chỉ được ghép lại)
        const submitData = new FormData();
        submitData.append('product', productSelect.value);
        submitData.append('quantity', quantityInput.value);
        submitData.append('fullname', document.getElementById('fullname').value);
        submitData.append('phone', phoneInput.value);
        submitData.append('notes', document.getElementById('notes').value);
        submitData.append('total', totalInput.value);
        
        const addressFull = `${document.getElementById('street').value}, ${document.getElementById('ward').value}, ${document.getElementById('district').value}, ${document.getElementById('province').value}`;
        submitData.append('address', addressFull);

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: submitData
        })
        .then(() => {
            loadingOverlay.style.display = 'none';
            successModal.style.display = 'flex';
            orderForm.reset();
            districtSelect.disabled = true;
            wardSelect.disabled = true;
            calculateTotal();
        })
        .catch(error => {
            loadingOverlay.style.display = 'none';
            alert('Có lỗi xảy ra, vui lòng thử lại sau.');
        });
    });
});

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}
