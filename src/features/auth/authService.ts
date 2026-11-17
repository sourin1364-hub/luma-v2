import { supabase } from '../../lib/supabase';
import type { AuthUser, SignUpData, SignInData } from './types';
import { dispatchSmsOtp, verifySmsOtpCode, normalizeIranPhone } from '../../utils/smsService';

export const MAX_FREE_PASSWORD_RESETS = 3;
export const SMS_RECOVERY_FEE_TOMAN = 9000;

const RESET_QUOTA_STORAGE_PREFIX = 'luma_pwd_reset_count_';
const LUMERA_USER_STORAGE_KEY = 'lumera_user';

export class AuthError extends Error {
  key: string;
  constructor(key: string, fallback?: string) {
    super(fallback || key);
    this.name = 'AuthError';
    this.key = key;
  }
}

export const resolveAuthIdentifier = (identifier: string) => {
  const clean = identifier
    .trim()
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
  const isPhone = /^(\+98|98|0)?9\d{9}$/.test(clean);
  const normalizedPhone = isPhone ? '0' + clean.replace(/^(\+98|98|0)/, '') : null;
  const authEmail =
    isPhone && normalizedPhone
      ? `${normalizedPhone}@lumeraworld.ir`
      : clean.includes('@')
        ? clean.toLowerCase()
        : `${clean.toLowerCase()}@lumeraworld.ir`;
  return { isPhone, normalizedPhone, authEmail, rawIdentifier: clean };
};

function mapUser(user: any): AuthUser {
  const displayName =
    user.display_name ||
    user.full_name ||
    user.user_metadata?.display_name ||
    user.user_metadata?.username ||
    user.username ||
    user.phone ||
    user.email?.split('@')[0] ||
    'کاربر لومِرا';

  return {
    id: user.id,
    email: user.email || (user.phone ? `${user.phone}@lumeraworld.ir` : ''),
    username: user.username || user.user_metadata?.username || user.phone || displayName,
    displayName,
    avatarUrl: user.avatar_url || user.user_metadata?.avatar_url || null,
    createdAt: user.created_at || new Date().toISOString(),
  };
}

function saveLumeraSession(userObj: any): AuthUser {
  const mapped = mapUser(userObj);
  localStorage.setItem(
    LUMERA_USER_STORAGE_KEY,
    JSON.stringify({
      ...userObj,
      id: mapped.id,
      email: mapped.email,
      username: mapped.username,
      display_name: mapped.displayName,
      avatar_url: mapped.avatarUrl,
      created_at: mapped.createdAt,
    })
  );
  if (userObj.phone) {
    localStorage.setItem(`luma_user_phone_${mapped.id}`, userObj.phone);
    localStorage.setItem('luma_user_phone', userObj.phone);
  }
  window.dispatchEvent(new CustomEvent('luma:auth-changed', { detail: mapped }));
  window.dispatchEvent(new Event('luma:subscription-updated'));
  return mapped;
}

function getStoredLumeraUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(LUMERA_USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id) return null;
    return mapUser(parsed);
  } catch {
    return null;
  }
}

async function ensureProfileExists(userId: string, username: string, phone?: string): Promise<void> {
  try {
    const cleanUsername = username.trim() || `user_${userId.slice(0, 6)}`;
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!existing) {
      const uniqueUsername = `${cleanUsername}_${Math.floor(100 + Math.random() * 900)}`;
      await supabase.from('profiles').upsert(
        {
          id: userId,
          username: uniqueUsername,
          display_name: cleanUsername,
          role: 'user',
          plan: 'free',
          phone: phone || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    } else if (phone) {
      await supabase.from('profiles').update({ phone }).eq('id', userId);
    }
  } catch (e) {
    console.warn('Profile ensure warning:', e);
  }
}

export async function signUp(data: SignUpData & { phone?: string }): Promise<AuthUser> {
  const { normalizedPhone, authEmail, rawIdentifier } = resolveAuthIdentifier(data.email);
  const rawPhone = normalizedPhone || (data.phone ? normalizeIranPhone(data.phone).local : '');
  const cleanUsername = data.username.trim() || rawPhone || rawIdentifier;

  // ۱. اولویت اول: ثبت و همگام‌سازی از طریق auth-service.php سایت لومِرا
  if (rawPhone) {
    try {
      const res = await fetch('https://lumeraworld.ir/auth-service.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_user',
          phone: rawPhone,
          full_name: cleanUsername,
          password: data.password,
        }),
      });
      const d = await res.json().catch(() => null);
      if (d?.success && d?.user) {
        return saveLumeraSession(d.user);
      }
    } catch (e) {
      console.warn('Fallback to Supabase signUp:', e);
    }
  }

  // ۲. ثبت در Supabase Auth
  const { data: result, error } = await supabase.auth.signUp({
    email: authEmail,
    password: data.password,
    options: {
      data: {
        username: cleanUsername,
        display_name: cleanUsername,
        phone: rawPhone,
      },
    },
  });

  if (error || !result?.user) {
    const e = translateAuthError(error?.message || 'خطا در ایجاد حساب کاربری');
    throw new AuthError(e.key, e.fallback);
  }

  await ensureProfileExists(result.user.id, cleanUsername, rawPhone);
  return saveLumeraSession({ ...result.user, phone: rawPhone, display_name: cleanUsername });
}

