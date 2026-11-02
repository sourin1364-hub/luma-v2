import { SPREADS } from '../../engines/tarot/spreads';
import { type Spread } from '../../engines/tarot/types';
import { Sparkles, Clock, ArrowRight, Layers, HelpCircle, Heart, Cross, Moon, Users, Briefcase, Calendar, Lock } from 'lucide-react';

interface TarotSpreadSelectorProps {
  onSelect: (spread: Spread) => void;
  canUseSpread: (spreadId: string) => boolean;
}

const SPREAD_ICONS: Record<string, typeof Sparkles> = {
  'daily-card': Sparkles,
  'single-card': HelpCircle,
  'past-present-future': Clock,
  'situation-obstacle-advice': Layers,
  'mind-heart-action': Heart,
  'yes-no': ArrowRight,
  'celtic-cross': Cross,
  'horseshoe': Moon,
  'relationship': Users,
  'career': Briefcase,
  'yearly': Calendar
};

export function TarotSpreadSelector({ onSelect, canUseSpread }: TarotSpreadSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {SPREADS.map((spread) => {
        const Icon = SPREAD_ICONS[spread.id] || Sparkles;
        const allowed = canUseSpread(spread.id);
        return (
          <button
            key={spread.id}
            onClick={() => allowed && onSelect(spread)}
            disabled={!allowed}
            className={
              'text-right p-4 rounded-2xl bg-[var(--luma-bg-elevated)] border transition-all duration-300 relative ' +
              (allowed
                ? 'border-[var(--luma-border)] hover:border-[var(--luma-gold)] hover:scale-[1.02] active:scale-[0.98]'
                : 'border-amber-500/30 opacity-70 cursor-not-allowed')
            }
          >
            {!allowed && (
              <span className="absolute top-2 left-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              </span>
            )}
            <Icon className="w-6 h-6 text-[var(--luma-gold)] mb-2" />
            <h3 className="font-heading text-sm text-[var(--luma-text)] mb-1">{spread.nameFa}</h3>
            <p className="text-[10px] text-[var(--luma-text-muted)] leading-relaxed mb-2">
              {spread.description}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-[var(--luma-gold)]">
              <span>{spread.cardCount}</span>
              <span>کارت</span>
              {!allowed && <span className="mr-auto text-amber-400">پریمیوم</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}