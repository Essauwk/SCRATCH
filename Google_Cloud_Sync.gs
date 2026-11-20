/**
 * ========================================================
 * 🏆 سكريبت المزامنة السحابية الحية (Live Cloud Webhook API)
 * مسابقة بطل العالمية إكسبريس
 * ========================================================
 * يربط موقع السكراتش بشيت جوجل لايف:
 * 1. أي متسابق يخربش من تليفونه يتسجل فوراً في الشيت.
 * 2. أي فائز يسجل رقم محفظته أو انستاباي ينزل فوراً في الشيت.
 * 3. لوحة الإدارة (admin.html) تقرأ وتحدث البيانات لايف من كل الأجهزة.
 * 4. لما تعلم "استلم" في الإدارة، تتحدث في الشيت فوراً.
 * 5. لما تعدل أرقام المخزن في الإدارة، تتحدث في الشيت وتطبق على كل الأجهزة فوراً.
 * 6. لما تصفر التيست (ID 1-10) يتم مسحهم فوراً من الشيت.
 * ========================================================
 * طريقة التشغيل والتفعيل في دقيقة واحدة:
 * 1. في نفس صفحة Apps Script (script.google.com):
 *    امسح الكود القديم والصق هذا الكود بالكامل مكانه.
 * 2. اختر من القائمة بالأعلى دالة: (setupDatabaseSheet) واضغط "تشغيل" (Run) مرة واحدة.
 * 3. اضغط من أعلى اليمين على "نشر" (Deploy) -> "نشر جديد" (New deployment).
 * 4. اضغط على الترس (⚙️) بجانب Select type واختر "تطبيق ويب" (Web app).
 * 5. اضبط الإعدادات كالتالي:
 *    - Description: "Alalamia Live Cloud API"
 *    - Execute as: "أنا" (Me).
 *    - Who has access: "أي شخص" (Anyone) -> مهم جداً ليعمل من كل الموبايلات.
 * 6. اضغط "Deploy" (نشر) وانسخ رابط Web App URL الناتج وضعه في لوحة الإدارة!
 * ========================================================
 */

// اسم الشيت المركزي في حسابك على Google Drive
var SPREADSHEET_NAME = '📊 قاعدة بيانات ومشاركات مسابقة بطل العالمية لايف';

function getOrCreateSpreadsheet() {
  var files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  var ss = SpreadsheetApp.create(SPREADSHEET_NAME);
  setupSheets(ss);
  return ss;
}

function setupSheets(ss) {
  // 1. شيت المشاركات
  var sheet = ss.getSheetByName('المشاركات') || ss.insertSheet('المشاركات');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'كود الموظف',
      'اسم المتسابق',
      'الرقم القومي',
      'المنطقة / الفرع',
      'النتيجة',
      'الجائزة',
      'طريقة الاستلام',
      'رقم المحفظة / انستاباي',
      'حالة الاستلام',
      'التاريخ والوقت',
      'نوع الحساب'
    ]);
    sheet.getRange(1, 1, 1, 11).setBackground('#1e293b').setFontColor('#FFE500').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // 2. شيت المخزن
  var invSheet = ss.getSheetByName('المخزن') || ss.insertSheet('المخزن');
  if (invSheet.getLastRow() === 0) {
    invSheet.appendRow(['نوع الجائزة', 'الرصيد المتبقي', 'الرصيد الابتدائي']);
    invSheet.appendRow(['100 جنيه 💵', 500, 500]);
    invSheet.appendRow(['200 جنيه 💴', 300, 300]);
    invSheet.getRange(1, 1, 1, 3).setBackground('#0f172a').setFontColor('#38bdf8').setFontWeight('bold');
  }

  // حذف الشيت الافتراضي إذا وجد
  var defaultSheet = ss.getSheetByName('ورقة 1') || ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e){}
  }
}

