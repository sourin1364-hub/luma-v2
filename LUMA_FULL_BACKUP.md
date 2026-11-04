# LUMA v2 - FULL Project Backup (Complete File Contents)

**تاریخ تولید:** 2026-11-03 19:55:01
**مسیر پروژه:** C:\Users\ROYAL\Desktop\luma-v2
**مخزن گیت‌هاب:** https://github.com/sourin1364-hub/luma-v2

---

---

# بخش 5: کامپوننت‌های تاروت

# بخش 6: صفحات تاروت

# بخش 7: مکان و شهر

# بخش 8: صفحه اصلی و زودیاک

# بخش 9: پروفایل

# بخش 10: اشتراک

# بخش 11: صدا و ابزارها

# بخش 12: داده‌های JSON (نمونه)

## نمونه از iran-cities.json (۳ شهر اول)

`json
[
    {
        "id":  1,
        "name":  "اسکو",
        "province_id":  1,
        "en_name":  "Osku",
        "lat":  "37.9161035",
        "lon":  "46.1244787"
    },
    {
        "id":  2,
        "name":  "اهر",
        "province_id":  1,
        "en_name":  "Ahar",
        "lat":  "38.4774934",
        "lon":  "47.0662215"
    },
    {
        "id":  3,
        "name":  "ایلخچی",
        "province_id":  1,
        "en_name":  "Ailkhchi",
        "lat":  "37.9389278",
        "lon":  "45.9800159"
    }
]

**تعداد کل استان‌ها:** 0

---

# بخش 13: تاریخچه گیت (۱۵ کامیت آخر)


**نکته:** کامیت‌های 5d9e354 و e3a11b8 فایل‌های تاروت را خراب کرده‌اند. اگر پروژه خراب شد، به 6127fad برگردید.

---

# بخش 14: دستورات بازگردانی

## بازگشت به آخرین کامیت سالم

`powershell
cd "C:\Users\ROYAL\Desktop\luma-v2"
git reset --hard 6127fad
npm install
npm run dev
`powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Path ".\node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".\dev-dist" -Recurse -Force -ErrorAction SilentlyContinue
npm run dev
1. F12 → Application → Service Workers → Unregister
2. Ctrl+Shift+R (رفرش سخت)

---

**پایان فایل بک‌آپ کامل**