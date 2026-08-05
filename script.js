document.addEventListener('DOMContentLoaded', function() {
    
    // Khởi tạo Swiper
    var swiper = new Swiper(".mySwiper", {
        pagination: { el: ".swiper-pagination", clickable: true },
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
    });

    // Đếm ngược Flash Sale
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

    // Biến toàn cục
    let isFreeshipSaved = false;
    let isFormOpen = false;
    
    // Nút Lưu Mã Freeship trong form
    const formBtnFreeship = document.getElementById('formBtnFreeship');
    const shipFeeText = document.getElementById('shipFeeText');
    const toastMessage = document.getElementById('toastMessage');

    formBtnFreeship.addEventListener('click', applyFreeshipAction);

    function applyFreeshipAction() {
        if(!isFreeshipSaved) {
            isFreeshipSaved = true;
            formBtnFreeship.classList.add('saved');
            formBtnFreeship.innerHTML = '<span class="fs-icon">✔️</span> ĐÃ LƯU MÃ FREESHIP';
            
            const randomLeft = Math.floor(Math.random() * 10) + 5;
            toastMessage.textContent = `Đã lưu mã thành công! Chỉ còn ${randomLeft}/30 lượt hôm nay.`;
            toastMessage.classList.add('show');
            setTimeout(() => { toastMessage.classList.remove('show'); }, 3500);

            shipFeeText.textContent = 'Miễn phí';
            shipFeeText.classList.add('free');
            calculateTotal(); 
        }
    }

    window.applyFreeshipNow = function() {
        document.getElementById('forgotFreeshipModal').style.display = 'none';
        applyFreeshipAction();
        showConfirmModal();
    }
    
    window.skipFreeship = function() {
        document.getElementById('forgotFreeshipModal').style.display = 'none';
        showConfirmModal();
    }

    // Mở/Đóng Bottom Sheet Order & Push State
    const openOrderFormBtn = document.getElementById('openOrderFormBtn');
    const closeSheetBtn = document.getElementById('closeSheetBtn');
    const orderBottomSheetOverlay = document.getElementById('orderBottomSheetOverlay');

    // Chặn phím back
    history.replaceState({page: 'home'}, '', window.location.href);

    openOrderFormBtn.addEventListener('click', () => {
        orderBottomSheetOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        isFormOpen = true;
        history.pushState({page: 'form'}, '', window.location.href + '#order');
    });
    
    closeSheetBtn.addEventListener('click', () => {
        closeBottomSheet();
        if(history.state && history.state.page === 'form') {
            history.back(); // Đồng bộ lại url
        }
    });

    function closeBottomSheet() {
        orderBottomSheetOverlay.classList.remove('active');
        document.body.style.overflow = '';
        isFormOpen = false;
    }

    // Lắng nghe sự kiện Back (Popstate)
    window.addEventListener('popstate', function(e) {
        if (isFormOpen) {
            // Đang mở form mà bấm back -> Đóng form
            closeBottomSheet();
            // Trạng thái hiện tại đã về 'home' do trình duyệt tự pop
        } else {
            // Đang ở ngoài trang chủ mà bấm back -> Bật thông báo
            const exitModal = document.getElementById('exitModal');
            if (exitModal.style.display !== 'flex') {
                // Nhét lại một state để không bị thoát ra trang trước đó
                history.pushState({page: 'home'}, '', window.location.href);
                exitModal.style.display = 'flex';
            }
        }
    });

    window.stayOnPage = function() {
        document.getElementById('exitModal').style.display = 'none';
    }

    window.confirmExit = function() {
        document.getElementById('exitModal').style.display = 'none';
        // Cho phép thoát thật bằng cách nhảy lui 2 bước
        history.go(-2);
    }

    // Logic API Tỉnh/Huyện/Xã
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
        }).catch(err => console.log('Lỗi API', err));

    // Logic Tính Tiền
    const productRadios = document.querySelectorAll('input[name="product_radio"]');
    const quantityInput = document.getElementById('quantity');
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    const totalInput = document.getElementById('totalInput');

    function formatCurrency(number) { return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫"; }

    function calculateTotal() {
        const checkedRadio = document.querySelector('input[name="product_radio"]:checked');
        const price = parseInt(checkedRadio.getAttribute('data-price'));
        const quantity = parseInt(quantityInput.value);
        
        let shipFee = isFreeshipSaved ? 0 : 30000; 
        
        const total = (price * quantity) + shipFee;
        totalPriceDisplay.textContent = formatCurrency(total);
        totalInput.value = total;
    }

    productRadios.forEach(radio => { radio.addEventListener('change', calculateTotal); });
    btnMinus.addEventListener('click', () => {
        let qty = parseInt(quantityInput.value);
        if (qty > 1) { quantityInput.value = qty - 1; calculateTotal(); }
    });
    btnPlus.addEventListener('click', () => {
        let qty = parseInt(quantityInput.value);
        quantityInput.value = qty + 1; calculateTotal();
    });
    calculateTotal(); 

    // Validate Phone
    const phoneInput = document.getElementById('phone');
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    phoneInput.addEventListener('input', function() {
        if(this.value.length > 0 && !phoneRegex.test(this.value)) { this.classList.add('is-invalid'); } 
        else { this.classList.remove('is-invalid'); }
    });

    // Validate & Bật Confirm Modal
    const previewBtn = document.getElementById('previewBtn');
    const confirmModal = document.getElementById('confirmModal');
    const orderForm = document.getElementById('orderForm');
    
    previewBtn.addEventListener('click', function() {
        if (!orderForm.checkValidity()) { orderForm.reportValidity(); return; }
        if(phoneInput.classList.contains('is-invalid')) { alert('Vui lòng kiểm tra lại số điện thoại.'); phoneInput.focus(); return; }

        if (!isFreeshipSaved) {
            // Hiện popup quên lưu mã
            document.getElementById('forgotFreeshipModal').style.display = 'flex';
        } else {
            showConfirmModal();
        }
    });

    function showConfirmModal() {
        const addressFull = `${document.getElementById('street').value}, ${document.getElementById('ward').value}, ${document.getElementById('district').value}, ${document.getElementById('province').value}`;
        const checkedRadio = document.querySelector('input[name="product_radio"]:checked');

        document.getElementById('confName').textContent = document.getElementById('fullname').value;
        document.getElementById('confPhone').textContent = phoneInput.value;
        document.getElementById('confAddress').textContent = addressFull;
        document.getElementById('confProduct').textContent = checkedRadio.value;
        document.getElementById('confQuantity').textContent = quantityInput.value;
        document.getElementById('confTotal').textContent = formatCurrency(totalInput.value);

        confirmModal.style.display = 'flex';
    }


    // Gửi form
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxR55m-6TAXw8hmAlI4tj5rv9TZIAc7RbyYzWlCgi2RZqtQIUQnrH0WTPhfeEqN3QN4Zw/exec'; 
    const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const successModal = document.getElementById('successModal');

    confirmSubmitBtn.addEventListener('click', function() {
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
            closeBottomSheet();
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

window.closeConfirmModal = function() { document.getElementById('confirmModal').style.display = 'none'; }
window.closeSuccessModal = function() { document.getElementById('successModal').style.display = 'none'; }
