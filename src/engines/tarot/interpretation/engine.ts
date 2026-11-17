// src/engines/tarot/interpretation/engine.ts
import type { ReadingResult, TarotCard } from '../types';
import type { CardPositionContext, ReadingSynthesis, SpreadId } from './types';
import { generatePositionMeaning, generateCardDeepAnalysis } from './meaningGenerator';
import { getCardById, getSpreadById } from '../index';
import { getLocalizedCardName, getLocalizedCardMeaning, getLocalizedKeywords } from '../../../features/tarot/tarotI18nResolver';

type EngineLang = 'fa' | 'en' | 'ar' | 'ckb';

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

const I18N = {
  fa: {
    elements: { fire: 'آتش (اراده و اشتیاق)', earth: 'خاک (ثبات و ماده)', air: 'هوا (بینش و تصمیم)', water: 'آب (عاطفه و شهود)', spirit: 'روح (سرنوشت و تحول)' },
    suits: { major: 'آرکانای کبیر', wands: 'چوبدست‌ها', cups: 'جام‌ها', swords: 'شمشیرها', pentacles: 'سکه‌ها' },
    roles: {
      past: 'ریشه‌ها و خاستگاه در گذشته',
      present: 'وضعیت کانونی و مدار اکنون',
      future: 'افق و دورنمای پیش رو',
      situation: 'بستر و کانون رخداد',
      obstacle: 'گره و چالش اصلی',
      advice: 'راهبرد و هدایت کیهانی',
      mind: 'الگوهای فکری و باورهای ناخودآگاه',
      heart: 'انگیزه‌های قلبی و کشش‌های عاطفی',
      action: 'اقدام عملی و جهت‌گیری اراده',
      self: 'نقش و جایگاه شما',
      other: 'انرژی و موضع طرف مقابل',
      relationship: 'پیوند متقابل و میدان انرژی رابطه',
      outcome: 'سرانجام و برآیند نهایی',
      goal: 'آرمان و آرزوی باطنی',
      environment: 'جو پیرامونی و نیروهای تأثیرگذار',
      'hopes-fears': 'امیدها و دلهره‌های نهفته',
      'recent-past': 'گذشته نزدیک و زمینه‌های تازه',
      month: 'ماه',
      answer: 'پاسخ مستقیم کیهان',
    },
    themes: {
      transform: 'تحول ریشه‌ای، گذر از کهنه‌ها و بیداری آگاهی',
      success: 'هم‌راستایی کامل، به ثمر نشستن اهداف و پیروزی',
      intuition: 'مکاشفه درونی، پرده‌برداری از رازها و اعتماد به حس ششم',
      love: 'التیام عاطفی، تجلی عشق راستین و هماهنگی قلوب',
      mind: 'غلبه بر تردیدها، تفکر استراتژیک و انتخاب سرنوشت‌ساز',
      creativity: 'جوشش خلاقیت، عمل‌گرایی جسورانه و آغازگری',
      material: 'تثبیت رفاه مادی، انضباط مالی و استواری بنیادین',
      self: 'سفر اکتشاف خویشتن و هماهنگی با رسالت روح',
    },
  },
  en: {
    elements: { fire: 'Fire (Will & Passion)', earth: 'Earth (Stability & Form)', air: 'Air (Clarity & Intellect)', water: 'Water (Emotion & Intuition)', spirit: 'Spirit (Cosmic Destiny)' },
    suits: { major: 'Major Arcana', wands: 'Wands', cups: 'Cups', swords: 'Swords', pentacles: 'Pentacles' },
    roles: {
      past: 'Roots & Past Origins',
      present: 'Current Focal Point',
      future: 'Unfolding Horizon',
      situation: 'Core Situation',
      obstacle: 'Primary Challenge',
      advice: 'Cosmic Strategy & Counsel',
      mind: 'Mindset & Beliefs',
      heart: 'Heart & Emotional Currents',
      action: 'Practical Action',
      self: 'Your True Role',
      other: 'Counterpart Dynamics',
      relationship: 'Shared Field of Connection',
      outcome: 'Ultimate Outcome',
      goal: 'Inner Objective',
      environment: 'Surrounding Influences',
      'hopes-fears': 'Underlying Hopes & Fears',
      'recent-past': 'Recent Influences',
      month: 'Month',
      answer: 'Cosmic Oracle Verdict',
    },
    themes: {
      transform: 'Deep Metamorphosis & Rebirth',
      success: 'Triumphant Alignment & Mastery',
      intuition: 'Inner Illumination & Mystic Intuition',
      love: 'Heart Healing & Sacred Connection',
      mind: 'Intellectual Clarity & Crucial Decisions',
      creativity: 'Dynamic Courage & Creative Action',
      material: 'Tangible Grounding & Prosperity',
      self: 'Journey of Self-Realization',
    },
  },
  ar: {
    elements: { fire: 'النار', earth: 'التراب', air: 'الهواء', water: 'الماء', spirit: 'الروح' },
    suits: { major: 'الرموز الكبرى', wands: 'العصي', cups: 'الكؤوس', swords: 'السيوف', pentacles: 'النجوم' },
    roles: { past: 'في الماضي', present: 'حالياً', future: 'في المستقبل', situation: 'الوضع الحالي', obstacle: 'العقبة الرئيسية', advice: 'النصيحة المقترحة', mind: 'العقل', heart: 'القلب', action: 'الفعل', self: 'أنت', other: 'الآخر', relationship: 'العلاقة', outcome: 'النتيجة', goal: 'الهدف', environment: 'البيئة', 'hopes-fears': 'الآمال والمخاوف', 'recent-past': 'الماضي القريب', month: 'الشهر', answer: 'الإجابة' },
    themes: { transform: 'تحول عميق', success: 'النجاح', intuition: 'الحدس', love: 'الحب', mind: 'القرارات', creativity: 'الإبداع', material: 'الاستقرار', self: 'اكتشاف الذات' },
  },
  ckb: {
    elements: { fire: 'ئاگر', earth: 'خاک', air: 'هەوا', water: 'ئاو', spirit: 'ڕۆح' },
    suits: { major: 'ئارکانای گەورە', wands: 'دارەکان', cups: 'جامەکان', swords: 'شمشێرەکان', pentacles: 'سکەکان' },
    roles: { past: 'ڕابردوو', present: 'ئێستا', future: 'داهاتوو', situation: 'دۆخ', obstacle: 'ئاستەنگ', advice: 'ڕێنمایی', mind: 'مێشک', heart: 'دڵ', action: 'کردار', self: 'تۆ', other: 'بەرامبەر', relationship: 'پەیوەندی', outcome: 'ئەنجام', goal: 'ئامانج', environment: 'ژینگە', 'hopes-fears': 'هیوا و ترس', 'recent-past': 'ڕابردووی نزیک', month: 'مانگ', answer: 'وەڵام' },
    themes: { transform: 'گۆڕانکاری قووڵ', success: 'سەرکەوتن', intuition: 'هەستی ناوەکی', love: 'خۆشەویستی', mind: 'بڕیاردان', creativity: 'داهێنان', material: 'سەقامگیری', self: 'ناسینی خۆ' },
  },
};

