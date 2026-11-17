import type { ZodiacSign, PlanetName, ZodiacSignName, Element } from './types';
import type { AppLanguage } from '../../i18n/useLanguageStore';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'aries', nameFa: 'حمل', index: 1, startDegree: 0, element: 'fire', modality: 'cardinal', ruler: 'mars' },
  { name: 'taurus', nameFa: 'ثور', index: 2, startDegree: 30, element: 'earth', modality: 'fixed', ruler: 'venus' },
  { name: 'gemini', nameFa: 'جوزا', index: 3, startDegree: 60, element: 'air', modality: 'mutable', ruler: 'mercury' },
  { name: 'cancer', nameFa: 'سرطان', index: 4, startDegree: 90, element: 'water', modality: 'cardinal', ruler: 'moon' },
  { name: 'leo', nameFa: 'اسد', index: 5, startDegree: 120, element: 'fire', modality: 'fixed', ruler: 'sun' },
  { name: 'virgo', nameFa: 'سنبله', index: 6, startDegree: 150, element: 'earth', modality: 'mutable', ruler: 'mercury' },
  { name: 'libra', nameFa: 'میزان', index: 7, startDegree: 180, element: 'air', modality: 'cardinal', ruler: 'venus' },
  { name: 'scorpio', nameFa: 'عقرب', index: 8, startDegree: 210, element: 'water', modality: 'fixed', ruler: 'pluto' },
  { name: 'sagittarius', nameFa: 'قوس', index: 9, startDegree: 240, element: 'fire', modality: 'mutable', ruler: 'jupiter' },
  { name: 'capricorn', nameFa: 'جدی', index: 10, startDegree: 270, element: 'earth', modality: 'cardinal', ruler: 'saturn' },
  { name: 'aquarius', nameFa: 'دلو', index: 11, startDegree: 300, element: 'air', modality: 'fixed', ruler: 'uranus' },
  { name: 'pisces', nameFa: 'حوت', index: 12, startDegree: 330, element: 'water', modality: 'mutable', ruler: 'jupiter' }
];

export const PLANET_NAMES: Record<PlanetName, Record<AppLanguage, string>> = {
  sun: { fa: 'خورشید', en: 'Sun', ar: 'الشمس', ckb: 'خۆر' },
  moon: { fa: 'ماه', en: 'Moon', ar: 'القمر', ckb: 'مانگ' },
  mercury: { fa: 'عطارد', en: 'Mercury', ar: 'عطارد', ckb: 'عەتارد' },
  venus: { fa: 'زهره', en: 'Venus', ar: 'الزهرة', ckb: 'زوهرە' },
  mars: { fa: 'مریخ', en: 'Mars', ar: 'المريخ', ckb: 'مەریخ' },
  jupiter: { fa: 'مشتری', en: 'Jupiter', ar: 'المشتري', ckb: 'موشتەری' },
  saturn: { fa: 'زحل', en: 'Saturn', ar: 'زحل', ckb: 'زووحەل' },
  uranus: { fa: 'اورانوس', en: 'Uranus', ar: 'أورانوس', ckb: 'ئورانوس' },
  neptune: { fa: 'نپتون', en: 'Neptune', ar: 'نبتون', ckb: 'نێپتون' },
  pluto: { fa: 'پلوتو', en: 'Pluto', ar: 'بلوتو', ckb: 'پلوتۆ' }
};

export function getSign(longitude: number): ZodiacSign {
  const normalized = ((longitude % 360) + 360) % 360;
  const index = Math.floor(normalized / 30);
  return ZODIAC_SIGNS[index];
}

export function getSignDegree(longitude: number): number {
  const normalized = ((longitude % 360) + 360) % 360;
  return normalized % 30;
}

// ============================================
// اطلاعات کامل برج‌ها برای صفحه زودیاک
// ============================================
export interface ZodiacDetail {
  name: ZodiacSignName;
  nameFa: string;
  nameEn: string;
  shamsiMonth: string;
  dateRange: Record<AppLanguage, string>;
  element: Element;
  elementFa: string;
  modality: 'cardinal' | 'fixed' | 'mutable';
  modalityFa: string;
  rulingPlanet: string;
  rulingPlanetFa: string;
  symbol: string;
  traits: Record<AppLanguage, string[]>;
  strengths: Record<AppLanguage, string[]>;
  weaknesses: Record<AppLanguage, string[]>;
  description: Record<AppLanguage, string>;
  luckyColor: Record<AppLanguage, string>;
  luckyNumber: string;
}

