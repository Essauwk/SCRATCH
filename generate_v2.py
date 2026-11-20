import pandas as pd
import json
import re

input_file = 'alalamia scratch data.xlsx'
df = pd.read_excel(input_file, dtype={'ID': str, 'رقم البطاقة': str})

with open('name_translation_cache.json', 'r', encoding='utf-8') as f:
    name_cache = json.load(f)

def clean_full(n):
    if not isinstance(n, str): return ''
    s = n.strip()
    if '_' in s: s = s.split('_')[0].strip()
    s = re.sub(r'\s+AL\s*ALAMIA.*$', '', s, flags=re.IGNORECASE)
    s = re.sub(r'\s+ALALAMIA.*$', '', s, flags=re.IGNORECASE)
    return s.strip()

zone_map = {
    'Alexandria': 'الإسكندرية',
    'Mokattam': 'المقطم',
    'Maadi': 'المعادي',
    'Heliopolis': 'مصر الجديدة',
    'Sheikh zayed': 'الشيخ زايد',
    'Mohandiseen': 'المهندسين',
    'Tagammoa north': 'التجمع شمال',
    'Shobra': 'شبرا',
    'October': 'أكتوبر',
    'Nasr city': 'مدينة نصر',
    'Cairo_city_centre': 'وسط البلد',
    'Tagammoa south': 'التجمع جنوب',
    'Helwan': 'حلوان',
    'Madinaty': 'مدينتي',
    'Portsaid city': 'بورسعيد',
    'October wahat': 'أكتوبر الواحات',
    'Tanta': 'طنطا',
    'Shorouk city': 'الشروق',
    'Ain shams': 'عين شمس',
    'Mansoura': 'المنصورة',
    'El rehab city': 'الرحاب',
    'Giza': 'الجيزة',
    'Suez': 'السويس',
    'October palm hills': 'أكتوبر بالم هيلز',
    'Zagazig': 'الزقازيق',
    'Ismalia city': 'الإسماعيلية',
    'Hadayek el qobba': 'حدائق القبة',
    'Assiut': 'أسيوط',
    'Tagammoa golden square': 'التجمع الجولدن سكوير',
    '10th of ramadan': 'العاشر من رمضان',
    'New damietta': 'دمياط الجديدة',
    'Beni suef': 'بني سويف',
    'Obour city': 'العبور',
    'Al mahallah al kubra': 'المحلة الكبرى',
    'Hadayek el ahram': 'حدائق الأهرام',
    'Damietta': 'دمياط',
    'Banha city': 'بنها',
    'Ras el bar': 'رأس البر',
    'Smart village': 'القرية الذكية',
    'Minya': 'المنيا',
    'Damanhour': 'دمنهور',
    'Sadat city': 'مدينة السادات',
}

def translate_zone(z):
    if pd.isna(z) or str(z).strip() == '':
        return ''
    z_clean = str(z).strip()
    return zone_map.get(z_clean, z_clean)

df['clean_en_name'] = df['الاسم'].apply(clean_full)
df['الاسم_عربي'] = df['clean_en_name'].map(name_cache).fillna(df['clean_en_name'])
df['الزون_عربي'] = df['الزون'].apply(translate_zone)

# Format National ID and ID as clean strings
df['ID'] = df['ID'].astype(str).str.strip()
df['رقم البطاقة'] = df['رقم البطاقة'].astype(str).str.strip()

# Build v2 dataframe matching original columns structure
df_v2 = pd.DataFrame({
    'ID': df['ID'],
    'الاسم': df['الاسم_عربي'],
    'رقم البطاقة': df['رقم البطاقة'],
    'الزون': df['الزون_عربي']
})

# Comprehensive comparison dataframe
df_detailed = pd.DataFrame({
    'ID': df['ID'],
    'الاسم بالعربي': df['الاسم_عربي'],
    'الاسم الأصلي بعد حذف ALAMIA': df['clean_en_name'],
    'رقم البطاقة': df['رقم البطاقة'],
    'الزون بالعربي': df['الزون_عربي'],
    'الزون الأصلي بالإنجليزي': df['الزون']
})

output_file = 'alalamia scratch data_v2.xlsx'

with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
    df_v2.to_excel(writer, sheet_name='الهيد كاونت بالعربي', index=False)
    df_detailed.to_excel(writer, sheet_name='المقارنة عربي وإنجليزي', index=False)

# Also export as CSV (UTF-8 BOM for Excel compatibility)
csv_output = 'alalamia_scratch_data_v2.csv'
df_v2.to_csv(csv_output, index=False, encoding='utf-8-sig')

print('Successfully created:', output_file)
print('Successfully created:', csv_output)
print('Total rows:', len(df_v2))
