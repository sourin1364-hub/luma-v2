import type { Spread } from './types';

export const SPREADS: Spread[] = [
  {
    id: 'daily-card',
    nameFa: 'کارت روزانه',
    description: 'یک کارت برای انرژی و پیام امروز.',
    cardCount: 1,
    positions: [
      { index: 0, nameFa: 'کارت روز', description: 'انرژی و پیام اصلی امروز' }
    ]
  },
  {
    id: 'single-card',
    nameFa: 'تک‌کارتی',
    description: 'یک کارت برای پاسخ به یک پرسش مشخص.',
    cardCount: 1,
    positions: [
      { index: 0, nameFa: 'پاسخ', description: 'پاسخ یا راهنمایی برای پرسش شما' }
    ]
  },
  {
    id: 'past-present-future',
    nameFa: 'گذشته، حال، آینده',
    description: 'سه کارت برای بررسی روند یک موقعیت در زمان.',
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
    description: 'سه کارت برای شناخت وضعیت، مانع و راه پیشنهادی.',
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
    description: 'یک کارت برای پاسخ سریع به یک پرسش بله/خیر.',
    cardCount: 1,
    positions: [
      { index: 0, nameFa: 'پاسخ', description: 'پاسخ کوتاه: بله، خیر یا شاید' }
    ]
  },
  {
    id: 'celtic-cross',
    nameFa: 'صلیب سلتیک',
    description: 'جامع‌ترین چیدمان تاروت با ۱۰ کارت برای تحلیل عمیق یک موقعیت.',
    cardCount: 10,
    positions: [
      { index: 0, nameFa: 'وضعیت فعلی', description: 'وضعیت فعلی و انرژی حاکم بر موقعیت' },
      { index: 1, nameFa: 'مانع', description: 'چالشی که بر وضعیت تأثیر می‌گذارد' },
      { index: 2, nameFa: 'گذشته', description: 'ریشه‌ها و عواملی که به وضعیت فعلی منجر شده' },
      { index: 3, nameFa: 'آینده', description: 'جهت‌گیری و نتیجه احتمالی' },
      { index: 4, nameFa: 'هدف', description: 'هدف یا نتیجه‌ای که در آستانه آن هستید' },
      { index: 5, nameFa: 'گذشته نزدیک', description: 'رویدادهای اخیر که تأثیرگذار بوده‌اند' },
      { index: 6, nameFa: 'خود', description: 'نگرش و نقش شما در موقعیت' },
      { index: 7, nameFa: 'محیط', description: 'تأثیر دیگران و محیط بر موقعیت' },
      { index: 8, nameFa: 'امیدها و ترس‌ها', description: 'امیدها و ترس‌های شما درباره موقعیت' },
      { index: 9, nameFa: 'نتیجه نهایی', description: 'نتیجه نهایی و پیام اصلی' }
    ]
  },
  {
    id: 'horseshoe',
    nameFa: 'نعل اسب',
    description: 'هفت کارت برای بررسی روند یک موقعیت از گذشته تا نتیجه.',
    cardCount: 7,
    positions: [
      { index: 0, nameFa: 'گذشته', description: 'ریشه‌ها و عواملی که به وضعیت فعلی منجر شده' },
      { index: 1, nameFa: 'حال', description: 'وضعیت فعلی و انرژی حاکم' },
      { index: 2, nameFa: 'مانع', description: 'چالش یا مانعی که باید برطرف شود' },
      { index: 3, nameFa: 'راهکار', description: 'راه پیشنهادی و اقدام مناسب' },
      { index: 4, nameFa: 'محیط', description: 'تأثیر دیگران و محیط بر موقعیت' },
      { index: 5, nameFa: 'آینده نزدیک', description: 'جهت‌گیری و نتیجه احتمالی' },
      { index: 6, nameFa: 'نتیجه نهایی', description: 'نتیجه نهایی و پیام اصلی' }
    ]
  },
  {
    id: 'relationship',
    nameFa: 'رابطه عاطفی',
    description: 'پنج کارت برای بررسی وضعیت یک رابطه عاطفی.',
    cardCount: 5,
    positions: [
      { index: 0, nameFa: 'شما', description: 'احساسات و نگرش شما در رابطه' },
      { index: 1, nameFa: 'طرف مقابل', description: 'احساسات و نگرش طرف مقابل' },
      { index: 2, nameFa: 'رابطه فعلی', description: 'وضعیت فعلی رابطه و انرژی حاکم' },
      { index: 3, nameFa: 'مانع', description: 'چالش یا مانع رابطه' },
      { index: 4, nameFa: 'آینده رابطه', description: 'جهت‌گیری و نتیجه احتمالی رابطه' }
    ]
  },
  {
    id: 'career',
    nameFa: 'مسیر شغلی',
    description: 'پنج کارت برای بررسی وضعیت شغلی و مسیر حرفه‌ای.',
    cardCount: 5,
    positions: [
      { index: 0, nameFa: 'وضعیت شغلی فعلی', description: 'وضعیت فعلی شغل و انرژی حاکم' },
      { index: 1, nameFa: 'مهارت‌ها', description: 'نقاط قوت و مهارت‌های شما' },
      { index: 2, nameFa: 'مانع', description: 'چالش یا مانعی که باید برطرف شود' },
      { index: 3, nameFa: 'فرصت', description: 'فرصت‌ها و امکانات پیش رو' },
      { index: 4, nameFa: 'نتیجه', description: 'نتیجه احتمالی و پیام اصلی' }
    ]
  },
  {
    id: 'yearly',
    nameFa: 'چیدمان سالانه',
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