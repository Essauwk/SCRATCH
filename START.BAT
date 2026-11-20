@echo off
chcp 65001 >nul
title مسابقة بطل العالمية - تشغيل الموقع
color 0E

echo ========================================================
echo   🏆 مسابقة بطل العالمية - تشغيل السايت
echo ========================================================
echo.
echo   [+] جاري فحص البيئة وتشغيل السايت بأفضل أداء...
echo.

:: الفحص إذا كان بايثون مثبت لتشغيل سيرفر محلي
where python >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo   [✓] تم العثور على Python.. جاري تشغيل السيرفر المحلي على بورت 8000
    start "" http://localhost:8000
    echo   [!] السايت يعمل الآن على: http://localhost:8000
    echo   [!] لإيقاف السيرفر اضغط Ctrl + C
    echo.
    python -m http.server 8000
    goto :end
)

:: الفحص إذا كان Node.js مثبت كبديل
where npx >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo   [✓] تم العثور على Node.js.. جاري تشغيل سيرفر محلي...
    start "" http://localhost:3000
    npx serve -l 3000 .
    goto :end
)

:: في حال عدم وجود سيرفر، يتم فتح index.html مباشرة في المتصفح الافتراضي
echo   [!] جاري فتح الموقع مباشرة في متصفحك الافتراضي...
start "" "%~dp0index.html"

:end
pause