function analyzeDominantElement(cards: TarotCard[], lang: EngineLang): string {
  const counts: Record<string, number> = { fire: 0, earth: 0, air: 0, water: 0, spirit: 0 };
  cards.forEach((card) => {
    if (card.element) counts[card.element] = (counts[card.element] || 0) + 1;
    else if (card.arcana === 'major') counts.spirit = (counts.spirit || 0) + 1;
  });
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return (I18N[lang] || I18N.fa).elements[dominant[0] as keyof typeof I18N.fa.elements] || 'هماهنگ';
}

function analyzeDominantSuit(cards: TarotCard[], lang: EngineLang): string {
  const counts: Record<string, number> = { major: 0, wands: 0, cups: 0, swords: 0, pentacles: 0 };
  cards.forEach((card) => {
    counts[card.suit] = (counts[card.suit] || 0) + 1;
  });
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return (I18N[lang] || I18N.fa).suits[dominant[0] as keyof typeof I18N.fa.suits] || 'متعادل';
}

function calculateEnergyScore(cards: TarotCard[], reversals: boolean[]): number {
  let score = 55;
  cards.forEach((card, idx) => {
    if (card.arcana === 'major') score += 6;
    if (reversals[idx]) score -= 8;
    else score += 6;
  });
  return Math.max(10, Math.min(100, score));
}

