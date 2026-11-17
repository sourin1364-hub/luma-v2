import { useLanguageStore } from '../../i18n/useLanguageStore';

export type SupportedLang = 'fa' | 'ku' | 'ar' | 'en';

export function resolveTarotLang(lang?: string): SupportedLang {
  const raw = lang || useLanguageStore.getState().lang || 'fa';
  if (raw === 'ckb' || raw === 'ku') return 'ku';
  if (raw === 'ar') return 'ar';
  if (raw === 'en') return 'en';
  return 'fa';
}

export interface LocalizedCardContent {
  name: string;
  keywords?: string[];
  uprightMeaning?: string;
  reversedMeaning?: string;
  description?: string;
}

// بانک ترجمه نام کارت‌های کبیر (Major Arcana) برای ۴ زبان
const MAJOR_ARCANA_NAMES: Record<string, Record<SupportedLang, string>> = {
  'major-0': { fa: 'ابله (شروع نو)', ku: 'شێت (دەستپێکی نوێ)', ar: 'الأحمق (بداية جديدة)', en: 'The Fool' },
  'major-1': { fa: 'جادوگر (کیمیاگر)', ku: 'جادووگەر (توانایی)', ar: 'الساحر (القدرة)', en: 'The Magician' },
  'major-2': { fa: 'کاهنه اعظم (شهود)', ku: 'کاهینی مەزن (ئاشکراکردن)', ar: 'الكاهنة العليا (الحدس)', en: 'The High Priestess' },
  'major-3': { fa: 'امپراتریس (فراوانی)', ku: 'ئیمپراتۆرژن (پیت و بەرەکەت)', ar: 'الإمبراطورة (الوفرة)', en: 'The Empress' },
  'major-4': { fa: 'امپراتور (اقتدار)', ku: 'ئیمپراتۆر (دەسەڵات)', ar: 'الإمبراطور (السلطة)', en: 'The Emperor' },
  'major-5': { fa: 'هیروفانت (مرشد)', ku: 'ڕێبەری ڕۆحی (حیکمەت)', ar: 'الكاهن الأعظم (الحكمة)', en: 'The Hierophant' },
  'major-6': { fa: 'عشاق (انتخاب و پیوند)', ku: 'عاشقان (ئەوین و هەڵبژاردن)', ar: 'العشاق (الحب والاختيار)', en: 'The Lovers' },
  'major-7': { fa: 'ارابه (پیروزی و اراده)', ku: 'گالیسکە (سەرکەوتن)', ar: 'العربة (النصر والإرادة)', en: 'The Chariot' },
  'major-8': { fa: 'قدرت (شهامت درونی)', ku: 'هێز (ئارامی و بوێری)', ar: 'القوة (الشجاعة الداخلية)', en: 'Strength' },
  'major-9': { fa: 'زاهد (درون‌نگری)', ku: 'گۆشەگیر (ڕامانی قووڵ)', ar: 'الناسك (التأمل الداخلي)', en: 'The Hermit' },
  'major-10': { fa: 'چرخ سرنوشت', ku: 'چەرخی چارەنووس', ar: 'عجلة الحظ', en: 'Wheel of Fortune' },
  'major-11': { fa: 'عدالت (توازن و کارما)', ku: 'دادپەروەری (هاوسەنگی)', ar: 'العدالة (التوازن والكارما)', en: 'Justice' },
  'major-12': { fa: 'مرد دارآویز (زاویه دید نو)', ku: 'هەڵواسراو (تێڕوانینی نوێ)', ar: 'المشنوق (بصيرة جديدة)', en: 'The Hanged Man' },
  'major-13': { fa: 'مرگ (دگرگونی و تولد دوباره)', ku: 'مەرگ (گۆڕانکاری بنەڕەتی)', ar: 'الموت (التحول والتجدد)', en: 'Death' },
  'major-14': { fa: 'اعتدال (هماهنگی و شفا)', ku: 'هاوسەنگی (ئارامی و شیفا)', ar: 'الاعتدال (التناغم والشفاء)', en: 'Temperance' },
  'major-15': { fa: 'شیطان (وابستگی و سایه‌ها)', ku: 'شەیتان (بەستراوەیی و وەهم)', ar: 'الشيطان (القيود والظلال)', en: 'The Devil' },
  'major-16': { fa: 'برج (فروپاشی ناگهانی)', ku: 'بورج (گۆڕانی لەناکاو)', ar: 'البرج (الانهيار المفاجئ)', en: 'The Tower' },
  'major-17': { fa: 'ستاره (امید و الهام)', ku: 'ئەستێرە (هیوا و ڕووناکی)', ar: 'النجم (الأمل والإلهام)', en: 'The Star' },
  'major-18': { fa: 'ماه (ناخودآگاه و رمز و راز)', ku: 'مانگ (نهێنی و خەیاڵ)', ar: 'القمر (اللاوعي والغموض)', en: 'The Moon' },
  'major-19': { fa: 'خورشید (شادی و روشنایی)', ku: 'خۆر (خۆشی و سەرکەوتن)', ar: 'الشمس (السعادة والوضوح)', en: 'The Sun' },
  'major-20': { fa: 'رستاخیز (بیداری و فراخوان)', ku: 'زیندووبوونەوە (بەئاگاهاتنەوە)', ar: 'الحكم (اليقظة والنداء)', en: 'Judgement' },
  'major-21': { fa: 'جهان (کمال و تحقق)', ku: 'جیهان (تەواوبوون و گەیشتن)', ar: 'العالم (الكمال والإنجاز)', en: 'The World' }
};

