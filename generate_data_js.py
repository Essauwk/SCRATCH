import json

# Read contestants data
with open('contestants_data.json', 'r', encoding='utf-8') as f:
    entries = json.load(f)

# Build JS content
lines = []
lines.append("""/**
 * ========================================================
 * 🏆 مسابقة بطل العالمية - قاعدة بيانات المتسابقين والجوائز
 * ========================================================
 * الإصدار الرسمي - بيانات حقيقية من شيت الهيد كاونت
 */

// =========================================
// 🎁 مخزن الجوائز الحقيقية (Prize Inventory)
// =========================================
// هذه القيم قابلة للتعديل من هنا مباشرة
const PRIZE_INVENTORY = {
    prize100: {
        count: 500,          // العدد الابتدائي لجوائز الـ 100 جنيه
        label: '100 جنيه 💵',
        image: 'images/prize_100.png',
        isWinner: true,
        icon: '💵',
        description: 'مكافأة فورية 100 جنيه كاش - تنزل في حسابك فوراً يا عالمي! 🎉',
        storageKey: 'PRIZE_100_REMAINING'
    },
    prize200: {
        count: 300,          // العدد الابتدائي لجوائز الـ 200 جنيه
        label: '200 جنيه 💴',
        image: 'images/prize_200.png',
        isWinner: true,
        icon: '💴',
        description: 'مكافأة فورية 200 جنيه كاش - تنزل في حسابك فوراً يا بطل! 🏆',
        storageKey: 'PRIZE_200_REMAINING'
    }
};

// =========================================
// 🔗 رابط Google Form الرسمي لاستلام الجوائز
// =========================================
const GOOGLE_FORM_CONFIG = {
    url: 'GOOGLE_FORM_URL_PLACEHOLDER',  // يتم استبداله بالرابط الحقيقي
    nameEntryId: '',
    idEntryId: ''
};

// =========================================
// 🧪 حسابات التجربة (Test Accounts - 10 accounts)
// لا تُحتسب من مخزن الجوائز الحقيقية
// =========================================
const TEST_CONTESTANTS = [
    { id: '1',  nationalId: '1234', name: 'تجربه 1',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: true,  title: '100 جنيه 💵', description: 'مكافأة فورية 100 جنيه كاش - حساب تجريبي', icon: '💵', isTest: true } },
    { id: '2',  nationalId: '1234', name: 'تجربه 2',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: true,  title: '200 جنيه 💴', description: 'مكافأة فورية 200 جنيه كاش - حساب تجريبي', icon: '💴', isTest: true } },
    { id: '3',  nationalId: '1234', name: 'تجربه 3',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: true,  title: '100 جنيه 💵', description: 'مكافأة فورية 100 جنيه كاش - حساب تجريبي', icon: '💵', isTest: true } },
    { id: '4',  nationalId: '1234', name: 'تجربه 4',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: true,  title: '200 جنيه 💴', description: 'مكافأة فورية 200 جنيه كاش - حساب تجريبي', icon: '💴', isTest: true } },
    { id: '5',  nationalId: '1234', name: 'تجربه 5',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: true,  title: '100 جنيه 💵', description: 'مكافأة فورية 100 جنيه كاش - حساب تجريبي', icon: '💵', isTest: true } },
    { id: '6',  nationalId: '1234', name: 'تجربه 6',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: false, title: 'حظ أوفر',       description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥 - حساب تجريبي', icon: '💪', isTest: true } },
    { id: '7',  nationalId: '1234', name: 'تجربه 7',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: false, title: 'حظ أوفر',       description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥 - حساب تجريبي', icon: '💪', isTest: true } },
    { id: '8',  nationalId: '1234', name: 'تجربه 8',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: false, title: 'حظ أوفر',       description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥 - حساب تجريبي', icon: '💪', isTest: true } },
    { id: '9',  nationalId: '1234', name: 'تجربه 9',  region: 'تجربه', isTest: true, fixedPrize: { isWinner: false, title: 'حظ أوفر',       description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥 - حساب تجريبي', icon: '💪', isTest: true } },
    { id: '10', nationalId: '1234', name: 'تجربه 10', region: 'تجربه', isTest: true, fixedPrize: { isWinner: false, title: 'حظ أوفر',       description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥 - حساب تجريبي', icon: '💪', isTest: true } }
];

// =========================================
// 👥 قاعدة بيانات المتسابقين الحقيقيين
// =========================================
const CONTESTANTS_DATABASE = [
""")

