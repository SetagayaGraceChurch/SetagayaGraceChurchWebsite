function doGet() {
  const sheetId = 'PUT_YOUR_SHEET_ID_HERE';
  const tabName = 'Sermons';
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(tabName);
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) {
    return ContentService
      .createTextOutput(JSON.stringify({ sermons: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = values[0].map(String);
  const rows = values.slice(1).map((row) => {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = row[index];
    });
    return item;
  });

  return ContentService
    .createTextOutput(JSON.stringify({ sermons: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

function triggerNetlifyBuild() {
  const buildHookUrl = 'PUT_YOUR_NETLIFY_BUILD_HOOK_HERE';
  UrlFetchApp.fetch(buildHookUrl, { method: 'post' });
}
