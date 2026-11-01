import type { TarotCard } from './types';

export const PENTACLES_CARDS: TarotCard[] = [
  {
    id: 'pentacles-01-ace',
    nameEn: 'Ace of Pentacles',
    nameFa: 'آس سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 1,
    imagePath: '/assets/tarot/cards/pentacles-01-ace.webp',
    keywords: ['فرصت', 'ثروت', 'شروع مادی', 'پایداری', 'باروری'],
    upright: {
      meaning: 'فرصت و ثروت. آس سکه نماد شروع مادی و باروری است. زمانه‌ای برای سرمایه‌گذاری و پذیرش فرصت‌های جدید.',
      keywords: ['فرصت', 'ثروت', 'شروع مادی', 'باروری']
    },
    reversed: {
      meaning: 'فرصت از دست رفته، عدم سرمایه‌گذاری، یا ترس از موفقیت مادی. ممکن است نشان‌دهنده طمع یا عدم پایداری باشد.',
      keywords: ['فرصت از دست رفته', 'عدم سرمایه‌گذاری', 'ترس', 'طمع']
    },
    element: 'earth',
    astrology: 'خاک'
  },
  {
    id: 'pentacles-02',
    nameEn: 'Two of Pentacles',
    nameFa: 'دو سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 2,
    imagePath: '/assets/tarot/cards/pentacles-02.webp',
    keywords: ['تعادل', 'انعطاف', 'چندوظیفگی', 'تنظیم', 'تصمیم'],
    upright: {
      meaning: 'تعادل و انعطاف. دو سکه نماد مدیریت چند کار و تنظیم منابع است. زمانه‌ای برای یافتن تعادل بین مسئولیت‌ها.',
      keywords: ['تعادل', 'انعطاف', 'چندوظیفگی', 'تنظیم']
    },
    reversed: {
      meaning: 'عدم تعادل، سردرگمی، یا عدم مدیریت زمان. ممکن است نشان‌دهنده بار سنگین یا بی‌نظمی مالی باشد.',
      keywords: ['عدم تعادل', 'سردرگمی', 'عدم مدیریت', 'بی‌نظمی']
    },
    element: 'earth',
    astrology: 'مشتری در جدی'
  },
  {
    id: 'pentacles-03',
    nameEn: 'Three of Pentacles',
    nameFa: 'سه سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 3,
    imagePath: '/assets/tarot/cards/pentacles-03.webp',
    keywords: ['همکاری', 'مهارت', 'پیشرفت', 'یادگیری', 'تیم'],
    upright: {
      meaning: 'همکاری و مهارت. سه سکه نماد teamwork و پیشرفت حرفه‌ای است. زمانه‌ای برای همکاری و یادگیری مهارت‌های جدید.',
      keywords: ['همکاری', 'مهارت', 'پیشرفت', 'یادگیری']
    },
    reversed: {
      meaning: 'عدم همکاری، فقدان مهارت، یا توقف پیشرفت. ممکن است نشان‌دهنده کار تیمی ضعیف یا عدم کیفیت باشد.',
      keywords: ['عدم همکاری', 'فقدان مهارت', 'توقف', 'کیفیت پایین']
    },
    element: 'earth',
    astrology: 'مریخ در جدی'
  },
  {
    id: 'pentacles-04',
    nameEn: 'Four of Pentacles',
    nameFa: 'چهار سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 4,
    imagePath: '/assets/tarot/cards/pentacles-04.webp',
    keywords: ['مالکیت', 'کنترل', 'ثبات', 'احتیاط', 'خودداری'],
    upright: {
      meaning: 'مالکیت و کنترل. چهار سکه نماد ثبات مالی و احتیاط است. زمانه‌ای برای حفظ دارایی‌ها و مدیریت منابع.',
      keywords: ['مالکیت', 'کنترل', 'ثبات', 'احتیاط']
    },
    reversed: {
      meaning: 'وسواس مالی، خودداری افراطی، یا رهاسازی دارایی. ممکن است نشان‌دهنده ترس از دست دادن یا سخاوت باشد.',
      keywords: ['وسواس مالی', 'خودداری', 'رهاسازی', 'ترس']
    },
    element: 'earth',
    astrology: 'خورشید در جدی'
  },
  {
    id: 'pentacles-05',
    nameEn: 'Five of Pentacles',
    nameFa: 'پنج سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 5,
    imagePath: '/assets/tarot/cards/pentacles-05.webp',
    keywords: ['فقر', 'محرومیت', 'تنهایی', 'سختی', 'امید'],
    upright: {
      meaning: 'فقر و سختی. پنج سکه نماد محرومیت و تنهایی است. زمانه‌ای برای پذیرش کمک و یافتن امید در سختی.',
      keywords: ['فقر', 'محرومیت', 'تنهایی', 'سختی']
    },
    reversed: {
      meaning: 'بهبودی از سختی، یافتن کمک، یا پایان محرومیت. ممکن است نشان‌دهنده خروج از بحران باشد.',
      keywords: ['بهبودی', 'یافتن کمک', 'پایان محرومیت', 'خروج از بحران']
    },
    element: 'earth',
    astrology: 'عطارد در ثور'
  },
  {
    id: 'pentacles-06',
    nameEn: 'Six of Pentacles',
    nameFa: 'شش سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 6,
    imagePath: '/assets/tarot/cards/pentacles-06.webp',
    keywords: ['سخاوت', 'بخشش', 'تعادل', 'کمک', 'قدردانی'],
    upright: {
      meaning: 'سخاوت و بخشش. شش سکه نماد تعادل بین دادن و گرفتن است. زمانه‌ای برای بخشش و دریافت کمک.',
      keywords: ['سخاوت', 'بخشش', 'تعادل', 'کمک']
    },
    reversed: {
      meaning: 'عدم تعادل در بخشش، بدهی، یا سوءاستفاده. ممکن است نشان‌دهنده بخشش با انتظار یا عدم قدردانی باشد.',
      keywords: ['عدم تعادل', 'بدهی', 'سوءاستفاده', 'عدم قدردانی']
    },
    element: 'earth',
    astrology: 'ماه در ثور'
  },
  {
    id: 'pentacles-07',
    nameEn: 'Seven of Pentacles',
    nameFa: 'هفت سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 7,
    imagePath: '/assets/tarot/cards/pentacles-07.webp',
    keywords: ['صبر', 'ارزیابی', 'سرمایه‌گذاری', 'انتظار', 'رشد'],
    upright: {
      meaning: 'صبر و ارزیابی. هفت سکه نماد انتظار برای نتیجه است. زمانه‌ای برای صبر و ارزیابی پیشرفت.',
      keywords: ['صبر', 'ارزیابی', 'سرمایه‌گذاری', 'انتظار']
    },
    reversed: {
      meaning: 'بی‌صبری، ناامیدی از نتیجه، یا اتلاف سرمایه. ممکن است نشان‌دهنده عدم رشد یا انتظار بی‌ثمر باشد.',
      keywords: ['بی‌صبری', 'ناامیدی', 'اتلاف سرمایه', 'عدم رشد']
    },
    element: 'earth',
    astrology: 'زحل در ثور'
  },
  {
    id: 'pentacles-08',
    nameEn: 'Eight of Pentacles',
    nameFa: 'هشت سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 8,
    imagePath: '/assets/tarot/cards/pentacles-08.webp',
    keywords: ['مهارت', 'تعهد', 'یادگیری', 'کار سخت', 'پیشرفت'],
    upright: {
      meaning: 'مهارت و تعهد. هشت سکه نماد کار سخت و یادگیری است. زمانه‌ای برای تمرکز بر مهارت و پیشرفت تدریجی.',
      keywords: ['مهارت', 'تعهد', 'یادگیری', 'کار سخت']
    },
    reversed: {
      meaning: 'کمال‌گرایی، عدم تعهد، یا کار بی‌کیفیت. ممکن است نشان‌دهنده تمرکز بر جزئیات بی‌اهمیت یا عدم پیشرفت باشد.',
      keywords: ['کمال‌گرایی', 'عدم تعهد', 'کار بی‌کیفیت', 'عدم پیشرفت']
    },
    element: 'earth',
    astrology: 'خورشید در سنبله'
  },
  {
    id: 'pentacles-09',
    nameEn: 'Nine of Pentacles',
    nameFa: 'نه سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 9,
    imagePath: '/assets/tarot/cards/pentacles-09.webp',
    keywords: ['استقلال', 'رفاه', 'لذت', 'خودکفایی', 'موفقیت'],
    upright: {
      meaning: 'استقلال و رفاه. نه سکه نماد خودکفایی و لذت از دستاوردهاست. زمانه‌ای برای جشن گرفتن استقلال مالی.',
      keywords: ['استقلال', 'رفاه', 'لذت', 'خودکفایی']
    },
    reversed: {
      meaning: 'وابستگی مالی، عدم لذت از دستاوردها، یا رفاه ظاهری. ممکن است نشان‌دهنده عدم تعادل بین کار و زندگی باشد.',
      keywords: ['وابستگی', 'عدم لذت', 'رفاه ظاهری', 'عدم تعادل']
    },
    element: 'earth',
    astrology: 'زهره در سنبله'
  },
  {
    id: 'pentacles-10',
    nameEn: 'Ten of Pentacles',
    nameFa: 'ده سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 10,
    imagePath: '/assets/tarot/cards/pentacles-10.webp',
    keywords: ['ثروت', 'خانواده', 'میراث', 'پایداری', 'کمال مادی'],
    upright: {
      meaning: 'ثروت و میراث. ده سکه نماد خانواده و پایداری مالی است. زمانه‌ای برای جشن گرفتن دستاوردهای مادی و خانوادگی.',
      keywords: ['ثروت', 'خانواده', 'میراث', 'پایداری']
    },
    reversed: {
      meaning: 'عدم پایداری مالی، اختلاف خانوادگی بر سر میراث، یا از دست دادن ثروت. ممکن است نشان‌دهنده عدم تعادل بین مادیات و معنویات باشد.',
      keywords: ['عدم پایداری', 'اختلاف خانوادگی', 'از دست دادن', 'عدم تعادل']
    },
    element: 'earth',
    astrology: 'مریخ در سنبله'
  },
  {
    id: 'pentacles-11-page',
    nameEn: 'Page of Pentacles',
    nameFa: 'شاهزاده سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 11,
    imagePath: '/assets/tarot/cards/pentacles-11-page.webp',
    keywords: ['یادگیری', 'فرصت', 'شروع مادی', 'کنجکاوی', 'عملی'],
    upright: {
      meaning: 'یادگیری و فرصت. شاهزاده سکه نماد شروع مادی و یادگیری عملی است. زمانه‌ای برای سرمایه‌گذاری در دانش و مهارت.',
      keywords: ['یادگیری', 'فرصت', 'شروع مادی', 'کنجکاوی']
    },
    reversed: {
      meaning: 'تنبلی، عدم تمرکز، یا از دست دادن فرصت. ممکن است نشان‌دهنده عدم تعهد به یادگیری یا ترس از موفقیت باشد.',
      keywords: ['تنبلی', 'عدم تمرکز', 'فرصت از دست رفته', 'عدم تعهد']
    },
    element: 'earth',
    astrology: 'خاک'
  },
  {
    id: 'pentacles-12-knight',
    nameEn: 'Knight of Pentacles',
    nameFa: 'شوالیه سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 12,
    imagePath: '/assets/tarot/cards/pentacles-12-knight.webp',
    keywords: ['پایداری', 'کار سخت', 'مسئولیت', 'صبر', 'قابلیت اعتماد'],
    upright: {
      meaning: 'پایداری و کار سخت. شوالیه سکه نماد مسئولیت‌پذیری و صبر است. زمانه‌ای برای پیشرفت تدریجی و قابل اعتماد بودن.',
      keywords: ['پایداری', 'کار سخت', 'مسئولیت', 'صبر']
    },
    reversed: {
      meaning: 'کندی افراطی، عدم انعطاف، یا تنبلی. ممکن است نشان‌دهنده وسواس یا عدم پیشرفت باشد.',
      keywords: ['کندی', 'عدم انعطاف', 'تنبلی', 'وسواس']
    },
    element: 'earth',
    astrology: 'خاک'
  },
  {
    id: 'pentacles-13-queen',
    nameEn: 'Queen of Pentacles',
    nameFa: 'ملکه سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 13,
    imagePath: '/assets/tarot/cards/pentacles-13-queen.webp',
    keywords: ['مراقبت', 'ثروت', 'عملی بودن', 'آسایش', 'باروری'],
    upright: {
      meaning: 'مراقبت و ثروت. ملکه سکه نماد عملی بودن و آسایش است. زمانه‌ای برای مراقبت از خود و دیگران و مدیریت منابع.',
      keywords: ['مراقبت', 'ثروت', 'عملی بودن', 'آسایش']
    },
    reversed: {
      meaning: 'وسواس مالی، عدم مراقبت از خود، یا عدم تعادل بین کار و خانه. ممکن است نشان‌دهنده بی‌توجهی به نیازهای شخصی باشد.',
      keywords: ['وسواس مالی', 'عدم مراقبت', 'عدم تعادل', 'بی‌توجهی']
    },
    element: 'earth',
    astrology: 'خاک'
  },
  {
    id: 'pentacles-14-king',
    nameEn: 'King of Pentacles',
    nameFa: 'شاه سکه',
    arcana: 'minor',
    suit: 'pentacles',
    number: 14,
    imagePath: '/assets/tarot/cards/pentacles-14-king.webp',
    keywords: ['ثروت', 'اقتدار مادی', 'پایداری', 'کارآفرینی', 'سخاوت'],
    upright: {
      meaning: 'ثروت و اقتدار مادی. شاه سکه نماد کارآفرینی و پایداری است. زمانه‌ای برای رهبری مالی و ساختن پایه‌های محکم.',
      keywords: ['ثروت', 'اقتدار مادی', 'پایداری', 'کارآفرینی']
    },
    reversed: {
      meaning: 'طمع، سوءاستفاده از ثروت، یا عدم پایداری. ممکن است نشان‌دهنده استبداد مالی یا بی‌توجهی به دیگران باشد.',
      keywords: ['طمع', 'سوءاستفاده', 'عدم پایداری', 'استبداد']
    },
    element: 'earth',
    astrology: 'خاک'
  }
];