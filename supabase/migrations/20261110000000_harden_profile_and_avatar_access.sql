do $$
begin
  if to_regclass('public.profiles') is null then
    raise exception 'Required table public.profiles does not exist.';
  end if;
end;
$$;

alter table public.profiles
  add column if not exists role text not null default 'user',
  add column if not exists plan text not null default 'free',
  add column if not exists subscription_until timestamptz,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists phone text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_role_allowed_values'
  ) then
    alter table public.profiles
      add constraint profiles_role_allowed_values
      check (role in ('user', 'admin'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_plan_allowed_values'
  ) then
    alter table public.profiles
      add constraint profiles_plan_allowed_values
      check (plan in ('free', 'premium', 'pro'));
  end if;
end;
$$;

do $$
begin
  if to_regclass('public.profiles') is null then
    raise exception 'Required table public.profiles does not exist.';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'id'
  ) or not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'role'
  ) or not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'plan'
  ) or not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'subscription_until'
  ) then
    raise exception 'public.profiles must contain id, role, plan, and subscription_until columns.';
  end if;

  if not exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'profiles'
      and c.relrowsecurity
  ) then
    raise exception 'Row-level security must be enabled on public.profiles.';
  end if;

  if not exists (
    select 1 from storage.buckets where id = 'avatars'
  ) then
    raise exception 'Required Storage bucket avatars does not exist.';
  end if;

  if exists (
    select 1 from storage.buckets where id = 'avatars' and public
  ) then
    raise exception 'Storage bucket avatars must be private.';
  end if;
end;
$$;

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
  for each row
  execute function public.luma_protect_profile_access();

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (public.luma_is_admin());

drop policy if exists "Admins can update other profiles" on public.profiles;
create policy "Admins can update other profiles"
  on public.profiles
  for update
  to authenticated
  using (
    public.luma_is_admin()
    and id <> (select auth.uid())
  )
  with check (
    public.luma_is_admin()
    and id <> (select auth.uid())
  );

drop policy if exists "Users can read own avatars" on storage.objects;
create policy "Users can read own avatars"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'avatars'
    and name like 'avatars/' || (select auth.uid())::text || '-%'
  );

drop policy if exists "Users can upload own avatars" on storage.objects;
create policy "Users can upload own avatars"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and name like 'avatars/' || (select auth.uid())::text || '-%'
  );

drop policy if exists "Users can update own avatars" on storage.objects;
create policy "Users can update own avatars"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and name like 'avatars/' || (select auth.uid())::text || '-%'
  )
  with check (
    bucket_id = 'avatars'
    and name like 'avatars/' || (select auth.uid())::text || '-%'
  );

drop policy if exists "Users can delete own avatars" on storage.objects;
create policy "Users can delete own avatars"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and name like 'avatars/' || (select auth.uid())::text || '-%'
  );
