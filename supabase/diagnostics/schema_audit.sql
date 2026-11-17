-- Read-only schema audit for LUMA.
-- Run in Supabase Dashboard > SQL Editor. This script returns schema metadata only;
-- it does not read application rows or modify the database.

-- 1. Tables and columns used by the application and migrations.
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
  and table_name in (
    'profiles',
    'birth_profiles',
    'saved_charts',
    'tarot_readings',
    'payment_orders',
    'sms_otp_challenges',
    'sms_otp_ip_limits',
    'research_articles',
    'objects',
    'buckets'
  )
order by table_schema, table_name, ordinal_position;

-- 2. Constraints for those tables, including primary and foreign keys.
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
  and c.relname in (
    'profiles',
    'birth_profiles',
    'saved_charts',
    'tarot_readings',
    'payment_orders',
    'sms_otp_challenges',
    'sms_otp_ip_limits',
    'research_articles',
    'objects',
    'buckets'
  )
order by n.nspname, c.relname, con.conname;

-- 3. RLS status and policies. Inspect profiles policies especially for role changes.
select
  n.nspname as schemaname,
  c.relname as tablename,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p')
  and n.nspname in ('public', 'storage')
  and c.relname in (
    'profiles',
    'birth_profiles',
    'saved_charts',
    'tarot_readings',
    'payment_orders',
    'sms_otp_challenges',
    'sms_otp_ip_limits',
    'research_articles',
    'objects'
  )
order by schemaname, tablename;

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname in ('public', 'storage')
  and tablename in (
    'profiles',
    'birth_profiles',
    'saved_charts',
    'tarot_readings',
    'payment_orders',
    'sms_otp_challenges',
    'sms_otp_ip_limits',
    'research_articles',
    'objects'
  )
order by schemaname, tablename, policyname;

-- 4. Explicit table privileges for client and server roles.
-- Limit this to data access privileges; REFERENCES/TRIGGER/TRUNCATE are not
-- useful for reviewing the application's row-level access.
select
  table_schema,
  table_name,
  grantee,
  privilege_type,
  is_grantable
from information_schema.role_table_grants
where table_schema in ('public', 'storage')
  and table_name in (
    'profiles',
    'birth_profiles',
    'saved_charts',
    'tarot_readings',
    'payment_orders',
    'sms_otp_challenges',
    'sms_otp_ip_limits',
    'research_articles',
    'objects',
    'buckets'
  )
  and grantee in ('anon', 'authenticated', 'service_role')
  and privilege_type in ('SELECT', 'INSERT', 'UPDATE', 'DELETE')
order by table_schema, table_name, grantee, privilege_type;

-- 5. Storage bucket configuration (no object names or file contents).
select
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
from storage.buckets
where id in ('avatars', 'research-article-covers')
order by id;

-- 6. Relevant SECURITY DEFINER functions and their execution grants.
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
  and p.proname in (
    'luma_issue_sms_otp',
    'luma_consume_sms_otp',
    'luma_complete_payment'
  )
order by p.proname, arguments;
