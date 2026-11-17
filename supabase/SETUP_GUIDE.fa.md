# راهنمای ممیزی Supabase برای LUMA

این راهنما برای تطبیق migrationها با پروژهٔ واقعی Supabase است. فعلاً هیچ migrationای را اجرا نکنید تا schema و policyهای موجود بررسی شوند؛ چون تعریف پایهٔ جدول‌های `profiles` و `birth_profiles` در این مخزن نیست و اجرای SQL حدسی ممکن است با پروژهٔ واقعی تداخل کند.

## ۱. گرفتن خروجی امن از schema

1. در داشبورد Supabase، پروژهٔ درست را باز کنید.
2. شناسهٔ پروژه را از URL داشبورد بررسی کنید تا مطمئن شوید پروژهٔ جدید است، نه پروژهٔ قبلی.
3. از منوی **SQL Editor** یک query جدید بسازید.
4. برای دیدن ساختار ستون‌ها و constraintها، محتوای فایل [`diagnostics/schema_audit.sql`](./diagnostics/schema_audit.sql) را اجرا کنید. در SQL Editor هر `SELECT` را جداگانه اجرا کنید تا نتیجهٔ همان بخش نمایش داده شود.
5. برای بررسی RLS، فقط محتوای فایل [`diagnostics/rls_policy_audit.sql`](./diagnostics/rls_policy_audit.sql) را جداگانه اجرا کنید؛ خروجی این query وضعیت RLS و policyهای جدول‌های مهم را در یک نتیجه می‌دهد.
6. خروجی بخش ستون‌های `profiles` و `birth_profiles` و تمام ردیف‌های فایل policy audit را برای ادامهٔ بررسی در اختیار دستیار قرار دهید.

برای ممیزی کامل دیتابیس تازه، از [`diagnostics/new_project_readonly_audit.sql`](./diagnostics/new_project_readonly_audit.sql) استفاده کنید. هر بخش `SELECT` را جداگانه اجرا کنید. بخش ۲ وجود هر جدول/ستون موردنیاز LUMA را با وضعیت `PRESENT` یا `MISSING` نشان می‌دهد؛ بخش‌های بعدی ستون‌های واقعی، constraintها، RLS و policyها، مجوزها، bucketها، triggerها، توابع امن و extensionها را گزارش می‌کنند. این اسکریپت فقط metadata می‌خواند و هیچ جدول یا داده‌ای را تغییر نمی‌دهد. اگر `supabase_migrations.schema_migrations` وجود دارد، query اختیاری انتهای فایل را نیز جداگانه اجرا کنید.

اگر اجرای چند query در SQL Editor دشوار است، فایل [`diagnostics/one_click_new_project_audit.sql`](./diagnostics/one_click_new_project_audit.sql) را کامل کپی و یک‌بار اجرا کنید. خروجی به‌صورت یک مقدار JSON در یک ردیف برمی‌گردد و فقط metadata است؛ آن را برای تطبیق schema ارسال کنید.

### نتیجهٔ audit دریافت‌شده در ۲۰۲۶-۱۱-۱۰

- جدول‌های اصلی `profiles`, `birth_profiles`, `saved_charts` و `tarot_readings` و ستون‌های موردنیاز فعلی برنامه وجود دارند.
- جدول‌های `payment_orders`, `sms_otp_challenges`, `sms_otp_ip_limits` و `research_articles` و bucketهای Storage در خروجی وجود نداشتند.
- جدول‌های اصلی RLS روشن داشتند؛ چارت، تاروت و تولد policy مالک‌محور داشتند. اما policy `Profiles are viewable by everyone` دسترسی خواندن عمومی به تمام پروفایل‌ها می‌داد و چند policy تکراری وجود داشت.
- برای همین وضعیت مشخص، اسکریپت یک‌مرحله‌ای [`setup_new_luma_project.sql`](./setup_new_luma_project.sql) آماده شده است. این اسکریپت ساختار اصلی و ردیف‌های موجود را نگه می‌دارد، ستون‌های profile را با مقدارهای محافظه‌کارانه کامل می‌کند، policy عمومی پروفایل را حذف و دسترسی مالک/مدیر را محدود می‌کند، و جدول‌ها و bucketهای مفقود برنامه را می‌سازد.

قبل از اجرای آن، پروژه/Project Ref را در داشبورد خودتان تطبیق دهید. اسکریپت audit شناسهٔ پروژه را گزارش نمی‌کند. اسکریپت setup را فقط روی پروژهٔ موردنظر اجرا کنید؛ تراکنشی است و در صورت خطا باید rollback شود. پس از موفقیت، policyهای RLS را دوباره audit کنید، یک حساب آزمایشی بسازید، همان حساب را به‌عنوان مدیر اولیه تنظیم کنید و سپس ورود، پروفایل، چارت، تاروت، آواتار خصوصی، مقالات و Edge Functionهای پرداخت/OTP را آزمایش کنید. مقادیر secret را هرگز در چت نفرستید.

### گام بعد از موفقیت setup

