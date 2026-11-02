import type { AbjadResult } from './types';
import { ABJAD_TABLE } from './constants';

/**
 * نرمال‌سازی حروف فارسی/عربی
 */
export function normalizePersian(input: string): string {
  return input
    .replace(/[\u064B-\u0652]/g, '')   // اعراب
    .replace(/ي/g, 'ی')                // ي عربی → ی فارسی
    .replace(/ك/g, 'ک')                // ك عربی → ک فارسی
    .replace(/ة/g, 'ه')                // ة → ه
    .replace(/[أإآ]/g, 'ا')            // أ إ آ → ا
    .replace(/ؤ/g, 'و')                // ؤ → و
    .split('')
    .filter(c => ABJAD_TABLE[c] !== undefined || c === 'ئ' || c === 'ۀ')
    .join('');
}

export function reduceNumber(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) {
    n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    if (n === 11 || n === 22 || n === 33) return n;
  }
  return n;
}

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