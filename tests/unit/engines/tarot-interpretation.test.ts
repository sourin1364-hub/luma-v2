import { describe, it, expect } from 'vitest';
import { interpretReading, performReading, getSpreadById } from '@/engines/tarot';

describe('Tarot interpretation', () => {
  it('produces valid interpretation for single-card reading', () => {
    const spread = getSpreadById('single-card')!;
    const reading = performReading(spread, 'تست');
    const interp = interpretReading(reading);

    expect(interp.summary).toBeTruthy();
    expect(interp.cards).toHaveLength(1);
    expect(interp.advice).toBeTruthy();
    expect(['positive', 'neutral', 'challenging']).toContain(interp.energy);
  });

  it('produces valid interpretation for 3-card reading', () => {
    const spread = getSpreadById('past-present-future')!;
    const reading = performReading(spread, 'تست');
    const interp = interpretReading(reading);

    expect(interp.cards).toHaveLength(3);
    expect(interp.summary).toContain('گذشته');
    expect(interp.cards[0].positionName).toBe('گذشته');
    expect(interp.cards[1].positionName).toBe('حال');
    expect(interp.cards[2].positionName).toBe('آینده');
  });

  it('each card has meaning and keywords', () => {
    const spread = getSpreadById('past-present-future')!;
    const reading = performReading(spread, 'تست');
    const interp = interpretReading(reading);

    interp.cards.forEach(card => {
      expect(card.meaning).toBeTruthy();
      expect(card.keywords.length).toBeGreaterThan(0);
      expect(card.card).toBeDefined();
    });
  });

  it('works with all 6 spreads', () => {
    const spreadIds = [
      'daily-card', 'single-card', 'past-present-future',
      'situation-obstacle-advice', 'mind-heart-action', 'yes-no'
    ];
    spreadIds.forEach(id => {
      const spread = getSpreadById(id)!;
      const reading = performReading(spread, 'تست');
      const interp = interpretReading(reading);
      expect(interp.summary).toBeTruthy();
      expect(interp.cards).toHaveLength(spread.cardCount);
    });
  });

  it('throws on invalid spread id', () => {
    expect(() => interpretReading({
      spreadId: 'nonexistent',
      question: '',
      drawnCards: [],
      createdAt: '',
      version: '1.0.0'
    })).toThrow();
  });
});