export async function signIn(data: SignInData): Promise<AuthUser> {
  const { isPhone, normalizedPhone, rawIdentifier } = resolveAuthIdentifier(data.email);
  const loginIdentifier = isPhone && normalizedPhone ? normalizedPhone : rawIdentifier;

  // ۱. ورود مستقیم از طریق auth-service.php سایت لومِرا (پشتیبانی از شماره موبایل، نام کاربری و رمز سایت)
  try {
    const res = await fetch('https://lumeraworld.ir/auth-service.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login_password',
        phone: loginIdentifier,
        password: data.password,
      }),
    });
    const d = await res.json().catch(() => null);
    if (d?.success && d?.user) {
      return saveLumeraSession(d.user);
    }
  } catch (err) {
    console.warn('auth-service.php login fallback:', err);
  }

  // ۲. تلاش دوم با Supabase Auth (برای اکانت‌های ایمیلی یا پسوندهای @lumeraworld.ir و @luma.ir)
  const candidateEmails = isPhone && normalizedPhone
    ? [
        `${normalizedPhone}@lumeraworld.ir`,
        `${normalizedPhone.replace(/^0/, '98')}@luma.ir`,
        `${normalizedPhone}@luma.ir`,
      ]
    : rawIdentifier.includes('@')
      ? [rawIdentifier.toLowerCase()]
      : [`${rawIdentifier.toLowerCase()}@lumeraworld.ir`, `${rawIdentifier.toLowerCase()}@luma.ir`];

  for (const emailCandidate of candidateEmails) {
    const { data: result, error } = await supabase.auth.signInWithPassword({
      email: emailCandidate,
      password: data.password,
    });
    if (!error && result?.user) {
      return saveLumeraSession(result.user);
    }
  }

  const e = translateAuthError('Invalid login credentials');
  throw new AuthError(e.key, e.fallback);
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(LUMERA_USER_STORAGE_KEY);
  await supabase.auth.signOut().catch(() => {});
  window.dispatchEvent(new CustomEvent('luma:auth-changed', { detail: null }));
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const stored = getStoredLumeraUser();
  if (stored) return stored;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return mapUser(user);
}

export async function sendOtp(emailOrPhone: string, username?: string): Promise<void> {
  const { isPhone, normalizedPhone } = resolveAuthIdentifier(emailOrPhone);
  if (isPhone && normalizedPhone) {
    await dispatchSmsOtp(normalizedPhone, 'login');
    return;
  }
  const { error } = await supabase.auth.signInWithOtp({
    email: authEmail,
    options: {
      shouldCreateUser: true,
      data: username ? { username, display_name: username } : undefined,
    },
  });
  if (error) {
    const e = translateAuthError(error.message);
    throw new AuthError(e.key, e.fallback);
  }
}

