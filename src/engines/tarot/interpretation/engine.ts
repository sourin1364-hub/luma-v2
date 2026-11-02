import type {
  ReadingResult,
  TarotCard,
  Spread,
} from '../types';
import type {
  CardPositionContext,
  ReadingSynthesis,
  SpreadId,
} from './types';
import { generatePositionMeaning } from './meaningGenerator';
import { getCardById, getSpreadById } from '../index';

/**
 * تعیین نقش هر موقعیت در چیدمان (برای تحلیل)
 */
type PositionRole =
  | 'past' | 'present' | 'future'
  | 'situation' | 'obstacle' | 'advice'
  | 'mind' | 'heart' | 'action'
  | 'self' | 'other' | 'relationship' | 'outcome'
  | 'goal' | 'environment' | 'hopes-fears' | 'recent-past'
  | 'month' | 'answer';

function getPositionRole(spreadId: string, positionIndex: number): PositionRole {
  const maps: Record<string, PositionRole[]> = {
    'past-present-future': ['past', 'present', 'future'],
    'situation-obstacle-advice': ['situation', 'obstacle', 'advice'],
    'mind-heart-action': ['mind', 'heart', 'action'],
    'yes-no': ['answer'],
    'daily-card': ['present'],
    'single-card': ['answer'],
    'celtic-cross': ['situation', 'obstacle', 'past', 'future', 'goal', 'recent-past', 'self', 'environment', 'hopes-fears', 'outcome'],
    'horseshoe': ['past', 'present', 'obstacle', 'advice', 'environment', 'future', 'outcome'],
    'relationship': ['self', 'other', 'relationship', 'obstacle', 'outcome'],
    'career': ['situation', 'self', 'obstacle', 'goal', 'outcome'],
    'yearly': ['month', 'month', 'month', 'month', 'month', 'month', 'month', 'month', 'month', 'month', 'month', 'month'],
  };
  const roles = maps[spreadId];
  if (!roles) return 'present';
  return roles[positionIndex] || 'present';
}

/**
 * تحلیل عنصر غالب
 */
function analyzeDominantElement(cards: TarotCard[]): { name: string; count: number } {
  const counts: Record<string, number> = { fire: 0, earth: 0, air: 0, water: 0, spirit: 0 };
  cards.forEach(card => {
    if (card.element) counts[card.element] = (counts[card.element] || 0) + 1;
  });
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const namesFa: Record<string, string> = {
    fire: 'آتش', earth: 'خاک', air: 'هوا', water: 'آب', spirit: 'روح'
  };
  return { name: namesFa[dominant[0]] || 'متعادل', count: dominant[1] };
}

/**
 * تحلیل خال غالب
 */
function analyzeDominantSuit(cards: TarotCard[]): { name: string; count: number } {
  const counts: Record<string, number> = { major: 0, wands: 0, cups: 0, swords: 0, pentacles: 0 };
  cards.forEach(card => {
    counts[card.suit] = (counts[card.suit] || 0) + 1;
  });
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const namesFa: Record<string, string> = {
    major: 'آرکانای کبیر', wands: 'چوبدست‌ها', cups: 'جام‌ها',
    swords: 'شمشیرها', pentacles: 'سکه‌ها'
  };
  return { name: namesFa[dominant[0]] || 'متعادل', count: dominant[1] };
}

/**
 * محاسبه امتیاز انرژی
 */
function calculateEnergyScore(cards: TarotCard[], reversals: boolean[]): number {
  let score = 50;
  cards.forEach((card, idx) => {
    if (card.arcana === 'major') score += 5;
    if (reversals[idx]) score -= 10;
    else score += 5;
  });
  return Math.max(0, Math.min(100, score));
}

/**
 * تعیین تم کلی
 */
function determineOverallTheme(cards: TarotCard[], dominantSuit: string): string {
  if (cards.some(c => c.id === 'major-16-tower' || c.id === 'major-13-death')) {
    return 'دگرگونی و تحول عمیق';
  }
  if (cards.some(c => c.id === 'major-19-sun' || c.id === 'major-21-world')) {
    return 'موفقیت و کمال';
  }
  if (cards.some(c => c.id === 'major-18-moon' || c.id === 'major-02-high-priestess')) {
    return 'شهود و رازهای درون';
  }
  if (dominantSuit === 'جام‌ها') return 'عشق و احساسات';
  if (dominantSuit === 'شمشیرها') return 'چالش‌های ذهنی و تصمیم‌گیری';
  if (dominantSuit === 'چوبدست‌ها') return 'خلاقیت و اقدام';
  if (dominantSuit === 'سکه‌ها') return 'مادیات و ثبات';
  return 'سفری به سوی خودشناسی';
}

