import { supabase } from '../../lib/supabase';
import type { AuthUser, SignUpData, SignInData } from './types';
import { dispatchSmsOtp, verifySmsOtpCode, normalizeIranPhone } from '../../utils/smsService';

export const MAX_FREE_PASSWORD_RESETS = 3;
export const SMS_RECOVERY_FEE_TOMAN = 9000;

const RESET_QUOTA_STORAGE_PREFIX = 'luma_pwd_reset_count_';

// کلاس اختصاصی خطا برای ارسال کلید ترجمه به همراه متن پشتیبان (فارسی)
export class AuthError extends Error {
  key: string;
  constructor(key: string, fallback?: string) {
    super(fallback || key);
    this.name = 'AuthError';
    this.key = key;
  }
}

// تشخیص و نرمال‌سازی شماره موبایل یا ایمیل (پشتیبانی از اعداد فارسی/عربی)
export const resolveAuthIdentifier = (identifier: string) => {
  const clean = identifier
    .trim()
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
  const isPhone = /^(\+98|98|0)?9\d{9}$/.test(clean);
  const normalizedPhone = isPhone ? '0' + clean.replace(/^(\+98|98|0)/, '') : null;
  const authEmail = isPhone && normalizedPhone ? `${normalizedPhone.replace(/^0/, '98')}@luma.ir` : clean.toLowerCase();
  return { isPhone, normalizedPhone, authEmail };
};

function mapUser(user: any): AuthUser {
  return {
    id: user.id,
    email: user.email || '',
    username: user.user_metadata?.username || user.email?.split('@')[0] || 'کاربر',
    displayName: user.user_metadata?.display_name || user.user_metadata?.username || 'کاربر',
    avatarUrl: user.user_metadata?.avatar_url || null,
    createdAt: user.created_at,
  };
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

    if (phone) {
      localStorage.setItem(`luma_user_phone_${userId}`, phone);
      localStorage.setItem('luma_user_phone', phone);
    }
  } catch (e) {
    console.warn('Profile ensure warning:', e);
  }
}