/**
 * دریافت نام کارت به زبان انتخاب‌شده کاربر بدون دستکاری آبجکت اصلی کارت
 */
export function getLocalizedCardName(card: any, lang?: string): string {
  if (!card) return '';
  const currentLang = resolveTarotLang(lang);

  if (currentLang === 'fa') {
    return card.nameFa || card.name || '';
  }

  if (currentLang === 'en' && card.nameEn) {
    return card.nameEn;
  }

  const rawCardId = String(card.id || '').toLowerCase();
  const majorIndex = rawCardId.match(/^major-(\d+)(?:-|$)/)?.[1];
  const cardId = majorIndex === undefined ? rawCardId : `major-${Number(majorIndex)}`;
  if (MAJOR_ARCANA_NAMES[cardId]?.[currentLang]) {
    return MAJOR_ARCANA_NAMES[cardId][currentLang];
  }

  // پشتیبانی هوشمند از کارت‌های صغیر (Minor Arcana) در صورت نبود در جدول کبیر
  return translateMinorArcanaName(card, currentLang);
}

function translateMinorArcanaName(card: any, lang: SupportedLang): string {
  const rawFa = card.nameFa || '';
  const rawEn = card.nameEn || card.name || '';

  if (lang === 'en') return rawEn || rawFa;

  // دیکشنری تبدیل سریع خال‌ها و اعداد کارت‌های صغیر برای کوردی و عربی
  const dict: Record<'ku' | 'ar', Record<string, string>> = {
    ku: {
      'آس': 'تەکی', 'دو': 'دووی', 'سه': 'سێی', 'چهار': 'چواری', 'پنج': 'پێنجی',
      'شش': 'شەشی', 'هفت': 'حەوتی', 'هشت': 'هەشتی', 'نه': 'نۆی', 'ده': 'دەی',
      'غلام': 'پەیکی', 'شوالیه': 'سوارچاکی', 'ملکه': 'شاژنی', 'پادشاه': 'پاشای',
      'چوب‌دست': 'دارینەکان', 'چوبدست': 'دارینەکان', 'جام': 'جامەکان',
      'شمشیر': 'شمشێرەکان', 'سکه': 'سکەکان'
    },
    ar: {
      'آس': 'آس', 'دو': 'اثنان من', 'سه': 'ثلاثة من', 'چهار': 'أربعة من', 'پنج': 'خمسة من',
      'شش': 'ستة من', 'هفت': 'سبعة من', 'هشت': 'ثمانية من', 'نه': 'تسعة من', 'ده': 'عشرة من',
      'غلام': 'شاب', 'شوالیه': 'فارس', 'ملکه': 'ملكة', 'پادشاه': 'ملك',
      'چوب‌دست': 'العصي', 'چوبدست': 'العصي', 'جام': 'الكؤوس',
      'شمشیر': 'السيوف', 'سکه': 'الخماسي (الدنانير)'
    }
  };

  if (lang === 'ku' || lang === 'ar') {
    let translated = rawFa;
    const map = dict[lang];
    Object.keys(map).forEach((faWord) => {
      translated = translated.replace(new RegExp(faWord, 'g'), map[faWord]);
    });
    return translated || rawEn || rawFa;
  }

  return rawFa;
}

// ==========================================
// موتور ترجمه هوشمند تفاسیر، کلمات کلیدی و جایگاه‌های چیدمان در ۴ زبان
// ==========================================

