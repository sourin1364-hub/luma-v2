import { describe, it, expect } from 'vitest';
import {
  jalaaliToGregorian,
  gregorianToJalaali,
  isLeapYear,
  daysInMonth,
  isValidJalaaliDate,
  getMonthsOfYear,
  compareJalaali
} from '@/engines/calendar/jalaali';

describe('jalaali conversion', () => {
  it('converts 1403/01/01 to 2024/03/20', () => {
    expect(jalaaliToGregorian({ year: 1403, month: 1, day: 1 })).toEqual({
      year: 2024, month: 3, day: 20
    });
  });
  it('converts 2024/03/20 back to 1403/01/01', () => {
    expect(gregorianToJalaali({ year: 2024, month: 3, day: 20 })).toEqual({
      year: 1403, month: 1, day: 1
    });
  });
  it('converts 1402/12/29 to 2024/03/19 (last day of 1402)', () => {
    expect(jalaaliToGregorian({ year: 1402, month: 12, day: 29 })).toEqual({
      year: 2024, month: 3, day: 19
    });
  });
});

describe('leap year', () => {
  it('1403 is leap', () => expect(isLeapYear(1403)).toBe(true));
  it('1402 is not leap', () => expect(isLeapYear(1402)).toBe(false));
  it('1404 is not leap', () => expect(isLeapYear(1404)).toBe(false));
});

describe('daysInMonth', () => {
  it('month 1 has 31 days', () => expect(daysInMonth(1403, 1)).toBe(31));
  it('month 2 has 31 days', () => expect(daysInMonth(1403, 2)).toBe(31));
  it('month 6 has 31 days', () => expect(daysInMonth(1403, 6)).toBe(31));
  it('month 7 has 30 days', () => expect(daysInMonth(1403, 7)).toBe(30));
  it('month 12 of 1403 (leap) has 30 days', () => expect(daysInMonth(1403, 12)).toBe(30));
  it('month 12 of 1402 (not leap) has 29 days', () => expect(daysInMonth(1402, 12)).toBe(29));
});

describe('validation', () => {
  it('rejects 1402/12/30', () => {
    expect(isValidJalaaliDate({ year: 1402, month: 12, day: 30 })).toBe(false);
  });
  it('accepts 1403/12/30', () => {
    expect(isValidJalaaliDate({ year: 1403, month: 12, day: 30 })).toBe(true);
  });
  it('rejects month 13', () => {
    expect(isValidJalaaliDate({ year: 1403, month: 13, day: 1 })).toBe(false);
  });
  it('rejects day 0', () => {
    expect(isValidJalaaliDate({ year: 1403, month: 1, day: 0 })).toBe(false);
  });
});

describe('getMonthsOfYear', () => {
  it('returns 12 months', () => {
    const months = getMonthsOfYear(1403);
    expect(months).toHaveLength(12);
    expect(months[0].name).toBe('فروردین');
    expect(months[11].name).toBe('اسفند');
  });
  it('shows 30 days for month 12 of 1403 (leap)', () => {
    const months = getMonthsOfYear(1403);
    expect(months[11].days).toBe(30);
  });
  it('shows 29 days for month 12 of 1402 (not leap)', () => {
    const months = getMonthsOfYear(1402);
    expect(months[11].days).toBe(29);
  });
});

describe('compareJalaali', () => {
  it('compares by year', () => {
    expect(compareJalaali({ year: 1402, month: 1, day: 1 }, { year: 1403, month: 1, day: 1 })).toBeLessThan(0);
  });
  it('compares by month if year equal', () => {
    expect(compareJalaali({ year: 1403, month: 1, day: 1 }, { year: 1403, month: 2, day: 1 })).toBeLessThan(0);
  });
  it('compares by day if year and month equal', () => {
    expect(compareJalaali({ year: 1403, month: 1, day: 5 }, { year: 1403, month: 1, day: 10 })).toBeLessThan(0);
  });
  it('returns 0 for equal dates', () => {
    expect(compareJalaali({ year: 1403, month: 1, day: 1 }, { year: 1403, month: 1, day: 1 })).toBe(0);
  });
});