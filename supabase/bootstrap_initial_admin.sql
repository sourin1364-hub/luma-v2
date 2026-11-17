-- Promote exactly one existing, trusted account after the setup SQL succeeded.
-- Replace the placeholder with that account's UUID from Authentication > Users.
-- Do not share the UUID or run this against a different Supabase project.
begin;

do $$
declare
  target_user_id uuid := 'REPLACE_WITH_TRUSTED_AUTH_USER_UUID';
begin
  if target_user_id::text = 'REPLACE_WITH_TRUSTED_AUTH_USER_UUID' then
    raise exception 'Replace the UUID placeholder before running this script.';
  end if;

  if not exists (
    select 1 from auth.users where id = target_user_id
  ) then
    raise exception 'No Auth user exists with the supplied UUID.';
  end if;

  if not exists (
    select 1 from public.profiles where id = target_user_id
  ) then
    raise exception 'No profile exists for this user. Sign in to LUMA first, then retry.';
  end if;

  update public.profiles
  set role = 'admin',
      updated_at = now()
  where id = target_user_id;
end;
$$;

commit;
