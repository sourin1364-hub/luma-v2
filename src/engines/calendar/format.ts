import { MONTH_NAMES_FA } from './types';
import type { JalaaliDate } from './types';

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
}

export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

export function formatJalaaliDate(date: JalaaliDate, opts: { persianDigits?: boolean } = {}): string {
  const persianDigits = opts.persianDigits !== undefined ? opts.persianDigits : true;
  const monthName = MONTH_NAMES_FA[date.month - 1] || '?';
  const raw = date.day + ' ' + monthName + ' ' + date.year;
  return persianDigits ? toPersianDigits(raw) : raw;
}

export function formatTime(hour: number, minute: number, opts: { persianDigits?: boolean } = {}): string {
  const persianDigits = opts.persianDigits !== undefined ? opts.persianDigits : true;
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  const raw = hh + ':' + mm;
  return persianDigits ? toPersianDigits(raw) : raw;
}