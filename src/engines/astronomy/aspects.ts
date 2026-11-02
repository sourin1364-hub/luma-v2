import type { Aspect, AspectType, PlanetPosition } from './types';

const ASPECT_ANGLES: Record<AspectType, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180
};

const DEFAULT_ORBS: Record<AspectType, number> = {
  conjunction: 8,
  sextile: 6,
  square: 6,
  trine: 6,
  opposition: 8
};

function angleDiff(a: number, b: number): number {
  let diff = Math.abs(a - b) % 360;
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/**
 * محاسبه جنبه‌های بین سیارات.
 */
export function calculateAspects(
  planets: PlanetPosition[],
  orbs: Partial<Record<AspectType, number>> = {}
): Aspect[] {
  const aspects: Aspect[] = [];
  const effectiveOrbs = { ...DEFAULT_ORBS, ...orbs };

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const diff = angleDiff(p1.longitude, p2.longitude);

      for (const [type, exactAngle] of Object.entries(ASPECT_ANGLES) as [AspectType, number][]) {
        const orb = Math.abs(diff - exactAngle);
        if (orb <= effectiveOrbs[type]) {
          aspects.push({
            planet1: p1.planet,
            planet2: p2.planet,
            type,
            orb: Math.round(orb * 100) / 100,
            exactAngle
          });
          break; // فقط اولین جنبه را برای هر جفت ثبت می‌کنیم
        }
      }
    }
  }

  return aspects;
}