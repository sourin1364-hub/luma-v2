export type ChineseAnimal =
  | 'rat' | 'ox' | 'tiger' | 'rabbit' | 'dragon' | 'snake'
  | 'horse' | 'goat' | 'monkey' | 'rooster' | 'dog' | 'pig';

export type ChineseElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface ChineseAnimalInfo {
  animal: ChineseAnimal;
  nameFa: string;
  nameEn: string;
  years: string;
  keywords: string[];
  meaning: string;
}

export interface ChineseElementInfo {
  element: ChineseElement;
  nameFa: string;
  nameEn: string;
  keywords: string[];
  meaning: string;
}

export interface ChineseZodiacResult {
  animal: ChineseAnimal;
  animalInfo: ChineseAnimalInfo;
  element: ChineseElement;
  elementInfo: ChineseElementInfo;
  year: number;
  chineseYear: number;
  newYearDate: string;
  combinedName: string;
}