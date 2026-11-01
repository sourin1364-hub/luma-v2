import { describe, it, expect } from 'vitest';
import { MAJOR_ARCANA, getMajorCard, getAllMajorCards } from '@/engines/tarot';

describe('Major Arcana', () => {
  it('has exactly 22 cards', () => {
    expect(MAJOR_ARCANA).toHaveLength(22);
  });

  it('cards are numbered 0 to 21', () => {
    const numbers = MAJOR_ARCANA.map(c => c.number).sort((a, b) => a - b);
    expect(numbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);
  });

  it('all cards have unique ids', () => {
    const ids = MAJOR_ARCANA.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(22);
  });

  it('all cards have valid image paths', () => {
    MAJOR_ARCANA.forEach(card => {
      expect(card.imagePath).toMatch(/^\/assets\/tarot\/cards\/major-\d{2}-[a-z-]+\.webp$/);
    });
  });

  it('all cards have Persian and English names', () => {
    MAJOR_ARCANA.forEach(card => {
      expect(card.nameFa).toBeTruthy();
      expect(card.nameEn).toBeTruthy();
      expect(card.nameFa.length).toBeGreaterThan(0);
    });
  });

  it('all cards have upright and reversed meanings', () => {
    MAJOR_ARCANA.forEach(card => {
      expect(card.upright.meaning).toBeTruthy();
      expect(card.reversed.meaning).toBeTruthy();
      expect(card.upright.meaning.length).toBeGreaterThan(20);
      expect(card.reversed.meaning.length).toBeGreaterThan(20);
    });
  });

  it('all cards have keywords', () => {
    MAJOR_ARCANA.forEach(card => {
      expect(card.keywords.length).toBeGreaterThanOrEqual(3);
      expect(card.upright.keywords.length).toBeGreaterThanOrEqual(2);
      expect(card.reversed.keywords.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('getMajorCard returns correct card by id', () => {
    const fool = getMajorCard('major-00-fool');
    expect(fool).toBeDefined();
    expect(fool!.nameEn).toBe('The Fool');
    expect(fool!.number).toBe(0);
  });

  it('getMajorCard returns undefined for non-existent id', () => {
    expect(getMajorCard('major-99-nonexistent')).toBeUndefined();
  });

  it('getAllMajorCards returns a copy (not the original array)', () => {
    const copy = getAllMajorCards();
    copy.push(copy[0]);
    expect(MAJOR_ARCANA).toHaveLength(22);
  });

  it('The Fool is card 0', () => {
    const fool = MAJOR_ARCANA.find(c => c.id === 'major-00-fool');
    expect(fool!.number).toBe(0);
    expect(fool!.nameFa).toBe('احمق');
  });

  it('The World is card 21', () => {
    const world = MAJOR_ARCANA.find(c => c.id === 'major-21-world');
    expect(world!.number).toBe(21);
    expect(world!.nameFa).toBe('جهان');
  });
});