1. در تنظیمات محیطی برنامهٔ محلی و محیط deploy، `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` را از **پروژهٔ جدید** تنظیم کنید؛ مقدارها را در چت یا مخزن منتشر نکنید.
2. در برنامه یک حساب تحت کنترل خودتان بسازید و یک‌بار وارد شوید تا ردیف `profiles` ساخته شود.
3. فایل [`bootstrap_initial_admin.sql`](./bootstrap_initial_admin.sql) را باز کنید؛ UUID همان حساب را از **Authentication → Users** بردارید و فقط جای placeholder فایل قرار دهید.
4. پیش از اجرا دوباره Project Ref را کنترل کنید و فایل را یک‌بار در SQL Editor اجرا کنید. این فایل فقط ردیف همان UUID را مدیر می‌کند و اگر حساب یا پروفایل وجود نداشته باشد، با خطا متوقف می‌شود.
5. سپس `rls_policy_audit.sql` را دوباره اجرا کنید و مطمئن شوید policy عمومی خواندن profiles وجود ندارد و RLS روشن است. UUID را برای کسی نفرستید.

این اسکریپت فقط فرادادهٔ ساختار را می‌خواند: نام ستون‌ها، نوع ستون، قیدها، RLS، policyها، مجوزهای خواندن/نوشتن، تنظیم bucketها و مجوز اجرای چند تابع. داشتن grant برای `authenticated` به‌تنهایی به معنای دسترسی به همهٔ ردیف‌ها نیست؛ وقتی RLS روشن است، policyها دسترسی مؤثر را تعیین می‌کنند. این اسکریپت داده‌های کاربران، محتویات فایل‌ها، URL پروژه یا کلیدهای API را نمی‌خواند و چیزی را تغییر نمی‌دهد.

**پیش از فرستادن خروجی**، هر مقدار غیرمنتظره‌ای را که شبیه ایمیل، شماره تلفن، URL خصوصی یا secret است حذف کنید. خروجی عادی این queryها نباید شامل چنین داده‌هایی باشد. هیچ‌وقت `service_role` key، رمز، OTP یا فایل `.env` را در چت نفرستید.

## ۲. اجرای migrationها پس از تطبیق

در مخزن migrationهای زیر در مسیر `supabase/migrations/` موجود است:

1. [`20261109000000_secure_luma_services.sql`](./migrations/20261109000000_secure_luma_services.sql)
2. [`20261109000001_research_articles.sql`](./migrations/20261109000001_research_articles.sql)
3. [`20261110000000_harden_profile_and_avatar_access.sql`](./migrations/20261110000000_harden_profile_and_avatar_access.sql)
4. [`20261110000001_research_article_categories.sql`](./migrations/20261110000001_research_article_categories.sql)

دو migration اول هنوز به‌طور مستقل با schema پروژه تطبیق داده نشده‌اند. migration سوم با خروجی ستون‌های `profiles` و policyهای RLS که فرستادید تطبیق داده شده است. پیش از اجرای آن، خروجی ممیزی را برای جدول‌های دیگر بررسی کنید و bucket آواتار را طبق گام‌های زیر بسازید:

- آیا `public.profiles` ستون‌های `id`, `role`, `plan`, `subscription_until`, `updated_at` و `created_at` را دارد؟
- آیا policyهای `profiles` اجازه نمی‌دهند کاربر عادی نقش یا اشتراک خودش را به مدیر/پرمیوم تغییر دهد؟
- آیا `public.birth_profiles`، `public.saved_charts` و `public.tarot_readings` وجود دارند و فقط به مالک مجاز دسترسی می‌دهند؟
- آیا policyهای Storage برای `avatars` با ساختار مسیر `avatars/<user-id>-...` سازگارند؟
- آیا bucket `research-article-covers` از قبل وجود دارد؟ Migration دوم آن را عمومی می‌کند؛ فایل‌های جلد در نتیجه برای خواندن عمومی خواهند بود، درحالی‌که بارگذاری، ویرایش و حذف در policy به مدیر محدود شده است.
- Migration چهارم ستون دسته‌بندی مقاله‌ها را اضافه می‌کند؛ برای پایگاه‌داده‌ای که قبلاً setup شده، این migration را یک‌بار اجرا کنید تا نسخهٔ جدید کتابخانه مقاله‌ها را بخواند.
- Migration سوم بر اساس policyهایی که فرستادید و schema واقعی `profiles` تنظیم شده است. ستون‌های `role`, `plan`, `subscription_until`, `updated_at` و `phone` را در صورت نبودن اضافه می‌کند؛ برای حساب‌های موجود نقش `user` و پلن `free` می‌گذارد، جلوی تغییر role/plan/تاریخ اشتراک توسط خود کاربر را می‌گیرد، دسترسی خواندن/ویرایش پروفایل‌ها را برای مدیران فراهم می‌کند و عملیات آواتار را فقط برای مسیر متعلق به همان کاربر مجاز می‌کند. این migration همچنان فرض می‌کند `profiles.id` از نوع UUID است و bucket با شناسهٔ `avatars` از قبل ساخته شده است.
- Bucket آواتار را از **Storage → New bucket** بسازید: شناسه/نام دقیق `avatars` و گزینهٔ **Public bucket خاموش** باشد. کد برنامه اکنون مسیر فایل را در `profiles.avatar_url` ذخیره می‌کند و برای نمایش، URL امضاشدهٔ یک‌ساعته می‌سازد؛ مسیر فایل و bucket هر دو خصوصی می‌مانند. به‌جای درج مستقیم در `storage.buckets`، از داشبورد استفاده کنید تا تنظیمات Storage از طریق رابط پشتیبانی‌شدهٔ Supabase ثبت شود.

