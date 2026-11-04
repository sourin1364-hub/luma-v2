import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TarotSpreadSelector } from '../../components/tarot/TarotSpreadSelector';
import { TarotCardDeck } from '../../components/tarot/TarotCardDeck';
import { TarotResultScreen } from './TarotResultScreen';
import { TarotHistoryScreen } from './TarotHistoryScreen';
import { TarotLibraryModal } from './TarotLibraryModal';
import { SubscriptionScreen } from '../subscription/SubscriptionScreen';
import { saveReading } from './tarotHistoryService';
import { ALL_TAROT_CARDS, getSpreadById, TAROT_ENGINE_VERSION } from '../../engines/tarot';
import { synthesizeReading } from '../../engines/tarot/interpretation/engine';
import type { Spread, ReadingResult, DrawnCard, TarotCard } from '../../engines/tarot/types';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscription } from '../../hooks/useSubscription';
import { playCardSelectSound, playCardFlipSound, playDeckShuffleSound } from '../../utils/audio';
import { History, Sparkles, RotateCcw, Settings2, BookOpen } from 'lucide-react';

type TarotStep = 'select-spread' | 'draw-cards' | 'result' | 'history' | 'library' | 'subscription';

function shuffleDeck(cards: TarotCard[]): TarotCard[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function TarotScreen() {
  const user = useAuthStore((s) => s.user);
  const subscription = useSubscription();

  const [step, setStep] = useState<TarotStep>('select-spread');
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [question, setQuestion] = useState('');
  const [allowReversed, setAllowReversed] = useState(true);
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>(() => shuffleDeck(ALL_TAROT_CARDS));
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [shuffleKey, setShuffleKey] = useState<number>(0);
  const [readingResult, setReadingResult] = useState<ReadingResult | null>(null);

  const handleSelectSpread = (spread: Spread) => {
    if (!subscription.canUseSpread(spread.id)) {
      setStep('subscription');
      return;
    }
    setSelectedSpread(spread);
    setSelectedCardIds([]);
    setShuffledCards(shuffleDeck(ALL_TAROT_CARDS));
    setShuffleKey((prev) => prev + 1);
    playDeckShuffleSound();
    setStep('draw-cards');
  };

  const handleReshuffle = () => {
    setSelectedCardIds([]);
    setShuffledCards(shuffleDeck(ALL_TAROT_CARDS));
    setShuffleKey((prev) => prev + 1);
    playDeckShuffleSound();
  };

  const handleCardSelect = async (cardId: string) => {
    if (!selectedSpread) return;
    if (selectedCardIds.includes(cardId)) return;
    if (selectedCardIds.length >= selectedSpread.cardCount) return;

    playCardSelectSound();
    const updatedIds = [...selectedCardIds, cardId];
    setSelectedCardIds(updatedIds);

    if (updatedIds.length === selectedSpread.cardCount) {
      playCardFlipSound();

      const drawnCards: DrawnCard[] = updatedIds.map((id, index) => ({
        cardId: id,
        isReversed: allowReversed ? Math.random() < 0.3 : false,
        positionIndex: index,
      }));

      const result: ReadingResult = {
        spreadId: selectedSpread.id,
        question: question.trim() || selectedSpread.nameFa,
        drawnCards,
        createdAt: new Date().toISOString(),
        version: TAROT_ENGINE_VERSION || '1.0.0',
      };

      setReadingResult(result);

      if (user) {
        try {
          const synthesis = synthesizeReading(result);
          await saveReading(user.id, result, {
            summary: synthesis.narrative,
            advice: synthesis.advice,
            cards: [],
          } as any);
        } catch (err) {
          console.error('Error auto-saving tarot reading:', err);
        }
      }

      setTimeout(() => {
        setStep('result');
      }, 1500);
    }
  };

  const currentPosition = useMemo(() => {
    if (!selectedSpread) return null;
    const nextIdx = selectedCardIds.length;
    if (nextIdx < selectedSpread.positions.length) {
      return selectedSpread.positions[nextIdx];
    }
    return null;
  }, [selectedSpread, selectedCardIds]);

  if (step === 'subscription') {
    return <SubscriptionScreen onBack={() => setStep('select-spread')} />;
  }

  if (step === 'library') {
    return <TarotLibraryModal onBack={() => setStep('select-spread')} />;
  }

  if (step === 'history') {
    return (
      <TarotHistoryScreen
        onBack={() => setStep('select-spread')}
        onSelectReading={(savedResult) => {
          const sp = getSpreadById(savedResult.spreadId);
          if (sp) setSelectedSpread(sp);
          setReadingResult(savedResult);
          setStep('result');
        }}
      />
    );
  }

  if (step === 'result' && readingResult) {
    return (
      <TarotResultScreen
        readingResult={readingResult}
        onBack={() => {
          setReadingResult(null);
          setSelectedCardIds([]);
          setStep('select-spread');
        }}
      />
    );
  }

  if (step === 'draw-cards' && selectedSpread) {
    return (
      <div className="space-y-4 pb-24">
        <PageHeader
          title={selectedSpread.nameFa}
          subtitle={selectedSpread.description}
          onBack={() => setStep('select-spread')}
        />

        <Card variant="elevated" padding="md" className="space-y-3">
          <div>
            <label className="block text-xs text-[var(--luma-text-muted)] mb-1.5">
              نیت یا پرسش شما (اختیاری):
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="نیت کنید یا سوال خود را بنویسید..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] text-xs"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[var(--luma-border)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--luma-text-muted)]">
              <Settings2 className="w-3.5 h-3.5 text-[var(--luma-gold)]" />
              <span>احتمال کارت معکوس (۳۰٪)</span>
            </div>
            <button
              type="button"
              onClick={() => setAllowReversed((prev) => !prev)}
              className={
                'px-3 py-1 rounded-full text-[11px] font-medium transition-colors ' +
                (allowReversed
                  ? 'bg-[var(--luma-gold)]/20 text-[var(--luma-gold)] border border-[var(--luma-gold)]/40'
                  : 'bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)] border border-[var(--luma-border)]')
              }
            >
              {allowReversed ? 'فعال' : 'غیرفعال'}
            </button>
          </div>
        </Card>

        {currentPosition && (
          <Card variant="gold-border" padding="sm" className="text-center">
            <p className="text-xs font-bold text-[var(--luma-gold)] flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>
                کارت {selectedCardIds.length + 1}: {currentPosition.nameFa}
              </span>
            </p>
            <p className="text-[11px] text-[var(--luma-text-muted)] mt-1">
              {currentPosition.description}
            </p>
          </Card>
        )}

        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={handleReshuffle}>
            <RotateCcw className="w-3.5 h-3.5" />
            بر زدن مجدد کارت‌ها
          </Button>
        </div>

        <TarotCardDeck
          spreadId={selectedSpread.id}
          positions={selectedSpread.positions}
          cards={shuffledCards}
          selected={selectedCardIds}
          cardCount={selectedSpread.cardCount}
          shuffleKey={shuffleKey}
          onCardSelect={handleCardSelect}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-center justify-between gap-2">
        <PageHeader title="تاروت" subtitle="۱۳ چیدمان تخصصی و کتابخانه ۷۸ کارت" />
        <div className="flex items-center gap-1.5">
          <Button variant="secondary" size="sm" onClick={() => setStep('library')}>
            <BookOpen className="w-3.5 h-3.5" />
            کتابخانه
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setStep('history')}>
            <History className="w-3.5 h-3.5" />
            تاریخچه
          </Button>
        </div>
      </div>

      <TarotSpreadSelector
        onSelect={handleSelectSpread}
        canUseSpread={subscription.canUseSpread}
      />
    </div>
  );
}

