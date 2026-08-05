document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Khởi tạo Swiper
    var swiper = new Swiper(".mySwiper", {
        pagination: { el: ".swiper-pagination", clickable: true },
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
    });

    // 2. Logic Đếm ngược Flash Sale
    function startCountdown() {
        let totalSeconds = 2 * 3600 + 15 * 60 + 30;
        const timerElement = document.getElementById('countdownTimer');
        setInterval(() => {
            if (totalSeconds <= 0) totalSeconds = 2 * 3600 + 15 * 60 + 30;
            const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
            const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
            const s = (totalSeconds % 60).toString().padStart(2, '0');
            timerElement.textContent = `${h}:${m}:${s}`;
            totalSeconds--;
        }, 1000);
    }
    startCountdown();

    // 3. Nút Lưu Mã Freeship (Chim mồi)
    let isFreeshipSaved = false;
    const btnFreeship = document.getElementById('btnFreeship');
    const shipFeeText = document.getElementById('shipFeeText');
    const toastMessage = document.getElementById('toastMessage');

    btnFreeship.addEventListener('click', function() {
        if(!isFreeshipSaved) {
            isFreeshipSaved = true;
            btnFreeship.classList.add('saved');
            btnFreeship.innerHTML = '<span class="icon">✔️</span> ĐÃ LƯU MÃ';
            
            // Random số lượt còn lại từ 5 - 15 để tạo FOMO
            const randomLeft = Math.floor(Math.random() * 10) + 5;
            toastMessage.textContent = `Đã lưu mã thành công! Chỉ còn ${randomLeft}/30 lượt hôm nay.`;
            
            // Hiển thị toast
            toastMessage.classList.add('show');
            setTimeout(() => { toastMessage.classList.remove('show'); }, 3500);

            // Cập nhật text trong form
            shipFeeText.textContent = 'Miễn phí (Đã áp mã)';
            shipFeeText.style.color = 'var(--success)';
            calculateTotal(); // Tính lại (nếu sau này có phí ship mặc định)
        }
    });

    // 4. Mở/Đóng Bottom Sheet Order
    const openOrderFormBtn = document.getElementById('openOrderFormBtn');
    const closeSheetBtn = document.getElementById('closeSheetBtn');
    const orderBottomSheetOverlay = document.getElementById('orderBottomSheetOverlay');

    openOrderFormBtn.addEventListener('click', () => {
        orderBottomSheetOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Ngăn cuộn trang phía sau
    });
    
    closeSheetBtn.addEventListener('click', () => {
        orderBottomSheetOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // 5. Logic API Tỉnh/Huyện/Xã
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const wardSelect = document.getElementById('ward');

    fetch('https://provinces.open-api.vn/api/?depth=3')
        .then(response => response.json())
        .then(data => {
            data.forEach(p => {
                const option = document.createElement('option');
                option.value = p.name; option.textContent = p.name;
                provinceSelect.appendChild(option);
            });

            provinceSelect.addEventListener('change', function() {
                districtSelect.innerHTML = '<option value="" disabled selected>Chọn Quận/Huyện</option>';
                wardSelect.innerHTML = '<option value="" disabled selected>Chọn Phường/Xã</option>';
                districtSelect.disabled = false; wardSelect.disabled = true;

                const selectedProvince = data.find(p => p.name === this.value);
                if(selectedProvince && selectedProvince.districts) {
                    selectedProvince.districts.forEach(d => {
                        const option = document.createElement('option');
                        option.value = d.name; option.textContent = d.name;
                        districtSelect.appendChild(option);
                    });
                }
            });

            districtSelect.addEventListener('change', function() {
                wardSelect.innerHTML = '<option value="" disabled selected>Chọn Phường/Xã</option>';
                wardSelect.disabled = false;
                const selectedProvince = data.find(p => p.name === provinceSelect.value);
                const selectedDistrict = selectedProvince.districts.find(d => d.name === this.value);
                if(selectedDistrict && selectedDistrict.wards) {
                    selectedDistrict.wards.forEach(w => {
                        const option = document.createElement('option');
                        option.value = w.name; option.textContent = w.name;
                        wardSelect.appendChild(option);
                    });
                }
            });
        }).catch(err => console.log('Lỗi tải API:', err));

    // 6. Logic Tính Tiền & Radio Cards
    const productRadios = document.querySelectorAll('input[name="product_radio"]');
    const quantityInput = document.getElementById('quantity');
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    const totalInput = document.getElementById('totalInput');

    function formatCurrency(number) { return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫"; }

    function calculateTotal() {
        // Tìm radio đang được check
        const checkedRadio = document.querySelector('input[name="product_radio"]:checked');
        const price = parseInt(checkedRadio.getAttribute('data-price'));
        const quantity = parseInt(quantityInput.value);
        
        let shipFee = 0; // Luôn freeship
        const total = (price * quantity) + shipFee;
        
        totalPriceDisplay.textContent = formatCurrency(total);
        totalInput.value = total;
    }

    productRadios.forEach(radio => {
        radio.addEventListener('change', calculateTotal);
    });

    btnMinus.addEventListener('click', () => {
        let qty = parseInt(quantityInput.value);
        if (qty > 1) { quantityInput.value = qty - 1; calculateTotal(); }
    });
    btnPlus.addEventListener('click', () => {
        let qty = parseInt(quantityInput.value);
        quantityInput.value = qty + 1; calculateTotal();
    });
    calculateTotal(); // Chạy lần đầu

    // 7. Validate Phone
    const phoneInput = document.getElementById('phone');
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    phoneInput.addEventListener('input', function() {
        if(this.value.length > 0 && !phoneRegex.test(this.value)) { this.classList.add('is-invalid'); } 
        else { this.classList.remove('is-invalid'); }
    });

    // 8. Confirm Modal & Gửi Sheets
    const previewBtn = document.getElementById('previewBtn');
    const confirmModal = document.getElementById('confirmModal');
    const orderForm = document.getElementById('orderForm');
    
    previewBtn.addEventListener('click', function() {
        if (!orderForm.checkValidity()) { orderForm.reportValidity(); return; }
        if(phoneInput.classList.contains('is-invalid')) { alert('Vui lòng kiểm tra lại số điện thoại.'); phoneInput.focus(); return; }

        const addressFull = `${document.getElementById('street').value}, ${document.getElementById('ward').value}, ${document.getElementById('district').value}, ${document.getElementById('province').value}`;
        const checkedRadio = document.querySelector('input[name="product_radio"]:checked');

        document.getElementById('confName').textContent = document.getElementById('fullname').value;
        document.getElementById('confPhone').textContent = phoneInput.value;
        document.getElementById('confAddress').textContent = addressFull;
        document.getElementById('confProduct').textContent = checkedRadio.value;
        document.getElementById('confQuantity').textContent = quantityInput.value;
        document.getElementById('confTotal').textContent = formatCurrency(totalInput.value);

        confirmModal.style.display = 'flex';
    });

    const GOOGLE_SCRIPT_URL = 'THAY_URL_CUA_BAN_VAO_DAY'; 
    const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successModal = document.getElementById('successModal');

    confirmSubmitBtn.addEventListener('click', function() {
        if(GOOGLE_SCRIPT_URL === 'THAY_URL_CUA_BAN_VAO_DAY') { alert('LỖI: Chưa cấu hình đường dẫn Google Apps Script trong script.js.'); return; }

        confirmModal.style.display = 'none';
        loadingOverlay.style.display = 'flex';

        const submitData = new FormData();
        const checkedRadio = document.querySelector('input[name="product_radio"]:checked');
        
        submitData.append('product', checkedRadio.value);
        submitData.append('quantity', quantityInput.value);
        submitData.append('fullname', document.getElementById('fullname').value);
        submitData.append('phone', phoneInput.value);
        submitData.append('notes', document.getElementById('notes').value);
        submitData.append('total', totalInput.value);
        
        const addressFull = `${document.getElementById('street').value}, ${document.getElementById('ward').value}, ${document.getElementById('district').value}, ${document.getElementById('province').value}`;
        submitData.append('address', addressFull);

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors', body: submitData
        })
        .then(() => {
            loadingOverlay.style.display = 'none';
            orderBottomSheetOverlay.classList.remove('active'); // Đóng bottom sheet
            document.body.style.overflow = '';
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

function closeConfirmModal() { document.getElementById('confirmModal').style.display = 'none'; }
function closeSuccessModal() { document.getElementById('successModal').style.display = 'none'; }
