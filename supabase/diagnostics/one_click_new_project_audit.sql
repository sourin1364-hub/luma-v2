-- One-query, read-only audit for a new LUMA Supabase project.
-- In Supabase SQL Editor, run this entire file once and share the single JSON result.
-- It reads schema metadata only; it does not read user rows or modify the database.

with expected_columns(table_name, column_name, feature) as (
  values
    ('profiles', 'id', 'profile and subscription'),
    ('profiles', 'username', 'profile and subscription'),
    ('profiles', 'display_name', 'profile and subscription'),
    ('profiles', 'avatar_url', 'profile and subscription'),
    ('profiles', 'created_at', 'profile and subscription'),
    ('profiles', 'role', 'profile and subscription'),
    ('profiles', 'plan', 'profile and subscription'),
    ('profiles', 'subscription_until', 'profile and subscription'),
    ('profiles', 'updated_at', 'profile and subscription'),
    ('profiles', 'phone', 'profile and subscription'),
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
    ('payment_orders', 'id', 'server-side payments'),
    ('payment_orders', 'user_id', 'server-side payments'),
    ('payment_orders', 'authority', 'server-side payments'),
    ('payment_orders', 'purpose', 'server-side payments'),
    ('payment_orders', 'plan', 'server-side payments'),
    ('payment_orders', 'cycle', 'server-side payments'),
    ('payment_orders', 'amount_rial', 'server-side payments'),
    ('payment_orders', 'status', 'server-side payments'),
    ('payment_orders', 'created_at', 'server-side payments'),
    ('payment_orders', 'paid_at', 'server-side payments'),
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
),
expected_audit as (
  select
    e.table_name,
    e.feature,
    e.column_name,
    case
      when t.table_name is null then 'MISSING TABLE'
      when c.column_name is null then 'MISSING COLUMN'
      else 'PRESENT'
    end as audit_status,
    c.data_type,
    c.udt_name,
    c.is_nullable,
    c.column_default
  from expected_columns e
  left join information_schema.tables t
    on t.table_schema = 'public'
    and t.table_name = e.table_name
    and t.table_type = 'BASE TABLE'
  left join information_schema.columns c
    on c.table_schema = 'public'
    and c.table_name = e.table_name
    and c.column_name = e.column_name
),
actual_columns as (
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
),
constraints_audit as (
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
),
rls_audit as (
  select
    n.nspname as table_schema,
    c.relname as table_name,
    c.relrowsecurity as rls_enabled,
    c.relforcerowsecurity as rls_forced
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where c.relkind in ('r', 'p')
    and n.nspname in ('public', 'storage')
),
policies_audit as (
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
),
grants_audit as (
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
),
buckets_audit as (
  select id, name, public, file_size_limit, allowed_mime_types
  from storage.buckets
),
triggers_audit as (
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
),
security_definer_audit as (
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
),
extensions_audit as (
  select extname as extension_name, extversion as extension_version
  from pg_extension
)
select jsonb_pretty(
  jsonb_build_object(
    'notice', 'Read-only metadata audit. No application rows were read and no changes were made.',
    'database', jsonb_build_object(
      'database_name', current_database(),
      'database_role', current_user,
      'postgres_version', current_setting('server_version')
    ),
    'expected_luma_columns', coalesce(
      (select jsonb_agg(to_jsonb(x) order by x.table_name, x.column_name) from expected_audit x),
      '[]'::jsonb
    ),
    'actual_public_and_storage_columns', coalesce(
      (select jsonb_agg(to_jsonb(x) order by x.table_schema, x.table_name, x.ordinal_position) from actual_columns x),
      '[]'::jsonb
    ),
    'constraints', coalesce(
      (select jsonb_agg(to_jsonb(x) order by x.table_schema, x.table_name, x.constraint_name) from constraints_audit x),
      '[]'::jsonb
    ),
    'row_level_security', coalesce(
      (select jsonb_agg(to_jsonb(x) order by x.table_schema, x.table_name) from rls_audit x),
      '[]'::jsonb
    ),
    'policies', coalesce(
      (select jsonb_agg(to_jsonb(x) order by x.table_schema, x.table_name, x.policyname) from policies_audit x),
      '[]'::jsonb
    ),
    'table_grants', coalesce(
      (select jsonb_agg(to_jsonb(x) order by x.table_schema, x.table_name, x.grantee, x.privilege_type) from grants_audit x),
      '[]'::jsonb
    ),
    'storage_buckets', coalesce(
      (select jsonb_agg(to_jsonb(x) order by x.id) from buckets_audit x),
      '[]'::jsonb
    ),
    'user_triggers', coalesce(
      (select jsonb_agg(to_jsonb(x) order by x.table_schema, x.table_name, x.trigger_name) from triggers_audit x),
      '[]'::jsonb
    ),
    'security_definer_functions', coalesce(
      (select jsonb_agg(to_jsonb(x) order by x.function_schema, x.function_name, x.arguments) from security_definer_audit x),
      '[]'::jsonb
    ),
    'extensions', coalesce(
      (select jsonb_agg(to_jsonb(x) order by x.extension_name) from extensions_audit x),
      '[]'::jsonb
    )
  )
) as luma_database_audit;
