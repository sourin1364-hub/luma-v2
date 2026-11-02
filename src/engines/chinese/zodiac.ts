import type {
  ChineseAnimal,
  ChineseElement,
  ChineseZodiacResult
} from './types';
import {
  CHINESE_ANIMALS,
  CHINESE_ELEMENTS,
  CHINESE_NEW_YEAR_DATES
} from './constants';

const ANIMAL_ORDER: ChineseAnimal[] = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'
];

const ELEMENT_ORDER: ChineseElement[] = [
  'wood', 'fire', 'earth', 'metal', 'water'
];

/**
 * تعیین سال چینی بر اساس تاریخ میلادی.
 * اگر تاریخ قبل از سال نو چینی باشد، سال چینی = سال میلادی - 1
 */
export function getChineseYear(gregorianYear: number, gregorianMonth: number, gregorianDay: number): number {
  const newYearStr = CHINESE_NEW_YEAR_DATES[gregorianYear];
  if (!newYearStr) {
    // اگر تاریخ سال نو موجود نبود، فرض می‌کنیم بعد از فوریه است
    return gregorianMonth > 2 ? gregorianYear : gregorianYear - 1;
  }
  const [, nm, nd] = newYearStr.split('-').map(Number);
  const isBeforeNewYear =
    gregorianMonth < nm ||
    (gregorianMonth === nm && gregorianDay < nd);
  return isBeforeNewYear ? gregorianYear - 1 : gregorianYear;
}

/**
 * تعیین حیوان چینی بر اساس سال چینی.
 */
export function getAnimal(chineseYear: number): ChineseAnimal {
  const index = ((chineseYear - 4) % 12 + 12) % 12;
  return ANIMAL_ORDER[index];
}

/**
 * تعیین عنصر چینی بر اساس سال چینی.
 */
export function getElement(chineseYear: number): ChineseElement {
  const index = Math.floor((((chineseYear - 4) % 10) + 10) % 10 / 2);
  return ELEMENT_ORDER[index];
}

/**
 * محاسبه کامل زودیاک چینی از تاریخ تولد میلادی.
 */
export function calculateChineseZodiac(
  year: number,
  month: number,
  day: number
): ChineseZodiacResult {
  const chineseYear = getChineseYear(year, month, day);
  const animal = getAnimal(chineseYear);
  const element = getElement(chineseYear);

  const animalInfo = CHINESE_ANIMALS.find(a => a.animal === animal);
  const elementInfo = CHINESE_ELEMENTS.find(e => e.element === element);

  if (!animalInfo || !elementInfo) {
    throw new Error('Chinese zodiac data not found');
  }

  const newYearDate = CHINESE_NEW_YEAR_DATES[year] || '';
  const combinedName = animalInfo.nameFa + ' ' + elementInfo.nameFa;

  return {
    animal,
    animalInfo,
    element,
    elementInfo,
    year,
    chineseYear,
    newYearDate,
    combinedName
  };
}