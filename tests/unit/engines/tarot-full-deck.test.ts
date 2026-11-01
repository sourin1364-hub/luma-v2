import { describe, it, expect } from 'vitest';
import { ALL_TAROT_CARDS, getCardById } from '@/engines/tarot';

describe('Full Tarot Deck (78 cards)', () => {
  it('has exactly 78 cards', () => {
    expect(ALL_TAROT_CARDS).toHaveLength(78);
  });

  it('all cards have unique ids', () => {
    const ids = ALL_TAROT_CARDS.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(78);
  });

  it('has 22 Major Arcana cards', () => {
    const majors = ALL_TAROT_CARDS.filter(c => c.arcana === 'major');
    expect(majors).toHaveLength(22);
  });

  it('has 56 Minor Arcana cards', () => {
    const minors = ALL_TAROT_CARDS.filter(c => c.arcana === 'minor');
    expect(minors).toHaveLength(56);
  });

  it('has 14 cards per suit', () => {
    expect(ALL_TAROT_CARDS.filter(c => c.suit === 'wands')).toHaveLength(14);
    expect(ALL_TAROT_CARDS.filter(c => c.suit === 'cups')).toHaveLength(14);
    expect(ALL_TAROT_CARDS.filter(c => c.suit === 'swords')).toHaveLength(14);
    expect(ALL_TAROT_CARDS.filter(c => c.suit === 'pentacles')).toHaveLength(14);
  });

  it('every card has complete data', () => {
    ALL_TAROT_CARDS.forEach(card => {
      expect(card.id).toBeTruthy();
      expect(card.nameEn).toBeTruthy();
      expect(card.nameFa).toBeTruthy();
      expect(card.imagePath).toBeTruthy();
      expect(card.upright.meaning).toBeTruthy();
      expect(card.reversed.meaning).toBeTruthy();
      expect(card.keywords.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('getCardById works for all 78 cards', () => {
    ALL_TAROT_CARDS.forEach(card => {
      const found = getCardById(card.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(card.id);
    });
  });
});