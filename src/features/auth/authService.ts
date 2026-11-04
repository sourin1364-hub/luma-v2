import { supabase } from '../../lib/supabase';
import type { AuthUser, SignUpData, SignInData } from './types';

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

async function ensureProfileExists(userId: string, username: string): Promise<void> {
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
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    }
  } catch (e) {
    console.warn('Profile ensure warning:', e);
  }
}

export async function signUp(data: SignUpData): Promise<AuthUser> {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanUsername = data.username.trim() || cleanEmail.split('@')[0];

  // تلاش اول با متادیتا
  let { data: result, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password: data.password,
    options: {
      data: {
        username: cleanUsername,
        display_name: cleanUsername,
      },
    },
  });

  // اگر تریگر دیتابیس به دلیل تداخل نام کاربری خطای Database error saving new user داد،
  // با نام کاربری یکتا مجدداً تلاش می‌کنیم تا ثبت‌نام بدون خطا انجام شود
  if (error && error.message.toLowerCase().includes('database error')) {
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const fallbackUsername = `${cleanUsername}_${uniqueSuffix}`;
    const retry = await supabase.auth.signUp({
      email: cleanEmail,
      password: data.password,
      options: {
        data: {
          username: fallbackUsername,
          display_name: cleanUsername,
        },
      },
    });
    result = retry.data;
    error = retry.error;
  }

  if (error) throw new Error(translateAuthError(error.message));
  if (!result?.user) throw new Error('خطا در ایجاد حساب کاربری');

  await ensureProfileExists(result.user.id, cleanUsername);
  return mapUser(result.user);
}

export async function signIn(data: SignInData): Promise<AuthUser> {
  const { data: result, error } = await supabase.auth.signInWithPassword({
    email: data.email.trim().toLowerCase(),
    password: data.password,
  });
  if (error) throw new Error(translateAuthError(error.message));
  if (!result.user) throw new Error('خطا در ورود');
  return mapUser(result.user);
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(translateAuthError(error.message));
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return mapUser(user);
}

export async function sendOtp(email: string, username?: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const { error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      shouldCreateUser: true,
      data: username ? { username, display_name: username } : undefined,
    },
  });
  if (error) throw new Error(translateAuthError(error.message));
}

export async function verifyOtp(email: string, token: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: 'email',
  });
  if (error) throw new Error(translateAuthError(error.message));
  if (!data.user) throw new Error('کد نامعتبر است');
  await ensureProfileExists(data.user.id, data.user.email?.split('@')[0] || 'user');
  return mapUser(data.user);
}

export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: window.location.origin + import.meta.env.BASE_URL,
  });
  if (error) throw new Error(translateAuthError(error.message));
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(translateAuthError(error.message));
}

export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback(mapUser(session.user));
    } else {
      callback(null);
    }
  });
}

function translateAuthError(message: string): string {
  if (message.toLowerCase().includes('database error saving new user')) {
    return 'خطای دیتابیس در ثبت کاربر جدید: لطفاً اسکریپت تعمیر تریگر جدول profiles را در SQL Editor پنل Supabase اجرا کنید یا نام کاربری دیگری امتحان نمایید.';
  }
  const map: Record<string, string> = {
    'Invalid login credentials': 'ایمیل یا رمز عبور اشتباه است',
    'Email not confirmed': 'لطفاً ابتدا ایمیل خود را تأیید کنید',
    'User already registered': 'این ایمیل قبلاً ثبت‌نام شده است. از بخش ورود وارد شوید.',
    'Password should be at least 6 characters': 'رمز عبور باید حداقل ۶ کاراکتر باشد',
    'Unable to validate email address: invalid format': 'فرمت ایمیل وارد شده نامعتبر است',
    'Email rate limit exceeded': 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً چند دقیقه صبر کنید',
    'Token has expired or is invalid': 'کد تأیید منقضی شده یا نامعتبر است',
    'Invalid OTP': 'کد وارد شده صحیح نیست',
  };
  return map[message] || message;
}