// دالة الإعداد الأولى (Run setupDatabaseSheet)
function setupDatabaseSheet() {
  var ss = getOrCreateSpreadsheet();
  setupSheets(ss);
  Logger.log('========================================================');
  Logger.log('✅ تم تجهيز الشيت بنجاح!');
  Logger.log('👉 رابط شيت الإكسيل لمتابعة الفائزين لايف:');
  Logger.log(ss.getUrl());
  Logger.log('========================================================');
}

// ========================================================
// 📡 استقبال البيانات من الهواتف والموقع (POST Webhook)
// ========================================================
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return makeJsonResponse({ status: 'error', message: 'No post data' });
    }
    var raw = e.postData.contents;
    var data = JSON.parse(raw);
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheetByName('المشاركات');
    var invSheet = ss.getSheetByName('المخزن');
    var action = data.action;

    // 1. تسجيل خربشة جديدة
    if (action === 'record') {
      var user = data.user || {};
      var prize = data.prize || {};
      var userId = String(user.id || '').trim();

      var rowIndex = findRowByUserId(sheet, userId);
      var isWin = prize.isWinner ? 'فائز' : 'حظ أوفر';
      var isPaid = data.isPaid ? 'تم التسليم' : 'قيد الانتظار';
      var type = user.isTest ? 'حساب تجريبي' : 'متسابق حقيقي';
      var nowStr = data.formattedDate || new Date().toLocaleString('ar-EG');
      var method = data.claimInfo ? data.claimInfo.method : 'لم يسجل';
      var account = data.claimInfo ? data.claimInfo.account : '-';

      var rowData = [
        userId,
        user.name || '',
        "'" + (user.nationalId || ''),
        user.region || '',
        isWin,
        prize.title || '',
        method,
        account,
        isPaid,
        nowStr,
        type
      ];

      if (rowIndex > 0) {
        // تحديث الصف وحفظ حالة الاستلام لو كانت مسجلة مسبقاً
        var existingPaid = sheet.getRange(rowIndex, 9).getValue();
        if (existingPaid && existingPaid !== '') {
          rowData[8] = existingPaid;
        }
        var existingMethod = sheet.getRange(rowIndex, 7).getValue();
        var existingAccount = sheet.getRange(rowIndex, 8).getValue();
        if (method === 'لم يسجل' && existingMethod && existingMethod !== 'لم يسجل') {
          rowData[6] = existingMethod;
          rowData[7] = existingAccount;
        }
        sheet.getRange(rowIndex, 1, 1, 11).setValues([rowData]);
      } else {
        sheet.appendRow(rowData);
        // خصم من المخزن السحابي لو فائز وحقيقي
        if (prize.isWinner && !user.isTest) {
          decrementCloudInventory(invSheet, prize.prizeKey, prize.title);
        }
      }

      return makeJsonResponse({ status: 'success', message: 'Recorded successfully' });
    }

    // 2. تحديث بيانات الاستلام (محفظة / انستاباي)
    if (action === 'claim') {
      var uid = String(data.userId || '').trim();
      var cInfo = data.claimInfo || {};
      var rIdx = findRowByUserId(sheet, uid);
      if (rIdx > 0) {
        sheet.getRange(rIdx, 7).setValue(cInfo.method || 'محفظة كاش');
        sheet.getRange(rIdx, 8).setValue(cInfo.account || '');
      }
      return makeJsonResponse({ status: 'success', message: 'Claim updated' });
    }

    // 3. تحديث حالة "استلم" من لوحة الإدارة
    if (action === 'togglePaid') {
      var uid = String(data.userId || '').trim();
      var rIdx = findRowByUserId(sheet, uid);
      if (rIdx > 0) {
        sheet.getRange(rIdx, 9).setValue(data.isPaid ? 'تم التسليم' : 'قيد الانتظار');
      }
      return makeJsonResponse({ status: 'success', message: 'Paid status updated' });
    }

    // 4. تحديث رصيد المخزن من لوحة الإدارة
    if (action === 'updateInventory') {
      if (invSheet) {
        if (data.prize100 !== undefined) invSheet.getRange(2, 2).setValue(data.prize100);
        if (data.prize200 !== undefined) invSheet.getRange(3, 2).setValue(data.prize200);
      }
      return makeJsonResponse({ status: 'success', message: 'Inventory updated' });
    }

    // 5. تصفير حسابات التيست (ID 1-10)
    if (action === 'resetTest') {
      var numRows = sheet.getLastRow();
      if (numRows > 1) {
        var values = sheet.getRange(2, 1, numRows - 1, 11).getValues();
        for (var i = values.length - 1; i >= 0; i--) {
          var idVal = String(values[i][0]).trim();
          var typeVal = String(values[i][10]).trim();
          if (typeVal === 'حساب تجريبي' || ['1','2','3','4','5','6','7','8','9','10'].indexOf(idVal) !== -1) {
            sheet.deleteRow(i + 2);
          }
        }
      }
      return makeJsonResponse({ status: 'success', message: 'Test accounts cleared' });
    }

    return makeJsonResponse({ status: 'ignored' });
  } catch (err) {
    return makeJsonResponse({ status: 'error', message: err.toString() });
  }
}

