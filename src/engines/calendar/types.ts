export interface JalaaliDate {
  year: number;
  month: number;
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

export interface BirthDateTime {
  jalaali: JalaaliDate;
  hour: number;
  minute: number;
  timezone: string;
  timeUnknown: boolean;
}

export interface MonthInfo {
  index: number;
  name: string;
  days: number;
}

export const MONTH_NAMES_FA = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
] as const;