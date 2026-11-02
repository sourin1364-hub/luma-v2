import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DatePickerJalaali, type JalaaliDateValue } from '../../components/ui/DatePickerJalaali';
import { TimePicker, type TimeValue } from '../../components/ui/TimePicker';
import { CityPicker } from '../../components/ui/CityPicker';
import { AvatarPicker } from './AvatarPicker';
import { LogOut, Save, Loader2, User, Mail, Calendar, Clock, MapPin, Heart } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import {
  getProfile,
  updateProfile,
  getBirthProfile,
  saveBirthProfile,
  uploadAvatar,
  signOutUser
} from './profileService';
import type { ProfileData, BirthProfile } from './types';
import type { CityWithProvince } from '../../engines/location';

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [birthDate, setBirthDate] = useState<JalaaliDateValue>({ year: 1364, month: 4, day: 1 });
  const [birthTime, setBirthTime] = useState<TimeValue>({ hour: 14, minute: 30 });
  const [city, setCity] = useState<CityWithProvince | null>(null);
  const [motherName, setMotherName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [p, b] = await Promise.all([
          getProfile(user.id),
          getBirthProfile(user.id),
        ]);
        if (p) {
          setProfile(p);
          setDisplayName(p.displayName || user.username);
        } else {
          setDisplayName(user.username);
        }
        if (b) {
          setBirthDate({ year: b.year, month: b.month, day: b.day });
          const [h, m] = (b.birthTime || '14:30').split(':').map(Number);
          setBirthTime({ hour: h || 14, minute: m || 30 });
          setMotherName(b.motherName || '');
          if (b.birthCity) {
            setCity({
              id: 0,
              name: b.birthCity,
              en_name: b.birthCityEn,
              province_id: 0,
              province_name: b.birthProvince,
              lat: b.latitude,
              lon: b.longitude,
              timezone: b.timezone,
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    setIsUploadingAvatar(true);
    try {
      const url = await uploadAvatar(user.id, file);
      await updateProfile(user.id, { avatarUrl: url, displayName, username: profile?.username });
      setProfile((prev) => prev ? { ...prev, avatarUrl: url } : { displayName, username: '', avatarUrl: url });
      setMessage({ type: 'success', text: 'آواتار با موفقیت به‌روزرسانی شد' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'خطا در آپلود' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    setMessage(null);
    try {
      // ذخیره پروفایل
      await updateProfile(user.id, {
        displayName,
        username: profile?.username || user.username,
        avatarUrl: profile?.avatarUrl || null,
      });

      // ذخیره اطلاعات تولد
      if (city) {
        const birthData: BirthProfile = {
          year: birthDate.year,
          month: birthDate.month,
          day: birthDate.day,
          birthTime: `${String(birthTime.hour).padStart(2, '0')}:${String(birthTime.minute).padStart(2, '0')}`,
          birthCity: city.name,
          birthCityEn: city.en_name,
          birthProvince: city.province_name,
          latitude: city.lat,
          longitude: city.lon,
          timezone: city.timezone || 'Asia/Tehran',
          motherName,
        };
        await saveBirthProfile(user.id, birthData);
      }

      setMessage({ type: 'success', text: 'اطلاعات با موفقیت ذخیره شد' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'خطا در ذخیره' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      logout();
    } catch (err) {
      setMessage({ type: 'error', text: 'خطا در خروج' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[var(--luma-gold)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="پروفایل من" subtitle="اطلاعات شخصی و تولد" />

      {/* آواتار و اطلاعات */}
      <Card variant="elevated" padding="lg" className="text-center">
        <AvatarPicker
          currentUrl={profile?.avatarUrl || null}
          onSelect={handleAvatarUpload}
          isLoading={isUploadingAvatar}
        />
        <h2 className="font-heading text-lg text-[var(--luma-text)] mt-4">{displayName}</h2>
        <p className="text-xs text-[var(--luma-text-muted)] mt-1" dir="ltr">{user?.email}</p>
      </Card>

      {/* اطلاعات شخصی */}
      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">اطلاعات شخصی</h3>
        </div>
        <label className="block text-xs text-[var(--luma-text-muted)] mb-1">نام نمایشی</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors text-sm"
        />
      </Card>

      {/* اطلاعات تولد */}
      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">اطلاعات تولد</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--luma-text-muted)] mb-2">تاریخ تولد</label>
            <DatePickerJalaali value={birthDate} onChange={setBirthDate} />
          </div>

          <div>
            <label className="block text-xs text-[var(--luma-text-muted)] mb-2">ساعت تولد</label>
            <TimePicker value={birthTime} onChange={setBirthTime} />
          </div>

          <div>
            <label className="block text-xs text-[var(--luma-text-muted)] mb-2">شهر تولد</label>
            <CityPicker value={city} onChange={setCity} />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs text-[var(--luma-text-muted)] mb-1">
              <Heart className="w-3 h-3" />
              نام مادر (اختیاری)
            </label>
            <input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="نام مادر"
              className="w-full px-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors text-sm"
            />
          </div>
        </div>
      </Card>

      {/* پیام */}
      {message && (
        <div
          className={
            'p-3 rounded-lg text-xs text-center ' +
            (message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400')
          }
        >
          {message.text}
        </div>
      )}

      {/* دکمه‌ها */}
      <div className="space-y-3">
        <Button variant="gold" fullWidth size="lg" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              در حال ذخیره...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              ذخیره تغییرات
            </>
          )}
        </Button>

        <Button variant="danger" fullWidth onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          خروج از حساب
        </Button>
      </div>
    </div>
  );
}