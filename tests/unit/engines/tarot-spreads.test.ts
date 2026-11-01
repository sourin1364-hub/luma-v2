import { describe, it, expect } from 'vitest';
import { SPREADS, getSpreadById, getAllSpreads } from '@/engines/tarot';

describe('Tarot spreads', () => {
  it('has 6 spreads', () => {
    expect(SPREADS).toHaveLength(6);
  });

  it('all spreads have unique ids', () => {
    const ids = SPREADS.map(s => s.id);
    expect(new Set(ids).size).toBe(6);
  });

  it('every spread has correct number of positions matching cardCount', () => {
    SPREADS.forEach(spread => {
      expect(spread.positions).toHaveLength(spread.cardCount);
    });
  });

  it('every position has nameFa and description', () => {
    SPREADS.forEach(spread => {
      spread.positions.forEach(pos => {
        expect(pos.nameFa).toBeTruthy();
        expect(pos.description).toBeTruthy();
      });
    });
  });

  it('getSpreadById works', () => {
    const spread = getSpreadById('past-present-future');
    expect(spread).toBeDefined();
    expect(spread!.cardCount).toBe(3);
    expect(spread!.positions[0].nameFa).toBe('گذشته');
    expect(spread!.positions[1].nameFa).toBe('حال');
    expect(spread!.positions[2].nameFa).toBe('آینده');
  });

  it('getSpreadById returns undefined for unknown id', () => {
    expect(getSpreadById('nonexistent')).toBeUndefined();
  });

  it('getAllSpreads returns a copy', () => {
    const copy = getAllSpreads();
    copy.push(copy[0]);
    expect(SPREADS).toHaveLength(6);
  });
});