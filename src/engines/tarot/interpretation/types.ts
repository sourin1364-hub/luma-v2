export type SpreadId =
  | 'daily-card'
  | 'single-card'
  | 'past-present-future'
  | 'situation-obstacle-advice'
  | 'mind-heart-action'
  | 'yes-no'
  | 'celtic-cross'
  | 'horseshoe'
  | 'relationship'
  | 'career'
  | 'yearly';

export interface PositionMeaning {
  positionIndex: number;
  positionName: string;
  meaning: string;
}

export interface CardPositionContext {
  cardId: string;
  cardNameFa: string;
  cardNameEn: string;
  isReversed: boolean;
  positionIndex: number;
  positionName: string;
  baseMeaning: string;
  positionSpecificMeaning: string;
  keywords: string[];
}

export interface ReadingSynthesis {
  spreadId: SpreadId;
  spreadName: string;
  question: string;
  cards: CardPositionContext[];
  overallTheme: string;
  dominantElement: string;
  dominantSuit: string;
  energyScore: number;
  narrative: string;
  advice: string;
  warnings: string[];
  affirmations: string[];
}
