import { supabase } from '../../lib/supabase';
import type { BirthProfile, ProfileData } from './types';

/**
 * دریافت پروفایل کاربر از جدول profiles
 */
export async function getProfile(userId: string): Promise<ProfileData | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, username, avatar_url')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  if (!data) return null;
  return {
    displayName: data.display_name || '',
    username: data.username || '',
    avatarUrl: data.avatar_url || null,
  };
}

/**
 * به‌روزرسانی پروفایل (نام، نام کاربری، آواتار)
 */
export async function updateProfile(userId: string, data: Partial<ProfileData>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: data.displayName,
      username: data.username,
      avatar_url: data.avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
  if (error) throw new Error('خطا در به‌روزرسانی پروفایل: ' + error.message);
}

/**
 * دریافت اطلاعات تولد
 */
export async function getBirthProfile(userId: string): Promise<BirthProfile | null> {
  const { data, error } = await supabase
    .from('birth_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching birth profile:', error);
    return null;
  }
  if (!data) return null;
  return {
    id: data.id,
    year: data.year,
    month: data.month,
    day: data.day,
    birthTime: data.birth_time || '',
    birthCity: data.birth_city || '',
    birthCityEn: data.birth_city_en || '',
    birthProvince: data.birth_province || '',
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    timezone: data.timezone || 'Asia/Tehran',
    motherName: data.mother_name || '',
  };
}

/**
 * ذخیره یا به‌روزرسانی اطلاعات تولد
 */
export async function saveBirthProfile(userId: string, data: BirthProfile): Promise<void> {
  const { error } = await supabase
    .from('birth_profiles')
    .upsert({
      user_id: userId,
      year: data.year,
      month: data.month,
      day: data.day,
      birth_time: data.birthTime,
      birth_city: data.birthCity,
      birth_city_en: data.birthCityEn,
      birth_province: data.birthProvince,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      mother_name: data.motherName,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  if (error) throw new Error('خطا در ذخیره اطلاعات تولد: ' + error.message);
}

/**
 * آپلود آواتار به Supabase Storage
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });
  if (uploadError) throw new Error('خطا در آپلود تصویر: ' + uploadError.message);

  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return urlData.publicUrl;
}

/**
 * خروج از حساب
 */
export async function signOutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}