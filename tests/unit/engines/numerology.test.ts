import { describe, it, expect } from 'vitest';
import {
  calculateAbjad,
  normalizePersian,
  reduceNumber,
  calculateLifePath,
  getNumberMeaning,
  ABJAD_TABLE,
  NUMBER_MEANINGS
} from '@/engines/numerology';

describe('normalizePersian', () => {
  it('removes spaces and punctuation', () => {
    expect(normalizePersian('علی رضا')).toBe('علیرضا');
    expect(normalizePersian('علی، رضا!')).toBe('علیرضا');
  });

  it('normalizes Arabic letters', () => {
    expect(normalizePersian('ي')).toBe('ی');
    expect(normalizePersian('ك')).toBe('ک');
    expect(normalizePersian('ة')).toBe('ه');
    expect(normalizePersian('أ')).toBe('ا');
  });

  it('removes diacritics', () => {
    expect(normalizePersian('عَلِی')).toBe('علی');
  });
});

describe('reduceNumber', () => {
  it('reduces 10 to 1', () => expect(reduceNumber(10)).toBe(1));
  it('reduces 99 to 9', () => expect(reduceNumber(99)).toBe(9));
  it('keeps 11 as master number', () => expect(reduceNumber(11)).toBe(11));
  it('keeps 22 as master number', () => expect(reduceNumber(22)).toBe(22));
  it('keeps 33 as master number', () => expect(reduceNumber(33)).toBe(33));
  it('keeps single digits', () => expect(reduceNumber(7)).toBe(7));
});

describe('calculateAbjad', () => {
  it('calculates simple name', () => {
    const result = calculateAbjad('علی');
    // ع=70، ل=30، ی=10 → 110 → 2
    expect(result.total).toBe(110);
    expect(result.reduced).toBe(2);
    expect(result.breakdown).toHaveLength(3);
  });

  it('calculates Persian name with new letters', () => {
    const result = calculateAbjad('پدر');
    // پ=2، د=4، ر=200 → 206 → 8
    expect(result.total).toBe(206);
    expect(result.reduced).toBe(8);
  });

  it('handles empty input', () => {
    const result = calculateAbjad('');
    expect(result.total).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });

  it('ignores non-Persian characters', () => {
    const result = calculateAbjad('علی 123');
    expect(result.normalized).toBe('علی');
  });
});

describe('calculateLifePath', () => {
  it('calculates for 1991-04-04', () => {
    // سال: 1991 → 1+9+9+1=20 → 2
    // ماه: 4 → 4
    // روز: 4 → 4
    // جمع: 2+4+4=10 → 1
    const result = calculateLifePath(1991, 4, 4);
    expect(result.reduced).toBe(1);
    expect(result.isMasterNumber).toBe(false);
  });

  it('detects master number 11', () => {
    // 1990-01-09: سال 1+9+9+0=19→1، ماه 1، روز 9 → 1+1+9=11 → master
    const result = calculateLifePath(1990, 1, 9);
    expect(result.reduced).toBe(11);
    expect(result.isMasterNumber).toBe(true);
  });

  it('returns birthDate', () => {
    const result = calculateLifePath(2000, 12, 31);
    expect(result.birthDate).toEqual({ year: 2000, month: 12, day: 31 });
  });
});

describe('getNumberMeaning', () => {
  it('returns meaning for 1-9', () => {
    for (let i = 1; i <= 9; i++) {
      const m = getNumberMeaning(i);
      expect(m).toBeDefined();
      expect(m!.keywords.length).toBeGreaterThan(0);
      expect(m!.meaning).toBeTruthy();
    }
  });

  it('returns undefined for 0 or 10+', () => {
    expect(getNumberMeaning(0)).toBeUndefined();
    expect(getNumberMeaning(10)).toBeUndefined();
  });
});

describe('constants', () => {
  it('ABJAD_TABLE has standard values', () => {
    expect(ABJAD_TABLE['ا']).toBe(1);
    expect(ABJAD_TABLE['ب']).toBe(2);
    expect(ABJAD_TABLE['ع']).toBe(70);
    expect(ABJAD_TABLE['غ']).toBe(1000);
  });

  it('NUMBER_MEANINGS has 12 entries (1-9 + master 11, 22, 33)', () => {
    expect(NUMBER_MEANINGS).toHaveLength(12);
  });

  it('includes master numbers 11, 22, 33', () => {
    expect(getNumberMeaning(11)).toBeDefined();
    expect(getNumberMeaning(22)).toBeDefined();
    expect(getNumberMeaning(33)).toBeDefined();
  });
});