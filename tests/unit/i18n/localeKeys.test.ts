import { describe, expect, it } from 'vitest';
import { translateNodeText, UI_TRANSLATIONS } from '../../../src/i18n/useLanguageStore';
import { SPREADS } from '../../../src/engines/tarot/spreads';

describe('locale dictionaries', () => {
  it('provide the same UI keys in every supported language', () => {
    const expectedKeys = Object.keys(UI_TRANSLATIONS.fa).sort();

    for (const language of ['en', 'ar', 'ckb'] as const) {
      expect(Object.keys(UI_TRANSLATIONS[language]).sort()).toEqual(expectedKeys);
    }
  });

  it('provide translated labels for the cosmic calendar and tarot results', () => {
    const keys = [
      'cosmic_calendar_title',
      'cosmic_calendar_subtitle',
      'cosmic_calendar_illumination',
      'cosmic_calendar_live_positions',
      'tarot_result_dominant_element',
      'tarot_result_dominant_suit',
      'tarot_result_energy_score',
      'tarot_result_card_analysis',
    ] as const;

    for (const language of ['fa', 'en', 'ar', 'ckb'] as const) {
      for (const key of keys) {
        expect(UI_TRANSLATIONS[language][key]).toBeTruthy();
      }
    }
  });

  it('translates every tarot spread description in supported non-Persian languages', () => {
    for (const language of ['en', 'ar', 'ckb'] as const) {
      for (const spread of SPREADS) {
        expect(translateNodeText(spread.nameFa, language)).not.toBe(spread.nameFa);
        expect(translateNodeText(spread.description, language)).not.toBe(spread.description);
      }
    }
  });

  it('translates the free daily-card position name and description', () => {
    const dailyPosition = SPREADS.find((spread) => spread.id === 'daily-card')!.positions[0];
    for (const language of ['en', 'ar', 'ckb'] as const) {
      expect(translateNodeText(dailyPosition.nameFa, language)).not.toBe(dailyPosition.nameFa);
      expect(translateNodeText(dailyPosition.description, language)).not.toBe(dailyPosition.description);
    }
  });
});