export async function signUp(data: SignUpData & { phone?: string }): Promise<AuthUser> {
  const { authEmail, normalizedPhone } = resolveAuthIdentifier(data.email);
  const rawPhone = normalizedPhone || data.phone || '';
  const cleanUsername = data.username.trim() || rawPhone || authEmail.split('@')[0];

  let { data: result, error } = await supabase.auth.signUp({
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

  if (error && error.message.toLowerCase().includes('database error')) {
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const fallbackUsername = `${cleanUsername}_${uniqueSuffix}`;
    const retry = await supabase.auth.signUp({
      email: authEmail,
      password: data.password,
      options: {
        data: {
          username: fallbackUsername,
          display_name: cleanUsername,
          phone: rawPhone,
        },
      },
    });
    result = retry.data;
    error = retry.error;
  }

  if (error) {
    const e = translateAuthError(error.message);
    throw new AuthError(e.key, e.fallback);
  }
  if (!result?.user) throw new AuthError('auth_err_create_account', 'خطا در ایجاد حساب کاربری');

  await ensureProfileExists(result.user.id, cleanUsername, rawPhone);
  return mapUser(result.user);
}

export async function signIn(data: SignInData): Promise<AuthUser> {
  const { authEmail } = resolveAuthIdentifier(data.email);

  const { data: result, error } = await supabase.auth.signInWithPassword({
    email: authEmail,
    password: data.password,
  });

  if (error) {
    const e = translateAuthError(error.message);
    throw new AuthError(e.key, e.fallback);
  }
  if (!result.user) throw new AuthError('auth_err_signin', 'خطا در ورود');
  return mapUser(result.user);
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    const e = translateAuthError(error.message);
    throw new AuthError(e.key, e.fallback);
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return mapUser(user);
}

export async function sendOtp(emailOrPhone: string, username?: string): Promise<void> {
  const { isPhone, normalizedPhone, authEmail } = resolveAuthIdentifier(emailOrPhone);
  if (isPhone && normalizedPhone) {
    await dispatchSmsOtp(normalizedPhone);
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
  const { isPhone, normalizedPhone, authEmail } = resolveAuthIdentifier(emailOrPhone);

  if (isPhone && normalizedPhone) {
    const isValid = await verifySmsOtpCode(normalizedPhone, token, 'login');
    if (!isValid) {
      throw new AuthError('auth_err_invalid_otp', 'کد پیامکی واردشده نامعتبر است یا منقضی شده است.');
    }
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthError('auth_err_phone_signin_failed', 'ورود امن با شماره موبایل تکمیل نشد.');
    }
    await ensureProfileExists(user.id, normalizedPhone, normalizedPhone);
    return user;
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email: authEmail,
    token: token.trim(),
    type: 'email',
  });
  if (error) {
    const e = translateAuthError(error.message);
    throw new AuthError(e.key, e.fallback);
  }
  if (!data.user) throw new AuthError('auth_err_invalid_otp', 'کد نامعتبر است');
  await ensureProfileExists(data.user.id, data.user.email?.split('@')[0] || 'user');
  return mapUser(data.user);
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
      .select('role, plan, subscription_until')
      .or(`username.eq.${cleanId},display_name.eq.${cleanId},phone.eq.${cleanId}`)
      .maybeSingle();

    if (data) {
      const isAdmin = data.role === 'admin';
      const isActive = data.subscription_until ? new Date(data.subscription_until) > new Date() : false;
      if (isAdmin || (isActive && (data.plan === 'premium' || data.plan === 'pro'))) {
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
  const { authEmail } = resolveAuthIdentifier(email);
  const quota = await checkPasswordResetQuota(authEmail);

  if (quota.requiresSmsFeePayment) {
    throw new AuthError('auth_err_quota_exhausted', 'سهمیه ۳ بار بازیابی رایگان شما به پایان رسیده است. لطفاً هزینه ارسال پیامک را پرداخت کنید یا اشتراک پریمیوم تهیه نمایید.');
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

export async function updatePassword(newPassword: string): Promise<void> {
  if (newPassword.length < 6) {
    throw new AuthError('auth_err_password_min_6', 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
  }
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    const e = translateAuthError(error.message);
    throw new AuthError(e.key, e.fallback);
  }
}

export function onAuthStateChange(callback: (user: AuthUser | null, event?: string) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback(mapUser(session.user), event);
    } else {
      callback(null, event);
    }
  });
}

export const sendLoginOtp = async (phoneOrEmail: string): Promise<boolean> => {
  const { isPhone, normalizedPhone } = resolveAuthIdentifier(phoneOrEmail);
  if (!isPhone || !normalizedPhone) {
    throw new AuthError('auth_err_phone_required_sms', 'لطفاً برای دریافت کد پیامکی، یک شماره موبایل معتبر وارد کنید.');
  }
  await dispatchSmsOtp(normalizedPhone);
  return true;
};

export const verifyLoginOtp = async (phoneOrEmail: string, enteredCode: string): Promise<boolean> => {
  const { normalizedPhone } = resolveAuthIdentifier(phoneOrEmail);
  if (!normalizedPhone) return false;
  return verifySmsOtpCode(normalizedPhone, enteredCode);
};

function translateAuthError(message: string): { key: string; fallback: string } {
  if (message.toLowerCase().includes('database error saving new user')) {
    return { key: 'auth_err_db_username_taken', fallback: 'خطای دیتابیس در ثبت کاربر جدید: لطفاً نام کاربری دیگری امتحان نمایید.' };
  }
  const map: Record<string, { key: string; fallback: string }> = {
    'Invalid login credentials': { key: 'auth_err_invalid_credentials', fallback: 'ایمیل یا رمز عبور اشتباه است' },
    'Email not confirmed': { key: 'auth_err_email_not_confirmed', fallback: 'لطفاً ابتدا ایمیل خود را تأیید کنید' },
    'User already registered': { key: 'auth_err_user_already_registered', fallback: 'این ایمیل یا شماره قبلاً ثبت‌نام شده است. از بخش ورود وارد شوید.' },
    'Password should be at least 6 characters': { key: 'auth_err_password_min_6', fallback: 'رمز عبور باید حداقل ۶ کاراکتر باشد' },
    'Unable to validate email address: invalid format': { key: 'auth_err_invalid_email_format', fallback: 'فرمت ایمیل یا شماره وارد شده نامعتبر است' },
    'Email rate limit exceeded': { key: 'auth_err_rate_limit', fallback: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً چند دقیقه صبر کنید' },
    'Token has expired or is invalid': { key: 'auth_err_token_expired', fallback: 'کد تأیید منقضی شده یا نامعتبر است' },
    'Invalid OTP': { key: 'auth_err_invalid_otp', fallback: 'کد وارد شده صحیح نیست' },
  };
  return map[message] || { key: 'auth_err_unknown', fallback: message };
}