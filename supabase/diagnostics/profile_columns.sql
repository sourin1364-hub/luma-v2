-- Read-only inspection of public.profiles columns.
-- Run in Supabase Dashboard > SQL Editor; this does not read profile rows.

select
  ordinal_position,
  column_name,
  data_type,
  udt_name,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
order by ordinal_position;
