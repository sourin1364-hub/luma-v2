import { describe, it, expect } from 'vitest';
import { calculateAspects } from '@/engines/astronomy/aspects';
import type { PlanetPosition } from '@/engines/astronomy/types';

function makePlanet(planet: PlanetPosition['planet'], longitude: number): PlanetPosition {
  return {
    planet,
    longitude,
    latitude: 0,
    distance: 1,
    sign: 'aries',
    signDegree: longitude % 30,
    retrograde: false
  };
}

describe('aspects', () => {
  it('detects conjunction (0°)', () => {
    const planets = [makePlanet('sun', 10), makePlanet('moon', 12)];
    const aspects = calculateAspects(planets);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('conjunction');
  });

  it('detects opposition (180°)', () => {
    const planets = [makePlanet('sun', 10), makePlanet('moon', 190)];
    const aspects = calculateAspects(planets);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('opposition');
  });

  it('detects trine (120°)', () => {
    const planets = [makePlanet('sun', 10), makePlanet('moon', 130)];
    const aspects = calculateAspects(planets);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('trine');
  });

  it('detects square (90°)', () => {
    const planets = [makePlanet('sun', 10), makePlanet('moon', 100)];
    const aspects = calculateAspects(planets);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('square');
  });

  it('detects sextile (60°)', () => {
    const planets = [makePlanet('sun', 10), makePlanet('moon', 70)];
    const aspects = calculateAspects(planets);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('sextile');
  });

  it('does not detect aspect for 45°', () => {
    const planets = [makePlanet('sun', 10), makePlanet('moon', 55)];
    const aspects = calculateAspects(planets);
    expect(aspects).toHaveLength(0);
  });

  it('handles wraparound (358° and 2° = 4° conj)', () => {
    const planets = [makePlanet('sun', 358), makePlanet('moon', 2)];
    const aspects = calculateAspects(planets);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('conjunction');
  });

  it('detects multiple aspects between 3 planets', () => {
    const planets = [
      makePlanet('sun', 0),
      makePlanet('moon', 120),
      makePlanet('mars', 240)
    ];
    const aspects = calculateAspects(planets);
    expect(aspects.length).toBeGreaterThanOrEqual(3);
  });
});