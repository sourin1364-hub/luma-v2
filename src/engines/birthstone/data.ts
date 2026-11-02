import type { BirthstoneInfo } from './types';

export interface BirthstoneDetail extends BirthstoneInfo {
  element: 'fire' | 'earth' | 'air' | 'water';
  chakra: string;
  astrologyMeaning: string;
  luckyFor: string;
  shamsiRange: string;
  alternativeStones: string[];
}

export const BIRTHSTONES: BirthstoneDetail[] = [
  {
    month: 1,
    nameFa: 'گارنت (لعل)',
    nameEn: 'Garnet',
    color: 'قرمز تیره',
    meaning: 'محافظت، دوستی و وفاداری',
    element: 'earth',
    chakra: 'ریشه (Root)',
    astrologyMeaning: 'گارنت سنگ محافظت و قدرت است. در استرولوژی، آن را به افزایش اراده، دفع کابوس و آرامش اعصاب نسبت می‌دهند. برای متولدین دی و بهمن، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین دی و بهمن',
    shamsiRange: '۱۱ دی تا ۱۰ بهمن',
    alternativeStones: []
  },
  {
    month: 2,
    nameFa: 'آمتیست',
    nameEn: 'Amethyst',
    color: 'بنفش',
    meaning: 'آرامش، تعادل و پاکسازی ذهن',
    element: 'air',
    chakra: 'چشم سوم (Third Eye)',
    astrologyMeaning: 'آمتیست سنگ آرامش و شهود است. در استرولوژی، آن را به افزایش آگاهی، دفع انرژی‌های منفی و تعادل ذهنی نسبت می‌دهند. برای متولدین بهمن و اسفند، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین بهمن و اسفند',
    shamsiRange: '۱۱ بهمن تا ۹ اسفند',
    alternativeStones: []
  },
  {
    month: 3,
    nameFa: 'آکوامارین',
    nameEn: 'Aquamarine',
    color: 'آبی روشن',
    meaning: 'آرامش، شفافیت و شجاعت',
    element: 'water',
    chakra: 'گلو (Throat)',
    astrologyMeaning: 'آکوامارین سنگ آرامش و شجاعت است. در استرولوژی، آن را به محافظت در سفرهای دریایی، بیداری عشق و آرامش احساسات نسبت می‌دهند. برای متولدین اسفند و فروردین، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین اسفند و فروردین',
    shamsiRange: '۱۰ اسفند تا ۱۰ فروردین',
    alternativeStones: ['خون‌سنگ (Bloodstone)']
  },
  {
    month: 4,
    nameFa: 'الماس',
    nameEn: 'Diamond',
    color: 'بی‌رنگ',
    meaning: 'قدرت، عشق ابدی و پاکی',
    element: 'fire',
    chakra: 'تاج (Crown)',
    astrologyMeaning: 'الماس سنگ قدرت و شکست‌ناپذیری است. در استرولوژی، آن را به افزایش اعتماد به نفس، تقویت نیروی ذهنی و دفع شر نسبت می‌دهند. برای متولدین فروردین و اردیبهشت، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین فروردین و اردیبهشت',
    shamsiRange: '۱۱ فروردین تا ۱۰ اردیبهشت',
    alternativeStones: ['کوارتز شفاف (Clear Quartz)']
  },
  {
    month: 5,
    nameFa: 'زمرد',
    nameEn: 'Emerald',
    color: 'سبز',
    meaning: 'تجدید حیات، رشد و خوشبختی',
    element: 'earth',
    chakra: 'قلب (Heart)',
    astrologyMeaning: 'زمرد سنگ عشق و تجدید حیات است. در استرولوژی، آن را به تعادل روح و جسم، افزایش شهود و بهبود سلامت نسبت می‌دهند. برای متولدین اردیبهشت و خرداد، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین اردیبهشت و خرداد',
    shamsiRange: '۱۱ اردیبهشت تا ۱۰ خرداد',
    alternativeStones: ['کریزوپراز (Chrysoprase)']
  },
  {
    month: 6,
    nameFa: 'مروارید',
    nameEn: 'Pearl',
    color: 'سفید صدفی',
    meaning: 'خلوص، خرد و آرامش درونی',
    element: 'water',
    chakra: 'قلب (Heart)',
    astrologyMeaning: 'مروارید سنگ خلوص و آرامش است. در استرولوژی، آن را به آرامش ذهن، کنترل خشم و افزایش خلاقیت نسبت می‌دهند. برای متولدین خرداد و تیر، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین خرداد و تیر',
    shamsiRange: '۱۱ خرداد تا ۹ تیر',
    alternativeStones: ['الکساندریت (Alexandrite)', 'مون‌استون (Moonstone)']
  },
  {
    month: 7,
    nameFa: 'یاقوت سرخ',
    nameEn: 'Ruby',
    color: 'قرمز',
    meaning: 'شور، عشق و سرزندگی',
    element: 'fire',
    chakra: 'ریشه (Root)',
    astrologyMeaning: 'یاقوت سرخ سنگ شور و شجاعت است. در استرولوژی، آن را به افزایش جذابیت، جذب دوستان و محافظت از خطر نسبت می‌دهند. برای متولدین تیر و مرداد، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین تیر و مرداد',
    shamsiRange: '۱۰ تیر تا ۹ مرداد',
    alternativeStones: []
  },
  {
    month: 8,
    nameFa: 'پریدوت',
    nameEn: 'Peridot',
    color: 'سبز زیتونی',
    meaning: 'ثروت، گرما و خوش‌بینی',
    element: 'earth',
    chakra: 'قلب (Heart)',
    astrologyMeaning: 'پریدوت سنگ خوش‌بینی و ثروت است. در استرولوژی، آن را به دفع افسردگی، آرامش احساسی و محافظت از کابوس نسبت می‌دهند. برای متولدین مرداد و شهریور، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین مرداد و شهریور',
    shamsiRange: '۱۰ مرداد تا ۹ شهریور',
    alternativeStones: ['اسپینل (Spinel)', 'ساردونیکس (Sardonyx)']
  },
  {
    month: 9,
    nameFa: 'یاقوت کبود',
    nameEn: 'Sapphire',
    color: 'آبی',
    meaning: 'خرد، صداقت و آرامش',
    element: 'air',
    chakra: 'چشم سوم (Third Eye)',
    astrologyMeaning: 'یاقوت کبود سنگ خرد و وفاداری است. در استرولوژی، آن را به افزایش قدرت ذهنی، محافظت از عزیزان و آرامش روانی نسبت می‌دهند. برای متولدین شهریور و مهر، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین شهریور و مهر',
    shamsiRange: '۱۱ شهریور تا ۸ مهر',
    alternativeStones: ['لاجورد (Lapis Lazuli)']
  },
  {
    month: 10,
    nameFa: 'اوپال',
    nameEn: 'Opal',
    color: 'چندرنگ',
    meaning: 'خلاقیت، امید و الهام',
    element: 'water',
    chakra: 'قلب (Heart)',
    astrologyMeaning: 'اوپال سنگ خلاقیت و الهام است. در استرولوژی، آن را به محافظت از انرژی‌های منفی، افزایش شهود و خلاقیت نسبت می‌دهند. برای متولدین مهر و آبان، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین مهر و آبان',
    shamsiRange: '۹ مهر تا ۹ آبان',
    alternativeStones: ['تورمالین (Tourmaline)']
  },
  {
    month: 11,
    nameFa: 'توپاز',
    nameEn: 'Topaz',
    color: 'طلایی',
    meaning: 'شادی، فراوانی و موفقیت',
    element: 'fire',
    chakra: 'شبکه خورشیدی (Solar Plexus)',
    astrologyMeaning: 'توپاز سنگ شادی و فراوانی است. در استرولوژی، آن را به افزایش انرژی، محافظت در سفر و سلامت روانی نسبت می‌دهند. برای متولدین آبان و آذر، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین آبان و آذر',
    shamsiRange: '۱۰ آبان تا ۹ آذر',
    alternativeStones: ['سیترین (Citrine)']
  },
  {
    month: 12,
    nameFa: 'فیروزه',
    nameEn: 'Turquoise',
    color: 'آبی فیروزه‌ای',
    meaning: 'شفا، محافظت و خوش‌شانسی',
    element: 'water',
    chakra: 'گلو (Throat)',
    astrologyMeaning: 'فیروزه سنگ شفا و محافظت است. در استرولوژی، آن را به دفع خطر، افزایش خوش‌اقبالی و محافظت از چشم‌زخم نسبت می‌دهند. برای متولدین آذر و دی، سنگ خوش‌شانسی محسوب می‌شود.',
    luckyFor: 'متولدین آذر و دی',
    shamsiRange: '۱۱ آذر تا ۹ دی',
    alternativeStones: ['تانزانیت (Tanzanite)', 'زیرکون (Zircon)', 'توپاز آبی (Blue Topaz)']
  }
];

export function getBirthstoneByMonth(month: number): BirthstoneDetail | undefined {
  return BIRTHSTONES.find(b => b.month === month);
}