import type { JalaaliDate } from '../calendar/types';
import { jalaaliToGregorian } from '../calendar/jalaali';
import { ZODIAC_SIGNS } from '../astronomy/constants';
import type { ZodiacSignName } from '../astronomy/types';
import { BIRTHSTONES } from '../birthstone';
import type { BirthstoneDetail } from '../birthstone/data';

/**
 * محاسبه برج زودیاک از تاریخ شمسی تولد
 * بر اساس ماه و روز میلادی
 */
export function getZodiacFromBirthDate(birthDate: JalaaliDate): {
  sign: ZodiacSignName;
  signFa: string;
  signEn: string;
  signDegree: number;
  dateRange: string;
  element: string;
  elementFa: string;
} {
  const g = jalaaliToGregorian(birthDate);
  const month = g.month;
  const day = g.day;

  // تعیین برج بر اساس ماه و روز میلادی
  let signName: ZodiacSignName;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    signName = 'aries';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    signName = 'taurus';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    signName = 'gemini';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    signName = 'cancer';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    signName = 'leo';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    signName = 'virgo';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    signName = 'libra';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    signName = 'scorpio';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    signName = 'sagittarius';
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    signName = 'capricorn';
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    signName = 'aquarius';
  } else {
    signName = 'pisces';
  }

  const signData = ZODIAC_SIGNS.find(s => s.name === signName);
  if (!signData) {
    throw new Error('Zodiac sign not found: ' + signName);
  }

  return {
    sign: signName,
    signFa: signData.nameFa,
    signEn: signName,
    signDegree: 0,
    dateRange: getZodiacDateRange(signName),
    element: signData.element,
    elementFa: getElementFa(signData.element)
  };
}

/**
 * محاسبه سنگ ماه تولد از تاریخ شمسی
 * بر اساس ماه میلادی
 */
export function getBirthstoneFromBirthDate(birthDate: JalaaliDate): BirthstoneDetail {
  const g = jalaaliToGregorian(birthDate);
  const month = g.month;
  const stone = BIRTHSTONES.find(b => b.month === month);
  if (!stone) {
    throw new Error('Birthstone not found for month: ' + month);
  }
  return stone;
}

function getZodiacDateRange(signName: ZodiacSignName): string {
  const ranges: Record<ZodiacSignName, string> = {
    aries: '۲۱ مارس – ۱۹ آوریل',
    taurus: '۲۰ آوریل – ۲۰ می',
    gemini: '۲۱ می – ۲۰ ژوئن',
    cancer: '۲۱ ژوئن – ۲۲ جولای',
    leo: '۲۳ جولای – ۲۲ آگوست',
    virgo: '۲۳ آگوست – ۲۲ سپتامبر',
    libra: '۲۳ سپتامبر – ۲۲ اکتبر',
    scorpio: '۲۳ اکتبر – ۲۱ نوامبر',
    sagittarius: '۲۲ نوامبر – ۲۱ دسامبر',
    capricorn: '۲۲ دسامبر – ۱۹ ژانویه',
    aquarius: '۲۰ ژانویه – ۱۸ فوریه',
    pisces: '۱۹ فوریه – ۲۰ مارس'
  };
  return ranges[signName];
}

function getElementFa(element: string): string {
  const map: Record<string, string> = {
    fire: 'آتش', earth: 'خاک', air: 'هوا', water: 'آب'
  };
  return map[element] || element;
}