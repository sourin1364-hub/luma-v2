import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TarotCardDeckProps {
  cardCount: number;
  onComplete: (selectedIndices: number[]) => void;
}

const DECK_SIZE = 22;

export function TarotCardDeck({ cardCount, onComplete }: TarotCardDeckProps) {
  const [phase, setPhase] = useState<'shuffling' | 'selecting'>('shuffling');
  const [selected, setSelected] = useState<number[]>([]);
  const [deckPositions, setDeckPositions] = useState<number[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('selecting');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const positions = Array.from({ length: DECK_SIZE }, (_, i) => i);
    setDeckPositions(positions.sort(() => Math.random() - 0.5));
  }, []);

  const handleCardClick = (index: number) => {
    if (phase !== 'selecting') return;
    if (selected.includes(index)) {
      setSelected(selected.filter(i => i !== index));
    } else if (selected.length < cardCount) {
      setSelected([...selected, index]);
    }
  };

  const handleConfirm = () => {
    if (selected.length === cardCount) {
      onComplete(selected);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col">
      <AnimatePresence mode="wait">
        {phase === 'shuffling' && (
          <motion.div
            key="shuffling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 5, 0],
                scale: [1, 1.05, 1, 1.05, 1]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative w-32 h-48"
            >
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-xl overflow-hidden border-2 border-[var(--luma-gold)]/40 shadow-lg"
                  animate={{
                    x: [0, Math.random() * 20 - 10, 0],
                    y: [0, Math.random() * 20 - 10, 0],
                    rotate: [i * 3 - 6, Math.random() * 10 - 5, i * 3 - 6]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                >
                  <img
                    src="/assets/tarot/cards/back.webp"
                    alt="پشت کارت"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-sm text-[var(--luma-text-muted)]"
            >
              کارت‌ها در حال شافل...
            </motion.p>
          </motion.div>
        )}

        {phase === 'selecting' && (
          <motion.div
            key="selecting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-4">
              <p className="text-sm text-[var(--luma-text)] font-medium">
                {selected.length === cardCount
                  ? 'همه کارت‌ها انتخاب شد'
                  : `${selected.length} از ${cardCount} کارت انتخاب شده`}
              </p>
              <p className="text-xs text-[var(--luma-text-muted)] mt-1">
                {selected.length === cardCount
                  ? 'برای دیدن نتیجه روی دکمه زیر بزنید'
                  : `${cardCount - selected.length} کارت دیگر انتخاب کنید`}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {deckPositions.map((pos, idx) => {
                const isSelected = selected.includes(pos);
                const isDisabled = !isSelected && selected.length >= cardCount;
                return (
                  <motion.button
                    key={pos}
                    onClick={() => handleCardClick(pos)}
                    disabled={isDisabled}
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                      y: isSelected ? -8 : 0
                    }}
                    transition={{ delay: idx * 0.02, duration: 0.3 }}
                    whileHover={{ scale: isDisabled ? 1 : 1.05, y: isSelected ? -8 : -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={[
                      'aspect-[2/3] rounded-lg border-2 transition-all duration-300 overflow-hidden relative',
                      isSelected
                        ? 'border-[var(--luma-gold)] shadow-glow-gold'
                        : isDisabled
                        ? 'border-[var(--luma-border)] opacity-40 cursor-not-allowed'
                        : 'border-[var(--luma-gold)]/30 hover:border-[var(--luma-gold)]/70'
                    ].join(' ')}
                  >
                    <img
                      src="/assets/tarot/cards/back.webp"
                      alt="پشت کارت"
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-[var(--luma-gold)]/20 backdrop-blur-[1px]"
                      >
                        <div className="w-8 h-8 rounded-full bg-[var(--luma-gold)] flex items-center justify-center shadow-glow-gold">
                          <Sparkles className="w-4 h-4 text-[#0B0D1A]" />
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              onClick={handleConfirm}
              disabled={selected.length !== cardCount}
              animate={{
                scale: selected.length === cardCount ? [1, 1.02, 1] : 1,
                opacity: selected.length === cardCount ? 1 : 0.5
              }}
              transition={{ duration: 0.5, repeat: selected.length === cardCount ? Infinity : 0 }}
              className="w-full py-3 rounded-xl bg-gradient-to-br from-[#D6B56D] via-[#E8C77A] to-[#B8944E] text-[#0B0D1A] font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-gold"
            >
              {selected.length === cardCount ? 'نمایش فال' : `انتخاب ${cardCount - selected.length} کارت دیگر`}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}