const MAJOR_MEANINGS: Record<string, Record<'ku' | 'ar' | 'en', { upright: string; reversed: string; keywords: string[] }>> = {
  'major-0': {
    ku: {
      upright: 'ئەم کارتە نیشانەی دەستپێکێکی نوێ، سەرکەوتنی چاوەڕواننەکراو و متمانە بە ڕێڕەوی ژیانە. بە دڵێکی پاکەوە هەنگاو بنێ.',
      reversed: 'ئاگاداری بڕیاری بەپەلە، بێباکی یان ترس لە گۆڕانکاری بە. پێش هەر هەنگاوێک باشتر بیر بکەرەوە.',
      keywords: ['دەستپێکی نوێ', 'ئازادی', 'سەرسامی', 'پاکێتی']
    },
    ar: {
      upright: 'تشير هذه البطاقة إلى بداية جديدة، مغامرة مشوقة وثقة كاملة في رحلة الحياة. انطلق بقلب منفتح.',
      reversed: 'احذر من التسرع، المجازفة غير المحسوبة أو الخوف من المجهول. تأنَّ قبل اتخاذ قرارك القادم.',
      keywords: ['بداية جديدة', 'حرية', 'مغامرة', 'عفوية']
    },
    en: {
      upright: 'Signifies a fresh start, leap of faith, and embracing new beginnings with an open heart and optimism.',
      reversed: 'Warns against recklessness, hesitation, or fear of the unknown. Think carefully before leaping.',
      keywords: ['New Beginnings', 'Innocence', 'Spontaneity', 'Free Spirit']
    }
  },
  'major-1': {
    ku: {
      upright: 'هەموو ئامراز و تواناکانی سەرکەوتن لەبەردەستی تۆدایە. کاتی ئەوەیە بیرۆکەکانت بکەیتە ڕاستی و هێزی خۆت نیشان بدەیت.',
      reversed: 'وزە و بەهرەکانت بەفیڕۆ مەدە. دوودڵی یان فێڵ و ناڕوونی لەوانەیە ڕێگر بن لە پێشکەوتنت.',
      keywords: ['داهێنان', 'ئیرادە', 'توانایی', 'جێبەجێکردن']
    },
    ar: {
      upright: 'تمتلك الآن كل الأدوات والمواهب لتحقيق أهدافك. حان وقت تحويل الأفكار إلى واقع ملموس بقوة إرادتك.',
      reversed: 'احذر من تشتت الطاقة، التلاعب أو الشك في قدراتك الذاتية. ركز على هدف واضح.',
      keywords: ['القدرة', 'الإرادة', 'الإبداع', 'التجسيد']
    },
    en: {
      upright: 'You have all the tools and resources needed to manifest your desires. Take inspired action now.',
      reversed: 'Indicates untapped potential, scattered energy, or manipulation. Realign with your true purpose.',
      keywords: ['Manifestation', 'Resourcefulness', 'Power', 'Inspired Action']
    }
  },
  'major-2': {
    ku: {
      upright: 'گوێ لە دەنگی ناوەوە و هەستی شەشەمی خۆت بگرە. نهێنییەکان بەم زووانە ئاشکرا دەبن؛ پەلە مەکە.',
      reversed: 'پشتگوێخستنی هەستی ناوەکی و سەرنجدان تەنها بە ڕووکەشی بابەتەکان. کاتی گەڕانەوەیە بۆ ئارامی دەروونی.',
      keywords: ['هەستی شەشەم', 'نهێنی', 'حیکمەت', 'ئارامی']
    },
    ar: {
      upright: 'استمع إلى صوتك الداخلي وحدسك العميق. هناك حقائق خفية ستنكشف لك في الوقت المناسب.',
      reversed: 'تجاهل الحدس أو الانشغال بالسطحيات. تواصل مع حكمتك الداخلية ولا تتسرع في الحكم.',
      keywords: ['الحدس', 'الأسرار', 'الحكمة الباطنية', 'الهدوء']
    },
    en: {
      upright: 'Trust your intuition and inner voice. Hidden knowledge and subconscious truths are guiding you.',
      reversed: 'Suggests blocked intuition, secrets, or ignoring your inner wisdom. Look beneath the surface.',
      keywords: ['Intuition', 'Sacred Knowledge', 'Divine Feminine', 'Subconscious']
    }
  },
  'major-3': {
    ku: {
      upright: 'پیت و بەرەکەت، خۆشەویستی دایکانە و گەشەکردنی داهێنەرانە لە ژیانتدا دەردەکەوێت.',
      reversed: 'بۆشایی سۆزداری یان وەستانی وزەی داهێنان. گرنگی بە چاودێری خۆت بدە.',
      keywords: ['بەرەکەت', 'سروشت', 'جوانی', 'گەشەکردن']
    },
    ar: {
      upright: 'وفرة، إبداع وازدهار في طريقه إليك. احتضن طاقة الجمال والعطاء في حياتك.',
      reversed: 'إهمال الذات أو ركود إبداعي مؤقت. أعد اتصالك بالطبيعة واهتم بتوازنك العاطفي.',
      keywords: ['الوفرة', 'الأنوثة', 'الطبيعة', 'الازدهار']
    },
    en: {
      upright: 'Abundance, nurturing energy, and creative blossoming surround you now.',
      reversed: 'Creative block or lack of self-care. Reconnect with nature and nurture yourself.',
      keywords: ['Abundance', 'Nurturing', 'Fertility', 'Beauty']
    }
  },
  'major-4': {
    ku: {
      upright: 'سەقامگیری، دەسەڵات و پلاندانانی ورد دەتگەیەنێتە ئامانج. بە دیسیپلینەوە بڕۆ پێش.',
      reversed: 'توندی زیاد لە پێویست یان نەبوونی نەزم و پلان. نەرمونیانی بنوێنە.',
      keywords: ['دەسەڵات', 'سەقامگیری', 'یاسا', 'پاراستن']
    },
    ar: {
      upright: 'الاستقرار، الحزم والتنظيم الواضح يقودك نحو النجاح وحماية مكتسباتك.',
      reversed: 'تصلب في الرأي أو فقدان السيطرة والانضباط. وازن بين الحزم والمرونة.',
      keywords: ['السلطة', 'الاستقرار', 'النظام', 'القيادة']
    },
    en: {
      upright: 'Structure, authority, and disciplined leadership bring stability and protection.',
      reversed: 'Rigidity, domination, or lack of discipline. Balance control with flexibility.',
      keywords: ['Authority', 'Structure', 'Stability', 'Leadership']
    }
  },
  'major-5': {
    ku: {
      upright: 'فێربوون، ڕێنمایی وەرگرتن لە کەسانی دانا و پابەندبوون بە بەها ڕەسەنەکان.',
      reversed: 'شکاندنی چوارچێوە کۆنەکان و دۆزینەوەی ڕێگای تایبەت بە خۆت.',
      keywords: ['حیکمەت', 'فێربوون', 'سوننەت', 'ڕێبەری']
    },
    ar: {
      upright: 'التعلم، الحكمة التقليدية وطلب الإرشاد من أهل الخبرة والمعرفة.',
      reversed: 'التحرر من القيود التقليدية والبحث عن قناعاتك ومسارك الشخصي.',
      keywords: ['الحكمة', 'التقاليد', 'الإرشاد', 'المعرفة']
    },
    en: {
      upright: 'Spiritual wisdom, mentorship, and learning from established traditions.',
      reversed: 'Personal beliefs, freedom of thought, and challenging the status quo.',
      keywords: ['Tradition', 'Wisdom', 'Mentorship', 'Beliefs']
    }
  },
  'major-6': {
    ku: {
      upright: 'هاوسەنگی لە خۆشەویستی، پەیوەندی ڕاستگۆیانە و هەڵبژاردنێکی گرنگی دڵ.',
      reversed: 'دوودڵی لە بڕیاردان یان ناهەماهەنگی لە پەیوەندیدا. ڕاستگۆ بە لەگەڵ خۆت.',
      keywords: ['ئەوین', 'یەکگرتن', 'هەڵبژاردن', 'هاوسەنگی']
    },
    ar: {
      upright: 'انسجام عاطفي عميق، شراكة صادقة واختيار مهم ينبع من القلب.',
      reversed: 'تردد في القرار أو عدم توازن في العلاقة. راجع قيمك الحقيقية.',
      keywords: ['الحب', 'الانسجام', 'الاختيار', 'الشراكة']
    },
    en: {
      upright: 'Deep connection, harmony in relationships, and meaningful choices aligned with your values.',
      reversed: 'Disharmony, indecision, or misalignment of values. Listen to your true heart.',
      keywords: ['Love', 'Harmony', 'Choices', 'Alignment']
    }
  },
  'major-7': {
    ku: {
      upright: 'سەرکەوتن بەسەر بەربەستەکاندا بە هێزی ئیرادە و تەرکیز لەسەر ئامانج.',
      reversed: 'پەرتەوازەیی وزە یان نەبوونی ئاراستەی دیاریکراو. جڵەوی کارەکان بگرە دەست.',
      keywords: ['سەرکەوتن', 'ئیرادە', 'پێشکەوتن', 'بوێری']
    },
    ar: {
      upright: 'انتصار وتقدم سريع بفضل العزيمة القوية والتركيز الكامل على الهدف.',
      reversed: 'فقدان الاتجاه أو تشتت الجهود. استعد السيطرة وحدد مسارك بوضوح.',
      keywords: ['النصر', 'الإرادة', 'التقدم', 'العزيمة']
    },
    en: {
      upright: 'Victory through willpower, determination, and focused direction.',
      reversed: 'Lack of direction or scattered control. Regain focus before charging ahead.',
      keywords: ['Victory', 'Willpower', 'Determination', 'Control']
    }
  },
  'major-8': {
    ku: {
      upright: 'هێزی ناوەکی، ئارامگرتن و زاڵبوون بەسەر ترسەکان بە میهرەبانی و بڕوا.',
      reversed: 'گومان لە تواناکانی خۆت یان ماندووبوونی دەروونی. باوەڕت بە هێزی خۆت نوێ بکەرەوە.',
      keywords: ['هێزی ناوخۆ', 'ئارامی', 'بوێری', 'میهرەبانی']
    },
    ar: {
      upright: 'قوة داخلية هادئة، شجاعة وصبر جميل يذلل أصعب التحديات.',
      reversed: 'شك في الذات أو استنزاف للطاقة. استمد القوة من هدوئك وثقتك بنفسك.',
      keywords: ['القوة', 'الشجاعة', 'الصبر', 'الرحمة']
    },
    en: {
      upright: 'Inner strength, courage, patience, and gentle mastery over challenges.',
      reversed: 'Self-doubt or low energy. Reconnect with your inner resilience and compassion.',
      keywords: ['Strength', 'Courage', 'Patience', 'Compassion']
    }
  },
  'major-9': {
    ku: {
      upright: 'کاتی تێڕامان، گەڕان بەدوای ڕاستی لە ناخدا و دوورکەوتنەوە لە ژاوەژاو.',
      reversed: 'گۆشەگیری زیاد لە پێویست یان ڕاکردن لە ڕووبەڕووبوونەوە لەگەڵ خۆت.',
      keywords: ['تێڕامان', 'حیکمەت', 'تەنیایی بەسوود', 'ڕووناکی ناخ']
    },
    ar: {
      upright: 'فترة للتأمل الذاتي والبحث عن الحقيقة والنور في داخلك بعيداً عن الضجيج.',
      reversed: 'عزلة مفرطة أو تجاهل لصوت الحكمة الداخلي. لا تغلق قلبك عن العالم.',
      keywords: ['التأمل', 'الحكمة', 'البصيرة', 'الهدوء']
    },
    en: {
      upright: 'Soul-searching, introspection, and finding inner guidance in quiet solitude.',
      reversed: 'Isolation or avoiding inner truth. Balance solitude with connection.',
      keywords: ['Introspection', 'Solitude', 'Inner Light', 'Wisdom']
    }
  },
  'major-10': {
    ku: {
      upright: 'گۆڕانی ئەرێنی چەرخی ڕۆژگار، بەختی باش و دەرفەتی چارەنووسساز.',
      reversed: 'بەرگریکردن لە گۆڕانکاری یان دواکەوتنی کاتی. لەگەڵ ڕەوتی ژیان ڕێبکە.',
      keywords: ['چارەنووس', 'گۆڕانکاری', 'بەخت', 'سوڕی ژیان']
    },
    ar: {
      upright: 'تحول إيجابي في مجرى الأحداث، حظوظ مواتية وفرص قدرية جديدة.',
      reversed: 'مقاومة التغيير أو تأخر مؤقت. تقبل تقلبات الحياة بحكمة ومرونة.',
      keywords: ['الحظ', 'القدر', 'التحول', 'دورات الحياة']
    },
    en: {
      upright: 'Good luck, destiny at work, and a positive turning point in life’s cycle.',
      reversed: 'Resistance to change or temporary delays. Flow with the shifting tides.',
      keywords: ['Destiny', 'Good Luck', 'Cycles', 'Turning Point']
    }
  },
  'major-11': {
    ku: {
      upright: 'دادپەروەری، دەرکەوتنی ڕاستی و وەرگرتنەوەی پاداشتی کارەکانت بە یەکسانی.',
      reversed: 'نادادپەروەری یان خۆدزینەوە لە بەرپرسیارێتی. بە ویژدانەوە بڕیار بدە.',
      keywords: ['دادپەروەری', 'ڕاستی', 'کارما', 'هاوسەنگی']
    },
    ar: {
      upright: 'تحقيق العدالة، ظهور الحقيقة واتخاذ قرارات متوازنة ومنصفة.',
      reversed: 'انحياز أو تهرب من المسؤولية. ابحث عن التوازن والإنصاف في موقفك.',
      keywords: ['العدالة', 'الحقيقة', 'التوازن', 'القانون']
    },
    en: {
      upright: 'Fairness, truth, cause and effect, and balanced decision-making.',
      reversed: 'Imbalance, unfairness, or avoiding accountability. Seek objective truth.',
      keywords: ['Justice', 'Truth', 'Fairness', 'Karma']
    }
  },
  'major-12': {
    ku: {
      upright: 'وەستانێکی کاتی بۆ بینینی بابەتەکان لە گۆشەنیگایەکی نوێ و جیاوازەوە.',
      reversed: 'چەقبەستوویی بێهوودە یان پەلەکردنی بێ ئەنجام. دەستبەرداری کۆنترۆڵی زۆرەملێ بە.',
      keywords: ['تێڕوانینی نوێ', 'ئارامگرتن', 'وازهێنان', 'ئاگایی']
    },
    ar: {
      upright: 'توقف مؤقت يمنحك نظرة جديدة ومختلفة تماماً للأمور. الصبر مفتاح الفرج.',
      reversed: 'مماطلة أو مقاومة بلا جدوى. تخلَّ عن العادات القديمة لتمضي قدماً.',
      keywords: ['نظرة جديدة', 'التسليم', 'الصبر', 'البصيرة']
    },
    en: {
      upright: 'Pause, surrender, and gaining a powerful new perspective by letting go.',
      reversed: 'Stalling, indecisiveness, or resisting necessary pause.',
      keywords: ['New Perspective', 'Pause', 'Surrender', 'Enlightenment']
    }
  },
  'major-13': {
    ku: {
      upright: 'کۆتاییهاتنی قۆناغێکی کۆن و دەستپێکی گۆڕانکارییەکی گەورە و نوێبوونەوە.',
      reversed: 'ترس لە گۆڕانکاری و دەستگرتن بە ڕابردوو. ڕێگە بدە نوێبوونەوە ڕووبدات.',
      keywords: ['گۆڕانکاری', 'نوێبوونەوە', 'کۆتایی و دەستپێک', 'تێپەڕین']
    },
    ar: {
      upright: 'نهاية مرحلة قديمة وبداية تحول جذري وتجدد مشرق في حياتك.',
      reversed: 'تشبث بالماضي أو خوف من التغيير الضروري. افتح الباب للبدايات الجديدة.',
      keywords: ['التحول', 'التجدد', 'نهاية وبداية', 'التغيير']
    },
    en: {
      upright: 'Profound transformation, closing old chapters, and welcoming rebirth.',
      reversed: 'Resistance to change or clinging to the past. Embrace renewal.',
      keywords: ['Transformation', 'Transition', 'Renewal', 'Release']
    }
  },
  'major-14': {
    ku: {
      upright: 'هاوسەنگی، میانڕەوی، شیفای دەروونی و تێکەڵبوونی ئارام لەگەڵ ژیان.',
      reversed: 'زێدەڕۆیی یان تێکچوونی هاوسەنگی. بگەڕێوە بۆ هێمنی و ناوەندگیری.',
      keywords: ['هاوسەنگی', 'ئارامی', 'شیفا', 'پشوودرێژی']
    },
    ar: {
      upright: 'الاعتدال، التناغم الداخلي، الشفاء والتعامل مع الأمور بصبر وحكمة.',
      reversed: 'تطرف أو فقدان للتوازن النفسي. أعد ترتيب أولوياتك بهدوء.',
      keywords: ['الاعتدال', 'التوازن', 'الشفاء', 'السكينة']
    },
    en: {
      upright: 'Balance, moderation, patience, and harmonious healing energy.',
      reversed: 'Imbalance, excess, or impatience. Restore your inner equilibrium.',
      keywords: ['Balance', 'Moderation', 'Patience', 'Healing']
    }
  },
  'major-15': {
    ku: {
      upright: 'ئاگاداربوون لە بەستراوەیی، خووی نەرێنی یان سنووردارکردنی خۆت بە ترس.',
      reversed: 'پچڕاندنی زنجیرەکان، ئازادبوون لە وابەستەیی و گەڕانەوەی هێزی ئیرادە.',
      keywords: ['ئاگایی لە وابەستەیی', 'سێبەرەکان', 'ئازادبوون', 'تاقیکردنەوە']
    },
    ar: {
      upright: 'انتبه من القيود الذاتية، التعلق المفرط أو العادات التي تستنزف طاقتك.',
      reversed: 'تحرر من القيود، كسر العادات السلبية واستعادة حريتك وقوتك.',
      keywords: ['التحرر', 'الوعي', 'كسر القيود', 'الحذر']
    },
    en: {
      upright: 'Awareness of attachments, limiting beliefs, or material temptations.',
      reversed: 'Breaking free from chains, reclaiming power, and overcoming limitations.',
      keywords: ['Shadow Work', 'Attachment', 'Release', 'Awareness']
    }
  },
  'major-16': {
    ku: {
      upright: 'گۆڕانکاری لەناکاو کە بنەما ناڕاستەکان دەڕووخێنێت تا ڕاستی و نوێبوونەوە دروست بێت.',
      reversed: 'تێپەڕاندنی قەیران یان دواخستنی گۆڕانکارییەکی پێویست.',
      keywords: ['بەئاگاهاتنەوە', 'گۆڕانی خێرا', 'ڕزگاری', 'ڕاستی']
    },
    ar: {
      upright: 'تغيير مفاجئ يكشف الحقائق ويزيل البنى الهشة ليفسح المجال لبناء أقوى.',
      reversed: 'تجاوز أزمة أو تخفيف أثر تغيير مفاجئ بوعي ومرونة.',
      keywords: ['اليقظة', 'التغيير المفاجئ', 'الحقيقة', 'التحرر']
    },
    en: {
      upright: 'Sudden awakening, clearing false structures to build on solid truth.',
      reversed: 'Averting disaster or easing through a major transition.',
      keywords: ['Awakening', 'Breakthrough', 'Revelation', 'Rebuild']
    }
  },
  'major-17': {
    ku: {
      upright: 'هیوا، ڕووناکی، شیفای دڵ و هاتنەدی ئاواتەکان لە ژێر چاودێری گەردووندا.',
      reversed: 'کەمبوونەوەی هیوا یان بێزاری کاتی. متمانەت بە ڕووناکی داهاتوو نوێ بکەرەوە.',
      keywords: ['هیوا', 'ئیلهام', 'ئارامی', 'ئاوات']
    },
    ar: {
      upright: 'الأمل المتجدد، الإلهام، السكينة واستجابة الأمنيات الصادقة.',
      reversed: 'إحباط مؤقت أو ضعف في الثقة. لا تفقد الأمل فالنور قريب.',
      keywords: ['الأمل', 'الإلهام', 'الطمأنينة', 'التجدد']
    },
    en: {
      upright: 'Hope, faith, spiritual renewal, and serene inspiration guiding you.',
      reversed: 'Temporary discouragement. Rekindle your faith and inner light.',
      keywords: ['Hope', 'Inspiration', 'Serenity', 'Renewal']
    }
  },
  'major-18': {
    ku: {
      upright: 'خەیاڵ، هەستی قووڵ و پەیامەکانی نائاگا. پەلە مەکە تا تەمومژەکە نامێنێت.',
      reversed: 'ڕەوینەوەی گومان و دەرکەوتنی ڕاستییە شاراوەکان بە ڕوونی.',
      keywords: ['نهێنی', 'خەون', 'هەستی ناوخۆ', 'ئاشکرابوون']
    },
    ar: {
      upright: 'عالم الأحلام والحدس العميق. تأنَّ حتى تنقشع الضبابية وتتضح الرؤية.',
      reversed: 'انقشاع الأوهام، زوال الحيرة وظهور الحقائق المخفية بوضوح.',
      keywords: ['الحدس', 'الغموض', 'الأحلام', 'الوضوح']
    },
    en: {
      upright: 'Deep intuition, dreams, and navigating through uncertainty with inner trust.',
      reversed: 'Clarity returning, releasing fear, and uncovering hidden truths.',
      keywords: ['Intuition', 'Dreams', 'Subconscious', 'Clarity']
    }
  },
  'major-19': {
    ku: {
      upright: 'درەوشانەوە، خۆشی، سەرکەوتنی گەورە و وزەی گەرم و ڕووناکی لە ژیانتدا.',
      reversed: 'سەرکەوتنێک کە کەمێک دواکەوتووە؛ گەشبینی خۆت بپارێزە.',
      keywords: ['خۆشی', 'سەرکەوتن', 'ڕووناکی', 'وزە']
    },
    ar: {
      upright: 'إشراق، سعادة غامرة، نجاح واضح وطاقة إيجابية تضيء طريقك.',
      reversed: 'تأخر بسيط في الفرح أو النجاح، لكن النور قادم لا محالة.',
      keywords: ['السعادة', 'النجاح', 'الإشراق', 'الحيوية']
    },
    en: {
      upright: 'Joy, radiance, success, vitality, and warm positivity illuminating your life.',
      reversed: 'Temporary cloudiness, yet underlying optimism and success remain.',
      keywords: ['Joy', 'Success', 'Vitality', 'Positivity']
    }
  },
  'major-20': {
    ku: {
      upright: 'بەئاگاهاتنەوەی ڕۆحی، بڕیاری چارەنووسساز و لەدایکبوونەوەیەکی نوێ.',
      reversed: 'سەرزەنشتکردنی خۆت یان دواخستنی بڕیارێکی گرنگ. لە خۆت خۆشبە و بڕۆ پێش.',
      keywords: ['بەئاگاهاتنەوە', 'نوێبوونەوە', 'بانگەواز', 'ڕزگاری']
    },
    ar: {
      upright: 'يقظة روحية، تقييم صادق للذات واستجابة لنداء التغيير نحو الأفضل.',
      reversed: 'تردد أو لوم للذات. سامح الماضي واتخذ خطوتك الحاسمة.',
      keywords: ['اليقظة', 'التجدد', 'القرار', 'الارتقاء']
    },
    en: {
      upright: 'Awakening, inner calling, absolution, and stepping into a higher phase.',
      reversed: 'Self-doubt or hesitating to answer your calling. Forgive and move forward.',
      keywords: ['Awakening', 'Rebirth', 'Inner Calling', 'Absolution']
    }
  },
  'major-21': {
    ku: {
      upright: 'تەواوبوونی سەرکەوتووانەی قۆناغێک، گەیشتن بە ئامانج و هاوسەنگی گەردوونی.',
      reversed: 'نزیكبوونەوە لە کۆتایی کارێک کە هێشتا هەنگاوێکی بچووکی ماوە.',
      keywords: ['تەواوبوون', 'سەرکەوتن', 'گەشت', 'کەماڵ']
    },
    ar: {
      upright: 'اكتمال ناجح، تحقيق الأهداف الكبرى والانسجام التام مع الكون.',
      reversed: 'اقتراب من خط النهاية مع حاجة لإتمام بعض التفاصيل الأخيرة.',
      keywords: ['الكمال', 'الإنجاز', 'النجاح', 'الانسجام']
    },
    en: {
      upright: 'Fulfillment, completion, accomplishment, and cosmic wholeness.',
      reversed: 'Seeking closure or finishing the final steps of a major cycle.',
      keywords: ['Completion', 'Fulfillment', 'Wholeness', 'Success']
    }
  }
};

