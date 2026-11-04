import type { TarotCard } from './types';

export const SWORDS_CARDS: TarotCard[] = [
  {
    id: 'swords-01-ace',
    nameEn: 'Ace of Swords',
    nameFa: 'آس شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 1,
    imagePath: '{BASE_URL}/tarot/cards/swords-01-ace.webp',
    keywords: ['وضوح', 'حقیقت', 'بینش', 'قدرت ذهنی', 'شروع جدید'],
    upright: {
      meaning: 'وضوح و حقیقت. آس شمشیر نماد بینش و قدرت ذهنی است. زمانه‌ای برای بریدن توهمات و دیدن واقعیت.',
      keywords: ['وضوح', 'حقیقت', 'بینش', 'قدرت ذهنی']
    },
    reversed: {
      meaning: 'سردرگمی، سوءتفاهم، یا قضاوت نادرست. ممکن است نشان‌دهنده فقدان وضوح یا استفاده نادرست از قدرت ذهنی باشد.',
      keywords: ['سردرگمی', 'سوءتفاهم', 'قضاوت نادرست', 'فقدان وضوح']
    },
    element: 'air',
    astrology: 'هوا'
  },
  {
    id: 'swords-02',
    nameEn: 'Two of Swords',
    nameFa: 'دو شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 2,
    imagePath: '{BASE_URL}/tarot/cards/swords-02.webp',
    keywords: ['تصمیم', 'تعادل', 'چشم‌بستن', 'تردید', 'بی‌طرفی'],
    upright: {
      meaning: 'تصمیم و تعادل. دو شمشیر نماد تردید و دوراهی است. زمانه‌ای برای اتخاذ تصمیم سخت و یافتن تعادل.',
      keywords: ['تصمیم', 'تعادل', 'تردید', 'بی‌طرفی']
    },
    reversed: {
      meaning: 'پایان تردید، تصمیم نهایی، یا اطلاعات جدید. ممکن است نشان‌دهنده خروج از بن‌بست یا چالش با حقیقت باشد.',
      keywords: ['پایان تردید', 'تصمیم نهایی', 'اطلاعات جدید', 'خروج از بن‌بست']
    },
    element: 'air',
    astrology: 'ماه در میزان'
  },
  {
    id: 'swords-03',
    nameEn: 'Three of Swords',
    nameFa: 'سه شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 3,
    imagePath: '{BASE_URL}/tarot/cards/swords-03.webp',
    keywords: ['دل‌شکستگی', 'اندوه', 'قطع ارتباط', 'خیانت', 'رهایی'],
    upright: {
      meaning: 'دل‌شکستگی و اندوه. سه شمشیر نماد درد عاطفی و قطع ارتباط است. زمانه‌ای برای پذیرش درد و رهاسازی آن.',
      keywords: ['دل‌شکستگی', 'اندوه', 'قطع ارتباط', 'خیانت']
    },
    reversed: {
      meaning: 'بهبودی از دل‌شکستگی، رهاسازی درد، یا بخشش. ممکن است نشان‌دهنده التیام و حرکت به جلو باشد.',
      keywords: ['بهبودی', 'رهاسازی', 'بخشش', 'التیام']
    },
    element: 'air',
    astrology: 'زحل در میزان'
  },
  {
    id: 'swords-04',
    nameEn: 'Four of Swords',
    nameFa: 'چهار شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 4,
    imagePath: '{BASE_URL}/tarot/cards/swords-04.webp',
    keywords: ['استراحت', 'بازیابی', 'تنهایی', 'آرامش', 'تأمل'],
    upright: {
      meaning: 'استراحت و بازیابی. چهار شمشیر نماد آرامش پس از تنش است. زمانه‌ای برای استراحت و تجدید قوا.',
      keywords: ['استراحت', 'بازیابی', 'تنهایی', 'آرامش']
    },
    reversed: {
      meaning: 'بی‌قراری، توقف در بازیابی، یا اجبار به استراحت. ممکن است نشان‌دهنده نیاز فوری به استراحت باشد.',
      keywords: ['بی‌قراری', 'توقف', 'اجبار به استراحت', 'بی‌حالی']
    },
    element: 'air',
    astrology: 'مشتری در میزان'
  },
  {
    id: 'swords-05',
    nameEn: 'Five of Swords',
    nameFa: 'پنج شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 5,
    imagePath: '{BASE_URL}/tarot/cards/swords-05.webp',
    keywords: ['تعارض', 'شکست', 'پیروزی بی‌ارزش', 'خودخواهی', 'درس'],
    upright: {
      meaning: 'تعارض و شکست. پنج شمشیر نماد پیروزی بی‌ارزش و خودخواهی است. زمانه‌ای برای پذیرش درس‌های سخت و انتخاب مبارزه‌های ارزشمند.',
      keywords: ['تعارض', 'شکست', 'پیروزی بی‌ارزش', 'درس']
    },
    reversed: {
      meaning: 'آشتی، رهایی از تعارض، یا پذیرش شکست. ممکن است نشان‌دهنده پشت سر گذاشتن درگیری باشد.',
      keywords: ['آشتی', 'رهایی', 'پذیرش', 'پایان تعارض']
    },
    element: 'air',
    astrology: 'زهره در دلو'
  },
  {
    id: 'swords-06',
    nameEn: 'Six of Swords',
    nameFa: 'شش شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 6,
    imagePath: '{BASE_URL}/tarot/cards/swords-06.webp',
    keywords: ['گذار', 'حرکت', 'آرامش پس از طوفان', 'سفر', 'بهبود'],
    upright: {
      meaning: 'گذار و حرکت. شش شمشیر نماد سفر از وضعیت سخت به آرامش است. زمانه‌ای برای حرکت به جلو و بهبود.',
      keywords: ['گذار', 'حرکت', 'آرامش', 'بهبود']
    },
    reversed: {
      meaning: 'توقف در گذار، بازگشت به مشکلات، یا ترس از حرکت. ممکن است نشان‌دهنده مانع در حرکت باشد.',
      keywords: ['توقف', 'بازگشت', 'ترس از حرکت', 'مانع']
    },
    element: 'air',
    astrology: 'مشتری در دلو'
  },
  {
    id: 'swords-07',
    nameEn: 'Seven of Swords',
    nameFa: 'هفت شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 7,
    imagePath: '{BASE_URL}/tarot/cards/swords-07.webp',
    keywords: ['فریب', 'دزدی', 'مخفی‌کاری', 'حیله', 'فرار'],
    upright: {
      meaning: 'فریب و مخفی‌کاری. هفت شمشیر نماد حیله و فرار است. زمانه‌ای برای هوشیاری در برابر فریب و انتخاب صداقت.',
      keywords: ['فریب', 'دزدی', 'مخفی‌کاری', 'حیله']
    },
    reversed: {
      meaning: 'آشکار شدن فریب، اعتراف، یا پایان مخفی‌کاری. ممکن است نشان‌دهنده بازگشت به صداقت باشد.',
      keywords: ['آشکار شدن', 'اعتراف', 'پایان مخفی‌کاری', 'صداقت']
    },
    element: 'air',
    astrology: 'ماه در دلو'
  },
  {
    id: 'swords-08',
    nameEn: 'Eight of Swords',
    nameFa: 'هشت شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 8,
    imagePath: '{BASE_URL}/tarot/cards/swords-08.webp',
    keywords: ['محدودیت', 'قید', 'احساس گیر افتادن', 'ترس', 'رهایی'],
    upright: {
      meaning: 'محدودیت و قید. هشت شمشیر نماد احساس گیر افتادن است. زمانه‌ای برای رهایی از محدودیت‌های ذهنی و یافتن راه خروج.',
      keywords: ['محدودیت', 'قید', 'گیر افتادن', 'ترس']
    },
    reversed: {
      meaning: 'رهایی از محدودیت، شجاعت، یا یافتن راه خروج. ممکن است نشان‌دهنده آزادی از ترس‌ها باشد.',
      keywords: ['رهایی', 'شجاعت', 'راه خروج', 'آزادی']
    },
    element: 'air',
    astrology: 'مشتری در جوزا'
  },
  {
    id: 'swords-09',
    nameEn: 'Nine of Swords',
    nameFa: 'نه شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 9,
    imagePath: '{BASE_URL}/tarot/cards/swords-09.webp',
    keywords: ['اضطراب', 'کابوس', 'نگرانی', 'ترس', 'رهایی از ترس'],
    upright: {
      meaning: 'اضطراب و کابوس. نه شمشیر نماد نگرانی و ترس است. زمانه‌ای برای مواجهه با ترس‌ها و یافتن آرامش.',
      keywords: ['اضطراب', 'کابوس', 'نگرانی', 'ترس']
    },
    reversed: {
      meaning: 'رهایی از اضطراب، بهبود خواب، یا مواجهه با ترس‌ها. ممکن است نشان‌دهنده پایان کابوس باشد.',
      keywords: ['رهایی', 'بهبود', 'مواجهه', 'پایان کابوس']
    },
    element: 'air',
    astrology: 'مریخ در جوزا'
  },
  {
    id: 'swords-10',
    nameEn: 'Ten of Swords',
    nameFa: 'ده شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 10,
    imagePath: '{BASE_URL}/tarot/cards/swords-10.webp',
    keywords: ['پایان', 'خیانت', 'فروپاشی', 'درس', 'آغاز نو'],
    upright: {
      meaning: 'پایان و فروپاشی. ده شمشیر نماد پایان یک چرخه سخت است. زمانه‌ای برای پذیرش پایان و آغاز دوباره.',
      keywords: ['پایان', 'خیانت', 'فروپاشی', 'درس']
    },
    reversed: {
      meaning: 'بهبودی پس از فروپاشی، شروع دوباره، یا پایان زودهنگام درد. ممکن است نشان‌دهنده التیام باشد.',
      keywords: ['بهبودی', 'شروع دوباره', 'التیام', 'پایان درد']
    },
    element: 'air',
    astrology: 'خورشید در جوزا'
  },
  {
    id: 'swords-11-page',
    nameEn: 'Page of Swords',
    nameFa: 'شاهزاده شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 11,
    imagePath: '{BASE_URL}/tarot/cards/swords-11-page.webp',
    keywords: ['کنجکاوی', 'هوش', 'ارتباط', 'جستجو', 'حقیقت'],
    upright: {
      meaning: 'کنجکاوی و هوش. شاهزاده شمشیر نماد جستجوی حقیقت و ارتباط است. زمانه‌ای برای کشف و یادگیری.',
      keywords: ['کنجکاوی', 'هوش', 'ارتباط', 'جستجو']
    },
    reversed: {
      meaning: 'سوءاستفاده از هوش، ارتباط نامناسب، یا تردید. ممکن است نشان‌دهنده گفتار بی‌ملاحظه یا عدم تمرکز باشد.',
      keywords: ['سوءاستفاده', 'ارتباط نامناسب', 'تردید', 'عدم تمرکز']
    },
    element: 'air',
    astrology: 'هوا'
  },
  {
    id: 'swords-12-knight',
    nameEn: 'Knight of Swords',
    nameFa: 'شوالیه شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 12,
    imagePath: '{BASE_URL}/tarot/cards/swords-12-knight.webp',
    keywords: ['اقدام', 'سرعت', 'جسارت', 'تعارض', 'حقیقت'],
    upright: {
      meaning: 'اقدام و سرعت. شوالیه شمشیر نماد جسارت و اقدام قاطع است. زمانه‌ای برای حرکت سریع به سوی هدف.',
      keywords: ['اقدام', 'سرعت', 'جسارت', 'حقیقت']
    },
    reversed: {
      meaning: 'بی‌احتیاطی، تعارض، یا اقدام شتابزده. ممکن است نشان‌دهنده استفاده نادرست از قدرت باشد.',
      keywords: ['بی‌احتیاطی', 'تعارض', 'شتابزدگی', 'قدرت نادرست']
    },
    element: 'air',
    astrology: 'هوا'
  },
  {
    id: 'swords-13-queen',
    nameEn: 'Queen of Swords',
    nameFa: 'ملکه شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 13,
    imagePath: '{BASE_URL}/tarot/cards/swords-13-queen.webp',
    keywords: ['وضوح', 'خرد', 'استقلال', 'ارتباط مستقیم', 'صداقت'],
    upright: {
      meaning: 'وضوح و خرد. ملکه شمشیر نماد استقلال و صداقت است. زمانه‌ای برای ارتباط مستقیم و تصمیم‌گیری عاقلانه.',
      keywords: ['وضوح', 'خرد', 'استقلال', 'صداقت']
    },
    reversed: {
      meaning: 'سردی، بدبینی، یا ارتباط تند. ممکن است نشان‌دهنده استفاده از خرد برای آسیب باشد.',
      keywords: ['سردی', 'بدبینی', 'ارتباط تند', 'آسیب']
    },
    element: 'air',
    astrology: 'هوا'
  },
  {
    id: 'swords-14-king',
    nameEn: 'King of Swords',
    nameFa: 'شاه شمشیر',
    arcana: 'minor',
    suit: 'swords',
    number: 14,
    imagePath: '{BASE_URL}/tarot/cards/swords-14-king.webp',
    keywords: ['اقتدار ذهنی', 'خرد', 'عدالت', 'حقیقت', 'رهبری'],
    upright: {
      meaning: 'اقتدار ذهنی و خرد. شاه شمشیر نماد رهبری عاقلانه و عدالت است. زمانه‌ای برای تصمیم‌گیری بر اساس حقیقت و خرد.',
      keywords: ['اقتدار ذهنی', 'خرد', 'عدالت', 'رهبری']
    },
    reversed: {
      meaning: 'استبداد ذهنی، بی‌رحمی، یا سوءاستفاده از خرد. ممکن است نشان‌دهنده رهبری ناعادلانه باشد.',
      keywords: ['استبداد', 'بی‌رحمی', 'سوءاستفاده', 'رهبری ناعادلانه']
    },
    element: 'air',
    astrology: 'هوا'
  }
];
