# LUMA v2 - Full Project Audit Report
Generated at: 2026-11-03 18:34:16

---

## 1. ساختار پوشه‌ها (درخت کامل)

\\\
"@

# درخت پوشه‌ها
 = Get-ChildItem -Path ".\src" -Recurse -Directory | Select-Object -ExpandProperty FullName
foreach ( in ) {
     = .Replace(C:\Users\ROYAL\Desktop\luma-v2, "")
     += "
"
}

 += @"
\\\

---

## 2. لیست کامل فایل‌های TypeScript/TSX
- **\src\App.tsx** (2.4 KB)
- **\src\components\layout\AppLayout.tsx** (1.9 KB)
- **\src\components\layout\BottomNav.tsx** (2.2 KB)
- **\src\components\tarot\TarotCardDeck.tsx** (2.5 KB)
- **\src\components\tarot\TarotRevealCard.tsx** (1.9 KB)
- **\src\components\tarot\TarotSpreadSelector.tsx** (2.4 KB)
- **\src\components\ui\Button.tsx** (2.3 KB)
- **\src\components\ui\Card.tsx** (1.1 KB)
- **\src\components\ui\ChartInterpretation.tsx** (11.7 KB)
- **\src\components\ui\ChartWheel.tsx** (7.8 KB)
- **\src\components\ui\CityPicker.tsx** (7.4 KB)
- **\src\components\ui\DatePickerJalaali.tsx** (2.6 KB)
- **\src\components\ui\Logo.tsx** (0.9 KB)
- **\src\components\ui\PageHeader.tsx** (1.1 KB)
- **\src\components\ui\TimePicker.tsx** (1.6 KB)
- **\src\components\ui\WheelPicker.tsx** (4.6 KB)
- **\src\engines\astronomy\angles.ts** (2.1 KB)
- **\src\engines\astronomy\aspects.ts** (1.5 KB)
- **\src\engines\astronomy\chart.ts** (0.9 KB)
- **\src\engines\astronomy\constants.ts** (12.9 KB)
- **\src\engines\astronomy\houses.ts** (2.7 KB)
- **\src\engines\astronomy\index.ts** (0.2 KB)
- **\src\engines\astronomy\planets.ts** (1.9 KB)
- **\src\engines\astronomy\types.ts** (1.4 KB)
- **\src\engines\birthstone\data.ts** (9 KB)
- **\src\engines\birthstone\index.ts** (0 KB)
- **\src\engines\birthstone\types.ts** (0.1 KB)
- **\src\engines\calendar\format.ts** (1.2 KB)
- **\src\engines\calendar\index.ts** (0.2 KB)
- **\src\engines\calendar\jalaali.ts** (1.9 KB)
- **\src\engines\calendar\jalaali-core.ts** (3 KB)
- **\src\engines\calendar\timezone.ts** (1.1 KB)
- **\src\engines\calendar\types.ts** (0.6 KB)
- **\src\engines\chinese\constants.ts** (9.2 KB)
- **\src\engines\chinese\index.ts** (0.1 KB)
- **\src\engines\chinese\types.ts** (0.8 KB)
- **\src\engines\chinese\zodiac.ts** (2.5 KB)
- **\src\engines\location\cities.ts** (3.3 KB)
- **\src\engines\location\index.ts** (0 KB)
- **\src\engines\location\types.ts** (0.4 KB)
- **\src\engines\numerology\abjad.ts** (1.4 KB)
- **\src\engines\numerology\constants.ts** (4.9 KB)
- **\src\engines\numerology\index.ts** (0.3 KB)
- **\src\engines\numerology\lifePath.ts** (0.8 KB)
- **\src\engines\numerology\types.ts** (0.4 KB)
- **\src\engines\tarot\constants.ts** (0.5 KB)
- **\src\engines\tarot\cups.ts** (13.6 KB)
- **\src\engines\tarot\draw.ts** (2 KB)
- **\src\engines\tarot\index.ts** (1.5 KB)
- **\src\engines\tarot\interpretation.ts** (4.6 KB)
- **\src\engines\tarot\interpretation\engine.ts** (12.2 KB)
- **\src\engines\tarot\interpretation\index.ts** (0.2 KB)
- **\src\engines\tarot\interpretation\meaningGenerator.ts** (1.6 KB)
- **\src\engines\tarot\interpretation\positionMeanings.ts** (10.8 KB)
- **\src\engines\tarot\interpretation\positionTemplates.ts** (5.7 KB)
- **\src\engines\tarot\interpretation\types.ts** (1 KB)
- **\src\engines\tarot\majorArcana.ts** (12.3 KB)
- **\src\engines\tarot\majorArcanaPart2.ts** (10.1 KB)
- **\src\engines\tarot\pentacles.ts** (13.9 KB)
- **\src\engines\tarot\spreads.ts** (8.2 KB)
- **\src\engines\tarot\swords.ts** (13.4 KB)
- **\src\engines\tarot\types.ts** (1 KB)
- **\src\engines\tarot\wands.ts** (13.6 KB)
- **\src\engines\zodiac\index.ts** (3.8 KB)
- **\src\features\admin\AdminScreen.tsx** (9.8 KB)
- **\src\features\admin\adminService.ts** (2.3 KB)
- **\src\features\auth\AuthScreen.tsx** (14.3 KB)
- **\src\features\auth\authService.ts** (3.9 KB)
- **\src\features\auth\types.ts** (0.3 KB)
- **\src\features\chart\ChartScreen.tsx** (9.1 KB)
- **\src\features\chart\chartService.ts** (2.6 KB)
- **\src\features\chart\ZodiacScreen.tsx** (14.9 KB)
- **\src\features\chinese\ChineseScreen.tsx** (5.6 KB)
- **\src\features\home\DailyCardSection.tsx** (3.3 KB)
- **\src\features\home\HomeScreen.tsx** (3.9 KB)
- **\src\features\numerology\NumerologyScreen.tsx** (8.3 KB)
- **\src\features\profile\AvatarPicker.tsx** (5.8 KB)
- **\src\features\profile\ProfileScreen.tsx** (13.6 KB)
- **\src\features\profile\profileService.ts** (3.7 KB)
- **\src\features\profile\types.ts** (0.4 KB)
- **\src\features\subscription\SubscriptionBadge.tsx** (3.2 KB)
- **\src\features\subscription\SubscriptionScreen.tsx** (4.7 KB)
- **\src\features\tarot\TarotHistoryScreen.tsx** (6 KB)
- **\src\features\tarot\tarotHistoryService.ts** (2.3 KB)
- **\src\features\tarot\TarotResultScreen.tsx** (8.8 KB)
- **\src\features\tarot\TarotScreen.tsx** (2.5 KB)
- **\src\hooks\useSubscription.ts** (2 KB)
- **\src\lib\supabase.ts** (0.5 KB)
- **\src\main.tsx** (0.6 KB)
- **\src\store\useAuthStore.ts** (0.5 KB)
- **\src\utils\assetPath.ts** (0.3 KB)

