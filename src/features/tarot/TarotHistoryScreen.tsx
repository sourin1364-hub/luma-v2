import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { History, Trash2, Loader2, Sparkles, Eye } from 'lucide-react';
import { getReadings, deleteReading, type SavedReading } from './tarotHistoryService';
import { useAuthStore } from '../../store/useAuthStore';
import { getAssetUrl } from '../../utils/assetPath';
import type { ReadingResult } from '../../engines/tarot/types';
import { useLanguageStore, UI_TRANSLATIONS, translateNodeText } from '../../i18n/useLanguageStore';
import { getLocalizedCardName } from './tarotI18nResolver';

interface TarotHistoryScreenProps {
  onBack: () => void;
  onSelectReading?: (reading: ReadingResult) => void;
}

export function TarotHistoryScreen({ onBack, onSelectReading }: TarotHistoryScreenProps) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];
  const user = useAuthStore((s) => s.user);

  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    (async () => {
      try {
        const list = await getReadings(user.id);
        setReadings(list);
      } catch (e) {
        console.error('Error loading tarot history:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm(t['tarot_history_delete_confirm'])) return;
    try {
      await deleteReading(id);
      setReadings((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(t['tarot_history_delete_error']);
    }
  };

  const handleViewFullReading = (reading: SavedReading) => {
    if (!onSelectReading) return;
    const reconstructed: ReadingResult = {
      spreadId: reading.spreadId as any,
      question: reading.question || reading.spreadName,
      drawnCards: reading.cards.map((c, idx) => ({
        cardId: c.cardId,
        isReversed: c.isReversed,
        positionIndex: c.positionIndex ?? idx,
      })),
      createdAt: reading.createdAt,
      version: '1.0.0',
    };
    onSelectReading(reconstructed);
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const locale = lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar-SA' : lang === 'ckb' ? 'ckb-IQ' : 'en-US';
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[var(--luma-gold)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20">
      <PageHeader
        title={t['tarot_history_title']}
        subtitle={`${readings.length} ${t['tarot_history_count']}`}
        onBack={onBack}
      />

      {readings.length === 0 ? (
        <Card variant="elevated" padding="lg" className="text-center py-16">
          <History className="w-12 h-12 text-[var(--luma-gold)]/40 mx-auto mb-3" />
          <h3 className="font-heading text-lg text-[var(--luma-text)] mb-2">{t['tarot_history_empty_title']}</h3>
          <p className="text-sm text-[var(--luma-text-muted)]">
            {t['tarot_history_empty_desc']}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {readings.map((reading) => (
            <Card key={reading.id} variant="elevated" padding="md">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--luma-gold)]" />
                    <h3 className="font-heading text-sm text-[var(--luma-text)]">{translateNodeText(reading.spreadName, lang)}</h3>
                  </div>
                  {reading.question && (
                    <p className="text-xs text-[var(--luma-text-muted)] italic mb-1">
                      «{reading.question}»
                    </p>
                  )}
                  <p className="text-[10px] text-[var(--luma-text-subtle)]">{formatDate(reading.createdAt)}</p>
                </div>
                <div className="flex items-center gap-1">
                  {onSelectReading && (
                    <button
                      type="button"
                      onClick={() => handleViewFullReading(reading)}
                      className="p-2 rounded-full hover:bg-[var(--luma-gold)]/10 text-[var(--luma-gold)] transition-colors flex-shrink-0"
                      title={t['tarot_history_view_full']}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(reading.id)}
                    className="p-2 rounded-full hover:bg-red-500/10 text-[var(--luma-text-subtle)] hover:text-red-400 transition-colors flex-shrink-0"
                    aria-label={t['common_delete']}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 pb-2 border-t border-[var(--luma-border)]">
                {reading.cards.map((c, i) => {
                  const cardImageUrl = getAssetUrl(`assets/tarot/cards/${c.cardId}.webp`);
                  const fallbackUrl = getAssetUrl('assets/tarot/cards/back.webp');
                  const localizedCardName = getLocalizedCardName({ id: c.cardId, name: c.name }, lang);
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-11 h-16 rounded-md overflow-hidden border border-[var(--luma-gold)]/30 bg-[var(--luma-bg-subtle)]">
                        <img
                          src={cardImageUrl}
                          alt={localizedCardName}
                          className={'w-full h-full object-cover ' + (c.isReversed ? 'rotate-180' : '')}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = fallbackUrl;
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-[var(--luma-text-subtle)] max-w-[48px] truncate text-center">
                        {localizedCardName}
                      </span>
                    </div>
                  );
                })}
              </div>

              {reading.interpretation && (
                <div className="pt-2 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] leading-relaxed text-justify">
                    {reading.interpretation}
                  </p>
                </div>
              )}

              {reading.advice && (
                <div className="pt-2 mt-2 border-t border-[var(--luma-border)]">
                  <p className="text-[11px] text-[var(--luma-gold)] leading-relaxed text-justify">
                    💡 {reading.advice}
                  </p>
                </div>
              )}

              {onSelectReading && (
                <div className="mt-3 pt-2 border-t border-[var(--luma-border)]">
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => handleViewFullReading(reading)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {t['tarot_history_view_analysis']}
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Button variant="secondary" fullWidth onClick={onBack}>
        {t['tarot_history_back']}
      </Button>
    </div>
  );
}