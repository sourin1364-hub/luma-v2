import { toJalaali, toGregorian, isLeapJalaaliYear, jalaaliMonthLength } from './jalaali-core';
import type { JalaaliDate, GregorianDate } from './types';

export { isLeapJalaaliYear, jalaaliMonthLength };

export interface JalaaliMonth {
  number: number;
  name: string;
  days: number;
}

const MONTH_NAMES_FA = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export function gregorianToJalaali(g: GregorianDate): JalaaliDate {
  const { jy, jm, jd } = toJalaali(g.year, g.month, g.day);
  return { year: jy, month: jm, day: jd };
}

export function jalaaliToGregorian(j: JalaaliDate): GregorianDate {
  const { gy, gm, gd } = toGregorian(j.year, j.month, j.day);
  return { year: gy, month: gm, day: gd };
}

export function isLeapYear(year: number): boolean {
  return isLeapJalaaliYear(year);
}

export function daysInMonth(year: number, month: number): number {
  return jalaaliMonthLength(year, month);
}

export function getMonthsOfYear(year: number): JalaaliMonth[] {
  return MONTH_NAMES_FA.map((name, idx) => {
    const m = idx + 1;
    return {
      number: m,
      name,
      days: jalaaliMonthLength(year, m),
    };
  });
}

export function compareJalaali(a: JalaaliDate, b: JalaaliDate): number {
  if (a.year !== b.year) return a.year > b.year ? 1 : -1;
  if (a.month !== b.month) return a.month > b.month ? 1 : -1;
  if (a.day !== b.day) return a.day > b.day ? 1 : -1;
  return 0;
}

export function isValidJalaaliDate(
  yearOrDate: number | JalaaliDate,
  month?: number,
  day?: number
): boolean {
  const y = typeof yearOrDate === 'object' ? yearOrDate.year : yearOrDate;
  const m = typeof yearOrDate === 'object' ? yearOrDate.month : (month ?? 0);
  const d = typeof yearOrDate === 'object' ? yearOrDate.day : (day ?? 0);

  if (y < 1 || y > 3177) return false;
  if (m < 1 || m > 12) return false;
  const maxDay = jalaaliMonthLength(y, m);
  return d >= 1 && d <= maxDay;
}

export function todayJalaali(): JalaaliDate {
  const now = new Date();
  return gregorianToJalaali({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  });
}
