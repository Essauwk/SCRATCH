import json
import re
import openpyxl
import pandas as pd

# Load existing name translation cache
with open('name_translation_cache.json', 'r', encoding='utf-8') as f:
    cache = json.load(f)

# Word mapping learned from cache
word_map = {}
for en, ar in cache.items():
    en_words = re.split(r'[\s\-]+', en.strip().lower())
    ar_words = re.split(r'[\s\-]+', ar.strip())
    if len(en_words) == len(ar_words):
        for ew, aw in zip(en_words, ar_words):
            if ew not in word_map: word_map[ew] = {}
            word_map[ew][aw] = word_map[ew].get(aw, 0) + 1

best_word_map = {ew: max(aws.items(), key=lambda x: x[1])[0] for ew, aws in word_map.items()}

extra_words = {
    'aal': 'العال', 'abdalouhab': 'عبد الوهاب', 'abdalqadir': 'عبد القادر', 'abdelaaty': 'عبد العاطي',
    'abdelazim': 'عبد العظيم', 'abdelaziz': 'عبد العزيز', 'abdelfatah': 'عبد الفتاح', 'abdelgawad': 'عبد الجواد',
    'abdelghafar': 'عبد الغفار', 'abdelghaffar': 'عبد الغفار', 'abdelghani': 'عبد الغني', 'abdelghfar': 'عبد الغفار',
    'abdelhakam': 'عبد الحكم', 'abdelhakim': 'عبد الحكيم', 'abdelhaleem': 'عبد الحليم', 'abdelhamed': 'عبد الحميد',
    'abdelhaq': 'عبد الحق', 'abdelhaseeb': 'عبد الحسيب', 'abdelkader': 'عبد القادر', 'abdelmajeed': 'عبد المجيد',
    'abdelmalak': 'عبد الملاك', 'abdelmasih': 'عبد المسيح', 'abdelmawgod': 'عبد الموجود', 'abdelmawjoud': 'عبد الموجود',
    'abdelmawla': 'عبد المولى', 'abdelnabi': 'عبد النبي', 'abdelqawi': 'عبد القوي', 'abdelrahim': 'عبد الرحيم',
    'abdelrhman': 'عبد الرحمن', 'abdelsayed': 'عبد السيد', 'abdelshafi': 'عبد الشافي', 'abdeltawab': 'عبد التواب',
    'abdelzaher': 'عبد الظاهر', 'abdulaziz': 'عبد العزيز', 'abdulhameed': 'عبد الحميد', 'abdulmajid': 'عبد المجيد',
    'abdulmoneim': 'عبد المنعم', 'abdulmubdi': 'عبد المبدئ', 'abdulwahid': 'عبد الواحد', 'abeer': 'عبير',
    'aboualmjd': 'أبو المجد', 'abualfadl': 'أبو الفضل', 'abulwafa': 'أبو الوفا', 'aburahab': 'أبو رحاب',
    'aburehab': 'أبو رحاب', 'abusarea': 'أبو سريع', 'adly': 'عدلي', 'alaaeldin': 'علاء الدين', 'alanwar': 'الأنور',
    'albaz': 'الباز', 'albehery': 'البحيري', 'aldesouki': 'الدسوقي', 'algharib': 'الغريب', 'alhussien': 'الحسين',
    'allawa': 'علاوة', 'almaez': 'المعز', 'almutawalli': 'المتولي', 'alrashidi': 'الرشيدي', 'alsayyid': 'السيد',
    'altabey': 'التابعي', 'alzahri': 'الزهري', 'ameira': 'عميرة', 'arif': 'عارف', 'atteyia': 'عطية',
    'awadallah': 'عوض الله', 'awida': 'عويضة', 'ayd': 'عيد', 'babawi': 'باباوي', 'badri': 'بدري',
    'barani': 'براني', 'bavly': 'بافلي', 'beshir': 'بشير', 'din': 'الدين', 'el': 'ال', 'elaal': 'العال',
    'elhoseen': 'الحسين', 'elhusseini': 'الحسيني', 'elsafi': 'الصافي', 'elshatouri': 'الشاطوري',
    'eltaher': 'الطاهر', 'elwasely': 'الواصلي', 'elzalaty': 'الزلاطي', 'esayed': 'السيد',
    'essameldin': 'عصام الدين', 'ezz': 'عز', 'faheem': 'فهيم', 'farij': 'فريح', 'fattah': 'فتاح',
    'fawi': 'فاوي', 'fayad': 'فياض', 'fayed': 'فايد', 'gaid': 'جايد', 'ghaffar': 'غفار', 'ghania': 'غنية',
    'goumaa': 'جمعة', 'hafiz': 'حافظ', 'hamdallah': 'حمد الله', 'hammoudeh': 'حمودة', 'haytham': 'هيثم',
    'hegazi': 'حجازي', 'helmi': 'حلمي', 'hijazi': 'حجازي', 'hossameldin': 'حسام الدين', 'husseini': 'الحسيني',
    'issawi': 'عيساوي', 'jack': 'جاك', 'jalil': 'جليل', 'latif': 'لطيف', 'louay': 'لؤي', 'maddah': 'مداح',
    'magd': 'مجد', 'magid': 'ماجد', 'majd': 'مجد', 'makarem': 'المكارم', 'maksoud': 'مقصود', 'malhi': 'ملحي',
    'manshawi': 'المنشاوي', 'maowya': 'معاوية', 'mastour': 'مستور', 'mawjoud': 'موجود', 'mbrouk': 'مبروك',
    'mechaly': 'مشالي', 'mekki': 'مكي', 'mimi': 'ميمي', 'moaty': 'معطي', 'mohameden': 'محمدين',
    'mohi': 'محي', 'morad': 'مراد', 'mumin': 'مؤمن', 'musab': 'مصعب', 'musaed': 'مساعد',
    'mutawalli': 'متولي', 'nabi': 'نبي', 'nabih': 'نبيه', 'nageib': 'نجيب', 'nagih': 'ناجح',
    'nahmouda': 'نحمده', 'nassef': 'ناصف', 'noureldin': 'نور الدين', 'pasha': 'باشا', 'qadab': 'قضب',
    'qarqar': 'قرقر', 'qawi': 'قوي', 'rabiei': 'ربيعي', 'regal': 'رجال', 'saadalden': 'سعد الدين',
    'saadelden': 'سعد الدين', 'sabour': 'صبور', 'safi': 'صافي', 'saifullah': 'سيف الله',
    'salaheldin': 'صلاح الدين', 'salameh': 'سلامة', 'salib': 'صليب', 'samad': 'صمد', 'sawabi': 'صوابي',
    'shamekh': 'شامخ', 'shennawy': 'الشناوي', 'sherbini': 'الشربيني', 'sherief': 'شريف',
    'shuayb': 'شعيب', 'sidqi': 'صدقي', 'sirajeldin': 'سراج الدين', 'somida': 'صميدة',
    'souliman': 'سليمان', 'surur': 'سرور', 'tabei': 'تابعي', 'talab': 'طلب', 'taleb': 'طالب',
    'tamim': 'تميم', 'tawab': 'تواب', 'tayeh': 'تايه', 'touson': 'طوسون', 'wadi': 'وديع',
    'wahhab': 'وهاب', 'zaaman': 'زعمان', 'zeidan': 'زيدان', 'zekaria': 'زكريا', 'zikri': 'ذكري',
    'abdel': 'عبد', 'abdul': 'عبد', 'al': 'ال', 'abu': 'أبو', 'abou': 'أبو', 'abo': 'أبو',
    'ibrahim': 'ابراهيم', 'ali': 'علي', 'ahmed': 'أحمد', 'mohamed': 'محمد', 'mahmoud': 'محمود',
    'mustafa': 'مصطفى', 'mostafa': 'مصطفى', 'hassan': 'حسن', 'hussein': 'حسين', 'sayed': 'سيد'
}
best_word_map.update(extra_words)

