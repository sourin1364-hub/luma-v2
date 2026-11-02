import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TarotSpreadSelector } from '../../components/tarot/TarotSpreadSelector';
import { TarotCardDeck } from '../../components/tarot/TarotCardDeck';
import { TarotRevealCard } from '../../components/tarot/TarotRevealCard';
import { TarotHistoryScreen } from './TarotHistoryScreen';
import { Sparkles, ArrowRight, History } from 'lucide-react';
import { performReading, interpretReading } from '../../engines/tarot';
import { synthesizeReading } from '../../engines/tarot/interpretation/index';
import type { ReadingSynthesis } from '../../engines/tarot/interpretation/index';
import type { Spread, ReadingResult, ReadingInterpretation } from '../../engines/tarot';
import { saveReading } from './tarotHistoryService';
import { useAuthStore } from '../../store/useAuthStore';

type Step = 'select-spread' | 'ask-question' | 'select-cards' | 'result' | 'history';

export function TarotScreen() {
  const user = useAuthStore((s) => s.user);
  const [step, setStep] = useState<Step>('select-spread');
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [interpretation, setInterpretation] = useState<ReadingInterpretation | null>(null);
  const [synthesis, setSynthesis] = useState<ReadingSynthesis | null>(null);

  const handleSelectSpread = (spread: Spread) => {
    setSelectedSpread(spread);
    setStep('ask-question');
  };

  const handleGoToSelectCards = () => {
    if (!selectedSpread) return;
    setStep('select-cards');
  };

  // این تابع async است تا بتوانیم await استفاده کنیم
  const handleCardsSelected = async (_indices: number[]) => {
    if (!selectedSpread) return;
    const result = performReading(selectedSpread, question);
    const interp = interpretReading(result);
    const synth = synthesizeReading(result);
    setReading(result);
    setInterpretation(interp);
    setSynthesis(synth);
    setStep('result');

    if (user) {
      try {
        await saveReading(user.id, result, interp);
      } catch (saveErr) {
        console.error('Save reading error:', saveErr);
      }
    }
  };

  const handleReset = () => {
    setStep('select-spread');
    setSelectedSpread(null);
    setQuestion('');
    setReading(null);
    setInterpretation(null);
  };

  if (step === 'history') {
    return <TarotHistoryScreen onBack={() => setStep('select-spread')} />;
  }

  if (step === 'select-spread') {
    return (
      <div className="space-y-5">
        <PageHeader
          title="تاروت"
          subtitle="چیدمان مورد نظر خود را انتخاب کنید"
          action={
            <Button variant="ghost" size="sm" onClick={() => setStep('history')}>
              <History className="w-4 h-4" />
              تاریخچه
            </Button>
          }
        />
        <TarotSpreadSelector onSelect={handleSelectSpread} />
      </div>
    );
  }

  if (step === 'ask-question' && selectedSpread) {
    return (
      <div className="space-y-5">
        <PageHeader
          title={selectedSpread.nameFa}
          subtitle={selectedSpread.description}
          onBack={handleReset}
        />
        <Card variant="elevated" padding="md">
          <label className="block text-sm text-[var(--luma-text)] mb-2 font-medium">
            پرسش شما (اختیاری)
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="اگر پرسشی دارید بنویسید..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors resize-none"
          />
        </Card>

        <Card variant="glass" padding="md" className="text-center">
          <p className="text-sm text-[var(--luma-text-muted)]">
            {selectedSpread.cardCount} کارت برای این چیدمان انتخاب می‌شود
          </p>
        </Card>

        <Button variant="gold" fullWidth size="lg" onClick={handleGoToSelectCards}>
          <Sparkles className="w-4 h-4" />
          شافل و انتخاب کارت‌ها
        </Button>
      </div>
    );
  }

  if (step === 'select-cards' && selectedSpread) {
    return (
      <div className="space-y-5">
        <PageHeader
          title="انتخاب کارت‌ها"
          subtitle={`${selectedSpread.nameFa} — ${selectedSpread.cardCount} کارت`}
          onBack={() => setStep('ask-question')}
        />
        <TarotCardDeck
          cardCount={selectedSpread.cardCount}
          onComplete={handleCardsSelected}
        />
      </div>
    );
  }

  if (step === 'result' && reading && interpretation && selectedSpread) {
    return (
      <div className="space-y-5">
        <PageHeader
          title={selectedSpread.nameFa}
          subtitle={question || 'فال شما'}
          onBack={handleReset}
        />

        <div className="space-y-6">
          {interpretation.cards.map((cardInterp, idx) => (
            <TarotRevealCard
              key={cardInterp.positionIndex}
              card={cardInterp.card}
              isReversed={cardInterp.isReversed}
              positionName={cardInterp.positionName}
              meaning={cardInterp.meaning}
              keywords={cardInterp.keywords}
              delay={idx * 0.3}
            />
          ))}
        </div>

        {/* جمع‌بندی حرفه‌ای بر اساس موتور جدید */}
        {synthesis && (
          <Card variant="gold-border" padding="md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-base text-[var(--luma-text)]">تحلیل جامع LUMA</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]">
                {synthesis.energyScore}/100
              </span>
            </div>

            {/* تم کلی */}
            <div className="flex flex-wrap gap-1 mb-3">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]">
                تم: {synthesis.overallTheme}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]">
                عنصر: {synthesis.dominantElement}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]">
                خال: {synthesis.dominantSuit}
              </span>
            </div>

            {/* روایت */}
            <div className="mb-3">
              <p className="text-xs text-[var(--luma-text-muted)] mb-1 font-medium">روایت فال:</p>
              <p className="text-sm text-[var(--luma-text)] leading-relaxed text-justify" dir="rtl">{synthesis.narrative}</p>
            </div>

            {/* توصیه */}
            <div className="pt-3 border-t border-[var(--luma-border)] mb-3">
              <p className="text-xs text-[var(--luma-gold)] mb-1 font-medium">💡 توصیه اصلی LUMA:</p>
              <p className="text-sm text-[var(--luma-text)] leading-relaxed text-justify" dir="rtl">{synthesis.advice}</p>
            </div>

            {/* هشدارها */}
            {synthesis.warnings.length > 0 && (
              <div className="pt-3 border-t border-[var(--luma-border)] mb-3">
                <p className="text-xs text-amber-400 mb-1 font-medium">⚠️ هشدارها:</p>
                <ul className="space-y-1">
                  {synthesis.warnings.map((w, i) => (
                    <li key={i} className="text-xs text-amber-400/80 leading-relaxed text-justify" dir="rtl">• {w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* affirmations */}
            {synthesis.affirmations.length > 0 && (
              <div className="pt-3 border-t border-[var(--luma-border)]">
                <p className="text-xs text-[var(--luma-gold)] mb-1 font-medium">✨ جملات تاکیدی:</p>
                <ul className="space-y-1">
                  {synthesis.affirmations.map((a, i) => (
                    <li key={i} className="text-xs text-[var(--luma-text-muted)] italic leading-relaxed text-justify" dir="rtl">«{a}»</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        <Button variant="secondary" fullWidth onClick={handleReset}>
          <ArrowRight className="w-4 h-4" />
          فال جدید
        </Button>
      </div>
    );
  }

  return null;
}