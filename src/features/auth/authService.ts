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

export async function signUp(data: SignUpData): Promise<AuthUser> {
  const { data: result, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username,
        display_name: data.username,
      },
    },
  });
  if (error) throw new Error(translateAuthError(error.message));
  if (!result.user) throw new Error('خطا در ایجاد حساب');
  return mapUser(result.user);
}

export async function signIn(data: SignInData): Promise<AuthUser> {
  const { data: result, error } = await supabase.auth.signInWithPassword({
    email: data.email,
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return mapUser(user);
}

export async function sendOtp(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) throw new Error(translateAuthError(error.message));
}

export async function verifyOtp(email: string, token: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  if (error) throw new Error(translateAuthError(error.message));
  if (!data.user) throw new Error('کد نامعتبر است');
  return mapUser(data.user);
}

export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password',
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
  const map: Record<string, string> = {
    'Invalid login credentials': 'ایمیل یا رمز عبور اشتباه است',
    'Email not confirmed': 'لطفاً ایمیل خود را تأیید کنید',
    'User already registered': 'این ایمیل قبلاً ثبت‌نام کرده است',
    'Password should be at least 6 characters': 'رمز عبور باید حداقل ۶ کاراکتر باشد',
    'Unable to validate email address: invalid format': 'فرمت ایمیل نامعتبر است',
    'Email rate limit exceeded': 'تعداد درخواست‌ها زیاد است. لطفاً کمی صبر کنید',
    'Token has expired or is invalid': 'کد منقضی شده یا نامعتبر است',
    'Invalid OTP': 'کد وارد شده نامعتبر است',
  };
  return map[message] || message;
}