-- Read-only audit of row-level security settings and policies.
-- Run this file by itself in Supabase Dashboard > SQL Editor.
-- It returns policy metadata only; it does not read application rows or modify data.

select
  n.nspname as table_schema,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced,
  p.policyname,
  p.permissive,
  p.roles,
  p.cmd,
  p.qual as using_expression,
  p.with_check as check_expression
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policies p
  on p.schemaname = n.nspname
  and p.tablename = c.relname
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
order by n.nspname, c.relname, p.policyname;