// ========================================================
// 📥 إرسال البيانات للوحة الإدارة (GET Request)
// ========================================================
function doGet(e) {
  try {
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheetByName('المشاركات');
    var invSheet = ss.getSheetByName('المخزن');

    var participations = {};
    var numRows = sheet ? sheet.getLastRow() : 0;

    if (numRows > 1) {
      var rows = sheet.getRange(2, 1, numRows - 1, 11).getValues();
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var uid = String(r[0]).trim();
        if (!uid) continue;

        var isWin = (String(r[4]).trim() === 'فائز');
        var isPaid = (String(r[8]).trim() === 'تم التسليم');
        var isTest = (String(r[10]).trim() === 'حساب تجريبي');

        participations[uid] = {
          userId: uid,
          userName: String(r[1]),
          nationalId: String(r[2]).replace(/^'/, ''),
          userRegion: String(r[3]),
          prize: {
            isWinner: isWin,
            title: String(r[5]),
            isTest: isTest
          },
          isPaid: isPaid,
          isTest: isTest,
          formattedDate: String(r[9]),
          claimInfo: (r[6] && r[6] !== 'لم يسجل') ? {
            method: String(r[6]),
            account: String(r[7]),
            formattedDate: String(r[9]),
            isPaid: isPaid
          } : null
        };
      }
    }

    // المخزن
    var p100 = 500, p200 = 300;
    if (invSheet && invSheet.getLastRow() >= 3) {
      p100 = parseInt(invSheet.getRange(2, 2).getValue(), 10) || 0;
      p200 = parseInt(invSheet.getRange(3, 2).getValue(), 10) || 0;
    }

    return makeJsonResponse({
      status: 'success',
      totalRecords: Object.keys(participations).length,
      participations: participations,
      inventory: { prize100: p100, prize200: p200 }
    });

  } catch (err) {
    return makeJsonResponse({ status: 'error', message: err.toString() });
  }
}

// وظائف مساعدة
function findRowByUserId(sheet, userId) {
  if (!sheet) return 0;
  var numRows = sheet.getLastRow();
  if (numRows <= 1) return 0;
  var target = String(userId).trim();
  var ids = sheet.getRange(2, 1, numRows - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]).trim() === target) {
      return i + 2;
    }
  }
  return 0;
}

function decrementCloudInventory(invSheet, prizeKey, prizeTitle) {
  if (!invSheet) return;
  var row = 2; // افتراضي 100
  if (prizeKey === 'prize200' || (prizeTitle && String(prizeTitle).indexOf('200') !== -1)) {
    row = 3;
  }
  var current = parseInt(invSheet.getRange(row, 2).getValue(), 10) || 0;
  if (current > 0) {
    invSheet.getRange(row, 2).setValue(current - 1);
  }
}

function makeJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