/**
 * ساخت روایت متنی از کارت‌ها (بر اساس نقش هر موقعیت)
 */
function buildNarrative(contexts: CardPositionContext[], spreadId: string, theme: string): string {
  const parts: string[] = [];
  parts.push(`این فال با تم "${theme}" آغاز می‌شود.`);

  contexts.forEach((c) => {
    const role = getPositionRole(spreadId, c.positionIndex);
    const reversedNote = c.isReversed ? ' (معکوس)' : '';
    let roleIntro = '';

    switch (role) {
      case 'past': roleIntro = 'در گذشته'; break;
      case 'present': roleIntro = 'در حال حاضر'; break;
      case 'future': roleIntro = 'در آینده'; break;
      case 'situation': roleIntro = 'وضعیت فعلی'; break;
      case 'obstacle': roleIntro = 'مانع اصلی'; break;
      case 'advice': roleIntro = 'راهکار پیشنهادی'; break;
      case 'mind': roleIntro = 'ذهن شما'; break;
      case 'heart': roleIntro = 'احساس شما'; break;
      case 'action': roleIntro = 'اقدام شما'; break;
      case 'self': roleIntro = 'نقش شما'; break;
      case 'other': roleIntro = 'نقش طرف مقابل'; break;
      case 'relationship': roleIntro = 'وضعیت رابطه'; break;
      case 'outcome': roleIntro = 'نتیجه نهایی'; break;
      case 'goal': roleIntro = 'هدف شما'; break;
      case 'environment': roleIntro = 'محیط'; break;
      case 'hopes-fears': roleIntro = 'امیدها و ترس‌ها'; break;
      case 'recent-past': roleIntro = 'گذشته نزدیک'; break;
      case 'month': roleIntro = c.positionName; break;
      case 'answer': roleIntro = 'پاسخ'; break;
      default: roleIntro = c.positionName;
    }

    parts.push(`${roleIntro} با کارت ${c.cardNameFa}${reversedNote} نشان داده می‌شود: ${c.positionSpecificMeaning}`);
  });

  return parts.join(' ');
}

/**
 * ساخت توصیه نهایی (بر اساس نقش راهکار/آینده/نتیجه)
 */
function buildAdvice(
  contexts: CardPositionContext[],
  spreadId: string,
  energyScore: number,
  theme: string
): string {
  // جستجوی کارت راهکار
  const adviceCard = contexts.find(c => getPositionRole(spreadId, c.positionIndex) === 'advice');
  const outcomeCard = contexts.find(c => getPositionRole(spreadId, c.positionIndex) === 'outcome');
  const futureCard = contexts.find(c => getPositionRole(spreadId, c.positionIndex) === 'future');

  const keyCard = adviceCard || outcomeCard || futureCard;

  if (keyCard) {
    const reversedNote = keyCard.isReversed ? ' (معکوس)' : '';
    return `توصیه اصلی LUMA: کارت "${keyCard.cardNameFa}"${reversedNote} در موقعیت "${keyCard.positionName}" به شما می‌گوید که ${keyCard.positionSpecificMeaning} این راهکار را جدی بگیرید و بر اساس آن قدم بردارید.`;
  }

  // اگر کارت کلیدی نبود، از تم و امتیاز انرژی استفاده کن
  if (energyScore >= 70) {
    return `انرژی کلی این فال مثبت و قدرتمند است. تم "${theme}" نشان می‌دهد که شما در مسیر درستی قرار دارید. از این انرژی برای برداشتن قدم‌های بزرگ استفاده کنید و به شهود خود اعتماد کنید.`;
  }
  if (energyScore <= 30) {
    return `این فال نشان می‌دهد که با چالش‌هایی روبرو هستید. تم "${theme}" از شما می‌خواهد که با صبر و آرامش به موقعیت نگاه کنید و از تصمیم‌های شتابزده پرهیز کنید.`;
  }
  return `این فال متعادل است. تم "${theme}" نشان می‌دهد که باید بین عقل و احساس تعادل برقرار کنید. با گام‌های کوچک و مطمئن پیش بروید.`;
}

