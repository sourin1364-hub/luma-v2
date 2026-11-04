import { useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowRight, Sparkles, AlertTriangle, Star, TrendingUp, Users } from 'lucide-react';
import { synthesizeReading } from '../../engines/tarot/interpretation/engine';
import type { ReadingResult } from '../../engines/tarot/types';

interface TarotResultScreenProps {
  readingResult: ReadingResult;
  onBack: () => void;
}

export function TarotResultScreen({ readingResult, onBack }: TarotResultScreenProps) {
  const baseUrl = import.meta.env.BASE_URL;

  const synthesis = useMemo(() => {
    try {
      return synthesizeReading(readingResult);
    } catch (error) {
      console.error('Error synthesizing reading:', error);
      return null;
    }
  }, [readingResult]);

  if (!synthesis) {
    return (
      <div className="space-y-5 pb-20">
        <PageHeader title="تفسیر فال" subtitle="خطا در تفسیر" onBack={onBack} />
        <div className="px-4">
          <Card className="p-5 text-center text-[var(--luma-text-muted)]">
            متاسفانه در تولید تفسیر خطایی رخ داد. لطفاً دوباره تلاش کنید.
          </Card>
        </div>
      </div>
    );
  }

  const energyColor = synthesis.energyScore >= 70 ? 'text-green-400' 
    : synthesis.energyScore <= 30 ? 'text-red-400' 
    : 'text-amber-400';

  return (
    <div className="space-y-5 pb-24">
      <PageHeader title="تفسیر فال" subtitle={synthesis.spreadName} onBack={onBack} />

      <div className="px-4 space-y-5">
        
        {/* بخش کارت‌ها */}
        <section className="space-y-4">
          <h3 className="font-heading text-lg text-[var(--luma-gold)] flex items-center gap-2">
            <Star className="w-5 h-5" />
            کارت‌های شما
          </h3>
          
          {synthesis.cards.map((cardContext, index) => {
            const imagePath = `${baseUrl}assets/tarot/cards/${cardContext.cardId}.webp`;
            
            return (
              <Card key={cardContext.cardId || index} className="p-4">
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-32 rounded-lg overflow-hidden border border-[var(--luma-gold)]/30 shadow-md flex-shrink-0 bg-[var(--luma-bg-subtle)]">
                    <img 
                      src={imagePath}
                      alt={cardContext.cardNameFa} 
                      className={`w-full h-full object-cover ${cardContext.isReversed ? 'rotate-180' : ''}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `${baseUrl}assets/tarot/cards/back.webp`;
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-heading text-base text-[var(--luma-text)]">
                        {cardContext.cardNameFa}
                      </h4>
                      {cardContext.isReversed && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                          معکوس
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--luma-gold)] mb-2 text-justify">موقعیت: {cardContext.positionName}</p>
                    <p className="text-sm text-[var(--luma-text)] leading-relaxed text-justify">
                      {cardContext.positionSpecificMeaning}
                    </p>
                    {cardContext.keywords && cardContext.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 text-justify">
                        {cardContext.keywords.slice(0, 4).map((kw, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        {/* تحلیل کلی */}
        <section>
          <Card className="p-4">
            <h3 className="font-heading text-base text-[var(--luma-gold)] mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              تحلیل کلی
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-justify">
              <div>
                <p className="text-xs text-[var(--luma-text-muted)] mb-1">تم کلی:</p>
                <p className="text-[var(--luma-text)]">{synthesis.overallTheme}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--luma-text-muted)] mb-1">امتیاز انرژی:</p>
                <p className={`font-bold ${energyColor}`}>{synthesis.energyScore} / 100</p>
              </div>
              <div>
                <p className="text-xs text-[var(--luma-text-muted)] mb-1">عنصر غالب:</p>
                <p className="text-[var(--luma-text)]">{synthesis.dominantElement}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--luma-text-muted)] mb-1">خال غالب:</p>
                <p className="text-[var(--luma-text)]">{synthesis.dominantSuit}</p>
              </div>
            </div>
          </Card>
        </section>

        {/* روایت */}
        <section>
          <Card className="p-4">
            <h3 className="font-heading text-base text-[var(--luma-gold)] mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              روایت ترکیبی
            </h3>
            <p className="text-sm text-[var(--luma-text)] leading-relaxed text-justify">
              {synthesis.narrative}
            </p>
          </Card>
        </section>

        {/* توصیه */}
        <section>
          <Card className="p-4 border-[var(--luma-gold)]/40">
            <h3 className="font-heading text-base text-[var(--luma-gold)] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              توصیه LUMA
            </h3>
            <p className="text-sm text-[var(--luma-text)] leading-relaxed text-justify">
              {synthesis.advice}
            </p>
          </Card>
        </section>

        {/* هشدارها */}
        {synthesis.warnings && synthesis.warnings.length > 0 && (
          <section>
            <Card className="p-4 border-amber-500/40 bg-amber-500/5">
              <h3 className="font-heading text-base text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                نکات قابل توجه
              </h3>
              <ul className="space-y-2">
                {synthesis.warnings.map((warning, i) => (
                  <li key={i} className="text-sm text-amber-300/90 leading-relaxed text-justify">
                    • {warning}
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}

        {/* جملات تاکیدی */}
        {synthesis.affirmations && synthesis.affirmations.length > 0 && (
          <section>
            <Card className="p-4">
              <h3 className="font-heading text-base text-[var(--luma-gold)] mb-3">
                ✨ جملات تاکیدی برای شما
              </h3>
              <ul className="space-y-2">
                {synthesis.affirmations.map((affirmation, i) => (
                  <li key={i} className="text-sm text-[var(--luma-text)] leading-relaxed italic text-justify">
                    "{affirmation}"
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}
      </div>

      <div className="px-4 mt-6">
        <Button 
          onClick={onBack} 
          className="w-full flex items-center justify-center gap-2 bg-[var(--luma-bg-elevated)] text-[var(--luma-text)] border border-[var(--luma-border)] py-3 rounded-xl"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به انتخاب کارت‌ها
        </Button>
      </div>
    </div>
  );
}
