# گزارش انتقال کار LUMA v2

> **یادداشت وضعیت جدیدتر:** این گزارش در ۲۰۲۶-۱۱-۱۰ و پیش از تأییدهای بعدی تهیه شده است. کاربر بعداً گفت `setup_new_luma_project.sql` روی پروژهٔ جدید بدون خطا اجرا شده و با حساب مدیر موجود وارد شده است؛ بنابراین مطالب پایین این فایل که اجرای setup یا ورود ادمین را تأییدنشده می‌دانند دیگر به‌روز نیستند. برای وضعیت فعلی و نقشهٔ ادامه، [`../PROJECT_HANDOFF_FA.md`](../PROJECT_HANDOFF_FA.md) را بخوانید. هیچ حساب تازه‌ای لازم نیست.

این گزارش برای ادامهٔ کار در گفت‌وگوی بعدی تهیه شده است. وضعیت مخزن و فایل‌های مرتبط در ۲۰۲۶-۱۱-۱۰ بررسی شده‌اند. این سند هیچ کلید، رمز، OTP، UUID مدیر یا اطلاعات شخصی کاربر را در بر ندارد.

## خلاصهٔ خیلی کوتاه برای شروع چت بعدی

- مخزن: `C:\Users\ROYAL\Desktop\luma-v2`
- موضوع فعال: اتصال امن برنامه به **پروژهٔ جدید Supabase** و آماده‌سازی schema.
- فایل audit یک‌مرحله‌ای، `supabase/diagnostics/one_click_new_project_audit.sql`، در SQL Editor اجرا شد و خروجی آن در فایل `C:\Users\ROYAL\Desktop\Skip to content.MD` فرستاده شد.
- از خروجی audit: جدول‌های اصلی `profiles`, `birth_profiles`, `saved_charts`, `tarot_readings` موجودند؛ جدول‌های پرداخت، OTP و پژوهش و bucketها موجود نیستند. روی `profiles` policy عمومی خواندن وجود داشت و چند policy تکراری دیده شد.
- بر اساس آن خروجی، `supabase/setup_new_luma_project.sql` ساخته شده است. کاربر گفت «بدون خطا بریم مرحله بعد»؛ پاسخ قبلی اجرای موفق را فرض کرد، ولی پیام صریح `Success. No rows returned` برای همین setup script در این بخش از گفتگو ثبت نشده است. در چت بعدی ابتدا تأیید کنید setup واقعاً روی **پروژهٔ جدید** اجرا شده است؛ دوباره اجرا نکنید مگر با بررسی وضعیت.
- مرحلهٔ پیشنهادی بعدی: ساخت/ورود حساب تحت کنترل کاربر در برنامهٔ متصل به پروژهٔ جدید، سپس اجرای `supabase/bootstrap_initial_admin.sql` پس از جایگزینی UUID محلی در فایل. UUID را در چت نفرستید.
- هیچ‌کدام از SQLهای دیتابیس در این محیط به Supabase وصل یا اجرا نشده‌اند؛ بررسی SQLها ایستا بوده است.
- `git status` نشان می‌دهد worktree از قبل بسیار شلوغ و دارای تغییرات/فایل‌های untracked متعدد است. هیچ‌چیز را با reset/checkout پاک نکنید؛ تغییرات نامرتبط را حفظ کنید.

## تاریخچهٔ مراحل قبلی برنامه

### مرحلهٔ ۲: ظاهر و بومی‌سازی

- تغییرات زبان و رابط برای فارسی، انگلیسی، عربی و کردی انجام شد؛ از جمله اصلاح نگاشت ترجمهٔ دوره‌های پرداخت.
- بازبینی‌های قبلی محدودیت عرض صفحهٔ اشتراک در چند اندازه را بررسی کردند.
- بخشی از ترجمه هنوز از روش قدیمی دست‌کاری DOM استفاده می‌کرد و بررسی کامل مرورگر/خروجی PNG استوری در همهٔ زبان‌ها قطعی نشده بود.

### مرحلهٔ ۳: تست‌ها

- خطاهای قبلی در تاریخ چینی، مسیر تصاویر تاروت و انتظار تعداد چیدمان‌ها بررسی و اصلاح شدند.
- نتیجهٔ گزارش‌شده در آن مرحله: `npm test` با **۱۹۹ تست موفق** و production build موفق.
- هشدار bundle حجیم همچنان وجود داشت.

### مرحلهٔ ۴: Supabase و امنیت

- دسترسی مستقیم به Supabase پروژه در این محیط وجود ندارد؛ کاربر خروجی‌های metadata را از SQL Editor ارسال می‌کند.
- خطای قبلی `forcerowsecurity` در audit برطرف شد: RLS flags از `pg_class.relforcerowsecurity` خوانده می‌شوند.
- پروژهٔ Supabase قبلی و پروژهٔ جدید با هم اشتباه گرفته شده بودند. کاربر تصریح کرد دیتابیس فعلیِ auditشده، پروژهٔ جدید و دست‌نخورده است؛ تغییرات قبلی مربوط به پروژهٔ قدیمی بوده‌اند. بنابراین Project Ref را پیش از هر SQL تغییردهنده از داشبورد دوباره بررسی کنید.

