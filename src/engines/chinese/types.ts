export type ChineseAnimal =
  | 'rat'
  | 'ox'
  | 'tiger'
  | 'rabbit'
  | 'dragon'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'monkey'
  | 'rooster'
  | 'dog'
  | 'pig';

export type ChineseElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface ChineseAnimalInfo {
  animal: ChineseAnimal;
  nameFa: string;
  nameEn: string;
  emoji: string;
  meaning: string;
  keywords: string[];
  years: string;
}

export interface ChineseElementInfo {
  element: ChineseElement;
  nameFa: string;
  nameEn: string;
  meaning: string;
  keywords: string[];
}

export interface ChineseZodiacResult {
  year: number;
  chineseYear: number;
  animal: ChineseAnimal;
  element: ChineseElement;
  animalInfo: ChineseAnimalInfo;
  elementInfo: ChineseElementInfo;
  combinedName: string;
  newYearDate: string;
}