export async function verifyOtp(emailOrPhone: string, token: string): Promise<AuthUser> {
  const { isPhone, normalizedPhone } = resolveAuthIdentifier(emailOrPhone);

  if (isPhone && normalizedPhone) {
    const isValid = await verifySmsOtpCode(normalizedPhone, token, 'login');
    if (!isValid) {
      throw new AuthError('auth_err_invalid_otp', 'کد پیامکی واردشده نامعتبر است یا منقضی شده است.');
    }

    // همگام‌سازی و دریافت پروفایل واقعی کاربر از auth-service.php سایت لومِرا
    const res = await fetch('https://lumeraworld.ir/auth-service.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sync_user',
        phone: normalizedPhone,
        full_name: normalizedPhone,
        password: '',
      }),
    });
    const d = await res.json().catch(() => null);
    if (d?.success && d?.user) {
      return saveLumeraSession(d.user);
    }

    throw new AuthError('auth_err_phone_signin_failed', 'تأیید کد انجام شد اما ارتباط با سرور برقرار نشد.');
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email: authEmail,
    token: token.trim(),
    type: 'email',
  });
  if (error || !data.user) {
    const e = translateAuthError(error?.message || 'Invalid OTP');
    throw new AuthError(e.key, e.fallback);
  }
  await ensureProfileExists(data.user.id, data.user.email?.split('@')[0] || 'user');
  return saveLumeraSession(data.user);
}

export interface PasswordResetQuotaStatus {
  usedCount: number;
  remainingFree: number;
  isUnlimitedSubscription: boolean;
  requiresSmsFeePayment: boolean;
}

export async function checkPasswordResetQuota(identifier: string): Promise<PasswordResetQuotaStatus> {
  const cleanId = identifier.trim().toLowerCase();
  const storageKey = `${RESET_QUOTA_STORAGE_PREFIX}${cleanId}`;
  const usedCount = parseInt(localStorage.getItem(storageKey) || '0', 10) || 0;

  let isUnlimitedSubscription = false;

  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.eq.${cleanId},display_name.eq.${cleanId},phone.eq.${cleanId}`)
      .maybeSingle();

    if (data) {
      const isAdmin = data.role === 'admin';
      const exp = data.subscription_until || data.subscription_expires_at;
      const isActive = exp ? new Date(exp) > new Date() : false;
      const plan = data.plan || data.tier;
      if (isAdmin || (isActive && (plan === 'premium' || plan === 'pro'))) {
        isUnlimitedSubscription = true;
      }
    }
  } catch {}

  const remainingFree = isUnlimitedSubscription
    ? 999
    : Math.max(0, MAX_FREE_PASSWORD_RESETS - usedCount);

  return {
    usedCount,
    remainingFree,
    isUnlimitedSubscription,
    requiresSmsFeePayment: !isUnlimitedSubscription && usedCount >= MAX_FREE_PASSWORD_RESETS,
  };
}

export function incrementPasswordResetCount(identifier: string): void {
  const cleanId = identifier.trim().toLowerCase();
  const storageKey = `${RESET_QUOTA_STORAGE_PREFIX}${cleanId}`;
  const current = parseInt(localStorage.getItem(storageKey) || '0', 10) || 0;
  localStorage.setItem(storageKey, String(current + 1));
}

export async function resetPassword(email: string): Promise<void> {
  const { isPhone, normalizedPhone, authEmail } = resolveAuthIdentifier(email);
  if (isPhone && normalizedPhone) {
    await sendSmsResetCode(normalizedPhone, normalizedPhone);
    return;
  }
  const quota = await checkPasswordResetQuota(authEmail);
  if (quota.requiresSmsFeePayment) {
    throw new AuthError('auth_err_quota_exhausted', 'سهمیه ۳ بار بازیابی رایگان شما به پایان رسیده است.');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
    redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}?reset_password=1`,
  });
  if (error) {
    const e = translateAuthError(error.message);
    throw new AuthError(e.key, e.fallback);
  }
  incrementPasswordResetCount(authEmail);
}

export async function sendSmsResetCode(phone: string, emailForQuota: string): Promise<{ sent: boolean; message: string }> {
  const norm = normalizeIranPhone(phone);
  if (!norm.valid) {
    throw new AuthError('auth_err_invalid_phone', 'لطفاً یک شماره موبایل معتبر وارد کنید (مثال: 09123456789).');
  }

  const quotaKey = emailForQuota.trim() || norm.local;
  const quota = await checkPasswordResetQuota(quotaKey);
  if (quota.requiresSmsFeePayment) {
    throw new AuthError('auth_err_sms_quota_exhausted', 'سهمیه ۳ بار پیامک رایگان شما تمام شده است.');
  }

  const smsResult = await dispatchSmsOtp(norm.local, 'password-reset');
  incrementPasswordResetCount(quotaKey);
  return smsResult;
}

