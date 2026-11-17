import type { TarotCard } from '../types';
import { getTemplatesForSpread, type SupportedTarotLang } from './positionTemplates';
import { getLocalizedCardMeaning, getLocalizedKeywords, getLocalizedCardName } from '../../../features/tarot/tarotI18nResolver';

export type AnalysisCategory = 'general' | 'love' | 'career' | 'advice';

const SUIT_ESSENCE = {
  major: {
    element: 'روح و سرنوشت',
    theme: 'نقطه عطف‌های بنیادین زندگی، درس‌های کارمایی و تحولات ریشه‌ای آگاهی',
  },
  wands: {
    element: 'آتش',
    theme: 'انرژی زیستی، اراده، اشتیاق، جاه‌طلبی و آفرینشگری خلاقانه',
  },
  cups: {
    element: 'آب',
    theme: 'عواطف، پیوندهای قلبی، شهود، روان ناخودآگاه و شفای احساسی',
  },
  swords: {
    element: 'هوا',
    theme: 'قوای ذهن، حقیقت، تصمیم‌گیری، الگوهای فکری و غلبه بر ابهامات',
  },
  pentacles: {
    element: 'خاک',
    theme: 'ماده، ثبات فیزیکی، امور مالی، سلامتی و ثمردهی تلاش‌های عینی',
  },
};
const SUIT_ESSENCE_EN: Record<TarotCard['suit'], { element: string; theme: string }> = {
  major: {
    element: 'Spirit & destiny',
    theme: 'foundational life changes, karmic lessons, and deep shifts in awareness',
  },
  wands: {
    element: 'Fire',
    theme: 'vitality, will, passion, ambition, and creative energy',
  },
  cups: {
    element: 'Water',
    theme: 'emotions, close bonds, intuition, and emotional healing',
  },
  swords: {
    element: 'Air',
    theme: 'the mind, truth, decisions, and gaining clarity',
  },
  pentacles: {
    element: 'Earth',
    theme: 'practical matters, finances, health, and steady progress',
  },
};

/**
 * تولید تفسیر تحلیلی، فلسفی و کاربردی چندلایه برای هر کارت
 */
