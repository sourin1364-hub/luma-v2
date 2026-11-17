import { MONTH_NAMES_FA } from './types';
import type { JalaaliDate } from './types';
import { jalaaliToGregorian } from './jalaali';
import type { AppLanguage } from '../../i18n/useLanguageStore';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function toArabicDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);
}

export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));
}

/** نام ماه‌های شمسی در هر ۴ زبان */
const SHAMSI_MONTHS: Record<AppLanguage, readonly string[]> = {
  fa: MONTH_NAMES_FA,
  en: [
    'Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar',
    'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand',
  ],
  ar: [
    'فَرْوَرْدين', 'أُرْدِيبِهْشْت', 'خُرْداد', 'تير', 'مُرْداد', 'شَهْرِيوَر',
    'مِهْر', 'آبان', 'آذَر', 'دِي', 'بَهْمَن', 'إِسْفَنْد',
  ],
  ckb: [
    'خاکەلێوە', 'گوڵان', 'جۆزەردان', 'پووشپەڕ', 'گەلاوێژ', 'خەرمانان',
    'ڕەزبەر', 'گەڵاڕێزان', 'سەرماوەز', 'بەفرانبار', 'ڕێبەندان', 'ڕەشەمە',
  ],
};

const LOCALE_MAP: Record<AppLanguage, string> = {
  fa: 'fa-IR',
  en: 'en-US',
  ar: 'ar-SA',
  ckb: 'ckb-IQ',
};

export type KurdishCalendar = 'shamsi' | 'miladi';

export interface FormatJalaaliDateOptions {
  lang?: AppLanguage;
  persianDigits?: boolean;
  kurdishCalendar?: KurdishCalendar;
}

export interface FormatTimeOptions {
  lang?: AppLanguage;
  persianDigits?: boolean;
}

function applyLocaleDigits(
  raw: string,
  lang: AppLanguage,
  persianDigitsOverride?: boolean
): string {
  if (persianDigitsOverride === false) return raw;
  if (lang === 'fa') return toPersianDigits(raw);
  if (lang === 'ar' || lang === 'ckb') return toArabicDigits(raw);
  return raw;
}

function formatGregorian(
  greg: { year: number; month: number; day: number },
  locale: string
): string {
  try {
    const d = new Date(greg.year, greg.month - 1, greg.day);
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    const mm = String(greg.month).padStart(2, '0');
    const dd = String(greg.day).padStart(2, '0');
    return `${greg.year}-${mm}-${dd}`;
  }
}

export function formatJalaaliDate(
  date: JalaaliDate,
  opts: FormatJalaaliDateOptions = {}
): string {
  const lang = opts.lang ?? 'fa';

  // en → همیشه میلادی، با Intl (اعداد لاتین، ماه نام انگلیسی)
  if (lang === 'en') {
    const greg = jalaaliToGregorian(date);
    return formatGregorian(greg, LOCALE_MAP.en);
  }

  // ckb → اگر کاربر تقویم میلادی را انتخاب کرده، میلادی بده
  if (lang === 'ckb' && opts.kurdishCalendar === 'miladi') {
    const greg = jalaaliToGregorian(date);
    return formatGregorian(greg, LOCALE_MAP.ckb);
  }

  // fa / ar / ckb(shamsi) → تاریخ شمسی با نام ماه بومی
  const monthName = SHAMSI_MONTHS[lang][date.month - 1] || '?';
  const raw = `${date.day} ${monthName} ${date.year}`;
  return applyLocaleDigits(raw, lang, opts.persianDigits);
}

export function formatTime(
  hour: number,
  minute: number,
  opts: FormatTimeOptions = {}
): string {
  const lang = opts.lang ?? 'fa';
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const raw = `${hh}:${mm}`;
  return applyLocaleDigits(raw, lang, opts.persianDigits);
}