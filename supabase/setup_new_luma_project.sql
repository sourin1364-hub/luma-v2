-- Initialize the LUMA application schema reported by the new-project audit.
-- Run only against the verified target project in Supabase SQL Editor.
-- This preserves existing application rows and adds missing application objects.
begin;

do $$
begin
  if to_regclass('public.profiles') is null
    or to_regclass('public.birth_profiles') is null
    or to_regclass('public.saved_charts') is null
    or to_regclass('public.tarot_readings') is null then
    raise exception 'Expected LUMA core tables are missing; stop and audit the selected project.';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'id'
      and udt_name = 'uuid'
  ) then
    raise exception 'public.profiles.id must exist and be UUID.';
  end if;
end;
$$;

alter table public.profiles
  add column if not exists username text,
  add column if not exists display_name text,
  add column if not exists avatar_url text,
  add column if not exists role text default 'user',
  add column if not exists plan text default 'free',
  add column if not exists subscription_until timestamptz,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists phone text;

update public.profiles
set role = coalesce(role, 'user'),
    plan = coalesce(plan, 'free')
where role is null or plan is null;

alter table public.profiles
  alter column role set default 'user',
  alter column role set not null,
  alter column plan set default 'free',
  alter column plan set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname in ('profiles_role_check', 'profiles_role_allowed_values')
  ) then
    alter table public.profiles
      add constraint profiles_role_allowed_values check (role in ('user', 'admin'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname in ('profiles_plan_check', 'profiles_plan_allowed_values')
  ) then
    alter table public.profiles
      add constraint profiles_plan_allowed_values check (plan in ('free', 'premium', 'pro'));
  end if;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 2097152, array['image/*'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'research-article-covers',
  'research-article-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

do $$
begin
  if exists (select 1 from storage.buckets where id = 'avatars' and public) then
    raise exception 'The avatars bucket already exists as public. Make it private, then rerun this script.';
  end if;

  if exists (
    select 1 from storage.buckets
    where id = 'research-article-covers' and not public
  ) then
    raise exception 'The research-article-covers bucket exists as private. Review its visibility before rerunning.';
  end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.birth_profiles enable row level security;
alter table public.saved_charts enable row level security;
alter table public.tarot_readings enable row level security;

create or replace function public.luma_is_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, pg_temp
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.luma_is_admin() from public, anon;
grant execute on function public.luma_is_admin() to authenticated;

create or replace function public.luma_protect_profile_access()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
begin
  if coalesce(auth.role(), '') <> 'authenticated' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.id is distinct from auth.uid() then
      raise exception 'You can only create your own profile.';
    end if;

    new.role := 'user';
    new.plan := 'free';
    new.subscription_until := null;
    return new;
  end if;

  if new.id is distinct from old.id then
    raise exception 'A profile owner cannot be changed.';
  end if;

  if new.id = auth.uid() then
    if new.role is distinct from old.role
      or new.plan is distinct from old.plan
      or new.subscription_until is distinct from old.subscription_until then
      raise exception 'You cannot change your own role or subscription.';
    end if;
  elsif not public.luma_is_admin() then
    raise exception 'Only administrators can change another profile.';
  end if;

  return new;
end;
$$;

revoke all on function public.luma_protect_profile_access() from public, anon, authenticated;
drop trigger if exists luma_protect_profile_access on public.profiles;
create trigger luma_protect_profile_access
  before insert or update on public.profiles
  for each row execute function public.luma_protect_profile_access();

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Admins can update other profiles" on public.profiles;
drop policy if exists "LUMA users can read own profile" on public.profiles;
drop policy if exists "LUMA admins can read profiles" on public.profiles;
drop policy if exists "LUMA users can insert own profile" on public.profiles;
drop policy if exists "LUMA users can update own profile" on public.profiles;
drop policy if exists "LUMA admins can update other profiles" on public.profiles;

create policy "LUMA users can read own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "LUMA admins can read profiles"
  on public.profiles for select to authenticated
  using (public.luma_is_admin());

create policy "LUMA users can insert own profile"
  on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));

create policy "LUMA users can update own profile"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "LUMA admins can update other profiles"
  on public.profiles for update to authenticated
  using (public.luma_is_admin() and id <> (select auth.uid()))
  with check (public.luma_is_admin() and id <> (select auth.uid()));

revoke all on public.profiles from anon;
grant select, insert, update on public.profiles to authenticated;

drop policy if exists "Users own birth" on public.birth_profiles;
drop policy if exists "Users can upsert their own birth profile" on public.birth_profiles;
drop policy if exists "Enable all for users on own birth profiles" on public.birth_profiles;
drop policy if exists "LUMA users own birth profile" on public.birth_profiles;
create policy "LUMA users own birth profile"
  on public.birth_profiles for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Users own charts" on public.saved_charts;
