// src/features/tarot/TarotResultScreen.tsx
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getCardById, getSpreadById } from '../../engines/tarot';
import { synthesizeReading } from '../../engines/tarot/interpretation/engine';
import type { ReadingResult } from '../../engines/tarot/types';
import { exportAndShareReadingImage } from '../../utils/shareAsImage';
import { getAssetUrl } from '../../utils/assetPath';
import { playCardFlipSound } from '../../utils/audio';
import {
  Sparkles,
  Lightbulb,
  RotateCcw,
  Image as ImageIcon,
  Flame,
  Layers,
  Compass,
  ShieldAlert,
  Quote,
} from 'lucide-react';
import { useLanguageStore, UI_TRANSLATIONS, translateNodeText } from '../../i18n/useLanguageStore';
import { getLocalizedCardName } from './tarotI18nResolver';

interface TarotResultScreenProps {
  readingResult: ReadingResult;
  onBack: () => void;
}

export function TarotResultScreen({ readingResult, onBack }: TarotResultScreenProps) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const [flippedIndices, setFlippedIndices] = useState<Record<number, boolean>>({});

  const spread = useMemo(
    () => getSpreadById(readingResult.spreadId),
    [readingResult.spreadId]
  );
  const isSpreadName = spread && (['fa', 'en', 'ar', 'ckb'] as const).some(
    (sourceLang) => translateNodeText(spread.nameFa, sourceLang) === readingResult.question
  );

  const synthesis = useMemo(
    () => synthesizeReading(readingResult, lang),
    [readingResult, lang]
  );

  const toggleCardFlip = (idx: number) => {
    playCardFlipSound();
    setFlippedIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleExportStoryImage = () => {
    const drawnCardsData = readingResult.drawnCards.map((d) => {
      const cardData = getCardById(d.cardId);
      const anyCard = cardData as any;
      const rawPath =
        anyCard?.image ||
        anyCard?.imageUrl ||
        anyCard?.imageSrc ||
        `assets/tarot/cards/${d.cardId}.webp`;

      const localizedName = getLocalizedCardName(cardData, lang);

      return {
        cardId: d.cardId,
        name: localizedName,
        imageUrl: getAssetUrl(rawPath),
        isReversed: d.isReversed,
      };
    });

    const cardNames = drawnCardsData.map(
      (c) => `${c.name}${c.isReversed ? ` (${t['tarot_ui_reversed']})` : ''}`
    );

    const storyNarrative = synthesis.narrative || '...';
    const spreadTitle = spread
      ? translateNodeText(spread.nameFa, lang)
      : t['tarot_result_title'];

    exportAndShareReadingImage({
      lang,
      drawnCards: drawnCardsData,
      title: spreadTitle,
      subtitle: cardNames.join(' • '),
      cardNames,
      summaryText: storyNarrative,
      adviceText: synthesis.advice,
    });
  };

  const backImg = getAssetUrl('assets/tarot/cards/back.webp');

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto px-3 sm:px-6">
      <PageHeader
        title={spread ? translateNodeText(spread.nameFa, lang) : t['tarot_result_title']}
        subtitle={
          isSpreadName && spread
            ? translateNodeText(spread.nameFa, lang)
            : readingResult.question || t['tarot_result_subtitle']
        }
        action={
          <Button variant="ghost" size="sm" onClick={onBack}>
            <RotateCcw className="w-4 h-4 ml-1" />
            {t['tarot_new_reading']}
          </Button>
        }
      />

      {/* نوار خلاصه انرژی‌های کیهانی چیدمان */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-2xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)]">
          <span className="flex items-center justify-center gap-1 text-[11px] text-[var(--luma-text-muted)] mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{t['tarot_result_dominant_element']}</span>
          </span>
          <p className="font-bold text-xs text-[var(--luma-gold)] truncate">{synthesis.dominantElement}</p>
        </div>

        <div className="p-3 rounded-2xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)]">
          <span className="flex items-center justify-center gap-1 text-[11px] text-[var(--luma-text-muted)] mb-1">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>{t['tarot_result_dominant_suit']}</span>
          </span>
          <p className="font-bold text-xs text-[var(--luma-text)] truncate">{synthesis.dominantSuit}</p>
        </div>

        <div className="p-3 rounded-2xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)]">
          <span className="flex items-center justify-center gap-1 text-[11px] text-[var(--luma-text-muted)] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t['tarot_result_energy_score']}</span>
          </span>
          <p className="font-bold text-xs text-emerald-400">%{synthesis.energyScore}</p>
        </div>
      </div>

      {/* نمایش بصری کارت‌های چیدمان */}
      <div className="flex flex-wrap justify-center items-stretch gap-4 my-2">
        {synthesis.cards.map((cCtx, idx) => {
          const card = getCardById(cCtx.cardId);
          const isFlipped = flippedIndices[idx];

          const cardImg = card
            ? getAssetUrl(
                (card as any).image ||
                  (card as any).imageUrl ||
                  `assets/tarot/cards/${card.id}.webp`
              )
            : backImg;

          return (
            <motion.div
              key={`${cCtx.cardId}-${idx}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="w-full sm:w-60 max-w-[260px] flex-1 flex flex-col"
            >
              <Card className="p-4 flex flex-col items-center text-center space-y-3 relative overflow-hidden bg-slate-900/50 border-[var(--luma-border)] backdrop-blur-md h-full">
                <div
                  className="w-36 sm:w-40 aspect-[1/1.65] relative cursor-pointer perspective mx-auto"
                  onClick={() => toggleCardFlip(idx)}
                >
                  <motion.div
                    className="w-full h-full relative"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-[var(--luma-gold)]/60 shadow-xl"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <img
                        src={cardImg}
                        alt={getLocalizedCardName(card, lang)}
                        className={`w-full h-full object-cover transition-transform ${
                          cCtx.isReversed ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    <div
                      className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-[var(--luma-gold)]/60 shadow-xl"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <img
                        src={backImg}
                        alt={t['tarot_ui_card_back']}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>

                <div className="pt-2 w-full">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)] font-bold mb-1.5 inline-block">
                    {cCtx.positionName}
                  </span>
                  <h3 className="font-bold text-base text-white mt-1">
                    {getLocalizedCardName(card, lang)}{' '}
                    {cCtx.isReversed && (
                      <span className="text-amber-400 text-xs font-normal">
                        ({t['tarot_ui_reversed']})
                      </span>
                    )}
                  </h3>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* بخش تحلیل اختصاصی و عمیق تک‌تک کارت‌های چیدمان */}
      <div className="space-y-4 pt-2">
        <h3 className="font-heading text-sm text-[var(--luma-gold)] font-bold flex items-center gap-2">
          <Compass className="w-4 h-4" />
          <span>{t['tarot_result_card_analysis']}</span>
        </h3>

        {synthesis.cards.map((cCtx, i) => (
          <Card key={i} variant="elevated" padding="md" className="border-white/10 space-y-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="font-bold text-xs text-[var(--luma-gold)]">
                {translateNodeText(cCtx.positionName, lang)}: «{getLocalizedCardName(getCardById(cCtx.cardId), lang)}» {cCtx.isReversed ? `(${t['tarot_ui_reversed']})` : ''}
              </span>
              <div className="flex flex-wrap gap-1">
                {cCtx.keywords?.slice(0, 2).map((kw, kIdx) => (
                  <span key={kIdx} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[var(--luma-text)] leading-relaxed text-justify">
              {cCtx.positionSpecificMeaning}
            </p>
          </Card>
        ))}
      </div>

      {/* بخش تحلیل کلان و یکپارچه چیدمان (Comprehensive Synthesis) */}
      <Card className="p-5 sm:p-6 space-y-4 border-[var(--luma-gold)]/40 bg-[var(--luma-bg-elevated)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-[var(--luma-gold)] font-bold text-sm sm:text-base">
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            <span>{t['tarot_comprehensive_reading']}</span>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-[var(--luma-gold)]/10 text-[var(--luma-gold)] border border-[var(--luma-gold)]/30 font-bold">
            {synthesis.overallTheme}
          </span>
        </div>

        <div className="text-xs sm:text-sm leading-relaxed text-slate-200 text-justify whitespace-pre-line space-y-3">
          {synthesis.narrative}
        </div>

        {synthesis.advice && (
          <div className="pt-4 border-t border-white/10 flex items-start gap-3 text-emerald-400 text-xs sm:text-sm">
            <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-300">{t['tarot_luma_advice']}: </span>
              <p className="text-slate-200 text-justify leading-relaxed">{synthesis.advice}</p>
            </div>
          </div>
        )}

        {synthesis.warnings && synthesis.warnings.length > 0 && (
          <div className="pt-3 border-t border-white/10 flex items-start gap-2.5 text-amber-400 text-xs sm:text-sm">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="text-slate-300 text-justify leading-relaxed">{synthesis.warnings[0]}</p>
          </div>
        )}

        {synthesis.affirmations && synthesis.affirmations.length > 0 && (
          <div className="pt-3 border-t border-white/10 flex items-start gap-2 text-purple-300 text-xs italic">
            <Quote className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="text-slate-300">{synthesis.affirmations[0]}</p>
          </div>
        )}
      </Card>

      {/* دکمه خروجی تصویر استوری */}
      <div className="flex justify-center pt-2">
        <Button
          size="lg"
          onClick={handleExportStoryImage}
          className="gap-2 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 hover:opacity-90 text-slate-950 font-extrabold shadow-xl shadow-amber-500/20 w-full sm:w-auto px-8 py-3.5"
        >
          <ImageIcon className="w-5 h-5" />
          <span>{t['tarot_get_story']}</span>
        </Button>
      </div>
    </div>
  );
}