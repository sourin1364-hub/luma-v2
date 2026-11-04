import type { TarotCard } from './types';

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
    suit: 'major',
    number: 2,
    imagePath: '{BASE_URL}/tarot/cards/major-02-high-priestess.webp',
    keywords: ['شهود', 'راز', 'ناخودآگاه', 'دانش درونی', 'صبر'],
    upright: {
      meaning: 'شهود، خرد درونی و دانش پنهان. کاهن اعظم نماد راز و ناخودآگاه است. زمانه‌ای برای گوش دادن به صدای درون و اعتماد به شهود.',
      keywords: ['شهود', 'راز', 'خرد درونی', 'صبر']
    },
    reversed: {
      meaning: 'نادیده گرفتن شهود، سطحی‌نگری، یا جدایی از خرد درونی. ممکن است نشان‌دهنده سردرگمی یا پنهان‌کاری باشد.',
      keywords: ['نادیده گرفتن شهود', 'سردرگمی', 'پنهان‌کاری', 'سطحی‌نگری']
    },
    element: 'water',
    planet: 'ماه',
    astrology: 'ماه'
  },
  {
    id: 'major-03-empress',
    nameEn: 'The Empress',
    nameFa: 'ملکه',
    arcana: 'major',
    suit: 'major',
    number: 3,
    imagePath: '{BASE_URL}/tarot/cards/major-03-empress.webp',
    keywords: ['باروری', 'فراوانی', 'طبیعت', 'خلاقیت', 'مادری'],
    upright: {
      meaning: 'باروری، فراوانی و خلاقیت. ملکه نماد طبیعت، زیبایی و رشد است. زمانه‌ای برای شکوفایی، مراقبت و لذت از زندگی.',
      keywords: ['فراوانی', 'باروری', 'خلق', 'مراقبت']
    },
    reversed: {
      meaning: 'وابستگی، خلاقیت مسدود، یا عدم مراقبت از خود. ممکن است نشان‌دهنده رکود یا ناتوانی در لذت بردن باشد.',
      keywords: ['وابستگی', 'رکود', 'عدم مراقبت', 'مسدود شدن خلاقیت']
    },
    element: 'earth',
    planet: 'زهره',
    astrology: 'زهره'
  },
  {
    id: 'major-04-emperor',
    nameEn: 'The Emperor',
    nameFa: 'امپراتور',
    arcana: 'major',
    suit: 'major',
    number: 4,
    imagePath: '{BASE_URL}/tarot/cards/major-04-emperor.webp',
    keywords: ['اقتدار', 'ساختار', 'پدر', 'ثبات', 'رهبری'],
    upright: {
      meaning: 'اقتدار، ساختار و نظم. امپراتور نماد پدر، رهبری و ثبات است. زمانه‌ای برای ایجاد نظم، مسئولیت‌پذیری و کنترل.',
      keywords: ['نظم', 'اقتدار', 'رهبری', 'ثبات']
    },
    reversed: {
      meaning: 'استبداد، عدم انعطاف، یا ضعف در رهبری. ممکن است نشان‌دهنده سوءاستفاده از قدرت یا فقدان ساختار باشد.',
      keywords: ['استبداد', 'عدم انعطاف', 'ضعف', 'سوءاستفاده از قدرت']
    },
    element: 'fire',
    planet: 'مریخ',
    astrology: 'مریخ'
  },
  {
    id: 'major-05-hierophant',
    nameEn: 'The Hierophant',
    nameFa: 'کاهن',
    arcana: 'major',
    suit: 'major',
    number: 5,
    imagePath: '{BASE_URL}/tarot/cards/major-05-hierophant.webp',
    keywords: ['سنت', 'آموزش', 'معنویت', 'راهنمایی', 'اعتقاد'],
    upright: {
      meaning: 'سنت، آموزش و معنویت. کاهن نماد راهنمایی معنوی و باورهای جمعی است. زمانه‌ای برای یادگیری، پیروی از سنت و جستجوی معنا.',
      keywords: ['سنت', 'آموزش', 'معنویت', 'راهنمایی']
    },
    reversed: {
      meaning: 'شک به باورها، عدم انعطاف در سنت، یا شورش علیه قواعد. ممکن است نشان‌دهنده جستجوی معنویت شخصی باشد.',
      keywords: ['شک', 'شورش', 'عدم انعطاف', 'معنویت شخصی']
    },
    element: 'earth',
    planet: 'زهره',
    astrology: 'زهره'
  },
  {
    id: 'major-06-lovers',
    nameEn: 'The Lovers',
    nameFa: 'عاشقان',
    arcana: 'major',
    suit: 'major',
    number: 6,
    imagePath: '{BASE_URL}/tarot/cards/major-06-lovers.webp',
    keywords: ['عشق', 'انتخاب', 'اتحاد', 'هماهنگی', 'ارزش‌ها'],
    upright: {
      meaning: 'عشق، انتخاب و اتحاد. عاشقان نماد هماهنگی و تصمیم‌گیری بر اساس ارزش‌ها هستند. زمانه‌ای برای عشق، همکاری و انتخاب آگاهانه.',
      keywords: ['عشق', 'انتخاب', 'اتحاد', 'هماهنگی']
    },
    reversed: {
      meaning: 'عدم هماهنگی، انتخاب اشتباه، یا جدایی. ممکن است نشان‌دهنده تعارض درونی یا روابط ناسالم باشد.',
      keywords: ['جدایی', 'تعارض', 'انتخاب اشتباه', 'عدم هماهنگی']
    },
    element: 'air',
    planet: 'عطارد',
    astrology: 'عطارد'
  },
  {
    id: 'major-07-chariot',
    nameEn: 'The Chariot',
    nameFa: 'ارابه',
    arcana: 'major',
    suit: 'major',
    number: 7,
    imagePath: '{BASE_URL}/tarot/cards/major-07-chariot.webp',
    keywords: ['پیروزی', 'اراده', 'کنترل', 'حرکت', 'عزم'],
    upright: {
      meaning: 'پیروزی، اراده و کنترل. ارابه نماد عزم و حرکت به سمت هدف است. زمانه‌ای برای غلبه بر موانع و پیشرفت قاطع.',
      keywords: ['پیروزی', 'اراده', 'حرکت', 'کنترل']
    },
    reversed: {
      meaning: 'فقدان کنترل، توقف، یا پراکندگی انرژی. ممکن است نشان‌دهنده تردید یا عدم تمرکز باشد.',
      keywords: ['توقف', 'فقدان کنترل', 'پراکندگی', 'تردید']
    },
    element: 'water',
    planet: 'ماه',
    astrology: 'ماه'
  },
  {
    id: 'major-08-strength',
    nameEn: 'Strength',
    nameFa: 'قدرت',
    arcana: 'major',
    suit: 'major',
    number: 8,
    imagePath: '{BASE_URL}/tarot/cards/major-08-strength.webp',
    keywords: ['شجاعت', 'قدرت درونی', 'صبر', 'مهربانی', 'غلبه بر ترس'],
    upright: {
      meaning: 'شجاعت، قدرت درونی و صبر. قدرت نماد غلبه بر ترس با مهربانی است. زمانه‌ای برای اعتماد به خود و کنترل نفس.',
      keywords: ['شجاعت', 'صبر', 'قدرت درونی', 'مهربانی']
    },
    reversed: {
      meaning: 'ضعف، ترس، یا عدم اعتماد به خود. ممکن است نشان‌دهنده غلبه احساسات یا عدم کنترل باشد.',
      keywords: ['ضعف', 'ترس', 'عدم اعتماد', 'غلبه احساسات']
    },
    element: 'fire',
    planet: 'خورشید',
    astrology: 'خورشید'
  },
  {
    id: 'major-09-hermit',
    nameEn: 'The Hermit',
    nameFa: 'راهب',
    arcana: 'major',
    suit: 'major',
    number: 9,
    imagePath: '{BASE_URL}/tarot/cards/major-09-hermit.webp',
    keywords: ['تنهایی', 'درون‌نگری', 'خرد', 'راهنمایی', 'جستجو'],
    upright: {
      meaning: 'تنهایی، درون‌نگری و خرد. راهب نماد جستجوی معنا در solitude است. زمانه‌ای برای تأمل، کشف خود و راهنمایی دیگران.',
      keywords: ['درون‌نگری', 'خرد', 'تنهایی', 'جستجو']
    },
    reversed: {
      meaning: 'انزوا، تنهایی افراطی، یا فرار از واقعیت. ممکن است نشان‌دهنده جدایی از دیگران یا عدم پذیرش کمک باشد.',
      keywords: ['انزوا', 'فرار', 'جدایی', 'عدم پذیرش کمک']
    },
    element: 'earth',
    planet: 'عطارد',
    astrology: 'عطارد'
  },
  {
    id: 'major-10-wheel-of-fortune',
    nameEn: 'Wheel of Fortune',
    nameFa: 'چرخ بخت',
    arcana: 'major',
    suit: 'major',
    number: 10,
    imagePath: '{BASE_URL}/tarot/cards/major-10-wheel.webp',
    keywords: ['سرنوشت', 'چرخه', 'تحول', 'شانس', 'حرکت'],
    upright: {
      meaning: 'سرنوشت، چرخه و تحول. چرخ بخت نماد تغییرات ناگهانی و شانس است. زمانه‌ای برای پذیرش چرخه‌های زندگی و حرکت به جلو.',
      keywords: ['سرنوشت', 'چرخه', 'شانس', 'تحول']
    },
    reversed: {
      meaning: 'بدشانسی، مقاومت در برابر تغییر، یا چرخه منفی. ممکن است نشان‌دهنده توقف یا تکرار الگوهای ناسالم باشد.',
      keywords: ['بدشانسی', 'توقف', 'مقاومت', 'چرخه منفی']
    },
    element: 'fire',
    planet: 'مشتری',
    astrology: 'مشتری'
  },
  {
    id: 'major-11-justice',
    nameEn: 'Justice',
    nameFa: 'عدالت',
    arcana: 'major',
    suit: 'major',
    number: 11,
    imagePath: '{BASE_URL}/tarot/cards/major-11-justice.webp',
    keywords: ['عدالت', 'تعادل', 'حقیقت', 'مسئولیت', 'انصاف'],
    upright: {
      meaning: 'عدالت، تعادل و حقیقت. عدالت نماد انصاف و مسئولیت‌پذیری است. زمانه‌ای برای تصمیم‌گیری عادلانه و پذیرش پیامدها.',
      keywords: ['عدالت', 'تعادل', 'حقیقت', 'مسئولیت']
    },
    reversed: {
      meaning: 'بی‌عدالتی، عدم تعادل، یا فرار از مسئولیت. ممکن است نشان‌دهنده تصمیم‌گیری ناعادلانه یا انکار حقیقت باشد.',
      keywords: ['بی‌عدالتی', 'عدم تعادل', 'فرار', 'انکار']
    },
    element: 'air',
    planet: 'زهره',
    astrology: 'زهره'
  }
];
