import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../../components/ui/PageHeader';
import { ZODIAC_DETAILS } from '../../engines/astronomy/constants';
import { BIRTHSTONES } from '../../engines/birthstone';
import type { BirthstoneDetail } from '../../engines/birthstone/data';
import { X } from 'lucide-react';

const ZODIAC_ICONS: Record<string, string> = {
  aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer',
  leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio',
  sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces'
};

const ZODIAC_BIRTHSTONE: Record<string, string> = {
  aries: 'aquamarine', taurus: 'diamond', gemini: 'emerald', cancer: 'pearl',
  leo: 'ruby', virgo: 'peridot', libra: 'sapphire', scorpio: 'opal',
  sagittarius: 'topaz', capricorn: 'turquoise', aquarius: 'garnet', pisces: 'amethyst'
};

const ELEMENT_COLORS: Record<string, string> = {
  fire: '#EF4444', earth: '#10B981', air: '#3B82F6', water: '#8B5CF6'
};

const ELEMENT_NAMES_FA: Record<string, string> = {
  fire: 'آتش', earth: 'خاک', air: 'هوا', water: 'آب'
};

interface ZodiacScreenProps {
  onBack: () => void;
}

export function ZodiacScreen({ onBack }: ZodiacScreenProps) {
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
  const [selectedStone, setSelectedStone] = useState<BirthstoneDetail | null>(null);

  const signs = Object.values(ZODIAC_DETAILS);

  const getBirthstone = (signName: string): BirthstoneDetail | undefined => {
    const stoneEn = ZODIAC_BIRTHSTONE[signName];
    if (!stoneEn) return undefined;
    return BIRTHSTONES.find(b => b.nameEn.toLowerCase() === stoneEn);
  };

  const zodiacDetail = selectedZodiac
    ? ZODIAC_DETAILS[selectedZodiac as keyof typeof ZODIAC_DETAILS]
    : null;

  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="space-y-5">
      <PageHeader title="زودیاک ماه‌ها" subtitle="۱۲ برج غربی و سنگ ماه تولد" onBack={onBack} />

      <div className="grid grid-cols-2 gap-3">
        {signs.map((sign) => {
          const birthstone = getBirthstone(sign.name);
          const elementColor = ELEMENT_COLORS[sign.element] || '#888';
          const iconName = ZODIAC_ICONS[sign.name] || 'Aries';
          const stoneImage = birthstone ? birthstone.nameEn.toLowerCase() : null;

          return (
            <div
              key={sign.name}
              className="bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] rounded-2xl p-4 transition-all duration-200"
            >
              <button
                onClick={() => setSelectedZodiac(sign.name)}
                className="w-full text-right hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={`${baseUrl}icons/zodiac/${iconName}.svg`}
                    alt={sign.nameFa}
                    className="w-10 h-10 zodiac-icon"
                  />
                  <h3 className="font-heading text-sm text-[var(--luma-text)]">{sign.nameFa}</h3>
                </div>
                <p className="text-[10px] text-[var(--luma-text-subtle)] mb-1 text-justify">{sign.dateRange}</p>
                <p className="text-[9px] text-[var(--luma-text-muted)] mb-1 text-justify">ماه شمسی: {sign.shamsiMonth}</p>
                {birthstone && (
                  <p className="text-[9px] text-[var(--luma-text-subtle)] mb-1 text-justify">({birthstone.shamsiRange})</p>
                )}
                <p className="text-[10px] text-[var(--luma-text-muted)] mb-1 text-justify">
                  عنصر: <span style={{ color: elementColor }}>{sign.elementFa}</span>
                </p>
                <p className="text-[9px] text-[var(--luma-gold)]">جزئیات برج ←</p>
              </button>

              {birthstone && stoneImage && (
                <button
                  onClick={() => setSelectedStone(birthstone)}
                  className="mt-2 pt-2 border-t border-[var(--luma-border)] w-full text-right hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`${baseUrl}icons/birthstones/${stoneImage}.png`}
                      alt={birthstone.nameFa}
                      className="w-8 h-8 rounded-full object-cover border border-[var(--luma-gold)]/40 bg-[var(--luma-bg-subtle)]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[var(--luma-text-muted)] text-justify">
                        💎 سنگ: {birthstone.nameFa}
                      </p>
                      <p className="text-[9px] text-[var(--luma-gold)]">جزئیات سنگ ←</p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* مودال اطلاعات برج */}
      <AnimatePresence>
        {zodiacDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedZodiac(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md bg-[var(--luma-bg-elevated)] rounded-2xl p-5 max-h-[85vh] overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`${baseUrl}icons/zodiac/${ZODIAC_ICONS[zodiacDetail.name]}.svg`}
                    alt={zodiacDetail.nameFa}
                    className="w-16 h-16 zodiac-icon"
                  />
                  <div>
                    <h2 className="font-heading text-lg text-[var(--luma-text)]">{zodiacDetail.nameFa}</h2>
                    <p className="text-xs text-[var(--luma-text-muted)]" dir="ltr">{zodiacDetail.nameEn}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedZodiac(null)}
                  className="p-1.5 rounded-full hover:bg-[var(--luma-bg-subtle)]"
                  aria-label="بستن"
                >
                  <X className="w-4 h-4 text-[var(--luma-text-muted)]" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-justify">
                  <span className="text-[var(--luma-text-muted)]">تاریخ:</span>
                  <span className="text-[var(--luma-text)]">{zodiacDetail.dateRange}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-justify">
                  <span className="text-[var(--luma-text-muted)]">ماه شمسی:</span>
                  <span className="text-[var(--luma-text)]">{zodiacDetail.shamsiMonth}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-justify">
                  <span className="text-[var(--luma-text-muted)]">عنصر:</span>
                  <span style={{ color: ELEMENT_COLORS[zodiacDetail.element] }}>{zodiacDetail.elementFa}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-justify">
                  <span className="text-[var(--luma-text-muted)]">سیاره حاکم:</span>
                  <span className="text-[var(--luma-text)]">{zodiacDetail.rulingPlanetFa}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-justify">
                  <span className="text-[var(--luma-text-muted)]">کیفیت:</span>
                  <span className="text-[var(--luma-text)]">{zodiacDetail.modalityFa}</span>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">توضیحات:</p>
                  <p className="text-sm text-[var(--luma-text)] leading-relaxed text-justify">{zodiacDetail.description}</p>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">ویژگی‌ها:</p>
                  <div className="flex flex-wrap gap-1 text-justify">
                    {zodiacDetail.traits.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">نقاط قوت:</p>
                  <p className="text-xs text-green-400 text-justify">{zodiacDetail.strengths.join(' • ')}</p>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">نقاط ضعف:</p>
                  <p className="text-xs text-amber-400 text-justify">{zodiacDetail.weaknesses.join(' • ')}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--luma-border)] text-xs text-justify">
                  <div>
                    <span className="text-[var(--luma-text-muted)]">رنگ خوش‌شانسی: </span>
                    <span className="text-[var(--luma-text)]">{zodiacDetail.luckyColor}</span>
                  </div>
                  <div>
                    <span className="text-[var(--luma-text-muted)]">عدد خوش‌شانسی: </span>
                    <span className="text-[var(--luma-text)]">{zodiacDetail.luckyNumber}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مودال اطلاعات سنگ */}
      <AnimatePresence>
        {selectedStone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedStone(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md bg-[var(--luma-bg-elevated)] rounded-2xl p-5 max-h-[85vh] overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`${baseUrl}icons/birthstones/${selectedStone.nameEn.toLowerCase()}.png`}
                    alt={selectedStone.nameFa}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--luma-gold)]/40"
                  />
                  <div>
                    <h2 className="font-heading text-lg text-[var(--luma-text)]">{selectedStone.nameFa}</h2>
                    <p className="text-xs text-[var(--luma-text-muted)]" dir="ltr">{selectedStone.nameEn}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStone(null)}
                  className="p-1.5 rounded-full hover:bg-[var(--luma-bg-subtle)]"
                  aria-label="بستن"
                >
                  <X className="w-4 h-4 text-[var(--luma-text-muted)]" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-justify">
                  <span className="text-[var(--luma-text-muted)]">رنگ:</span>
                  <span className="text-[var(--luma-text)]">{selectedStone.color}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-justify">
                  <span className="text-[var(--luma-text-muted)]">ماه شمسی:</span>
                  <span className="text-[var(--luma-text)]">{selectedStone.shamsiRange}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-justify">
                  <span className="text-[var(--luma-text-muted)]">عنصر:</span>
                  <span style={{ color: ELEMENT_COLORS[selectedStone.element] }}>
                    {ELEMENT_NAMES_FA[selectedStone.element]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-justify">
                  <span className="text-[var(--luma-text-muted)]">چاکرا:</span>
                  <span className="text-[var(--luma-text)]">{selectedStone.chakra}</span>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">معنی نمادین:</p>
                  <p className="text-sm text-[var(--luma-text)] leading-relaxed text-justify">{selectedStone.meaning}</p>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">تفسیر استرولوژیکی:</p>
                  <p className="text-sm text-[var(--luma-text)] leading-relaxed text-justify">{selectedStone.astrologyMeaning}</p>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">سنگ خوش‌شانسی برای:</p>
                  <p className="text-sm text-[var(--luma-gold)] text-justify">{selectedStone.luckyFor}</p>
                  {selectedStone.alternativeStones.length > 0 && (
                    <div className="pt-3 border-t border-[var(--luma-border)]">
                      <p className="text-xs text-[var(--luma-text-muted)] mb-1">سنگ‌های جایگزین این ماه:</p>
                      <div className="flex flex-wrap gap-1 text-justify">
                        {selectedStone.alternativeStones.map((alt, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]">{alt}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
