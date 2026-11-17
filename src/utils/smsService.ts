import { supabase } from '../lib/supabase';

export function normalizeIranPhone(phone: string): {
  local: string;
  international: string;
  valid: boolean;
} {
  const digits = phone
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/\D/g, '');

  let core = digits;
  if (core.startsWith('98') && core.length === 12) {
    core = core.slice(2);
  } else if (core.startsWith('0') && core.length === 11) {
    core = core.slice(1);
  }

  const valid = /^9\d{9}$/.test(core);
  return {
    local: `0${core}`,
    international: `+98${core}`,
    valid,
  };
}

export async function dispatchSmsOtp(
  phone: string,
  purpose: 'login' | 'password-reset' = 'login'
): Promise<{ sent: boolean; message: string }> {
  const normalized = normalizeIranPhone(phone);
  if (!normalized.valid) {
    throw new Error('شماره موبایل واردشده معتبر نیست (مثال صحیح: 09123456789)');
  }

  const { data, error } = await supabase.functions.invoke<{ sent: boolean; message: string }>(
    'sms-otp',
    { body: { action: 'send', phone: normalized.local, purpose } }
  );
  if (error) {
    console.error('SMS OTP request failed:', error);
    throw new Error('ارسال کد پیامکی انجام نشد. تنظیمات سرویس یا اتصال را بررسی کنید.');
  }
  if (!data?.sent) {
    throw new Error(data?.message || 'ارسال کد پیامکی انجام نشد.');
  }
  return data;
}

export async function verifySmsOtpCode(
  phone: string,
  inputCode: string,
  purpose: 'login' | 'password-reset' = 'login'
): Promise<boolean> {
  const normalized = normalizeIranPhone(phone);
  const code = inputCode
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/\D/g, '');

  if (!normalized.valid || !/^\d{6}$/.test(code)) return false;

  const { data, error } = await supabase.functions.invoke<{ verified: boolean; tokenHash?: string }>(
    'sms-otp',
    { body: { action: 'verify', phone: normalized.local, code, purpose } }
  );
  if (error) {
    console.error('SMS OTP verification failed:', error);
    throw new Error('بررسی کد پیامکی انجام نشد. دوباره تلاش کنید.');
  }
  if (!data?.verified || !data.tokenHash) return false;

  const { error: authError } = await supabase.auth.verifyOtp({
    token_hash: data.tokenHash,
    type: 'magiclink',
  });
  if (authError) {
    console.error('SMS OTP session exchange failed:', authError);
    throw new Error('تأیید کد انجام شد اما ورود امن تکمیل نشد. دوباره کد بگیرید.');
  }
  return true;
}
