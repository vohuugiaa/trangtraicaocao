function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  var time = new Date();
  var formattedTime = Utilities.formatDate(time, "GMT+7", "dd/MM/yyyy HH:mm:ss");
  
  // Nhận dữ liệu từ form
  var row = [
    formattedTime,
    e.parameter.product || "",
    e.parameter.quantity || "",
    e.parameter.fullname || "",
    e.parameter.phone || "",
    e.parameter.address || "",
    e.parameter.notes || "",
    e.parameter.total || ""
  ];
  
  sheet.appendRow(row);
  
  return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
