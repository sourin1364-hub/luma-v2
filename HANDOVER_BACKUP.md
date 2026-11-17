# بکاپ جامع و فشرده وضعیت پروژه لومِرا و لوما (HANDOVER_BACKUP)
**تاریخ ثبت:** ۲۰۲۶-۱۱-۱۷ | **مخزن:** `sourin1364-hub/luma-v2` | **دامنه:** `https://lumeraworld.ir`

## ۱. وضعیت زیرساخت و دیتابیس (Supabase)
- **احراز هویت یکپارچه:** بین وب‌سایت لومِرا (`lumeraworld.ir`) و وب‌اپلیکیشن لوما (`luma-v2`) روی پروژه جدید Supabase کاملاً سینک است.
- **مدیریت تعرفه‌ها (`site_settings`):** جدول مرکزی قیمت‌گذاری و تخفیف‌های دوره‌ای در Supabase فعال بوده و هم در سایت و هم در `SubscriptionScreen.tsx` خوانده می‌شود.
- **سازگاری ستون‌های اشتراک در `profiles`:** هوک `useSubscription.ts` به‌گونه‌ای ارتقا یافت که هم ستون‌های `plan` / `tier` و هم `subscription_until` / `subscription_expires_at` را پشتیبانی کند تا آپدیت‌های `verify.php` بلافاصله در اپ اعمال شوند.

## ۲. وضعیت درگاه پرداخت زیبال (Zibal) روی نت‌افراز
- **فایل‌های سرور:** `https://lumeraworld.ir/payment.php` و `https://lumeraworld.ir/verify.php` روی هاست نت‌افراز آپلود و فعال هستند.
- **تست اتصال سرور به Supabase:** تست POST به `payment.php` صحت ارتباط مستقیم سرور نت‌افراز با جدول کاربران Supabase و بررسی UUID را تأیید کرد.
- **اتصال فرانت‌اند لوما:** فایل `src/features/subscription/zarinpalService.ts` بازنویسی شد تا درخواست خرید را مستقیماً با متد `POST` و فرمت JSON (شامل `user_id`, `plan`, `tier`, `cycle`, `amount`) به `https://lumeraworld.ir/payment.php` ارسال کند و کاربر را به درگاه زیبال (`paymentUrl` / `trackId`) هدایت نماید.

## ۳. وضعیت بیلد و استقرار (GitHub Pages)
- **فایل‌های موقت:** در `.gitignore` قرار گرفتند تا وارد مخزن نشوند.
- **ورک‌فلو انتشار:** `.github/workflows/deploy.yml` روی شاخه `main` تنظیم است و با هر `git push origin main` به‌طور خودکار بیلد گرفته و روی GitHub Pages منتشر می‌شود.

## ۴. راهنمای شروع سریع برای چت بعدی
> در چت بعدی کافی است این فایل (`HANDOVER_BACKUP.md`) را بدهید تا هوش مصنوعی بدون نیاز به اسکن مجدد، از آخرین وضعیت اتصال درگاه زیبال، جدول `site_settings` و ساختار دیپلوی `luma-v2` مطلع شود.
