import type { BirthstoneInfo } from './types';

export const BIRTHSTONES: BirthstoneInfo[] = [
  { month: 1, nameFa: 'گارنت (لعل)', nameEn: 'Garnet', color: 'قرمز تیره', meaning: 'محافظت، دوستی و وفاداری' },
  { month: 2, nameFa: 'آمتیست', nameEn: 'Amethyst', color: 'بنفش', meaning: 'آرامش، تعادل و پاکسازی ذهن' },
  { month: 3, nameFa: 'آکوامارین', nameEn: 'Aquamarine', color: 'آبی روشن', meaning: 'آرامش، شفافیت و شجاعت' },
  { month: 4, nameFa: 'الماس', nameEn: 'Diamond', color: 'بی‌رنگ', meaning: 'قدرت، عشق ابدی و پاکی' },
  { month: 5, nameFa: 'زمرد', nameEn: 'Emerald', color: 'سبز', meaning: 'تجدید حیات، رشد و خوشبختی' },
  { month: 6, nameFa: 'مروارید', nameEn: 'Pearl', color: 'سفید صدفی', meaning: 'خلوص، خرد و آرامش درونی' },
  { month: 7, nameFa: 'یاقوت سرخ', nameEn: 'Ruby', color: 'قرمز', meaning: 'شور، عشق و سرزندگی' },
  { month: 8, nameFa: 'پریدوت', nameEn: 'Peridot', color: 'سبز زیتونی', meaning: 'ثروت، گرما و خوش‌بینی' },
  { month: 9, nameFa: 'یاقوت کبود', nameEn: 'Sapphire', color: 'آبی', meaning: 'خرد، صداقت و آرامش' },
  { month: 10, nameFa: 'اوپال', nameEn: 'Opal', color: 'چندرنگ', meaning: 'خلاقیت، امید و الهام' },
  { month: 11, nameFa: 'توپاز', nameEn: 'Topaz', color: 'طلایی', meaning: 'شادی، فراوانی و موفقیت' },
  { month: 12, nameFa: 'فیروزه', nameEn: 'Turquoise', color: 'آبی فیروزه‌ای', meaning: 'شفا، محافظت و خوش‌شانسی' }
];

export function getBirthstoneByMonth(month: number): BirthstoneInfo | undefined {
  return BIRTHSTONES.find(b => b.month === month);
}