# Add all entries
for i, e in enumerate(entries):
    comma = ',' if i < len(entries) - 1 else ''
    lines.append(f'    {{ id: {json.dumps(e["id"])}, nationalId: {json.dumps(e["nationalId"])}, name: {json.dumps(e["name"])}, region: {json.dumps(e["region"])} }}{comma}')

lines.append("""];

// للتوافق مع الكود السابق
const USERS_DATABASE = CONTESTANTS_DATABASE;

// =========================================
// 🔍 البحث والتحقق من المتسابق
// =========================================
function findUser(id, nationalId) {
    const cleanId = String(id || '').trim();
    const cleanNatId = String(nationalId || '').trim();

    // فحص حسابات التجربة أولاً
    const testUser = TEST_CONTESTANTS.find(u => u.id === cleanId && u.nationalId === cleanNatId);
    if (testUser) return testUser;

    // ثم البحث في قاعدة البيانات الحقيقية
    return CONTESTANTS_DATABASE.find(u => u.id === cleanId && u.nationalId === cleanNatId);
}

// =========================================
// 🏆 نظام مخزن الجوائز (Prize Inventory System)
// =========================================

function getPrizeRemaining(prizeKey) {
    const storageKey = PRIZE_INVENTORY[prizeKey].storageKey;
    const stored = localStorage.getItem(storageKey);
    if (stored === null) {
        // أول مرة: نهيئ المخزن بالقيمة الابتدائية
        const initial = PRIZE_INVENTORY[prizeKey].count;
        localStorage.setItem(storageKey, String(initial));
        return initial;
    }
    return parseInt(stored, 10);
}

function decrementPrize(prizeKey) {
    const storageKey = PRIZE_INVENTORY[prizeKey].storageKey;
    const current = getPrizeRemaining(prizeKey);
    if (current > 0) {
        localStorage.setItem(storageKey, String(current - 1));
        return true;
    }
    return false; // نفذت الجائزة
}

function getInventorySnapshot() {
    return {
        prize100: getPrizeRemaining('prize100'),
        prize200: getPrizeRemaining('prize200'),
        prize100_initial: PRIZE_INVENTORY.prize100.count,
        prize200_initial: PRIZE_INVENTORY.prize200.count,
    };
}

// =========================================
// 🎲 تحديد جائزة المتسابق
// =========================================
function getUserPrize(user) {
    // حسابات التجربة: جائزة ثابتة ولا تُخصم من المخزن
    if (user.isTest && user.fixedPrize) {
        return user.fixedPrize;
    }

    // ==============================
    // توزيع عشوائي من المخزن الحقيقي
    // ==============================
    const rem100 = getPrizeRemaining('prize100');
    const rem200 = getPrizeRemaining('prize200');
    const totalWinners = rem100 + rem200;

    if (totalWinners <= 0) {
        // انتهت كل الجوائز
        return {
            isWinner: false,
            title: 'حظ أوفر المرة القادمة',
            description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥',
            icon: '💪',
            isTest: false
        };
    }

    // نسب الفوز: 800 جائزة من إجمالي 4745 متسابق ≈ 16.9%
    // نعمل سحب عشوائي بناءً على المخزون الفعلي
    const totalContestants = CONTESTANTS_DATABASE.length;
    // احتمال الفوز = المتبقي من الجوائز / المتبقي من المتسابقين (بحد أدنى 0)
    const participations = Object.keys(getAllParticipations()).length;
    const remaining = Math.max(totalContestants - participations, 1);
    const winChance = Math.min(totalWinners / remaining, 1);

    const rand = Math.random();
    if (rand >= winChance) {
        // حظ أوفر
        return {
            isWinner: false,
            title: 'حظ أوفر المرة القادمة',
            description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥',
            icon: '💪',
            isTest: false
        };
    }

    // فاز! نختار نوع الجائزة بنسبة المخزون الحالي
    const prize200Chance = rem200 / totalWinners;
    const pickPrize200 = Math.random() < prize200Chance;

    if (pickPrize200 && rem200 > 0) {
        decrementPrize('prize200');
        return {
            isWinner: true,
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
            title: PRIZE_INVENTORY.prize100.label,
            description: PRIZE_INVENTORY.prize100.description,
            icon: PRIZE_INVENTORY.prize100.icon,
            image: PRIZE_INVENTORY.prize100.image,
            prizeKey: 'prize100',
            isTest: false
        };
    }

    // fallback - لو حدث تعارض
    return {
        isWinner: false,
        title: 'حظ أوفر المرة القادمة',
        description: 'حظك وحش يا نجم استنانا ف مسابقات جاية 💪🔥',
        icon: '💪',
        isTest: false
    };
}

// =========================================
// 🔒 نظام منع الدخول أكثر من مرة (Single Participation)
// =========================================
const PARTICIPATION_STORAGE_KEY = 'ALALAMIA_SCRATCH_PARTICIPATIONS_V2';

function hasUserParticipated(userId) {
    if (!userId) return false;
    const history = getAllParticipations();
    return Boolean(history[String(userId).trim()]);
}

function getUserParticipation(userId) {
    if (!userId) return null;
    const history = getAllParticipations();
    return history[String(userId).trim()] || null;
}

function recordUserParticipation(user, prize) {
    if (!user || !user.id) return;
    // لا تسجل حسابات التجربة في السجل الدائم... بس نسجلها لمنع تكرار التجربة
    const history = getAllParticipations();
    history[String(user.id).trim()] = {
        userId: user.id,
        nationalId: user.nationalId,
        userName: user.name,
        userRegion: user.region,
        isTest: user.isTest || false,
        prize: prize,
        scratchedAt: new Date().toISOString(),
        formattedDate: new Intl.DateTimeFormat('ar-EG', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date())
    };
    try {
        localStorage.setItem(PARTICIPATION_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.warn('Storage save failed:', e);
    }
}

function getAllParticipations() {
    try {
        const raw = localStorage.getItem(PARTICIPATION_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        return {};
    }
}

function resetParticipationsStorage() {
    try {
        localStorage.removeItem(PARTICIPATION_STORAGE_KEY);
        return true;
    } catch (e) {
        return false;
    }
}

// =========================================
// 🔗 بناء رابط Google Form لاستلام الجائزة
// =========================================
function buildGoogleFormUrl(user, prize) {
    if (!GOOGLE_FORM_CONFIG.url || GOOGLE_FORM_CONFIG.url === 'GOOGLE_FORM_URL_PLACEHOLDER') {
        return null;
    }
    let url = GOOGLE_FORM_CONFIG.url;
    const params = new URLSearchParams();
    if (GOOGLE_FORM_CONFIG.nameEntryId && user?.name) {
        params.append(GOOGLE_FORM_CONFIG.nameEntryId, user.name);
    }
    if (GOOGLE_FORM_CONFIG.idEntryId && user?.id) {
        params.append(GOOGLE_FORM_CONFIG.idEntryId, user.id);
    }
    const queryString = params.toString();
    if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
    }
    return url;
}
""")

output = '\n'.join(lines)
with open('output_data.js', 'w', encoding='utf-8') as f:
    f.write(output)

print('Done! Total lines:', len(output.splitlines()))
