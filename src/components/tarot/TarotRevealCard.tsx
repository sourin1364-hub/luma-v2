import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TarotCard } from '../../engines/tarot/types';

interface TarotRevealCardProps {
  card: TarotCard;
  isReversed: boolean;
  positionName: string;
  meaning: string;
  keywords: string[];
  delay: number;
}

export function TarotRevealCard({
  card,
  isReversed,
  positionName,
  meaning,
  keywords,
  delay
}: TarotRevealCardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="space-y-3"
    >
      <p className="text-xs text-[var(--luma-gold)] font-medium text-center">{positionName}</p>

      <div
        className="relative mx-auto w-40 cursor-pointer"
        onClick={() => setRevealed(!revealed)}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative aspect-[2/3]"
        >
          {/* پشت کارت — تصویر واقعی back.webp */}
          <div
            className="absolute inset-0 rounded-xl border-2 border-[var(--luma-gold)]/40 shadow-lg overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <img
              src="/assets/tarot/cards/back.webp"
              alt="پشت کارت"
              className="w-full h-full object-cover"
            />
          </div>

          {/* روی کارت — تصویر اصلی */}
          <div
            className="absolute inset-0 rounded-xl border-2 border-[var(--luma-gold)]/60 shadow-glow-gold overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <img
              src={card.imagePath}
              alt={card.nameFa}
              className={'w-full h-full object-cover ' + (isReversed ? 'rotate-180' : '')}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <h3 className="font-heading text-sm text-[var(--luma-text)] mb-1">
          {card.nameFa}
          {isReversed && <span className="text-xs text-amber-500 mr-1"> (معکوس)</span>}
        </h3>
        {revealed && (
          <>
            <p className="text-xs text-[var(--luma-text-muted)] leading-relaxed mb-2 px-2">
              {meaning}
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {keywords.slice(0, 3).map((kw, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]"
                >
                  {kw}
                </span>
              ))}
            </div>
          </>
        )}
        {!revealed && (
          <p className="text-[10px] text-[var(--luma-text-subtle)]">برای دیدن کارت کلیک کنید</p>
        )}
      </motion.div>
    </motion.div>
  );
}