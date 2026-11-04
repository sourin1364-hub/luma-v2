import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ALL_TAROT_CARDS } from '../../engines/tarot';
import type { TarotCard, Suit } from '../../engines/tarot/types';
import { getAssetUrl } from '../../utils/assetPath';
import { Search, BookOpen, RotateCcw, Sparkles, X } from 'lucide-react';

interface TarotLibraryModalProps {
  onBack: () => void;
}

const SUIT_FILTERS: { id: 'all' | Suit; label: string }[] = [
  { id: 'all', label: 'همه (۷۸ کارت)' },
  { id: 'major', label: 'آرکانای کبیر (۲۲)' },
  { id: 'wands', label: 'چوب‌ها (آتش)' },
  { id: 'cups', label: 'جام‌ها (آب)' },
  { id: 'swords', label: 'شمشیرها (باد)' },
  { id: 'pentacles', label: 'سکه‌ها (خاک)' },
];

export function TarotLibraryModal({ onBack }: TarotLibraryModalProps) {
  const [search, setSearch] = useState('');
  const [suitFilter, setSuitFilter] = useState<'all' | Suit>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  const filteredCards = useMemo(() => {
    return ALL_TAROT_CARDS.filter((c) => {
      if (suitFilter !== 'all' && c.suit !== suitFilter) return false;
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        c.nameFa.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [search, suitFilter]);

  return (
    <div className="space-y-4 pb-24">
      <PageHeader
        title="کتابخانه آموزشی ۷۸ کارت تاروت"
        subtitle="معانی مستقیم، معکوس و نمادشناسی کارت‌ها"
        onBack={onBack}
      />

      {/* جستجو */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی نام کارت یا کلیدواژه (مثلاً: ابله، عشق، ثروت)..."
          className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] text-xs"
        />
      </div>

      {/* فیلتر خال‌ها */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {SUIT_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setSuitFilter(f.id)}
            className={
              'px-3 py-1.5 rounded-full text-[11px] whitespace-nowrap border transition-all ' +
              (suitFilter === f.id
                ? 'bg-[var(--luma-gold)] text-[#0B0D1A] border-[var(--luma-gold)] font-bold'
                : 'bg-[var(--luma-bg-elevated)] border-[var(--luma-border)] text-[var(--luma-text-muted)]')
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* شبکه کارت‌ها */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {filteredCards.map((card) => {
          const imgUrl = getAssetUrl(`assets/tarot/cards/${card.id}.webp`);
          const fallbackUrl = getAssetUrl('assets/tarot/cards/back.webp');
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setSelectedCard(card)}
              className="text-center p-2 rounded-xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] hover:border-[var(--luma-gold)] transition-all group"
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-[var(--luma-bg-subtle)] border border-[var(--luma-gold)]/20">
                <img
                  src={imgUrl}
                  alt={card.nameFa}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackUrl;
                  }}
                />
              </div>
              <p className="font-heading text-xs text-[var(--luma-text)] truncate">{card.nameFa}</p>
              <p className="text-[9px] text-[var(--luma-text-subtle)] truncate">{card.nameEn}</p>
            </button>
          );
        })}
      </div>

      {/* پنجره جزئیات کارت انتخاب‌شده */}
      {selectedCard && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="w-full max-w-md max-h-[88vh] overflow-y-auto bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/40 rounded-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-heading text-lg text-[var(--luma-gold)]">
                  {selectedCard.nameFa}
                </h3>
                <p className="text-xs text-[var(--luma-text-muted)]">{selectedCard.nameEn}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="p-1.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-24 h-36 rounded-xl overflow-hidden border border-[var(--luma-gold)]/40 flex-shrink-0">
                <img
                  src={getAssetUrl(`assets/tarot/cards/${selectedCard.id}.webp`)}
                  alt={selectedCard.nameFa}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getAssetUrl('assets/tarot/cards/back.webp');
                  }}
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-[var(--luma-text-muted)]">
                  دسته:{' '}
                  <span className="text-[var(--luma-text)] font-medium">
                    {selectedCard.arcana === 'major' ? 'آرکانای کبیر' : 'آرکانای صغیر'}
                  </span>
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedCard.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold)]/15 text-[var(--luma-gold)]"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Card variant="elevated" padding="sm">
              <h4 className="font-heading text-xs text-emerald-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                معنی مستقیم (Upright)
              </h4>
              <p className="text-xs text-[var(--luma-text)] leading-relaxed text-justify">
                {selectedCard.upright.meaning}
              </p>
            </Card>

            <Card variant="elevated" padding="sm">
              <h4 className="font-heading text-xs text-amber-400 mb-1 flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                معنی معکوس (Reversed)
              </h4>
              <p className="text-xs text-[var(--luma-text)] leading-relaxed text-justify">
                {selectedCard.reversed.meaning}
              </p>
            </Card>

            <Button variant="gold" fullWidth onClick={() => setSelectedCard(null)}>
              <BookOpen className="w-4 h-4" />
              بستن پنجره
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
