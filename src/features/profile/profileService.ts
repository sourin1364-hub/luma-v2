import { supabase } from '../../lib/supabase';
import type { BirthProfile, ProfileData } from './types';

const LOCAL_PROFILE_KEY = 'luma_cached_profile_';
const LOCAL_BIRTH_KEY = 'luma_cached_birth_';
const AVATAR_BUCKET = 'avatars';
const AVATAR_SIGNED_URL_TTL_SECONDS = 60 * 60;

function isAvatarStoragePath(value: string | null): value is string {
  return value?.startsWith(`${AVATAR_BUCKET}/`) ?? false;
}

async function resolveProfileAvatar(profile: ProfileData): Promise<ProfileData> {
  const avatarPath =
    profile.avatarPath || (isAvatarStoragePath(profile.avatarUrl) ? profile.avatarUrl : null);

  if (!avatarPath) return { ...profile, avatarPath: null };

  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(avatarPath, AVATAR_SIGNED_URL_TTL_SECONDS);

  if (error) throw new Error(`Could not create a signed avatar URL: ${error.message}`);

  return { ...profile, avatarUrl: data.signedUrl, avatarPath };
}

// 👇 این کلاس دقیقاً همان چیزی است که خطای شما را حل می‌کند
export class ProfileError extends Error {
  key: string;
  constructor(key: string, fallback?: string) {
    super(fallback || key);
    this.name = 'ProfileError';
    this.key = key;
  }
}

export async function getProfile(userId: string): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, username, avatar_url')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    if (data) {
      const result: ProfileData = {
        displayName: data.display_name || '',
        username: data.username || '',
        avatarUrl: data.avatar_url || null,
        avatarPath: isAvatarStoragePath(data.avatar_url) ? data.avatar_url : null,
      };
      localStorage.setItem(LOCAL_PROFILE_KEY + userId, JSON.stringify(result));
      return await resolveProfileAvatar(result);
    }
  } catch (error) {
    console.warn('Could not load profile from Supabase; trying cached profile:', error);
  }

  try {
    const cached = localStorage.getItem(LOCAL_PROFILE_KEY + userId);
    if (cached) return await resolveProfileAvatar(JSON.parse(cached) as ProfileData);
  } catch (error) {
    console.warn('Could not resolve cached profile avatar:', error);
  }
  return null;
}

export async function updateProfile(
  userId: string,
  data: Partial<ProfileData> & { phone?: string | null }
): Promise<void> {
  try {
    const prevRaw = localStorage.getItem(LOCAL_PROFILE_KEY + userId);
    const prev = prevRaw ? JSON.parse(prevRaw) : {};
    const merged = { ...prev, ...data };
    if (merged.avatarPath) merged.avatarUrl = merged.avatarPath;
    localStorage.setItem(LOCAL_PROFILE_KEY + userId, JSON.stringify(merged));
  } catch {}

  const payload: Record<string, any> = {
    id: userId,
    updated_at: new Date().toISOString(),
  };

  if (data.displayName !== undefined) payload.display_name = data.displayName;
  if (data.username !== undefined) payload.username = data.username;
  if (data.avatarPath !== undefined || data.avatarUrl !== undefined) {
    payload.avatar_url = data.avatarPath || data.avatarUrl || null;
  }
  if (data.phone !== undefined) payload.phone = data.phone;

  const { error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.warn('Supabase profile sync warning (saved locally):', error.message);
    throw new Error(error.message);
  }
}

export async function getBirthProfile(userId: string): Promise<BirthProfile | null> {
  try {
    const { data, error } = await supabase
      .from('birth_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      const result: BirthProfile = {
        id: data.id,
        year: data.year,
        month: data.month,
        day: data.day,
        birthTime: data.birth_time || '14:30',
        birthCity: data.birth_city || 'تهران',
        birthCityEn: data.birth_city_en || 'Tehran',
        birthProvince: data.birth_province || 'تهران',
        latitude: data.latitude || 35.6892,
        longitude: data.longitude || 51.3890,
        timezone: data.timezone || 'Asia/Tehran',
        motherName: data.mother_name || '',
      };
      localStorage.setItem(LOCAL_BIRTH_KEY + userId, JSON.stringify(result));
      return result;
    }
  } catch (e) {
    console.warn('Fallback to cached birth profile:', e);
  }

  try {
    const cached = localStorage.getItem(LOCAL_BIRTH_KEY + userId);
    if (cached) return JSON.parse(cached);
  } catch {}
  return null;
}

export async function saveBirthProfile(userId: string, data: BirthProfile): Promise<void> {
  try {
    localStorage.setItem(LOCAL_BIRTH_KEY + userId, JSON.stringify(data));
  } catch {}

  const { error } = await supabase
    .from('birth_profiles')
    .upsert(
      {
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
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    console.warn('Supabase birth_profiles sync warning (saved locally):', error.message);
  }
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, { upsert: true });

  // 👇 استفاده از کلاس اختصاصی برای خطای آپلود
  if (uploadError) throw new ProfileError('profile_error_upload_image', 'خطا در آپلود تصویر: ' + uploadError.message);

  return filePath;
}

export async function getAvatarSignedUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(filePath, AVATAR_SIGNED_URL_TTL_SECONDS);

  if (error) throw new ProfileError('profile_err_avatar_upload', error.message);
  return data.signedUrl;
}

export async function signOutUser(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}