function determineOverallTheme(cards: TarotCard[], dominantSuit: string, lang: EngineLang): string {
  const dict = I18N[lang] || I18N.fa;
  if (cards.some((c) => c.id === 'major-16-tower' || c.id === 'major-13-death')) return dict.themes.transform;
  if (cards.some((c) => c.id === 'major-19-sun' || c.id === 'major-21-world')) return dict.themes.success;
  if (cards.some((c) => c.id === 'major-18-moon' || c.id === 'major-02-high-priestess')) return dict.themes.intuition;

  if (dominantSuit.includes('جام') || dominantSuit.includes('Cups')) return dict.themes.love;
  if (dominantSuit.includes('شمشیر') || dominantSuit.includes('Swords')) return dict.themes.mind;
  if (dominantSuit.includes('چوبدست') || dominantSuit.includes('Wands')) return dict.themes.creativity;
  if (dominantSuit.includes('سکه') || dominantSuit.includes('Pentacles')) return dict.themes.material;
  return dict.themes.self;
}

/**
 * تولید روایت چندپاراگرافی جامع، تحلیلی و به هم پیوسته برای چیدمان
 */
function buildNarrative(
  contexts: CardPositionContext[],
  theme: string,
  elementStr: string,
  lang: EngineLang
): string {
  if (lang === 'fa') {
    const paragraphs: string[] = [];

    paragraphs.push(
      `طرح کیهانی این فال پیرامون مدار «${theme}» سامان یافته و غلبه عنصر ${elementStr} نشان می‌دهد که جریان نامرئی انرژی‌ها هم‌اکنون در حال بازچینی مسیر شما هستند. ` +
      `ترکیب کارت‌های حاضر حاکی از آن است که نیت شما نه صرفاً یک رویداد تصادفی، بلکه نقطه‌ای کلیدی در امتداد درس‌های کارمایی و رشد درونی شماست.`
    );

    const cardDescriptions = contexts.map((c) => {
      const revText = c.isReversed ? 'در وضعیت معکوس (لزوم توجه به انسدادهای درونی یا زوایای پنهان)' : 'در وضعیت مستقیم (جریان آزاد انرژی و تجلی روشن)';
      return `در جایگاه «${c.positionName}»، کهن‌الگوی «${c.cardNameFa}» ${revText} ظاهر شده است. ${c.positionSpecificMeaning}`;
    });
    paragraphs.push(cardDescriptions.join('\n\n'));

    paragraphs.push(
      `در یک نگاه کلی، این چیدمان از شما می‌خواهد که زنجیره این رویدادها را یکپارچه ببینید. ` +
      `نیرویی که در نقطه کنونی تجربه می‌کنید محصول ریشه‌های گذشته است و تصمیم هوشیارانه امروز، بذر حقیقتِ آینده را رقم خواهد زد.`
    );

    return paragraphs.join('\n\n');
  }

  if (lang === 'ar' || lang === 'ckb') {
    const isKurdish = lang === 'ckb';
    const paragraphs = [
      isKurdish
        ? `تەمەنی ئەم خوێندنەوەیە لەسەر «${theme}» و توخمی زاڵی ${elementStr} دەسوڕێتەوە. کارتەکان بانگهێشتێکن بۆ هاوسەنگی و گەشەی ئاگایانە.`
        : `تتمحور هذه القراءة حول «${theme}» مع حضور بارز لعنصر ${elementStr}. تدعوك البطاقات إلى التوازن والنمو الواعي.`,
    ];

    paragraphs.push(
      contexts.map((context) => {
        if (isKurdish) {
          const orientation = context.isReversed ? 'بە پێچەوانە' : 'بە ڕاست';
          return `لە ${context.positionName}، کارتی «${context.cardNameFa}» ${orientation} دەرکەوتووە: ${context.positionSpecificMeaning}`;
        }
        const orientation = context.isReversed ? 'بوضع معكوس' : 'بوضع مستقيم';
        return `في ${context.positionName}، ظهرت بطاقة «${context.cardNameFa}» ${orientation}: ${context.positionSpecificMeaning}`;
      }).join('\n\n')
    );
    return paragraphs.join('\n\n');
  }

  const paragraphs: string[] = [];
  paragraphs.push(
    `This reading unfolds beneath the cosmic current of "${theme}", with a dominant resonance in ${elementStr}. ` +
    `The interplay of drawn archetypes signifies a pivotal threshold of personal alignment and conscious manifestation.`
  );

  const cardDescriptions = contexts.map((c) => {
    const revText = c.isReversed ? '(Reversed: calling for inward recalibration)' : '(Upright: fluid manifest energy)';
    return `In the sphere of "${c.positionName}", "${c.cardNameFa}" stands ${revText}: ${c.positionSpecificMeaning}`;
  });
  paragraphs.push(cardDescriptions.join('\n\n'));

  return paragraphs.join('\n\n');
}

