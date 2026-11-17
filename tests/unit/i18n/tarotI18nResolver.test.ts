import { describe, expect, it } from 'vitest';
import {
  getLocalizedCardMeaning,
  getLocalizedCardName,
  getLocalizedKeywords,
} from '../../../src/features/tarot/tarotI18nResolver';

const card = {
  id: 'major-00-fool',
  nameFa: 'احمق',
  nameEn: 'The Fool',
  upright: { meaning: 'معنی مستقیم', keywords: ['شروع تازه'] },
  reversed: { meaning: 'معنی معکوس', keywords: ['تعلل'] },
};

describe('tarot localization resolver', () => {
  it('reads nested card meanings for the Persian daily-card content', () => {
    expect(getLocalizedCardMeaning(card, false, 'fa')).toBe('معنی مستقیم');
    expect(getLocalizedCardMeaning(card, true, 'fa')).toBe('معنی معکوس');
  });

  it('matches padded major-arcana IDs to localized names', () => {
    expect(getLocalizedCardName(card, 'ckb')).toBe('شێت (دەستپێکی نوێ)');
    expect(getLocalizedCardName(card, 'ar')).toBe('الأحمق (بداية جديدة)');
  });

  it('returns localized meanings and keywords for major arcana', () => {
    expect(getLocalizedCardMeaning(card, false, 'en')).toContain('new beginning');
    expect(getLocalizedKeywords(card, 'en')).toEqual([
      'New Beginnings',
      'Innocence',
      'Spontaneity',
      'Free Spirit',
    ]);
  });
});