# Comprehensive Zone mapping
ZONE_MAP = {
    '10th of ramadan': 'العاشر من رمضان',
    'ain shams': 'عين شمس',
    'al mahallah al kubra': 'المحلة الكبرى',
    'alex ahmed gaber': 'الإسكندرية (أحمد جابر)',
    'alexandria': 'الإسكندرية',
    'assiut': 'أسيوط',
    'banha city': 'بنها',
    'beni suef': 'بني سويف',
    'cairo_city_centre': 'وسط البلد',
    'damanhour': 'دمنهور',
    'damietta': 'دمياط',
    'el rehab city': 'الرحاب',
    'giza': 'الجيزة',
    'hadayek el ahram': 'حدائق الأهرام',
    'hadayek el qobba': 'حدائق القبة',
    'heliopolis': 'مصر الجديدة',
    'helwan': 'حلوان',
    'ismalia city': 'الإسماعيلية',
    'maadi': 'المعادي',
    'madinaty': 'مدينتي',
    'mansoura': 'المنصورة',
    'minya': 'المنيا',
    'mohandiseen': 'المهندسين',
    'mokattam': 'المقطم',
    'nasr city': 'مدينة نصر',
    'new damietta': 'دمياط الجديدة',
    'obour city': 'العبور',
    'october': 'أكتوبر',
    'october wahat': 'أكتوبر الواحات',
    'october palm hills': 'أكتوبر بالم هيلز',
    'portsaid city': 'بورسعيد',
    'ras el bar': 'رأس البر',
    'sadat city': 'مدينة السادات',
    'sheikh zayed': 'الشيخ زايد',
    'shobra': 'شبرا',
    'shorouk city': 'الشروق',
    'smart village': 'القرية الذكية',
    'suez': 'السويس',
    'tagammoa north': 'التجمع شمال',
    'tagammoa golden square': 'التجمع الجولدن سكوير',
    'tagammoa south': 'التجمع جنوب',
    'tanta': 'طنطا',
    'zagazig': 'الزقازيق',
    
    # Noon Zones
    '6th of october': 'السادس من أكتوبر',
    'al rehab': 'الرحاب',
    'al zaitoun': 'الزيتون',
    'dokki': 'الدقي',
    'el sahel shoubra masr': 'الساحل شبرا مصر',
    'fifth settlement - 1st district': 'التجمع الخامس - الحي الأول',
    'first settlement - el banafseg': 'التجمع الأول - البنفسج',
    'garden city': 'جاردن سيتي',
    'hadayek al ahram': 'حدائق الأهرام',
    'haram': 'الهرم',
    'nasr city - 9th district': 'مدينة نصر - الحي التاسع',
    'nasr city 2': 'مدينة نصر 2',
    'new cairo - one golden sq': 'القاهرة الجديدة - وان جولدن سكوير',
    'new cairo - south investors': 'القاهرة الجديدة - المستثمرين جنوب',
    'new giza': 'نيو جيزة',
    'sheraton': 'شيراتون',
    'sherouk': 'الشروق',
    'smouha': 'سموحة',
    'zahraa maadi': 'زهراء المعادي',
    'zahraa new 6th of october': 'زهراء 6 أكتوبر الجديدة'
}

