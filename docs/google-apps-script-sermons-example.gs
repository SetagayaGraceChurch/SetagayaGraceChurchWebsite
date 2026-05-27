const SPREADSHEET_ID = '1tfzY04lbYgOSTfLLoC-0L_hPixhHj3uGsH1OMMRXdlM';
const SERMONS_SHEET_NAME = 'Sermons';
const PUBLISH_LOG_SHEET_NAME = 'Publish Log';
const NETLIFY_BUILD_HOOK_URL = 'https://api.netlify.com/build_hooks/6a165186ee3a1685cbca77d1';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Website')
    .addItem('Publish', 'publishToWebsite')
    .addToUi();
}

function doGet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SERMONS_SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) {
    return ContentService
      .createTextOutput(JSON.stringify({ sermons: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const headers = values[0].map((header) => String(header).trim());
  const rows = values.slice(1)
    .filter((row) => row.some((cell) => String(cell).trim() !== ''))
    .map((row) => {
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

function publishToWebsite() {
  if (!NETLIFY_BUILD_HOOK_URL || NETLIFY_BUILD_HOOK_URL === 'PUT_YOUR_NETLIFY_BUILD_HOOK_HERE') {
    throw new Error('Set NETLIFY_BUILD_HOOK_URL before publishing.');
  }

  const logSheet = getOrCreatePublishLogSheet_();
  const requestedAt = new Date();
  const requestedBy = Session.getActiveUser().getEmail() || 'Unknown user';

  writePublishStatus_(logSheet, {
    requestedAt,
    requestedBy,
    status: 'Publishing...',
    deployUrl: '',
    message: '',
  });

  try {
    const response = UrlFetchApp.fetch(NETLIFY_BUILD_HOOK_URL, {
      method: 'post',
      muteHttpExceptions: true,
    });

    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    const deployUrl = extractDeployUrl_(responseText);
    const status = responseCode >= 200 && responseCode < 300 ? 'Build triggered' : `Trigger failed (${responseCode})`;

    writePublishStatus_(logSheet, {
      requestedAt,
      requestedBy,
      status,
      deployUrl,
      message: truncate_(responseText, 500),
    });

    SpreadsheetApp.getUi().alert(
      responseCode >= 200 && responseCode < 300
        ? 'Netlify build triggered successfully.'
        : `Netlify trigger returned HTTP ${responseCode}. Check the Publish Log tab.`
    );
  } catch (error) {
    writePublishStatus_(logSheet, {
      requestedAt,
      requestedBy,
      status: 'Trigger failed',
      deployUrl: '',
      message: String(error),
    });

    SpreadsheetApp.getUi().alert(`Publish failed: ${error}`);
    throw error;
  }
}

function getOrCreatePublishLogSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(PUBLISH_LOG_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(PUBLISH_LOG_SHEET_NAME);
    sheet.getRange('A1:B5').setValues([
      ['Last Publish Requested', ''],
      ['Requested By', ''],
      ['Status', ''],
      ['Deploy URL', ''],
      ['Message', ''],
    ]);
    sheet.getRange('A7:E7').setValues([
      ['Requested At', 'Requested By', 'Status', 'Deploy URL', 'Message'],
    ]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 5);
  }

  return sheet;
}

function writePublishStatus_(sheet, payload) {
  sheet.getRange('B1').setValue(payload.requestedAt);
  sheet.getRange('B2').setValue(payload.requestedBy);
  sheet.getRange('B3').setValue(payload.status);
  sheet.getRange('B4').setValue(payload.deployUrl);
  sheet.getRange('B5').setValue(payload.message);

  sheet.appendRow([
    payload.requestedAt,
    payload.requestedBy,
    payload.status,
    payload.deployUrl,
    payload.message,
  ]);
}

function extractDeployUrl_(responseText) {
  if (!responseText) return '';

  try {
    const parsed = JSON.parse(responseText);
    return parsed.deploy_url || parsed.deploy_ssl_url || parsed.url || '';
  } catch (error) {
    return '';
  }
}

function truncate_(value, maxLength) {
  const text = String(value || '');
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}
