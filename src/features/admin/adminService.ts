import { supabase } from '../../lib/supabase';
import type { Plan } from '../../hooks/useSubscription';

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  role: 'user' | 'admin';
  plan: Plan;
  subscriptionUntil: string | null;
  createdAt: string;
}

/**
 * دریافت لیست همه کاربران (فقط برای ادمین)
 */
export async function getAllUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, role, plan, subscription_until, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return (data || []).map((u) => ({
    id: u.id,
    username: u.username || '',
    displayName: u.display_name || '',
    role: (u.role as 'user' | 'admin') || 'user',
    plan: (u.plan as Plan) || 'free',
    subscriptionUntil: u.subscription_until || null,
    createdAt: u.created_at,
  }));
}

/**
 * تغییر نقش کاربر
 */
export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);
  if (error) throw new Error('خطا در تغییر نقش: ' + error.message);
}

/**
 * تغییر پلن اشتراک کاربر
 */
export async function updateUserPlan(
  userId: string,
  plan: Plan,
  subscriptionUntil: string | null
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ plan, subscription_until: subscriptionUntil })
    .eq('id', userId);
  if (error) throw new Error('خطا در تغییر پلن: ' + error.message);
}

/**
 * فعال‌سازی دستی اشتراک (مثلاً برای هدیه یا تست)
 */
export async function activateSubscription(
  userId: string,
  plan: Plan,
  days: number
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  await updateUserPlan(userId, plan, expiresAt.toISOString());
}

/**
 * لغو اشتراک
 */
export async function cancelSubscription(userId: string): Promise<void> {
  await updateUserPlan(userId, 'free', null);
}