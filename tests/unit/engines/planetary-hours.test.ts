import { describe, expect, it } from 'vitest';
import {
  calculatePlanetaryHours,
  formatLocalDateTime,
  localDateTimeToUtc,
  PLANETARY_NATURE,
} from '@/engines/astronomy/planetaryHours';

describe('planetary hours', () => {
  it('creates twelve variable day hours and twelve variable night hours from local sunrise and sunset', () => {
    const result = calculatePlanetaryHours('2024-03-20', 35.6892, 51.389, 'Asia/Tehran');

    expect(result.hours).toHaveLength(24);
    expect(result.hours.slice(0, 12).every((hour) => hour.period === 'day')).toBe(true);
    expect(result.hours.slice(12).every((hour) => hour.period === 'night')).toBe(true);
    expect(result.hours[0].planet).toBe('mercury');
    expect(result.hours[0].start.getTime()).toBe(result.sunrise.getTime());
    expect(result.hours[11].end.getTime()).toBe(result.sunset.getTime());
    expect(result.hours[12].start.getTime()).toBe(result.sunset.getTime());
    expect(result.hours[23].end.getTime()).toBe(result.nextSunrise.getTime());
    expect(result.hours.every((hour) => hour.end > hour.start)).toBe(true);
  });

  it('calculates sunrise and sunset separately for locations on the same local date', () => {
    const tehran = calculatePlanetaryHours('2024-06-21', 35.6892, 51.389, 'Asia/Tehran');
    const sardasht = calculatePlanetaryHours('2024-06-21', 36.15, 45.48, 'Asia/Tehran');

    expect(Math.abs(tehran.sunrise.getTime() - sardasht.sunrise.getTime())).toBeGreaterThan(10 * 60_000);
    expect(tehran.hours[0].planet).toBe(sardasht.hours[0].planet);
    expect(tehran.hours[0].end.getTime() - tehran.hours[0].start.getTime())
      .not.toBe(sardasht.hours[0].end.getTime() - sardasht.hours[0].start.getTime());
  });

  it('uses the weekday ruler and the traditional greater/lesser classifications', () => {
    const sunday = calculatePlanetaryHours('2024-03-17', 35.6892, 51.389, 'Asia/Tehran');
    const saturday = calculatePlanetaryHours('2024-03-16', 35.6892, 51.389, 'Asia/Tehran');

    expect(sunday.hours[0].planet).toBe('sun');
    expect(saturday.hours[0].planet).toBe('saturn');
    expect(PLANETARY_NATURE.jupiter).toBe('greater_benefic');
    expect(PLANETARY_NATURE.venus).toBe('lesser_benefic');
    expect(PLANETARY_NATURE.saturn).toBe('greater_malefic');
    expect(PLANETARY_NATURE.mars).toBe('lesser_malefic');
  });

  it('reports when polar day or night prevents the traditional day/night division', () => {
    expect(() => calculatePlanetaryHours('2024-06-21', 89, 0, 'UTC')).toThrow(/unavailable/i);
  });

  it('converts and formats wall-clock times in the requested time zone', () => {
    const utc = localDateTimeToUtc('2024-03-20T12:30', 'Asia/Tehran');
    expect(utc.toISOString()).toBe('2024-03-20T09:00:00.000Z');
    expect(formatLocalDateTime(utc, 'Asia/Tehran')).toBe('2024-03-20T12:30');
    const ancientDate = localDateTimeToUtc('0001-01-02T03:04', 'UTC');
    expect(ancientDate.toISOString()).toBe('0001-01-02T03:04:00.000Z');
    expect(formatLocalDateTime(ancientDate, 'UTC')).toBe('0001-01-02T03:04');
  });

  it('rejects invalid dates, coordinates, and local daylight-saving gaps', () => {
    expect(() => calculatePlanetaryHours('2024-02-30', 0, 0, 'UTC')).toThrow(/date/i);
    expect(() => calculatePlanetaryHours('2024-03-20', 91, 0, 'UTC')).toThrow(/latitude/i);
    expect(() => localDateTimeToUtc('2024-03-10T02:30', 'America/New_York')).toThrow(/does not exist/i);
  });
});
