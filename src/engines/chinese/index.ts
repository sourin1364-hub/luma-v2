import type {
  ChineseAnimal,
  ChineseElement,
  ChineseAnimalInfo,
  ChineseElementInfo,
  ChineseZodiacResult,
} from './types';
import { CHINESE_NEW_YEAR_DATES } from './constants';

export type {
  ChineseAnimal,
  ChineseElement,
  ChineseAnimalInfo,
  ChineseElementInfo,
  ChineseZodiacResult,
};

export const CHINESE_ANIMALS: ChineseAnimalInfo[] = [
  {
    animal: 'rat',
    nameFa: 'موش',
    nameEn: 'Rat',
    emoji: '🐀',
    meaning: 'باهوش، زیرک، خوش‌برخورد و دارای استراتژی قوی در کسب ثروت و مدیریت فرصت‌ها.',
    keywords: ['زیرک', 'انعطاف‌پذیر', 'اجتماعی'],
    years: '۱۳۶۳، ۱۳۷۵، ۱۳۸۷، ۱۳۹۹',
  },
  {
    animal: 'ox',
    nameFa: 'گاو',
    nameEn: 'Ox',
    emoji: '🐂',
    meaning: 'نماد پشتکار، استقامت بی‌نظیر، صداقت، وفاداری و آرامش درونی استوار.',
    keywords: ['کوشا', 'قابل اتکا', 'صبور'],
    years: '۱۳۶۴، ۱۳۷۶، ۱۳۸۸، ۱۴۰۰',
  },
  {
    animal: 'tiger',
    nameFa: 'ببر',
    nameEn: 'Tiger',
    emoji: '🐅',
    meaning: 'پرشور، شجاع، مستقل، رهبر ذاتی و پیشگام در ماجراجویی‌های بزرگ.',
    keywords: ['شجاع', 'پرانرژی', 'پیشگام'],
    years: '۱۳۶۵، ۱۳۷۷، ۱۳۸۹، ۱۴۰۱',
  },
  {
    animal: 'rabbit',
    nameFa: 'خرگوش',
    nameEn: 'Rabbit',
    emoji: '🐇',
    meaning: 'آرام، لطیف، صلح‌جو، باهوش، دیپلماتیک و دارای حس زیبایی‌شناسی بالا.',
    keywords: ['صلح‌طلب', 'ظریف', 'هوشمند'],
    years: '۱۳۶۶، ۱۳۷۸، ۱۳۹۰، ۱۴۰۲',
  },
  {
    animal: 'dragon',
    nameFa: 'اژدها',
    nameEn: 'Dragon',
    emoji: '🐉',
    meaning: 'کاریزماتیک، قدرتمند، خوش‌شانس، الهام‌بخش و دارای ایده‌های بزرگ و خلاقانه.',
    keywords: ['قدرتمند', 'خلاق', 'پرشکوه'],
    years: '۱۳۶۷، ۱۳۷۹، ۱۳۹۱، ۱۴۰۳',
  },
  {
    animal: 'snake',
    nameFa: 'مار',
    nameEn: 'Snake',
    emoji: '🐍',
    meaning: 'حکیم، رازآلود، متفکر عمیق، استراتژیست و دارای شهود بسیار قوی.',
    keywords: ['فرزانه', 'رازآلود', 'دقیق'],
    years: '۱۳۶۸، ۱۳۸۰، ۱۳۹۲، ۱۴۰۴',
  },
  {
    animal: 'horse',
    nameFa: 'اسب',
    nameEn: 'Horse',
    emoji: '🐎',
    meaning: 'آزاداندیش، پرانرژی، اجتماعی، مستقل و عاشق سفر و تجربه‌های نو.',
    keywords: ['پویا', 'آزاد', 'خوش‌رو'],
    years: '۱۳۶۹، ۱۳۸۱، ۱۳۹۳، ۱۴۰۵',
  },
  {
    animal: 'goat',
    nameFa: 'بز',
    nameEn: 'Goat',
    emoji: '🐐',
    meaning: 'مهربان، هنرمند، صمیمی، آرام، خلاق و دارای طبعی لطیف و همدل.',
    keywords: ['هنرمند', 'مهربان', 'صلح‌جو'],
    years: '۱۳۷۰، ۱۳۸۲، ۱۳۹۴',
  },
  {
    animal: 'monkey',
    nameFa: 'میمون',
    nameEn: 'Monkey',
    emoji: '🐒',
    meaning: 'باهوش، شوخ‌طبع، مخترع، پر از انرژی و استاد یافتن راه‌حل‌های مبتکرانه.',
    keywords: ['شوخ‌طبع', 'مبتکر', 'فرز'],
    years: '۱۳۷۱، ۱۳۸۳، ۱۳۹۵',
  },
  {
    animal: 'rooster',
    nameFa: 'خروس',
    nameEn: 'Rooster',
    emoji: '🐓',
    meaning: 'منظم، سخت‌کوش، وقت‌شناس، شجاع، دقیق و صریح‌القول.',
    keywords: ['منظم', 'صریح', 'کوشا'],
    years: '۱۳۷۲، ۱۳۸۴، ۱۳۹۶',
  },
  {
    animal: 'dog',
    nameFa: 'سگ',
    nameEn: 'Dog',
    emoji: '🐕',
    meaning: 'وفادار، فداکار، عدالت‌خواه، قابل اعتماد و پشتیبان صادق دوستان و خانواده.',
    keywords: ['وفادار', 'عدالت‌خواه', 'حامی'],
    years: '۱۳۷۳، ۱۳۸۵، ۱۳۹۷',
  },
  {
    animal: 'pig',
    nameFa: 'خوک',
    nameEn: 'Pig',
    emoji: '🐖',
    meaning: 'سخاوتمند، صمیمی، خوش‌قلب، باصفا، بخشنده و دوستدار آرامش و صلح.',
    keywords: ['سخاوتمند', 'صمیمی', 'خوش‌نیت'],
    years: '۱۳۷۴، ۱۳۸۶، ۱۳۹۸',
  },
];

