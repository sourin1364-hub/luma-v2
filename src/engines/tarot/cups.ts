import type { TarotCard } from './types';

export const CUPS_CARDS: TarotCard[] = [
  {
    id: 'cups-01-ace',
    nameEn: 'Ace of Cups',
    nameFa: 'آس جام',
    arcana: 'minor',
    suit: 'cups',
    number: 1,
    imagePath: '/assets/tarot/cards/cups-01-ace.webp',
    keywords: ['عشق', 'احساس', 'شهود', 'آغاز عاطفی', 'شفا'],
    upright: {
      meaning: 'آغازی عاطفی و سرریز احساسات. آس جام نماد عشق و شهود است. زمانه‌ای برای پذیرش احساسات و آغاز رابطه‌ای عمیق.',
      keywords: ['عشق', 'احساس', 'شهود', 'شفا']
    },
    reversed: {
      meaning: 'احساسات مسدود، عشق ناکام، یا عدم پذیرش احساسات. ممکن است نشان‌دهنده خلأ عاطفی یا ترس از صمیمیت باشد.',
      keywords: ['احساسات مسدود', 'عشق ناکام', 'ترس از صمیمیت', 'خلأ']
    },
    element: 'water',
    astrology: 'آب'
  },
  {
    id: 'cups-02',
    nameEn: 'Two of Cups',
    nameFa: 'دو جام',
    arcana: 'minor',
    suit: 'cups',
    number: 2,
    imagePath: '/assets/tarot/cards/cups-02.webp',
    keywords: ['اتحاد', 'عشق', 'هماهنگی', 'همکاری', 'جذب'],
    upright: {
      meaning: 'اتحاد و هماهنگی. دو جام نماد عشق و همکاری است. زمانه‌ای برای پیوند عاطفی و همکاری متقابل.',
      keywords: ['اتحاد', 'عشق', 'هماهنگی', 'همکاری']
    },
    reversed: {
      meaning: 'جدایی، عدم هماهنگی، یا تعارض در رابطه. ممکن است نشان‌دهنده عدم تعادل عاطفی باشد.',
      keywords: ['جدایی', 'عدم هماهنگی', 'تعارض', 'عدم تعادل']
    },
    element: 'water',
    astrology: 'زهره در سرطان'
  },
  {
    id: 'cups-03',
    nameEn: 'Three of Cups',
    nameFa: 'سه جام',
    arcana: 'minor',
    suit: 'cups',
    number: 3,
    imagePath: '/assets/tarot/cards/cups-03.webp',
    keywords: ['جشن', 'دوستی', 'شادی', 'همبستگی', 'خلاقیت'],
    upright: {
      meaning: 'جشن و دوستی. سه جام نماد شادی و همبستگی است. زمانه‌ای برای جشن گرفتن با دوستان و لذت بردن از زندگی.',
      keywords: ['جشن', 'دوستی', 'شادی', 'همبستگی']
    },
    reversed: {
      meaning: 'انزوا، عدم تعادل در جشن، یا دوستی سطحی. ممکن است نشان‌دهنده احساس تنهایی در جمع باشد.',
      keywords: ['انزوا', 'دوستی سطحی', 'تنهایی', 'عدم تعادل']
    },
    element: 'water',
    astrology: 'عطارد در سرطان'
  },
  {
    id: 'cups-04',
    nameEn: 'Four of Cups',
    nameFa: 'چهار جام',
    arcana: 'minor',
    suit: 'cups',
    number: 4,
    imagePath: '/assets/tarot/cards/cups-04.webp',
    keywords: ['بی‌تفاوتی', 'خستگی', 'تعمق', 'نارضایتی', 'فرصت از دست رفته'],
    upright: {
      meaning: 'بی‌تفاوتی و تعمق. چهار جام نماد خستگی و نارضایتی است. زمانه‌ای برای تأمل و توجه به فرصت‌های جدید.',
      keywords: ['بی‌تفاوتی', 'خستگی', 'تعمق', 'نارضایتی']
    },
    reversed: {
      meaning: 'بیداری از خستگی، پذیرش فرصت جدید، یا پایان تعمق. ممکن است نشان‌دهنده خروج از رکود باشد.',
      keywords: ['بیداری', 'فرصت جدید', 'پایان رکود', 'پذیرش']
    },
    element: 'water',
    astrology: 'ماه در سرطان'
  },
  {
    id: 'cups-05',
    nameEn: 'Five of Cups',
    nameFa: 'پنج جام',
    arcana: 'minor',
    suit: 'cups',
    number: 5,
    imagePath: '/assets/tarot/cards/cups-05.webp',
    keywords: ['غم', 'اندوه', 'از دست دادن', 'پشیمانی', 'پذیرش'],
    upright: {
      meaning: 'غم و اندوه. پنج جام نماد از دست دادن و پشیمانی است. زمانه‌ای برای پذیرش فقدان و توجه به آنچه باقی مانده.',
      keywords: ['غم', 'اندوه', 'از دست دادن', 'پشیمانی']
    },
    reversed: {
      meaning: 'پذیرش فقدان، بهبودی، یا توجه به فرصت‌های باقی‌مانده. ممکن است نشان‌دهنده گذر از اندوه باشد.',
      keywords: ['پذیرش', 'بهبودی', 'فرصت باقی‌مانده', 'گذر از اندوه']
    },
    element: 'water',
    astrology: 'مریخ در عقرب'
  },
  {
    id: 'cups-06',
    nameEn: 'Six of Cups',
    nameFa: 'شش جام',
    arcana: 'minor',
    suit: 'cups',
    number: 6,
    imagePath: '/assets/tarot/cards/cups-06.webp',
    keywords: ['نوستالژی', 'کودکی', 'بخشش', 'خاطرات', 'معصومیت'],
    upright: {
      meaning: 'نوستالژی و معصومیت. شش جام نماد خاطرات و بخشش است. زمانه‌ای برای بازگشت به گذشته و لذت از سادگی.',
      keywords: ['نوستالژی', 'کودکی', 'بخشش', 'خاطرات']
    },
    reversed: {
      meaning: 'چسبیدن به گذشته، عدم بخشش، یا فرار به خاطرات. ممکن است نشان‌دهنده نیاز به رها کردن گذشته باشد.',
      keywords: ['چسبیدن به گذشته', 'عدم بخشش', 'فرار', 'رها کردن']
    },
    element: 'water',
    astrology: 'خورشید در عقرب'
  },
  {
    id: 'cups-07',
    nameEn: 'Seven of Cups',
    nameFa: 'هفت جام',
    arcana: 'minor',
    suit: 'cups',
    number: 7,
    imagePath: '/assets/tarot/cards/cups-07.webp',
    keywords: ['توهم', 'خیال', 'انتخاب', 'سردرگمی', 'آرزو'],
    upright: {
      meaning: 'توهم و انتخاب. هفت جام نماد خیال و سردرگمی است. زمانه‌ای برای تشخیص واقعیت از خیال و انتخاب آگاهانه.',
      keywords: ['توهم', 'خیال', 'انتخاب', 'سردرگمی']
    },
    reversed: {
      meaning: 'روشن شدن ذهن، تشخیص واقعیت، یا انتخاب قاطع. ممکن است نشان‌دهنده رهایی از توهمات باشد.',
      keywords: ['روشن شدن', 'تشخیص واقعیت', 'انتخاب قاطع', 'رهایی']
    },
    element: 'water',
    astrology: 'زهره در عقرب'
  },
  {
    id: 'cups-08',
    nameEn: 'Eight of Cups',
    nameFa: 'هشت جام',
    arcana: 'minor',
    suit: 'cups',
    number: 8,
    imagePath: '/assets/tarot/cards/cups-08.webp',
    keywords: ['ترک کردن', 'جستجو', 'ناامیدی', 'سفر درونی', 'رهایی'],
    upright: {
      meaning: 'ترک کردن و جستجو. هشت جام نماد رهایی از وضعیت ناراضی‌کننده است. زمانه‌ای برای ترک چیزی که دیگر ارزشمند نیست و جستجوی معنا.',
      keywords: ['ترک کردن', 'جستجو', 'ناامیدی', 'رهایی']
    },
    reversed: {
      meaning: 'تردید در ترک، بازگشت، یا ترس از تغییر. ممکن است نشان‌دهنده چسبیدن به وضعیت ناراضی‌کننده باشد.',
      keywords: ['تردید', 'بازگشت', 'ترس از تغییر', 'چسبیدن']
    },
    element: 'water',
    astrology: 'زحل در حوت'
  },
  {
    id: 'cups-09',
    nameEn: 'Nine of Cups',
    nameFa: 'نه جام',
    arcana: 'minor',
    suit: 'cups',
    number: 9,
    imagePath: '/assets/tarot/cards/cups-09.webp',
    keywords: ['آرزوی برآورده', 'رضایت', 'شادی', 'وفور', 'لذت'],
    upright: {
      meaning: 'آرزوی برآورده و رضایت. نه جام نماد شادی و وفور است. زمانه‌ای برای لذت بردن از دستاوردها و رضایت از زندگی.',
      keywords: ['آرزوی برآورده', 'رضایت', 'شادی', 'وفور']
    },
    reversed: {
      meaning: 'نارضایتی، آرزوی برآورده نشده، یا زیاده‌خواهی. ممکن است نشان‌دهنده احساس پوچی با وجود موفقیت ظاهری باشد.',
      keywords: ['نارضایتی', 'آرزوی برآورده نشده', 'زیاده‌خواهی', 'پوچی']
    },
    element: 'water',
    astrology: 'مشتری در حوت'
  },
  {
    id: 'cups-10',
    nameEn: 'Ten of Cups',
    nameFa: 'ده جام',
    arcana: 'minor',
    suit: 'cups',
    number: 10,
    imagePath: '/assets/tarot/cards/cups-10.webp',
    keywords: ['خوشبختی', 'خانواده', 'هماهنگی', 'عشق', 'کمال عاطفی'],
    upright: {
      meaning: 'خوشبختی و هماهنگی. ده جام نماد خانواده و عشق کامل است. زمانه‌ای برای شادی خانوادگی و رضایت عاطفی.',
      keywords: ['خوشبختی', 'خانواده', 'هماهنگی', 'عشق']
    },
    reversed: {
      meaning: 'عدم هماهنگی خانوادگی، خوشبختی ظاهری، یا جدایی عاطفی. ممکن است نشان‌دهنده فاصله از عزیزان باشد.',
      keywords: ['عدم هماهنگی', 'خوشبختی ظاهری', 'جدایی عاطفی', 'فاصله']
    },
    element: 'water',
    astrology: 'مریخ در حوت'
  },
  {
    id: 'cups-11-page',
    nameEn: 'Page of Cups',
    nameFa: 'شاهزاده جام',
    arcana: 'minor',
    suit: 'cups',
    number: 11,
    imagePath: '/assets/tarot/cards/cups-11-page.webp',
    keywords: ['شهود', 'خلاقیت', 'کشف عاطفی', 'پیام', 'معصومیت'],
    upright: {
      meaning: 'شهود و خلاقیت. شاهزاده جام نماد کشف عاطفی و پیام است. زمانه‌ای برای پذیرش احساسات جدید و الهام خلاقانه.',
      keywords: ['شهود', 'خلاقیت', 'کشف عاطفی', 'پیام']
    },
    reversed: {
      meaning: 'احساسات ناپخته، عدم اعتماد به شهود، یا فرار عاطفی. ممکن است نشان‌دهنده عدم پذیرش احساسات باشد.',
      keywords: ['احساسات ناپخته', 'عدم اعتماد', 'فرار عاطفی', 'عدم پذیرش']
    },
    element: 'water',
    astrology: 'آب'
  },
  {
    id: 'cups-12-knight',
    nameEn: 'Knight of Cups',
    nameFa: 'شوالیه جام',
    arcana: 'minor',
    suit: 'cups',
    number: 12,
    imagePath: '/assets/tarot/cards/cups-12-knight.webp',
    keywords: ['عشق', 'رمانتیسم', 'پیام عاطفی', 'جذابیت', 'خیال'],
    upright: {
      meaning: 'عشق و رمانتیسم. شوالیه جام نماد پیام عاطفی و جذابیت است. زمانه‌ای برای دنبال کردن قلب و ابراز عشق.',
      keywords: ['عشق', 'رمانتیسم', 'پیام عاطفی', 'جذابیت']
    },
    reversed: {
      meaning: 'عشق ناکام، خیال‌پردازی، یا عدم صداقت عاطفی. ممکن است نشان‌دهنده فریب احساسات یا ناپایداری باشد.',
      keywords: ['عشق ناکام', 'خیال‌پردازی', 'عدم صداقت', 'ناپایداری']
    },
    element: 'water',
    astrology: 'آب'
  },
  {
    id: 'cups-13-queen',
    nameEn: 'Queen of Cups',
    nameFa: 'ملکه جام',
    arcana: 'minor',
    suit: 'cups',
    number: 13,
    imagePath: '/assets/tarot/cards/cups-13-queen.webp',
    keywords: ['شهود', 'مهربانی', 'همدلی', 'آرامش', 'مراقبت'],
    upright: {
      meaning: 'شهود و مهربانی. ملکه جام نماد همدلی و مراقبت است. زمانه‌ای برای گوش دادن به شهود و مراقبت از دیگران.',
      keywords: ['شهود', 'مهربانی', 'همدلی', 'مراقبت']
    },
    reversed: {
      meaning: 'احساسات سرکوب‌شده، وابستگی عاطفی، یا عدم مراقبت از خود. ممکن است نشان‌دهنده غرق شدن در احساسات باشد.',
      keywords: ['احساسات سرکوب‌شده', 'وابستگی', 'عدم مراقبت', 'غرق شدن']
    },
    element: 'water',
    astrology: 'آب'
  },
  {
    id: 'cups-14-king',
    nameEn: 'King of Cups',
    nameFa: 'شاه جام',
    arcana: 'minor',
    suit: 'cups',
    number: 14,
    imagePath: '/assets/tarot/cards/cups-14-king.webp',
    keywords: ['تعادل عاطفی', 'خرد', 'همدلی', 'کنترل احساسات', 'پدری'],
    upright: {
      meaning: 'تعادل عاطفی و خرد. شاه جام نماد کنترل احساسات و همدلی است. زمانه‌ای برای هدایت احساسات با خرد و مراقبت.',
      keywords: ['تعادل عاطفی', 'خرد', 'همدلی', 'کنترل']
    },
    reversed: {
      meaning: 'احساسات سرکوب‌شده، بی‌تفاوتی، یا دستکاری عاطفی. ممکن است نشان‌دهنده عدم تعادل عاطفی باشد.',
      keywords: ['احساسات سرکوب‌شده', 'بی‌تفاوتی', 'دستکاری', 'عدم تعادل']
    },
    element: 'water',
    astrology: 'آب'
  }
];