/**
 * ساخت هشدارها (بر اساس کارت‌های چالش‌برانگیز در موقعیت‌های حساس)
 */
function buildWarnings(contexts: CardPositionContext[], spreadId: string): string[] {
  const warnings: string[] = [];
  const challengingCards = ['The Tower', 'The Devil', 'Death', 'Ten of Swords', 'Nine of Swords', 'Three of Swords'];

  contexts.forEach(c => {
    const role = getPositionRole(spreadId, c.positionIndex);
    if (role === 'obstacle' && challengingCards.includes(c.cardNameEn)) {
      warnings.push(`هشدار در موقعیت "${c.positionName}": کارت ${c.cardNameFa} نشان می‌دهد که این مانع جدی است و نیاز به توجه فوری دارد.`);
    }
    if (role === 'outcome' && c.isReversed && challengingCards.includes(c.cardNameEn)) {
      warnings.push(`هشدار در نتیجه نهایی: کارت ${c.cardNameFa} (معکوس) نشان می‌دهد که نتیجه ممکن است چالش‌برانگیز باشد.`);
    }
  });

  return warnings;
}

/**
 * ساخت affirmations (بر اساس کارت‌های مثبت در موقعیت‌های قدرت)
 */
function buildAffirmations(contexts: CardPositionContext[], spreadId: string): string[] {
  const affirmations: string[] = [];
  const positiveCards = ['The Sun', 'The Star', 'The World', 'Strength', 'The Magician', 'The Empress', 'The Emperor'];

  contexts.forEach(c => {
    if (!c.isReversed && positiveCards.includes(c.cardNameEn)) {
      const role = getPositionRole(spreadId, c.positionIndex);
      if (role === 'advice' || role === 'outcome' || role === 'future' || role === 'present') {
        affirmations.push(`من از انرژی کارت ${c.cardNameFa} در موقعیت ${c.positionName} برای رشد خود استفاده می‌کنم.`);
      }
    }
  });

  if (affirmations.length === 0) {
    affirmations.push('من در مسیر خودشناسی و رشد قرار دارم.');
  }
  return affirmations;
}

/**
 * موتور اصلی تجمیع قطعی
 */
export function synthesizeReading(reading: ReadingResult): ReadingSynthesis {
  const spread = getSpreadById(reading.spreadId);
  if (!spread) throw new Error('Spread not found: ' + reading.spreadId);

  const cards: TarotCard[] = [];
  const reversals: boolean[] = [];
  const contexts: CardPositionContext[] = [];

  reading.drawnCards.forEach((drawn) => {
    const card = getCardById(drawn.cardId);
    if (!card) return;
    cards.push(card);
    reversals.push(drawn.isReversed);

    const position = spread.positions.find(p => p.index === drawn.positionIndex);
    const positionMeaning = generatePositionMeaning(
      reading.spreadId,
      drawn.positionIndex,
      card,
      drawn.isReversed
    );
    const keywords = drawn.isReversed ? card.reversed.keywords : card.upright.keywords;

    contexts.push({
      cardId: card.id,
      cardNameFa: card.nameFa,
      cardNameEn: card.nameEn,
      isReversed: drawn.isReversed,
      positionIndex: drawn.positionIndex,
      positionName: position?.nameFa || `کارت ${drawn.positionIndex + 1}`,
      baseMeaning: drawn.isReversed ? card.reversed.meaning : card.upright.meaning,
      positionSpecificMeaning: positionMeaning,
      keywords,
    });
  });

  const dominantElement = analyzeDominantElement(cards);
  const dominantSuit = analyzeDominantSuit(cards);
  const energyScore = calculateEnergyScore(cards, reversals);
  const overallTheme = determineOverallTheme(cards, dominantSuit.name);
  const narrative = buildNarrative(contexts, reading.spreadId, overallTheme);
  const advice = buildAdvice(contexts, reading.spreadId, energyScore, overallTheme);
  const warnings = buildWarnings(contexts, reading.spreadId);
  const affirmations = buildAffirmations(contexts, reading.spreadId);

  return {
    spreadId: reading.spreadId as SpreadId,
    spreadName: spread.nameFa,
    question: reading.question,
    cards: contexts,
    overallTheme,
    dominantElement: dominantElement.name,
    dominantSuit: dominantSuit.name,
    energyScore,
    narrative,
    advice,
    warnings,
    affirmations,
  };
}