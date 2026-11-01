import { DateTime } from 'luxon';
import type { JalaaliDate } from './types';
import { jalaaliToGregorian } from './jalaali';

export function birthToUtc(
  jalaali: JalaaliDate,
  hour: number,
  minute: number,
  timezone: string
): Date {
  const g = jalaaliToGregorian(jalaali);
  const dt = DateTime.fromObject(
    { year: g.year, month: g.month, day: g.day, hour, minute },
    { zone: timezone }
  );
  if (!dt.isValid) {
    throw new Error('Invalid local datetime: ' + dt.invalidReason);
  }
  return dt.toUTC().toJSDate();
}

export function utcToBirthLocal(
  utcDate: Date,
  timezone: string
): { gregorian: { year: number; month: number; day: number }; hour: number; minute: number } {
  const dt = DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(timezone);
  return {
    gregorian: { year: dt.year, month: dt.month, day: dt.day },
    hour: dt.hour,
    minute: dt.minute
  };
}

export function isValidTimezone(tz: string): boolean {
  try {
    return DateTime.local().setZone(tz).isValid;
  } catch {
    return false;
  }
}