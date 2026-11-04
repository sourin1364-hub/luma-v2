import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_TAROT_CARDS } from '../../engines/tarot';
import type { TarotCard, SpreadPosition } from '../../engines/tarot/types';
import { getAssetUrl } from '../../utils/assetPath';
import { Sparkles, Loader2 } from 'lucide-react';

interface TarotCardDeckProps {
  spreadId?: string;
  positions?: SpreadPosition[];
  cards?: TarotCard[];
  selected?: string[];
  cardCount?: number;
  shuffleKey?: number;
  onCardSelect?: (id: string) => void;
}

/**
 * مختصات هندسی واقعی (درصد X و Y و زاویه چرخش) برای چیدمان‌های مختلف تاروت
 * تا کارت‌های انتخاب‌شده دقیقاً به شکل همان فال (صلیب سلتیک، نعل اسب و...) روی میز قرار بگیرند.
 */
function getSpreadSlotCoords(
  spreadId: string,
  index: number,
  total: number
): { left: string; top: string; rotate?: number } {
  if (spreadId === 'celtic-cross') {
    const celticCoords: { left: string; top: string; rotate?: number }[] = [
      { left: '62%', top: '48%', rotate: 0 },   // 1. مرکز صلیب
      { left: '62%', top: '48%', rotate: 90 },  // 2. کارت متقاطع افقی روی کارت اول
      { left: '62%', top: '82%' },              // 3. پایین صلیب (ریشه)
      { left: '84%', top: '48%' },              // 4. راست صلیب (گذشته)
      { left: '62%', top: '14%' },              // 5. بالای صلیب (هدف)
      { left: '40%', top: '48%' },              // 6. چپ صلیب (آینده نزدیک)
      { left: '16%', top: '84%' },              // 7. ستون کنار - کارت اول از پایین
      { left: '16%', top: '60%' },              // 8. ستون کنار - کارت دوم
      { left: '16%', top: '36%' },              // 9. ستون کنار - کارت سوم
      { left: '16%', top: '12%' },              // 10. ستون کنار - راس (نتیجه نهایی)
    ];
    return celticCoords[index] || { left: '50%', top: '50%' };
  }

  if (spreadId === 'horseshoe' || spreadId === 'weekly') {
    // شکل هندسی نعل اسب (قوس ۷ کارتی)
    const horseshoeCoords = [
      { left: '12%', top: '78%', rotate: -18 },
      { left: '20%', top: '46%', rotate: -10 },
      { left: '34%', top: '22%', rotate: -4 },
      { left: '50%', top: '14%', rotate: 0 },
      { left: '66%', top: '22%', rotate: 4 },
      { left: '80%', top: '46%', rotate: 10 },
      { left: '88%', top: '78%', rotate: 18 },
    ];
    return horseshoeCoords[index] || { left: '50%', top: '50%' };
  }

  if (spreadId === 'relationship' || spreadId === 'career') {
    // چیدمان هندسی صلیب ۵ کارتی رابطه و شغل
    const fiveCoords = [
      { left: '75%', top: '50%' }, // شما / وضعیت
      { left: '25%', top: '50%' }, // طرف مقابل / مهارت
      { left: '50%', top: '50%' }, // مرکز رابطه
      { left: '50%', top: '82%' }, // مانع
      { left: '50%', top: '18%' }, // آینده و نتیجه
    ];
    return fiveCoords[index] || { left: '50%', top: '50%' };
  }

  if (spreadId === 'monthly') {
    // چیدمان لوزی ۴ هفته ماه
    const fourCoords = [
      { left: '50%', top: '18%' },
      { left: '78%', top: '50%' },
      { left: '50%', top: '82%' },
      { left: '22%', top: '50%' },
    ];
    return fourCoords[index] || { left: '50%', top: '50%' };
  }

  if (spreadId === 'yearly') {
    // دایره ۱۲ ماهه ساعت‌گرد نجومی
    const angle = ((index - 3) * (2 * Math.PI)) / 12;
    const x = 50 + Math.cos(angle) * 38;
    const y = 50 + Math.sin(angle) * 38;
    return { left: `${x}%`, top: `${y}%` };
  }

  if (total === 1) {
    return { left: '50%', top: '50%' };
  }

  if (total === 3) {
    const threeCoords = [
      { left: '76%', top: '50%' }, // گذشته / راست
      { left: '50%', top: '44%' }, // حال / مرکز
      { left: '24%', top: '50%' }, // آینده / چپ
    ];
    return threeCoords[index] || { left: '50%', top: '50%' };
  }

  const step = 80 / Math.max(1, total - 1);
  return { left: `${10 + index * step}%`, top: '50%' };
}

