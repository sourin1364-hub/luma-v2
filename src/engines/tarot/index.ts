import { MAJOR_ARCANA_PART_1 } from './majorArcana';
import { MAJOR_ARCANA_PART_2 } from './majorArcanaPart2';
import { WANDS_CARDS } from './wands';
import { CUPS_CARDS } from './cups';
import { SWORDS_CARDS } from './swords';
import type { TarotCard } from './types';

export * from './types';
export * from './constants';
export * from './majorArcana';
export * from './majorArcanaPart2';
export * from './wands';
export * from './cups';
export * from './swords';

export const MAJOR_ARCANA: TarotCard[] = [
  ...MAJOR_ARCANA_PART_1,
  ...MAJOR_ARCANA_PART_2
];

export const ALL_TAROT_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...WANDS_CARDS,
  ...CUPS_CARDS,
  ...SWORDS_CARDS
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

export function getCupsCards(): TarotCard[] {
  return [...CUPS_CARDS];
}

export function getSwordsCards(): TarotCard[] {
  return [...SWORDS_CARDS];
}