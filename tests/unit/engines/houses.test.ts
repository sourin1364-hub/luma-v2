import { describe, it, expect } from 'vitest';
import { calculatePlacidusHouses } from '@/engines/astronomy/houses';
import { getAscendant, getMidheaven } from '@/engines/astronomy/angles';

const TEST_DATE = new Date('1991-04-04T11:00:00Z');
const TEHRAN_LAT = 35.7;
const TEHRAN_LON = 51.4;

describe('houses', () => {
  it('returns 12 houses', () => {
    const asc = getAscendant(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const mc = getMidheaven(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const houses = calculatePlacidusHouses(asc, mc, TEHRAN_LAT);
    expect(houses).toHaveLength(12);
  });

  it('houses are numbered 1 to 12', () => {
    const asc = getAscendant(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const mc = getMidheaven(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const houses = calculatePlacidusHouses(asc, mc, TEHRAN_LAT);
    expect(houses.map(h => h.house)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('house 1 equals ASC', () => {
    const asc = getAscendant(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const mc = getMidheaven(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const houses = calculatePlacidusHouses(asc, mc, TEHRAN_LAT);
    expect(houses[0].longitude).toBeCloseTo(asc.longitude, 2);
  });

  it('house 10 equals MC', () => {
    const asc = getAscendant(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const mc = getMidheaven(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const houses = calculatePlacidusHouses(asc, mc, TEHRAN_LAT);
    expect(houses[9].longitude).toBeCloseTo(mc.longitude, 2);
  });

  it('house 7 is opposite of house 1', () => {
    const asc = getAscendant(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const mc = getMidheaven(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const houses = calculatePlacidusHouses(asc, mc, TEHRAN_LAT);
    const diff = Math.abs(houses[6].longitude - houses[0].longitude);
    expect(diff).toBeCloseTo(180, 0);
  });

  it('all house longitudes are in 0-360 range', () => {
    const asc = getAscendant(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const mc = getMidheaven(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const houses = calculatePlacidusHouses(asc, mc, TEHRAN_LAT);
    houses.forEach(h => {
      expect(h.longitude).toBeGreaterThanOrEqual(0);
      expect(h.longitude).toBeLessThan(360);
    });
  });
});