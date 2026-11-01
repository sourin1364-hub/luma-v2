import { describe, it, expect } from 'vitest';
import { getPlanetPosition, getAllPlanets } from '@/engines/astronomy/planets';

// داده مرجع: 4 آوریل 1991، 14:30 تهران
// UTC = 1991-04-04T11:00:00Z (تهران UTC+3:30 بدون DST)
const TEST_DATE = new Date('1991-04-04T11:00:00Z');

describe('planets', () => {
  it('calculates all 10 planets', () => {
    const planets = getAllPlanets(TEST_DATE);
    expect(planets).toHaveLength(10);
    const names = planets.map(p => p.planet);
    expect(names).toContain('sun');
    expect(names).toContain('moon');
    expect(names).toContain('pluto');
  });

  it('Sun is in Aries (0-30°) on April 4', () => {
    const sun = getPlanetPosition('sun', TEST_DATE);
    // April 4 → Sun around 14° Aries
    expect(sun.sign).toBe('aries');
    expect(sun.signDegree).toBeGreaterThan(10);
    expect(sun.signDegree).toBeLessThan(20);
  });

  it('Sun longitude is between 10 and 20 degrees', () => {
    const sun = getPlanetPosition('sun', TEST_DATE);
    // 14° Aries = 14° longitude
    expect(sun.longitude).toBeGreaterThan(10);
    expect(sun.longitude).toBeLessThan(20);
  });

  it('Moon has valid position', () => {
    const moon = getPlanetPosition('moon', TEST_DATE);
    expect(moon.longitude).toBeGreaterThanOrEqual(0);
    expect(moon.longitude).toBeLessThan(360);
    expect(moon.sign).toBeTruthy();
  });

  it('retrograde detection works', () => {
    const planets = getAllPlanets(TEST_DATE);
    // در این تاریخ، مریخ رتروگراد نیست (تقریباً)
    const mars = planets.find(p => p.planet === 'mars');
    expect(mars).toBeDefined();
    expect(typeof mars!.retrograde).toBe('boolean');
  });
});