import type { TarotCard, ReadingResult, Spread } from './types';
import { getCardById } from './index';
import { getSpreadById } from './spreads';

export interface CardInterpretation {
  positionIndex: number;
  positionName: string;
  card: TarotCard;
  isReversed: boolean;
  meaning: string;
  keywords: string[];
}

export interface ReadingInterpretation {
  summary: string;
  cards: CardInterpretation[];
  advice: string;
  energy: 'positive' | 'neutral' | 'challenging';
}

const CHALLENGING_CARDS = new Set([
  'major-13-death',
  'major-15-devil',
  'major-16-tower',
  'swords-03',
  'swords-05',
  'swords-09',
  'swords-10',
  'cups-05',
  'pentacles-05'
]);

const POSITIVE_CARDS = new Set([
  'major-00-fool',
  'major-01-magician',
  'major-03-empress',
  'major-06-lovers',
  'major-07-chariot',
  'major-08-strength',
  'major-10-wheel',
  'major-14-temperance',
  'major-17-star',
  'major-19-sun',
  'major-21-world',
  'cups-02',
  'cups-03',
  'cups-06',
  'cups-09',
  'cups-10',
  'wands-01-ace',
  'wands-04',
  'wands-06',
  'wands-08',
  'pentacles-01-ace',
  'pentacles-06',
  'pentacles-09',
  'pentacles-10'
]);

function getCardEnergy(cardId: string, isReversed: boolean): 'positive' | 'neutral' | 'challenging' {
  if (isReversed) return 'challenging';
  if (POSITIVE_CARDS.has(cardId)) return 'positive';
  if (CHALLENGING_CARDS.has(cardId)) return 'challenging';
  return 'neutral';
}

function getOverallEnergy(
  cardInterpretations: CardInterpretation[]
): 'positive' | 'neutral' | 'challenging' {
  let positive = 0;
  let challenging = 0;

  cardInterpretations.forEach(ci => {
    const e = getCardEnergy(ci.card.id, ci.isReversed);
    if (e === 'positive') positive++;
    else if (e === 'challenging') challenging++;
  });

  if (positive > challenging) return 'positive';
  if (challenging > positive) return 'challenging';
  return 'neutral';
}

export function interpretReading(result: ReadingResult): ReadingInterpretation {
  const spread = getSpreadById(result.spreadId);
  if (!spread) {
    throw new Error('Spread not found: ' + result.spreadId);
  }

  const cardInterpretations: CardInterpretation[] = result.drawnCards.map(drawn => {
    const card = getCardById(drawn.cardId);
    if (!card) {
      throw new Error('Card not found: ' + drawn.cardId);
    }
    const position = spread.positions.find(p => p.index === drawn.positionIndex);
    const meaning = drawn.isReversed ? card.reversed.meaning : card.upright.meaning;
    const keywords = drawn.isReversed ? card.reversed.keywords : card.upright.keywords;

    return {
      positionIndex: drawn.positionIndex,
      positionName: position ? position.nameFa : 'کارت ' + (drawn.positionIndex + 1),
      card,
      isReversed: drawn.isReversed,
      meaning,
      keywords
    };
  });

  const energy = getOverallEnergy(cardInterpretations);

  // ساخت summary با ذکر نام موقعیت‌ها
  let summary = '';
  if (spread.cardCount === 1) {
    const ci = cardInterpretations[0];
    summary = ci.isReversed
      ? 'کارت ' + ci.card.nameFa + ' در موقعیت ' + ci.positionName + ' به‌صورت معکوس ظاهر شده است. ' + ci.meaning
      : 'کارت ' + ci.card.nameFa + ' در موقعیت ' + ci.positionName + ' پیام امروز شماست. ' + ci.meaning;
  } else {
    summary = 'این فال شامل ' + cardInterpretations.length + ' کارت است: ';
    summary += cardInterpretations
      .map(ci => ci.positionName + ': ' + ci.card.nameFa + (ci.isReversed ? ' (معکوس)' : ''))
      .join('، ');
    summary += '. ';
    if (energy === 'positive') summary += 'انرژی کلی این فال مثبت و امیدوارکننده است.';
    else if (energy === 'challenging') summary += 'این فال حاوی پیام‌های چالش‌برانگیزی است که نیاز به توجه دارد.';
    else summary += 'انرژی این فال متعادل است و پیام‌های متفاوتی در آن نهفته است.';
  }

  const advice = energy === 'positive'
    ? 'از این انرژی مثبت استفاده کنید و با اعتماد به خود قدم بردارید.'
    : energy === 'challenging'
    ? 'با دقت به پیام‌های این کارت‌ها گوش دهید و از تصمیم‌های شتابزده پرهیز کنید.'
    : 'با تعادل و آرامش به این کارت‌ها نگاه کنید و راه میانه را انتخاب کنید.';

  return {
    summary,
    cards: cardInterpretations,
    advice,
    energy
  };
}