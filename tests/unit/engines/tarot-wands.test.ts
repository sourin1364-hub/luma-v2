import { describe, it, expect } from 'vitest';
import { WANDS_CARDS, getWandsCards } from '@/engines/tarot';

describe('Wands cards', () => {
  it('has exactly 14 cards', () => {
    expect(WANDS_CARDS).toHaveLength(14);
  });

  it('cards are numbered 1 to 14', () => {
    const numbers = WANDS_CARDS.map(c => c.number).sort((a, b) => a - b);
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it('all cards are minor arcana', () => {
    WANDS_CARDS.forEach(card => {
      expect(card.arcana).toBe('minor');
      expect(card.suit).toBe('wands');
    });
  });

  it('all cards have unique ids', () => {
    const ids = WANDS_CARDS.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(14);
  });

  it('all cards have valid image paths', () => {
    WANDS_CARDS.forEach(card => {
      expect(card.imagePath).toMatch(/^\/assets\/tarot\/cards\/wands-\d{2}(-[a-z]+)?\.webp$/);
    });
  });

  it('all cards have upright and reversed meanings', () => {
    WANDS_CARDS.forEach(card => {
      expect(card.upright.meaning).toBeTruthy();
      expect(card.reversed.meaning).toBeTruthy();
      expect(card.upright.meaning.length).toBeGreaterThan(20);
      expect(card.reversed.meaning.length).toBeGreaterThan(20);
    });
  });

  it('all cards have fire element', () => {
    WANDS_CARDS.forEach(card => {
      expect(card.element).toBe('fire');
    });
  });

  it('Ace of Wands is card 1', () => {
    const ace = WANDS_CARDS.find(c => c.number === 1);
    expect(ace!.nameEn).toBe('Ace of Wands');
    expect(ace!.nameFa).toBe('آس چوبدست');
  });

  it('King of Wands is card 14', () => {
    const king = WANDS_CARDS.find(c => c.number === 14);
    expect(king!.nameEn).toBe('King of Wands');
    expect(king!.nameFa).toBe('شاه چوبدست');
  });

  it('getWandsCards returns a copy', () => {
    const copy = getWandsCards();
    copy.push(copy[0]);
    expect(WANDS_CARDS).toHaveLength(14);
  });
});