import { describe, it, expect } from 'vitest';
import { drawCards, performReading, getSpreadById } from '@/engines/tarot';

const spread3 = getSpreadById('past-present-future')!;
const spread1 = getSpreadById('single-card')!;

describe('Tarot card drawing', () => {
  it('draws correct number of cards for 3-card spread', () => {
    const drawn = drawCards(spread3);
    expect(drawn).toHaveLength(3);
  });

  it('draws correct number of cards for 1-card spread', () => {
    const drawn = drawCards(spread1);
    expect(drawn).toHaveLength(1);
  });

  it('no duplicate cards in a reading', () => {
    const drawn = drawCards(spread3);
    const ids = drawn.map(c => c.cardId);
    expect(new Set(ids).size).toBe(3);
  });

  it('position indices are sequential', () => {
    const drawn = drawCards(spread3);
    expect(drawn.map(c => c.positionIndex)).toEqual([0, 1, 2]);
  });

  it('card ids are valid (exist in deck)', () => {
    const drawn = drawCards(spread3);
    drawn.forEach(c => {
      expect(c.cardId).toMatch(/^(major-\d{2}-[a-z-]+|(wands|cups|swords|pentacles)-\d{2}(-[a-z]+)?)$/);
    });
  });

  it('reversedProbability 0 means no reversed cards', () => {
    const drawn = drawCards(spread3, { reversedProbability: 0 });
    drawn.forEach(c => expect(c.isReversed).toBe(false));
  });

  it('reversedProbability 1 means all reversed', () => {
    const drawn = drawCards(spread3, { reversedProbability: 1 });
    drawn.forEach(c => expect(c.isReversed).toBe(true));
  });

  it('performReading produces valid ReadingResult', () => {
    const result = performReading(spread3, 'تست پرسش');
    expect(result.spreadId).toBe('past-present-future');
    expect(result.question).toBe('تست پرسش');
    expect(result.drawnCards).toHaveLength(3);
    expect(result.createdAt).toBeTruthy();
    expect(result.version).toBe('1.0.0');
  });

  it('two readings are different (with high probability)', () => {
    const r1 = performReading(spread3, 'q');
    const r2 = performReading(spread3, 'q');
    const ids1 = r1.drawnCards.map(c => c.cardId).join(',');
    const ids2 = r2.drawnCards.map(c => c.cardId).join(',');
    // احتمال یکسان بودن بسیار کم است
    expect(ids1 === ids2 && r1.drawnCards[0].isReversed === r2.drawnCards[0].isReversed).toBe(false);
  });
});