## نتیجهٔ audit پروژهٔ جدید که کاربر فرستاد

خروجی در Markdown استخراج‌شده از Supabase Dashboard قرار داشت. عنوان داشبورد پروژه `luma-app`, شاخه `main`, محیط `Production` را نشان می‌داد؛ SQL audit خودش Project Ref را نشان نمی‌دهد. کاربر گفت دیتابیس جدید است. پیش از هر تغییر، خود کاربر باید پروژه/Project Ref را در داشبورد تأیید کند.

### جدول‌های اصلی و ستون‌ها

- `public.profiles`: `id`, `username`, `display_name`, `avatar_url`, `created_at`, `updated_at`, `subscription_until`, `role`, `plan`, `phone`.
- `public.birth_profiles`: `id`, `user_id`, سال/ماه/روز، زمان و شهر تولد، شهر و استان انگلیسی، مختصات، timezone، نام مادر، timestamps.
- `public.saved_charts`: `id`, `user_id`, `input_data jsonb`, `result_data jsonb`, `calculation_version`, `created_at`.
- `public.tarot_readings`: `id`, `user_id`, `spread_id`, `question`, `cards jsonb`, `created_at`, `interpretation`, `advice`.
- جدول‌های اصلی RLS روشن داشتند. `birth_profiles`, `saved_charts`, `tarot_readings` policyهای مالک‌محور داشتند.
- قیدهای profile برای `role` و `plan` وجود داشتند؛ FKهای user به `auth.users` نیز گزارش شدند.

### موارد مشکل‌دار/مفقود در audit

- `Profiles are viewable by everyone` با `USING (true)` دسترسی خواندن عمومی برای تمام پروفایل‌ها می‌داد.
- چند policy دیگر روی `profiles` تکراری یا هم‌پوشان بودند.
- تابع `is_admin()` به‌صورت `SECURITY DEFINER` با `EXECUTE` برای `PUBLIC`, `anon`, `authenticated`, `service_role` گزارش شد. تابع و triggerهای واقعی باید در audit پس از setup دوباره بررسی شوند.
- جدول‌های `payment_orders`, `sms_otp_challenges`, `sms_otp_ip_limits`, `research_articles` وجود نداشتند.
- در audit هیچ bucketی گزارش نشد.
- extensionها: `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault`, `uuid-ossp`. نیازی به تغییر extensionها از این خروجی نتیجه نمی‌شود.

## فایل‌های مرتبط با Supabase

- `supabase/diagnostics/schema_audit.sql`: ممیزی metadata پایه.
- `supabase/diagnostics/rls_policy_audit.sql`: وضعیت RLS و policyها.
- `supabase/diagnostics/profile_columns.sql`: ستون‌های profiles.
- `supabase/diagnostics/new_project_readonly_audit.sql`: audit چندبخشی با وضعیت موردانتظار `PRESENT/MISSING`.
- `supabase/diagnostics/one_click_new_project_audit.sql`: audit کامل با یک query و خروجی JSON؛ در پروژه اجرا و خروجی آن از سوی کاربر ارائه شد.
- `supabase/migrations/20261109000000_secure_luma_services.sql`: جدول‌ها و توابع OTP/پرداخت؛ برای schema واقعی اولیه نوشته نشده بود و نباید بی‌بررسی جداگانه اجرا شود.
- `supabase/migrations/20261109000001_research_articles.sql`: جدول مقالات و bucket جلد عمومی.
- `supabase/migrations/20261110000000_harden_profile_and_avatar_access.sql`: migration قبلی برای schema پروژهٔ دیگری/شرایط قبلی؛ پیش از اجرای مجدد آن را با setup SQL تطبیق دهید و بی‌دلیل هر دو روش را اجرا نکنید.
- `supabase/setup_new_luma_project.sql`: اسکریپت راه‌اندازی متناسب با audit جدید؛ تراکنشی است، policyهای اصلی را بازسازی می‌کند و جدول‌ها/bucketهای مفقود را اضافه می‌کند.
- `supabase/bootstrap_initial_admin.sql`: پس از ساخت پروفایل حساب مورداعتماد، فقط همان UUID را به role مدیر ارتقا می‌دهد.
- `supabase/SETUP_GUIDE.fa.md`: راهنمای فارسی مراحل و نکات Supabase.

## تصمیم‌های پیاده‌سازی

