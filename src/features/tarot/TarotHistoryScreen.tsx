import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { History, Trash2, Loader2, Sparkles } from 'lucide-react';
import { getReadings, deleteReading, type SavedReading } from './tarotHistoryService';
import { useAuthStore } from '../../store/useAuthStore';
import { getCardById } from '../../engines/tarot';

interface TarotHistoryScreenProps {
  onBack: () => void;
}

export function TarotHistoryScreen({ onBack }: TarotHistoryScreenProps) {
  const user = useAuthStore((s) => s.user);
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const list = await getReadings(user.id);
      setReadings(list);
      setIsLoading(false);
    })();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm('این فال حذف شود؟')) return;
    try {
      await deleteReading(id);
      setReadings((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('خطا در حذف');
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[var(--luma-gold)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="تاریخچه فال"
        subtitle={`${readings.length} فال ذخیره‌شده`}
        onBack={onBack}
      />

      {readings.length === 0 ? (
        <Card variant="elevated" padding="lg" className="text-center py-16">
          <History className="w-12 h-12 text-[var(--luma-gold)]/40 mx-auto mb-3" />
          <h3 className="font-heading text-lg text-[var(--luma-text)] mb-2">هنوز فالی ندارید</h3>
          <p className="text-sm text-[var(--luma-text-muted)]">
            اولین فال خود را انجام دهید تا تاریخچه ساخته شود.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {readings.map((reading) => (
            <Card key={reading.id} variant="elevated" padding="md">
              {/* هدر */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--luma-gold)]" />
                    <h3 className="font-heading text-sm text-[var(--luma-text)]">{reading.spreadName}</h3>
                  </div>
                  {reading.question && (
                    <p className="text-xs text-[var(--luma-text-muted)] italic mb-1">
                      «{reading.question}»
                    </p>
                  )}
                  <p className="text-[10px] text-[var(--luma-text-subtle)]">{formatDate(reading.createdAt)}</p>
                </div>
                <button
                  onClick={() => handleDelete(reading.id)}
                  className="p-2 rounded-full hover:bg-red-500/10 text-[var(--luma-text-subtle)] hover:text-red-400 transition-colors flex-shrink-0"
                  aria-label="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* تصاویر کوچک کارت‌ها */}
              <div className="flex flex-wrap gap-2 pt-2 pb-2 border-t border-[var(--luma-border)]">
                {reading.cards.map((c, i) => {
                  const card = getCardById(c.cardId);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-16 rounded-md overflow-hidden border border-[var(--luma-border)] bg-[var(--luma-bg-subtle)]">
                        {card ? (
                          <img
                            src={card.imagePath}
                            alt={c.name}
                            className={'w-full h-full object-cover ' + (c.isReversed ? 'rotate-180' : '')}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--luma-text-subtle)] text-[10px]">
                            ?
                          </div>
                        )}
                      </div>
                      <span className="text-[8px] text-[var(--luma-text-subtle)] max-w-[40px] truncate text-center">
                        {c.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* متن تفسیر (اگر موجود است) */}
              {reading.interpretation && (
                <div className="pt-2 border-t border-[var(--luma-border)]">
                  <p className="text-[11px] text-[var(--luma-text-muted)] leading-relaxed">
                    {reading.interpretation}
                  </p>
                </div>
              )}

              {/* توصیه (اگر موجود است) */}
              {reading.advice && (
                <div className="pt-2 mt-2 border-t border-[var(--luma-border)]">
                  <p className="text-[10px] text-[var(--luma-text-subtle)] italic">
                    💡 {reading.advice}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Button variant="secondary" fullWidth onClick={onBack}>
        بازگشت
      </Button>
    </div>
  );
}