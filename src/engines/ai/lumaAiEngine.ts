import { ALL_TAROT_CARDS } from '../tarot';
import type { TarotCard } from '../tarot/types';
import { toPersianDigits } from '../calendar/format';
import { supabase } from '../../lib/supabase';

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  sentiment?: {
    labelFa: string;
    color: string;
    toneAdvice: string;
    domain: 'love' | 'career' | 'decision' | 'spiritual' | 'anxious' | 'general';
  };
  drawnCard?: TarotCard;
  createdAt: string;
}

interface UserCosmicContext {
  displayName: string;
  sunSignFa: string;
  moonSignFa: string;
  ascSignFa: string;
  elementFa: string;
  lifePathNumber: number;
  rulingPlanet: string;
}

/**
 * تحلیل معنایی عمیق جملات و واژگان پرسش کاربر
 */
function analyzeUserQuerySemantics(query: string): {
  domain: 'love' | 'career' | 'decision' | 'spiritual' | 'anxious' | 'general';
  labelFa: string;
  color: string;
  toneAdvice: string;
  temporalFocus: 'past' | 'present' | 'future';
  extractedCoreTerms: string[];
} {
  const q = query.toLowerCase();

  // تشخیص کانون زمانی پرسش
  let temporalFocus: 'past' | 'present' | 'future' = 'present';
  if (/(کی|آینده|بعدا|آیا می‌شود|خواهد شد|قراره|نتیجه|سرانجام)/.test(q)) {
    temporalFocus = 'future';
  } else if (/(چرا شد|گذشته|علت|قبلا|دلیل اینکه|پشیمان)/.test(q)) {
    temporalFocus = 'past';
  }

  // استخراج واژگان کلیدی برای انعکاس در تحلیل
  const coreTerms: string[] = [];
  const keywordMatches = q.match(/(رابطه|ازدواج|شغل|پول|مهاجرت|تردید|عشق|احساس|خیانت|موفقیت|جدایی|امتحان|سرمایه|هدف)/g);
  if (keywordMatches) {
    coreTerms.push(...Array.from(new Set(keywordMatches)));
  }

  if (/(تردید|دوراهی|انتخاب|چه کنم|کدام|بروم یا بمانم|صلاح|درست است)/.test(q)) {
    return {
      domain: 'decision',
      labelFa: 'بر سر دوراهی و نیازمند بصیرت برای تصمیم‌گیری',
      color: '#A855F7',
      toneAdvice: 'کلام شما نشان‌دهنده یک دوراهی مهم است؛ خرد کیهانی به شما یادآوری می‌کند که تصمیم‌های بزرگ نیازمند سکوت ذهنی و شنیدن صدای قلب هستند.',
      temporalFocus,
      extractedCoreTerms: coreTerms,
    };
  }

  if (/(عشق|رابطه|ازدواج|احساس|دوست|همسر|معشوق|کراش|کات|قهر|برمیگرده)/.test(q)) {
    return {
      domain: 'love',
      labelFa: 'متمرکز بر پیوندهای قلبی و روابط عاطفی',
      color: '#FB7185',
      toneAdvice: 'پرسش شما ریشه در ارتعاشات عاطفی دارد؛ در موضوعات پیوند قلبی، موقعیت برج ماه شما راهنمای راستین احساسات ناگفته است.',
      temporalFocus,
      extractedCoreTerms: coreTerms,
    };
  }

  if (/(کار|شغل|پول|مالی|درآمد|سرمایه|قرارداد|پروژه|مهاجرت|استخدام|تجارت|ثروت)/.test(q)) {
    return {
      domain: 'career',
      labelFa: 'متمرکز بر پیشرفت شغلی، مالی و اهداف مادی',
      color: '#34D399',
      toneAdvice: 'کانون تمرکز شما روی ساختن بنیان‌های عملی و ثروت مادی است؛ عنصر وجودی شما مسیر هدایت انرژی و عملگرایی را مشخص می‌کند.',
      temporalFocus,
      extractedCoreTerms: coreTerms,
    };
  }

  if (/(نگران|ترس|استرس|خسته|آشفته|بیماری|غم|تنها|سخت|درد)/.test(q)) {
    return {
      domain: 'anxious',
      labelFa: 'حساس و نیازمند التیام و آرامش باطنی',
      color: '#F59E0B',
      toneAdvice: 'شهد تلخ دل‌نگرانی در پرسش شما احساس می‌شود؛ به یاد داشته باشید که هر تلاطم روحی، آغازگر یک بیداری و پالایش درونی است.',
      temporalFocus,
      extractedCoreTerms: coreTerms,
    };
  }

  if (/(معنویت|روحی|خواب|الهام|رسالت|هدف زندگی|شهود|کیهان)/.test(q)) {
    return {
      domain: 'spiritual',
      labelFa: 'جویای رسالت روح و آگاهی متعالی',
      color: '#6366F1',
      toneAdvice: 'جان کلام شما در جستجوی پاسخ‌های فراتر از جهان ماده است؛ ارتعاش کارت انتخابی پرده از اسرار درون برخواهد داشت.',
      temporalFocus,
      extractedCoreTerms: coreTerms,
    };
  }

  return {
    domain: 'general',
    labelFa: 'جویای شفافیت و راهنمایی کیهانی',
    color: '#D4AF37',
    toneAdvice: 'ندای باطنی شما در جستجوی وضوح و فهم بهتر جریان امور است.',
    temporalFocus,
    extractedCoreTerms: coreTerms,
  };
}

