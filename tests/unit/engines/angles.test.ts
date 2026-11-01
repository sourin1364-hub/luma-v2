import { describe, it, expect } from 'vitest';
import { getAscendant, getMidheaven } from '@/engines/astronomy/angles';

const TEST_DATE = new Date('1991-04-04T11:00:00Z');
const TEHRAN_LAT = 35.7;
const TEHRAN_LON = 51.4;

describe('angles', () => {
  it('calculates Ascendant in valid range', () => {
    const asc = getAscendant(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    expect(asc.longitude).toBeGreaterThanOrEqual(0);
    expect(asc.longitude).toBeLessThan(360);
    expect(asc.sign).toBeTruthy();
  });

  it('calculates Midheaven in valid range', () => {
    const mc = getMidheaven(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    expect(mc.longitude).toBeGreaterThanOrEqual(0);
    expect(mc.longitude).toBeLessThan(360);
    expect(mc.sign).toBeTruthy();
  });

  it('ASC and MC are different', () => {
    const asc = getAscendant(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    const mc = getMidheaven(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);
    expect(Math.abs(asc.longitude - mc.longitude)).toBeGreaterThan(10);
  });

  it('ASC changes with latitude', () => {
    const ascTehran = getAscendant(TEST_DATE, 35.7, 51.4);
    const ascLondon = getAscendant(TEST_DATE, 51.5, -0.1);
    expect(ascTehran.longitude).not.toBe(ascLondon.longitude);
  });

  it('ASC changes with time', () => {
    const date1 = new Date('1991-04-04T11:00:00Z');
    const date2 = new Date('1991-04-04T17:00:00Z');
    const asc1 = getAscendant(date1, TEHRAN_LAT, TEHRAN_LON);
    const asc2 = getAscendant(date2, TEHRAN_LAT, TEHRAN_LON);
    expect(asc1.longitude).not.toBe(asc2.longitude);
  });
});