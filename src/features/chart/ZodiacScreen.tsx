import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../../components/ui/PageHeader';
import { ZODIAC_DETAILS } from '../../engines/astronomy/constants';
import { BIRTHSTONES } from '../../engines/birthstone';
import type { BirthstoneDetail } from '../../engines/birthstone/data';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLanguageStore, UI_TRANSLATIONS, type TranslationKey } from '../../i18n/useLanguageStore';

const ZODIAC_ICONS: Record<string, string> = {
  aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer',
  leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio',
  sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces'
};

const ZODIAC_MONTHS: Record<string, number[]> = {
  aries: [3, 4], taurus: [4, 5], gemini: [5, 6], cancer: [6, 7],
  leo: [7, 8], virgo: [8, 9], libra: [9, 10], scorpio: [10, 11],
  sagittarius: [11, 12], capricorn: [12, 1], aquarius: [1, 2], pisces: [2, 3],
};

const ELEMENT_COLORS: Record<string, string> = { fire: '#EF4444', earth: '#10B981', air: '#3B82F6', water: '#8B5CF6' };

export function ZodiacScreen({ onBack }: { onBack: () => void }) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
  const [selectedStone, setSelectedStone] = useState<BirthstoneDetail | null>(null);

  const signs = Object.values(ZODIAC_DETAILS);

  const getBirthstones = (signName: string): BirthstoneDetail[] => {
    const months = ZODIAC_MONTHS[signName] || [];
    return months
      .map((month) => BIRTHSTONES.find((stone) => stone.month === month))
      .filter((stone): stone is BirthstoneDetail => Boolean(stone));
  };

  const zodiacDetail = selectedZodiac ? ZODIAC_DETAILS[selectedZodiac as keyof typeof ZODIAC_DETAILS] : null;
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="space-y-5">
      <PageHeader title={t.zodiac_title} subtitle={t.zodiac_subtitle} onBack={onBack} />
      <div className="grid grid-cols-2 gap-3">
        {signs.map((sign) => {
          const birthstones = getBirthstones(sign.name);
          const elementColor = ELEMENT_COLORS[sign.element] || '#888';
          const iconName = ZODIAC_ICONS[sign.name] || 'Aries';
          return (
            <div key={sign.name} className="bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] rounded-2xl p-4 transition-all duration-200">
              <button onClick={() => setSelectedZodiac(sign.name)} className="w-full text-right hover:opacity-80 transition-opacity">
                <div className="flex items-center gap-2 mb-2">
                  <img src={`${baseUrl}icons/zodiac/${iconName}.svg`} alt={sign.nameFa} className="w-10 h-10 zodiac-icon" />
                  <h3 className="font-heading text-sm text-[var(--luma-text)]">{t[`chart_zodiac_${sign.name}` as TranslationKey] || sign.nameFa}</h3>
                </div>
                <p className="text-[10px] text-[var(--luma-text-subtle)] mb-1 text-justify">{sign.dateRange[lang]}</p>
                <p className="text-[10px] text-[var(--luma-text-muted)] mb-1 text-justify">{t.zodiac_element} <span style={{ color: elementColor }}>{t[`chart_el_${sign.element}` as TranslationKey] || sign.elementFa}</span></p>
                <p className="text-[9px] text-[var(--luma-gold)]">{t.zodiac_details} ←</p>
              </button>
              {birthstones.length > 0 && (
                <div className="mt-2 space-y-1.5 border-t border-[var(--luma-border)] pt-2">
                  <p className="text-[9px] text-[var(--luma-text-subtle)]">{t.zodiac_stones}</p>
                  {birthstones.map((birthstone) => (
                    <button
                      key={birthstone.month}
                      onClick={() => setSelectedStone(birthstone)}
                      className="flex w-full items-center gap-2 rounded-lg py-1 text-start hover:bg-[var(--luma-bg-subtle)]"
                    >
                      <img src={`${baseUrl}icons/birthstones/${birthstone.nameEn.toLowerCase()}.png`} alt="" className="h-7 w-7 rounded-full border border-[var(--luma-gold)]/40 bg-[var(--luma-bg-subtle)] object-cover" />
                      <span className="min-w-0 flex-1 truncate text-[10px] text-[var(--luma-text-muted)]">
                        {t[`bs_${birthstone.month}_name` as TranslationKey] || birthstone.nameFa}
                      </span>
                      <span className="text-[9px] text-[var(--luma-gold)]">{t.zodiac_stone_details}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {createPortal(
        <AnimatePresence>
          {zodiacDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop bg-black/70" onClick={() => setSelectedZodiac(null)}>
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} transition={{ type: 'spring', damping: 25 }} className="modal-panel w-full max-w-md bg-[var(--luma-bg-elevated)] rounded-2xl p-5 no-scrollbar" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={`${baseUrl}icons/zodiac/${ZODIAC_ICONS[zodiacDetail.name]}.svg`} alt={zodiacDetail.nameFa} className="w-16 h-16 zodiac-icon" />
                  <div>
                    <h2 className="font-heading text-lg text-[var(--luma-text)]">{t[`chart_zodiac_${zodiacDetail.name}` as TranslationKey] || zodiacDetail.nameFa}</h2>
                    <p className="text-xs text-[var(--luma-text-muted)]" dir="ltr">{zodiacDetail.nameEn}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedZodiac(null)} className="p-1.5 rounded-full hover:bg-[var(--luma-bg-subtle)]"><X className="w-4 h-4 text-[var(--luma-text-muted)]" /></button>
              </div>
              <div className="space-y-3 text-justify">
                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">{t.zodiac_description}</p>
                  <p className="text-sm text-[var(--luma-text)] leading-relaxed">{t[`zod_${zodiacDetail.name}_desc` as TranslationKey] || zodiacDetail.description[lang]}</p>
                </div>
                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">{t.zodiac_traits}</p>
                  <div className="flex flex-wrap gap-1">
                    {(t[`zod_${zodiacDetail.name}_traits` as TranslationKey] || zodiacDetail.traits[lang].join(', ')).split(/[،,]/).map((trait, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]">{trait}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">{t.zodiac_strengths}</p>
                  <p className="text-xs text-green-400">{t[`zod_${zodiacDetail.name}_str` as TranslationKey] || zodiacDetail.strengths[lang].join(' • ')}</p>
                </div>
                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">{t.zodiac_weaknesses}</p>
                  <p className="text-xs text-amber-400">{t[`zod_${zodiacDetail.name}_weak` as TranslationKey] || zodiacDetail.weaknesses[lang].join(' • ')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {selectedStone && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop bg-black/70" onClick={() => setSelectedStone(null)}>
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} transition={{ type: 'spring', damping: 25 }} className="modal-panel w-full max-w-md bg-[var(--luma-bg-elevated)] rounded-2xl p-5 no-scrollbar" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={`${baseUrl}icons/birthstones/${selectedStone.nameEn.toLowerCase()}.png`} alt={selectedStone.nameFa} className="w-16 h-16 rounded-full object-cover border-2 border-[var(--luma-gold)]/40" />
                  <div>
                    <h2 className="font-heading text-lg text-[var(--luma-text)]">{t[`bs_${selectedStone.month}_name`] || selectedStone.nameFa}</h2>
                    <p className="text-xs text-[var(--luma-text-muted)]" dir="ltr">{selectedStone.nameEn}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStone(null)} className="p-1.5 rounded-full hover:bg-[var(--luma-bg-subtle)]"><X className="w-4 h-4 text-[var(--luma-text-muted)]" /></button>
              </div>
              <div className="space-y-3 text-justify">
                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">{t.zodiac_stone_meaning}</p>
                  <p className="text-sm text-[var(--luma-text)] leading-relaxed">{t[`bs_${selectedStone.month}_meaning`] || selectedStone.meaning}</p>
                </div>
                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">{t.zodiac_stone_astrology}</p>
                  <p className="text-sm font-normal text-[var(--luma-text)] leading-relaxed">{t[`bs_${selectedStone.month}_astro` as TranslationKey] || selectedStone.astrologyMeaning}</p>
                </div>
                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">{t.zodiac_stone_lucky}</p>
                  <p className="text-sm font-normal text-[var(--luma-gold)]">{t[`bs_${selectedStone.month}_lucky` as TranslationKey] || selectedStone.luckyFor}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}