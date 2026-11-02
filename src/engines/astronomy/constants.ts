import type { ZodiacSign, PlanetName, ZodiacSignName, Element } from './types';

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

export const PLANET_NAMES_FA: Record<PlanetName, string> = {
  sun: 'خورشید',
  moon: 'ماه',
  mercury: 'عطارد',
  venus: 'زهره',
  mars: 'مریخ',
  jupiter: 'مشتری',
  saturn: 'زحل',
  uranus: 'اورانوس',
  neptune: 'نپتون',
  pluto: 'پلوتو'
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
  dateRange: string;
  element: Element;
  elementFa: string;
  modality: 'cardinal' | 'fixed' | 'mutable';
  modalityFa: string;
  rulingPlanet: string;
  rulingPlanetFa: string;
  symbol: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  description: string;
  luckyColor: string;
  luckyNumber: string;
}

export const ZODIAC_DETAILS: Record<ZodiacSignName, ZodiacDetail> = {
  aries: {
    name: 'aries' as ZodiacSignName, nameFa: 'حمل', nameEn: 'Aries',
    shamsiMonth: 'فروردین',
    dateRange: '۲۱ مارس – ۱۹ آوریل',
    element: 'fire' as Element, elementFa: 'آتش',
    modality: 'cardinal', modalityFa: 'کاردینال (آغازگر)',
    rulingPlanet: 'mars', rulingPlanetFa: 'مریخ',
    symbol: '♈',
    traits: ['شجاع', 'پیشرو', 'پرانرژی', 'مستقل'],
    strengths: ['رهبری', 'اعتماد به نفس', 'شور و اشتیاق'],
    weaknesses: ['عجول', 'بی‌حوصله', 'گاهی پرخاشگر'],
    description: 'حمل نماد آغاز و انرژی است. افراد این برج با شور و شوق زندگی می‌کنند و از چالش لذت می‌برند. آن‌ها پیشگام و مستقل هستند.',
    luckyColor: 'قرمز', luckyNumber: '۹'
  },
  taurus: {
    name: 'taurus' as ZodiacSignName, nameFa: 'ثور', nameEn: 'Taurus',
    shamsiMonth: 'اردیبهشت',
    dateRange: '۲۰ آوریل – ۲۰ می',
    element: 'earth' as Element, elementFa: 'خاک',
    modality: 'fixed', modalityFa: 'ثابت',
    rulingPlanet: 'venus', rulingPlanetFa: 'زهره',
    symbol: '♉',
    traits: ['پایدار', 'حسی', 'اهل لذت', 'قابل اعتماد'],
    strengths: ['صبر', 'وفاداری', 'استقامت'],
    weaknesses: ['لجباز', 'مالک‌گرا', 'گاهی تنبل'],
    description: 'ثور نماد ثبات و زیبایی است. افراد این برج به امنیت و لذت‌های حسی اهمیت می‌دهند و با صبر به اهداف خود می‌رسند.',
    luckyColor: 'سبز', luckyNumber: '۶'
  },
  gemini: {
    name: 'gemini' as ZodiacSignName, nameFa: 'جوزا', nameEn: 'Gemini',
    shamsiMonth: 'خرداد',
    dateRange: '۲۱ می – ۲۰ ژوئن',
    element: 'air' as Element, elementFa: 'هوا',
    modality: 'mutable', modalityFa: 'تغییرپذیر',
    rulingPlanet: 'mercury', rulingPlanetFa: 'عطارد',
    symbol: '♊',
    traits: ['کنجکاو', 'ارتباطی', 'سازگار', 'باهوش'],
    strengths: ['ذکاوت', 'انطباق‌پذیری', 'مهارت ارتباطی'],
    weaknesses: ['پراکنده', 'دو‌رو', 'بی‌قرار'],
    description: 'جوزا نماد کنجکاوی و ارتباط است. افراد این برج عاشق یادگیری و گفتگو هستند و ذهنی چابک دارند.',
    luckyColor: 'زرد', luckyNumber: '۵'
  },
  cancer: {
    name: 'cancer' as ZodiacSignName, nameFa: 'سرطان', nameEn: 'Cancer',
    shamsiMonth: 'تیر',
    dateRange: '۲۱ ژوئن – ۲۲ جولای',
    element: 'water' as Element, elementFa: 'آب',
    modality: 'cardinal', modalityFa: 'کاردینال (آغازگر)',
    rulingPlanet: 'moon', rulingPlanetFa: 'ماه',
    symbol: '♋',
    traits: ['مهربان', 'حساس', 'خانواده‌دوست', 'شهودی'],
    strengths: ['همدلی', 'وفاداری', 'مراقبت'],
    weaknesses: ['حساسیت زیاد', 'وابستگی', 'بدگمانی'],
    description: 'سرطان نماد خانه و خانواده است. افراد این برج به عزیزانشان اهمیت می‌دهند و شهودی قوی دارند.',
    luckyColor: 'نقره‌ای', luckyNumber: '۲'
  },
  leo: {
    name: 'leo' as ZodiacSignName, nameFa: 'اسد', nameEn: 'Leo',
    shamsiMonth: 'مرداد',
    dateRange: '۲۳ جولای – ۲۲ آگوست',
    element: 'fire' as Element, elementFa: 'آتش',
    modality: 'fixed', modalityFa: 'ثابت',
    rulingPlanet: 'sun', rulingPlanetFa: 'خورشید',
    symbol: '♌',
    traits: ['خلاق', 'رهبر', 'درخشان', 'سخاوتمند'],
    strengths: ['اعتماد به نفس', 'جذابیت', 'سخاوت'],
    weaknesses: ['غرور', 'خودمحور', 'حساس به انتقاد'],
    description: 'اسد نماد قدرت و خلاقیت است. افراد این برج به دنبال شناخت و ابراز وجود هستند و قلبی سخاوتمند دارند.',
    luckyColor: 'طلایی', luckyNumber: '۱'
  },
  virgo: {
    name: 'virgo' as ZodiacSignName, nameFa: 'سنبله', nameEn: 'Virgo',
    shamsiMonth: 'شهریور',
    dateRange: '۲۳ آگوست – ۲۲ سپتامبر',
    element: 'earth' as Element, elementFa: 'خاک',
    modality: 'mutable', modalityFa: 'تغییرپذیر',
    rulingPlanet: 'mercury', rulingPlanetFa: 'عطارد',
    symbol: '♍',
    traits: ['دقیق', 'تحلیلی', 'خدمتگزار', 'منظم'],
    strengths: ['دقت', 'سازماندهی', 'مسئولیت‌پذیری'],
    weaknesses: ['کمال‌گرا', 'انتقادگر', 'مضطرب'],
    description: 'سنبله نماد دقت و خدمت است. افراد این برج به جزئیات توجه دارند و به دنبال کمال و بهبود هستند.',
    luckyColor: 'سبز زیتونی', luckyNumber: '۵'
  },
  libra: {
    name: 'libra' as ZodiacSignName, nameFa: 'میزان', nameEn: 'Libra',
    shamsiMonth: 'مهر',
    dateRange: '۲۳ سپتامبر – ۲۲ اکتبر',
    element: 'air' as Element, elementFa: 'هوا',
    modality: 'cardinal', modalityFa: 'کاردینال (آغازگر)',
    rulingPlanet: 'venus', rulingPlanetFa: 'زهره',
    symbol: '♎',
    traits: ['دیپلمات', 'اجتماعی', 'عاشق زیبایی', 'متعادل'],
    strengths: ['انصاف', 'جذابیت', 'مهارت دیپلماسی'],
    weaknesses: ['بی‌تصمیم', 'وابسته به تایید', 'سطحی'],
    description: 'میزان نماد تعادل و زیبایی است. افراد این برج به روابط هماهنگ و زیبایی اهمیت می‌دهند.',
    luckyColor: 'صورتی', luckyNumber: '۶'
  },
  scorpio: {
    name: 'scorpio' as ZodiacSignName, nameFa: 'عقرب', nameEn: 'Scorpio',
    shamsiMonth: 'آبان',
    dateRange: '۲۳ اکتبر – ۲۱ نوامبر',
    element: 'water' as Element, elementFa: 'آب',
    modality: 'fixed', modalityFa: 'ثابت',
    rulingPlanet: 'pluto', rulingPlanetFa: 'پلوتو',
    symbol: '♏',
    traits: ['عمیق', 'قدرتمند', 'رازآلود', 'پرشور'],
    strengths: ['اراده', 'وفاداری', 'شهود نافذ'],
    weaknesses: ['حسادت', 'کینه‌توزی', 'کنترل‌گر'],
    description: 'عقرب نماد عمق و قدرت است. افراد این برج با شدت و تعهد زندگی می‌کنند و شهودی نافذ دارند.',
    luckyColor: 'قرمز تیره', luckyNumber: '۸'
  },
  sagittarius: {
    name: 'sagittarius' as ZodiacSignName, nameFa: 'قوس', nameEn: 'Sagittarius',
    shamsiMonth: 'آذر',
    dateRange: '۲۲ نوامبر – ۲۱ دسامبر',
    element: 'fire' as Element, elementFa: 'آتش',
    modality: 'mutable', modalityFa: 'تغییرپذیر',
    rulingPlanet: 'jupiter', rulingPlanetFa: 'مشتری',
    symbol: '♐',
    traits: ['ماجراجو', 'خوش‌بین', 'فلسفی', 'آزاد'],
    strengths: ['خوش‌بینی', 'صداقت', 'عشق به سفر'],
    weaknesses: ['بی‌تعهد', 'بی‌ملاحظه', 'زیاده‌رو'],
    description: 'قوس نماد ماجراجویی و فلسفه است. افراد این برج به دنبال معنا و آزادی هستند و عاشق سفر و کشف.',
    luckyColor: 'بنفش', luckyNumber: '۳'
  },
  capricorn: {
    name: 'capricorn' as ZodiacSignName, nameFa: 'جدی', nameEn: 'Capricorn',
    shamsiMonth: 'دی',
    dateRange: '۲۲ دسامبر – ۱۹ ژانویه',
    element: 'earth' as Element, elementFa: 'خاک',
    modality: 'cardinal', modalityFa: 'کاردینال (آغازگر)',
    rulingPlanet: 'saturn', rulingPlanetFa: 'زحل',
    symbol: '♑',
    traits: ['جاه‌طلب', 'مسئولیت‌پذیر', 'منظم', 'پایدار'],
    strengths: ['پشتکار', 'انضباط', 'مدیریت'],
    weaknesses: ['سردی', 'بدبینی', 'کمال‌گرا'],
    description: 'جدی نماد نظم و جاه‌طلبی است. افراد این برج برای اهداف بلندمدت تلاش می‌کنند و پایدار هستند.',
    luckyColor: 'قهوه‌ای', luckyNumber: '۴'
  },
  aquarius: {
    name: 'aquarius' as ZodiacSignName, nameFa: 'دلو', nameEn: 'Aquarius',
    shamsiMonth: 'بهمن',
    dateRange: '۲۰ ژانویه – ۱۸ فوریه',
    element: 'air' as Element, elementFa: 'هوا',
    modality: 'fixed', modalityFa: 'ثابت',
    rulingPlanet: 'uranus', rulingPlanetFa: 'اورانوس',
    symbol: '♒',
    traits: ['مبتکر', 'مستقل', 'انسان‌دوست', 'آزاد'],
    strengths: ['نوآوری', 'اصالت', 'تفکر مستقل'],
    weaknesses: ['بی‌احساس', 'لجباز', 'دور از واقعیت'],
    description: 'دلو نماد نوآوری و آزادی است. افراد این برج به دنبال تغییر و نوآوری هستند و ذهنی آزاد دارند.',
    luckyColor: 'آبی', luckyNumber: '۷'
  },
  pisces: {
    name: 'pisces' as ZodiacSignName, nameFa: 'حوت', nameEn: 'Pisces',
    shamsiMonth: 'اسفند',
    dateRange: '۱۹ فوریه – ۲۰ مارس',
    element: 'water' as Element, elementFa: 'آب',
    modality: 'mutable', modalityFa: 'تغییرپذیر',
    rulingPlanet: 'neptune', rulingPlanetFa: 'نپتون',
    symbol: '♓',
    traits: ['شهودی', 'هنرمند', 'دلسوز', 'رویایی'],
    strengths: ['تخیل', 'همدلی', 'خلاقیت'],
    weaknesses: ['فرار از واقعیت', 'حساسیت زیاد', 'بی‌اراده'],
    description: 'حوت نماد رویا و شهود است. افراد این برج با تخیل و همدلی زندگی می‌کنند و به دنیای درون اهمیت می‌دهند.',
    luckyColor: 'فیروزه‌ای', luckyNumber: '۳'
  }
};