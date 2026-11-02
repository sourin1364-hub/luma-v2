import { SPREADS } from '../../engines/tarot/spreads';
import { type Spread } from '../../engines/tarot/types';
import { Sparkles, Clock, ArrowRight, Layers, HelpCircle, Heart } from 'lucide-react';

interface TarotSpreadSelectorProps {
  onSelect: (spread: Spread) => void;
}

const SPREAD_ICONS: Record<string, typeof Sparkles> = {
  'daily-card': Sparkles,
  'single-card': HelpCircle,
  'past-present-future': Clock,
  'situation-obstacle-advice': Layers,
  'mind-heart-action': Heart,
  'yes-no': ArrowRight
};

export function TarotSpreadSelector({ onSelect }: TarotSpreadSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SPREADS.map((spread) => {
        const Icon = SPREAD_ICONS[spread.id] || Sparkles;
        return (
          <button
            key={spread.id}
            onClick={() => onSelect(spread)}
            className="text-right p-4 rounded-2xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] hover:border-[var(--luma-gold)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Icon className="w-6 h-6 text-[var(--luma-gold)] mb-2" />
            <h3 className="font-heading text-sm text-[var(--luma-text)] mb-1">{spread.nameFa}</h3>
            <p className="text-[10px] text-[var(--luma-text-muted)] leading-relaxed mb-2">
              {spread.description}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-[var(--luma-gold)]">
              <span>{spread.cardCount}</span>
              <span>کارت</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}