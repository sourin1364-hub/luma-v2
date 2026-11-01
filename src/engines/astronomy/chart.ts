import type { NatalChart } from './types';
import { getAllPlanets } from './planets';
import { getAscendant, getMidheaven } from './angles';
import { calculatePlacidusHouses } from './houses';
import { calculateAspects } from './aspects';

export const ASTRONOMY_ENGINE_VERSION = '1.0.0';

/**
 * ساخت چارت تولد کامل از تاریخ/ساعت UTC و مختصات جغرافیایی.
 */
export function calculateNatalChart(
  utcDate: Date,
  latitude: number,
  longitude: number
): NatalChart {
  const planets = getAllPlanets(utcDate);
  const ascendant = getAscendant(utcDate, latitude, longitude);
  const midheaven = getMidheaven(utcDate, latitude, longitude);
  const houses = calculatePlacidusHouses(ascendant, midheaven, latitude);
  const aspects = calculateAspects(planets);

  return {
    planets,
    ascendant,
    midheaven,
    houses,
    aspects,
    version: ASTRONOMY_ENGINE_VERSION
  };
}