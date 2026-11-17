-- Read-only audit for confirming a new LUMA Supabase project's schema.
-- Run each SELECT separately in Supabase Dashboard > SQL Editor.
-- This script reads metadata only; it does not read user rows or modify anything.

-- 1. Basic database context. Confirm the project in the Supabase Dashboard URL
-- before running this script; SQL metadata alone cannot identify your project ref.
select
  current_database() as database_name,
  current_user as database_role,
  current_setting('server_version') as postgres_version;

-- 2. LUMA tables and columns expected by the current application/migrations.
-- This reports missing tables/columns as well as existing ones.
with expected_columns(table_name, column_name, feature) as (
  values
    ('profiles', 'id', 'accounts, profile and subscription'),
    ('profiles', 'username', 'accounts, profile and subscription'),
    ('profiles', 'display_name', 'accounts, profile and subscription'),
    ('profiles', 'avatar_url', 'accounts, profile and subscription'),
    ('profiles', 'created_at', 'accounts, profile and subscription'),
    ('profiles', 'role', 'accounts, profile and subscription'),
    ('profiles', 'plan', 'accounts, profile and subscription'),
    ('profiles', 'subscription_until', 'accounts, profile and subscription'),
    ('profiles', 'updated_at', 'accounts, profile and subscription'),
    ('profiles', 'phone', 'accounts, profile and subscription'),
    ('birth_profiles', 'user_id', 'birth profile'),
    ('birth_profiles', 'year', 'birth profile'),
    ('birth_profiles', 'month', 'birth profile'),
    ('birth_profiles', 'day', 'birth profile'),
    ('birth_profiles', 'birth_time', 'birth profile'),
    ('birth_profiles', 'birth_city', 'birth profile'),
    ('birth_profiles', 'birth_city_en', 'birth profile'),
    ('birth_profiles', 'birth_province', 'birth profile'),
    ('birth_profiles', 'latitude', 'birth profile'),
    ('birth_profiles', 'longitude', 'birth profile'),
    ('birth_profiles', 'timezone', 'birth profile'),
    ('birth_profiles', 'mother_name', 'birth profile'),
    ('birth_profiles', 'updated_at', 'birth profile'),
    ('saved_charts', 'id', 'saved astrology charts'),
    ('saved_charts', 'user_id', 'saved astrology charts'),
    ('saved_charts', 'input_data', 'saved astrology charts'),
    ('saved_charts', 'result_data', 'saved astrology charts'),
    ('saved_charts', 'calculation_version', 'saved astrology charts'),
    ('saved_charts', 'created_at', 'saved astrology charts'),
    ('tarot_readings', 'id', 'saved tarot readings'),
    ('tarot_readings', 'user_id', 'saved tarot readings'),
    ('tarot_readings', 'spread_id', 'saved tarot readings'),
    ('tarot_readings', 'question', 'saved tarot readings'),
    ('tarot_readings', 'cards', 'saved tarot readings'),
    ('tarot_readings', 'interpretation', 'saved tarot readings'),
    ('tarot_readings', 'advice', 'saved tarot readings'),
    ('tarot_readings', 'created_at', 'saved tarot readings'),
    ('payment_orders', 'id', 'server-side subscription payments'),
    ('payment_orders', 'user_id', 'server-side subscription payments'),
    ('payment_orders', 'authority', 'server-side subscription payments'),
    ('payment_orders', 'purpose', 'server-side subscription payments'),
    ('payment_orders', 'plan', 'server-side subscription payments'),
    ('payment_orders', 'cycle', 'server-side subscription payments'),
    ('payment_orders', 'amount_rial', 'server-side subscription payments'),
    ('payment_orders', 'status', 'server-side subscription payments'),
    ('payment_orders', 'created_at', 'server-side subscription payments'),
    ('payment_orders', 'paid_at', 'server-side subscription payments'),
    ('sms_otp_challenges', 'phone', 'server-side SMS OTP'),
    ('sms_otp_challenges', 'purpose', 'server-side SMS OTP'),
    ('sms_otp_challenges', 'code_hash', 'server-side SMS OTP'),
    ('sms_otp_challenges', 'expires_at', 'server-side SMS OTP'),
    ('sms_otp_challenges', 'last_sent_at', 'server-side SMS OTP'),
    ('sms_otp_challenges', 'attempts', 'server-side SMS OTP'),
    ('sms_otp_challenges', 'ip_hash', 'server-side SMS OTP'),
    ('sms_otp_ip_limits', 'ip_hash', 'server-side SMS OTP rate limits'),
    ('sms_otp_ip_limits', 'window_started_at', 'server-side SMS OTP rate limits'),
    ('sms_otp_ip_limits', 'send_count', 'server-side SMS OTP rate limits'),
    ('research_articles', 'id', 'research articles'),
    ('research_articles', 'language', 'research articles'),
    ('research_articles', 'category', 'research articles'),
    ('research_articles', 'title', 'research articles'),
    ('research_articles', 'description', 'research articles'),
    ('research_articles', 'cover_url', 'research articles'),
    ('research_articles', 'download_url', 'research articles'),
    ('research_articles', 'published', 'research articles'),
    ('research_articles', 'created_at', 'research articles'),
    ('research_articles', 'updated_at', 'research articles')
)
select
  expected.table_name,
  expected.feature,
  expected.column_name,
  case
    when table_info.table_name is null then 'MISSING TABLE'
    when column_info.column_name is null then 'MISSING COLUMN'
    else 'PRESENT'
  end as audit_status,
  column_info.data_type,
  column_info.udt_name,
  column_info.is_nullable,
  column_info.column_default