drop policy if exists "Users can delete own charts" on public.saved_charts;
drop policy if exists "Users can insert own charts" on public.saved_charts;
drop policy if exists "Users can view own charts" on public.saved_charts;
drop policy if exists "LUMA users own charts" on public.saved_charts;
create policy "LUMA users own charts"
  on public.saved_charts for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "Users own readings" on public.tarot_readings;
drop policy if exists "Users can delete own readings" on public.tarot_readings;
drop policy if exists "Enable all for authenticated users" on public.tarot_readings;
drop policy if exists "Enable all for users on own readings" on public.tarot_readings;
drop policy if exists "LUMA users own readings" on public.tarot_readings;
create policy "LUMA users own readings"
  on public.tarot_readings for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

revoke all on public.birth_profiles, public.saved_charts, public.tarot_readings from anon;
grant select, insert, update, delete on public.birth_profiles to authenticated;
grant select, insert, update, delete on public.saved_charts to authenticated;
grant select, insert, update, delete on public.tarot_readings to authenticated;

create table if not exists public.sms_otp_challenges (
  phone text primary key check (phone ~ '^09[0-9]{9}$'),
  purpose text not null check (purpose in ('login', 'password-reset')),
  code_hash text not null,
  expires_at timestamptz not null,
  last_sent_at timestamptz not null,
  attempts integer not null default 0,
  ip_hash text not null
);

create table if not exists public.sms_otp_ip_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null,
  send_count integer not null
);

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  authority text not null unique,
  purpose text not null check (purpose = 'subscription'),
  plan text not null check (plan in ('premium', 'pro')),
  cycle text not null check (cycle in ('monthly', 'quarterly', 'semiannual', 'annual')),
  amount_rial bigint not null check (amount_rial > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.sms_otp_challenges enable row level security;
alter table public.sms_otp_ip_limits enable row level security;
alter table public.payment_orders enable row level security;
revoke all on public.sms_otp_challenges, public.sms_otp_ip_limits, public.payment_orders
  from anon, authenticated;
grant all on public.sms_otp_challenges, public.sms_otp_ip_limits, public.payment_orders
  to service_role;

create or replace function public.luma_issue_sms_otp(
  p_phone text,
  p_purpose text,
  p_code_hash text,
  p_ip_hash text
) returns boolean
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  current_ip_limit public.sms_otp_ip_limits%rowtype;
  current_challenge public.sms_otp_challenges%rowtype;
begin
  perform pg_advisory_xact_lock(hashtext(p_ip_hash));
  perform pg_advisory_xact_lock(hashtext(p_phone));

  select * into current_ip_limit
  from public.sms_otp_ip_limits
  where ip_hash = p_ip_hash
  for update;

  if found and current_ip_limit.window_started_at > now() - interval '1 hour'
     and current_ip_limit.send_count >= 10 then
    return false;
  end if;

  if not found then
    insert into public.sms_otp_ip_limits (ip_hash, window_started_at, send_count)
    values (p_ip_hash, now(), 1);
  elsif current_ip_limit.window_started_at <= now() - interval '1 hour' then
    update public.sms_otp_ip_limits
    set window_started_at = now(), send_count = 1
    where ip_hash = p_ip_hash;
  else
    update public.sms_otp_ip_limits
    set send_count = send_count + 1
    where ip_hash = p_ip_hash;
  end if;

  select * into current_challenge
  from public.sms_otp_challenges
  where phone = p_phone
  for update;

  if found and current_challenge.last_sent_at > now() - interval '60 seconds' then
    return false;
  end if;

  insert into public.sms_otp_challenges (
    phone, purpose, code_hash, expires_at, last_sent_at, attempts, ip_hash
  ) values (
    p_phone, p_purpose, p_code_hash, now() + interval '3 minutes', now(), 0, p_ip_hash
  )
  on conflict (phone) do update set
    purpose = excluded.purpose,
    code_hash = excluded.code_hash,
    expires_at = excluded.expires_at,
    last_sent_at = excluded.last_sent_at,
    attempts = 0,
    ip_hash = excluded.ip_hash;

  return true;
end;
$$;

create or replace function public.luma_consume_sms_otp(
  p_phone text,
  p_purpose text,
  p_code_hash text
) returns boolean
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  current_challenge public.sms_otp_challenges%rowtype;
begin
  select * into current_challenge
  from public.sms_otp_challenges
  where phone = p_phone
  for update;

  if not found then
    return false;
  end if;

  if current_challenge.expires_at <= now()
     or current_challenge.attempts >= 5
     or current_challenge.purpose <> p_purpose then
    delete from public.sms_otp_challenges where phone = p_phone;
    return false;
  end if;

  if current_challenge.code_hash = p_code_hash then
    delete from public.sms_otp_challenges where phone = p_phone;
    return true;
  end if;

  update public.sms_otp_challenges
  set attempts = attempts + 1
  where phone = p_phone;
  return false;
end;
$$;

create or replace function public.luma_complete_payment(
  p_authority text,
  p_user_id uuid
) returns boolean
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  order_row public.payment_orders%rowtype;
  duration_days integer;
begin
  select * into order_row
  from public.payment_orders
  where authority = p_authority and user_id = p_user_id
  for update;

  if not found then
    return false;
  end if;
  if order_row.status = 'paid' then
    return true;
  end if;
  if order_row.status <> 'pending' then
    return false;
  end if;

  duration_days := case order_row.cycle
    when 'monthly' then 30
    when 'quarterly' then 90
    when 'semiannual' then 180
    when 'annual' then 365
    else null
  end;
  if duration_days is null then
    return false;
  end if;

  update public.profiles
  set plan = order_row.plan,
      subscription_until = greatest(coalesce(subscription_until, now()), now())
        + make_interval(days => duration_days),
      updated_at = now()
  where id = p_user_id;

  if not found then
    raise exception 'Profile not found for the paid order.';
  end if;

  update public.payment_orders
  set status = 'paid', paid_at = now()
  where id = order_row.id;
  return true;
end;
$$;

revoke all on function public.luma_issue_sms_otp(text, text, text, text)
  from public, anon, authenticated;
revoke all on function public.luma_consume_sms_otp(text, text, text)
  from public, anon, authenticated;
revoke all on function public.luma_complete_payment(text, uuid)
  from public, anon, authenticated;
grant execute on function public.luma_issue_sms_otp(text, text, text, text) to service_role;
grant execute on function public.luma_consume_sms_otp(text, text, text) to service_role;
grant execute on function public.luma_complete_payment(text, uuid) to service_role;

create table if not exists public.research_articles (
  id uuid primary key default gen_random_uuid(),
  language text not null check (language in ('fa', 'en', 'ar', 'ckb')),
  category text not null default 'other',
  title text not null check (length(trim(title)) between 1 and 180),
  description text not null check (length(trim(description)) between 1 and 1200),
  cover_url text not null,
  download_url text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (download_url ~ '^https://')
);

alter table public.research_articles
  add column if not exists category text not null default 'other';
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'research_articles_category_check'
      and conrelid = 'public.research_articles'::regclass
  ) then
    alter table public.research_articles
      add constraint research_articles_category_check
      check (category in ('astronomy', 'astrology', 'tarot', 'psychology', 'spirituality', 'other'));
  end if;
