import { describe, it, expect } from 'vitest';
import { SWORDS_CARDS, getSwordsCards } from '@/engines/tarot';

describe('Swords cards', () => {
  it('has exactly 14 cards', () => {
    expect(SWORDS_CARDS).toHaveLength(14);
  });

  it('cards are numbered 1 to 14', () => {
    const numbers = SWORDS_CARDS.map(c => c.number).sort((a, b) => a - b);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it('all cards are minor arcana', () => {
    SWORDS_CARDS.forEach(card => {
      expect(card.arcana).toBe('minor');
      expect(card.suit).toBe('swords');
    });
  });

  it('all cards have unique ids', () => {
    const ids = SWORDS_CARDS.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(14);
  });

  it('all cards have valid image paths', () => {
    SWORDS_CARDS.forEach(card => {
      expect(card.imagePath).toMatch(/^\/assets\/tarot\/cards\/swords-\d{2}(-[a-z]+)?\.webp$/);
    });
  });

  it('all cards have air element', () => {
    SWORDS_CARDS.forEach(card => {
      expect(card.element).toBe('air');
    });
  });

  it('Ace of Swords is card 1', () => {
    const ace = SWORDS_CARDS.find(c => c.number === 1);
    expect(ace!.nameEn).toBe('Ace of Swords');
    expect(ace!.nameFa).toBe('آس شمشیر');
  });

  it('King of Swords is card 14', () => {
    const king = SWORDS_CARDS.find(c => c.number === 14);
    expect(king!.nameEn).toBe('King of Swords');
    expect(king!.nameFa).toBe('شاه شمشیر');
  });

  it('getSwordsCards returns a copy', () => {
    const copy = getSwordsCards();
    copy.push(copy[0]);
    expect(SWORDS_CARDS).toHaveLength(14);
  });
});