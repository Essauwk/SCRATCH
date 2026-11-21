module.exports = (req, res) => {
    const { name = 'أحد أبطال الشركة', prize = 'هدية قيمة', type = '100' } = req.query;

    let imageUrl = 'https://alamia-delta.vercel.app/images/prize_100.jpg';
    let prizeName = prize;

    if (type === 'oil' || prize.includes('زيت')) {
        imageUrl = 'https://alamia-delta.vercel.app/images/oil.png';
        prizeName = 'جركن زيت أصلي عالي الجودة 🛢️';
    } else if (type === '200' || prize.includes('200')) {
        imageUrl = 'https://alamia-delta.vercel.app/images/prize_200.jpg';
        prizeName = '200 جنيه كاش فوري 💴';
    } else if (type === '100' || prize.includes('100')) {
        imageUrl = 'https://alamia-delta.vercel.app/images/prize_100.jpg';
        prizeName = '100 جنيه كاش فوري 💵';
    }

    const title = `🏆 الحمد لله كسبت ${prizeName} في مسابقة بطل العالمية إكسبريس! 🎉`;
    const description = `ألف مبروك للبطل ${name}! فاز بـ ${prizeName} من شركة العالمية إكسبريس @alalamiacompany0. ادخلوا شاركوا في المسابقة واكسبوا جوائز حقيقية والتسليم خلال 48 ساعة! 🚀👑`;

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    
    <!-- Facebook & Open Graph Meta Tags -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="شركة العالمية إكسبريس">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:secure_url" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:url" content="https://alamia-delta.vercel.app/api/winner?type=${encodeURIComponent(type)}">
    <meta property="fb:app_id" content="966242223397198">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">

    <!-- Redirect visitors to scratch card -->
    <meta http-equiv="refresh" content="0;url=https://alamia-delta.vercel.app/">
</head>
<body style="background:#FFE500; font-family:'Cairo', sans-serif; text-align:center; padding:50px; color:#18181B;">
    <h2>🏆 مسابقة بطل العالمية إكسبريس</h2>
    <p>جاري تحويلك للمسابقة فوراً... 🚀</p>
    <script>
        window.location.replace('https://alamia-delta.vercel.app/');
    </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.status(200).send(html);
};
