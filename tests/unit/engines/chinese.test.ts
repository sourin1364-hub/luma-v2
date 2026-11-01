import { describe, it, expect } from 'vitest';
import {
  getChineseYear,
  getAnimal,
  getElement,
  calculateChineseZodiac,
  CHINESE_ANIMALS,
  CHINESE_ELEMENTS
} from '@/engines/chinese';

describe('getChineseYear', () => {
  it('after new year → same year', () => {
    expect(getChineseYear(2024, 3, 1)).toBe(2024);
    expect(getChineseYear(2024, 6, 15)).toBe(2024);
  });

  it('before new year → previous year', () => {
    expect(getChineseYear(2024, 1, 15)).toBe(2023);
    expect(getChineseYear(2024, 2, 1)).toBe(2023);
  });

  it('on new year day → same year', () => {
    expect(getChineseYear(2024, 2, 10)).toBe(2024);
  });
});

describe('getAnimal', () => {
  it('2024 is Dragon', () => {
    expect(getAnimal(2024)).toBe('dragon');
  });
  it('2023 is Rabbit', () => {
    expect(getAnimal(2023)).toBe('rabbit');
  });
  it('2020 is Rat', () => {
    expect(getAnimal(2020)).toBe('rat');
  });
  it('1990 is Horse', () => {
    expect(getAnimal(1990)).toBe('horse');
  });
});

describe('getElement', () => {
  it('2024 is Wood', () => {
    expect(getElement(2024)).toBe('wood');
  });
  it('2025 is Wood (year 41 in cycle)', () => {
    // 2025: (2025-4)%10 = 1 → floor(1/2)=0 → wood
    expect(getElement(2025)).toBe('wood');
  });
  it('2026 is Fire', () => {
    // 2026: (2026-4)%10 = 2 → floor(2/2)=1 → fire
    expect(getElement(2026)).toBe('fire');
  });
});

describe('calculateChineseZodiac', () => {
  it('2024-03-01 is Wood Dragon', () => {
    const result = calculateChineseZodiac(2024, 3, 1);
    expect(result.animal).toBe('dragon');
    expect(result.element).toBe('wood');
    expect(result.combinedName).toBe('اژدها چوب');
  });

  it('2024-01-15 is Water Rabbit (before new year)', () => {
    const result = calculateChineseZodiac(2024, 1, 15);
    expect(result.animal).toBe('rabbit');
    expect(result.chineseYear).toBe(2023);
  });

  it('returns full info objects', () => {
    const result = calculateChineseZodiac(1990, 6, 15);
    expect(result.animalInfo).toBeDefined();
    expect(result.animalInfo.nameFa).toBeTruthy();
    expect(result.elementInfo).toBeDefined();
    expect(result.elementInfo.nameFa).toBeTruthy();
    expect(result.newYearDate).toBe('1990-01-27');
  });
});

describe('constants', () => {
  it('12 animals', () => {
    expect(CHINESE_ANIMALS).toHaveLength(12);
  });
  it('5 elements', () => {
    expect(CHINESE_ELEMENTS).toHaveLength(5);
  });
  it('all animals have unique ids', () => {
    const ids = CHINESE_ANIMALS.map(a => a.animal);
    expect(new Set(ids).size).toBe(12);
  });
  it('all elements have unique ids', () => {
    const ids = CHINESE_ELEMENTS.map(e => e.element);
    expect(new Set(ids).size).toBe(5);
  });
});