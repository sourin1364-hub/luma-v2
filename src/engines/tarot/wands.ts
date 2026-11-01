import type { TarotCard } from './types';

export const WANDS_CARDS: TarotCard[] = [
  {
    id: 'wands-01-ace',
    nameEn: 'Ace of Wands',
    nameFa: 'آس چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 1,
    imagePath: '/assets/tarot/cards/wands-01-ace.webp',
    keywords: ['جرقه خلاقیت', 'الهام', 'شروع', 'انرژی', 'اشتیاق'],
    upright: {
      meaning: 'جرقه‌ای از الهام و خلاقیت. آس چوبدست نماد شروع پرانرژی و اشتیاق است. زمانه‌ای برای آغاز پروژه‌ای جدید با اعتماد به نفس.',
      keywords: ['شروع', 'خلاقیت', 'الهام', 'اشتیاق']
    },
    reversed: {
      meaning: 'تأخیر در شروع، فقدان انگیزه، یا انرژی مسدود. ممکن است نشان‌دهنده تردید یا ایده‌ای باشد که هنوز به عمل تبدیل نشده.',
      keywords: ['تأخیر', 'فقدان انگیزه', 'انرژی مسدود', 'تردید']
    },
    element: 'fire',
    astrology: 'آتش'
  },
  {
    id: 'wands-02',
    nameEn: 'Two of Wands',
    nameFa: 'دو چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 2,
    imagePath: '/assets/tarot/cards/wands-02.webp',
    keywords: ['برنامه‌ریزی', 'تصمیم', 'آینده‌نگری', 'انتخاب', 'جاه‌طلبی'],
    upright: {
      meaning: 'برنامه‌ریزی و آینده‌نگری. دو چوبدست نماد تصمیم برای حرکت به جلو و گسترش افق‌هاست. زمانه‌ای برای انتخاب مسیر و برنامه‌ریزی.',
      keywords: ['برنامه‌ریزی', 'تصمیم', 'آینده‌نگری', 'انتخاب']
    },
    reversed: {
      meaning: 'تردید در تصمیم، ترس از ناشناخته، یا عدم برنامه‌ریزی. ممکن است نشان‌دهنده ماندن در منطقه امن باشد.',
      keywords: ['تردید', 'ترس', 'عدم برنامه‌ریزی', 'منطقه امن']
    },
    element: 'fire',
    astrology: 'مریخ در حمل'
  },
  {
    id: 'wands-03',
    nameEn: 'Three of Wands',
    nameFa: 'سه چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 3,
    imagePath: '/assets/tarot/cards/wands-03.webp',
    keywords: ['گسترش', 'چشم‌انداز', 'پیشرفت', 'همکاری', 'آینده'],
    upright: {
      meaning: 'گسترش و پیشرفت. سه چوبدست نماد همکاری و دیدن نتایج تلاش‌هاست. زمانه‌ای برای گسترش افق‌ها و همکاری با دیگران.',
      keywords: ['گسترش', 'پیشرفت', 'همکاری', 'چشم‌انداز']
    },
    reversed: {
      meaning: 'توقف در گسترش، عدم همکاری، یا ناامیدی از نتایج. ممکن است نشان‌دهنده تأخیر در برنامه‌ها باشد.',
      keywords: ['توقف', 'عدم همکاری', 'ناامیدی', 'تأخیر']
    },
    element: 'fire',
    astrology: 'خورشید در حمل'
  },
  {
    id: 'wands-04',
    nameEn: 'Four of Wands',
    nameFa: 'چهار چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 4,
    imagePath: '/assets/tarot/cards/wands-04.webp',
    keywords: ['جشن', 'خانه', 'هماهنگی', 'پایداری', 'خانواده'],
    upright: {
      meaning: 'جشن و هماهنگی. چهار چوبدست نماد خانه و پایداری است. زمانه‌ای برای جشن گرفتن دستاوردها و کنار خانواده بودن.',
      keywords: ['جشن', 'خانه', 'هماهنگی', 'پایداری']
    },
    reversed: {
      meaning: 'عدم هماهنگی در خانه، تأخیر در جشن، یا ناپایداری. ممکن است نشان‌دهنده تعارض خانوادگی باشد.',
      keywords: ['عدم هماهنگی', 'تأخیر', 'ناپایداری', 'تعارض']
    },
    element: 'fire',
    astrology: 'زهره در حمل'
  },
  {
    id: 'wands-05',
    nameEn: 'Five of Wands',
    nameFa: 'پنج چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 5,
    imagePath: '/assets/tarot/cards/wands-05.webp',
    keywords: ['رقابت', 'تعارض', 'چالش', 'تنوع', 'مبارزه'],
    upright: {
      meaning: 'رقابت و چالش. پنج چوبدست نماد تعارض و تنوع است. زمانه‌ای برای مواجهه با رقابت و یافتن راهی برای همکاری.',
      keywords: ['رقابت', 'تعارض', 'چالش', 'مبارزه']
    },
    reversed: {
      meaning: 'حل تعارض، پایان رقابت، یا اجتناب از درگیری. ممکن است نشان‌دهنده یافتن راهی برای همکاری باشد.',
      keywords: ['حل تعارض', 'پایان رقابت', 'همکاری', 'اجتناب']
    },
    element: 'fire',
    astrology: 'زحل در اسد'
  },
  {
    id: 'wands-06',
    nameEn: 'Six of Wands',
    nameFa: 'شش چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 6,
    imagePath: '/assets/tarot/cards/wands-06.webp',
    keywords: ['پیروزی', 'افتخار', 'شناخت', 'موفقیت', 'رهبری'],
    upright: {
      meaning: 'پیروزی و شناخت. شش چوبدست نماد موفقیت و افتخار است. زمانه‌ای برای جشن گرفتن پیروزی و دریافت شناخت.',
      keywords: ['پیروزی', 'افتخار', 'شناخت', 'موفقیت']
    },
    reversed: {
      meaning: 'شکست، فقدان شناخت، یا غرور. ممکن است نشان‌دهنده عدم دریافت اعتبار یا ترس از موفقیت باشد.',
      keywords: ['شکست', 'فقدان شناخت', 'غرور', 'ترس از موفقیت']
    },
    element: 'fire',
    astrology: 'مشتری در اسد'
  },
  {
    id: 'wands-07',
    nameEn: 'Seven of Wands',
    nameFa: 'هفت چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 7,
    imagePath: '/assets/tarot/cards/wands-07.webp',
    keywords: ['دفاع', 'ایستادگی', 'چالش', 'اعتماد', 'مقاومت'],
    upright: {
      meaning: 'دفاع و ایستادگی. هفت چوبدست نماد مقاومت در برابر چالش‌هاست. زمانه‌ای برای دفاع از باورها و ایستادگی.',
      keywords: ['دفاع', 'ایستادگی', 'چالش', 'اعتماد']
    },
    reversed: {
      meaning: 'تسلیم، خستگی از مبارزه، یا فقدان اعتماد. ممکن است نشان‌دهنده رها کردن موضع باشد.',
      keywords: ['تسلیم', 'خستگی', 'فقدان اعتماد', 'رها کردن']
    },
    element: 'fire',
    astrology: 'مریخ در اسد'
  },
  {
    id: 'wands-08',
    nameEn: 'Eight of Wands',
    nameFa: 'هشت چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 8,
    imagePath: '/assets/tarot/cards/wands-08.webp',
    keywords: ['سرعت', 'حرکت', 'پیشرفت', 'ارتباط', 'خبر'],
    upright: {
      meaning: 'سرعت و حرکت. هشت چوبدست نماد پیشرفت سریع و ارتباطات است. زمانه‌ای برای اقدام سریع و دریافت خبرهای خوب.',
      keywords: ['سرعت', 'حرکت', 'پیشرفت', 'خبر']
    },
    reversed: {
      meaning: 'تأخیر، کندی، یا سوءتفاهم. ممکن است نشان‌دهنده مسدود شدن ارتباطات یا از دست دادن momentum باشد.',
      keywords: ['تأخیر', 'کندی', 'سوءتفاهم', 'مسدود شدن']
    },
    element: 'fire',
    astrology: 'عطارد در قوس'
  },
  {
    id: 'wands-09',
    nameEn: 'Nine of Wands',
    nameFa: 'نه چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 9,
    imagePath: '/assets/tarot/cards/wands-09.webp',
    keywords: ['استقامت', 'آمادگی', 'خستگی', 'دفاع', 'امید'],
    upright: {
      meaning: 'استقامت و آمادگی. نه چوبدست نماد مقاومت پس از چالش‌هاست. زمانه‌ای برای ادامه دادن با وجود خستگی.',
      keywords: ['استقامت', 'آمادگی', 'خستگی', 'امید']
    },
    reversed: {
      meaning: 'خستگی مفرط، تسلیم، یا از دست دادن امید. ممکن است نشان‌دهنده نیاز به استراحت و تجدید قوا باشد.',
      keywords: ['خستگی مفرط', 'تسلیم', 'از دست دادن امید', 'استراحت']
    },
    element: 'fire',
    astrology: 'ماه در قوس'
  },
  {
    id: 'wands-10',
    nameEn: 'Ten of Wands',
    nameFa: 'ده چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 10,
    imagePath: '/assets/tarot/cards/wands-10.webp',
    keywords: ['بار سنگین', 'مسئولیت', 'فشار', 'تعهد', 'پایان'],
    upright: {
      meaning: 'بار سنگین و مسئولیت. ده چوبدست نماد فشار و تعهد است. زمانه‌ای برای تحمل بار مسئولیت و نزدیک شدن به پایان.',
      keywords: ['بار سنگین', 'مسئولیت', 'فشار', 'تعهد']
    },
    reversed: {
      meaning: 'رهایی از بار، یا عدم توانایی در تحمل فشار. ممکن است نشان‌دهنده نیاز به رها کردن برخی مسئولیت‌ها باشد.',
      keywords: ['رهایی', 'عدم توانایی', 'رها کردن', 'سبک شدن']
    },
    element: 'fire',
    astrology: 'زحل در قوس'
  },
  {
    id: 'wands-11-page',
    nameEn: 'Page of Wands',
    nameFa: 'شاهزاده چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 11,
    imagePath: '/assets/tarot/cards/wands-11-page.webp',
    keywords: ['کاوش', 'اشتیاق', 'کشف', 'پیام', 'آغاز'],
    upright: {
      meaning: 'کاوش و اشتیاق. شاهزاده چوبدست نماد کشف و پیام است. زمانه‌ای برای شروع ماجراجویی و دنبال کردن اشتیاق.',
      keywords: ['کاوش', 'اشتیاق', 'کشف', 'پیام']
    },
    reversed: {
      meaning: 'ترس از ناشناخته، عدم تمرکز، یا اشتیاق سطحی. ممکن است نشان‌دهنده عدم تعهد به مسیر باشد.',
      keywords: ['ترس', 'عدم تمرکز', 'اشتیاق سطحی', 'عدم تعهد']
    },
    element: 'fire',
    astrology: 'آتش'
  },
  {
    id: 'wands-12-knight',
    nameEn: 'Knight of Wands',
    nameFa: 'شوالیه چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 12,
    imagePath: '/assets/tarot/cards/wands-12-knight.webp',
    keywords: ['اقدام', 'ماجراجویی', 'اشتیاق', 'جسارت', 'حرکت'],
    upright: {
      meaning: 'اقدام و ماجراجویی. شوالیه چوبدست نماد جسارت و حرکت است. زمانه‌ای برای اقدام سریع و دنبال کردن اشتیاق.',
      keywords: ['اقدام', 'ماجراجویی', 'اشتیاق', 'جسارت']
    },
    reversed: {
      meaning: 'بی‌احتیاطی، توقف، یا از دست دادن اشتیاق. ممکن است نشان‌دهنده اقدام شتابزده یا عدم تعهد باشد.',
      keywords: ['بی‌احتیاطی', 'توقف', 'از دست دادن اشتیاق', 'شتابزدگی']
    },
    element: 'fire',
    astrology: 'آتش'
  },
  {
    id: 'wands-13-queen',
    nameEn: 'Queen of Wands',
    nameFa: 'ملکه چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 13,
    imagePath: '/assets/tarot/cards/wands-13-queen.webp',
    keywords: ['جذابیت', 'اعتماد', 'خلق', 'استقلال', 'گرما'],
    upright: {
      meaning: 'جذابیت و اعتماد. ملکه چوبدست نماد خلاقیت و استقلال است. زمانه‌ای برای اعتماد به خود و ابراز وجود.',
      keywords: ['جذابیت', 'اعتماد', 'خلق', 'استقلال']
    },
    reversed: {
      meaning: 'عدم اعتماد، حسادت، یا از دست دادن خلاقیت. ممکن است نشان‌دهنده تردید در توانایی‌های خود باشد.',
      keywords: ['عدم اعتماد', 'حسادت', 'از دست دادن خلاقیت', 'تردید']
    },
    element: 'fire',
    astrology: 'آتش'
  },
  {
    id: 'wands-14-king',
    nameEn: 'King of Wands',
    nameFa: 'شاه چوبدست',
    arcana: 'minor',
    suit: 'wands',
    number: 14,
    imagePath: '/assets/tarot/cards/wands-14-king.webp',
    keywords: ['رهبری', 'چشم‌انداز', 'اقتدار', 'خلاقیت', 'کارآفرینی'],
    upright: {
      meaning: 'رهبری و چشم‌انداز. شاه چوبدست نماد اقتدار و کارآفرینی است. زمانه‌ای برای رهبری و تبدیل ایده به واقعیت.',
      keywords: ['رهبری', 'چشم‌انداز', 'اقتدار', 'کارآفرینی']
    },
    reversed: {
      meaning: 'استبداد، عدم انعطاف، یا سوءاستفاده از قدرت. ممکن است نشان‌دهنده رهبری ناکارآمد باشد.',
      keywords: ['استبداد', 'عدم انعطاف', 'سوءاستفاده', 'رهبری ناکارآمد']
    },
    element: 'fire',
    astrology: 'آتش'
  }
];