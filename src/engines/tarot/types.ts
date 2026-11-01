export type Arcana = 'major' | 'minor';
export type Suit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
export type TarotElement = 'fire' | 'water' | 'air' | 'earth' | 'spirit';

export interface CardMeaning {
  meaning: string;
  keywords: string[];
}

export interface TarotCard {
  id: string;
  nameEn: string;
  nameFa: string;
  arcana: Arcana;
  suit: Suit;
  number: number;
  imagePath: string;
  keywords: string[];
  upright: CardMeaning;
  reversed: CardMeaning;
  element?: TarotElement;
  planet?: string;
  astrology?: string;
}

export interface SpreadPosition {
  index: number;
  nameFa: string;
  description: string;
}

export interface Spread {
  id: string;
  nameFa: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface DrawnCard {
  cardId: string;
  isReversed: boolean;
  positionIndex: number;
}

export interface ReadingResult {
  spreadId: string;
  question: string;
  drawnCards: DrawnCard[];
  createdAt: string;
  version: string;
}