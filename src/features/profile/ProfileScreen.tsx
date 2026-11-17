﻿import { useEffect, useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DatePickerJalaali, type JalaaliDateValue } from '../../components/ui/DatePickerJalaali';
import { TimePicker, type TimeValue } from '../../components/ui/TimePicker';
import { CityPicker } from '../../components/ui/CityPicker';
import { AvatarPicker } from './AvatarPicker';
import { SubscriptionScreen } from '../subscription/SubscriptionScreen';
import { SubscriptionBadge, SubscriptionStatusNotice } from '../subscription/SubscriptionBadge';
import { AdminScreen } from '../admin/AdminScreen';
import { useSubscription } from '../../hooks/useSubscription';
import {
  LogOut,
  Save,
  Loader2,
  Star,
  Shield,
  ChevronLeft,
  X,
  CheckCircle2,
  Send,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import {
  getProfile,
  updateProfile,
  getBirthProfile,
  saveBirthProfile,
  uploadAvatar,
  getAvatarSignedUrl,
  signOutUser,
  ProfileError,
} from './profileService';
import { updatePassword, AuthError } from '../auth/authService';
import type { ProfileData, BirthProfile } from './types';
import type { CityWithProvince } from '../../engines/location';
import { getZodiacFromBirthDate, getBirthstoneFromBirthDate } from '../../engines/zodiac';
import { useLanguageStore, UI_TRANSLATIONS, formatLocalizedDate } from '../../i18n/useLanguageStore';
import { formatNum } from '../../i18n/format';
import { getAssetUrl } from '../../utils/assetPath';
import { createPortal } from 'react-dom';

const ELEMENT_COLORS: Record<string, string> = {
  fire: '#EF4444',
  earth: '#10B981',
  air: '#3B82F6',
  water: '#8B5CF6',
};

type ProfilePopupType =
  | null
  | 'birth-date'
  | 'birth-time'
  | 'identity-info'
  | 'credentials'
  | 'location-map'
  | 'support';

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const subscription = useSubscription();

  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState<JalaaliDateValue>({ year: 1364, month: 4, day: 1 });
  const [birthTime, setBirthTime] = useState<TimeValue>({ hour: 4, minute: 30 });
  const [city, setCity] = useState<CityWithProvince | null>({
    id: 0,
    name: 'تهران',
    en_name: 'Tehran',
    province_id: 1,
    province_name: 'تهران',
    lat: 35.6892,
    lon: 51.3890,
    timezone: 'Asia/Tehran',
  });
  const [motherName, setMotherName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(() => {
    const uid = user?.id || '';
    return (
      localStorage.getItem('luma_user_phone_' + uid) ||
      localStorage.getItem('luma_user_phone') ||
      ''
    );
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [supportSubject, setSupportSubject] = useState('');
  const [supportBody, setSupportBody] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  const [activePopup, setActivePopup] = useState<ProfilePopupType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [zodiacInfo, setZodiacInfo] = useState<any>(null);
  const [birthstoneInfo, setBirthstoneInfo] = useState<any>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const getErrMsg = (err: unknown, fallbackKey: string) => {
    if (err instanceof AuthError || err instanceof ProfileError) {
      return t[err.key] || err.message;
    }
    return err instanceof Error ? err.message : t[fallbackKey];
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [p, b] = await Promise.all([getProfile(user.id), getBirthProfile(user.id)]);
        if (p) {
          setProfile(p);
          setDisplayName(p.displayName || user.displayName || user.username);
          setUsername(p.username || user.username);
          if ((p as any).phone) {
            setPhoneNumber((p as any).phone);
          }
        } else {
          setDisplayName(user.displayName || user.username);
          setUsername(user.username);
        }
        if (b) {
          const bd = { year: b.year, month: b.month, day: b.day };
          setBirthDate(bd);
          const [h, m] = (b.birthTime || '04:30').split(':').map(Number);
          setBirthTime({ hour: isNaN(h) ? 4 : h, minute: isNaN(m) ? 30 : m });
          setMotherName(b.motherName || '');
          if (b.birthCity) {
            setCity({
              id: 0,
              name: b.birthCity,
              en_name: b.birthCityEn || 'Tehran',
              province_id: 0,
              province_name: b.birthProvince || 'تهران',
              lat: b.latitude || 35.6892,
              lon: b.longitude || 51.3890,
              timezone: b.timezone || 'Asia/Tehran',
            });
          }
          try {
            setZodiacInfo(getZodiacFromBirthDate(bd));
            setBirthstoneInfo(getBirthstoneFromBirthDate(bd));
          } catch {}
        } else {
          const defaultBd = { year: 1364, month: 4, day: 1 };
          setZodiacInfo(getZodiacFromBirthDate(defaultBd));
          setBirthstoneInfo(getBirthstoneFromBirthDate(defaultBd));
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
    setMessage(null);
    try {
      const path = await uploadAvatar(user.id, file);
      const url = await getAvatarSignedUrl(path);
      await updateProfile(user.id, {
        avatarPath: path,
        displayName,
        username: username || user.username,
      });
      setProfile((prev) =>
        prev
          ? { ...prev, avatarUrl: url, avatarPath: path }
          : { displayName, username: user.username, avatarUrl: url, avatarPath: path }
      );
      setMessage({ type: 'success', text: t['profile_msg_avatar_success'] });
    } catch (err) {
      setMessage({ type: 'error', text: getErrMsg(err, 'profile_err_avatar_upload') });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handlePresetAvatarSelect = async (presetValue: string) => {
    if (!user) return;
    setIsUploadingAvatar(true);
    setMessage(null);
    try {
      await updateProfile(user.id, {
        avatarUrl: presetValue,
        avatarPath: null,
        displayName,
        username: username || user.username,
      });
      setProfile((prev) =>
        prev
          ? { ...prev, avatarUrl: presetValue, avatarPath: null }
          : { displayName, username: user.username, avatarUrl: presetValue, avatarPath: null }
      );
      setMessage({ type: 'success', text: t['profile_msg_avatar_preset_success'] });
    } catch (err) {
      setMessage({ type: 'error', text: getErrMsg(err, 'profile_err_avatar_save') });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveAll = async (closeModal = true) => {
    if (!user) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const cleanPhone = phoneNumber.trim();

      await updateProfile(user.id, {
        displayName: displayName.trim() || user.username,
        username: username.trim() || user.username,
        avatarUrl: profile?.avatarUrl || null,
        avatarPath: profile?.avatarPath || null,
        phone: cleanPhone || null,
      } as any);

      if (cleanPhone) {
        localStorage.setItem('luma_user_phone_' + user.id, cleanPhone);
        localStorage.setItem('luma_user_phone', cleanPhone);
      }

      const birthData: BirthProfile = {
        year: birthDate.year,
        month: birthDate.month,
        day: birthDate.day,
        birthTime: `${String(birthTime.hour).padStart(2, '0')}:${String(birthTime.minute).padStart(2, '0')}`,
        birthCity: city?.name || 'تهران',
        birthCityEn: city?.en_name || 'Tehran',
        birthProvince: city?.province_name || 'تهران',
        latitude: city?.lat ?? 35.6892,
        longitude: city?.lon ?? 51.3890,
        timezone: city?.timezone || 'Asia/Tehran',
        motherName: motherName.trim(),
      };
      await saveBirthProfile(user.id, birthData);

      try {
        setZodiacInfo(getZodiacFromBirthDate(birthDate));
        setBirthstoneInfo(getBirthstoneFromBirthDate(birthDate));
      } catch {}

      if (newPassword.trim()) {
        if (newPassword.length < 6) {
          throw new Error(t['profile_err_pw_min']);
        }
        if (newPassword !== confirmPassword) {
          throw new Error(t['profile_err_pw_mismatch']);
        }
        await updatePassword(newPassword);
        setNewPassword('');
        setConfirmPassword('');
      }

      setMessage({ type: 'success', text: t['profile_msg_save_success'] });
      if (closeModal) {
        setActivePopup(null);
      }
    } catch (err) {
      setMessage({ type: 'error', text: getErrMsg(err, 'profile_err_save') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      logout();
    } catch {
      setMessage({ type: 'error', text: t['profile_msg_logout_error'] });
    }
  };

  const formattedBirthDateText = useMemo(() => {
    return formatLocalizedDate(birthDate, lang, true);
  }, [birthDate, lang]);

  const formattedBirthTimeText = useMemo(() => {
    const hh = formatNum(String(birthTime.hour).padStart(2, '0'), lang);
    const mm = formatNum(String(birthTime.minute).padStart(2, '0'), lang);
    return `${hh}:${mm} ${t['profile_time_minutes']}`;
  }, [birthTime, lang, t]);

  if (showAdmin && subscription.isAdmin) {
    return <AdminScreen onBack={() => setShowAdmin(false)} />;
  }

  if (showSubscription) {
    return <SubscriptionScreen onBack={() => setShowSubscription(false)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[var(--luma-gold)] animate-spin" />
      </div>
    );
  }

  const zodiacIconPath = zodiacInfo?.signEn
    ? getAssetUrl(`icons/zodiac/${zodiacInfo.signEn.charAt(0).toUpperCase() + zodiacInfo.signEn.slice(1)}.svg`)
    : '';

  const birthstoneIconPath = birthstoneInfo?.nameEn
    ? getAssetUrl(`icons/birthstones/${birthstoneInfo.nameEn.toLowerCase()}.png`)
    : '';

  const MENU_BUTTONS = [
    {
      id: 'birth-date' as const,
      title: t['profile_btn_birth_date'],
      subtitle: formattedBirthDateText,
      iconPng: getAssetUrl('icons/ui/calendar.png'),
    },
    {
      id: 'birth-time' as const,
      title: t['profile_btn_birth_time'],
      subtitle: formattedBirthTimeText,
      iconPng: getAssetUrl('icons/ui/clock.png'),
    },
    {
      id: 'identity-info' as const,
      title: t['profile_btn_identity'],
      subtitle: `${displayName || t['profile_no_name']} | ${t['profile_sub_mother']} ${motherName || t['profile_sub_not_registered']} | ${t['profile_sub_birth_city']} ${lang === 'fa' ? city?.name || t['city_map_default_city'] : city?.en_name || t['city_map_default_city']}`,
      iconPng: getAssetUrl('icons/ui/identity.png'),
    },
    {
      id: 'location-map' as const,
      title: t['profile_btn_location'],
      subtitle: `${lang === 'fa'
        ? `${city?.name || t['city_map_default_city']} (${city?.province_name || t['city_map_default_city']})`
        : `${city?.en_name || t['city_map_default_city']}${city?.province_en_name ? ` (${city.province_en_name})` : ''}`} — ${t['profile_sub_coords']}`,
      iconPng: getAssetUrl('icons/ui/map-pin.png'),
    },
    {
      id: 'credentials' as const,
      title: t['profile_btn_credentials'],
      subtitle: `${t['profile_sub_username']} @${username || user?.username || 'user'} | ${t['profile_sub_mobile']} ${phoneNumber || t['profile_sub_not_registered']}`,
      iconPng: getAssetUrl('icons/ui/security.png'),
    },
    {
      id: 'subscription-menu' as const,
      title: t['profile_btn_subscription'],
      subtitle: subscription.isAdmin
        ? t['profile_sub_admin']
        : subscription.isActive
        ? `${t['profile_sub_active']} ${subscription.plan === 'pro' ? t['sub_badge_pro'] : t['sub_badge_premium']} (${formatNum(subscription.daysRemaining, lang)} ${t['profile_sub_days_left']})`
        : t['profile_sub_free'],
      iconPng: getAssetUrl('icons/ui/crown.png'),
    },
    {
      id: 'support' as const,
      title: t['profile_btn_support'],
      subtitle: t['profile_btn_support_sub'],
      iconPng: getAssetUrl('icons/ui/support.png'),
    },
  ];

  return (
    <div className="space-y-5 pb-24">
      <SubscriptionStatusNotice error={subscription.error} />
      <PageHeader title={t['profile_title']} subtitle={t['profile_subtitle']} />

      <Card variant="elevated" padding="lg" className="text-center">
        <AvatarPicker
          currentUrl={profile?.avatarUrl || null}
          onSelectFile={handleAvatarUpload}
          onSelectPreset={handlePresetAvatarSelect}
          isLoading={isUploadingAvatar}
        />
        <div className="flex items-center justify-center gap-2 mt-3">
          <h2 className="font-heading text-lg text-[var(--luma-text)] font-bold">{displayName}</h2>
          <SubscriptionBadge
            plan={subscription.plan}
            isAdmin={subscription.isAdmin}
            expiresAt={subscription.expiresAt}
            variant="compact"
          />
        </div>
        <p className="text-xs text-[var(--luma-text-muted)] mt-1" dir="ltr">
          {user?.email}
        </p>
      </Card>

      {message && (
        <div
          className={
            'p-3 rounded-xl text-xs flex items-center justify-center gap-2 ' +
            (message.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
              : 'bg-red-500/15 border border-red-500/40 text-red-400')
          }
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {zodiacInfo && birthstoneInfo && (
        <Card variant="gold-border" padding="md">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-[var(--luma-gold)]" />
            <h3 className="font-heading text-sm text-[var(--luma-text)]">{t['profile_zodiac_title']}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-xl bg-[var(--luma-bg-subtle)]">
              <img
                src={zodiacIconPath}
                alt={zodiacInfo.signEn}
                className="w-11 h-11 mx-auto mb-1.5 zodiac-icon object-contain"
              />
              <p className="text-[10px] text-[var(--luma-text-muted)]">{t['profile_sun_sign']}</p>
              <p className="font-heading text-sm text-[var(--luma-text)] font-bold">
                {t[`chart_zodiac_${zodiacInfo.signEn.toLowerCase()}` as any] || zodiacInfo.signFa}
              </p>
              <p
                className="text-[10px] mt-1 font-medium"
                style={{ color: ELEMENT_COLORS[zodiacInfo.element] || 'var(--luma-gold)' }}
              >
                {t['profile_element']} {t[`chart_el_${zodiacInfo.element}` as any] || zodiacInfo.elementFa}
              </p>
            </div>
            <div className="text-center p-3 rounded-xl bg-[var(--luma-bg-subtle)]">
              <img
                src={birthstoneIconPath}
                alt={birthstoneInfo.nameEn}
                className="w-11 h-11 mx-auto mb-1.5 rounded-full object-cover border-2 border-[var(--luma-gold)]/40"
              />
              <p className="text-[10px] text-[var(--luma-text-muted)]">{t['profile_birthstone']}</p>
              <p className="font-heading text-sm text-[var(--luma-text)] font-bold">
                {t[`bs_${birthstoneInfo.month}_name` as any] || birthstoneInfo.nameFa}
              </p>
              <p className="text-[9px] text-[var(--luma-text-subtle)] mt-1">
                {lang === 'fa' ? birthstoneInfo.shamsiRange : birthstoneInfo.nameEn}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-2.5">
        {MENU_BUTTONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setMessage(null);
              if (item.id === 'subscription-menu') {
                setShowSubscription(true);
              } else {
                setActivePopup(item.id);
              }
            }}
            className="w-full p-3.5 rounded-2xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] hover:border-[var(--luma-gold)] transition-all flex items-center justify-between gap-3 text-right group shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src={item.iconPng}
                alt={item.title}
                className="w-10 h-10 rounded-xl object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-heading text-xs sm:text-sm text-[var(--luma-text)] font-bold truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[var(--luma-gold)] font-medium mt-0.5 truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>

            <ChevronLeft className="w-4 h-4 text-[var(--luma-text-muted)] group-hover:text-[var(--luma-gold)] flex-shrink-0" />
          </button>
        ))}
      </div>

      <div className="space-y-2.5 pt-2">
        {subscription.isAdmin && (
          <Button variant="secondary" fullWidth onClick={() => setShowAdmin(true)}>
            <Shield className="w-4 h-4 text-[var(--luma-gold)]" />
            {t['profile_btn_admin']}
          </Button>
        )}

        <Button variant="danger" fullWidth onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          {t['profile_btn_logout']}
        </Button>
      </div>

      {activePopup && (
        createPortal(<div
          className="modal-backdrop bg-black/75 backdrop-blur-sm"
        >
          <div
            className="modal-panel w-full max-w-md bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/40 rounded-2xl p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--luma-border)] pb-3">
              <div className="flex items-center gap-2">
                <img
                  src={
                    MENU_BUTTONS.find((b) => b.id === activePopup)?.iconPng ||
                    getAssetUrl('icons/ui/identity.png')
                  }
                  alt={t['profile_menu_icon_alt']}
                  className="w-7 h-7 object-contain"
                />
                <h3 className="font-heading text-sm text-[var(--luma-gold)] font-bold">
                  {MENU_BUTTONS.find((b) => b.id === activePopup)?.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePopup(null)}
                className="p-1.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)] hover:text-[var(--luma-text)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activePopup === 'birth-date' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-center">
                  <p className="text-[10px] text-[var(--luma-text-muted)]">{t['profile_date_selected']}</p>
                  <p className="text-sm font-bold text-[var(--luma-gold)] mt-1">
                    {formattedBirthDateText}
                  </p>
                </div>
                <DatePickerJalaali value={birthDate} onChange={setBirthDate} />
                <Button variant="gold" fullWidth onClick={() => handleSaveAll(true)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t['profile_popup_save_birth_date']}
                </Button>
              </div>
            )}

            {activePopup === 'birth-time' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-center">
                  <p className="text-[10px] text-[var(--luma-text-muted)]">{t['profile_time_selected']}</p>
                  <p className="text-sm font-bold text-[var(--luma-gold)] mt-1">
                    {formattedBirthTimeText}
                  </p>
                </div>
                <TimePicker value={birthTime} onChange={setBirthTime} />
                <Button variant="gold" fullWidth onClick={() => handleSaveAll(true)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t['profile_popup_save_birth_time']}
                </Button>
              </div>
            )}

            {activePopup === 'identity-info' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[var(--luma-text-muted)] mb-1">
                    {t['profile_label_fullname']}
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t['profile_label_fullname_ph']}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-sm focus:outline-none focus:border-[var(--luma-gold)]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--luma-text-muted)] mb-1">
                    {t['profile_label_mother']}
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder={t['profile_label_mother_ph']}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-sm focus:outline-none focus:border-[var(--luma-gold)]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--luma-text-muted)] mb-1.5">
                    {t['profile_label_city']}
                  </label>
                  <CityPicker value={city} onChange={setCity} />
                </div>

                <Button variant="gold" fullWidth onClick={() => handleSaveAll(true)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t['profile_popup_save_identity']}
                </Button>
              </div>
            )}

            {activePopup === 'location-map' && (
              <div className="space-y-4">
                <CityPicker value={city} onChange={setCity} />
                <Button variant="gold" fullWidth onClick={() => handleSaveAll(true)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t['profile_popup_save_location']}
                </Button>
              </div>
            )}

            {activePopup === 'credentials' && (
              <div className="space-y-3.5">
                {message && (
                  <div
                    className={
                      'p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 ' +
                      (message.type === 'success'
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                        : 'bg-red-500/15 border border-red-500/40 text-red-400')
                    }
                  >
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{message.text}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs text-[var(--luma-text-muted)] mb-1">
                    {t['profile_label_username']}
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    dir="ltr"
                    placeholder={t['profile_placeholder_username']}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-left text-sm focus:outline-none focus:border-[var(--luma-gold)]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--luma-text-muted)] mb-1">
                    {t['profile_label_email']}
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--luma-bg-subtle)]/50 border border-[var(--luma-border)] text-[var(--luma-text-muted)] text-left text-sm cursor-not-allowed opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[var(--luma-text-muted)] mb-1">
                    {t['profile_label_phone']}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber.includes('@') ? '' : phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    dir="ltr"
                    placeholder={t['profile_label_phone_ph']}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-left text-sm focus:outline-none focus:border-[var(--luma-gold)]"
                  />
                </div>

                <div className="pt-2 border-t border-[var(--luma-border)]">
                  <label className="block text-xs text-[var(--luma-text-muted)] mb-1">
                    {t['profile_label_new_password']}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t['profile_label_new_password_ph']}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-sm mb-2 focus:outline-none focus:border-[var(--luma-gold)]"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t['profile_label_confirm_password_ph']}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-sm focus:outline-none focus:border-[var(--luma-gold)]"
                  />
                </div>

                <Button variant="gold" fullWidth onClick={() => handleSaveAll(false)} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {t['profile_popup_save_credentials']}
                </Button>
              </div>
            )}

            {activePopup === 'support' && (
              <div className="space-y-4 text-xs">
                <p className="text-[var(--luma-text-muted)] leading-relaxed text-justify">
                  {t['profile_support_desc']}
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  <a
                      href="https://t.me/Sourin64"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] hover:border-sky-400 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={getAssetUrl('icons/ui/telegram.png')} alt="Telegram" className="w-9 h-9" />
                      <div>
                        <p className="font-bold text-[var(--luma-text)]">{t['profile_support_telegram']}</p>
                        <p className="text-[10px] text-[var(--luma-text-muted)]" dir="ltr">@Sourin64</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-sky-400" />
                  </a>

                  <a
                    href="https://instagram.com/lumera.tv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] hover:border-rose-400 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={getAssetUrl('icons/ui/instagram.png')} alt="Instagram" className="w-9 h-9" />
                      <div>
                        <p className="font-bold text-[var(--luma-text)]">{t['profile_support_instagram']}</p>
                        <p className="text-[10px] text-[var(--luma-text-muted)]" dir="ltr">lumera.tv</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-rose-400" />
                  </a>

                  <a
                    href="mailto:support@lumeraworld.ir?subject=LUMA Support"
                    className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] hover:border-[var(--luma-gold)] flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={getAssetUrl('icons/ui/email.png')} alt="Email" className="w-9 h-9" />
                      <div>
                        <p className="font-bold text-[var(--luma-text)]">{t['profile_support_email']}</p>
                        <p className="text-[10px] text-[var(--luma-text-muted)]" dir="ltr">
                          support@lumeraworld.ir
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[var(--luma-gold)]" />
                  </a>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)] space-y-2.5">
                  <p className="font-bold text-[var(--luma-gold)]">{t['profile_support_form_title']}</p>
                  <input
                    type="text"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    placeholder={t['profile_support_form_subject_ph']}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)]"
                  />
                  <textarea
                    rows={3}
                    value={supportBody}
                    onChange={(e) => setSupportBody(e.target.value)}
                    placeholder={t['profile_support_form_body_ph']}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)]"
                  />
                  {supportSent && (
                    <p className="text-emerald-400 text-[11px] text-center">
                      {t['profile_support_success']}
                    </p>
                  )}
                  <Button
                    variant="gold"
                    fullWidth
                    onClick={() => {
                      if (!supportBody.trim()) return;
                      setSupportSent(true);
                      window.location.href = `mailto:support@lumeraworld.ir?subject=${encodeURIComponent(
                        supportSubject || 'LUMA Support'
                      )}&body=${encodeURIComponent(
                        `User: ${user?.email || ''}\nName: ${displayName}\n\nMessage:\n${supportBody}`
                      )}`;
                    }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {t['profile_support_btn_send']}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>, document.body)
      )}
    </div>
  );
}