---

## 3. محتوای کامل فایل‌های کلیدی (Tarot & Location)

### 3.1 src/engines/tarot/types.ts
\\\	ypescriptexport type Arcana = 'major' | 'minor';
export type Suit = 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
export type TarotElement = 'fire' | 'water' | 'air' | 'earth' | 'spirit';

export interface CardMeaning {
  meaning: string;
  keywords: string[];
}

export interface TarotCard {
  id: string;
  nameEn: string;
  nameFa: string;
  arcana: Arcana;
  suit: Suit;
  number: number;
  imagePath: string;
  keywords: string[];
  upright: CardMeaning;
  reversed: CardMeaning;
  element?: TarotElement;
  planet?: string;
  astrology?: string;
}

export interface SpreadPosition {
  index: number;
  nameFa: string;
  description: string;
}

export interface Spread {
  id: string;
  nameFa: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface DrawnCard {
  cardId: string;
  isReversed: boolean;
  positionIndex: number;
}

export interface ReadingResult {
  spreadId: string;
  question: string;
  drawnCards: DrawnCard[];
  createdAt: string;
  version: string;
}\\\

### 3.2 src/engines/tarot/constants.ts
\\\	ypescriptexport const SUIT_NAMES_FA = {
  major: 'آرکانای کبیر',
  wands: 'چوبدست‌ها',
  cups: 'جام‌ها',
  swords: 'شمشیرها',
  pentacles: 'سکه‌ها'
} as const;

export const SUIT_ELEMENTS = {
  major: 'spirit',
  wands: 'fire',
  cups: 'water',
  swords: 'air',
  pentacles: 'earth'
} as const;

export const TAROT_ENGINE_VERSION = '1.0.0';

export const TOTAL_CARDS = 78;
export const MAJOR_COUNT = 22;
export const MINOR_COUNT = 56;\\\

### 3.3 src/engines/tarot/majorArcana.ts (اولین ۵۰ خط)
\\\	ypescriptimport type { TarotCard } from './types';

export const MAJOR_ARCANA_PART_1: TarotCard[] = [
  {
    id: 'major-00-fool',
    nameEn: 'The Fool',
    nameFa: 'احمق',
    arcana: 'major',
    suit: 'major',
    number: 0,
    imagePath: '{BASE_URL}/tarot/cards/major-00-fool.webp',
    keywords: ['آغاز', 'بی‌پروایی', 'ماجراجویی', 'ایمان', 'آزادی'],
    upright: {
      meaning: 'آغازی تازه، سفری به ناشناخته‌ها، ایمان به آینده و رهایی از قید و بند. احمق نماد innocence و اعتماد به کائنات است. زمانه‌ای برای شروع دوباره و پذیرش ریسک.',
      keywords: ['شروع تازه', 'ماجراجویی', 'خودانگیختگی', 'خوش‌بینی']
    },
    reversed: {
      meaning: 'بی‌احتیاطی، ترس از شروع، تعلل، یا رفتار کودکانه. ممکن است نشان‌دهنده سردرگمی در تصمیم‌گیری یا عدم اعتماد به شهود باشد.',
      keywords: ['ترس', 'تعلل', 'بی‌احتیاطی', 'عدم تعهد']
    },
    element: 'air',
    planet: 'اورانوس',
    astrology: 'اورانوس'
  },
  {
    id: 'major-01-magician',
    nameEn: 'The Magician',
    nameFa: 'جادوگر',
    arcana: 'major',
    suit: 'major',
    number: 1,
    imagePath: '{BASE_URL}/tarot/cards/major-01-magician.webp',
    keywords: ['اراده', 'قدرت', 'مهارت', 'عمل', 'خلاقیت'],
    upright: {
      meaning: 'توانایی، مهارت و اراده برای خلق واقعیت. جادوگر نماد قدرت تمرکز و استفاده از همه ابزارهای موجود است. زمانه‌ای برای اقدام و تبدیل ایده به واقعیت.',
      keywords: ['اقتدار', 'خلاقیت', 'عمل', 'تمرکز']
    },
    reversed: {
      meaning: 'دستکاری، فریب، استفاده نادرست از قدرت، یا عدم تمرکز. ممکن است نشان‌دهنده اتلاف استعداد یا ناتوانی در اقدام باشد.',
      keywords: ['فریب', 'دستکاری', 'عدم تمرکز', 'اتلاف استعداد']
    },
    element: 'air',
    planet: 'عطارد',
    astrology: 'عطارد'
  },
  {
    id: 'major-02-high-priestess',
    nameEn: 'The High Priestess',
    nameFa: 'کاهن اعظم',
    arcana: 'major',
\\\

### 3.4 src/engines/tarot/index.ts
\\\	ypescriptimport { MAJOR_ARCANA_PART_1 } from './majorArcana';
import { MAJOR_ARCANA_PART_2 } from './majorArcanaPart2';
import { WANDS_CARDS } from './wands';
import { CUPS_CARDS } from './cups';
import { SWORDS_CARDS } from './swords';
import { PENTACLES_CARDS } from './pentacles';
import type { TarotCard } from './types';

export * from './types';
export * from './constants';
export * from './majorArcana';
export * from './majorArcanaPart2';
export * from './wands';
export * from './cups';
export * from './swords';
export * from './pentacles';
export * from './spreads';
export * from './draw';
export * from './interpretation';

export const MAJOR_ARCANA: TarotCard[] = [
  ...MAJOR_ARCANA_PART_1,
  ...MAJOR_ARCANA_PART_2
];

export const ALL_TAROT_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...WANDS_CARDS,
  ...CUPS_CARDS,
  ...SWORDS_CARDS,
  ...PENTACLES_CARDS
];

export function getMajorCard(id: string): TarotCard | undefined {
  return MAJOR_ARCANA.find((c) => c.id === id);
}

export function getAllMajorCards(): TarotCard[] {
  return [...MAJOR_ARCANA];
}

export function getWandsCards(): TarotCard[] {
  return [...WANDS_CARDS];
}

export function getCupsCards(): TarotCard[] {
  return [...CUPS_CARDS];
}

export function getSwordsCards(): TarotCard[] {
  return [...SWORDS_CARDS];
}

export function getPentaclesCards(): TarotCard[] {
  return [...PENTACLES_CARDS];
}

export function getCardById(id: string): TarotCard | undefined {
  return ALL_TAROT_CARDS.find((c) => c.id === id);
}\\\

### 3.5 src/engines/tarot/interpretation/engine.ts
\\\	ypescriptimport type {
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
}\\\

### 3.6 src/engines/tarot/interpretation/types.ts
\\\	ypescriptimport type { PlanetName } from '../../astronomy/types';

export type SpreadId =
  | 'daily-card'
  | 'single-card'
  | 'past-present-future'
  | 'situation-obstacle-advice'
  | 'mind-heart-action'
  | 'yes-no'
  | 'celtic-cross'
  | 'horseshoe'
  | 'relationship'
  | 'career'
  | 'yearly';

export interface PositionMeaning {
  positionIndex: number;
  positionName: string;
  meaning: string;
}

export interface CardPositionContext {
  cardId: string;
  cardNameFa: string;
  cardNameEn: string;
  isReversed: boolean;
  positionIndex: number;
  positionName: string;
  baseMeaning: string;
  positionSpecificMeaning: string;
  keywords: string[];
}

export interface ReadingSynthesis {
  spreadId: SpreadId;
  spreadName: string;
  question: string;
  cards: CardPositionContext[];
  overallTheme: string;
  dominantElement: string;
  dominantSuit: string;
  energyScore: number;
  narrative: string;
  advice: string;
  warnings: string[];
  affirmations: string[];
}\\\

---

## 4. محتوای کامل فایل‌های Location

### 4.1 src/engines/location/types.ts
\\\	ypescriptexport interface City {
  id: number;
  name: string;
  en_name: string;
  province_id: number;
  lat: number | string;
  lon: number | string;
}

export interface Province {
  id: number;
  name: string;
  en_name: string;
}

export interface CityWithProvince extends City {
  lat: number;
  lon: number;
  province_name: string;
  timezone: string;
}\\\

### 4.2 src/engines/location/cities.ts
\\\	ypescriptimport type { CityWithProvince } from './types';

let citiesCache: CityWithProvince[] | null = null;
let provincesCache: any[] | null = null;

/**
 * دریافت لیست استان‌ها از فایل JSON
 */
export async function getProvinces(): Promise<any[]> {
  if (provincesCache) return provincesCache;
  
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/iran-provinces.json`);
    if (!response.ok) throw new Error('Failed to fetch provinces');
    const data = await response.json();
    provincesCache = data;
    return data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    return [];
  }
}

/**
 * دریافت لیست کامل شهرها از فایل JSON
 * همچنین مختصات را به عدد تبدیل می‌کند و نام استان را اضافه می‌کند
 */
export async function getAllCities(): Promise<CityWithProvince[]> {
  if (citiesCache) return citiesCache;
  
  try {
    const [citiesRes, provincesRes] = await Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/iran-cities.json`),
      fetch(`${import.meta.env.BASE_URL}data/iran-provinces.json`)
    ]);
    
    if (!citiesRes.ok || !provincesRes.ok) throw new Error('Failed to fetch data');
    
    const rawCities = await citiesRes.json();
    const provinces = await provincesRes.json();
    
    // ساخت نقشه استان‌ها
    const provinceMap: Record<number, string> = {};
    provinces.forEach((p: any) => {
      provinceMap[p.id] = p.name;
    });
    
    // تبدیل داده‌های خام به CityWithProvince
    const processedCities: CityWithProvince[] = rawCities.map((city: any) => ({
      id: Number(city.id),
      name: city.name,
      en_name: city.en_name || '',
      province_id: Number(city.province_id),
      province_name: provinceMap[Number(city.province_id)] || '',
      lat: parseFloat(String(city.lat)),
      lon: parseFloat(String(city.lon)),
      timezone: 'Asia/Tehran',
    }));
    
    citiesCache = processedCities;
    return processedCities;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

