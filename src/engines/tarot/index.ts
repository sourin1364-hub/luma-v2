import { MAJOR_ARCANA_PART_1 } from './majorArcana';
import { MAJOR_ARCANA_PART_2 } from './majorArcanaPart2';
import { WANDS_CARDS } from './wands';
import type { TarotCard } from './types';

export * from './types';
export * from './constants';
export * from './majorArcana';
export * from './majorArcanaPart2';
export * from './wands';

export const MAJOR_ARCANA: TarotCard[] = [
  ...MAJOR_ARCANA_PART_1,
  ...MAJOR_ARCANA_PART_2
];

export const ALL_TAROT_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...WANDS_CARDS
];

export function getMajorCard(id: string): TarotCard | undefined {
  return MAJOR_ARCANA.find((c) => c.id === id);
}

export function getAllMajorCards(): TarotCard[] {
  return [...MAJOR_ARCANA];
}

export function getWandsCards(): TarotCard[] {
  return [...WANDS_CARDS];
}