end;
$$;

create index if not exists research_articles_publication_idx
  on public.research_articles (language, published, created_at desc);
create index if not exists research_articles_category_publication_idx
  on public.research_articles (language, published, category, created_at desc);

alter table public.research_articles enable row level security;
drop policy if exists "Published research articles are readable" on public.research_articles;
drop policy if exists "Admins manage research articles" on public.research_articles;
drop policy if exists "LUMA published articles are readable" on public.research_articles;
drop policy if exists "LUMA admins can read article drafts" on public.research_articles;
drop policy if exists "LUMA admins manage research articles" on public.research_articles;

create policy "LUMA published articles are readable"
  on public.research_articles for select to anon, authenticated
  using (published);

create policy "LUMA admins can read article drafts"
  on public.research_articles for select to authenticated
  using (public.luma_is_admin());

create policy "LUMA admins manage research articles"
  on public.research_articles for all to authenticated
  using (public.luma_is_admin())
  with check (public.luma_is_admin());

revoke all on public.research_articles from anon, authenticated;
grant select on public.research_articles to anon, authenticated;
grant insert, update, delete on public.research_articles to authenticated;

drop policy if exists "Users can read own avatars" on storage.objects;
drop policy if exists "Users can upload own avatars" on storage.objects;
drop policy if exists "Users can update own avatars" on storage.objects;
drop policy if exists "Users can delete own avatars" on storage.objects;
create policy "Users can read own avatars"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'avatars'
    and name like 'avatars/' || (select auth.uid())::text || '-%'
  );
create policy "Users can upload own avatars"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and name like 'avatars/' || (select auth.uid())::text || '-%'
  );
create policy "Users can update own avatars"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and name like 'avatars/' || (select auth.uid())::text || '-%'
  )
  with check (
    bucket_id = 'avatars'
    and name like 'avatars/' || (select auth.uid())::text || '-%'
  );
create policy "Users can delete own avatars"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and name like 'avatars/' || (select auth.uid())::text || '-%'
  );

drop policy if exists "Admins upload research covers" on storage.objects;
drop policy if exists "Admins update research covers" on storage.objects;
drop policy if exists "Admins delete research covers" on storage.objects;
create policy "Admins upload research covers"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'research-article-covers'
    and public.luma_is_admin()
  );
create policy "Admins update research covers"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'research-article-covers'
    and public.luma_is_admin()
  )
  with check (
    bucket_id = 'research-article-covers'
    and public.luma_is_admin()
  );
create policy "Admins delete research covers"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'research-article-covers'
    and public.luma_is_admin()
  );

commit;
