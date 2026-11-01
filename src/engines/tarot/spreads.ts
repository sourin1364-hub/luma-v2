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
  }
];

export function getSpreadById(id: string): Spread | undefined {
  return SPREADS.find((s) => s.id === id);
}

export function getAllSpreads(): Spread[] {
  return [...SPREADS];
}