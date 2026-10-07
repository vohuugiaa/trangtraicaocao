document.addEventListener('DOMContentLoaded', function() {
    
    // Khởi tạo Swiper
    var swiper = new Swiper(".mySwiper", {
        pagination: { el: ".swiper-pagination", clickable: true },
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
    });

    // Tự động dừng lướt ảnh khi người dùng bấm phát Video
    const albumVideo = document.getElementById('albumVideo');
    if (albumVideo) {
        albumVideo.addEventListener('play', () => { if (swiper.autoplay) swiper.autoplay.stop(); });
        albumVideo.addEventListener('pause', () => { if (swiper.autoplay) swiper.autoplay.start(); });
        albumVideo.addEventListener('ended', () => { if (swiper.autoplay) swiper.autoplay.start(); });
    }

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

    // Multi-step & Bottom Sheet Order
    let currentStep = 1;
    const openOrderFormBtn = document.getElementById('openOrderFormBtn');
    const closeSheetBtn = document.getElementById('closeSheetBtn');
    const orderBottomSheetOverlay = document.getElementById('orderBottomSheetOverlay');
    const sheetBody = document.getElementById('sheetBody');
    const sheetStepBadge = document.getElementById('sheetStepBadge');
    const sheetMainTitle = document.getElementById('sheetMainTitle');
    const btnBackToStep1 = document.getElementById('btnBackToStep1');
    const btnNextToStep2 = document.getElementById('btnNextToStep2');
    const btnChangeVariant = document.getElementById('btnChangeVariant');

    const step1Product = document.getElementById('step1Product');
    const step2Shipping = document.getElementById('step2Shipping');
    const step1Subtotal = document.getElementById('step1Subtotal');
    const step1GiftNotice = document.getElementById('step1GiftNotice');
    const step2SelectedName = document.getElementById('step2SelectedName');
    const step2SelectedDetail = document.getElementById('step2SelectedDetail');
    const step2SelectedPrice = document.getElementById('step2SelectedPrice');
    const goodsPriceText = document.getElementById('goodsPriceText');

    function goToStep(step) {
        currentStep = step;
        if (step === 1) {
            if (step1Product) step1Product.style.display = 'block';
            if (step2Shipping) step2Shipping.style.display = 'none';
            if (btnBackToStep1) btnBackToStep1.style.display = 'none';
            if (sheetStepBadge) sheetStepBadge.textContent = 'Bước 1/2';
            if (sheetMainTitle) sheetMainTitle.textContent = 'CHỌN GÓI SẢN PHẨM';
        } else {
            if (step1Product) step1Product.style.display = 'none';
            if (step2Shipping) step2Shipping.style.display = 'block';
            if (btnBackToStep1) btnBackToStep1.style.display = 'inline-flex';
            if (sheetStepBadge) sheetStepBadge.textContent = 'Bước 2/2';
            if (sheetMainTitle) sheetMainTitle.textContent = 'ĐỊA CHỈ NHẬN HÀNG';
            updateStep2Summary();
        }
        if (sheetBody) sheetBody.scrollTop = 0;
    }

    // Chặn phím back
    history.replaceState({page: 'home'}, '', window.location.href);

    openOrderFormBtn.addEventListener('click', () => {
        goToStep(1);
        orderBottomSheetOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        isFormOpen = true;
        history.pushState({page: 'form', step: 1}, '', window.location.href.split('#')[0] + '#order');
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
        goToStep(1);
    }

    // Lắng nghe sự kiện Back (Popstate)
    window.addEventListener('popstate', function(e) {
        if (isFormOpen) {
            if (currentStep === 2) {
                // Đang ở bước 2 bấm back -> quay lại bước 1
                goToStep(1);
            } else {
                // Đang ở bước 1 bấm back -> đóng form
                closeBottomSheet();
            }
        } else {
            // Đang ở ngoài trang chủ mà bấm back -> Bật thông báo
            const exitModal = document.getElementById('exitModal');
            if (exitModal && exitModal.style.display !== 'flex') {
                history.pushState({page: 'home'}, '', window.location.href.split('#')[0]);
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

    if (btnNextToStep2) {
        btnNextToStep2.addEventListener('click', () => {
            const checkedRadio = document.querySelector('input[name="product_radio"]:checked');
            if (checkedRadio && checkedRadio.getAttribute('data-price') === 'custom') {
                let eggQty = parseInt(customEggQuantity.value) || 0;
                if (eggQty < 2500) {
                    alert('Số lượng tối thiểu là 2.500 trứng. Vui lòng nhập từ 2.500 trở lên.');
                    customEggQuantity.value = 2500;
                    calculateTotal();
                    customEggQuantity.focus();
                    return;
                }
            }
            goToStep(2);
            history.pushState({page: 'form', step: 2}, '', window.location.href.split('#')[0] + '#order-step2');
        });
    }

    if (btnBackToStep1) {
        btnBackToStep1.addEventListener('click', () => {
            goToStep(1);
            if (history.state && history.state.step === 2) {
                history.back();
            }
        });
    }

    if (btnChangeVariant) {
        btnChangeVariant.addEventListener('click', () => {
            goToStep(1);
            if (history.state && history.state.step === 2) {
                history.back();
            }
        });
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

    const customQtyContainer = document.getElementById('customQtyContainer');
    const customEggQuantity = document.getElementById('customEggQuantity');
    const btnEggMinus = document.getElementById('btnEggMinus');
    const btnEggPlus = document.getElementById('btnEggPlus');
    const customPricePreview = document.getElementById('customPricePreview');
    const comboQtyGroup = document.getElementById('comboQtyGroup');

    function formatCurrency(number) { return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫"; }

    function updateStep2Summary() {
        const checkedRadio = document.querySelector('input[name="product_radio"]:checked');
        if (!checkedRadio) return;

        let price = 0;
        if (checkedRadio.getAttribute('data-price') === 'custom') {
            let eggQty = parseInt(customEggQuantity.value) || 2500;
            if (eggQty < 2500) eggQty = 2500;
            let bonusEggs = Math.round(eggQty * 0.1);
            price = eggQty * 1600;

            if (step2SelectedName) step2SelectedName.textContent = `Tự chọn ${eggQty.toLocaleString('vi-VN')} trứng`;
            if (step2SelectedDetail) step2SelectedDetail.textContent = `⚡ Tặng kèm: +${bonusEggs.toLocaleString('vi-VN')} trứng (10%)`;
            if (step2SelectedPrice) step2SelectedPrice.textContent = formatCurrency(price);
        } else {
            const basePrice = parseInt(checkedRadio.getAttribute('data-price')) || 0;
            const qty = parseInt(quantityInput.value) || 1;
            price = basePrice * qty;
            const bonus = checkedRadio.getAttribute('data-bonus') || '+10% trứng';

            if (step2SelectedName) step2SelectedName.textContent = checkedRadio.value;
            if (step2SelectedDetail) step2SelectedDetail.textContent = `Số lượng: ${qty} gói • 🎁 Tặng kèm ${bonus}`;
            if (step2SelectedPrice) step2SelectedPrice.textContent = formatCurrency(price);
        }
        if (goodsPriceText) goodsPriceText.textContent = formatCurrency(price);
    }

    function calculateTotal() {
        const checkedRadio = document.querySelector('input[name="product_radio"]:checked');
        if (!checkedRadio) return;

        let price = 0;
        let shipFee = isFreeshipSaved ? 0 : 30000;

        if (checkedRadio.getAttribute('data-price') === 'custom') {
            if (customQtyContainer) customQtyContainer.style.display = 'block';
            if (comboQtyGroup) comboQtyGroup.style.display = 'none';

            let eggQty = parseInt(customEggQuantity.value) || 2500;
            if (eggQty < 2500) eggQty = 2500;
            price = eggQty * 1600;
            if (customPricePreview) customPricePreview.textContent = formatCurrency(price);

            let bonusEggs = Math.round(eggQty * 0.1);
            if (step1Subtotal) step1Subtotal.textContent = formatCurrency(price);
            if (step1GiftNotice) step1GiftNotice.textContent = `🎁 Đã gồm: Tặng thêm +${bonusEggs.toLocaleString('vi-VN')} trứng (10%)`;
        } else {
            if (customQtyContainer) customQtyContainer.style.display = 'none';
            if (comboQtyGroup) comboQtyGroup.style.display = 'block';

            const basePrice = parseInt(checkedRadio.getAttribute('data-price')) || 0;
            const quantity = parseInt(quantityInput.value) || 1;
            price = basePrice * quantity;

            const bonus = checkedRadio.getAttribute('data-bonus') || '+10% trứng';
            if (step1Subtotal) step1Subtotal.textContent = formatCurrency(price);
            if (step1GiftNotice) step1GiftNotice.textContent = `🎁 Đã gồm: Tặng thêm ${bonus}`;
        }

        if (goodsPriceText) goodsPriceText.textContent = formatCurrency(price);

        const total = price + shipFee;
        totalPriceDisplay.textContent = formatCurrency(total);
        totalInput.value = total;

        updateStep2Summary();
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

    if (btnEggMinus && btnEggPlus && customEggQuantity) {
        btnEggMinus.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(customEggQuantity.value) || 2500;
            if (val > 2500) {
                let newVal = val - 100;
                if (newVal < 2500) newVal = 2500;
                customEggQuantity.value = newVal;
                calculateTotal();
            }
        });
        btnEggPlus.addEventListener('click', (e) => {
            e.preventDefault();
            let val = parseInt(customEggQuantity.value) || 2500;
            if (val < 2500) val = 2500;
            customEggQuantity.value = val + 100;
            calculateTotal();
        });
        customEggQuantity.addEventListener('input', () => {
            calculateTotal();
        });
        customEggQuantity.addEventListener('change', () => {
            let val = parseInt(customEggQuantity.value) || 2500;
            if (val < 2500) {
                customEggQuantity.value = 2500;
            }
            calculateTotal();
        });
    }

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

        let displayProduct = checkedRadio.value;
        let displayQuantity = quantityInput.value + " gói";

        if (checkedRadio.getAttribute('data-price') === 'custom') {
            let eggQty = parseInt(customEggQuantity.value) || 2500;
            if (eggQty < 2500) eggQty = 2500;
            let bonusEggs = Math.round(eggQty * 0.1);
            displayProduct = `Trứng Cào Cào (Tùy chọn ${eggQty.toLocaleString('vi-VN')} trứng + Tặng ${bonusEggs.toLocaleString('vi-VN')} trứng)`;
            displayQuantity = `${eggQty.toLocaleString('vi-VN')} trứng`;
        } else {
            const bonus = checkedRadio.getAttribute('data-bonus') || '+10% trứng';
            displayProduct = `${checkedRadio.value} (Tặng ${bonus})`;
        }

        document.getElementById('confName').textContent = document.getElementById('fullname').value;
        document.getElementById('confPhone').textContent = phoneInput.value;
        document.getElementById('confAddress').textContent = addressFull;
        document.getElementById('confProduct').textContent = displayProduct;
        document.getElementById('confQuantity').textContent = displayQuantity;
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
        
        let finalProduct = checkedRadio.value;
        let finalQuantity = quantityInput.value;

        if (checkedRadio.getAttribute('data-price') === 'custom') {
            let eggQty = parseInt(customEggQuantity.value) || 2500;
            if (eggQty < 2500) eggQty = 2500;
            let bonusEggs = Math.round(eggQty * 0.1);
            finalProduct = `Trứng Cào Cào (Tùy chọn ${eggQty} trứng + Tặng ${bonusEggs} trứng)`;
            finalQuantity = eggQty.toString();
        } else {
            const bonus = checkedRadio.getAttribute('data-bonus') || '+10% trứng';
            finalProduct = `${checkedRadio.value} (Tặng ${bonus})`;
        }

        submitData.append('product', finalProduct);
        submitData.append('quantity', finalQuantity);
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
            goToStep(1);
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