export function TarotCardDeck({
  spreadId = 'past-present-future',
  positions = [],
  cards = ALL_TAROT_CARDS,
  selected = [],
  cardCount = 3,
  shuffleKey = 0,
  onCardSelect = () => {},
}: TarotCardDeckProps) {
  const [phase, setPhase] = useState<'shuffling' | 'dealing'>('shuffling');
  const isComplete = selected.length >= cardCount;
  const backImageUrl = getAssetUrl('assets/tarot/cards/back.webp');

  useEffect(() => {
    setPhase('shuffling');
    const timer = setTimeout(() => {
      setPhase('dealing');
    }, 1350);
    return () => clearTimeout(timer);
  }, [shuffleKey]);

  const boardHeightClass =
    cardCount >= 10 ? 'h-80' : cardCount >= 5 ? 'h-64' : cardCount === 1 ? 'h-44' : 'h-48';

  return (
    <div className="w-full max-w-md mx-auto px-2 py-1 space-y-4">
      <AnimatePresence mode="wait">
        {phase === 'shuffling' ? (
          <motion.div
            key={`shuffle-anim-${shuffleKey}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.25 } }}
            className="relative h-72 flex flex-col items-center justify-center overflow-hidden my-2"
          >
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-44 h-44 rounded-full bg-[var(--luma-gold)]/20 blur-2xl pointer-events-none"
            />
            <div className="relative w-32 h-48 flex items-center justify-center">
              {Array.from({ length: 10 }).map((_, i) => {
                const offsetDir = i % 2 === 0 ? -1 : 1;
                return (
                  <motion.div
                    key={i}
                    animate={{
                      x: [0, offsetDir * (65 + i * 3), offsetDir * -18, 0],
                      y: [0, -14 + (i % 3) * 8, 6, -i * 0.6],
                      rotate: [0, offsetDir * (16 + i), offsetDir * -6, (i - 5) * 1.2],
                    }}
                    transition={{ duration: 0.62, repeat: 1, delay: i * 0.025, ease: 'easeInOut' }}
                    style={{ zIndex: 20 - i }}
                    className="absolute w-28 h-44 rounded-xl overflow-hidden border-2 border-[var(--luma-gold)]/70 shadow-2xl bg-[var(--luma-bg-elevated)]"
                  >
                    <img src={backImageUrl} alt="بر زدن کارت" className="w-full h-full object-cover" />
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs text-[var(--luma-gold)] animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>در حال بر زدن و چیدن الگوی هندسی فال...</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`deal-board-${shuffleKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* ۱. میز الگوی هندسی اختصاصی هر فال (صلیب سلتیک، نعل اسب و...) */}
            <div
              className={`relative w-full ${boardHeightClass} rounded-2xl bg-[var(--luma-bg-elevated)]/90 border border-[var(--luma-gold)]/30 shadow-inner overflow-hidden`}
            >
              <div className="absolute top-2 right-3 text-[10px] text-[var(--luma-text-muted)]">
                الگوی چیدمان کارت‌های انتخاب‌شده ({selected.length} از {cardCount})
              </div>

              {Array.from({ length: cardCount }).map((_, posIdx) => {
                const coords = getSpreadSlotCoords(spreadId, posIdx, cardCount);
                const selectedCardId = selected[posIdx];
                const posLabel = positions[posIdx]?.nameFa || `کارت ${posIdx + 1}`;
                const slotSize =
                  cardCount >= 10
                    ? 'w-11 h-16'
                    : cardCount >= 5
                    ? 'w-12 h-20'
                    : 'w-16 h-24';

                return (
                  <div
                    key={posIdx}
                    style={{
                      left: coords.left,
                      top: coords.top,
                      transform: `translate(-50%, -50%) rotate(${coords.rotate || 0}deg)`,
                      zIndex: coords.rotate ? 25 : 10 + posIdx,
                    }}
                    className={`absolute ${slotSize} rounded-lg border border-dashed border-[var(--luma-gold)]/50 bg-[var(--luma-bg-subtle)] flex flex-col items-center justify-center transition-all`}
                  >
                    {selectedCardId ? (
                      <motion.div
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full h-full rounded-lg overflow-hidden border-2 border-[var(--luma-gold)] shadow-lg relative"
                      >
                        <img
                          src={backImageUrl}
                          alt={posLabel}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-bold text-[var(--luma-gold)]">
                          {posIdx + 1}
                        </span>
                      </motion.div>
                    ) : (
                      <div className="text-center px-0.5">
                        <span className="block text-[10px] font-bold text-[var(--luma-gold)]/70">
                          {posIdx + 1}
                        </span>
                        <span className="block text-[8px] text-[var(--luma-text-subtle)] truncate max-w-[44px]">
                          {posLabel}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ۲. پیام انتظار روی سایر کارت‌های غیرفعال پس از تکمیل انتخاب */}
            <div className="relative">
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className=" inset-0 z-30 rounded-2xl bg-black/80 backdrop-blur-sm border-2 border-[var(--luma-gold)] p-6 flex flex-col items-center justify-center text-center my-2 shadow-2xl"
                >
                  <Loader2 className="w-8 h-8 text-[var(--luma-gold)] animate-spin mb-3" />
                  <h3 className="font-heading text-sm text-[var(--luma-gold)] font-bold mb-1">
                    فال شما در حال تفسیر و بررسی است، لطفاً منتظر باشید...
                  </h3>
                  <p className="text-xs text-[var(--luma-text-muted)]">
                    در حال ترکیب انرژی کارت‌ها و جایگاه‌های چیدمان شما
                  </p>
                </motion.div>
              )}

              {/* شبکه کارت‌ها برای انتخاب */}
              <div
                className={
                  'grid grid-cols-6 gap-2 transition-opacity duration-300 ' +
                  (isComplete ? 'opacity-25 pointer-events-none select-none' : '')
                }
              >
                {cards.map((card, index) => {
                  const isSelected = selected.includes(card.id);
                  const selectionIndex = selected.indexOf(card.id);
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.4, y: -30 }}
                      animate={{
                        opacity: isSelected ? 0.35 : 0.92,
                        scale: isSelected ? 0.92 : 1,
                        y: 0,
                      }}
                      transition={{ delay: index * 0.005 }}
                      whileHover={!isSelected && !isComplete ? { scale: 1.08, y: -4 } : {}}
                      whileTap={!isSelected && !isComplete ? { scale: 0.94 } : {}}
                      onClick={() => {
                        if (!isSelected && !isComplete) {
                          onCardSelect(card.id);
                        }
                      }}
                      className={`relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer border transition-all ${
                        isSelected
                          ? 'border-[var(--luma-gold)] pointer-events-none'
                          : 'border-[var(--luma-border)] hover:border-[var(--luma-gold)]'
                      }`}
                    >
                      <img
                        src={backImageUrl}
                        alt="پشت کارت"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="w-5 h-5 rounded-full bg-[var(--luma-gold)] text-[#0B0D1A] text-[10px] font-bold flex items-center justify-center">
                            {selectionIndex + 1}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