function buildAdvice(
  contexts: CardPositionContext[],
  spreadId: string,
  energyScore: number,
  theme: string,
  lang: EngineLang
): string {
  const adviceCard = contexts.find((c) => getPositionRole(spreadId, c.positionIndex) === 'advice');
  const outcomeCard = contexts.find((c) => getPositionRole(spreadId, c.positionIndex) === 'outcome');
  const keyCard = adviceCard || outcomeCard || contexts[contexts.length - 1];

  if (lang === 'fa') {
    if (keyCard) {
      const stance = keyCard.isReversed ? 'معکوس' : 'مستقیم';
      return (
        `راهبرد اساسی لوما برای شما با تکیه بر کارت «${keyCard.cardNameFa}» در وضعیت ${stance} مشخص می‌شود: ` +
        `به جای واکنش‌های شتاب‌زده، به خرد باطنی و انضباط راهبردی پایبند بمانید. ` +
        `${keyCard.positionSpecificMeaning} ` +
        `گام بعدی خود را با پذیرش حقیقت، رهایی از اضطراب نتیجه و هم‌سویی کامل با ارتعاش (${theme}) بردارید.`
      );
    }
    return energyScore >= 60
      ? `انرژی حاکم بر فال بسیار مساعد و پویاست. تم «${theme}» چراغ راه شماست؛ شجاعانه دست به اقدام بزنید و به حمایت کائنات اعتماد داشته باشید.`
      : `این چیدمان شما را به احتیاط و بازنگری فرامی‌خواند. در شرایط کنونی، آرامش درون و پرهیز از قضاوت شتاب‌زده ضامن عبور پیروزمندانه شما خواهد بود.`;
  }

  if (lang === 'ar') {
    return keyCard
      ? `نصيحة لوما: استلهم خطواتك القادمة من بطاقة «${keyCard.cardNameFa}». ${keyCard.positionSpecificMeaning} تحلّ بالصبر والوضوح.`
      : `وازن خطواتك مع معنى «${theme}»، وثق بحدسك وتقدم بوعي وثبات.`;
  }
  if (lang === 'ckb') {
    return keyCard
      ? `ئامۆژگاری لوما: هەنگاوەکانی داهاتووت لە کارتی «${keyCard.cardNameFa}» وەربگرە. ${keyCard.positionSpecificMeaning} بە ئارامی و ڕوونی پێش بچۆ.`
      : `کردارەکانت لەگەڵ مانای «${theme}» هاوسەنگ بکە و بە هەستی ناوەکیت متمانە بکە.`;
  }

  if (keyCard) {
    return `Core Guidance: Anchor your next steps in the wisdom of "${keyCard.cardNameFa}". ${keyCard.positionSpecificMeaning} Align intention with patient clarity rather than forced urgency.`;
  }
  return `Harmonize your actions with the prevailing current of "${theme}". Trust your discernment and take steady, conscious steps forward.`;
}