- bucket آواتار باید خصوصی باشد. برنامه مسیر Storage را در `profiles.avatar_url` ذخیره می‌کند و برای نمایش signed URL یک‌ساعته می‌سازد.
- bucket موردنیاز آواتار: `avatars`، خصوصی.
- bucket جلد مقالات پژوهشی: `research-article-covers`، عمومی؛ فایل‌های جلد عمومی‌اند و مدیریت فایل‌ها/مقالات باید فقط برای admin باشد.
- نقش/پلن اولیهٔ حساب‌ها: `user` / `free`.
- برای ارتقای مدیر اولیه، از داشبورد Authentication → Users همان UUID را در فایل محلی جایگزین کنید؛ آن را در چت نفرستید.
- مقادیر `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` باید در محیط محلی/deploy به پروژهٔ جدید اشاره کنند؛ هیچ Secret یا `service_role` key در چت یا کد قرار نگیرد.

## نکتهٔ مهم در مورد setup SQL

`supabase/setup_new_luma_project.sql` بر اساس خروجی audit نوشته شده، اما در این محیط PostgreSQL یا اتصال Supabase در دسترس نبود؛ بنابراین فقط بازرسی ایستا و `git diff --check` انجام شده است و اجرای SQL واقعی تأیید نشده است. از آنجا که script تراکنشی است، در صورت خطا transaction باید rollback شود؛ متن کامل خطا را قبل از تغییر دوباره بررسی کنید.

برای ادامه، در صورت نیاز SQL را یک‌بار دیگر دقیق بازبینی کنید؛ به‌خصوص اطمینان حاصل کنید:

1. پروژهٔ انتخاب‌شده واقعاً Supabase project جدید است، نه پروژهٔ قدیمی.
2. setup script واقعاً موفق شده است یا هنوز نه؛ «رفتن به مرحله بعد» در پیام کاربر به‌تنهایی اثبات اجرای موفق SQL نیست.
3. bucketهای نهایی `avatars` خصوصی و `research-article-covers` عمومی باشند.
4. policy عمومی profiles بعد از setup حذف شده باشد؛ دسترسی `anon` به profiles داده نشود.
5. trigger پروفایل مانع تغییر role/plan/subscription توسط خود کاربر باشد و admin را از عملیات مجاز روی سایر کاربران محروم نکند.
6. توابع `SECURITY DEFINER` فقط `service_role` یا نقش لازم را داشته باشند؛ کد بدنهٔ تابع یا secrets را از audit درخواست نکنید.

## گام بعدی کاربر (در صورت تأیید setup)

1. خود کاربر بررسی کند پروژهٔ جدید در محیط برنامه با `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` تنظیم شده باشد.
2. در برنامه یک حساب تحت کنترل خودش ثبت/وارد شود تا ردیف profile ساخته شود.
3. UUID همان حساب را از Supabase → Authentication → Users بردارد؛ UUID را برای دستیار ارسال نکند.
4. در فایل محلی `supabase/bootstrap_initial_admin.sql` فقط placeholder را جایگزین کند و SQL را در پروژهٔ درست اجرا کند.
5. سپس `supabase/diagnostics/rls_policy_audit.sql` یا audit یک‌مرحله‌ای را دوباره اجرا کند و خروجی را برای بازبینی policyها بفرستد.
6. آزمون عملی با دو حساب: مالکیت profile/chart/tarot/birth؛ عدم امکان تغییر role/plan توسط کاربر؛ مدیریت کاربران توسط admin؛ آپلود/نمایش signed URL آواتار؛ خواندن عمومی مقالات منتشرشده و مدیریت admin.
7. بعد از ساختار و تست‌های اولیه، deploy Edge Functions و secrets پرداخت/OTP جداگانه انجام شود؛ هنوز هیچ اتصال واقعی به ارائه‌دهندگان سرویس یا آزمون Sandbox در این چت انجام نشده است.

## وضعیت برنامه و Git

- آخرین build/test گزارش‌شده پس از تغییرات آواتار خصوصی: build موفق، `npm test` برابر **۱۹۹/۱۹۹ موفق**. هشدار bundle بزرگ همچنان هست.
- تغییرات آواتار: `src/features/profile/profileService.ts`, `src/features/profile/ProfileScreen.tsx`, `src/features/profile/types.ts`; در build و test بررسی شدند.
- برای فایل‌های SQL جدید، build لازم نیست؛ SQL runtime test انجام نشده است.
- در زمان تهیهٔ این گزارش `git status --short` تعداد زیادی تغییر tracked و untracked را نشان می‌داد (بسیاری از فایل‌های برنامه، asset، ترجمه، تست، فایل‌های Supabase و فایل‌های scan). همهٔ این تغییرها را به کار همین مرحله نسبت ندهید. Commit ساخته نشده است.
- هیچ `git reset`, `git checkout` یا پاک‌سازی broad انجام ندهید. تغییرات موجود کاربر را حفظ کنید.

## شروع پیشنهادی چت بعدی

پیام پیشنهادی:

> لطفاً گزارش `supabase/HANDOFF.fa.md` را بخوان و از بخش «گام بعدی کاربر» ادامه بده. قبل از اجرای هر SQL، اول تأیید کن `setup_new_luma_project.sql` روی پروژهٔ جدید موفق شده و Project Ref درست است. فعلاً Secret یا UUID را از من نخواه.