def translate_zone(z_str):
    if not z_str: return ''
    s = str(z_str).strip().lower()
    return ZONE_MAP.get(s, str(z_str).strip())

def translate_name(raw_name):
    if not raw_name: return ''
    s = str(raw_name).strip()
    if '_' in s: s = s.split('_')[0].strip()
    s = re.sub(r'\s+AL\s*ALAMIA.*$', '', s, flags=re.IGNORECASE)
    s = re.sub(r'\s+ALALAMIA.*$', '', s, flags=re.IGNORECASE)
    cleaned = s.strip()

    if re.search(r'[\u0600-\u06FF]', cleaned):
        return cleaned

    if cleaned in cache:
        return cache[cleaned]

    tokens = [t for t in re.split(r'[\s\-]+', cleaned) if t]
    out = []
    i = 0
    while i < len(tokens):
        t = tokens[i].lower()
        if i + 1 < len(tokens):
            next_t = tokens[i+1].lower()
            if t in ('el', 'al') and next_t in ('sayed', 'sayyed', 'sayid'):
                out.append('السيد')
                i += 2; continue
            if t in ('el', 'al') and next_t in ('din', 'deen'):
                out.append('الدين')
                i += 2; continue
            if t in ('mohi', 'mohy') and next_t in ('eldin', 'el-din', 'al-din'):
                out.append('محي الدين')
                i += 2; continue
            if t == 'ezz' and next_t in ('eldin', 'el-din', 'al-din'):
                out.append('عز الدين')
                i += 2; continue
            if t == 'ezz' and next_t in ('el', 'al') and i + 2 < len(tokens) and tokens[i+2].lower() in ('din', 'deen'):
                out.append('عز الدين')
                i += 3; continue
            if t in ('abdel', 'abdul', 'abd') and next_t in best_word_map:
                mapped_next = best_word_map[next_t]
                if not mapped_next.startswith('ال'):
                    mapped_next = 'ال' + mapped_next
                out.append('عبد ' + mapped_next)
                i += 2; continue
            if t in ('abu', 'abou', 'abo') and next_t in best_word_map:
                out.append('أبو ' + best_word_map[next_t])
                i += 2; continue
        if t in best_word_map:
            out.append(best_word_map[t])
        else:
            out.append(tokens[i])
        i += 1
    return ' '.join(out)

