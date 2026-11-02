import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TarotSpreadSelector } from '../../components/tarot/TarotSpreadSelector';
import { TarotCardDeck } from '../../components/tarot/TarotCardDeck';
import { TarotRevealCard } from '../../components/tarot/TarotRevealCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { performReading, interpretReading } from '../../engines/tarot';
import type { Spread, ReadingResult, ReadingInterpretation } from '../../engines/tarot';

type Step = 'select-spread' | 'ask-question' | 'select-cards' | 'result';

export function TarotScreen() {
  const [step, setStep] = useState<Step>('select-spread');
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [interpretation, setInterpretation] = useState<ReadingInterpretation | null>(null);

  const handleSelectSpread = (spread: Spread) => {
    setSelectedSpread(spread);
    setStep('ask-question');
  };

  const handleGoToSelectCards = () => {
    if (!selectedSpread) return;
    setStep('select-cards');
  };

  const handleCardsSelected = (_indices: number[]) => {
    if (!selectedSpread) return;
    // از performReading استفاده می‌کنیم (کارت‌ها با crypto انتخاب می‌شوند)
    const result = performReading(selectedSpread, question);
    const interp = interpretReading(result);
    setReading(result);
    setInterpretation(interp);
    setStep('result');
  };

  const handleReset = () => {
    setStep('select-spread');
    setSelectedSpread(null);
    setQuestion('');
    setReading(null);
    setInterpretation(null);
  };

  // مرحله ۱: انتخاب چیدمان
  if (step === 'select-spread') {
    return (
      <div className="space-y-5">
        <PageHeader title="تاروت" subtitle="چیدمان مورد نظر خود را انتخاب کنید" />
        <TarotSpreadSelector onSelect={handleSelectSpread} />
      </div>
    );
  }

  // مرحله ۲: پرسش
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

  // مرحله ۳: انتخاب کارت از دسته
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

  // مرحله ۴: نتیجه
  if (step === 'result' && reading && interpretation && selectedSpread) {
    return (
      <div className="space-y-5">
        <PageHeader
          title={selectedSpread.nameFa}
          subtitle={question || 'فال شما'}
          onBack={handleReset}
        />

        {/* کارت‌ها با انیمیشن برگردان */}
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

        {/* خلاصه */}
        <Card variant="gold-border" padding="md">
          <h3 className="font-heading text-base text-[var(--luma-text)] mb-2">جمع‌بندی</h3>
          <p className="text-sm text-[var(--luma-text-muted)] leading-relaxed mb-3">
            {interpretation.summary}
          </p>
          <div className="pt-3 border-t border-[var(--luma-border)]">
            <p className="text-xs text-[var(--luma-text-subtle)]">{interpretation.advice}</p>
          </div>
        </Card>

        <Button variant="secondary" fullWidth onClick={handleReset}>
          <ArrowRight className="w-4 h-4" />
          فال جدید
        </Button>
      </div>
    );
  }

  return null;
}