/**
 * جستجوی شهرها بر اساس نام
 */
export async function searchCities(query: string, limit: number = 10): Promise<CityWithProvince[]> {
  const cities = await getAllCities();
  const normalizedQuery = query.trim().toLowerCase();
  
  if (!normalizedQuery) return [];
  
  return cities
    .filter(city => 
      city.name.toLowerCase().includes(normalizedQuery) ||
      city.en_name?.toLowerCase().includes(normalizedQuery) ||
      city.province_name?.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, limit);
}

/**
 * پیدا کردن نزدیک‌ترین شهر به مختصات داده‌شده
 */
export async function findNearestCity(lat: number, lon: number): Promise<CityWithProvince | null> {
  const cities = await getAllCities();
  if (cities.length === 0) return null;

  let nearest: CityWithProvince | null = null;
  let minDistance = Infinity;

  for (const city of cities) {
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + 
      Math.pow(city.lon - lon, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  return nearest;
}
\\\

### 4.3 src/engines/location/index.ts
\\\	ypescriptexport * from './types';
export * from './cities';\\\

---

## 5. محتوای کامل فایل‌های Tarot Screen/Components

### 5.1 src/features/tarot/TarotScreen.tsx
\\\	sximport { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { TarotCardDeck } from '../../components/tarot/TarotCardDeck';
import { Button } from '../../components/ui/Button';
import { TarotResultScreen } from './TarotResultScreen';
import { Sparkles } from 'lucide-react';
import type { DrawnCard, ReadingResult } from '../../engines/tarot/types';

interface TarotScreenProps {
  onBack: () => void;
}

const SPREAD_ID = 'past-present-future';
const REQUIRED_CARDS = 3;
const SPREAD_VERSION = '1.0.0';

export function TarotScreen({ onBack }: TarotScreenProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [readingResult, setReadingResult] = useState<ReadingResult | null>(null);

  const handleCardSelect = (id: string) => {
    if (selectedCards.includes(id)) {
      setSelectedCards(selectedCards.filter(c => c !== id));
    } else {
      if (selectedCards.length < REQUIRED_CARDS) {
        setSelectedCards([...selectedCards, id]);
      }
    }
  };

  const handleGenerateReading = () => {
    const drawnCards: DrawnCard[] = selectedCards.map((cardId, index) => ({
      cardId,
      isReversed: false,
      positionIndex: index,
    }));

    const result: ReadingResult = {
      spreadId: SPREAD_ID,
      question: 'فال سه کارتی',
      drawnCards,
      createdAt: new Date().toISOString(),
      version: SPREAD_VERSION,
    };

    console.log('Generated ReadingResult:', result); // برای دیباگ
    setReadingResult(result);
  };

  if (readingResult) {
    return (
      <TarotResultScreen
        readingResult={readingResult}
        onBack={() => setReadingResult(null)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="فال تاروت" subtitle="کارت‌های خود را انتخاب کنید" onBack={onBack} />

      <TarotCardDeck
        selected={selectedCards}
        cardCount={REQUIRED_CARDS}
        onCardSelect={handleCardSelect}
      />

      {selectedCards.length === REQUIRED_CARDS && (
        <div className="px-4 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Button
            onClick={handleGenerateReading}
            className="w-full bg-[var(--luma-gold)] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            مشاهده تفسیر
          </Button>
        </div>
      )}
    </div>
  );
}
\\\

### 5.2 src/features/tarot/TarotResultScreen.tsx
\\\	sximport { useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowRight, Sparkles, AlertTriangle, Star, TrendingUp, Users } from 'lucide-react';
import { synthesizeReading } from '../../engines/tarot/interpretation/engine';
import type { ReadingResult } from '../../engines/tarot/types';
import { getCardById } from '../../engines/tarot';

interface TarotResultScreenProps {
  readingResult: ReadingResult;
  onBack: () => void;
}

export function TarotResultScreen({ readingResult, onBack }: TarotResultScreenProps) {
  const baseUrl = import.meta.env.BASE_URL;

  // استفاده از موتور تفسیر اصلی LUMA
  const synthesis = useMemo(() => {
    try {
      const result = synthesizeReading(readingResult);
      console.log('Synthesis Result:', result);
      return result;
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

  // رنگ بر اساس امتیاز انرژی
  const energyColor = synthesis.energyScore >= 70 ? 'text-green-400' 
    : synthesis.energyScore <= 30 ? 'text-red-400' 
    : 'text-amber-400';

  return (
    <div className="space-y-5 pb-24">
      <PageHeader title="تفسیر فال" subtitle={synthesis.spreadName} onBack={onBack} />

      <div className="px-4 space-y-5">
        
        {/* --- بخش 1: کارت‌ها --- */}
        <section className="space-y-4">
          <h3 className="font-heading text-lg text-[var(--luma-gold)] flex items-center gap-2">
            <Star className="w-5 h-5" />
            کارت‌های شما
          </h3>
          
          {/* اگر synthesis.cards خالی بود، از readingResult.drawnCards استفاده کن */}
          {(synthesis.cards && synthesis.cards.length > 0 ? synthesis.cards : readingResult.drawnCards.map((dc, idx) => {
            const card = getCardById(dc.cardId);
            return {
              cardId: dc.cardId,
              cardNameFa: card?.nameFa || `کارت ${idx + 1}`,
              cardNameEn: card?.nameEn || '',
              isReversed: dc.isReversed,
              positionIndex: dc.positionIndex,
              positionName: `موقعیت ${idx + 1}`,
              baseMeaning: '',
              positionSpecificMeaning: 'در حال بارگذاری تفسیر...',
              keywords: card?.keywords || [],
            };
          })).map((card, index) => (
            <Card key={card.cardId || index} className="p-4">
              <div className="flex gap-4 items-start">
                <div className="w-20 h-32 rounded-lg overflow-hidden border border-[var(--luma-gold)]/30 shadow-md flex-shrink-0 bg-[var(--luma-bg-subtle)]">
                  {/* تلاش برای نمایش تصویر کارت، در غیر این صورت پشت کارت */}
                  <img 
                    src={`${baseUrl}assets/tarot/cards/back.webp`} 
                    alt={card.cardNameFa} 
                    className={`w-full h-full object-cover ${card.isReversed ? 'rotate-180' : ''}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `${baseUrl}assets/tarot/cards/back.webp`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-heading text-base text-[var(--luma-text)]">
                      {card.cardNameFa}
                    </h4>
                    {card.isReversed && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                        معکوس
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--luma-gold)] mb-2">موقعیت: {card.positionName}</p>
                  <p className="text-sm text-[var(--luma-text)] leading-relaxed">
                    {card.positionSpecificMeaning}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        {/* --- بخش 2: تحلیل کلی --- */}
        <section>
          <Card className="p-4">
            <h3 className="font-heading text-base text-[var(--luma-gold)] mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              تحلیل کلی
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
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

        {/* --- بخش 3: روایت ترکیبی --- */}
        <section>
          <Card className="p-4">
            <h3 className="font-heading text-base text-[var(--luma-gold)] mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              روایت ترکیبی
            </h3>
            <p className="text-sm text-[var(--luma-text)] leading-relaxed">
              {synthesis.narrative}
            </p>
          </Card>
        </section>

        {/* --- بخش 4: توصیه نهایی --- */}
        <section>
          <Card className="p-4 border-[var(--luma-gold)]/40">
            <h3 className="font-heading text-base text-[var(--luma-gold)] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              توصیه LUMA
            </h3>
            <p className="text-sm text-[var(--luma-text)] leading-relaxed">
              {synthesis.advice}
            </p>
          </Card>
        </section>

        {/* --- بخش 5: هشدارها --- */}
        {synthesis.warnings && synthesis.warnings.length > 0 && (
          <section>
            <Card className="p-4 border-amber-500/40 bg-amber-500/5">
              <h3 className="font-heading text-base text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                نکات قابل توجه
              </h3>
              <ul className="space-y-2">
                {synthesis.warnings.map((warning, i) => (
                  <li key={i} className="text-sm text-amber-300/90 leading-relaxed">
                    • {warning}
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}

        {/* --- بخش 6: جملات تاکیدی --- */}
        {synthesis.affirmations && synthesis.affirmations.length > 0 && (
          <section>
            <Card className="p-4">
              <h3 className="font-heading text-base text-[var(--luma-gold)] mb-3">
                ✨ جملات تاکیدی برای شما
              </h3>
              <ul className="space-y-2">
                {synthesis.affirmations.map((affirmation, i) => (
                  <li key={i} className="text-sm text-[var(--luma-text)] leading-relaxed italic">
                    "{affirmation}"
                  </li>
                ))}
              </ul>
            </Card>
          </section>
        )}
      </div>

      {/* --- دکمه بازگشت --- */}
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
\\\

### 5.3 src/components/tarot/TarotCardDeck.tsx
\\\	sximport { motion } from 'framer-motion';

interface TarotCardDeckProps {
  selected?: string[];
  cardCount?: number;
  onCardSelect?: (id: string) => void;
}

export function TarotCardDeck({ 
  selected = [], 
  cardCount = 3, 
  onCardSelect = () => {} 
}: TarotCardDeckProps) {
  const baseUrl = import.meta.env.BASE_URL;
  const deck = Array.from({ length: 78 }, (_, i) => i.toString());
  const isComplete = selected.length === cardCount;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-[var(--luma-text)] mb-2">انتخاب کارت‌ها</h2>
        <p className="text-sm text-[var(--luma-text-muted)]">
          {isComplete
            ? 'همه کارت‌ها انتخاب شد'
            : `${selected.length} از ${cardCount} کارت انتخاب شده`}
        </p>
        <p className="text-xs text-[var(--luma-text-muted)] mt-1">
          {isComplete
            ? 'برای دیدن نتیجه به پایین بروید'
            : 'روی کارت‌ها کلیک کنید تا انتخاب شوند'}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {deck.map((cardId, index) => {
          const isSelected = selected.includes(cardId);
          const selectionIndex = selected.indexOf(cardId);
          return (
            <motion.div
              key={cardId}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCardSelect(cardId)}
              className={`relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                isSelected 
                  ? 'border-[var(--luma-gold)] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={`${baseUrl}assets/tarot/cards/back.webp`}
                alt={`کارت ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-[var(--luma-gold)]/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-[var(--luma-gold)] text-black flex items-center justify-center text-xs font-bold">
                    {selectionIndex + 1}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
\\\

### 5.4 src/components/tarot/TarotRevealCard.tsx
\\\	sximport { motion } from 'framer-motion';

interface TarotRevealCardProps {
  isRevealed: boolean;
  onReveal: () => void;
  cardName?: string;
  cardImage?: string;
  isReversed?: boolean;
}

export function TarotRevealCard({ 
  isRevealed, 
  onReveal, 
  cardName = 'کارت شما', 
  cardImage,
  isReversed = false 
}: TarotRevealCardProps) {
  const baseUrl = import.meta.env.BASE_URL;
  const backImage = `${baseUrl}assets/tarot/cards/back.webp`;
  const frontImage = cardImage ? `${baseUrl}assets/tarot/cards/${cardImage}` : backImage;

  return (
    <div className="w-full flex justify-center py-4">
      <div 
        className="w-48 h-80 perspective-1000 cursor-pointer relative"
        onClick={onReveal}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isRevealed ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-[var(--luma-gold)]/30 shadow-2xl">
            <img
              src={backImage}
              alt="پشت کارت"
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute w-full h-full backface-hidden rounded-xl overflow-hidden border-2 border-[var(--luma-gold)]/30 shadow-2xl rotate-y-180 bg-[var(--luma-bg-card)] flex flex-col items-center justify-center ${isReversed ? 'rotate-180' : ''}`}>
            {cardImage ? (
              <img
                src={frontImage}
                alt={cardName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[var(--luma-gold)] text-sm text-center px-4">
                {cardName}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
\\\

---

## 6. محتوای کامل فایل‌های Chart & Home

### 6.1 src/features/chart/ZodiacScreen.tsx
\\\	sximport { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../../components/ui/PageHeader';
import { ZODIAC_DETAILS } from '../../engines/astronomy/constants';
import { BIRTHSTONES } from '../../engines/birthstone';
import type { BirthstoneDetail } from '../../engines/birthstone/data';
import { X } from 'lucide-react';

const ZODIAC_ICONS: Record<string, string> = {
  aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer',
  leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio',
  sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces'
};

const ZODIAC_BIRTHSTONE: Record<string, string> = {
  aries: 'aquamarine', taurus: 'diamond', gemini: 'emerald', cancer: 'pearl',
  leo: 'ruby', virgo: 'peridot', libra: 'sapphire', scorpio: 'opal',
  sagittarius: 'topaz', capricorn: 'turquoise', aquarius: 'garnet', pisces: 'amethyst'
};

const ELEMENT_COLORS: Record<string, string> = {
  fire: '#EF4444', earth: '#10B981', air: '#3B82F6', water: '#8B5CF6'
};

const ELEMENT_NAMES_FA: Record<string, string> = {
  fire: 'آتش', earth: 'خاک', air: 'هوا', water: 'آب'
};

interface ZodiacScreenProps {
  onBack: () => void;
}

export function ZodiacScreen({ onBack }: ZodiacScreenProps) {
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null);
  const [selectedStone, setSelectedStone] = useState<BirthstoneDetail | null>(null);

  const signs = Object.values(ZODIAC_DETAILS);

  const getBirthstone = (signName: string): BirthstoneDetail | undefined => {
    const stoneEn = ZODIAC_BIRTHSTONE[signName];
    if (!stoneEn) return undefined;
    return BIRTHSTONES.find(b => b.nameEn.toLowerCase() === stoneEn);
  };

  const zodiacDetail = selectedZodiac
    ? ZODIAC_DETAILS[selectedZodiac as keyof typeof ZODIAC_DETAILS]
    : null;

  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="space-y-5">
      <PageHeader title="زودیاک ماه‌ها" subtitle="۱۲ برج غربی و سنگ ماه تولد" onBack={onBack} />

      <div className="grid grid-cols-2 gap-3">
        {signs.map((sign) => {
          const birthstone = getBirthstone(sign.name);
          const elementColor = ELEMENT_COLORS[sign.element] || '#888';
          const iconName = ZODIAC_ICONS[sign.name] || 'Aries';
          const stoneImage = birthstone ? birthstone.nameEn.toLowerCase() : null;

          return (
            <div
              key={sign.name}
              className="bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] rounded-2xl p-4 transition-all duration-200"
            >
              <button
                onClick={() => setSelectedZodiac(sign.name)}
                className="w-full text-right hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={`${baseUrl}icons/zodiac/${iconName}.svg`}
                    alt={sign.nameFa}
                    className="w-10 h-10 zodiac-icon"
                  />
                  <h3 className="font-heading text-sm text-[var(--luma-text)]">{sign.nameFa}</h3>
                </div>
                <p className="text-[10px] text-[var(--luma-text-subtle)] mb-1">{sign.dateRange}</p>
                <p className="text-[9px] text-[var(--luma-text-muted)] mb-1">ماه شمسی: {sign.shamsiMonth}</p>
                {birthstone && (
                  <p className="text-[9px] text-[var(--luma-text-subtle)] mb-1">({birthstone.shamsiRange})</p>
                )}
                <p className="text-[10px] text-[var(--luma-text-muted)] mb-1">
                  عنصر: <span style={{ color: elementColor }}>{sign.elementFa}</span>
                </p>
                <p className="text-[9px] text-[var(--luma-gold)]">جزئیات برج ←</p>
              </button>

              {birthstone && stoneImage && (
                <button
                  onClick={() => setSelectedStone(birthstone)}
                  className="mt-2 pt-2 border-t border-[var(--luma-border)] w-full text-right hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`${baseUrl}icons/birthstones/${stoneImage}.png`}
                      alt={birthstone.nameFa}
                      className="w-8 h-8 rounded-full object-cover border border-[var(--luma-gold)]/40 bg-[var(--luma-bg-subtle)]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[var(--luma-text-muted)]">
                        💎 سنگ: {birthstone.nameFa}
                      </p>
                      <p className="text-[9px] text-[var(--luma-gold)]">جزئیات سنگ ←</p>
                    </div>
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* مودال اطلاعات برج */}
      <AnimatePresence>
        {zodiacDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedZodiac(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md bg-[var(--luma-bg-elevated)] rounded-2xl p-5 max-h-[85vh] overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`${baseUrl}icons/zodiac/${ZODIAC_ICONS[zodiacDetail.name]}.svg`}
                    alt={zodiacDetail.nameFa}
                    className="w-16 h-16 zodiac-icon"
                  />
                  <div>
                    <h2 className="font-heading text-lg text-[var(--luma-text)]">{zodiacDetail.nameFa}</h2>
                    <p className="text-xs text-[var(--luma-text-muted)]" dir="ltr">{zodiacDetail.nameEn}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedZodiac(null)}
                  className="p-1.5 rounded-full hover:bg-[var(--luma-bg-subtle)]"
                  aria-label="بستن"
                >
                  <X className="w-4 h-4 text-[var(--luma-text-muted)]" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--luma-text-muted)]">تاریخ:</span>
                  <span className="text-[var(--luma-text)]">{zodiacDetail.dateRange}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--luma-text-muted)]">ماه شمسی:</span>
                  <span className="text-[var(--luma-text)]">{zodiacDetail.shamsiMonth}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--luma-text-muted)]">عنصر:</span>
                  <span style={{ color: ELEMENT_COLORS[zodiacDetail.element] }}>{zodiacDetail.elementFa}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--luma-text-muted)]">سیاره حاکم:</span>
                  <span className="text-[var(--luma-text)]">{zodiacDetail.rulingPlanetFa}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--luma-text-muted)]">کیفیت:</span>
                  <span className="text-[var(--luma-text)]">{zodiacDetail.modalityFa}</span>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">توضیحات:</p>
                  <p className="text-sm text-[var(--luma-text)] leading-relaxed">{zodiacDetail.description}</p>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">ویژگی‌ها:</p>
                  <div className="flex flex-wrap gap-1">
                    {zodiacDetail.traits.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">نقاط قوت:</p>
                  <p className="text-xs text-green-400">{zodiacDetail.strengths.join(' • ')}</p>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">نقاط ضعف:</p>
                  <p className="text-xs text-amber-400">{zodiacDetail.weaknesses.join(' • ')}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--luma-border)] text-xs">
                  <div>
                    <span className="text-[var(--luma-text-muted)]">رنگ خوش‌شانسی: </span>
                    <span className="text-[var(--luma-text)]">{zodiacDetail.luckyColor}</span>
                  </div>
                  <div>
                    <span className="text-[var(--luma-text-muted)]">عدد خوش‌شانسی: </span>
                    <span className="text-[var(--luma-text)]">{zodiacDetail.luckyNumber}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مودال اطلاعات سنگ */}
      <AnimatePresence>
        {selectedStone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSelectedStone(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md bg-[var(--luma-bg-elevated)] rounded-2xl p-5 max-h-[85vh] overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`${baseUrl}icons/birthstones/${selectedStone.nameEn.toLowerCase()}.png`}
                    alt={selectedStone.nameFa}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--luma-gold)]/40"
                  />
                  <div>
                    <h2 className="font-heading text-lg text-[var(--luma-text)]">{selectedStone.nameFa}</h2>
                    <p className="text-xs text-[var(--luma-text-muted)]" dir="ltr">{selectedStone.nameEn}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStone(null)}
                  className="p-1.5 rounded-full hover:bg-[var(--luma-bg-subtle)]"
                  aria-label="بستن"
                >
                  <X className="w-4 h-4 text-[var(--luma-text-muted)]" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--luma-text-muted)]">رنگ:</span>
                  <span className="text-[var(--luma-text)]">{selectedStone.color}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--luma-text-muted)]">ماه شمسی:</span>
                  <span className="text-[var(--luma-text)]">{selectedStone.shamsiRange}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--luma-text-muted)]">عنصر:</span>
                  <span style={{ color: ELEMENT_COLORS[selectedStone.element] }}>
                    {ELEMENT_NAMES_FA[selectedStone.element]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[var(--luma-text-muted)]">چاکرا:</span>
                  <span className="text-[var(--luma-text)]">{selectedStone.chakra}</span>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">معنی نمادین:</p>
                  <p className="text-sm text-[var(--luma-text)] leading-relaxed">{selectedStone.meaning}</p>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">تفسیر استرولوژیکی:</p>
                  <p className="text-sm text-[var(--luma-text)] leading-relaxed">{selectedStone.astrologyMeaning}</p>
                </div>

                <div className="pt-3 border-t border-[var(--luma-border)]">
                  <p className="text-xs text-[var(--luma-text-muted)] mb-1">سنگ خوش‌شانسی برای:</p>
                  <p className="text-sm text-[var(--luma-gold)]">{selectedStone.luckyFor}</p>
                  {selectedStone.alternativeStones.length > 0 && (
                    <div className="pt-3 border-t border-[var(--luma-border)]">
                      <p className="text-xs text-[var(--luma-text-muted)] mb-1">سنگ‌های جایگزین این ماه:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedStone.alternativeStones.map((alt, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)]">{alt}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
\\\

### 6.2 src/features/home/DailyCardSection.tsx
\\\	sximport { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function DailyCardSection() {
  const [isFlipped, setIsFlipped] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <section className="mt-8 px-4">
      <h3 className="text-lg font-bold text-[var(--luma-text)] mb-4 text-center">کشف کنید</h3>
      
      <div className="bg-[var(--luma-bg-card)] rounded-3xl p-6 border border-[var(--luma-border)] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center">
          <h4 className="text-[var(--luma-gold)] font-semibold mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            کارت روزانه شما
          </h4>

          <div 
            className="w-40 h-64 [perspective:1000px] cursor-pointer mb-6 relative"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="w-full h-full relative [transform-style:preserve-3d]"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* پشت کارت */}
              <div className="absolute w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden border-2 border-[var(--luma-gold)]/30 shadow-2xl">
                <img src={`${baseUrl}assets/tarot/cards/back.webp`} alt="پشت کارت" className="w-full h-full object-cover" />
              </div>
              {/* روی کارت */}
              <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl overflow-hidden border-2 border-[var(--luma-gold)]/30 shadow-2xl">
                 <img src={`${baseUrl}assets/tarot/cards/major-00-fool.webp`} alt="روی کارت" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>

          <div className={`transition-all duration-500 text-center ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
             <p className="text-sm text-[var(--luma-text)] leading-relaxed mb-4">
               کارت <span className="text-[var(--luma-gold)] font-bold">احمق</span> نشان‌دهنده آغاز یک سفر جدید و آزادی است.
             </p>
          </div>
          
          {!isFlipped && (
            <p className="text-sm text-[var(--luma-text-muted)] text-center mb-6 max-w-[250px]">
              برای دریافت پیام امروز کائنات، کارت را لمس کنید.
            </p>
          )}

          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-[var(--luma-gold)] text-black font-bold py-3 px-8 rounded-full flex items-center gap-2 hover:bg-[var(--luma-gold-hover)] transition-colors mt-2"
          >
            <Sparkles className="w-4 h-4" />
            {isFlipped ? 'بستن کارت' : 'دریافت پیام'}
          </button>
        </div>
      </div>
    </section>
  );
}
\\\

### 6.3 src/components/ui/CityPicker.tsx
\\\	sximport { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, Navigation, X } from 'lucide-react';
import { searchCities, findNearestCity } from '../../engines/location';
import type { CityWithProvince } from '../../engines/location';

interface CityPickerProps {
  value: CityWithProvince | null;
  onChange: (city: CityWithProvince) => void;
  placeholder?: string;
}

export function CityPicker({ value, onChange, placeholder = 'جستجوی شهر...' }: CityPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityWithProvince[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const debounceRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // جستجوی پویا با debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const found = await searchCities(query, 12);
        setResults(found);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  // بستن dropdown با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityWithProvince) => {
    onChange(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setGpsError(null);
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('مرورگر شما از GPS پشتیبانی نمی‌کند');
      return;
    }
    setIsLocating(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const nearest = await findNearestCity(pos.coords.latitude, pos.coords.longitude);
          if (nearest) {
            handleSelect(nearest);
          } else {
            setGpsError('شهر نزدیکی پیدا نشد');
          }
        } catch {
          setGpsError('خطا در پیدا کردن شهر');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setGpsError('دسترسی به موقعیت مکانی رد شد');
        setIsLocating(false);
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  // اگر شهری انتخاب شده
  if (value) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-gold)]/40">
          <MapPin className="w-4 h-4 text-[var(--luma-gold)] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--luma-text)] truncate">
              {value.name}
            </p>
            <p className="text-[10px] text-[var(--luma-text-muted)] truncate">
              {value.province_name} — {Number(value.lat).toFixed(3)}°, {Number(value.lon).toFixed(3)}°
            </p>
          </div>
          <button
            onClick={() => onChange(null as any)}
            className="p-1 rounded-full hover:bg-[var(--luma-bg-elevated)]"
            aria-label="حذف شهر"
          >
            <X className="w-4 h-4 text-[var(--luma-text-muted)]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pr-10 pl-10 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--luma-bg-elevated)]"
            aria-label="پاک کردن"
          >
            <X className="w-3 h-3 text-[var(--luma-text-muted)]" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-gold)] animate-spin" />
        )}
      </div>

      {/* دکمه GPS */}
      <button
        onClick={handleGPS}
        disabled={isLocating}
        className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-xs text-[var(--luma-text-muted)] hover:border-[var(--luma-gold)] transition-colors disabled:opacity-50"
      >
        {isLocating ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            در حال پیدا کردن موقعیت...
          </>
        ) : (
          <>
            <Navigation className="w-3 h-3" />
            موقعیت فعلی من
          </>
        )}
      </button>

      {gpsError && (
        <p className="mt-1 text-[10px] text-red-400 text-center">{gpsError}</p>
      )}

      {/* نتایج */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] rounded-xl shadow-card z-50 no-scrollbar">
          {results.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              className="w-full text-right px-3 py-2.5 hover:bg-[var(--luma-bg-subtle)] transition-colors border-b border-[var(--luma-border)] last:border-0 first:rounded-t-xl last:rounded-b-xl"
            >
              <p className="text-sm font-medium text-[var(--luma-text)]">{city.name}</p>
              <p className="text-[10px] text-[var(--luma-text-muted)]">{city.province_name}</p>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] rounded-xl shadow-card z-50">
          <p className="text-xs text-[var(--luma-text-muted)] text-center">شهری پیدا نشد</p>
        </div>
      )}
    </div>
  );
}
\\\

---

## 7. محتوای کامل فایل‌های Configuration

### 7.1 vite.config.ts
\\\	ypescriptimport { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: '/luma-v2/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.svg', 'icons/*.png'],
      manifest: false, // از public/manifest.webmanifest استفاده می‌شود
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,mp3}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/supabase/]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
})\\\

### 7.2 package.json
\\\json{
  "name": "luma-v2",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "oxlint src",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@supabase/supabase-js": "2.45.4",
    "astronomy-engine": "2.1.19",
    "class-variance-authority": "0.7.0",
    "clsx": "2.1.1",
    "dexie": "4.0.8",
    "dexie-react-hooks": "1.1.7",
    "framer-motion": "11.11.9",
    "lucide-react": "0.453.0",
    "luxon": "^3.5.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "tailwind-merge": "2.5.4",
    "zustand": "5.0.0"
  },
  "devDependencies": {
    "@playwright/test": "1.48.1",
    "@testing-library/jest-dom": "6.5.0",
    "@testing-library/react": "16.0.1",
    "@types/luxon": "^3.4.2",
    "@types/node": "22.7.9",
    "@types/react": "18.3.11",
    "@types/react-dom": "18.3.1",
    "@vitejs/plugin-react": "4.3.2",
    "autoprefixer": "10.4.20",
    "jsdom": "25.0.1",
    "oxlint": "0.9.10",
    "postcss": "8.4.47",
    "prettier": "3.3.3",
    "sharp": "^0.35.5",
    "tailwindcss": "3.4.14",
    "typescript": "5.6.3",
    "vite": "5.4.10",
    "vite-plugin-pwa": "0.20.5",
    "vitest": "2.1.3"
  }
}
\\\

### 7.3 index.html
\\\html<!doctype html>
<html lang="fa" dir="rtl" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#0B0D1A" />
    <meta name="description" content="لوما — سیری به دنیای درون. تاروت، چارت تولد، استرولوژی و خودشناسی." />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; media-src 'self'; worker-src 'self' blob:; manifest-src 'self'; child-src 'self' blob:;"
    />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="LUMA" />
    <meta name="mobile-web-app-capable" content="yes" />

    <link rel="manifest" href="/luma-v2/manifest.webmanifest" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

    <link rel="preload" href="/fonts/vazirmatn/Vazirmatn-Regular.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/vazirmatn/Vazirmatn-Medium.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/vazirmatn/Vazirmatn-Bold.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/cormorant/CormorantGaramond-Regular.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/cormorant/CormorantGaramond-Bold.woff2" as="font" type="font/woff2" crossorigin />

    <title>LUMA | لوما — تاروت و استرولوژی</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
\\\

### 7.4 public/manifest.webmanifest
\\\json{
  "name": "LUMA - لوما",
  "short_name": "LUMA",
  "description": "پلتفرم تاروت، استرولوژی و خودشناسی",
  "start_url": "/luma-v2/",
  "display": "standalone",
  "background_color": "#0B0E14",
  "theme_color": "#0B0E14",
  "icons": [
    {
      "src": "/luma-v2/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/luma-v2/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}\\\

---

## 8. ساختار فایل‌های JSON (شهرها و استان‌ها)

### 8.1 نمونه از iran-cities.json (۳ شهر اول)
\\\json[
    {
        "id":  1,
        "name":  "اسکو",
        "province_id":  1,
        "en_name":  "Osku",
        "lat":  "37.9161035",
        "lon":  "46.1244787"
    },
    {
        "id":  2,
        "name":  "اهر",
        "province_id":  1,
        "en_name":  "Ahar",
        "lat":  "38.4774934",
        "lon":  "47.0662215"
    },
    {
        "id":  3,
        "name":  "ایلخچی",
        "province_id":  1,
        "en_name":  "Ailkhchi",
        "lat":  "37.9389278",
        "lon":  "45.9800159"
    }
]\\\

### 8.2 تعداد کل شهرها- تعداد کل شهرها: 1119

### 8.3 نمونه از iran-provinces.json (۳ استان اول)
\\\json[
    {
        "id":  1,
        "name":  "آذربایجان شرقی",
        "country_id":  1,
        "en_name":  "East Azerbaijan",
        "lat":  37.903573,
        "lon":  46.268210
    },
    {
        "id":  2,
        "name":  "آذربایجان غربی",
        "country_id":  1,
        "en_name":  "West Azerbaijan",
        "lat":  37.455022,
        "lon":  45.070312
    },
    {
        "id":  3,
        "name":  "اردبیل",
        "country_id":  1,
        "en_name":  "Ardabil",
        "lat":  38.485327,
        "lon":  47.891120
    }
]\\\

### 8.4 تعداد کل استان‌ها- تعداد کل استان‌ها: 31
