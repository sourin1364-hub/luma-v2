import { describe, it, expect } from 'vitest';
import { CUPS_CARDS, getCupsCards } from '@/engines/tarot';

describe('Cups cards', () => {
  it('has exactly 14 cards', () => {
    expect(CUPS_CARDS).toHaveLength(14);
  });

  it('cards are numbered 1 to 14', () => {
    const numbers = CUPS_CARDS.map(c => c.number).sort((a, b) => a - b);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it('all cards are minor arcana', () => {
    CUPS_CARDS.forEach(card => {
      expect(card.arcana).toBe('minor');
      expect(card.suit).toBe('cups');
    });
  });

  it('all cards have unique ids', () => {
    const ids = CUPS_CARDS.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(14);
  });

  it('all cards have valid image paths', () => {
    CUPS_CARDS.forEach(card => {
      expect(card.imagePath).toMatch(/^\/assets\/tarot\/cards\/cups-\d{2}(-[a-z]+)?\.webp$/);
    });
  });

  it('all cards have water element', () => {
    CUPS_CARDS.forEach(card => {
      expect(card.element).toBe('water');
    });
  });

  it('Ace of Cups is card 1', () => {
    const ace = CUPS_CARDS.find(c => c.number === 1);
    expect(ace!.nameEn).toBe('Ace of Cups');
    expect(ace!.nameFa).toBe('آس جام');
  });

  it('King of Cups is card 14', () => {
    const king = CUPS_CARDS.find(c => c.number === 14);
    expect(king!.nameEn).toBe('King of Cups');
    expect(king!.nameFa).toBe('شاه جام');
  });

  it('getCupsCards returns a copy', () => {
    const copy = getCupsCards();
    copy.push(copy[0]);
    expect(CUPS_CARDS).toHaveLength(14);
  });
});