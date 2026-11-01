import { describe, it, expect } from 'vitest';
import { PENTACLES_CARDS, getPentaclesCards } from '@/engines/tarot';

describe('Pentacles cards', () => {
  it('has exactly 14 cards', () => {
    expect(PENTACLES_CARDS).toHaveLength(14);
  });

  it('cards are numbered 1 to 14', () => {
    const numbers = PENTACLES_CARDS.map(c => c.number).sort((a, b) => a - b);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it('all cards are minor arcana', () => {
    PENTACLES_CARDS.forEach(card => {
      expect(card.arcana).toBe('minor');
      expect(card.suit).toBe('pentacles');
    });
  });

  it('all cards have unique ids', () => {
    const ids = PENTACLES_CARDS.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(14);
  });

  it('all cards have valid image paths', () => {
    PENTACLES_CARDS.forEach(card => {
      expect(card.imagePath).toMatch(/^\/assets\/tarot\/cards\/pentacles-\d{2}(-[a-z]+)?\.webp$/);
    });
  });

  it('all cards have earth element', () => {
    PENTACLES_CARDS.forEach(card => {
      expect(card.element).toBe('earth');
    });
  });

  it('Ace of Pentacles is card 1', () => {
    const ace = PENTACLES_CARDS.find(c => c.number === 1);
    expect(ace!.nameEn).toBe('Ace of Pentacles');
    expect(ace!.nameFa).toBe('آس سکه');
  });

  it('King of Pentacles is card 14', () => {
    const king = PENTACLES_CARDS.find(c => c.number === 14);
    expect(king!.nameEn).toBe('King of Pentacles');
    expect(king!.nameFa).toBe('شاه سکه');
  });

  it('getPentaclesCards returns a copy', () => {
    const copy = getPentaclesCards();
    copy.push(copy[0]);
    expect(PENTACLES_CARDS).toHaveLength(14);
  });
});