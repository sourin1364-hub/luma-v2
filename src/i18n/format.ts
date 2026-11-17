// src/i18n/format.ts
import type { AppLanguage } from './useLanguageStore';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * Localized number formatter.
 * - fa: Persian digits (۰۱۲۳۴۵۶۷۸۹)
 * - en/ar/ckb: Latin digits (per project convention)
 */
export function formatNum(input: string | number, lang: AppLanguage): string {
  const s = String(input);
  if (lang === 'fa') {
    return s.replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
  }
  return s;
}