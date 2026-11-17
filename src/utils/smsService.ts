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

const OTP_STORAGE_PREFIX = 'luma_pending_otp_';

export async function dispatchSmsOtp(
  phone: string,
  purpose: 'login' | 'password-reset' = 'login'
): Promise<{ sent: boolean; message: string }> {
  const normalized = normalizeIranPhone(phone);
  if (!normalized.valid) {
    throw new Error('شماره موبایل واردشده معتبر نیست (مثال صحیح: 09123456789)');
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const payload = {
    code,
    phone: normalized.local,
    purpose,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
  sessionStorage.setItem(`${OTP_STORAGE_PREFIX}${normalized.local}`, JSON.stringify(payload));

  const response = await fetch('https://lumeraworld.ir/send-sms.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: normalized.local, code }),
  });

  const res = await response.json().catch(() => null);
  const isSuccess =
    response.ok &&
    res &&
    ((res.Value && Number(res.Value) > 20) || res.RetStatus === 1 || res.StrRetStatus === 'Ok' || res.success === true);

  if (!isSuccess) {
    console.error('MeliPayamak SMS response:', res);
    throw new Error(res?.message || 'ارسال کد پیامکی انجام نشد. لطفاً لحظاتی دیگر تلاش کنید.');
  }

  return {
    sent: true,
    message: 'کد تأیید ۶ رقمی به شماره موبایل شما پیامک شد.',
  };
}

export async function verifySmsOtpCode(
  phone: string,
  inputCode: string,
  _purpose: 'login' | 'password-reset' = 'login'
): Promise<boolean> {
  const normalized = normalizeIranPhone(phone);
  const code = inputCode
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/\D/g, '');

  if (!normalized.valid || !/^\d{6}$/.test(code)) return false;

  const raw = sessionStorage.getItem(`${OTP_STORAGE_PREFIX}${normalized.local}`);
  if (!raw) return false;

  try {
    const saved = JSON.parse(raw);
    if (Date.now() > saved.expiresAt) {
      sessionStorage.removeItem(`${OTP_STORAGE_PREFIX}${normalized.local}`);
      return false;
    }
    if (saved.code === code) {
      sessionStorage.removeItem(`${OTP_STORAGE_PREFIX}${normalized.local}`);
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
