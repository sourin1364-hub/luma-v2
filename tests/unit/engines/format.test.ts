import { describe, it, expect } from 'vitest';
import { toPersianDigits, toEnglishDigits, formatJalaaliDate, formatTime } from '@/engines/calendar/format';

describe('digit conversion', () => {
  it('converts to Persian digits', () => {
    expect(toPersianDigits('1403')).toBe('۱۴۰۳');
    expect(toPersianDigits('08:05')).toBe('۰۸:۰۵');
  });
  it('converts back to English digits', () => {
    expect(toEnglishDigits('۱۴۰۳')).toBe('1403');
    expect(toEnglishDigits('۰۸:۰۵')).toBe('08:05');
  });
  it('is reversible', () => {
    const original = '1403/01/01 12:30';
    expect(toEnglishDigits(toPersianDigits(original))).toBe(original);
  });
});

describe('formatJalaaliDate', () => {
  it('formats with Persian digits', () => {
    expect(formatJalaaliDate({ year: 1403, month: 1, day: 1 })).toBe('۱ فروردین ۱۴۰۳');
  });
  it('formats with English digits if requested', () => {
    expect(formatJalaaliDate({ year: 1403, month: 1, day: 1 }, { persianDigits: false })).toBe('1 فروردین 1403');
  });
});

describe('formatTime', () => {
  it('formats 08:05 with Persian digits', () => {
    expect(formatTime(8, 5)).toBe('۰۸:۰۵');
  });
  it('formats 23:59', () => {
    expect(formatTime(23, 59)).toBe('۲۳:۵۹');
  });
  it('formats 00:00', () => {
    expect(formatTime(0, 0)).toBe('۰۰:۰۰');
  });
});