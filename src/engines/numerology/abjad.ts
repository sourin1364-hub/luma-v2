import type { AbjadResult } from './types';
import { ABJAD_TABLE } from './constants';

/**
 * نرمال‌سازی حروف فارسی/عربی:
 * - یکسان‌سازی حروف مشابه (ي→ی، ك→ک، ة→ه، أإآ→ا)
 * - حذف اعراب
 * - حذف هر کاراکتری که حرف معتبر ابجد نیست (فاصله، ویرگول، عدد، انگلیسی، علائم)
 */
export function normalizePersian(input: string): string {
  return input
    .replace(/[\u064B-\u0652]/g, '')   // اعراب
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ی')
    .split('')
    .filter(c => ABJAD_TABLE[c] !== undefined)
    .join('');
}

/**
 * کاهش عدد به یک رقم (به‌جز اعداد master: 11, 22, 33).
 */
export function reduceNumber(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) {
    n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    if (n === 11 || n === 22 || n === 33) return n;
  }
  return n;
}

/**
 * محاسبه ابجد کبیر یک نام.
 */
export function calculateAbjad(input: string): AbjadResult {
  const normalized = normalizePersian(input);
  const breakdown: { letter: string; value: number }[] = [];
  let total = 0;

  for (const char of normalized) {
    const value = ABJAD_TABLE[char] ?? 0;
    if (value > 0) {
      breakdown.push({ letter: char, value });
      total += value;
    }
  }

  return {
    input,
    normalized,
    total,
    reduced: reduceNumber(total),
    breakdown
  };
}