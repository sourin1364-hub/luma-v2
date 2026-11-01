import { describe, it, expect } from 'vitest';
import { calculateNatalChart } from '@/engines/astronomy/chart';

const TEST_DATE = new Date('1991-04-04T11:00:00Z');
const TEHRAN_LAT = 35.7;
const TEHRAN_LON = 51.4;

describe('natal chart (end-to-end)', () => {
  const chart = calculateNatalChart(TEST_DATE, TEHRAN_LAT, TEHRAN_LON);

  it('returns all 10 planets', () => {
    expect(chart.planets).toHaveLength(10);
  });

  it('returns ascendant', () => {
    expect(chart.ascendant).toBeDefined();
    expect(chart.ascendant.longitude).toBeGreaterThanOrEqual(0);
    expect(chart.ascendant.longitude).toBeLessThan(360);
  });

  it('returns midheaven', () => {
    expect(chart.midheaven).toBeDefined();
    expect(chart.midheaven.longitude).toBeGreaterThanOrEqual(0);
  });

  it('returns 12 houses', () => {
    expect(chart.houses).toHaveLength(12);
  });

  it('returns aspects array', () => {
    expect(Array.isArray(chart.aspects)).toBe(true);
    expect(chart.aspects.length).toBeGreaterThan(0);
  });

  it('includes version', () => {
    expect(chart.version).toBe('1.0.0');
  });

  it('Sun is in Aries', () => {
    const sun = chart.planets.find(p => p.planet === 'sun');
    expect(sun!.sign).toBe('aries');
  });

  it('all planets have valid positions', () => {
    chart.planets.forEach(p => {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
      expect(p.signDegree).toBeGreaterThanOrEqual(0);
      expect(p.signDegree).toBeLessThan(30);
    });
  });
});