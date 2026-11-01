import { toJalaali, toGregorian, isLeapJalaaliYear, jalaaliMonthLength } from 'jalaali-js';
import type { JalaaliDate, GregorianDate, MonthInfo } from './types';
import { MONTH_NAMES_FA } from './types';

export function jalaaliToGregorian(date: JalaaliDate): GregorianDate {
  if (!isValidJalaaliDate(date)) {
    throw new Error('Invalid Jalaali date: ' + date.year + '/' + date.month + '/' + date.day);
  }
  const g = toGregorian(date.year, date.month, date.day);
  return { year: g.gy, month: g.gm, day: g.gd };
}

export function gregorianToJalaali(date: GregorianDate): JalaaliDate {
  const j = toJalaali(date.year, date.month, date.day);
  return { year: j.jy, month: j.jm, day: j.jd };
}

export function isLeapYear(jalaaliYear: number): boolean {
  return isLeapJalaaliYear(jalaaliYear);
}

export function daysInMonth(jalaaliYear: number, jalaaliMonth: number): number {
  if (jalaaliMonth < 1 || jalaaliMonth > 12) {
    throw new Error('Month must be 1-12, got ' + jalaaliMonth);
  }
  return jalaaliMonthLength(jalaaliYear, jalaaliMonth);
}

export function isValidJalaaliDate(date: JalaaliDate): boolean {
  if (!date || typeof date.year !== 'number' || typeof date.month !== 'number' || typeof date.day !== 'number') {
    return false;
  }
  if (date.year < 1200 || date.year > 1700) return false;
  if (date.month < 1 || date.month > 12) return false;
  const maxDays = jalaaliMonthLength(date.year, date.month);
  if (date.day < 1 || date.day > maxDays) return false;
  return true;
}

export function getMonthsOfYear(jalaaliYear: number): MonthInfo[] {
  return MONTH_NAMES_FA.map((name, idx) => ({
    index: idx + 1,
    name,
    days: daysInMonth(jalaaliYear, idx + 1)
  }));
}

export function compareJalaali(a: JalaaliDate, b: JalaaliDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}