export function synthesizeReading(reading: ReadingResult, lang: EngineLang = 'fa'): ReadingSynthesis {
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

    const position = spread.positions.find((p) => p.index === drawn.positionIndex);
    const localizedPosName = (I18N[lang] || I18N.fa).roles[getPositionRole(reading.spreadId, drawn.positionIndex)] || position?.nameFa || `موقعیت ${drawn.positionIndex + 1}`;

    // ترکیب هوشمند: قالب موقعیت + تحلیل عمیق کهن‌الگو
    const templateMeaning = generatePositionMeaning(
      reading.spreadId,
      drawn.positionIndex,
      card,
      drawn.isReversed,
      lang
    );
    const deepAnalysis = generateCardDeepAnalysis(card, drawn.isReversed, 'general', lang);

    const combinedPositionMeaning = `${templateMeaning} ${deepAnalysis}`;
    const localizedName = getLocalizedCardName(card, lang);
    const localizedBaseMeaning = getLocalizedCardMeaning(card, drawn.isReversed, lang);
    const keywords = getLocalizedKeywords(card, lang);

    contexts.push({
      cardId: card.id,
      cardNameFa: localizedName,
      cardNameEn: card.nameEn,
      isReversed: drawn.isReversed,
      positionIndex: drawn.positionIndex,
      positionName: localizedPosName,
      baseMeaning: localizedBaseMeaning,
      positionSpecificMeaning: combinedPositionMeaning,
      keywords,
    });
  });

  const dominantElement = analyzeDominantElement(cards, lang);
  const dominantSuit = analyzeDominantSuit(cards, lang);
  const energyScore = calculateEnergyScore(cards, reversals);
  const overallTheme = determineOverallTheme(cards, dominantSuit, lang);

  const narrative = buildNarrative(contexts, overallTheme, dominantElement, lang);
  const advice = buildAdvice(contexts, reading.spreadId, energyScore, overallTheme, lang);

  const warnings: string[] = [];
  if (reversals.filter(Boolean).length >= cards.length / 2) {
    warnings.push(
      lang === 'fa'
        ? 'بسامد بالای کارت‌های معکوس در این چیدمان حاکی از مقاومت‌های ناخودآگاه یا ابهامات حل‌نشده در پیرامون نیت است؛ لزوم سکوت ذهنی و بازبینی دوچندان است.'
        : lang === 'ar'
          ? 'تكرار البطاقات المعكوسة قد يشير إلى مقاومة داخلية أو أمور غير واضحة؛ خذ وقتك للتأمل وإعادة النظر.'
          : lang === 'ckb'
            ? 'دووبارەبوونەوەی کارتە پێچەوانەکان ڕەنگە ئاماژە بە بەربەستی ناوەکی یان بابەتی نادیار بکات؛ کاتێک بۆ بیرکردنەوە دابنێ.'
            : 'A high frequency of reversed cards indicates subconscious resistance or unseen dynamics requiring patient contemplation.'
    );
  }

  const affirmations = [
    lang === 'fa'
      ? `«من در جریان آگاهی ناب کیهانی قرار دارم و با تکیه بر حکمت ${dominantElement}، موانع را به فرصت رشد تبدیل می‌کنم.»`
      : lang === 'ar'
        ? `«أنا متصل بالحكمة الكونية، وأحوّل التحديات إلى فرص للنمو.»`
        : lang === 'ckb'
          ? `«من لەگەڵ دانایی گەردوون هاوئاهەنگم و ئاستەنگەکان دەگۆڕم بۆ دەرفەتی گەشە.»`
          : `«I stand aligned with cosmic wisdom, transforming obstacles into stepping stones of personal mastery.»`
  ];

  return {
    spreadId: reading.spreadId as SpreadId,
    spreadName: spread.nameFa,
    question: reading.question,
    cards: contexts,
    overallTheme,
    dominantElement,
    dominantSuit,
    energyScore,
    narrative,
    advice,
    warnings,
    affirmations,
  };
}