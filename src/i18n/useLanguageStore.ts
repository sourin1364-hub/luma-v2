import { create } from 'zustand';
import { jalaaliToGregorian, gregorianToJalaali } from '../engines/calendar/jalaali';
import { toPersianDigits } from '../engines/calendar/format';
import { FA_MONTHS, FA_WEEKDAYS, FA_UI } from './locales/fa';
import { CKB_MONTHS, CKB_GREGORIAN_MONTHS, CKB_WEEKDAYS, CKB_UI, FA_TO_CKB_DICT } from './locales/ckb';
import { AR_MONTHS, AR_WEEKDAYS, AR_UI, FA_TO_AR_DICT } from './locales/ar';
import { EN_MONTHS, EN_WEEKDAYS, EN_UI, FA_TO_EN_DICT } from './locales/en';

export type AppLanguage = 'fa' | 'ckb' | 'ar' | 'en';
export type TranslationKey = keyof typeof FA_UI;

interface LanguageState {
  lang: AppLanguage;
  dir: 'rtl' | 'ltr';
  calendarSystem: 'jalaali' | 'hijri' | 'gregorian';
  kurdishCalendar: 'shamsi' | 'miladi';
  setLang: (lang: AppLanguage) => void;
  setKurdishCalendar: (cal: 'shamsi' | 'miladi') => void;
}

const LANG_STORAGE_KEY = 'luma_app_language';
function readStoredValue(key: string): string | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

const savedLang = readStoredValue(LANG_STORAGE_KEY) as AppLanguage | null;
const initialLang: AppLanguage = savedLang && ['fa', 'ckb', 'ar', 'en'].includes(savedLang) ? savedLang : 'fa';

if (typeof document !== 'undefined') {
  document.documentElement.dir = initialLang === 'en' ? 'ltr' : 'rtl';
  document.documentElement.lang = initialLang;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: initialLang,
  dir: initialLang === 'en' ? 'ltr' : 'rtl',
  calendarSystem: initialLang === 'en' || initialLang === 'ckb' ? 'gregorian' : initialLang === 'ar' ? 'hijri' : 'jalaali',
  kurdishCalendar: (readStoredValue('luma_kurdish_cal') as 'shamsi' | 'miladi' | null) || 'shamsi',
  setLang: (lang: AppLanguage) => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
    const dir = lang === 'en' ? 'ltr' : 'rtl';
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
    }
    set({
      lang,
      dir,
      calendarSystem: lang === 'en' || lang === 'ckb' ? 'gregorian' : lang === 'ar' ? 'hijri' : 'jalaali',
    });
  },
  setKurdishCalendar: (cal) => {
    try {
      localStorage.setItem('luma_kurdish_cal', cal);
    } catch {}
    set({ kurdishCalendar: cal });
  },
}));

export const MONTHS_BY_LANG: Record<AppLanguage, string[]> = {
  fa: FA_MONTHS, ckb: CKB_MONTHS, ar: AR_MONTHS, en: EN_MONTHS,
};
export const JALAALI_MONTHS_BY_LANG = MONTHS_BY_LANG;
export const WEEKDAYS_BY_LANG: Record<AppLanguage, string[]> = {
  fa: FA_WEEKDAYS, ckb: CKB_WEEKDAYS, ar: AR_WEEKDAYS, en: EN_WEEKDAYS,
};

