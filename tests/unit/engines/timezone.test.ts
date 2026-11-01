import { describe, it, expect } from 'vitest';
import { birthToUtc, utcToBirthLocal, isValidTimezone } from '@/engines/calendar/timezone';

describe('birthToUtc', () => {
  it('converts Tehran local time to UTC correctly', () => {
    const utc = birthToUtc({ year: 1403, month: 1, day: 1 }, 12, 0, 'Asia/Tehran');
    // 12:00 Tehran (UTC+3:30) = 08:30 UTC
    expect(utc.toISOString()).toBe('2024-03-20T08:30:00.000Z');
  });

  it('handles historical DST (Iran had DST before 2022)', () => {
    // 1390/04/01 (2021-06-22) â€” Iran had DST then (UTC+4:30)
    const utc = birthToUtc({ year: 1390, month: 4, day: 1 }, 12, 0, 'Asia/Tehran');
    expect(utc.toISOString()).toBe('2011-06-22T07:30:00.000Z');
  });

  it('throws on invalid timezone', () => {
    expect(() => birthToUtc({ year: 1403, month: 1, day: 1 }, 12, 0, 'Invalid/Zone')).toThrow();
  });
});

describe('utcToBirthLocal', () => {
  it('converts UTC back to Tehran local', () => {
    const utc = new Date('2024-03-20T08:30:00.000Z');
    const local = utcToBirthLocal(utc, 'Asia/Tehran');
    expect(local.gregorian).toEqual({ year: 2024, month: 3, day: 20 });
    expect(local.hour).toBe(12);
    expect(local.minute).toBe(0);
  });
});

describe('isValidTimezone', () => {
  it('accepts Asia/Tehran', () => expect(isValidTimezone('Asia/Tehran')).toBe(true));
  it('accepts Europe/London', () => expect(isValidTimezone('Europe/London')).toBe(true));
  it('rejects nonsense', () => expect(isValidTimezone('Nonsense/Zone')).toBe(false));
});