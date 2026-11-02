import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Sparkles, Moon, RefreshCw } from 'lucide-react';
import { ALL_TAROT_CARDS, getCardById } from '../../engines/tarot';

interface DailyCard {
  cardId: string;
  isReversed: boolean;
  date: string;
}

const STORAGE_KEY = 'luma_daily_card';

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getOrCreateDailyCard(): DailyCard {
  const today = getTodayString();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: DailyCard = JSON.parse(stored);
      if (parsed.date === today) {
        return parsed;
      }
    }
  } catch { /* ignore */ }

  // کارت جدید برای امروز
  const randomIndex = Math.floor(Math.random() * ALL_TAROT_CARDS.length);
  const card = ALL_TAROT_CARDS[randomIndex];
  const isReversed = Math.random() < 0.3;
  const dailyCard: DailyCard = { cardId: card.id, isReversed, date: today };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dailyCard));
  return dailyCard;
}

interface DailyCardSectionProps {
  onNavigateToTarot: () => void;
}

export function DailyCardSection({ onNavigateToTarot }: DailyCardSectionProps) {
  const [daily, setDaily] = useState<DailyCard | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setDaily(getOrCreateDailyCard());
  }, []);

  if (!daily) return null;
  const card = getCardById(daily.cardId);
  if (!card) return null;

  const meaning = daily.isReversed ? card.reversed.meaning : card.upright.meaning;
  const keywords = daily.isReversed ? card.reversed.keywords : card.upright.keywords;

  return (
    <Card variant="gold-border" padding="lg" className="text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Moon className="w-5 h-5 text-[var(--luma-gold)]" />
        <h3 className="font-heading text-lg text-[var(--luma-text)]">فال روزانه</h3>
      </div>

      {/* کارت */}
      <div
        className="relative mx-auto w-32 cursor-pointer mb-3"
        onClick={() => setRevealed(!revealed)}
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative aspect-[2/3] transition-transform duration-700"
          style={{
            transformStyle: 'preserve-3d',
            transform: revealed ? 'rotateY(180deg)' : 'rotateY(0)'
          }}
        >
          {/* پشت */}
          <div
            className="absolute inset-0 rounded-xl border-2 border-[var(--luma-gold)]/40 overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <img
              src="/assets/tarot/cards/back.webp"
              alt="پشت کارت"
              className="w-full h-full object-cover"
            />
          </div>
          {/* رو */}
          <div
            className="absolute inset-0 rounded-xl border-2 border-[var(--luma-gold)]/60 overflow-hidden shadow-glow-gold"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <img
              src={card.imagePath}
              alt={card.nameFa}
              className={'w-full h-full object-cover ' + (daily.isReversed ? 'rotate-180' : '')}
            />
          </div>
        </div>
      </div>

      {!revealed ? (
        <>
          <p className="text-sm text-[var(--luma-text-muted)] mb-3">
            کارت امروز شما آماده است
          </p>
          <Button variant="gold" onClick={() => setRevealed(true)}>
            <Sparkles className="w-4 h-4" />
            نمایش کارت
          </Button>
        </>
      ) : (
        <>
          <h4 className="font-heading text-base text-[var(--luma-text)] mb-1">
            {card.nameFa}
            {daily.isReversed && <span className="text-xs text-amber-500 mr-1"> (معکوس)</span>}
          </h4>
          <p className="text-xs text-[var(--luma-text-muted)] leading-relaxed mb-3 px-2">
            {meaning}
          </p>
          <div className="flex flex-wrap gap-1 justify-center mb-3">
            {keywords.slice(0, 3).map((kw, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]">
                {kw}
              </span>
            ))}
          </div>
          <Button variant="secondary" size="sm" onClick={onNavigateToTarot}>
            <RefreshCw className="w-3 h-3" />
            فال کامل
          </Button>
        </>
      )}
    </Card>
  );
}