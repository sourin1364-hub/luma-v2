import { describe, expect, it } from 'vitest';
import { calculateLiveSky, SKY_CONSTELLATION_LINES } from '@/engines/astronomy/liveSky';

describe('calculateLiveSky', () => {
  it('calculates the Sun position from the observer coordinates and observation time', () => {
    const date = new Date('2024-03-20T12:00:00.000Z');
    const atGreenwich = calculateLiveSky(date, 0, 0).find((item) => item.id === 'sun');
    const onTheOppositeMeridian = calculateLiveSky(date, 0, -180).find((item) => item.id === 'sun');

    expect(atGreenwich).toBeDefined();
    expect(onTheOppositeMeridian).toBeDefined();
    expect(atGreenwich!.altitude).toBeGreaterThan(80);
    expect(onTheOppositeMeridian!.altitude).toBeLessThan(-80);
    expect(Math.abs(atGreenwich!.altitude - onTheOppositeMeridian!.altitude)).toBeGreaterThan(150);
  });

  it('returns actual bright stars and all major planets in horizontal coordinates', () => {
    const sky = calculateLiveSky(new Date('2026-11-10T18:00:00.000Z'), 36.5, 45.5);

    expect(sky.some((item) => item.id === 'Sirius' && item.kind === 'star')).toBe(true);
    expect(sky.some((item) => item.id === 'jupiter' && item.kind === 'planet')).toBe(true);
    expect(sky.filter((item) => item.kind === 'star').length).toBeGreaterThan(60);
    expect(sky.every((item) => !item.id.startsWith('background-'))).toBe(true);
    const starIds = new Set(sky.filter((item) => item.kind === 'star').map((item) => item.id));
    expect(SKY_CONSTELLATION_LINES.flat().every((id) => starIds.has(id))).toBe(true);
    expect(sky.every((item) =>
      Number.isFinite(item.azimuth) &&
      Number.isFinite(item.altitude) &&
      item.azimuth >= 0 &&
      item.azimuth <= 360
    )).toBe(true);
  });

  it('rejects invalid observer coordinates', () => {
    expect(() => calculateLiveSky(new Date(), 91, 0)).toThrow(/latitude/);
    expect(() => calculateLiveSky(new Date(), 0, 181)).toThrow(/longitude/);
  });
});
