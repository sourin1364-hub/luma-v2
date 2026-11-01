export interface AbjadResult {
  input: string;
  normalized: string;
  total: number;
  reduced: number;
  breakdown: { letter: string; value: number }[];
}

export interface LifePathResult {
  birthDate: { year: number; month: number; day: number };
  total: number;
  reduced: number;
  isMasterNumber: boolean;
}

export interface NumberMeaning {
  number: number;
  nameFa: string;
  keywords: string[];
  meaning: string;
}