export * from './types';
export * from './constants';
export * from './abjad';
export * from './lifePath';

import { NUMBER_MEANINGS } from './constants';
import type { NumberMeaning } from './types';

export function getNumberMeaning(n: number): NumberMeaning | undefined {
  return NUMBER_MEANINGS.find(m => m.number === n);
}