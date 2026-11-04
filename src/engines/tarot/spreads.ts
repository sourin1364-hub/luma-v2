import type { Spread } from './types';

export const SPREADS: Spread[] = [
  {
    id: 'daily-card',
    nameFa: 'کارت روزانه',
    description: 'یک کارت برای دریافت انرژی و پیام اصلی امروز.',
    cardCount: 1,
    positions: [
      { index: 0, nameFa: 'کارت روز', description: 'انرژی و پیام اصلی امروز برای شما' }
    ]
  },
  {
    id: 'weekly',
    nameFa: 'فال هفتگی',
    description: 'هفت کارت برای بررسی روند انرژی و رویدادهای ۷ روز پیش رو.',
    cardCount: 7,
    positions: [
      { index: 0, nameFa: 'شنبه (آغاز هفته)', description: 'انرژی شروع هفته و اولویت اصلی' },
      { index: 1, nameFa: 'یکشنبه', description: 'مسیر ارتباطات و جریان روز دوم' },
      { index: 2, nameFa: 'دوشنبه', description: 'احساسات درونی و فضای ذهنی' },
      { index: 3, nameFa: 'سه‌شنبه', description: 'اقدام، انگیزه و چالش میانه هفته' },
      { index: 4, nameFa: 'چهارشنبه', description: 'فرصت‌های شغلی، مالی و فکری' },
      { index: 5, nameFa: 'پنج‌شنبه', description: 'دستاوردها و جمع‌بندی کارهای هفته' },
      { index: 6, nameFa: 'جمعه (پایان هفته)', description: 'آرامش، روابط عاطفی و پیام پایانی هفته' }
    ]
  },
  {
    id: 'monthly',
    nameFa: 'فال ماهانه',
    description: 'چهار کارت برای تحلیل عمیق ۴ هفته پیش رو در ماه جاری.',
    cardCount: 4,
    positions: [
      { index: 0, nameFa: 'هفته اول', description: 'انرژی آغازین ماه و موضوع محوری هفته اول' },
      { index: 1, nameFa: 'هفته دوم', description: 'روند گسترش موضوعات و چالش‌های هفته دوم' },
      { index: 2, nameFa: 'هفته سوم', description: 'نقطه اوج تصمیم‌گیری و فرصت‌های هفته سوم' },
      { index: 3, nameFa: 'هفته چهارم', description: 'جمع‌بندی، ثمره تلاش‌ها و پیام پایانی ماه' }
    ]
  },
  {
    id: 'single-card',
    nameFa: 'تک‌کارتی (نیت مشخص)',
    description: 'یک کارت برای پاسخ مستقیم به یک پرسش مشخص.',
    cardCount: 1,
    positions: [
      { index: 0, nameFa: 'پاسخ', description: 'پاسخ یا راهنمایی مستقیم برای پرسش شما' }
    ]
  },
  {
    id: 'past-present-future',
    nameFa: 'گذشته، حال، آینده',
    description: 'سه کارت برای بررسی روند یک موقعیت در گذر زمان.',
    cardCount: 3,
    positions: [
      { index: 0, nameFa: 'گذشته', description: 'ریشه‌ها و عواملی که به وضعیت فعلی منجر شده‌اند' },
      { index: 1, nameFa: 'حال', description: 'وضعیت فعلی و انرژی حاکم بر زمان حال' },
      { index: 2, nameFa: 'آینده', description: 'جهت‌گیری و نتیجه احتمالی در آینده نزدیک' }
    ]
  },
  {
    id: 'situation-obstacle-advice',
    nameFa: 'وضعیت، مانع، راهکار',
    description: 'سه کارت برای شناخت وضعیت، مانع پنهان و راه پیشنهادی.',
    cardCount: 3,
    positions: [
      { index: 0, nameFa: 'وضعیت', description: 'وضعیت فعلی و انرژی حاکم' },
      { index: 1, nameFa: 'مانع', description: 'مانع یا چالشی که باید برطرف شود' },
      { index: 2, nameFa: 'راهکار', description: 'راه پیشنهادی و اقدام مناسب' }
    ]
  },
  {
    id: 'mind-heart-action',
    nameFa: 'ذهن، احساس، عمل',
    description: 'سه کارت برای بررسی تعادل بین فکر، احساس و عمل.',
    cardCount: 3,
    positions: [
      { index: 0, nameFa: 'ذهن', description: 'آنچه در ذهن می‌گذرد و منطق موقعیت' },
      { index: 1, nameFa: 'احساس', description: 'احساسات و وضعیت عاطفی' },
      { index: 2, nameFa: 'عمل', description: 'اقدام پیشنهادی و رفتار مناسب' }
    ]
  },
  {
    id: 'yes-no',
    nameFa: 'بله یا خیر',
    description: 'یک کارت برای پاسخ سریع به یک پرسش بله یا خیر.',
    cardCount: 1,
    positions: [
      { index: 0, nameFa: 'پاسخ', description: 'پاسخ کوتاه: بله، خیر یا نیازمند صبر' }
    ]
  },
  {
    id: 'relationship',
    nameFa: 'رابطه عاطفی و عشق',
    description: 'پنج کارت برای بررسی احساس واقعی، موانع و آینده رابطه.',
    cardCount: 5,
    positions: [
      { index: 0, nameFa: 'شما', description: 'احساسات و نگرش شما در رابطه' },
      { index: 1, nameFa: 'طرف مقابل', description: 'احساسات و نیت واقعی طرف مقابل' },
      { index: 2, nameFa: 'رابطه فعلی', description: 'وضعیت فعلی رابطه و انرژی مشترک' },
      { index: 3, nameFa: 'مانع', description: 'چالش یا مانع اصلی رابطه' },
      { index: 4, nameFa: 'آینده رابطه', description: 'جهت‌گیری و نتیجه احتمالی رابطه' }
    ]
  },
  {
    id: 'career',
    nameFa: 'مسیر شغلی و مالی',
    description: 'پنج کارت برای بررسی وضعیت شغلی، فرصت‌های مالی و موفقیت.',
    cardCount: 5,
    positions: [
      { index: 0, nameFa: 'وضعیت فعلی', description: 'وضعیت فعلی شغل و جریان مالی' },
      { index: 1, nameFa: 'مهارت‌ها و نقاط قوت', description: 'نقاط قوت و استعدادهای شما' },
      { index: 2, nameFa: 'مانع موفقیت', description: 'چالش یا مانعی که باید برطرف شود' },
      { index: 3, nameFa: 'فرصت پیش رو', description: 'فرصت‌های درآمدی و امکانات تازه' },
      { index: 4, nameFa: 'نتیجه و دستاورد', description: 'نتیجه احتمالی و پیام اصلی شغلی' }
    ]
  },
  {
    id: 'horseshoe',
    nameFa: 'نعل اسب',
    description: 'هفت کارت برای بررسی روند یک تصمیم مهم از گذشته تا نتیجه.',
    cardCount: 7,
    positions: [
      { index: 0, nameFa: 'گذشته', description: 'ریشه‌ها و عواملی که به وضعیت فعلی منجر شده' },
      { index: 1, nameFa: 'حال', description: 'وضعیت فعلی و انرژی حاکم' },
      { index: 2, nameFa: 'مانع', description: 'چالش یا مانعی که باید برطرف شود' },
      { index: 3, nameFa: 'راهکار', description: 'راه پیشنهادی و اقدام مناسب' },
      { index: 4, nameFa: 'محیط و اطرافیان', description: 'تأثیر دیگران و محیط بر موقعیت' },
      { index: 5, nameFa: 'آینده نزدیک', description: 'جهت‌گیری و گام بعدی' },
      { index: 6, nameFa: 'نتیجه نهایی', description: 'نتیجه نهایی و پیام اصلی' }
    ]
  },
  {
    id: 'celtic-cross',
    nameFa: 'صلیب سلتیک',
    description: 'جامع‌ترین چیدمان تاروت با ۱۰ کارت برای تحلیل عمیق زندگی.',
    cardCount: 10,
    positions: [
      { index: 0, nameFa: 'وضعیت فعلی', description: 'وضعیت فعلی و انرژی حاکم بر موقعیت' },
      { index: 1, nameFa: 'مانع متقاطع', description: 'چالشی که بر وضعیت تأثیر می‌گذارد' },
      { index: 2, nameFa: 'ریشه و ناخودآگاه', description: 'ریشه‌ها و عواملی که به وضعیت فعلی منجر شده' },
      { index: 3, nameFa: 'گذشته نزدیک', description: 'رویدادهای اخیری که به تازگی رخ داده‌اند' },
      { index: 4, nameFa: 'هدف و آرمان', description: 'بهترین نتیجه‌ای که در آستانه آن هستید' },
      { index: 5, nameFa: 'آینده نزدیک', description: 'جهت‌گیری و رویداد پیش رو' },
      { index: 6, nameFa: 'نگرش درونی شما', description: 'نگرش و نقش شما در موقعیت' },
      { index: 7, nameFa: 'محیط پیرامون', description: 'تأثیر دیگران و محیط بر موقعیت' },
      { index: 8, nameFa: 'امیدها و ترس‌ها', description: 'امیدها و ترس‌های پنهان شما' },
      { index: 9, nameFa: 'نتیجه نهایی', description: 'نتیجه نهایی و سرانجام مسیر' }
    ]
  },
  {
    id: 'yearly',
    nameFa: 'چیدمان سالانه (۱۲ ماه)',
    description: 'دوازده کارت برای بررسی انرژی و پیام هر ماه از سال.',
    cardCount: 12,
    positions: [
      { index: 0, nameFa: 'فروردین', description: 'انرژی و پیام ماه فروردین' },
      { index: 1, nameFa: 'اردیبهشت', description: 'انرژی و پیام ماه اردیبهشت' },
      { index: 2, nameFa: 'خرداد', description: 'انرژی و پیام ماه خرداد' },
      { index: 3, nameFa: 'تیر', description: 'انرژی و پیام ماه تیر' },
      { index: 4, nameFa: 'مرداد', description: 'انرژی و پیام ماه مرداد' },
      { index: 5, nameFa: 'شهریور', description: 'انرژی و پیام ماه شهریور' },
      { index: 6, nameFa: 'مهر', description: 'انرژی و پیام ماه مهر' },
      { index: 7, nameFa: 'آبان', description: 'انرژی و پیام ماه آبان' },
      { index: 8, nameFa: 'آذر', description: 'انرژی و پیام ماه آذر' },
      { index: 9, nameFa: 'دی', description: 'انرژی و پیام ماه دی' },
      { index: 10, nameFa: 'بهمن', description: 'انرژی و پیام ماه بهمن' },
      { index: 11, nameFa: 'اسفند', description: 'انرژی و پیام ماه اسفند' }
    ]
  }
];

export function getSpreadById(id: string): Spread | undefined {
  return SPREADS.find((s) => s.id === id);
}

export function getAllSpreads(): Spread[] {
  return [...SPREADS];
}
