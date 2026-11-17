import { CHINESE_NEW_YEAR_DATES, CHINESE_ANIMALS, CHINESE_ELEMENTS } from './constants';
import type { ChineseZodiacResult } from './types';

export function calculateChineseZodiac(gregorianYear: number, gregorianMonth: number, gregorianDay: number): ChineseZodiacResult {
  const newYearData = CHINESE_NEW_YEAR_DATES[gregorianYear] || [2, 10];
  const [nm, nd] = Array.isArray(newYearData) ? newYearData : [2, 10];

  let effectiveYear = gregorianYear;
  if (gregorianMonth < nm || (gregorianMonth === nm && gregorianDay < nd)) {
    effectiveYear = gregorianYear - 1;
  }

  const animalIndex = ((effectiveYear - 4) % 12 + 12) % 12;
  const animal = CHINESE_ANIMALS[animalIndex] || CHINESE_ANIMALS[0];

  const elementIndex = Math.floor((((effectiveYear - 4) % 10 + 10) % 10) / 2);
  const element = CHINESE_ELEMENTS[elementIndex] || CHINESE_ELEMENTS[0];

  const formattedDate = `${gregorianYear}-${String(nm).padStart(2, '0')}-${String(nd).padStart(2, '0')}`;

  return {
    animal,
    element,
    polarity: effectiveYear % 2 === 0 ? 'yang' : 'yin',
    effectiveYear,
    newYearDate: formattedDate,
    keywords: [...animal.keywords, ...element.keywords],
    summary: `${animal.nameFa} ${element.nameFa} (${effectiveYear})`,
  } as unknown as ChineseZodiacResult;
}
