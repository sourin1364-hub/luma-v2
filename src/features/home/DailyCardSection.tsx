import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { ALL_TAROT_CARDS } from '../../engines/tarot';
import { useAuthStore } from '../../store/useAuthStore';
import { getAssetUrl } from '../../utils/assetPath';
import { playCardFlipSound } from '../../utils/audio';
import { Sparkles, RotateCcw, Clock } from 'lucide-react';

/**
 * تولید عدد هش قطعی از رشته (ترکیب شناسه کاربر + تاریخ روز)
 * تضمین می‌کند کارت روزانه هر شخص منحصربه‌فرد باشد و راس هر ۲۴ ساعت عوض شود.
 */
function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

export function DailyCardSection() {
  const user = useAuthStore((s) => s.user);

  // کلید تاریخ ۲۴ ساعته بر اساس سال، ماه و روز جاری
  const todayKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }, []);

  const userStorageKey = `luma_daily_revealed_${user?.id || 'guest'}_${todayKey}`;

  const [isRevealed, setIsRevealed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(userStorageKey) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      setIsRevealed(localStorage.getItem(userStorageKey) === 'true');
    } catch {}
  }, [userStorageKey]);

  const { dailyCard, isReversed } = useMemo(() => {
    const uniqueSeedString = `${user?.id || 'luma-guest'}-${user?.email || ''}-${todayKey}`;
    const hashValue = hashString(uniqueSeedString);
    const cardIndex = hashValue % ALL_TAROT_CARDS.length;
    const reversed = (hashValue >> 4) % 10 < 3; // ۳۰٪ احتمال معکوس بودن مختص همان شخص در همان روز
    return {
      dailyCard: ALL_TAROT_CARDS[cardIndex] || ALL_TAROT_CARDS[0],
      isReversed: reversed,
    };
  }, [user?.id, user?.email, todayKey]);

  const handleReveal = () => {
    if (!isRevealed) {
      playCardFlipSound();
      setIsRevealed(true);
      try {
        localStorage.setItem(userStorageKey, 'true');
      } catch {}
    }
  };

  const backImg = getAssetUrl('assets/tarot/cards/back.webp');
  const frontImg = getAssetUrl(`assets/tarot/cards/${dailyCard.id}.webp`);

  return (
    <Card variant="gold-border" padding="md" className="overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--luma-gold)]" />
          <h2 className="font-heading text-base text-[var(--luma-text)]">کارت روزانه اختصاصی شما</h2>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-[var(--luma-text-muted)]">
          <Clock className="w-3 h-3 text-[var(--luma-gold)]" />
          به‌روزرسانی هر ۲۴ ساعت
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div
          onClick={handleReveal}
          className="w-40 h-64 cursor-pointer relative my-2"
          style={{ perspective: '1000px' }}
        >
          <motion.div
            animate={{ rotateY: isRevealed ? 180 : 0 }}
            transition={{ duration: 0.65, type: 'spring', stiffness: 220, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="w-full h-full relative"
          >
            {/* پشت کارت */}
            <div
              style={{ backfaceVisibility: 'hidden' }}
              className="absolute inset-0 rounded-xl overflow-hidden border-2 border-[var(--luma-gold)]/50 shadow-lg"
            >
              <img src={backImg} alt="پشت کارت" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-end justify-center pb-3">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-black/70 text-[var(--luma-gold)] border border-[var(--luma-gold)]/40">
                  لمس برای مشاهده کارت امروز
                </span>
              </div>
            </div>

            {/* روی کارت */}
            <div
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              className="absolute inset-0 rounded-xl overflow-hidden border-2 border-[var(--luma-gold)] shadow-xl bg-[var(--luma-bg-elevated)]"
            >
              <img
                src={frontImg}
                alt={dailyCard.nameFa}
                className={'w-full h-full object-cover ' + (isReversed ? 'rotate-180' : '')}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = backImg;
                }}
              />
            </div>
          </motion.div>
        </div>

        {isRevealed ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-3 pt-3 border-t border-[var(--luma-border)] text-right space-y-2"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base text-[var(--luma-gold)]">{dailyCard.nameFa}</h3>
              {isReversed && (
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                  <RotateCcw className="w-3 h-3" />
                  معکوس
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--luma-text)] leading-relaxed text-justify">
              {isReversed ? dailyCard.reversed.meaning : dailyCard.upright.meaning}
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {dailyCard.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]"
                >
                  {kw}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          <p className="text-xs text-[var(--luma-text-muted)] mt-2 text-center">
            کارت امروز بر اساس انرژی پروفایل شما آماده شده است. روی کارت ضربه بزنید.
          </p>
        )}
      </div>
    </Card>
  );
}