export const CHINESE_ELEMENTS: ChineseElementInfo[] = [
  {
    element: 'wood',
    nameFa: 'چوب',
    nameEn: 'Wood',
    meaning: 'نماد رشد، خلاقیت، انعطاف‌پذیری، نوآوری و گسترش افق‌های زندگی.',
    keywords: ['رشد', 'خلاقیت', 'سخاوت'],
  },
  {
    element: 'fire',
    nameFa: 'آتش',
    nameEn: 'Fire',
    meaning: 'نماد شور، اشتیاق، رهبری، شجاعت و انرژی تحول‌آفرین.',
    keywords: ['شور', 'رهبری', 'پویایی'],
  },
  {
    element: 'earth',
    nameFa: 'خاک',
    nameEn: 'Earth',
    meaning: 'نماد ثبات، تعادل، واقع‌بینی، وفاداری و تکیه‌گاه مطمئن.',
    keywords: ['ثبات', 'تعادل', 'اعتماد'],
  },
  {
    element: 'metal',
    nameFa: 'فلز',
    nameEn: 'Metal',
    meaning: 'نماد اراده قاطع، نظم، شفافیت، استقامت و تمرکز بر هدف.',
    keywords: ['اراده', 'نظم', 'استقامت'],
  },
  {
    element: 'water',
    nameFa: 'آب',
    nameEn: 'Water',
    meaning: 'نماد شهود، خرد عمیق، انعطاف، دیپلماسی و جریان آرام آگاهی.',
    keywords: ['شهود', 'خرد', 'انعطاف'],
  },
];

export const ANIMAL_INFO: Record<
  ChineseAnimal,
  { nameFa: string; meaning: string; keywords: string[]; years: string }
> = {
  rat: CHINESE_ANIMALS[0],
  ox: CHINESE_ANIMALS[1],
  tiger: CHINESE_ANIMALS[2],
  rabbit: CHINESE_ANIMALS[3],
  dragon: CHINESE_ANIMALS[4],
  snake: CHINESE_ANIMALS[5],
  horse: CHINESE_ANIMALS[6],
  goat: CHINESE_ANIMALS[7],
  monkey: CHINESE_ANIMALS[8],
  rooster: CHINESE_ANIMALS[9],
  dog: CHINESE_ANIMALS[10],
  pig: CHINESE_ANIMALS[11],
};

const ANIMAL_ORDER: ChineseAnimal[] = [
  'rat',
  'ox',
  'tiger',
  'rabbit',
  'dragon',
  'snake',
  'horse',
  'goat',
  'monkey',
  'rooster',
  'dog',
  'pig',
];

const ELEMENT_BY_LAST_DIGIT: ChineseElement[] = [
  'metal', // 0
  'metal', // 1
  'water', // 2
  'water', // 3
  'wood',  // 4
  'wood',  // 5
  'fire',  // 6
  'fire',  // 7
  'earth', // 8
  'earth', // 9
];

export function getChineseYear(gYear: number, gMonth: number, gDay: number): number {
  const [newYearMonth, newYearDay] = CHINESE_NEW_YEAR_DATES[gYear] || [2, 4];
  if (gMonth < newYearMonth || (gMonth === newYearMonth && gDay < newYearDay)) {
    return gYear - 1;
  }
  return gYear;
}

function getChineseNewYearDate(year: number): string {
  const [month, day] = CHINESE_NEW_YEAR_DATES[year] || [2, 4];
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getAnimal(chineseYear: number): ChineseAnimal {
  const idx = (((chineseYear - 1900) % 12) + 12) % 12;
  return ANIMAL_ORDER[idx];
}

export function getElement(chineseYear: number): ChineseElement {
  const lastDigit = ((chineseYear % 10) + 10) % 10;
  return ELEMENT_BY_LAST_DIGIT[lastDigit];
}

export function calculateChineseZodiac(
  gYear: number,
  gMonth: number = 6,
  gDay: number = 15
): ChineseZodiacResult {
  const chineseYear = getChineseYear(gYear, gMonth, gDay);
  const animal = getAnimal(chineseYear);
  const element = getElement(chineseYear);

  const animalInfo: ChineseAnimalInfo =
    CHINESE_ANIMALS.find((a: ChineseAnimalInfo) => a.animal === animal) || CHINESE_ANIMALS[0];
  const elementInfo: ChineseElementInfo =
    CHINESE_ELEMENTS.find((e: ChineseElementInfo) => e.element === element) || CHINESE_ELEMENTS[0];

  return {
    year: chineseYear,
    chineseYear,
    animal,
    element,
    animalInfo,
    elementInfo,
    combinedName: `${animalInfo.nameFa} ${elementInfo.nameFa}`,
    newYearDate: getChineseNewYearDate(chineseYear),
  };
}