FALLBACK_NIDS = {
    '4985993': '30411171701958',
    '4952559': '30708292800417',
    '2638864': '29605150101538',
    '2433291': '29412140300034',
    '4562150': '29303012306794'
}

merged_records = []
seen_ids = set()

# 1. شيت Rider Performance
wb1 = openpyxl.load_workbook('data/Rider Performance (31).xlsx', read_only=True)
s1 = wb1.active
count1 = 0
for r in s1.iter_rows(min_row=2, values_only=True):
    if not r[0] and not r[1]: continue
    rid = str(r[0]).strip() if r[0] is not None else ''
    if not rid or rid == 'None': continue

    name_ar = translate_name(r[1])
    zone_ar = translate_zone(r[2])
    nid = str(r[3]).strip() if r[3] is not None else ''
    if nid in ('#N/A', 'None', '', '0') and rid in FALLBACK_NIDS:
        nid = FALLBACK_NIDS[rid]

    merged_records.append({
        'id': rid,
        'name': name_ar,
        'nationalId': nid,
        'region': zone_ar,
        'source': 'Rider Performance'
    })
    seen_ids.add(rid)
    count1 += 1

print(f'Processed {count1} records from Rider Performance (31).xlsx')

# 2. شيت Riders NooN
wb2 = openpyxl.load_workbook('data/Riders NooN.xlsx', read_only=True)
s2 = wb2.active
count2 = 0
for r in s2.iter_rows(min_row=2, values_only=True):
    if not r[0] and not r[1]: continue
    rid = str(r[0]).strip() if r[0] is not None else ''
    if not rid or rid == 'None': continue

    name_ar = translate_name(r[1])
    zone_ar = translate_zone(r[3])
    nid = str(r[5]).strip() if r[5] is not None else ''

    merged_records.append({
        'id': rid,
        'name': name_ar,
        'nationalId': nid,
        'region': zone_ar,
        'source': 'Riders NooN'
    })
    seen_ids.add(rid)
    count2 += 1

print(f'Processed {count2} records from Riders NooN.xlsx')
print(f'Total unified contestants: {len(merged_records)}')

# 3. حفظ Excel في المسارين
df = pd.DataFrame(merged_records)
df_export = df.rename(columns={
    'id': 'كود الموظف (ID)',
    'name': 'الاسم بالكامل',
    'nationalId': 'الرقم القومي',
    'region': 'المنطقة',
    'source': 'المصدر'
})

df_export.to_excel('data_scratch.xlsx', index=False)
df_export.to_excel('data/data_scratch.xlsx', index=False)
df_export.to_csv('data_scratch.csv', index=False, encoding='utf-8-sig')
print('Successfully saved data_scratch.xlsx and data/data_scratch.xlsx and data_scratch.csv')

