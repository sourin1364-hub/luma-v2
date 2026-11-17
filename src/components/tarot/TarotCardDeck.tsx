import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_TAROT_CARDS } from '../../engines/tarot';
import type { TarotCard, SpreadPosition } from '../../engines/tarot/types';
import { getAssetUrl } from '../../utils/assetPath';
import { Sparkles, Loader2 } from 'lucide-react';
import { useLanguageStore, UI_TRANSLATIONS, translateNodeText } from '../../i18n/useLanguageStore';

interface TarotCardDeckProps {
  spreadId?: string;
  positions?: SpreadPosition[];
  cards?: TarotCard[];
  selected?: string[];
  cardCount?: number;
  shuffleKey?: number;
  onCardSelect?: (id: string) => void;
}

function getSpreadSlotCoords(
  spreadId: string,
  index: number,
  total: number
): { left: string; top: string; rotate?: number } {
  if (spreadId === 'celtic-cross') {
    const celticCoords: { left: string; top: string; rotate?: number }[] = [
      { left: '64%', top: '50%', rotate: 0 },
      { left: '64%', top: '50%', rotate: 90 },
      { left: '64%', top: '82%' },
      { left: '85%', top: '50%' },
      { left: '64%', top: '18%' },
      { left: '43%', top: '50%' },
      { left: '16%', top: '84%' },
      { left: '16%', top: '62%' },
      { left: '16%', top: '40%' },
      { left: '16%', top: '18%' },
    ];
    return celticCoords[index] || { left: '50%', top: '50%' };
  }

  if (spreadId === 'horseshoe' || spreadId === 'weekly') {
    const horseshoeCoords = [
      { left: '12%', top: '76%', rotate: -16 },
      { left: '21%', top: '48%', rotate: -9 },
      { left: '34%', top: '26%', rotate: -4 },
      { left: '50%', top: '18%', rotate: 0 },
      { left: '66%', top: '26%', rotate: 4 },
      { left: '79%', top: '48%', rotate: 9 },
      { left: '88%', top: '76%', rotate: 16 },
    ];
    return horseshoeCoords[index] || { left: '50%', top: '50%' };
  }

  if (spreadId === 'relationship' || spreadId === 'career') {
    const fiveCoords = [
      { left: '76%', top: '52%' },
      { left: '24%', top: '52%' },
      { left: '50%', top: '52%' },
      { left: '50%', top: '82%' },
      { left: '50%', top: '22%' },
    ];
    return fiveCoords[index] || { left: '50%', top: '50%' };
  }

  if (spreadId === 'monthly') {
    const fourCoords = [
      { left: '50%', top: '22%' },
      { left: '78%', top: '52%' },
      { left: '50%', top: '82%' },
      { left: '22%', top: '52%' },
    ];
    return fourCoords[index] || { left: '50%', top: '50%' };
  }

  if (spreadId === 'yearly') {
    const angle = ((index - 3) * (2 * Math.PI)) / 12;
    const x = 50 + Math.cos(angle) * 36;
    const y = 52 + Math.sin(angle) * 36;
    return { left: `${x}%`, top: `${y}%` };
  }

  if (total === 1) {
    return { left: '50%', top: '52%' };
  }

  if (total === 3) {
    const threeCoords = [
      { left: '76%', top: '54%' },
      { left: '50%', top: '48%' },
      { left: '24%', top: '54%' },
    ];
    return threeCoords[index] || { left: '50%', top: '52%' };
  }

  const step = 76 / Math.max(1, total - 1);
  return { left: `${12 + index * step}%`, top: '52%' };
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
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

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
                    <img src={backImageUrl} alt={t['tarot_ui_shuffling']} className="w-full h-full object-cover" />
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs text-[var(--luma-gold)] animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>{t['tarot_ui_shuffling']}</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`deal-board-${shuffleKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* ۱. کادر میز چیدمان */}
            <div className="rounded-2xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/35 shadow-inner overflow-hidden">
              <div className="px-3.5 py-2 bg-[var(--luma-bg-subtle)] border-b border-[var(--luma-border)] flex items-center justify-between text-[11px]">
                <span className="font-bold text-[var(--luma-gold)]">
                  {t['tarot_ui_layout']}
                </span>
                <span className="text-[var(--luma-text-muted)] font-mono">
                  {selected.length} / {cardCount}
                </span>
              </div>

              <div className={`relative w-full ${boardHeightClass}`}>
                {Array.from({ length: cardCount }).map((_, posIdx) => {
                  const coords = getSpreadSlotCoords(spreadId, posIdx, cardCount);
                  const selectedCardId = selected[posIdx];
                  const posLabel = positions[posIdx]
                    ? translateNodeText(positions[posIdx].nameFa, lang)
                    : `${t['tarot_ui_card_n']} ${posIdx + 1}`;
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
                      className={`absolute ${slotSize} rounded-lg border border-dashed border-[var(--luma-gold)]/60 bg-[var(--luma-bg-subtle)] flex flex-col items-center justify-center transition-all`}
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
                          <span className="absolute inset-0 bg-black/45 flex items-center justify-center text-[10px] font-bold text-[#FDE68A]">
                            {posIdx + 1}
                          </span>
                        </motion.div>
                      ) : (
                        <div className="text-center px-0.5 pointer-events-none">
                          <span className="block text-[11px] font-bold text-[var(--luma-gold)]">
                            {posIdx + 1}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ۲. پیام انتظار پس از تکمیل انتخاب */}
            <div className="relative">
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl bg-black/85 backdrop-blur-sm border-2 border-[var(--luma-gold)] p-6 flex flex-col items-center justify-center text-center my-2 shadow-2xl"
                >
                  <Loader2 className="w-8 h-8 text-[var(--luma-gold)] animate-spin mb-3" />
                  <h3 className="font-heading text-sm text-[var(--luma-gold)] font-bold mb-1">
                    {t['tarot_ui_interpreting']}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {t['tarot_ui_interpreting_sub']}
                  </p>
                </motion.div>
              )}

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
                        opacity: isSelected ? 0.35 : 0.95,
                        scale: isSelected ? 0.92 : 1,
                        y: 0,
                      }}
                      transition={{ delay: index * 0.004 }}
                      whileHover={!isSelected && !isComplete ? { scale: 1.06, y: -3 } : {}}
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
                        alt={t['tarot_ui_card_back']}
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