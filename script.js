/**
 * TRANG TRẠI CÀO CÀO - INTERACTIVE SCRIPT
 * High-converting, Robust & Smooth UI/UX
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // ===================================================
  // 1. SWIPER GALLERY INITIALIZATION
  // ===================================================
  const swiper = new Swiper('.mySwiper', {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    loop: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    effect: 'slide',
    speed: 500,
  });

  // Video Slide Play/Pause Controller
  const albumVideo = document.getElementById('albumVideo');
  const videoPlayOverlay = document.getElementById('videoPlayOverlay');

  if (albumVideo && videoPlayOverlay) {
    videoPlayOverlay.addEventListener('click', function () {
      if (albumVideo.paused) {
        albumVideo.play();
        videoPlayOverlay.classList.add('playing');
        if (swiper.autoplay) swiper.autoplay.stop();
      } else {
        albumVideo.pause();
        videoPlayOverlay.classList.remove('playing');
        if (swiper.autoplay) swiper.autoplay.start();
      }
    });

    albumVideo.addEventListener('play', function () {
      videoPlayOverlay.classList.add('playing');
      if (swiper.autoplay) swiper.autoplay.stop();
    });

    albumVideo.addEventListener('pause', function () {
      videoPlayOverlay.classList.remove('playing');
      if (swiper.autoplay) swiper.autoplay.start();
    });

    albumVideo.addEventListener('ended', function () {
      videoPlayOverlay.classList.remove('playing');
      if (swiper.autoplay) swiper.autoplay.start();
    });
  }

  // ===================================================
  // 2. FLASH SALE COUNTDOWN TIMER
  // ===================================================
  function initCountdownTimer() {
    const timerElem = document.getElementById('countdownTimer');
    if (!timerElem) return;

    let totalSeconds = 2 * 3600 + 15 * 60 + 30;

    setInterval(function () {
      if (totalSeconds <= 0) {
        totalSeconds = 2 * 3600 + 15 * 60 + 30; // reset
      }
      const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
      const s = (totalSeconds % 60).toString().padStart(2, '0');
      timerElem.textContent = `${h}:${m}:${s}`;
      totalSeconds--;
    }, 1000);
  }
  initCountdownTimer();

  // Helper: Format Currency (VND)
  function formatVND(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
  }

  // ===================================================
  // 3. INTERACTIVE BREEDING DENSITY CALCULATOR
  // ===================================================
  const calcAreaSlider = document.getElementById('calcAreaSlider');
  const calcAreaVal = document.getElementById('calcAreaVal');
  const calcEggsNeeded = document.getElementById('calcEggsNeeded');
  const calcHatchEstimated = document.getElementById('calcHatchEstimated');
  const calcBonusEggs = document.getElementById('calcBonusEggs');
  const calcRecommendedPack = document.getElementById('calcRecommendedPack');
  const btnSelectCalcPack = document.getElementById('btnSelectCalcPack');
  const quickChips = document.querySelectorAll('.quick-chip');

  let currentCalculatedPack = 'Trứng Cào Cào (200 trứng)';
  let currentCalculatedCustomEggs = null;

  function updateCalculator(area) {
    area = parseFloat(area) || 1;
    calcAreaVal.textContent = `${area} m²`;

    // Chuẩn: 100 trứng / 1 m²
    const eggs = Math.round(area * 100);
    const hatch = eggs * 20; // Trung bình 20 con/trứng
    const bonus = Math.round(eggs * 0.1);

    calcEggsNeeded.textContent = `${eggs.toLocaleString('vi-VN')} trứng`;
    calcHatchEstimated.textContent = `~${hatch.toLocaleString('vi-VN')} con non`;
    calcBonusEggs.textContent = `+${bonus.toLocaleString('vi-VN')} trứng miễn phí`;

    // Match best combo
    if (eggs <= 75) {
      currentCalculatedPack = 'Trứng Cào Cào (50 trứng)';
      currentCalculatedCustomEggs = null;
      calcRecommendedPack.textContent = 'Gói 50 Trứng (149.000₫)';
    } else if (eggs <= 150) {
      currentCalculatedPack = 'Trứng Cào Cào (100 trứng)';
      currentCalculatedCustomEggs = null;
      calcRecommendedPack.textContent = 'Gói 100 Trứng (270.000₫)';
    } else if (eggs <= 350) {
      currentCalculatedPack = 'Trứng Cào Cào (200 trứng)';
      currentCalculatedCustomEggs = null;
      calcRecommendedPack.textContent = 'Gói 200 Trứng (500.000₫)';
    } else if (eggs <= 750) {
      currentCalculatedPack = 'Trứng Cào Cào (500 trứng)';
      currentCalculatedCustomEggs = null;
      calcRecommendedPack.textContent = 'Gói 500 Trứng (1.000.000₫) ★';
    } else if (eggs <= 1500) {
      currentCalculatedPack = 'Trứng Cào Cào (1000 trứng)';
      currentCalculatedCustomEggs = null;
      calcRecommendedPack.textContent = 'Gói 1.000 Trứng (1.800.000₫)';
    } else if (eggs <= 2200) {
      currentCalculatedPack = 'Trứng Cào Cào (2000 trứng)';
      currentCalculatedCustomEggs = null;
      calcRecommendedPack.textContent = 'Gói 2.000 Trứng (3.500.000₫)';
    } else {
      currentCalculatedPack = 'Tùy chọn số lượng';
      currentCalculatedCustomEggs = eggs;
      const price = eggs * 1600;
      calcRecommendedPack.textContent = `Tùy chọn ${eggs.toLocaleString('vi-VN')} trứng (${formatVND(price)})`;
    }
  }

  if (calcAreaSlider) {
    calcAreaSlider.addEventListener('input', function () {
      updateCalculator(this.value);
      quickChips.forEach(chip => {
        if (parseFloat(chip.getAttribute('data-val')) === parseFloat(this.value)) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener('click', function () {
      quickChips.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      const val = parseFloat(this.getAttribute('data-val'));
      if (calcAreaSlider) calcAreaSlider.value = val;
      updateCalculator(val);
    });
  });

  if (btnSelectCalcPack) {
    btnSelectCalcPack.addEventListener('click', function () {
      window.openOrderWithPack(currentCalculatedPack, currentCalculatedCustomEggs);
    });
  }

  // ===================================================
  // 4. FAQ ACCORDION
  // ===================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', function () {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ===================================================
  // 5. RECENT BUYER TOAST POPUPS (SOCIAL PROOF)
  // ===================================================
  const recentOrdersData = [
    { name: 'Anh Tuấn', city: 'Hà Nội', pack: 'Combo 500 trứng', time: '1 phút trước', avatar: 'AT' },
    { name: 'Bác Nam', city: 'Đà Nẵng', pack: 'Combo 200 trứng', time: '3 phút trước', avatar: 'BN' },
    { name: 'Anh Hùng', city: 'Bình Dương', pack: 'Gói 1.000 trứng', time: '5 phút trước', avatar: 'AH' },
    { name: 'Chú Minh', city: 'TP. Hồ Chí Minh', pack: 'Gói sỉ 2.000 trứng', time: '7 phút trước', avatar: 'CM' },
    { name: 'Anh Trọng', city: 'Quảng Nam', pack: 'Combo 500 trứng', time: '9 phút trước', avatar: 'AT' },
    { name: 'Anh Long', city: 'Hải Phòng', pack: 'Combo 200 trứng', time: '12 phút trước', avatar: 'AL' },
    { name: 'Bác Sơn', city: 'Cần Thơ', pack: 'Combo 100 trứng', time: '15 phút trước', avatar: 'BS' },
  ];

  const recentOrderToast = document.getElementById('recentOrderToast');
  const toastAvatar = document.getElementById('toastAvatar');
  const toastBuyerName = document.getElementById('toastBuyerName');
  const toastBuyerAction = document.getElementById('toastBuyerAction');
  const toastBuyerTime = document.getElementById('toastBuyerTime');

  let orderIndex = 0;
  function triggerRecentOrderPopup() {
    if (!recentOrderToast) return;
    const item = recentOrdersData[orderIndex];
    toastAvatar.textContent = item.avatar;
    toastBuyerName.textContent = `${item.name} (${item.city})`;
    toastBuyerAction.textContent = `vừa đặt ${item.pack}`;
    toastBuyerTime.textContent = item.time;

    recentOrderToast.classList.add('show');
    setTimeout(() => {
      recentOrderToast.classList.remove('show');
    }, 4500);

    orderIndex = (orderIndex + 1) % recentOrdersData.length;
  }

  // Start after 5 seconds, repeat every 14 seconds
  setTimeout(() => {
    triggerRecentOrderPopup();
    setInterval(triggerRecentOrderPopup, 14000);
  }, 5000);

  // ===================================================
  // 6. ORDER BOTTOM SHEET & MULTI-STEP LOGIC
  // ===================================================
  let isFreeshipSaved = false;
  let isFormOpen = false;
  let currentStep = 1;

  const btnOpenOrderModal = document.getElementById('btnOpenOrderModal');
  const btnCloseSheet = document.getElementById('btnCloseSheet');
  const orderBottomSheetOverlay = document.getElementById('orderBottomSheetOverlay');
  const sheetBody = document.getElementById('sheetBody');
  const sheetStepBadge = document.getElementById('sheetStepBadge');
  const sheetMainTitle = document.getElementById('sheetMainTitle');
  const btnBackToStep1 = document.getElementById('btnBackToStep1');
  const btnNextToStep2 = document.getElementById('btnNextToStep2');
  const btnChangePack = document.getElementById('btnChangePack');

  const step1Product = document.getElementById('step1Product');
  const step2Shipping = document.getElementById('step2Shipping');
  const step1Subtotal = document.getElementById('step1Subtotal');
  const step1GiftNotice = document.getElementById('step1GiftNotice');

  const step2SelectedName = document.getElementById('step2SelectedName');
  const step2SelectedDetail = document.getElementById('step2SelectedDetail');
  const step2SelectedPrice = document.getElementById('step2SelectedPrice');

  const invoiceGoodsPrice = document.getElementById('invoiceGoodsPrice');
  const invoiceShipFee = document.getElementById('invoiceShipFee');
  const invoiceTotal = document.getElementById('invoiceTotal');
  const totalAmountHidden = document.getElementById('totalAmountHidden');

  const productRadios = document.querySelectorAll('input[name="product_radio"]');
  const comboQuantityInput = document.getElementById('comboQuantity');
  const btnMinusCombo = document.getElementById('btnMinusCombo');
  const btnPlusCombo = document.getElementById('btnPlusCombo');
  const comboQtyGroup = document.getElementById('comboQtyGroup');

  const customQtyContainer = document.getElementById('customQtyContainer');
  const customEggQuantity = document.getElementById('customEggQuantity');
  const btnEggMinus = document.getElementById('btnEggMinus');
  const btnEggPlus = document.getElementById('btnEggPlus');
  const customPricePreview = document.getElementById('customPricePreview');

  const btnClaimVoucher = document.getElementById('btnClaimVoucher');
  const toastNotice = document.getElementById('toastNotice');

  function showToastNotice(msg) {
    if (!toastNotice) return;
    toastNotice.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3500);
  }

  function applyFreeshipAction() {
    if (!isFreeshipSaved) {
      isFreeshipSaved = true;
      btnClaimVoucher.classList.add('saved');
      btnClaimVoucher.innerHTML = '<span>✓</span> ĐÃ ÁP DỤNG MÃ MIỄN PHÍ VẬN CHUYỂN';

      showToastNotice('🎉 Đã lưu mã Freeship thành công! Miễn phí 30.000₫.');

      invoiceShipFee.textContent = 'Miễn phí';
      invoiceShipFee.classList.add('free');
      recalculateOrderTotal();
    }
  }

  if (btnClaimVoucher) {
    btnClaimVoucher.addEventListener('click', applyFreeshipAction);
  }

  // Stepping Navigation
  function goToOrderStep(step) {
    currentStep = step;
    if (step === 1) {
      step1Product.style.display = 'block';
      step2Shipping.style.display = 'none';
      btnBackToStep1.style.display = 'none';
      sheetStepBadge.textContent = 'Bước 1/2';
      sheetMainTitle.textContent = 'CHỌN GÓI SẢN PHẨM';
    } else {
      step1Product.style.display = 'none';
      step2Shipping.style.display = 'block';
      btnBackToStep1.style.display = 'inline-flex';
      sheetStepBadge.textContent = 'Bước 2/2';
      sheetMainTitle.textContent = 'ĐỊA CHỈ NHẬN HÀNG';
      updateStep2Summary();
    }
    if (sheetBody) sheetBody.scrollTop = 0;
  }

  function openBottomSheet() {
    goToOrderStep(1);
    orderBottomSheetOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    isFormOpen = true;
    history.pushState({ page: 'order-form', step: 1 }, '', window.location.href.split('#')[0] + '#order');
  }

  function closeBottomSheet() {
    orderBottomSheetOverlay.classList.remove('active');
    document.body.style.overflow = '';
    isFormOpen = false;
    goToOrderStep(1);
  }

  if (btnOpenOrderModal) btnOpenOrderModal.addEventListener('click', openBottomSheet);
  if (btnCloseSheet) {
    btnCloseSheet.addEventListener('click', function () {
      closeBottomSheet();
      if (history.state && history.state.page === 'order-form') {
        history.back();
      }
    });
  }

  // Handle Opening from external combo cards
  window.openOrderWithPack = function (packValue, customEggs = null) {
    productRadios.forEach(radio => {
      if (radio.value === packValue) {
        radio.checked = true;
      }
    });

    if (packValue === 'Tùy chọn số lượng' && customEggs) {
      if (customEggQuantity) customEggQuantity.value = Math.max(2500, customEggs);
    }

    recalculateOrderTotal();
    openBottomSheet();
  };

  // Back history interception for smooth UX
  history.replaceState({ page: 'home' }, '', window.location.href);

  window.addEventListener('popstate', function () {
    if (isFormOpen) {
      if (currentStep === 2) {
        goToOrderStep(1);
      } else {
        closeBottomSheet();
      }
    } else {
      const exitModal = document.getElementById('modalExitIntent');
      if (exitModal && exitModal.style.display !== 'flex') {
        history.pushState({ page: 'home' }, '', window.location.href.split('#')[0]);
        exitModal.style.display = 'flex';
      }
    }
  });

  // Step 1 to Step 2 validation
  if (btnNextToStep2) {
    btnNextToStep2.addEventListener('click', function () {
      const checkedRadio = document.querySelector('input[name="product_radio"]:checked');
      if (checkedRadio && checkedRadio.getAttribute('data-price') === 'custom') {
        const val = parseInt(customEggQuantity.value) || 0;
        if (val < 2500) {
          alert('Số lượng sỉ tối thiểu là 2.500 trứng. Vui lòng nhập từ 2.500 trở lên.');
          customEggQuantity.value = 2500;
          recalculateOrderTotal();
          customEggQuantity.focus();
          return;
        }
      }
      goToOrderStep(2);
      history.pushState({ page: 'order-form', step: 2 }, '', window.location.href.split('#')[0] + '#order-step2');
    });
  }

  if (btnBackToStep1) {
    btnBackToStep1.addEventListener('click', function () {
      goToOrderStep(1);
      if (history.state && history.state.step === 2) history.back();
    });
  }

  if (btnChangePack) {
    btnChangePack.addEventListener('click', function () {
      goToOrderStep(1);
      if (history.state && history.state.step === 2) history.back();
    });
  }

  // ===================================================
  // 7. ORDER CALCULATION & STEPPER LOGIC
  // ===================================================
  function recalculateOrderTotal() {
    const checkedRadio = document.querySelector('input[name="product_radio"]:checked');
    if (!checkedRadio) return;

    let price = 0;
    const shipFee = isFreeshipSaved ? 0 : 30000;

    if (checkedRadio.getAttribute('data-price') === 'custom') {
      if (customQtyContainer) customQtyContainer.style.display = 'block';
      if (comboQtyGroup) comboQtyGroup.style.display = 'none';

      let eggQty = parseInt(customEggQuantity.value) || 2500;
      if (eggQty < 2500) eggQty = 2500;
      price = eggQty * 1600;

      if (customPricePreview) customPricePreview.textContent = formatVND(price);
      const bonusEggs = Math.round(eggQty * 0.1);

      if (step1Subtotal) step1Subtotal.textContent = formatVND(price);
      if (step1GiftNotice) step1GiftNotice.textContent = `🎁 Đã gồm: Tặng thêm +${bonusEggs.toLocaleString('vi-VN')} trứng (10%)`;
    } else {
      if (customQtyContainer) customQtyContainer.style.display = 'none';
      if (comboQtyGroup) comboQtyGroup.style.display = 'block';

      const basePrice = parseInt(checkedRadio.getAttribute('data-price')) || 0;
      const qty = parseInt(comboQuantityInput.value) || 1;
      price = basePrice * qty;

      const bonus = checkedRadio.getAttribute('data-bonus') || '+10% trứng';
      if (step1Subtotal) step1Subtotal.textContent = formatVND(price);
      if (step1GiftNotice) step1GiftNotice.textContent = `🎁 Đã gồm: Tặng thêm ${bonus}`;
    }

    if (invoiceGoodsPrice) invoiceGoodsPrice.textContent = formatVND(price);

    const total = price + shipFee;
    if (invoiceTotal) invoiceTotal.textContent = formatVND(total);
    if (totalAmountHidden) totalAmountHidden.value = total;

    updateStep2Summary();
  }

  function updateStep2Summary() {
    const checkedRadio = document.querySelector('input[name="product_radio"]:checked');
    if (!checkedRadio) return;

    let price = 0;
    if (checkedRadio.getAttribute('data-price') === 'custom') {
      let eggQty = parseInt(customEggQuantity.value) || 2500;
      if (eggQty < 2500) eggQty = 2500;
      price = eggQty * 1600;
      const bonusEggs = Math.round(eggQty * 0.1);

      if (step2SelectedName) step2SelectedName.textContent = `Tự chọn ${eggQty.toLocaleString('vi-VN')} trứng giống`;
      if (step2SelectedDetail) step2SelectedDetail.textContent = `⚡ Tặng kèm: +${bonusEggs.toLocaleString('vi-VN')} trứng (10%)`;
      if (step2SelectedPrice) step2SelectedPrice.textContent = formatVND(price);
    } else {
      const basePrice = parseInt(checkedRadio.getAttribute('data-price')) || 0;
      const qty = parseInt(comboQuantityInput.value) || 1;
      price = basePrice * qty;
      const bonus = checkedRadio.getAttribute('data-bonus') || '+10% trứng';

      if (step2SelectedName) step2SelectedName.textContent = checkedRadio.value;
      if (step2SelectedDetail) step2SelectedDetail.textContent = `Số lượng: ${qty} combo • 🎁 Tặng kèm ${bonus}`;
      if (step2SelectedPrice) step2SelectedPrice.textContent = formatVND(price);
    }
  }

  productRadios.forEach(radio => {
    radio.addEventListener('change', recalculateOrderTotal);
  });

  if (btnMinusCombo) {
    btnMinusCombo.addEventListener('click', () => {
      let qty = parseInt(comboQuantityInput.value) || 1;
      if (qty > 1) {
        comboQuantityInput.value = qty - 1;
        recalculateOrderTotal();
      }
    });
  }

  if (btnPlusCombo) {
    btnPlusCombo.addEventListener('click', () => {
      let qty = parseInt(comboQuantityInput.value) || 1;
      comboQuantityInput.value = qty + 1;
      recalculateOrderTotal();
    });
  }

  if (btnEggMinus && btnEggPlus && customEggQuantity) {
    btnEggMinus.addEventListener('click', (e) => {
      e.preventDefault();
      let val = parseInt(customEggQuantity.value) || 2500;
      if (val > 2500) {
        let newVal = val - 100;
        if (newVal < 2500) newVal = 2500;
        customEggQuantity.value = newVal;
        recalculateOrderTotal();
      }
    });

    btnEggPlus.addEventListener('click', (e) => {
      e.preventDefault();
      let val = parseInt(customEggQuantity.value) || 2500;
      if (val < 2500) val = 2500;
      customEggQuantity.value = val + 100;
      recalculateOrderTotal();
    });

    customEggQuantity.addEventListener('input', recalculateOrderTotal);
    customEggQuantity.addEventListener('change', () => {
      let val = parseInt(customEggQuantity.value) || 2500;
      if (val < 2500) customEggQuantity.value = 2500;
      recalculateOrderTotal();
    });
  }

  recalculateOrderTotal();

  // ===================================================
  // 8. VIETNAM ADDRESS CASCADER (API + OFFLINE FALLBACK)
  // ===================================================
  const provinceSelect = document.getElementById('provinceSelect');
  const districtSelect = document.getElementById('districtSelect');
  const wardSelect = document.getElementById('wardSelect');

  function populateProvincesFallback() {
    if (typeof VIETNAM_PROVINCES !== 'undefined' && VIETNAM_PROVINCES.length > 0) {
      provinceSelect.innerHTML = '<option value="" disabled selected>1. Chọn Tỉnh / Thành phố</option>';
      VIETNAM_PROVINCES.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        provinceSelect.appendChild(opt);
      });

      provinceSelect.addEventListener('change', function () {
        districtSelect.innerHTML = '<option value="" disabled selected>2. Chọn hoặc nhập Quận / Huyện</option>';
        districtSelect.disabled = false;
        wardSelect.disabled = false;
        // Allow prompt or manual input if district list not loaded
        districtSelect.innerHTML += '<option value="TP/Thị xã/Huyện Trung Tâm">TP / Thị xã / Huyện Trung Tâm</option><option value="Khu Vực Khác">Khu Vực Khác (Ghi ở địa chỉ)</option>';
        wardSelect.innerHTML = '<option value="" disabled selected>3. Chọn Phường / Xã</option><option value="Trung Tâm">Phường / Xã Trung Tâm</option><option value="Khu Vực Khác">Khu Vực Khác (Ghi ở địa chỉ)</option>';
      });
    }
  }

  // Attempt live API with timeout & fallback
  fetch('https://provinces.open-api.vn/api/?depth=3', { signal: AbortSignal.timeout(4000) })
    .then(res => {
      if (!res.ok) throw new Error('API blocked');
      return res.json();
    })
    .then(data => {
      provinceSelect.innerHTML = '<option value="" disabled selected>1. Chọn Tỉnh / Thành phố</option>';
      data.forEach(p => {
        const option = document.createElement('option');
        option.value = p.name;
        option.textContent = p.name;
        provinceSelect.appendChild(option);
      });

      provinceSelect.addEventListener('change', function () {
        districtSelect.innerHTML = '<option value="" disabled selected>2. Chọn Quận / Huyện</option>';
        wardSelect.innerHTML = '<option value="" disabled selected>3. Chọn Phường / Xã</option>';
        districtSelect.disabled = false;
        wardSelect.disabled = true;

        const selProvince = data.find(p => p.name === this.value);
        if (selProvince && selProvince.districts) {
          selProvince.districts.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.name;
            opt.textContent = d.name;
            districtSelect.appendChild(opt);
          });
        }
      });

      districtSelect.addEventListener('change', function () {
        wardSelect.innerHTML = '<option value="" disabled selected>3. Chọn Phường / Xã</option>';
        wardSelect.disabled = false;

        const selProvince = data.find(p => p.name === provinceSelect.value);
        if (selProvince && selProvince.districts) {
          const selDistrict = selProvince.districts.find(d => d.name === this.value);
          if (selDistrict && selDistrict.wards) {
            selDistrict.wards.forEach(w => {
              const opt = document.createElement('option');
              opt.value = w.name;
              opt.textContent = w.name;
              wardSelect.appendChild(opt);
            });
          }
        }
      });
    })
    .catch(() => {
      console.log('Sử dụng dữ liệu 63 tỉnh thành dự phòng.');
      populateProvincesFallback();
    });

  // Phone Validation
  const phoneInput = document.getElementById('phone');
  const phoneErrorMsg = document.getElementById('phoneErrorMsg');
  const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

  phoneInput.addEventListener('input', function () {
    const val = this.value.trim();
    if (val.length > 0 && !phoneRegex.test(val)) {
      this.classList.add('is-invalid');
    } else {
      this.classList.remove('is-invalid');
    }
  });

  // ===================================================
  // 9. MODALS & SUBMISSION HANDLERS
  // ===================================================
  const btnProceedOrder = document.getElementById('btnProceedOrder');
  const orderForm = document.getElementById('orderForm');
  const modalConfirmBill = document.getElementById('modalConfirmBill');
  const modalForgotFreeship = document.getElementById('modalForgotFreeship');
  const modalExitIntent = document.getElementById('modalExitIntent');
  const modalSuccess = document.getElementById('modalSuccess');
  const loadingOverlay = document.getElementById('loadingOverlay');

  const btnCancelConfirm = document.getElementById('btnCancelConfirm');
  const btnFinalSubmit = document.getElementById('btnFinalSubmit');
  const btnSkipFreeship = document.getElementById('btnSkipFreeship');
  const btnApplyFreeshipNow = document.getElementById('btnApplyFreeshipNow');
  const btnStayOnPage = document.getElementById('btnStayOnPage');
  const btnConfirmExit = document.getElementById('btnConfirmExit');
  const btnCloseSuccessModal = document.getElementById('btnCloseSuccessModal');

  function openConfirmBillModal() {
    const fullname = document.getElementById('fullname').value.trim();
    const phone = phoneInput.value.trim();
    const street = document.getElementById('streetInput').value.trim();
    const ward = wardSelect.value || '';
    const district = districtSelect.value || '';
    const province = provinceSelect.value || '';

    const addressFull = `${street}, ${ward}, ${district}, ${province}`;
    const checkedRadio = document.querySelector('input[name="product_radio"]:checked');

    let displayProduct = checkedRadio.value;
    let displayQty = comboQuantityInput.value + ' combo';

    if (checkedRadio.getAttribute('data-price') === 'custom') {
      let eggQty = parseInt(customEggQuantity.value) || 2500;
      let bonusEggs = Math.round(eggQty * 0.1);
      displayProduct = `Tùy chọn ${eggQty.toLocaleString('vi-VN')} trứng (+${bonusEggs.toLocaleString('vi-VN')} tặng)`;
      displayQty = `${eggQty.toLocaleString('vi-VN')} trứng`;
    } else {
      const bonus = checkedRadio.getAttribute('data-bonus') || '+10% trứng';
      displayProduct = `${checkedRadio.value} (${bonus})`;
    }

    document.getElementById('confName').textContent = fullname;
    document.getElementById('confPhone').textContent = phone;
    document.getElementById('confAddress').textContent = addressFull;
    document.getElementById('confProduct').textContent = displayProduct;
    document.getElementById('confQuantity').textContent = displayQty;
    document.getElementById('confTotal').textContent = formatVND(totalAmountHidden.value);

    modalConfirmBill.style.display = 'flex';
  }

  if (btnProceedOrder) {
    btnProceedOrder.addEventListener('click', function () {
      if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
      }
      if (phoneInput.classList.contains('is-invalid')) {
        alert('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại!');
        phoneInput.focus();
        return;
      }

      if (!isFreeshipSaved) {
        modalForgotFreeship.style.display = 'flex';
      } else {
        openConfirmBillModal();
      }
    });
  }

  if (btnSkipFreeship) {
    btnSkipFreeship.addEventListener('click', function () {
      modalForgotFreeship.style.display = 'none';
      openConfirmBillModal();
    });
  }

  if (btnApplyFreeshipNow) {
    btnApplyFreeshipNow.addEventListener('click', function () {
      modalForgotFreeship.style.display = 'none';
      applyFreeshipAction();
      openConfirmBillModal();
    });
  }

  if (btnCancelConfirm) {
    btnCancelConfirm.addEventListener('click', function () {
      modalConfirmBill.style.display = 'none';
    });
  }

  // Google Apps Script Submission
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxR55m-6TAXw8hmAlI4tj5rv9TZIAc7RbyYzWlCgi2RZqtQIUQnrH0WTPhfeEqN3QN4Zw/exec';

  if (btnFinalSubmit) {
    btnFinalSubmit.addEventListener('click', function () {
      modalConfirmBill.style.display = 'none';
      loadingOverlay.style.display = 'flex';

      const checkedRadio = document.querySelector('input[name="product_radio"]:checked');
      let finalProduct = checkedRadio.value;
      let finalQuantity = comboQuantityInput.value;

      if (checkedRadio.getAttribute('data-price') === 'custom') {
        let eggQty = parseInt(customEggQuantity.value) || 2500;
        let bonus = Math.round(eggQty * 0.1);
        finalProduct = `Trứng Cào Cào (Tùy chọn ${eggQty} trứng + Tặng ${bonus} trứng)`;
        finalQuantity = eggQty.toString();
      } else {
        const bonus = checkedRadio.getAttribute('data-bonus') || '+10% trứng';
        finalProduct = `${checkedRadio.value} (Tặng ${bonus})`;
      }

      const street = document.getElementById('streetInput').value.trim();
      const ward = wardSelect.value || '';
      const district = districtSelect.value || '';
      const province = provinceSelect.value || '';
      const fullAddress = `${street}, ${ward}, ${district}, ${province}`;

      const formData = new FormData();
      formData.append('product', finalProduct);
      formData.append('quantity', finalQuantity);
      formData.append('fullname', document.getElementById('fullname').value.trim());
      formData.append('phone', phoneInput.value.trim());
      formData.append('address', fullAddress);
      formData.append('notes', document.getElementById('orderNotes').value.trim());
      formData.append('total', totalAmountHidden.value);

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      })
        .then(() => {
          loadingOverlay.style.display = 'none';
          closeBottomSheet();

          // Generate random order code
          const randomOrderCode = 'CC-' + Math.floor(10000 + Math.random() * 90000);
          document.getElementById('successOrderCode').textContent = randomOrderCode;
          modalSuccess.style.display = 'flex';

          orderForm.reset();
          goToOrderStep(1);
          districtSelect.disabled = true;
          wardSelect.disabled = true;
          recalculateOrderTotal();
        })
        .catch(() => {
          loadingOverlay.style.display = 'none';
          alert('Có lỗi xảy ra trong quá trình gửi đơn, vui lòng gọi điện thoại trực tiếp 0935.127.132 để chốt đơn nhanh nhất!');
        });
    });
  }

  if (btnCloseSuccessModal) {
    btnCloseSuccessModal.addEventListener('click', function () {
      modalSuccess.style.display = 'none';
    });
  }

  if (btnStayOnPage) {
    btnStayOnPage.addEventListener('click', function () {
      modalExitIntent.style.display = 'none';
    });
  }

  if (btnConfirmExit) {
    btnConfirmExit.addEventListener('click', function () {
      modalExitIntent.style.display = 'none';
      history.go(-2);
    });
  }

  // Desktop Mouseout Exit-Intent
  let hasTriggeredExitIntent = false;
  document.addEventListener('mouseleave', function (e) {
    if (e.clientY <= 0 && !hasTriggeredExitIntent && !isFormOpen) {
      hasTriggeredExitIntent = true;
      modalExitIntent.style.display = 'flex';
    }
  });

});