# 4. تحديث js/data.js
js_contestants_lines = []
for item in merged_records:
    uid = item['id'].replace('"', '\\"')
    nid = item['nationalId'].replace('"', '\\"')
    name = item['name'].replace('"', '\\"')
    reg = item['region'].replace('"', '\\"')
    js_contestants_lines.append(f'    {{ id: "{uid}", nationalId: "{nid}", name: "{name}", region: "{reg}" }}')

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write('/**\n')
    f.write(' * ========================================================\n')
    f.write(' * 🏆 مسابقة بطل العالمية - قاعدة بيانات المتسابقين والجوائز\n')
    f.write(' * ========================================================\n')
    f.write(f' * تم الدمج والتحديث الرسمي من شيتي Rider Performance & Riders NooN\n')
    f.write(f' * إجمالي المتسابقين: {len(merged_records)} متسابق\n')
    f.write(' */\n\n')

    f.write('''// =========================================
// 🎁 مخزن الجوائز الحقيقية (Prize Inventory)
// =========================================
const PRIZE_INVENTORY = {
    prize100: {
        key: 'prize100',
        count: 400,          // العدد الابتدائي لجوائز الـ 100 جنيه
        label: '100 جنيه 💵',
        image: 'images/prize_100.jpg',
        isWinner: true,
        isCash: true,
        icon: '💵',
        description: 'مكافأة فورية 100 جنيه كاش - تنزل في حسابك فوراً يا عالمي! 🎉',
        storageKey: 'PRIZE_100_REMAINING'
    },
    prize200: {
        key: 'prize200',
        count: 150,          // العدد الابتدائي لجوائز الـ 200 جنيه
        label: '200 جنيه 💴',
        image: 'images/prize_200.jpg',
        isWinner: true,
        isCash: true,
        icon: '💴',
        description: 'مكافأة فورية 200 جنيه كاش - تنزل في حسابك فوراً يا بطل! 🏆',
        storageKey: 'PRIZE_200_REMAINING'
    },
    prizeOil: {
        key: 'prizeOil',
        count: 150,          // العدد الابتدائي لجوائز جركن الزيت
        label: 'جركن زيت 🛢️',
        image: 'images/oil.png',
        isWinner: true,
        isCash: false,
        icon: '🛢️',
        description: 'هدية عينية قيمة: جركن زيت أصلي عالي الجودة - مبروك يا بطل! 🛢️✨',
        storageKey: 'PRIZE_OIL_REMAINING'
    }
};

// =========================================
// 🔗 رابط Google Form الرسمي لاستلام الجوائز
// =========================================
const GOOGLE_FORM_CONFIG = {
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSf7i5sAv6u9R2gHpSY8sCyqRGSL6Zkb1W9Tzctoo7oDLyLEGA/viewform',
    nameEntryId: '',
    idEntryId: ''
};

// =========================================
// 🧪 حسابات التجربة (Test Accounts - 10 accounts)
// لا تُحتسب من مخزن الجوائز الحقيقية
// =========================================
const TEST_CONTESTANTS = [
    { id: '1',  nationalId: '1234', name: 'تجربه 1',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: true, isCash: true,  title: '100 جنيه 💵', description: 'مكافأة فورية 100 جنيه كاش - حساب تجريبي', icon: '💵', image: 'images/prize_100.jpg', prizeKey: 'prize100', isTest: true } },
    { id: '2',  nationalId: '1234', name: 'تجربه 2',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: true, isCash: true,  title: '200 جنيه 💴', description: 'مكافأة فورية 200 جنيه كاش - حساب تجريبي', icon: '💴', image: 'images/prize_200.jpg', prizeKey: 'prize200', isTest: true } },
    { id: '3',  nationalId: '1234', name: 'تجربه 3',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: true, isCash: false, title: 'جركن زيت 🛢️', description: 'هدية عينية: جركن زيت أصلي عالي الجودة - حساب تجريبي', icon: '🛢️', image: 'images/oil.png', prizeKey: 'prizeOil', isTest: true } },
    { id: '4',  nationalId: '1234', name: 'تجربه 4',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: true, isCash: true,  title: '200 جنيه 💴', description: 'مكافأة فورية 200 جنيه كاش - حساب تجريبي', icon: '💴', image: 'images/prize_200.jpg', prizeKey: 'prize200', isTest: true } },
    { id: '5',  nationalId: '1234', name: 'تجربه 5',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: true, isCash: true,  title: '100 جنيه 💵', description: 'مكافأة فورية 100 جنيه كاش - حساب تجريبي', icon: '💵', image: 'images/prize_100.jpg', prizeKey: 'prize100', isTest: true } },
    { id: '6',  nationalId: '1234', name: 'تجربه 6',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: false, title: 'حظ أوفر',       description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥 - حساب تجريبي', icon: '💪', isTest: true } },
    { id: '7',  nationalId: '1234', name: 'تجربه 7',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: false, title: 'حظ أوفر',       description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥 - حساب تجريبي', icon: '💪', isTest: true } },
    { id: '8',  nationalId: '1234', name: 'تجربه 8',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: false, title: 'حظ أوفر',       description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥 - حساب تجريبي', icon: '💪', isTest: true } },
    { id: '9',  nationalId: '1234', name: 'تجربه 9',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: false, title: 'حظ أوفر',       description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥 - حساب تجريبي', icon: '💪', isTest: true } },
    { id: '10', nationalId: '1234', name: 'تجربه 10', region: 'تجربه', isTest: true, fixedPrize: { isWinner: false, title: 'حظ أوفر',       description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥 - حساب تجريبي', icon: '💪', isTest: true } }
];

// =========================================
// 👥 قاعدة بيانات المتسابقين الحقيقيين الموحدة
// =========================================
const CONTESTANTS_DATABASE = [
''')
    f.write(',\n'.join(js_contestants_lines))
    f.write('\n];\n\n')

    f.write('''// =========================================
// 🛠️ دوال الوصول لقاعدة البيانات
// =========================================
function findContestant(id, nationalId) {
    const cleanId = String(id || '').trim();
    const cleanNatId = String(nationalId || '').trim();

    // 1. فحص حسابات التجربة أولاً
    const testMatch = TEST_CONTESTANTS.find(u => 
        String(u.id).trim() === cleanId && 
        String(u.nationalId).trim() === cleanNatId
    );
    if (testMatch) return { ...testMatch };

    // 2. فحص قاعدة البيانات الرسمية
    const realMatch = CONTESTANTS_DATABASE.find(u => 
        String(u.id).trim() === cleanId && 
        String(u.nationalId).trim() === cleanNatId
    );
    if (realMatch) return { ...realMatch, isTest: false };

    return null;
}

function findContestantByIdOnly(id) {
    const cleanId = String(id || '').trim();
    const testMatch = TEST_CONTESTANTS.find(u => String(u.id).trim() === cleanId);
    if (testMatch) return { ...testMatch };
    const realMatch = CONTESTANTS_DATABASE.find(u => String(u.id).trim() === cleanId);
    if (realMatch) return { ...realMatch, isTest: false };
    return null;
}

// =========================================
// 📦 إدارة المخزن الحي المحلي
// =========================================
function getPrizeRemaining(prizeKey) {
    const p = PRIZE_INVENTORY[prizeKey];
    if (!p) return 0;
    const val = localStorage.getItem(p.storageKey);
    if (val === null) {
        localStorage.setItem(p.storageKey, String(p.count));
        return p.count;
    }
    return Math.max(0, parseInt(val, 10) || 0);
}

function decrementPrize(prizeKey) {
    const p = PRIZE_INVENTORY[prizeKey];
    if (!p) return;
    const curr = getPrizeRemaining(prizeKey);
    const next = Math.max(0, curr - 1);
    localStorage.setItem(p.storageKey, String(next));
}

// =========================================
// 🎲 تحديد جائزة المتسابق (استهلاك وتوزيع المخزون بالكامل)
// =========================================
function getUserPrize(user) {
    if (user.isTest && user.fixedPrize) {
        return user.fixedPrize;
    }

    const rem100 = getPrizeRemaining('prize100');
    const rem200 = getPrizeRemaining('prize200');
    const remOil = getPrizeRemaining('prizeOil');
    const totalWinners = rem100 + rem200 + remOil;

    if (totalWinners <= 0) {
        return {
            isWinner: false,
            title: 'حظ أوفر المرة القادمة',
            description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥',
            icon: '💪',
            isTest: false
        };
    }

    // نسبة فوز ديناميكية تضمن خروج الجوائز وتوزيعها بالكامل على المتسابقين حتى نفاذ المخزن
    const winChance = Math.min(1.0, Math.max(0.55, totalWinners / 1000));
    const rand = Math.random();

    if (rand >= winChance) {
        return {
            isWinner: false,
            title: 'حظ أوفر المرة القادمة',
            description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥',
            icon: '💪',
            isTest: false
        };
    }

    const r = Math.random() * totalWinners;
    if (r < remOil && remOil > 0) {
        decrementPrize('prizeOil');
        return {
            isWinner: true,
            isCash: false,
            title: PRIZE_INVENTORY.prizeOil.label,
            description: PRIZE_INVENTORY.prizeOil.description,
            icon: PRIZE_INVENTORY.prizeOil.icon,
            image: PRIZE_INVENTORY.prizeOil.image,
            prizeKey: 'prizeOil',
            isTest: false
        };
    } else if (r < remOil + rem200 && rem200 > 0) {
        decrementPrize('prize200');
        return {
            isWinner: true,
            isCash: true,
            title: PRIZE_INVENTORY.prize200.label,
            description: PRIZE_INVENTORY.prize200.description,
            icon: PRIZE_INVENTORY.prize200.icon,
            image: PRIZE_INVENTORY.prize200.image,
            prizeKey: 'prize200',
            isTest: false
        };
    } else if (rem100 > 0) {
        decrementPrize('prize100');
        return {
            isWinner: true,
            isCash: true,
            title: PRIZE_INVENTORY.prize100.label,
            description: PRIZE_INVENTORY.prize100.description,
            icon: PRIZE_INVENTORY.prize100.icon,
            image: PRIZE_INVENTORY.prize100.image,
            prizeKey: 'prize100',
            isTest: false
        };
    }

    return {
        isWinner: false,
        title: 'حظ أوفر المرة القادمة',
        description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥',
        icon: '💪',
        isTest: false
    };
}

// =========================================
// 📝 إدارة سجل المشاركات
// =========================================
const PARTICIPATION_STORAGE_KEY = 'ALALAMIA_PARTICIPATIONS_V2';

function getAllParticipations() {
    try {
        const raw = localStorage.getItem(PARTICIPATION_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function getUserParticipation(userId) {
    const all = getAllParticipations();
    return all[String(userId).trim()] || null;
}

function recordUserParticipation(user, prize, claimInfo = null) {
    const all = getAllParticipations();
    const cleanId = String(user.id).trim();
    all[cleanId] = {
        userId: cleanId,
        userName: user.name,
        nationalId: user.nationalId,
        userRegion: user.region,
        prize: prize,
        scratchedAt: new Date().toISOString(),
        formattedDate: new Date().toLocaleString('ar-EG'),
        isTest: Boolean(user.isTest),
        isPaid: false,
        claimInfo: claimInfo
    };
    try {
        localStorage.setItem(PARTICIPATION_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {}
    return all[cleanId];
}

function updateUserClaimInfo(userId, claimInfo) {
    const all = getAllParticipations();
    const cleanId = String(userId).trim();
    if (all[cleanId]) {
        all[cleanId].claimInfo = claimInfo;
        try {
            localStorage.setItem(PARTICIPATION_STORAGE_KEY, JSON.stringify(all));
        } catch (e) {}
        return true;
    }
    return false;
}

function togglePaidStatus(userId) {
    const all = getAllParticipations();
    const cleanId = String(userId).trim();
    if (all[cleanId]) {
        all[cleanId].isPaid = !all[cleanId].isPaid;
        all[cleanId].paidAt = all[cleanId].isPaid ? new Date().toISOString() : null;
        try {
            localStorage.setItem(PARTICIPATION_STORAGE_KEY, JSON.stringify(all));
        } catch (e) {}
        return all[cleanId].isPaid;
    }
    return false;
}

function resetParticipationsStorage() {
    try {
        localStorage.removeItem(PARTICIPATION_STORAGE_KEY);
        return true;
    } catch (e) {
        return false;
    }
}
''')

print(f'Successfully updated js/data.js with {len(merged_records)} contestants!')
