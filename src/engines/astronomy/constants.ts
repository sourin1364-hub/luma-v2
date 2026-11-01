import type { ZodiacSign, PlanetName } from './types';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'aries',       nameFa: 'حمل',    index: 1,  startDegree: 0,   element: 'fire',  modality: 'cardinal', ruler: 'mars' },
  { name: 'taurus',      nameFa: 'ثور',    index: 2,  startDegree: 30,  element: 'earth', modality: 'fixed',    ruler: 'venus' },
  { name: 'gemini',      nameFa: 'جوزا',   index: 3,  startDegree: 60,  element: 'air',   modality: 'mutable',  ruler: 'mercury' },
  { name: 'cancer',      nameFa: 'سرطان',  index: 4,  startDegree: 90,  element: 'water', modality: 'cardinal', ruler: 'moon' },
  { name: 'leo',         nameFa: 'اسد',    index: 5,  startDegree: 120, element: 'fire',  modality: 'fixed',    ruler: 'sun' },
  { name: 'virgo',       nameFa: 'سنبله',  index: 6,  startDegree: 150, element: 'earth', modality: 'mutable',  ruler: 'mercury' },
  { name: 'libra',       nameFa: 'میزان',  index: 7,  startDegree: 180, element: 'air',   modality: 'cardinal', ruler: 'venus' },
  { name: 'scorpio',     nameFa: 'عقرب',   index: 8,  startDegree: 210, element: 'water', modality: 'fixed',    ruler: 'pluto' },
  { name: 'sagittarius', nameFa: 'قوس',    index: 9,  startDegree: 240, element: 'fire',  modality: 'mutable',  ruler: 'jupiter' },
  { name: 'capricorn',   nameFa: 'جدی',    index: 10, startDegree: 270, element: 'earth', modality: 'cardinal', ruler: 'saturn' },
  { name: 'aquarius',    nameFa: 'دلو',    index: 11, startDegree: 300, element: 'air',   modality: 'fixed',    ruler: 'uranus' },
  { name: 'pisces',      nameFa: 'حوت',    index: 12, startDegree: 330, element: 'water', modality: 'mutable',  ruler: 'jupiter' }
];

export const PLANET_NAMES_FA: Record<PlanetName, string> = {
  sun: 'خورشید',
  moon: 'ماه',
  mercury: 'عطارد',
  venus: 'زهره',
  mars: 'مریخ',
  jupiter: 'مشتری',
  saturn: 'زحل',
  uranus: 'اورانوس',
  neptune: 'نپتون',
  pluto: 'پلوتو'
};

export function getSign(longitude: number): ZodiacSign {
  const normalized = ((longitude % 360) + 360) % 360;
  const index = Math.floor(normalized / 30);
  return ZODIAC_SIGNS[index];
}

export function getSignDegree(longitude: number): number {
  const normalized = ((longitude % 360) + 360) % 360;
  return normalized % 30;
}