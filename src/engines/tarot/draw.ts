import { ALL_TAROT_CARDS } from './index';
import type { DrawnCard, ReadingResult, Spread } from './types';
import { TAROT_ENGINE_VERSION } from './constants';

/**
 * انتخاب تصادفی امن با crypto.getRandomValues.
 * در محیط‌هایی که crypto موجود نیست (مثل Node قدیمی)، به Math.random برمی‌گردد.
 */
function secureRandom(max: number): number {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/**
 * شافل Fisher-Yates با مولد تصادفی امن.
 */
function secureShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface DrawOptions {
  /** احتمال معکوس بودن هر کارت (0 تا 1). پیش‌فرض 0.3 */
  reversedProbability?: number;
}

/**
 * انتخاب کارت‌ها برای یک چیدمان.
 * هیچ کارتی تکرار نمی‌شود.
 */
export function drawCards(
  spread: Spread,
  options: DrawOptions = {}
): DrawnCard[] {
  const reversedProbability = options.reversedProbability ?? 0.3;
  const shuffled = secureShuffle(ALL_TAROT_CARDS);
  const selected = shuffled.slice(0, spread.cardCount);

  return selected.map((card, index) => ({
    cardId: card.id,
    isReversed: secureRandom(100) < reversedProbability * 100,
    positionIndex: index
  }));
}

/**
 * انجام یک فال کامل و تولید نتیجه قابل ذخیره.
 */
export function performReading(
  spread: Spread,
  question: string,
  options: DrawOptions = {}
): ReadingResult {
  return {
    spreadId: spread.id,
    question,
    drawnCards: drawCards(spread, options),
    createdAt: new Date().toISOString(),
    version: TAROT_ENGINE_VERSION
  };
}