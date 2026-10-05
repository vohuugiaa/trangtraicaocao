function doPost(e) {
  try {
    // 1. Kết nối Google Sheet
    var sheetUrl = "https://docs.google.com/spreadsheets/d/1TfaUtjkNb0ohrP4zcUN-Mw75Ain5XZojFxQEABCFhdU/edit?gid=0#gid=0";
    var sheet = SpreadsheetApp.openByUrl(sheetUrl).getSheets()[0];
    
    var time = new Date();
    var formattedTime = Utilities.formatDate(time, "GMT+7", "dd/MM/yyyy HH:mm:ss");
    
    var product = e.parameter.product || "";
    var quantity = e.parameter.quantity || "";
    var fullname = e.parameter.fullname || "";
    var phone = e.parameter.phone || "";
    var address = e.parameter.address || "";
    var notes = e.parameter.notes || "";
    var total = e.parameter.total || "";
    
    // Format hiển thị tiền VNĐ (VD: 299000 -> 299.000₫)
    var formattedTotal = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "₫";

    // 2. Ghi dữ liệu vào Google Sheet (thêm ' để giữ số 0 ở đầu)
    var row = [
      formattedTime,
      product,
      quantity,
      fullname,
      "'" + phone,
      address,
      notes,
      total
    ];
    sheet.appendRow(row);

    // 3. Gửi thông báo đến nhóm Telegram
    var botToken = "8939516474:AAGQ2NED9XLR2V2Es0pbAcGb7MOhKKgKAA8";
    var chatId = "-5589087762";

    var message = "🔔 <b>CÓ ĐƠN ĐẶT HÀNG MỚI!</b>\n\n" +
                  "⏰ <b>Thời gian:</b> " + formattedTime + "\n" +
                  "📦 <b>Sản phẩm:</b> " + escapeHtml(product) + "\n" +
                  "🔢 <b>Số lượng:</b> " + escapeHtml(quantity) + " hộp\n" +
                  "👤 <b>Khách hàng:</b> " + escapeHtml(fullname) + "\n" +
                  "📞 <b>Số điện thoại:</b> " + escapeHtml(phone) + "\n" +
                  "📍 <b>Địa chỉ:</b> " + escapeHtml(address) + "\n" +
                  "📝 <b>Ghi chú:</b> " + (notes ? escapeHtml(notes) : "Không có") + "\n" +
                  "💰 <b>Tổng tiền:</b> <b>" + formattedTotal + "</b>";

    var telegramUrl = "https://api.telegram.org/bot" + botToken + "/sendMessage";
    var payload = {
      "chat_id": chatId,
      "text": message,
      "parse_mode": "HTML"
    };

    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };

    UrlFetchApp.fetch(telegramUrl, options);

    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm hỗ trợ chống lỗi ký tự trên Telegram
function escapeHtml(text) {
  if (!text) return "";
  return text.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// HÀM TEST BẮN TIN NHẮN THỬ VÀO TELEGRAM
function testTelegram() {
  var botToken = "8939516474:AAGQ2NED9XLR2V2Es0pbAcGb7MOhKKgKAA8";
  var chatId = "-5589087762";
  var url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
  var payload = {
    "chat_id": chatId,
    "text": "🎉 Chúc mừng! Bot Telegram đã kết nối thành công với Google Sheets!",
    "parse_mode": "HTML"
  };
  var res = UrlFetchApp.fetch(url, {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  });
  Logger.log(res.getContentText());
}