اگر schema سازگار است، migrationهایی را که قبلاً اجرا نشده‌اند ترجیحاً ابتدا در **Supabase project آزمایشی** اجرا کنید. وضعیت اجرای migrationهای قدیمی را از **Database → Migrations** بررسی کنید و فایل‌های قبلی را بدون بررسی دوباره اجرا نکنید. migration سوم را پس از ساخت bucket خصوصی `avatars` اجرا کنید. چون اجرای قبلی به‌علت نبودن bucket متوقف شده، پس از ساخت bucket می‌توانید همین migration idempotent را دوباره اجرا کنید. پس از بررسی موفقیت و آزمون‌های OTP، پرداخت، مقالات و Storage در محیط آزمایشی، طبق فرایند انتشار خودتان به production ببرید.

Migration سوم در ابتدای اجرا وجود جدول `profiles`، ستون `id`، فعال‌بودن RLS و وجود bucket خصوصی `avatars` را بررسی می‌کند و در صورت نبود هرکدام یا عمومی‌بودن bucket با خطای روشن متوقف می‌شود. سپس ستون‌های لازم برنامه را اضافه و از نقش و پلن مجاز اطمینان حاصل می‌کند. bucket را پیش از اجرای مجدد از مسیر **Storage → New bucket** ایجاد کنید و گزینهٔ Public را خاموش بگذارید.

چون schema قبلی ستون `role` نداشت، پس از اجرای موفق migration همهٔ حساب‌ها به‌صورت پیش‌فرض کاربر عادی خواهند بود. برای تعیین مدیر اولیه، در **Table Editor → profiles** ردیف حساب مورداعتماد را با UUID همان حساب از بخش **Authentication → Users** پیدا کنید و فقط همان ردیف را `role = admin` کنید؛ یا این query را در SQL Editor با UUID واقعی جایگزین و اجرا کنید:

```sql
update public.profiles
set role = 'admin', updated_at = now()
where id = 'REPLACE_WITH_TRUSTED_AUTH_USER_UUID'::uuid;
```

این کار را فقط برای حساب تحت کنترل خودتان و در پروژهٔ موردنظر انجام دهید. UUID را در چت نفرستید. در محیط آزمایشی، با دو حساب جداگانه بررسی کنید که کاربر نمی‌تواند role/plan خودش را تغییر دهد یا پروفایل کاربر دیگر را بخواند/ویرایش کند، ولی مدیر می‌تواند فهرست کاربران را بخواند و کاربران دیگر را مدیریت کند. عملیات آپلود، جایگزینی و حذف آواتار هر دو حساب را نیز امتحان کنید.

اگر migration به‌علت نبودن `profiles.id`، خاموش‌بودن RLS یا نبودن bucket `avatars` متوقف شد، آن را پشت‌سرهم دوباره اجرا نکنید. ابتدا علت را در schema/Storage بررسی کنید؛ ستون‌های role و plan را migration سوم خودش اضافه می‌کند.

اگر یکی از جدول‌ها، ستون‌ها یا policyها متفاوت است، migrationها را همان‌طور اجرا نکنید؛ ابتدا schema موجود را با migrationها هماهنگ کنید. اضافه‌کردن policy محدودکننده به‌تنهایی policyهای بازتر قبلی را خنثی نمی‌کند، چون policyهای permissive در PostgreSQL با OR ترکیب می‌شوند.

## ۳. تنظیم Edge Function secrets

تنظیمات secrets و deploy توابع را فقط بعد از آماده‌شدن migrationها و بدون قرار دادن مقادیر در مخزن انجام دهید. از **Supabase Dashboard → Edge Functions → Secrets** یا CLI رسمی استفاده کنید. نام متغیرهای موردنیاز را از توابع موجود تطبیق دهید؛ مقدار secret را در issue، log، screenshot یا چت قرار ندهید.

فعلاً این راهنما عمداً مقدار یا قالب فرضی برای secretها نمی‌سازد. ابتدا باید schema، provider accountها، callback URLها و محیط sandbox هر سرویس تأیید شوند.

## وضعیت فعلی

- Migrationها در مخزن هستند، اما اجراشدنشان روی پروژهٔ Supabase معلوم نیست.
- این مخزن فایل schema پایه یا `supabase/config.toml` ندارد.
- هیچ‌کدام از دستورهای این راهنما خودکار به پروژه وصل نمی‌شوند.
- migration سوم با metadata ارائه‌شده تطبیق یافته، اما هنوز روی پروژهٔ Supabase اجرا یا در محیط آزمایشی آزموده نشده است.