/**
 * تولید تفسیر چندزبانه برای کارت‌های کبیر و صغیر
 */
export function getLocalizedCardMeaning(
  card: any,
  isReversed: boolean,
  lang?: string
): string {
  if (!card) return '';
  const currentLang = resolveTarotLang(lang);

  if (currentLang === 'fa') {
    const nestedMeaning = isReversed ? card.reversed?.meaning : card.upright?.meaning;
    return (
      (isReversed
        ? (card.reversedMeaning || card.meaningReversed)
        : (card.uprightMeaning || card.meaningUpright)) ||
      nestedMeaning ||
      card.description ||
      ''
    );
  }

  const rawCardId = String(card.id || '').toLowerCase();
  const majorIndex = rawCardId.match(/^major-(\d+)(?:-|$)/)?.[1];
  const cardId = majorIndex === undefined ? rawCardId : `major-${Number(majorIndex)}`;
  if (MAJOR_MEANINGS[cardId] && MAJOR_MEANINGS[cardId][currentLang]) {
    return isReversed
      ? MAJOR_MEANINGS[cardId][currentLang].reversed
      : MAJOR_MEANINGS[cardId][currentLang].upright;
  }

  const cardName = getLocalizedCardName(card, currentLang);

  if (currentLang === 'ku') {
    return isReversed
      ? `کارتی «${cardName}» لە دۆخی پێچەوانەدا ئاماژەیە بۆ پێویستی بە پێداچوونەوە، ئارامگرتن و ڕزگاربوون لە بەربەستە دەروونییەکان لەم قۆناغەدا. بە هۆشیارییەوە مامەڵە بکە.`
      : `کارتی «${cardName}» لە دۆخی ڕاستدا پەیامی وزەی ئەرێنی، گەشەکردن و کرانەوەی دەرگای نوێ لەسەر ڕێگاکەت دەگەیەنێت. متمانەت بە هەنگاوەکانت هەبێت.`;
  }

  if (currentLang === 'ar') {
    return isReversed
      ? `بطاقة «${cardName}» في الوضع المعكوس تدعوك إلى التروي، مراجعة الذات وتجاوز العقبات الداخلية بحكمة وصبر في هذه المرحلة.`
      : `بطاقة «${cardName}» في الوضع المعتدل تحمل طاقة إيجابية، فرصاً للنمو وتطوراً مثمراً في مسارك الحالي. ثق بقدراتك.`;
  }

  const enNative = isReversed
    ? (card.reversedMeaningEn || card.meaningReversedEn || card.reversed?.meaningEn)
    : (card.uprightMeaningEn || card.meaningUprightEn || card.upright?.meaningEn);
  if (enNative) return enNative;

  return isReversed
    ? `${cardName} (Reversed) invites inner reflection, releasing blockages, and regaining balance before moving forward.`
    : `${cardName} (Upright) brings empowering energy, clarity, and aligned opportunities to guide your current path.`;
}

