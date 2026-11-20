/**
 * ========================================================
 * 🏆 مسابقة بطل العالمية إكسبريس | سكريبت إنشاء استمارة Google Form تلقائياً
 * ========================================================
 * طريقة الاستخدام في 30 ثانية:
 * 1. افتح الرابط: https://script.google.com
 * 2. اضغط "مشروع جديد" (New Project).
 * 3. امسح أي كود موجود والصق هذا الكود بالكامل.
 * 4. اضغط على زر "تشغيل" (Run) بالأعلى.
 * 5. ستظهر لك روابط الفورم جاهزة فوراً في الأسفل (Execution log):
 *    - رابط المتسابقين (لصقه في الموقع).
 *    - رابط شيت الإكسيل (لمتابعة الفائزين وبيانات محافظهم).
 */

function createAlamiaWinnersForm() {
  // إنشاء الفورم في حسابك
  var form = FormApp.create('🏆 مسابقة بطل العالمية إكسبريس | استمارة استلام الجوائز');
  
  form.setDescription(
    '🎉 ألف مبروك فوزك يا بطل العالمية!\n' +
    'يرجى ملء البيانات بدقة بالغة للتأكد من حسابك وتحويل مبلغ الجائزة فوراً إلى محفظتك أو حساب انستاباي الخاص بك.\n' +
    '⚠️ تنبيه: يرجى التأكد من كتابة كود الموظف ورقم المحفظة بشكل صحيح لتجنب تأخير التحويل.'
  );

  // 1. الاسم بالكامل
  form.addTextItem()
      .setTitle('1. اسم الموظف بالكامل (كما يظهر في الموقع وبطاقة الرقم القومي)')
      .setRequired(true);

  // 2. كود الموظف
  form.addTextItem()
      .setTitle('2. كود الموظف (ID)')
      .setHelpText('مثال: 4765621')
      .setRequired(true);

  // 3. الرقم القومي
  form.addTextItem()
      .setTitle('3. الرقم القومي (14 رقم)')
      .setRequired(true);

  // 4. نوع الجائزة المستحقة
  var prizeItem = form.addMultipleChoiceItem();
  prizeItem.setTitle('4. الجائزة التي فزت بها في كارت السكراتش')
           .setChoiceValues([
             '💵 مكافأة 100 جنيه كاش فوري',
             '💴 مكافأة 200 جنيه كاش فوري'
           ])
           .setRequired(true);

  // 5. طريقة استلام المبلغ
  var methodItem = form.addMultipleChoiceItem();
  methodItem.setTitle('5. طريقة استلام الجائزة المفضلة لديك')
            .setChoiceValues([
              '🔴 محفظة فودافون كاش (Vodafone Cash)',
              '🟣 انستاباي (InstaPay)',
              '🟠 محفظة أورنج كاش (Orange Cash)',
              '🟢 محفظة اتصالات كاش (Etisalat Cash)'
            ])
            .setRequired(true);

  // 6. رقم المحفظة أو عنوان InstaPay
  form.addTextItem()
      .setTitle('6. رقم المحفظة (01xxxxxxxxx) أو عنوان انستاباي (IPA)')
      .setHelpText('تأكد أن الرقم عليه محفظة كاش مفعلة أو عنوان انستاباي صحيح')
      .setRequired(true);

  // 7. تأكيد أخذ السكرين شوت
  var confirmItem = form.addCheckboxItem();
  confirmItem.setTitle('7. تأكيد السكرين شوت')
             .setChoiceValues(['نعم، قمت بأخذ سكرين شوت لشاشة الفوز وجاهز لإرسالها عند الطلب'])
             .setRequired(true);

  // السماح بإجابة واحدة لكل بريد إذا أردت
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(false);

  // إنشاء شيت إكسيل تلقائي وربطه بالفورم لاستقبال النتائج لايف!
  var sheet = SpreadsheetApp.create('📊 ردود وبيانات الفائزين - مسابقة بطل العالمية');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('========================================================');
  Logger.log('🎉 تم إنشاء الفورم والشيت بنجاح في حسابك على Google!');
  Logger.log('👉 رابط المتسابقين لملء الفورم:');
  Logger.log(form.getPublishedUrl());
  Logger.log('👉 رابط شيت الإكسيل لمتابعة الفائزين لايف:');
  Logger.log(sheet.getUrl());
  Logger.log('========================================================');
}