/**
 * گزینش هوشمند کارت بر پایه هارمونی سوال، چارت نجومی و بذر زمان
 */
function selectSmartCardForQuery(query: string, domain: string, lifePath: number): TarotCard {
  let seed = lifePath * 31 + Date.now();
  for (let i = 0; i < query.length; i++) {
    seed += query.charCodeAt(i) * (i + 3);
  }

  let pool = ALL_TAROT_CARDS;
  if (domain === 'love') {
    pool = ALL_TAROT_CARDS.filter((c) => c.suit === 'cups' || c.arcana === 'major');
  } else if (domain === 'career') {
    pool = ALL_TAROT_CARDS.filter((c) => c.suit === 'pentacles' || c.suit === 'wands' || c.arcana === 'major');
  } else if (domain === 'decision') {
    pool = ALL_TAROT_CARDS.filter((c) => c.suit === 'swords' || c.arcana === 'major');
  }

  return pool[Math.abs(seed) % pool.length] || ALL_TAROT_CARDS[0];
}

export async function generateSmartAiResponse(
  userQuery: string,
  ctx: UserCosmicContext,
  lang: 'fa' | 'ckb' | 'ar' | 'en' = 'fa',
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<AiChatMessage> {
  const semantics = analyzeUserQuerySemantics(userQuery);
  const card = selectSmartCardForQuery(userQuery, semantics.domain, ctx.lifePathNumber);

  try {
    const { data, error } = await supabase.functions.invoke<{ answer?: string }>('luma-ai-chat', {
      body: {
        query: userQuery,
        context: {
          sunSign: ctx.sunSignFa,
          moonSign: ctx.moonSignFa,
          ascendant: ctx.ascSignFa,
          element: ctx.elementFa,
          lifePathNumber: ctx.lifePathNumber,
          rulingPlanet: ctx.rulingPlanet,
          card: card.nameFa,
        },
        lang,
        history: history.slice(-8),
      },
    });
    if (error) throw error;
    if (typeof data?.answer === 'string' && data.answer.trim()) {
      return {
        id: String(Date.now()),
        sender: 'ai',
        text: data.answer.trim(),
        sentiment: semantics,
        drawnCard: card,
        createdAt: new Date().toISOString(),
      };
    }
    throw new Error('AI endpoint returned no answer.');
  } catch (error) {
    console.error('LUMA AI service is unavailable; using the local reading engine:', error);
  }

  // موتور پردازش زبان بومی و تحلیلی لوما
  const keywordsStr = card.keywords.slice(0, 3).join(' • ');
  if (lang === 'en') {
    return {
      id: String(Date.now()),
      sender: 'ai',
      text: [
        `Your question points to ${semantics.domain === 'general' ? 'a need for clarity' : semantics.domain}.`,
        `The selected card, ${card.nameEn}, invites reflection rather than a guaranteed prediction. Consider what its themes bring up for you, then choose one practical step that is within your control.`,
        `Use your chart and life-path details as reflective prompts, not as professional medical, legal, financial, or mental-health advice.`,
      ].join('\n\n'),
      sentiment: semantics,
      drawnCard: card,
      createdAt: new Date().toISOString(),
    };
  }
  if (lang === 'ar') {
    return {
      id: String(Date.now()),
      sender: 'ai',
      text: [
        'يشير سؤالك إلى موضوع يستحق التأمل والهدوء.',
        'قراءة التاروت أداة للتفكير وليست تنبؤاً مؤكداً. تأمل الخيارات المتاحة واختر خطوة عملية يمكنك التحكم بها.',
        'هذه القراءة ليست بديلاً عن الاستشارة الطبية أو القانونية أو المالية أو النفسية المتخصصة.',
      ].join('\n\n'),
      sentiment: semantics,
      drawnCard: card,
      createdAt: new Date().toISOString(),
    };
  }
  if (lang === 'ckb') {
    return {
      id: String(Date.now()),
      sender: 'ai',
      text: [
        'پرسیارەکەت بابەتێک دەردەخات کە پێویستی بە بیرکردنەوە و ئارامی هەیە.',
        'تارۆت ئامرازێکە بۆ بیرکردنەوە، نەک پێشبینییەکی دڵنیایی. هەڵبژاردەکانت هەڵبسەنگێنە و هەنگاوێکی کرداری کە لە کۆنترۆڵی خۆتدایە هەڵبژێرە.',
        'ئەم خوێندنەوەیە جێگرەوەی ڕاوێژی پزیشکی، یاسایی، دارایی یان دەروونی نییە.',
      ].join('\n\n'),
      sentiment: semantics,
      drawnCard: card,
      createdAt: new Date().toISOString(),
    };
  }
  const coreFocusText =
    semantics.extractedCoreTerms.length > 0
      ? `با دقت در کلیدواژه‌های دغدغه شما پیرامون «${semantics.extractedCoreTerms.join(' و ')}»، `
      : '';

  const temporalMessage =
    semantics.temporalFocus === 'future'
      ? 'ستارگان نشان می‌دهند که رویدادهای پیش رو بازتاب مستقیم انضباط ذهنی کنونی شما هستند.'
      : semantics.temporalFocus === 'past'
      ? 'نگاه به گذشته را از دریچه پذیرش و عبرت بنگرید، نه سرزنش؛ چرا که خاکستر دیروز بستر رویش فرداست.'
      : 'تمرکز شما باید کاملاً بر نقطه اکنون باشد؛ چرا که چرخش تقدیر دقیقاً در لحظه حاضر شکل می‌گیرد.';

  const synthesizedAnalysis = [
    `✨ **درود بر شما ${ctx.displayName} گرامی؛**`,
    `${semantics.toneAdvice}`,
    ``,
    `🃏 **پیام کهن‌الگوی کیهانی: «${card.nameFa} (${card.nameEn})»**`,
    `${coreFocusText}کارت «${card.nameFa}» با ارتعاش بنیادین (${keywordsStr}) در پاسخ به نیت شما گشوده شده است. این کهن‌الگو بیانگر آن است که: ${card.upright.meaning}`,
    ``,
    `🪐 **هم‌افزایی با چارت تولد شما:**`,
    `با توجه به قرارگیری خورشید شما در نشان **${ctx.sunSignFa}** (عنصر ${ctx.elementFa}) و بازتاب عواطف شما در برج ماه **${ctx.moonSignFa}** با هدایت سیاره حاکم **${ctx.rulingPlanet}**، جریان کنونی زندگی شما را به هماهنگی میان منطق بیرونی و شهود درونی فرامی‌خواند. ${temporalMessage}`,
    ``,
    `💡 **فرمان عملی لوما (مسیر زندگی ${toPersianDigits(ctx.lifePathNumber)}):**`,
    semantics.domain === 'love'
      ? `در ساحت قلب، از شتاب‌زدگی و حدس‌های واهی بپرهیزید. شفافیت در گفتار و بخشش درونی، پیوندها را دگرگون خواهد کرد.`
      : semantics.domain === 'career'
      ? `در زمینه کار و رفاه مادی، بر اولویت‌های زیربنایی تمرکز کنید و اجازه ندهید حواشی زودگذر شما را از هدف اصلی منحرف سازند.`
      : semantics.domain === 'decision'
      ? `پاسخ این دوراهی نزد عقل مصلحت‌اندیش نیست؛ زمانی که ذهن خاموش شود، قطب‌نمای حقیقت به روشنی راه را نشان می‌دهد.`
      : `با آرامش و اعتماد به کائنات گام بردارید؛ هم‌اکنون نشانه‌های خیر در مدار شما فعال گشته‌اند.`,
  ].join('\n');

  return {
    id: String(Date.now()),
    sender: 'ai',
    text: synthesizedAnalysis,
    sentiment: semantics,
    drawnCard: card,
    createdAt: new Date().toISOString(),
  };
}