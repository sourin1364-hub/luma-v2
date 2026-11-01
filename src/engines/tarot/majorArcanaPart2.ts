import type { TarotCard } from './types';

export const MAJOR_ARCANA_PART_2: TarotCard[] = [
  {
    id: 'major-12-hanged-man',
    nameEn: 'The Hanged Man',
    nameFa: 'معلق',
    arcana: 'major',
    suit: 'major',
    number: 12,
    imagePath: '/assets/tarot/cards/major-12-hanged-man.webp',
    keywords: ['تسلیم', 'تعلیق', 'دیدگاه جدید', 'فداکاری', 'صبر'],
    upright: {
      meaning: 'تسلیم، تعلیق و دیدگاه جدید. معلق نماد رها کردن کنترل و دیدن از زاویه‌ای متفاوت است. زمانه‌ای برای صبر، تأمل و پذیرش.',
      keywords: ['تسلیم', 'دیدگاه جدید', 'صبر', 'فداکاری']
    },
    reversed: {
      meaning: 'مقاومت، تعلل، یا فداکاری بی‌ثمر. ممکن است نشان‌دهنده امتناع از رها کردن یا گیر افتادن در وضعیت باشد.',
      keywords: ['مقاومت', 'تعلل', 'گیر افتادن', 'فداکاری بی‌ثمر']
    },
    element: 'water',
    planet: 'نپتون',
    astrology: 'نپتون'
  },
  {
    id: 'major-13-death',
    nameEn: 'Death',
    nameFa: 'مرگ',
    arcana: 'major',
    suit: 'major',
    number: 13,
    imagePath: '/assets/tarot/cards/major-13-death.webp',
    keywords: ['پایان', 'دگردیسی', 'تحول', 'رهایی', 'آغاز نو'],
    upright: {
      meaning: 'پایان یک چرخه و آغاز چرخه‌ای نو. مرگ نماد دگردیسی و تحول عمیق است. زمانه‌ای برای رها کردن گذشته و پذیرش تغییر.',
      keywords: ['پایان', 'تحول', 'دگردیسی', 'آغاز نو']
    },
    reversed: {
      meaning: 'مقاومت در برابر تغییر، ترس از پایان، یا توقف. ممکن است نشان‌دهنده چسبیدن به گذشته یا عدم پذیرش تحول باشد.',
      keywords: ['مقاومت', 'ترس', 'توقف', 'چسبیدن به گذشته']
    },
    element: 'water',
    planet: 'پلوتو',
    astrology: 'پلوتو'
  },
  {
    id: 'major-14-temperance',
    nameEn: 'Temperance',
    nameFa: 'میانه‌روی',
    arcana: 'major',
    suit: 'major',
    number: 14,
    imagePath: '/assets/tarot/cards/major-14-temperance.webp',
    keywords: ['تعادل', 'هماهنگی', 'صبر', 'ترکیب', 'شفا'],
    upright: {
      meaning: 'تعادل، هماهنگی و شفا. میانه‌روی نماد ترکیب متضادها و یافتن راه میانه است. زمانه‌ای برای صبر، تعادل و بهبود.',
      keywords: ['تعادل', 'هماهنگی', 'شفا', 'ترکیب']
    },
    reversed: {
      meaning: 'عدم تعادل، افراط، یا ناهماهنگی. ممکن است نشان‌دهنده بی‌صبری یا عدم پذیرش تفاوت‌ها باشد.',
      keywords: ['عدم تعادل', 'افراط', 'ناهماهنگی', 'بی‌صبری']
    },
    element: 'fire',
    planet: 'مشتری',
    astrology: 'مشتری'
  },
  {
    id: 'major-15-devil',
    nameEn: 'The Devil',
    nameFa: 'شیطان',
    arcana: 'major',
    suit: 'major',
    number: 15,
    imagePath: '/assets/tarot/cards/major-15-devil.webp',
    keywords: ['وابستگی', 'وسوسه', 'قید', 'سایه', 'مادی‌گرایی'],
    upright: {
      meaning: 'وابستگی، وسوسه و قید. شیطان نماد سایه و مادی‌گرایی است. زمانه‌ای برای شناخت محدودیت‌های خودساخته و رهایی از آن‌ها.',
      keywords: ['وابستگی', 'وسوسه', 'قید', 'سایه']
    },
    reversed: {
      meaning: 'رهایی از وابستگی، آگاهی از قید، یا غلبه بر وسوسه. ممکن است نشان‌دهنده آزاد شدن از الگوهای ناسالم باشد.',
      keywords: ['رهایی', 'آگاهی', 'غلبه', 'آزادی']
    },
    element: 'earth',
    planet: 'زحل',
    astrology: 'زحل'
  },
  {
    id: 'major-16-tower',
    nameEn: 'The Tower',
    nameFa: 'برج',
    arcana: 'major',
    suit: 'major',
    number: 16,
    imagePath: '/assets/tarot/cards/major-16-tower.webp',
    keywords: ['فروپاشی', 'آشوب', 'آزادسازی', 'فاش شدن', 'تغییر ناگهانی'],
    upright: {
      meaning: 'فروپاشی ناگهانی و آشوب. برج نماد فروریختن ساختارهای قدیمی و آزادسازی است. زمانه‌ای برای پذیرش تغییرات ناگهانی و بازسازی.',
      keywords: ['فروپاشی', 'آشوب', 'آزادسازی', 'تغییر ناگهانی']
    },
    reversed: {
      meaning: 'اجتناب از فاجعه، ترس از تغییر، یا فروپاشی تدریجی. ممکن است نشان‌دهنده مقاومت در برابر تحول ضروری باشد.',
      keywords: ['اجتناب', 'ترس', 'مقاومت', 'فروپاشی تدریجی']
    },
    element: 'fire',
    planet: 'مریخ',
    astrology: 'مریخ'
  },
  {
    id: 'major-17-star',
    nameEn: 'The Star',
    nameFa: 'ستاره',
    arcana: 'major',
    suit: 'major',
    number: 17,
    imagePath: '/assets/tarot/cards/major-17-star.webp',
    keywords: ['امید', 'الهام', 'شفا', 'ایمان', 'آرامش'],
    upright: {
      meaning: 'امید، الهام و شفا. ستاره نماد ایمان و آرامش پس از طوفان است. زمانه‌ای برای امیدواری، الهام گرفتن و اعتماد به آینده.',
      keywords: ['امید', 'الهام', 'شفا', 'ایمان']
    },
    reversed: {
      meaning: 'ناامیدی، فقدان ایمان، یا قطع ارتباط با الهام. ممکن است نشان‌دهنده تردید یا از دست دادن امید باشد.',
      keywords: ['ناامیدی', 'فقدان ایمان', 'تردید', 'قطع الهام']
    },
    element: 'air',
    planet: 'اورانوس',
    astrology: 'اورانوس'
  },
  {
    id: 'major-18-moon',
    nameEn: 'The Moon',
    nameFa: 'ماه',
    arcana: 'major',
    suit: 'major',
    number: 18,
    imagePath: '/assets/tarot/cards/major-18-moon.webp',
    keywords: ['توهم', 'ترس', 'ناخودآگاه', 'شهود', 'ابهام'],
    upright: {
      meaning: 'توهم، ترس و ناخودآگاه. ماه نماد ابهام و شهود است. زمانه‌ای برای مواجهه با ترس‌ها و گوش دادن به ناخودآگاه.',
      keywords: ['توهم', 'ترس', 'ناخودآگاه', 'شهود']
    },
    reversed: {
      meaning: 'روشن شدن ابهام، غلبه بر ترس، یا رهایی از توهم. ممکن است نشان‌دهنده آشکار شدن حقیقت باشد.',
      keywords: ['روشن شدن', 'غلبه بر ترس', 'رهایی', 'حقیقت']
    },
    element: 'water',
    planet: 'نپتون',
    astrology: 'نپتون'
  },
  {
    id: 'major-19-sun',
    nameEn: 'The Sun',
    nameFa: 'خورشید',
    arcana: 'major',
    suit: 'major',
    number: 19,
    imagePath: '/assets/tarot/cards/major-19-sun.webp',
    keywords: ['شادی', 'موفقیت', 'وضوح', 'انرژی', 'آگاهی'],
    upright: {
      meaning: 'شادی، موفقیت و وضوح. خورشید نماد آگاهی و انرژی مثبت است. زمانه‌ای برای خوش‌بینی، موفقیت و روشنایی.',
      keywords: ['شادی', 'موفقیت', 'وضوح', 'انرژی']
    },
    reversed: {
      meaning: 'شادی سطحی، تردید، یا فقدان وضوح. ممکن است نشان‌دهنده ابرهای موقت در آسمان صاف باشد.',
      keywords: ['شادی سطحی', 'تردید', 'فقدان وضوح', 'ابرهای موقت']
    },
    element: 'fire',
    planet: 'خورشید',
    astrology: 'خورشید'
  },
  {
    id: 'major-20-judgement',
    nameEn: 'Judgement',
    nameFa: 'داوری',
    arcana: 'major',
    suit: 'major',
    number: 20,
    imagePath: '/assets/tarot/cards/major-20-judgement.webp',
    keywords: ['بیداری', 'داوری', 'رستاخیز', 'بازنگری', 'فراخوانی'],
    upright: {
      meaning: 'بیداری، داوری و رستاخیز. داوری نماد بازنگری و فراخوانی به سوی هدفی بالاتر است. زمانه‌ای برای پذیرش گذشته و حرکت به جلو.',
      keywords: ['بیداری', 'داوری', 'رستاخیز', 'بازنگری']
    },
    reversed: {
      meaning: 'ترس از داوری، انکار گذشته، یا عدم پذیرش فراخوانی. ممکن است نشان‌دهنده تردید یا سرکوب آگاهی باشد.',
      keywords: ['ترس', 'انکار', 'تردید', 'سرکوب']
    },
    element: 'fire',
    planet: 'پلوتو',
    astrology: 'پلوتو'
  },
  {
    id: 'major-21-world',
    nameEn: 'The World',
    nameFa: 'جهان',
    arcana: 'major',
    suit: 'major',
    number: 21,
    imagePath: '/assets/tarot/cards/major-21-world.webp',
    keywords: ['تکمیل', 'کمال', 'یکپارچگی', 'موفقیت', 'سفر'],
    upright: {
      meaning: 'تکمیل، کمال و یکپارچگی. جهان نماد پایان یک چرخه و موفقیت است. زمانه‌ای برای جشن گرفتن دستاوردها و آماده شدن برای سفر جدید.',
      keywords: ['تکمیل', 'کمال', 'یکپارچگی', 'موفقیت']
    },
    reversed: {
      meaning: 'عدم تکمیل، توقف، یا فقدان بستن چرخه. ممکن است نشان‌دهنده نیاز به تکمیل یک مرحله قبل از حرکت باشد.',
      keywords: ['عدم تکمیل', 'توقف', 'چرخه ناتمام', 'نیاز به بستن']
    },
    element: 'earth',
    planet: 'زحل',
    astrology: 'زحل'
  }
];