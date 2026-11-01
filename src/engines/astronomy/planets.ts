import { Body, Ecliptic, GeoVector } from 'astronomy-engine';
import type { PlanetName, PlanetPosition } from './types';
import { getSign, getSignDegree } from './constants';

const PLANET_BODIES: Record<PlanetName, Body> = {
  sun: Body.Sun,
  moon: Body.Moon,
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
  uranus: Body.Uranus,
  neptune: Body.Neptune,
  pluto: Body.Pluto
};

/**
 * محاسبه موقعیت یک سیاره در لحظه داده‌شده.
 */
export function getPlanetPosition(planet: PlanetName, date: Date): PlanetPosition {
  const body = PLANET_BODIES[planet];
  const vector = GeoVector(body, date, true);
  const ecliptic = Ecliptic(vector);

  const longitude = ecliptic.elon;
  const latitude = ecliptic.elat;
  const distance = vector.Length();

  // تشخیص رتروگراد: مقایسه موقعیت یک روز بعد
  const dayLater = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  const futureVector = GeoVector(body, dayLater, true);
  const futureEcliptic = Ecliptic(futureVector);
  const delta = futureEcliptic.elon - longitude;
  // اگر اختلاف منفی (در بازه -180 تا 180) باشد، رتروگراد است
  const normalizedDelta = ((delta + 180) % 360 + 360) % 360 - 180;
  const retrograde = normalizedDelta < 0;

  return {
    planet,
    longitude,
    latitude,
    distance,
    sign: getSign(longitude).name,
    signDegree: getSignDegree(longitude),
    retrograde
  };
}

/**
 * محاسبه موقعیت هر ۱۰ سیاره.
 */
export function getAllPlanets(date: Date): PlanetPosition[] {
  const planets: PlanetName[] = [
    'sun', 'moon', 'mercury', 'venus', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
  ];
  return planets.map((p) => getPlanetPosition(p, date));
}