export function generateCardDeepAnalysis(
  card: TarotCard,
  isReversed: boolean,
  category: AnalysisCategory,
  lang: SupportedTarotLang | 'ckb' = 'fa'
): string {
  const cardName = getLocalizedCardName(card, lang);
  const keywords = getLocalizedKeywords(card, lang);
  const baseMeaning = getLocalizedCardMeaning(card, isReversed, lang);
  const kwList = keywords.slice(0, 3).join(' • ');
  const suitInfo = (lang === 'en' ? SUIT_ESSENCE_EN : SUIT_ESSENCE)[card.suit] || SUIT_ESSENCE.major;

  if (lang === 'fa') {
    if (category === 'general') {
      if (isReversed) {
        return (
          `کارت «${cardName}» در وضعیت معکوس حامل پیام مهمی درباره بازنگری درونی و مواجهه با موانع نامرئی است. ` +
          `در این جایگاه، جریان روان کهن‌الگو با محوریت (${kwList}) دچار فشردگی یا چرخش به سمت درون شده است. ` +
          `این موقعیت شما را دعوت می‌کند تا به جای سرزنش شرایط بیرونی، بررسی کنید که کدام مقاومت‌های ذهنی، عادت‌های قدیمی یا ترس از تغییر مانع جاری شدن خرد باطنی شما شده‌اند. ` +
          `${baseMeaning} درنگ هوشمندانه و بازیابی قطب‌نمای درون، پیش‌شرط عبور پیروزمندانه از این برهه است.`
        );
      }
      return (
        `کارت «${cardName}» نمایانگر تجلی مستقیم ارتعاش کیهانی (${kwList}) است. ` +
        `این کهن‌الگو در قلمرو ${suitInfo.element} جریان دارد و مستقیماً با ${suitInfo.theme} در پیوند است. ` +
        `پیام بنیادین کارت به شما یادآور می‌شود که در موقعیتی قرار دارید که بستر رشد، گسترش آگاهی و هماهنگی کامل فراهم است. ` +
        `${baseMeaning} با پذیرش این دعوت کیهانی و استواری در مسیر، ظرفیت‌های وجودی شما به روشن‌ترین شکل شکوفا خواهند شد.`
      );
    }

    if (category === 'love') {
      if (isReversed) {
        return (
          `در ساحت عشق و روابط عاطفی، حالت معکوس «${cardName}» پرده از سوءتفاهم‌های خاموش، انتظارات ناگفته یا پیوندهای متزلزل برمی‌دارد. ` +
          `انرژی کارت به شما هشدار می‌دهد که فرار از گفتگوهای حقیقت‌محور یا تکیه بر وابستگی‌های ناامن، آرامش درونی شما را به خطر می‌اندازد. ` +
          `برای ایجاد صمیمیت پایدار، ابتدا فضای قلب خود را از قضاوت پاک کنید و با خودِ اصیل‌تان در صلح قرار بگیرید تا مسیر بازسازی عاطفی هموار گردد.`
        );
      }
      return (
        `در مدار عواطف و پیوندهای قلبی، حضور «${cardName}» حاکی از وزش نسیم همدلی عمیق، درک شهودی و پالایش ارتباط است. ` +
        `این کارت نشان می‌دهد که صداقت در احساسات و ابراز زلال تمایلات قلبی، گره‌گشای مسیر است. ` +
        `اگر در رابطه‌ای هستید، پیوندتان به مراتب بالاتری از درک متقابل ارتقا می‌یابد؛ و اگر جویای عشق هستید، هم‌فرکانس شدن با احترام به خویشتن، مغناطیس جذب همراه حقیقی را فعال می‌سازد.`
      );
    }

    if (category === 'career') {
      if (isReversed) {
        return (
          `در عرصه کار، تجارت و منابع مالی، «${cardName}» معکوس هشداری است در برابر شتاب‌زدگی، ریسک‌های نسنجیده یا عدم شفافیت در قراردادها. ` +
          `این انرژی نمایانگر آن است که پاره‌ای از راهبردهای شغلی نیازمند بازطراحی و مدیریت محتاطانه‌تر هستند. ` +
          `پیش از هر امضا یا تعهد سرمایه‌ای بلندمدت، جزئیات را موشکافانه مرور کنید و به نظم بنیادین پایبند بمانید تا پایداری اقتصادی شما حفظ شود.`
        );
      }
      return (
        `در حوزه حرفه‌ای و تحقق اهداف مادی، کارت «${cardName}» نشان‌دهنده اقتدار عملی، تثبیت موقعیت و بهره‌برداری ثمربخش از قابلیت‌های فردی است. ` +
        `انرژی این کارت شما را به تمرکز بر شایستگی‌های راهبردی و پیشروی با تکیه بر اراده استوار فرامی‌خواند. ` +
        `پاداش زحمات گذشته در آستانه نمایان شدن است و شرایط برای برداشتن گام‌های سنجیده جهت ارتقای موقعیت شغلی کاملاً مساعد است.`
      );
    }

    if (category === 'advice') {
      if (isReversed) {
        return (
          `پند شهودی لوما: «مقاومت در برابر جریان زندگی تنها به فرسایش توان روحی می‌انجامد. ` +
          `دست از وسواس کنترل وقایع بردارید و به حکمت بزرگ‌تر هستی اعتماد کنید. ` +
          `هنگامی که درون خود را از تشویش رها سازید، پاسخ‌هایی که در جستجوی آن‌ها بودید در کمال سادگی بر شما آشکار خواهند شد.»`
        );
      }
      return (
        `پند شهودی لوما: «شما مجهز به بینش و ابزار لازم برای هدایت وضعیت کنونی هستید. ` +
        `با صلابت قدم بردارید، به جرقه‌های الهام درونی ارج نهید و ارتعاش (${keywords[0] || 'روشنی'}) را کانون تمام تصمیم‌گیری‌های خویش قرار دهید. ` +
        `کائنات با گام‌های معتمد به نفس شما همگام خواهد شد.»`
      );
    }
  }

  if (lang === 'ar' || lang === 'ckb') {
    const isKurdish = lang === 'ckb';
    const section = isKurdish
      ? {
          general: 'لێکدانەوەی گشتی',
          love: 'لێکدانەوەی پەیوەندی',
          career: 'لێکدانەوەی کار و دارایی',
          advice: 'ئامۆژگاری لوما',
        }[category]
      : {
          general: 'قراءة عامة',
          love: 'قراءة العلاقات',
          career: 'قراءة العمل والمال',
          advice: 'نصيحة لوما',
        }[category];
    const guidance = isKurdish
      ? isReversed
        ? `تۆشی کارتە «${cardName}» بە پێچەوانە بانگت دەکات بە وریایی و بیرکردنەوەوە لە هەنگاوی داهاتوو.`
        : `کارتە «${cardName}» وزەی ${kwList} و دەرفەتی گەشە و هاوسەنگی دەگەیەنێت.`
      : isReversed
        ? `ظهور بطاقة «${cardName}» معكوسة يدعوك إلى التمهل ومراجعة خطواتك القادمة.`
        : `تحمل بطاقة «${cardName}» طاقة ${kwList} وفرصة للنمو واستعادة التوازن.`;
    return `${section}: ${guidance} ${baseMeaning}`;
  }

  // نسخه چندزبانه استاندارد (انگلیسی / عربی / کردی)
  if (category === 'general') {
    return isReversed
      ? `Reversed, "${cardName}" points toward an essential inward retreat and recalibration (${kwList}). Rather than fighting external delays, use this passage to illuminate subconscious resistance and heal self-limiting narratives. ${baseMeaning}`
      : `"${cardName}" resonates directly with cosmic clarity, embodiment, and alignment (${kwList}). Governed by the dynamics of ${suitInfo.element}, it empowers purposeful manifestation and inner sovereignty. ${baseMeaning}`;
  }
  if (category === 'love') {
    return isReversed
      ? `In emotional bonds, reversed ${cardName} invites clear communication, shedding codependency, and creating grounded emotional borders to revitalize true intimacy.`
      : `In matters of the heart, ${cardName} heralds genuine resonance, compassionate vulnerability, and profound emotional understanding.`;
  }
  if (category === 'career') {
    return isReversed
      ? `Professionally, reversed ${cardName} counsels against impulsive risks. Audit agreements, reinforce fiscal discipline, and rebuild foundational strategy.`
      : `In career and enterprise, ${cardName} signifies tangible mastery, strategic expansion, and deserved recognition for disciplined craftsmanship.`;
  }
  return isReversed
    ? `Cosmic Counsel: Surrender the illusion of total control. Harmony begins when you embrace acceptance over resistance.`
    : `Cosmic Counsel: Anchor yourself in intuitive clarity. Step forward with trust; your path is supported by steady cosmic momentum.`;
}

export function generatePositionMeaning(
  spreadId: string,
  positionIndex: number,
  card: TarotCard,
  isReversed: boolean,
  lang: SupportedTarotLang = 'fa'
): string {
  const templates = getTemplatesForSpread(spreadId, lang);
  const template = templates[positionIndex];
  const baseMeaning = getLocalizedCardMeaning(card, isReversed, lang);

  if (!template) {
    return baseMeaning;
  }

  return `${template.prefix} ${template.connector} ${baseMeaning} ${template.suffix}`;
}

export function generateInterpretationHint(
  spreadId: string,
  positionIndex: number,
  lang: SupportedTarotLang = 'fa'
): string {
  const templates = getTemplatesForSpread(spreadId, lang);
  const template = templates[positionIndex];
  return template?.hint || (lang === 'fa' ? 'این کارت را در بستر پرسش کاربر تفسیر کن.' : "Interpret this card in the context of the user's question.");
}