export async function updatePassword(newPassword: string, phoneOverride?: string): Promise<void> {
  if (newPassword.length < 6) {
    throw new AuthError('auth_err_password_min_6', 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
  }

  const storedRaw = localStorage.getItem(LUMERA_USER_STORAGE_KEY);
  const storedPhone = phoneOverride || (storedRaw ? JSON.parse(storedRaw)?.phone : null) || localStorage.getItem('luma_user_phone');

  if (storedPhone) {
    const res = await fetch('https://lumeraworld.ir/auth-service.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'change_password',
        phone: storedPhone,
        new_password: newPassword,
      }),
    });
    const d = await res.json().catch(() => null);
    if (d?.success) return;
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    const e = translateAuthError(error.message);
    throw new AuthError(e.key, e.fallback);
  }
}

export function onAuthStateChange(callback: (user: AuthUser | null, event?: string) => void) {
  const customHandler = (e: Event) => {
    const customEvent = e as CustomEvent<AuthUser | null>;
    callback(customEvent.detail || getStoredLumeraUser(), 'LUMERA_AUTH');
  };
  window.addEventListener('luma:auth-changed', customHandler);

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback(mapUser(session.user), event);
    } else {
      const stored = getStoredLumeraUser();
      callback(stored, event);
    }
  });

  return {
    data: {
      subscription: {
        unsubscribe: () => {
          window.removeEventListener('luma:auth-changed', customHandler);
          data.subscription.unsubscribe();
        },
      },
    },
  };
}

export const sendLoginOtp = async (phoneOrEmail: string): Promise<boolean> => {
  const { isPhone, normalizedPhone } = resolveAuthIdentifier(phoneOrEmail);
  if (!isPhone || !normalizedPhone) {
    throw new AuthError('auth_err_phone_required_sms', 'لطفاً برای دریافت کد پیامکی، یک شماره موبایل معتبر وارد کنید.');
  }
  await dispatchSmsOtp(normalizedPhone, 'login');
  return true;
};

export const verifyLoginOtp = async (phoneOrEmail: string, enteredCode: string): Promise<boolean> => {
  const { normalizedPhone } = resolveAuthIdentifier(phoneOrEmail);
  if (!normalizedPhone) return false;
  return verifySmsOtpCode(normalizedPhone, enteredCode, 'login');
};

function translateAuthError(message: string): { key: string; fallback: string } {
  if (message.toLowerCase().includes('database error saving new user')) {
    return { key: 'auth_err_db_username_taken', fallback: 'خطای دیتابیس در ثبت کاربر جدید: لطفاً نام کاربری دیگری امتحان نمایید.' };
  }
  const map: Record<string, { key: string; fallback: string }> = {
    'Invalid login credentials': { key: 'auth_err_invalid_credentials', fallback: 'شماره موبایل، نام کاربری یا رمز عبور اشتباه است' },
    'Email not confirmed': { key: 'auth_err_email_not_confirmed', fallback: 'لطفاً ابتدا حساب خود را تأیید کنید' },
    'User already registered': { key: 'auth_err_user_already_registered', fallback: 'این شماره یا ایمیل قبلاً ثبت‌نام شده است. از بخش ورود وارد شوید.' },
    'Password should be at least 6 characters': { key: 'auth_err_password_min_6', fallback: 'رمز عبور باید حداقل ۶ کاراکتر باشد' },
    'Unable to validate email address: invalid format': { key: 'auth_err_invalid_email_format', fallback: 'فرمت شماره موبایل یا ایمیل وارد شده نامعتبر است' },
    'Email rate limit exceeded': { key: 'auth_err_rate_limit', fallback: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً چند دقیقه صبر کنید' },
    'Token has expired or is invalid': { key: 'auth_err_token_expired', fallback: 'کد تأیید منقضی شده یا نامعتبر است' },
    'Invalid OTP': { key: 'auth_err_invalid_otp', fallback: 'کد وارد شده صحیح نیست' },
  };
  return map[message] || { key: 'auth_err_unknown', fallback: message };
}