/**
 * ترجمه عنوان و تفسیر جایگاه کارت در چیدمان
 */
export function localizePositionMeaning(
  rawFaPositionText: string,
  card: any,
  isReversed: boolean,
  idx: number,
  lang?: string
): string {
  const currentLang = resolveTarotLang(lang);
  if (currentLang === 'fa') return rawFaPositionText;

  const cardName = getLocalizedCardName(card, currentLang);
  const baseMeaning = getLocalizedCardMeaning(card, isReversed, currentLang);
  const posNum = idx + 1;

  if (currentLang === 'ku') {
    return `لە پێگەی ژمارە ${posNum}، دەرکەوتنی کارتی «${cardName}» (${isReversed ? 'پێچەوانە' : 'ڕاست'}): ${baseMeaning}`;
  }
  if (currentLang === 'ar') {
    return `في الموقع رقم ${posNum}، ظهور بطاقة «${cardName}» (${isReversed ? 'معكوسة' : 'معتدلة'}): ${baseMeaning}`;
  }
  return `In Position #${posNum}, ${cardName} (${isReversed ? 'Reversed' : 'Upright'}): ${baseMeaning}`;
}

/**
 * ترجمه کلمات کلیدی کارت
 */
export function getLocalizedKeywords(card: any, lang?: string, isReversed = false): string[] {
  if (!card) return [];
  const currentLang = resolveTarotLang(lang);
  const nestedKeywords = isReversed ? card.reversed?.keywords : card.upright?.keywords;
  if (currentLang === 'fa') return nestedKeywords || card.keywords || card.keywordsFa || [];

  const rawCardId = String(card.id || '').toLowerCase();
  const majorIndex = rawCardId.match(/^major-(\d+)(?:-|$)/)?.[1];
  const cardId = majorIndex === undefined ? rawCardId : `major-${Number(majorIndex)}`;
  if (MAJOR_MEANINGS[cardId] && MAJOR_MEANINGS[cardId][currentLang]?.keywords) {
    return MAJOR_MEANINGS[cardId][currentLang].keywords;
  }

  if (currentLang === 'ku') return ['وزەی گەردوونی', 'ڕێنمایی', 'گۆڕانکاری'];
  if (currentLang === 'ar') return ['طاقة كونية', 'إرشاد', 'تحول'];
  return card.keywordsEn || ['Cosmic Energy', 'Guidance', 'Transformation'];
}