export const ZODIAC_DETAILS: Record<ZodiacSignName, ZodiacDetail> = {
  aries: {
    name: 'aries', nameFa: 'حمل', nameEn: 'Aries', shamsiMonth: 'فروردین',
    dateRange: { fa: '۲۱ مارس – ۱۹ آوریل', en: 'Mar 21 – Apr 19', ar: '٢١ مارس – ١٩ أبريل', ckb: '٢١ ئازار – ١٩ نیسان' },
    element: 'fire', elementFa: 'آتش', modality: 'cardinal', modalityFa: 'کاردینال (آغازگر)', rulingPlanet: 'mars', rulingPlanetFa: 'مریخ', symbol: '♈',
    traits: {
      fa: ['شجاع', 'پیشرو', 'پرانرژی', 'مستقل'],
      en: ['Brave', 'Pioneering', 'Energetic', 'Independent'],
      ar: ['شجاع', 'رائد', 'نشيط', 'مستقل'],
      ckb: ['ئازا', 'پێشەنگ', 'بەوزە', 'سەربەخۆ']
    },
    strengths: {
      fa: ['رهبری', 'اعتماد به نفس', 'شور و اشتیاق'],
      en: ['Leadership', 'Confidence', 'Passion'],
      ar: ['القيادة', 'الثقة بالنفس', 'الشغف'],
      ckb: ['سەرکردایەتی', 'متمانە بەخۆبوون', 'گەرمی']
    },
    weaknesses: {
      fa: ['عجول', 'بی‌حوصله', 'گاهی پرخاشگر'],
      en: ['Hasty', 'Impatient', 'Sometimes aggressive'],
      ar: ['متهور', 'نفاد صبر', 'عدواني أحياناً'],
      ckb: ['پەلە', 'بێ ئارام', 'ھەندێک جار تووندڕەو']
    },
    description: {
      fa: 'حمل نماد آغاز و انرژی است. افراد این برج با شور و شوق زندگی می‌کنند و از چالش لذت می‌برند. آن‌ها پیشگام و مستقل هستند.',
      en: 'Aries symbolizes beginning and energy. People of this sign live with passion and enjoy challenges. They are pioneers and independent.',
      ar: 'الحمل يرمز إلى البداية والطاقة. يعيش أصحاب هذا البرج بشغف ويستمتعون بالتحديات. هم رواد ومستقلون.',
      ckb: 'بەرزەبورجی بەرخان نیشانەی دەستپێک و وزەیە. خەڵکی ئەم بەرزەبورجە بە گەرمی دەژین و چێژ لە تەحەددیەکان دەبینن. ئەوان پێشەنگ و سەربەخۆن.'
    },
    luckyColor: { fa: 'قرمز', en: 'Red', ar: 'أحمر', ckb: 'سور' }, luckyNumber: '۹'
  },
  taurus: {
    name: 'taurus', nameFa: 'ثور', nameEn: 'Taurus', shamsiMonth: 'اردیبهشت',
    dateRange: { fa: '۲۰ آوریل – ۲۰ می', en: 'Apr 20 – May 20', ar: '٢٠ أبريل – ٢٠ مايو', ckb: '٢٠ نیسان – ٢٠ ئایار' },
    element: 'earth', elementFa: 'خاک', modality: 'fixed', modalityFa: 'ثابت', rulingPlanet: 'venus', rulingPlanetFa: 'زهره', symbol: '♉',
    traits: {
      fa: ['پایدار', 'حسی', 'اهل لذت', 'قابل اعتماد'],
      en: ['Stable', 'Sensory', 'Pleasure-seeking', 'Reliable'],
      ar: ['مستقر', 'حسي', 'محب للمتعة', 'موثوق'],
      ckb: ['جێگیر', 'ھەستیار', 'خۆشەویستی خۆشی', 'متمانەپێکراو']
    },
    strengths: {
      fa: ['صبر', 'وفاداری', 'استقامت'],
      en: ['Patience', 'Loyalty', 'Endurance'],
      ar: ['الصبر', 'الوفاء', 'المثابرة'],
      ckb: ['ئارام', 'دڵسۆزی', 'خۆڕاگری']
    },
    weaknesses: {
      fa: ['لجباز', 'مالک‌گرا', 'گاهی تنبل'],
      en: ['Stubborn', 'Possessive', 'Sometimes lazy'],
      ar: ['عنيد', 'متملك', 'كسول أحياناً'],
      ckb: ['کەللەڕەق', 'خاوەندارێتی', 'ھەندێک جار تەمبەڵ']
    },
    description: {
      fa: 'ثور نماد ثبات و زیبایی است. افراد این برج به امنیت و لذت‌های حسی اهمیت می‌دهند و با صبر به اهداف خود می‌رسند.',
      en: 'Taurus symbolizes stability and beauty. People of this sign value security and sensory pleasures and reach their goals with patience.',
      ar: 'الثور يرمز إلى الاستقرار والجمال. يهتم أصحاب هذا البرج بالأمان والملذات الحسية ويحققون أهدافهم بالصبر.',
      ckb: 'بەرزەبورجی تور نیشانەی جێگیری و جوانییە. خەڵکی ئەم بەرزەبورجە گرنگی بە ئاسایش و خۆشییە ھەستیارەکان دەدەن و بە ئارامی دەگەنە ئامانجەکانیان.'
    },
    luckyColor: { fa: 'سبز', en: 'Green', ar: 'أخضر', ckb: 'سەوز' }, luckyNumber: '۶'
  },
  gemini: {
    name: 'gemini', nameFa: 'جوزا', nameEn: 'Gemini', shamsiMonth: 'خرداد',
    dateRange: { fa: '۲۱ می – ۲۰ ژوئن', en: 'May 21 – Jun 20', ar: '٢١ مايو – ٢٠ يونيو', ckb: '٢١ ئایار – ٢٠ حوزەیران' },
    element: 'air', elementFa: 'هوا', modality: 'mutable', modalityFa: 'تغییرپذیر', rulingPlanet: 'mercury', rulingPlanetFa: 'عطارد', symbol: '♊',
    traits: {
      fa: ['کنجکاو', 'ارتباطی', 'سازگار', 'باهوش'],
      en: ['Curious', 'Communicative', 'Adaptable', 'Intelligent'],
      ar: ['فضولي', 'تواصلي', 'متكيف', 'ذكي'],
      ckb: ['بەپەرۆش', 'پەیوەندیکەر', 'خۆگونجێن', 'زیرەک']
    },
    strengths: {
      fa: ['ذکاوت', 'انطباق‌پذیری', 'مهارت ارتباطی'],
      en: ['Intelligence', 'Adaptability', 'Communication skills'],
      ar: ['الذكاء', 'القدرة على التكيف', 'مهارات التواصل'],
      ckb: ['زیرەکی', 'خۆگونجاندن', 'توانای پەیوەندی']
    },
    weaknesses: {
      fa: ['پراکنده', 'دو‌رو', 'بی‌قرار'],
      en: ['Scattered', 'Two-faced', 'Restless'],
      ar: ['مشتت', 'ذو وجهين', 'قلق'],
      ckb: ['پەرشوبڵاو', 'دووڕوو', 'بێ ئارام']
    },
    description: {
      fa: 'جوزا نماد کنجکاوی و ارتباط است. افراد این برج عاشق یادگیری و گفتگو هستند و ذهنی چابک دارند.',
      en: 'Gemini symbolizes curiosity and communication. People of this sign love learning and conversation and have agile minds.',
      ar: 'الجوزاء يرمز إلى الفضول والتواصل. يحب أصحاب هذا البرج التعلم والمحادثة ولديهم عقول رشيقة.',
      ckb: 'بەرزەبورجی دووانە نیشانەی بەپەرۆشی و پەیوەندییە. خەڵکی ئەم بەرزەبورجە حەزیان لە فێربوون و گفتوگۆیە و مێشکی چالاکیان ھەیە.'
    },
    luckyColor: { fa: 'زرد', en: 'Yellow', ar: 'أصفر', ckb: 'زەرد' }, luckyNumber: '۵'
  },
  cancer: {
    name: 'cancer', nameFa: 'سرطان', nameEn: 'Cancer', shamsiMonth: 'تیر',
    dateRange: { fa: '۲۱ ژوئن – ۲۲ جولای', en: 'Jun 21 – Jul 22', ar: '٢١ يونيو – ٢٢ يوليو', ckb: '٢١ حوزەیران – ٢٢ تەمموز' },
    element: 'water', elementFa: 'آب', modality: 'cardinal', modalityFa: 'کاردینال (آغازگر)', rulingPlanet: 'moon', rulingPlanetFa: 'ماه', symbol: '♋',
    traits: {
      fa: ['مهربان', 'حساس', 'خانواده‌دوست', 'شهودی'],
      en: ['Kind', 'Sensitive', 'Family-oriented', 'Intuitive'],
      ar: ['طيب', 'حساس', 'محب للعائلة', 'حدسي'],
      ckb: ['بەزەیی', 'ھەستیار', 'خێزانپەروەر', 'ھەستیار']
    },
    strengths: {
      fa: ['همدلی', 'وفاداری', 'مراقبت'],
      en: ['Empathy', 'Loyalty', 'Caring'],
      ar: ['التعاطف', 'الوفاء', 'الرعاية'],
      ckb: ['ھاوسۆزی', 'دڵسۆزی', 'چاودێری']
    },
    weaknesses: {
      fa: ['حساسیت زیاد', 'وابستگی', 'بدگمانی'],
      en: ['Over-sensitive', 'Clingy', 'Suspicious'],
      ar: ['حساسية مفرطة', 'تعلق', 'سوء الظن'],
      ckb: ['ھەستیاری زۆر', 'پەیوەستبوون', 'گومان']
    },
    description: {
      fa: 'سرطان نماد خانه و خانواده است. افراد این برج به عزیزانشان اهمیت می‌دهند و شهودی قوی دارند.',
      en: 'Cancer symbolizes home and family. People of this sign care deeply for their loved ones and have strong intuition.',
      ar: 'السرطان يرمز إلى المنزل والعائلة. يهتم أصحاب هذا البرج بأحبائهم ولديهم حدس قوي.',
      ckb: 'بەرزەبورجی کەوچک نیشانەی ماڵ و خێزانە. خەڵکی ئەم بەرزەبورجە گرنگی بە نزیکەکانیان دەدەن و ھەستیارییەکی بەھێزیان ھەیە.'
    },
    luckyColor: { fa: 'نقره‌ای', en: 'Silver', ar: 'فضي', ckb: 'زیو' }, luckyNumber: '۲'
  },
  leo: {
    name: 'leo', nameFa: 'اسد', nameEn: 'Leo', shamsiMonth: 'مرداد',
    dateRange: { fa: '۲۳ جولای – ۲۲ آگوست', en: 'Jul 23 – Aug 22', ar: '٢٣ يوليو – ٢٢ أغسطس', ckb: '٢٣ تەمموز – ٢٢ ئاب' },
    element: 'fire', elementFa: 'آتش', modality: 'fixed', modalityFa: 'ثابت', rulingPlanet: 'sun', rulingPlanetFa: 'خورشید', symbol: '♌',
    traits: {
      fa: ['خلاق', 'رهبر', 'درخشان', 'سخاوتمند'],
      en: ['Creative', 'Leader', 'Radiant', 'Generous'],
      ar: ['مبدع', 'قائد', 'مشرق', 'كريم'],
      ckb: ['داهێنەر', 'سەرکردە', 'درەوشاوە', 'دەستبەردار']
    },
    strengths: {
      fa: ['اعتماد به نفس', 'جذابیت', 'سخاوت'],
      en: ['Confidence', 'Charisma', 'Generosity'],
      ar: ['الثقة بالنفس', 'الجاذبية', 'الكرم'],
      ckb: ['متمانە بەخۆبوون', 'سەرنجڕاکێشی', 'دەستبەرداری']
    },
    weaknesses: {
      fa: ['غرور', 'خودمحور', 'حساس به انتقاد'],
      en: ['Pride', 'Self-centered', 'Sensitive to criticism'],
      ar: ['الكبرياء', 'التمركز حول الذات', 'حساس للنقد'],
      ckb: ['لوتبەرزی', 'خۆپەرست', 'ھەستیار بە ڕەخنە']
    },
    description: {
      fa: 'اسد نماد قدرت و خلاقیت است. افراد این برج به دنبال شناخت و ابراز وجود هستند و قلبی سخاوتمند دارند.',
      en: 'Leo symbolizes power and creativity. People of this sign seek recognition and self-expression and have generous hearts.',
      ar: 'الأسد يرمز إلى القوة والإبداع. يسعى أصحاب هذا البرج إلى التقدير والتعبير عن الذات ولديهم قلوب كريمة.',
      ckb: 'بەرزەبورجی شێر نیشانەی ھێز و داهێنانە. خەڵکی ئەم بەرزەبورجە بەدوای ناسین و دەربڕینی خۆدا دەگەڕێن و دڵێکی دەستبەرداریان ھەیە.'
    },
    luckyColor: { fa: 'طلایی', en: 'Golden', ar: 'ذهبي', ckb: 'زێڕین' }, luckyNumber: '۱'
  },
  virgo: {
    name: 'virgo', nameFa: 'سنبله', nameEn: 'Virgo', shamsiMonth: 'شهریور',
    dateRange: { fa: '۲۳ آگوست – ۲۲ سپتامبر', en: 'Aug 23 – Sep 22', ar: '٢٣ أغسطس – ٢٢ سبتمبر', ckb: '٢٣ ئاب – ٢٢ ئەیلوول' },
    element: 'earth', elementFa: 'خاک', modality: 'mutable', modalityFa: 'تغییرپذیر', rulingPlanet: 'mercury', rulingPlanetFa: 'عطارد', symbol: '♍',
    traits: {
      fa: ['دقیق', 'تحلیلی', 'خدمتگزار', 'منظم'],
      en: ['Precise', 'Analytical', 'Service-oriented', 'Organized'],
      ar: ['دقيق', 'تحليلي', 'خدوم', 'منظم'],
      ckb: ['ورد', 'شیکەر', 'خزمەتگوزار', 'ڕێکخراو']
    },
    strengths: {
      fa: ['دقت', 'سازماندهی', 'مسئولیت‌پذیری'],
      en: ['Precision', 'Organization', 'Responsibility'],
      ar: ['الدقة', 'التنظيم', 'المسؤولية'],
      ckb: ['وردی', 'ڕێکخستن', 'بەرپرسیارێتی']
    },
    weaknesses: {
      fa: ['کمال‌گرا', 'انتقادگر', 'مضطرب'],
      en: ['Perfectionist', 'Critical', 'Anxious'],
      ar: ['مثالي', 'ناقد', 'قلق'],
      ckb: ['تەواوخواز', 'ڕەخنەگر', 'نیگەران']
    },
    description: {
      fa: 'سنبله نماد دقت و خدمت است. افراد این برج به جزئیات توجه دارند و به دنبال کمال و بهبود هستند.',
      en: 'Virgo symbolizes precision and service. People of this sign pay attention to details and seek perfection and improvement.',
      ar: 'العذراء يرمز إلى الدقة والخدمة. يهتم أصحاب هذا البرج بالتفاصيل ويسعون إلى الكمال والتحسين.',
      ckb: 'بەرزەبورجی کچ نیشانەی وردی و خزمەتە. خەڵکی ئەم بەرزەبورجە سەرنج بە وردەکارییەکان دەدەن و بەدوای تەواوی و باشتربووندا دەگەڕێن.'
    },
    luckyColor: { fa: 'سبز زیتونی', en: 'Olive Green', ar: 'أخضر زيتوني', ckb: 'سەوزی زەیتوون' }, luckyNumber: '۵'
  },
  libra: {
    name: 'libra', nameFa: 'میزان', nameEn: 'Libra', shamsiMonth: 'مهر',
    dateRange: { fa: '۲۳ سپتامبر – ۲۲ اکتبر', en: 'Sep 23 – Oct 22', ar: '٢٣ سبتمبر – ٢٢ أكتوبر', ckb: '٢٣ ئەیلوول – ٢٢ تشرینی یەکەم' },
    element: 'air', elementFa: 'هوا', modality: 'cardinal', modalityFa: 'کاردینال (آغازگر)', rulingPlanet: 'venus', rulingPlanetFa: 'زهره', symbol: '♎',
    traits: {
      fa: ['دیپلمات', 'اجتماعی', 'عاشق زیبایی', 'متعادل'],
      en: ['Diplomatic', 'Social', 'Beauty-loving', 'Balanced'],
      ar: ['دبلوماسي', 'اجتماعي', 'محب للجمال', 'متوازن'],
      ckb: ['دیپلۆمات', 'کۆمەڵایەتی', 'خۆشەویستی جوانی', 'ھاوسەنگ']
    },
    strengths: {
      fa: ['انصاف', 'جذابیت', 'مهارت دیپلماسی'],
      en: ['Fairness', 'Charisma', 'Diplomacy skills'],
      ar: ['الإنصاف', 'الجاذبية', 'مهارات الدبلوماسية'],
      ckb: ['دادپەروەری', 'سەرنجڕاکێشی', 'توانای دیپلۆماسی']
    },
    weaknesses: {
      fa: ['بی‌تصمیم', 'وابسته به تایید', 'سطحی'],
      en: ['Indecisive', 'Dependent on approval', 'Shallow'],
      ar: ['متردد', 'يعتمد على الموافقة', 'سطحي'],
      ckb: ['بێ بڕیار', 'پەیوەست بە پەسەندکردن', 'ڕووپۆش']
    },
    description: {
      fa: 'میزان نماد تعادل و زیبایی است. افراد این برج به روابط هماهنگ و زیبایی اهمیت می‌دهند.',
      en: 'Libra symbolizes balance and beauty. People of this sign value harmonious relationships and beauty.',
      ar: 'الميزان يرمز إلى التوازن والجمال. يهتم أصحاب هذا البرج بالعلاقات المتناغمة والجمال.',
      ckb: 'بەرزەبورجی تەرازوو نیشانەی ھاوسەنگی و جوانییە. خەڵکی ئەم بەرزەبورجە گرنگی بە پەیوەندییە ھاوتەریبەکان و جوانی دەدەن.'
    },
    luckyColor: { fa: 'صورتی', en: 'Pink', ar: 'وردي', ckb: 'پەمەیی' }, luckyNumber: '۶'
  },
  scorpio: {
    name: 'scorpio', nameFa: 'عقرب', nameEn: 'Scorpio', shamsiMonth: 'آبان',
    dateRange: { fa: '۲۳ اکتبر – ۲۱ نوامبر', en: 'Oct 23 – Nov 21', ar: '٢٣ أكتوبر – ٢١ نوفمبر', ckb: '٢٣ تشرینی یەکەم – ٢١ تشرینی دووەم' },
    element: 'water', elementFa: 'آب', modality: 'fixed', modalityFa: 'ثابت', rulingPlanet: 'pluto', rulingPlanetFa: 'پلوتو', symbol: '♏',
    traits: {
      fa: ['عمیق', 'قدرتمند', 'رازآلود', 'پرشور'],
      en: ['Deep', 'Powerful', 'Mysterious', 'Passionate'],
      ar: ['عميق', 'قوي', 'غامض', 'شغوف'],
      ckb: ['قووڵ', 'بەھێز', 'نهێنی', 'گەرم']
    },
    strengths: {
      fa: ['اراده', 'وفاداری', 'شهود نافذ'],
      en: ['Willpower', 'Loyalty', 'Penetrating intuition'],
      ar: ['الإرادة', 'الوفاء', 'الحدس النافذ'],
      ckb: ['ئیرادە', 'دڵسۆزی', 'ھەستیاری تیژ']
    },
    weaknesses: {
      fa: ['حسادت', 'کینه‌توزی', 'کنترل‌گر'],
      en: ['Jealousy', 'Vindictiveness', 'Controlling'],
      ar: ['الغيرة', 'الحقد', 'التحكم'],
      ckb: ['ئیرەیی', 'کینە', 'کۆنترۆڵکەر']
    },
    description: {
      fa: 'عقرب نماد عمق و قدرت است. افراد این برج با شدت و تعهد زندگی می‌کنند و شهودی نافذ دارند.',
      en: 'Scorpio symbolizes depth and power. People of this sign live with intensity and commitment and have penetrating intuition.',
      ar: 'العقرب يرمز إلى العمق والقوة. يعيش أصحاب هذا البرج بشدة والتزام ولديهم حدس نافذ.',
      ckb: 'بەرزەبورجی دووپشک نیشانەی قووڵی و ھێزە. خەڵکی ئەم بەرزەبورجە بە توندی و پابەندبوون دەژین و ھەستیارییەکی تیژیان ھەیە.'
    },
    luckyColor: { fa: 'قرمز تیره', en: 'Dark Red', ar: 'أحمر داكن', ckb: 'سوری تاریک' }, luckyNumber: '۸'
  },
  sagittarius: {
    name: 'sagittarius', nameFa: 'قوس', nameEn: 'Sagittarius', shamsiMonth: 'آذر',
    dateRange: { fa: '۲۲ نوامبر – ۲۱ دسامبر', en: 'Nov 22 – Dec 21', ar: '٢٢ نوفمبر – ٢١ ديسمبر', ckb: '٢٢ تشرینی دووەم – ٢١ کانوونی یەکەم' },
    element: 'fire', elementFa: 'آتش', modality: 'mutable', modalityFa: 'تغییرپذیر', rulingPlanet: 'jupiter', rulingPlanetFa: 'مشتری', symbol: '♐',
    traits: {
      fa: ['ماجراجو', 'خوش‌بین', 'فلسفی', 'آزاد'],
      en: ['Adventurous', 'Optimistic', 'Philosophical', 'Free'],
      ar: ['مغامر', 'متفائل', 'فلسفي', 'حر'],
      ckb: ['سەرکێش', 'گەشبین', 'فەلسەفی', 'ئازاد']
    },
    strengths: {
      fa: ['خوش‌بینی', 'صداقت', 'عشق به سفر'],
      en: ['Optimism', 'Honesty', 'Love for travel'],
      ar: ['التفاؤل', 'الصدق', 'حب السفر'],
      ckb: ['گەشبینی', 'ڕاستگۆیی', 'خۆشەویستی سەفەر']
    },
    weaknesses: {
      fa: ['بی‌تعهد', 'بی‌ملاحظه', 'زیاده‌رو'],
      en: ['Non-committal', 'Tactless', 'Extravagant'],
      ar: ['غير ملتزم', 'غير لبق', 'مفرط'],
      ckb: ['بێ پابەند', 'بێ وریا', 'زیادەڕەو']
    },
    description: {
      fa: 'قوس نماد ماجراجویی و فلسفه است. افراد این برج به دنبال معنا و آزادی هستند و عاشق سفر و کشف.',
      en: 'Sagittarius symbolizes adventure and philosophy. People of this sign seek meaning and freedom and love travel and discovery.',
      ar: 'القوس يرمز إلى المغامرة والفلسفة. يسعى أصحاب هذا البرج إلى المعنى والحرية ويحبون السفر والاكتشاف.',
      ckb: 'بەرزەبورجی کەوان نیشانەی سەرکێشی و فەلسەفەیە. خەڵکی ئەم بەرزەبورجە بەدوای مانا و ئازادیدا دەگەڕێن و حەزیان لە سەفەر و دۆزینەوەیە.'
    },
    luckyColor: { fa: 'بنفش', en: 'Purple', ar: 'بنفسجي', ckb: 'مۆر' }, luckyNumber: '۳'
  },
  capricorn: {
    name: 'capricorn', nameFa: 'جدی', nameEn: 'Capricorn', shamsiMonth: 'دی',
    dateRange: { fa: '۲۲ دسامبر – ۱۹ ژانویه', en: 'Dec 22 – Jan 19', ar: '٢٢ ديسمبر – ١٩ يناير', ckb: '٢٢ کانوونی یەکەم – ١٩ کانوونی دووەم' },
    element: 'earth', elementFa: 'خاک', modality: 'cardinal', modalityFa: 'کاردینال (آغازگر)', rulingPlanet: 'saturn', rulingPlanetFa: 'زحل', symbol: '♑',
    traits: {
      fa: ['جاه‌طلب', 'مسئولیت‌پذیر', 'منظم', 'پایدار'],
      en: ['Ambitious', 'Responsible', 'Organized', 'Stable'],
      ar: ['طموح', 'مسؤول', 'منظم', 'مستقر'],
      ckb: ['ئامانجخواز', 'بەرپرسیار', 'ڕێکخراو', 'جێگیر']
    },
    strengths: {
      fa: ['پشتکار', 'انضباط', 'مدیریت'],
      en: ['Perseverance', 'Discipline', 'Management'],
      ar: ['المثابرة', 'الانضباط', 'الإدارة'],
      ckb: ['بەردەوامی', 'ڕێکخستن', 'بەڕێوەبردن']
    },
    weaknesses: {
      fa: ['سردی', 'بدبینی', 'کمال‌گرا'],
      en: ['Coldness', 'Pessimism', 'Perfectionist'],
      ar: ['البرود', 'التشاؤم', 'مثالي'],
      ckb: ['ساردی', 'بێ ئومێدی', 'تەواوخواز']
    },
    description: {
      fa: 'جدی نماد نظم و جاه‌طلبی است. افراد این برج برای اهداف بلندمدت تلاش می‌کنند و پایدار هستند.',
      en: 'Capricorn symbolizes order and ambition. People of this sign strive for long-term goals and are stable.',
      ar: 'الجدي يرمز إلى النظام والطموح. يسعى أصحاب هذا البرج لتحقيق أهداف طويلة الأمد وهم مستقرون.',
      ckb: 'بەرزەبورجی بزن نیشانەی ڕێکخستن و ئامانجخوازییە. خەڵکی ئەم بەرزەبورجە بۆ ئامانجە درێژخایەنەکان کۆشش دەکەن و جێگیرن.'
    },
    luckyColor: { fa: 'قهوه‌ای', en: 'Brown', ar: 'بني', ckb: 'قاوەیی' }, luckyNumber: '۴'
  },
  aquarius: {
    name: 'aquarius', nameFa: 'دلو', nameEn: 'Aquarius', shamsiMonth: 'بهمن',
    dateRange: { fa: '۲۰ ژانویه – ۱۸ فوریه', en: 'Jan 20 – Feb 18', ar: '٢٠ يناير – ١٨ فبراير', ckb: '٢٠ کانوونی دووەم – ١٨ شوبات' },
    element: 'air', elementFa: 'هوا', modality: 'fixed', modalityFa: 'ثابت', rulingPlanet: 'uranus', rulingPlanetFa: 'اورانوس', symbol: '♒',
    traits: {
      fa: ['مبتکر', 'مستقل', 'انسان‌دوست', 'آزاد'],
      en: ['Innovative', 'Independent', 'Humanitarian', 'Free'],
      ar: ['مبتكر', 'مستقل', 'إنساني', 'حر'],
      ckb: ['داهێنەر', 'سەربەخۆ', 'مرۆڤدۆست', 'ئازاد']
    },
    strengths: {
      fa: ['نوآوری', 'اصالت', 'تفکر مستقل'],
      en: ['Innovation', 'Originality', 'Independent thinking'],
      ar: ['الابتكار', 'الأصالة', 'التفكير المستقل'],
      ckb: ['داهێنان', 'ڕەسەنایەتی', 'بیرکردنەوەی سەربەخۆ']
    },
    weaknesses: {
      fa: ['بی‌احساس', 'لجباز', 'دور از واقعیت'],
      en: ['Emotionally detached', 'Stubborn', 'Out of touch with reality'],
      ar: ['بارد عاطفياً', 'عنيد', 'بعيد عن الواقع'],
      ckb: ['سارد لە ھەستیاری', 'کەللەڕەق', 'دوور لە واقیع']
    },
    description: {
      fa: 'دلو نماد نوآوری و آزادی است. افراد این برج به دنبال تغییر و نوآوری هستند و ذهنی آزاد دارند.',
      en: 'Aquarius symbolizes innovation and freedom. People of this sign seek change and innovation and have free minds.',
      ar: 'الدلو يرمز إلى الابتكار والحرية. يسعى أصحاب هذا البرج إلى التغيير والابتكار ولديهم عقول حرة.',
      ckb: 'بەرزەبورجی دەلو نیشانەی داهێنان و ئازادییە. خەڵکی ئەم بەرزەبورجە بەدوای گۆڕانکاری و داهێناندا دەگەڕێن و مێشکی ئازادیان ھەیە.'
    },
    luckyColor: { fa: 'آبی', en: 'Blue', ar: 'أزرق', ckb: 'شین' }, luckyNumber: '۷'
  },
  pisces: {
    name: 'pisces', nameFa: 'حوت', nameEn: 'Pisces', shamsiMonth: 'اسفند',
    dateRange: { fa: '۱۹ فوریه – ۲۰ مارس', en: 'Feb 19 – Mar 20', ar: '١٩ فبراير – ٢٠ مارس', ckb: '١٩ شوبات – ٢٠ ئازار' },
    element: 'water', elementFa: 'آب', modality: 'mutable', modalityFa: 'تغییرپذیر', rulingPlanet: 'neptune', rulingPlanetFa: 'نپتون', symbol: '♓',
    traits: {
      fa: ['شهودی', 'هنرمند', 'دلسوز', 'رویایی'],
      en: ['Intuitive', 'Artistic', 'Compassionate', 'Dreamy'],
      ar: ['حدسي', 'فني', 'رحيم', 'حالم'],
      ckb: ['ھەستیار', 'ھونەرمەند', 'بەزەیی', 'خەیاڵی']
    },
    strengths: {
      fa: ['تخیل', 'همدلی', 'خلاقیت'],
      en: ['Imagination', 'Empathy', 'Creativity'],
      ar: ['الخيال', 'التعاطف', 'الإبداع'],
      ckb: ['خەیاڵ', 'ھاوسۆزی', 'داهێنان']
    },
    weaknesses: {
      fa: ['فرار از واقعیت', 'حساسیت زیاد', 'بی‌اراده'],
      en: ['Escapism', 'Over-sensitive', 'Weak-willed'],
      ar: ['الهروب من الواقع', 'حساسية مفرطة', 'ضعف الإرادة'],
      ckb: ['ڕاکردن لە واقیع', 'ھەستیاری زۆر', 'بێ ئیرادە']
    },
    description: {
      fa: 'حوت نماد رویا و شهود است. افراد این برج با تخیل و همدلی زندگی می‌کنند و به دنیای درون اهمیت می‌دهند.',
      en: 'Pisces symbolizes dreams and intuition. People of this sign live with imagination and empathy and value their inner world.',
      ar: 'الحوت يرمز إلى الأحلام والحدس. يعيش أصحاب هذا البرج بالخيال والتعاطف ويهتمون بعالمهم الداخلي.',
      ckb: 'بەرزەبورجی ماسی نیشانەی خەون و ھەستیارییە. خەڵکی ئەم بەرزەبورجە بە خەیاڵ و ھاوسۆزی دەژین و گرنگی بە جیھانی ناوەکی خۆیان دەدەن.'
    },
    luckyColor: { fa: 'فیروزه‌ای', en: 'Turquoise', ar: 'فيروزي', ckb: 'فیروزەیی' }, luckyNumber: '۳'
  }
};