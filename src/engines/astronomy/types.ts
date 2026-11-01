export type PlanetName =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto';

export type ZodiacSignName =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type Element = 'fire' | 'earth' | 'air' | 'water';
export type Modality = 'cardinal' | 'fixed' | 'mutable';

export interface ZodiacSign {
  name: ZodiacSignName;
  nameFa: string;
  index: number;
  startDegree: number;
  element: Element;
  modality: Modality;
  ruler: PlanetName;
}

export interface PlanetPosition {
  planet: PlanetName;
  longitude: number;
  latitude: number;
  distance: number;
  sign: ZodiacSignName;
  signDegree: number;
  retrograde: boolean;
}

export interface AnglePosition {
  longitude: number;
  sign: ZodiacSignName;
  signDegree: number;
}

export interface HouseCusp {
  house: number;
  longitude: number;
  sign: ZodiacSignName;
  signDegree: number;
}

export type AspectType =
  | 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';

export interface Aspect {
  planet1: PlanetName;
  planet2: PlanetName;
  type: AspectType;
  orb: number;
  exactAngle: number;
}

export interface NatalChart {
  planets: PlanetPosition[];
  ascendant: AnglePosition;
  midheaven: AnglePosition;
  houses: HouseCusp[];
  aspects: Aspect[];
  version: string;
}