from expected_columns expected
left join information_schema.tables table_info
  on table_info.table_schema = 'public'
  and table_info.table_name = expected.table_name
  and table_info.table_type = 'BASE TABLE'
left join information_schema.columns column_info
  on column_info.table_schema = 'public'
  and column_info.table_name = expected.table_name
  and column_info.column_name = expected.column_name
order by expected.table_name, expected.column_name;

-- 3. Every application/storage column and its default/nullability.
select
  table_schema,
  table_name,
  ordinal_position,
  column_name,
  data_type,
  udt_name,
  is_nullable,
  column_default
from information_schema.columns
where table_schema in ('public', 'storage')
order by table_schema, table_name, ordinal_position;

-- 4. Primary keys, foreign keys, unique/check constraints.
select
  n.nspname as table_schema,
  c.relname as table_name,
  con.conname as constraint_name,
  con.contype as constraint_type,
  pg_get_constraintdef(con.oid) as definition
from pg_constraint con
join pg_class c on c.oid = con.conrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname in ('public', 'storage')
order by n.nspname, c.relname, con.conname;

-- 5. RLS status for all public/storage tables.
select
  n.nspname as table_schema,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p')
  and n.nspname in ('public', 'storage')
order by n.nspname, c.relname;

-- 6. RLS policy definitions.
select
  schemaname as table_schema,
  tablename as table_name,
  policyname,
  permissive,
  roles,
  cmd,
  qual as using_expression,
  with_check as check_expression
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;

-- 7. Explicit data-access grants to Supabase client/server roles.
select
  table_schema,
  table_name,
  grantee,
  privilege_type,
  is_grantable
from information_schema.role_table_grants
where table_schema in ('public', 'storage')
  and grantee in ('anon', 'authenticated', 'service_role')
  and privilege_type in ('SELECT', 'INSERT', 'UPDATE', 'DELETE')
order by table_schema, table_name, grantee, privilege_type;

-- 8. Storage bucket settings only (no object names or file contents).
select
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
from storage.buckets
order by id;

-- 9. User-created triggers on application tables, without trigger bodies.
select
  n.nspname as table_schema,
  c.relname as table_name,
  t.tgname as trigger_name,
  pg_get_triggerdef(t.oid) as trigger_definition,
  p.proname as function_name
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace n on n.oid = c.relnamespace
join pg_proc p on p.oid = t.tgfoid
where not t.tgisinternal
  and n.nspname in ('public', 'storage')
order by n.nspname, c.relname, t.tgname;

-- 10. SECURITY DEFINER functions and EXECUTE grants, without function bodies.
select
  n.nspname as function_schema,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  p.prosecdef as security_definer,
  p.proconfig as function_settings,
  coalesce(
    (
      select string_agg(
        case when x.grantee = 0 then 'PUBLIC' else pg_get_userbyid(x.grantee) end
        || ':' || x.privilege_type,
        ', ' order by x.grantee, x.privilege_type
      )
      from aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) x
    ),
    'no explicit grants'
  ) as execute_grants
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.prosecdef
order by p.proname, arguments;

-- 11. Installed extensions.
select extname as extension_name, extversion as extension_version
from pg_extension
order by extname;

-- Optional migration history. Run separately only if this table exists.
-- If it errors because the schema/table is absent, skip it and report that.
-- select version, name
-- from supabase_migrations.schema_migrations
-- order by version;
