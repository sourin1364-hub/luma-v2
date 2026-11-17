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

revoke all on public.sms_otp_challenges from anon, authenticated;
revoke all on public.sms_otp_ip_limits from anon, authenticated;
revoke all on public.payment_orders from anon, authenticated;

create or replace function public.luma_issue_sms_otp(
  p_phone text,
  p_purpose text,
  p_code_hash text,
  p_ip_hash text
) returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
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
set search_path = public, pg_temp
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

revoke all on function public.luma_issue_sms_otp(text, text, text, text) from public, anon, authenticated;
revoke all on function public.luma_consume_sms_otp(text, text, text) from public, anon, authenticated;
grant execute on function public.luma_issue_sms_otp(text, text, text, text) to service_role;
grant execute on function public.luma_consume_sms_otp(text, text, text) to service_role;

create or replace function public.luma_complete_payment(
  p_authority text,
  p_user_id uuid
) returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
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

revoke all on function public.luma_complete_payment(text, uuid) from public, anon, authenticated;
grant execute on function public.luma_complete_payment(text, uuid) to service_role;