export function gregorianToHijri(gy: number, gm: number, gd: number): { year: number; month: number; day: number } {
  let jd =
    Math.floor((1461 * (gy + 4800 + Math.floor((gm - 14) / 12))) / 4) +
    Math.floor((367 * (gm - 2 - 12 * Math.floor((gm - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((gy + 4900 + Math.floor((gm - 14) / 12)) / 100)) / 4) +
    gd -
    32075;
  let l = jd - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  let j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  let hm = Math.floor((24 * l) / 709);
  let hd = l - Math.floor((709 * hm) / 24);
  let hy = 30 * n + j - 30;
  return { year: hy, month: Math.min(12, Math.max(1, hm)), day: Math.min(30, Math.max(1, hd)) };
}

export function hijriToGregorian(hy: number, hm: number, hd: number): { year: number; month: number; day: number } {
  const jd =
    Math.floor((11 * hy + 3) / 30) +
    354 * hy +
    30 * hm -
    Math.floor((hm - 1) / 2) +
    hd +
    1948440 -
    385;
  let l = jd + 68569;
  let n = Math.floor((4 * l) / 146097);
  l = l - Math.floor((146097 * n + 3) / 4);
  let i = Math.floor((4000 * (l + 1)) / 1461001);
  l = l - Math.floor((1461 * i) / 4) + 31;
  let j = Math.floor((80 * l) / 2447);
  let gd = l - Math.floor((2447 * j) / 80);
  l = Math.floor(j / 11);
  let gm = j + 2 - 12 * l;
  let gy = 100 * (n - 49) + i + l;
  return { year: gy, month: gm, day: gd };
}

export function jalaaliFromHijri(hy: number, hm: number, hd: number) {
  const g = hijriToGregorian(hy, hm, hd);
  return gregorianToJalaali(g);
}

export function formatLocalizedDate(
  jDate: { year: number; month: number; day: number },
  lang: AppLanguage,
  includeWeekday = true
): string {
  try {
    const g = jalaaliToGregorian({ year: jDate.year, month: jDate.month, day: jDate.day });
    const jsDate = new Date(g.year, g.month - 1, g.day);
    const weekday = WEEKDAYS_BY_LANG[lang][jsDate.getDay()] || '';

    if (lang === 'en') {
      const mName = MONTHS_BY_LANG.en[g.month - 1] || '';
      return includeWeekday ? `${weekday}, ${mName} ${g.day}, ${g.year}` : `${mName} ${g.day}, ${g.year}`;
    }

    if (lang === 'ckb') {
      const isMiladi = useLanguageStore.getState().kurdishCalendar === 'miladi';
      
      if (isMiladi) {
        // استفاده از ماه‌های میلادی برای کوردی
        const mName = CKB_GREGORIAN_MONTHS[g.month - 1] || '';
        const dStr = toPersianDigits(g.day);
        const yStr = toPersianDigits(g.year);
        return includeWeekday ? `${weekday} ، ${dStr} ${mName} ${yStr}` : `${dStr} ${mName} ${yStr}`;
      } else {
        // استفاده از ماه‌های شمسی برای کوردی
        const mName = MONTHS_BY_LANG.ckb[(jDate.month || 1) - 1] || '';
        const dStr = toPersianDigits(jDate.day);
        const yStr = toPersianDigits(jDate.year);
        return includeWeekday ? `${weekday} ، ${dStr} ${mName} ${yStr}` : `${dStr} ${mName} ${yStr}`;
      }
    }

    // این بخش برای زبان عربی است (آکولاد اضافه در اینجا باعث خطا شده بود)
    if (lang === 'ar') {
      const h = gregorianToHijri(g.year, g.month, g.day);
      const mName = MONTHS_BY_LANG.ar[h.month - 1] || '';
      const dStr = toPersianDigits(h.day);
      const yStr = toPersianDigits(h.year);
      return includeWeekday ? `${weekday} ، ${dStr} ${mName} ${yStr} هـ` : `${dStr} ${mName} ${yStr} هـ`;
    }

    const monthName = MONTHS_BY_LANG[lang][(jDate.month || 1) - 1] || '';
    const dStr = toPersianDigits(jDate.day);
    const yStr = toPersianDigits(jDate.year);
    return includeWeekday ? `${weekday} ، ${dStr} ${monthName} ${yStr}` : `${dStr} ${monthName} ${yStr}`;
  } catch {
    return `${jDate.year}/${jDate.month}/${jDate.day}`;
  }
}

export function formatLiveTodayDate(now: Date, lang: AppLanguage): string {
  const j = gregorianToJalaali({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
  return formatLocalizedDate(j, lang, true);
}

export const UI_TRANSLATIONS: Record<AppLanguage, Record<TranslationKey, string>> = {
  fa: FA_UI,
  ckb: CKB_UI as Record<TranslationKey, string>,
  ar: AR_UI as Record<TranslationKey, string>,
  en: EN_UI as Record<TranslationKey, string>,
};

export function translateNodeText(text: string, lang: AppLanguage): string {
  if (lang === 'fa' || !text) return text;
  const dict = lang === 'en' ? FA_TO_EN_DICT : lang === 'ar' ? FA_TO_AR_DICT : FA_TO_CKB_DICT;
  const exactTranslation = dict.find(([source]) => source === text);
  if (exactTranslation) return exactTranslation[1];

  let result = text;
  for (const [fa, target] of dict) {
    if (result.includes(fa)) {
      result = result.split(fa).join(target);
    }
  }
  return result;
}