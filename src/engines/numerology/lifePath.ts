import type { LifePathResult } from './types';
import { reduceNumber } from './abjad';

/**
 * محاسبه شماره مسیر زندگی از تاریخ تولد (میلادی).
 * روش: جمع تک‌رقمی‌کردن سال، ماه و روز به‌صورت جداگانه، سپس جمع و کاهش نهایی.
 */
export function calculateLifePath(
  year: number,
  month: number,
  day: number
): LifePathResult {
  const yearReduced = reduceNumber(year);
  const monthReduced = reduceNumber(month);
  const dayReduced = reduceNumber(day);

  const total = yearReduced + monthReduced + dayReduced;
  const reduced = reduceNumber(total);
  const isMasterNumber = reduced === 11 || reduced === 22 || reduced === 33;

  return {
    birthDate: { year, month, day },
    total,
    reduced,
    isMasterNumber
  };
}