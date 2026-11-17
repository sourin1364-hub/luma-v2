// src/engines/numerology/wealthCode.ts

/* ===========================================================
   رمز کارت ثروت (Wealth Code) — v1.0
   مبنا: ابجد کبیر + فیثاغورثی + سیاره روز هفته + ریشه سال
   =========================================================== */

const ABJAD_KABIR: Record<string, number> = {
  'ا': 1, 'آ': 1, 'أ': 1, 'إ': 1, 'ب': 2, 'پ': 2, 'ج': 3, 'چ': 3,
  'د': 4, 'ه': 5, 'ة': 5, 'و': 6, 'ؤ': 6, 'ز': 7, 'ژ': 7, 'ح': 8,
  'خ': 600, 'ط': 9, 'ظ': 900, 'ی': 10, 'ي': 10, 'ئ': 10, 'ک': 20,
  'ك': 20, 'گ': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ص': 90,
  'ع': 70, 'ف': 80, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500,
  'ذ': 700, 'ض': 800, 'غ': 1000,
};

const PYTHAGOREAN: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

const WEEKDAY_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const PLANET_VALUES: Record<string, number> = {
  Sun: 1, Moon: 2, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 6, Saturn: 8,
};
const PLANET_I18N_KEY: Record<string, string> = {
  Sun: 'wealth_planet_sun', Moon: 'wealth_planet_moon', Mars: 'wealth_planet_mars',
  Mercury: 'wealth_planet_mercury', Jupiter: 'wealth_planet_jupiter',
  Venus: 'wealth_planet_venus', Saturn: 'wealth_planet_saturn',
};
const WEEKDAY_I18N_KEY = [
  'wealth_weekday_sunday', 'wealth_weekday_monday', 'wealth_weekday_tuesday',
  'wealth_weekday_wednesday', 'wealth_weekday_thursday', 'wealth_weekday_friday',
  'wealth_weekday_saturday',
];

const WEALTH_BY_DIGIT: Record<number, { planetKey: string; colorKey: string; dayKey: string }> = {
  1: { planetKey: 'wealth_planet_sun',     colorKey: 'wealth_color_gold',   dayKey: 'wealth_weekday_sunday' },
  2: { planetKey: 'wealth_planet_moon',    colorKey: 'wealth_color_silver', dayKey: 'wealth_weekday_monday' },
  3: { planetKey: 'wealth_planet_jupiter', colorKey: 'wealth_color_purple', dayKey: 'wealth_weekday_thursday' },
  4: { planetKey: 'wealth_planet_rahu',    colorKey: 'wealth_color_smoky',  dayKey: 'wealth_weekday_saturday' },
  5: { planetKey: 'wealth_planet_mercury', colorKey: 'wealth_color_green',  dayKey: 'wealth_weekday_wednesday' },
  6: { planetKey: 'wealth_planet_venus',   colorKey: 'wealth_color_pink',   dayKey: 'wealth_weekday_friday' },
  7: { planetKey: 'wealth_planet_neptune', colorKey: 'wealth_color_blue',   dayKey: 'wealth_weekday_monday' },
  8: { planetKey: 'wealth_planet_saturn',  colorKey: 'wealth_color_black',  dayKey: 'wealth_weekday_saturday' },
  9: { planetKey: 'wealth_planet_mars',    colorKey: 'wealth_color_red',    dayKey: 'wealth_weekday_tuesday' },
};

function normalize(str: string): string {
  return str
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[أإآ]/g, 'ا')
    .replace(/\s+/g, '')
    .trim();
}

export function abjadKabir(str: string): number {
  const s = normalize(str);
  let sum = 0;
  for (const ch of s) {
    sum += ABJAD_KABIR[ch] || 0;
  }
  return sum;
}

export function pythagorean(str: string): number {
  const s = str.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;
  for (const ch of s) {
    sum += PYTHAGOREAN[ch] || 0;
  }
  return sum;
}

export function digitalRoot(n: number): number {
  if (n <= 0) return 1;
  const r = n % 9;
  return r === 0 ? 9 : r;
}

export interface WealthBreakdown {
  name: { abjad: number; pythagorean: number; combined: number; digit: number };
  mother: { abjad: number; pythagorean: number; combined: number; digit: number };
  day: { day: number; weekdayKey: string; planetKey: string; planetValue: number; digit: number };
  month: { month: number; yearRoot: number; digit: number };
}

export interface WealthCodeResult {
  code: string;
  digits: [number, number, number, number];
  breakdown: WealthBreakdown;
  totalRoot: number;
  planetKey: string;
  colorKey: string;
  luckyDayKey: string;
  themeKeys: [string, string, string, string];
}

export interface WealthCodeInput {
  fullName: string;
  motherName: string;
  birthDate: { year: number; month: number; day: number };
}

export function computeWealthCode(input: WealthCodeInput): WealthCodeResult {
  const { fullName, motherName, birthDate } = input;

  const nameAbjad = abjadKabir(fullName);
  const namePyth = pythagorean(fullName);
  const nameCombined = nameAbjad + namePyth;
  const nameDigit = digitalRoot(nameCombined);

  const motherAbjad = abjadKabir(motherName);
  const motherPyth = pythagorean(motherName);
  const motherCombined = motherAbjad + motherPyth;
  const motherDigit = digitalRoot(motherCombined);

  const jsDate = new Date(birthDate.year, birthDate.month - 1, birthDate.day);
  const dow = jsDate.getDay();
  const planetKey = WEEKDAY_PLANETS[dow];
  const planetValue = PLANET_VALUES[planetKey];
  const dayDigit = digitalRoot(birthDate.day + planetValue);

  const yearRoot = digitalRoot(birthDate.year);
  const monthDigit = digitalRoot(birthDate.month + yearRoot);

  const digits: [number, number, number, number] = [nameDigit, motherDigit, dayDigit, monthDigit];
  const code = digits.join('');

  const totalRoot = digitalRoot(digits.reduce((a, b) => a + b, 0));
  const wealth = WEALTH_BY_DIGIT[totalRoot];

  return {
    code,
    digits,
    breakdown: {
      name: { abjad: nameAbjad, pythagorean: namePyth, combined: nameCombined, digit: nameDigit },
      mother: { abjad: motherAbjad, pythagorean: motherPyth, combined: motherCombined, digit: motherDigit },
      day: {
        day: birthDate.day,
        weekdayKey: WEEKDAY_I18N_KEY[dow],
        planetKey: PLANET_I18N_KEY[planetKey],
        planetValue,
        digit: dayDigit,
      },
      month: { month: birthDate.month, yearRoot, digit: monthDigit },
    },
    totalRoot,
    planetKey: wealth.planetKey,
    colorKey: wealth.colorKey,
    luckyDayKey: wealth.dayKey,
    themeKeys: [
      `wealth_theme_${nameDigit}`,
      `wealth_theme_${motherDigit}`,
      `wealth_theme_${dayDigit}`,
      `wealth_theme_${monthDigit}`,
    ],
  };
}