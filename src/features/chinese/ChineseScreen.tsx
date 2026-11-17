import { useState, useMemo } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DatePickerJalaali, type JalaaliDateValue } from '../../components/ui/DatePickerJalaali';
import { ChineseAnimalSvg } from '../../components/ui/CosmicIcons';
import { Star, Sparkles, Loader2, Heart, ShieldCheck, Calendar, X } from 'lucide-react';
import { calculateChineseZodiac, ANIMAL_INFO } from '../../engines/chinese';
import { jalaaliToGregorian } from '../../engines/calendar/jalaali';
import { formatLocalizedDate, useLanguageStore } from '../../i18n/useLanguageStore';
import { formatNum } from '../../i18n/format';
import type { ChineseZodiacResult, ChineseAnimal } from '../../engines/chinese';
import { getAssetUrl } from '../../utils/assetPath';
import { createPortal } from 'react-dom';

const ANIMAL_NAMES_MAP: Record<string, { en: string; fa: string; ar: string; ckb: string }> = {
  rat: { en: 'Rat', fa: 'موش', ar: 'الفأر', ckb: 'مشک' },
  ox: { en: 'Ox', fa: 'گاو', ar: 'الثور', ckb: 'گا' },
  tiger: { en: 'Tiger', fa: 'ببر', ar: 'النمر', ckb: 'بەور' },
  rabbit: { en: 'Rabbit', fa: 'خرگوش', ar: 'الأرنب', ckb: 'کەروێشک' },
  dragon: { en: 'Dragon', fa: 'اژدها', ar: 'التنين', ckb: 'ئەژدیها' },
  snake: { en: 'Snake', fa: 'مار', ar: 'الثعبان', ckb: 'مار' },
  horse: { en: 'Horse', fa: 'اسب', ar: 'الحصان', ckb: 'ئەسپ' },
  goat: { en: 'Goat', fa: 'بز', ar: 'الماعز', ckb: 'بزن' },
  monkey: { en: 'Monkey', fa: 'میمون', ar: 'القرد', ckb: 'مەیموون' },
  rooster: { en: 'Rooster', fa: 'خروس', ar: 'الديك', ckb: 'کەڵەشێر' },
  dog: { en: 'Dog', fa: 'سگ', ar: 'الكلب', ckb: 'سەگ' },
  pig: { en: 'Pig', fa: 'خوک', ar: 'الخنزير', ckb: 'بەراز' },
};

const ELEMENT_NAMES_MAP: Record<string, { en: string; fa: string; ar: string; ckb: string }> = {
  wood: { en: 'Wood', fa: 'چوب', ar: 'الخشب', ckb: 'دار' },
  fire: { en: 'Fire', fa: 'آتش', ar: 'النار', ckb: 'ئاگر' },
  earth: { en: 'Earth', fa: 'خاک', ar: 'الأرض', ckb: 'خاک' },
  metal: { en: 'Metal', fa: 'فلز', ar: 'المعدن', ckb: 'کانزا' },
  water: { en: 'Water', fa: 'آب', ar: 'الماء', ckb: 'ئاو' },
};

const ANIMAL_COMPATIBILITY: Record<
  string,
  {
    bestMatches: string[];
    challenging: string;
    yinYang: Record<string, string>;
    luckyNumbers: string;
    luckyColors: Record<string, string>;
  }
> = {
  rat: {
    bestMatches: ['dragon', 'monkey', 'ox'],
    challenging: 'horse',
    yinYang: {
      fa: 'یانگ (پویا و پیشرو)',
      en: 'Yang (Active & Dynamic)',
      ar: 'يانغ (حيوي وديناميكي)',
      ckb: 'یانگ (چالاک و پێشکەوتوو)',
    },
    luckyNumbers: '2, 3',
    luckyColors: {
      fa: 'آبی، طلایی و سبز',
      en: 'Blue, Gold, Green',
      ar: 'الأزرق، الذهبي، الأخضر',
      ckb: 'شین، زێڕین، سەوز',
    },
  },
  ox: {
    bestMatches: ['rat', 'snake', 'rooster'],
    challenging: 'goat',
    yinYang: {
      fa: 'یین (درون‌نگر و شهودی)',
      en: 'Yin (Intuitive & Grounded)',
      ar: 'يين (حدسي وهادئ)',
      ckb: 'یین (قووڵ و شهودی)',
    },
    luckyNumbers: '1, 4',
    luckyColors: {
      fa: 'سفید، زرد و سبز زمردی',
      en: 'White, Yellow, Emerald Green',
      ar: 'الأبيض، الأصفر، الأخضر الزمردي',
      ckb: 'سپی، زەرد، سەوزی زمڕوتی',
    },
  },
  tiger: {
    bestMatches: ['horse', 'dog', 'pig'],
    challenging: 'monkey',
    yinYang: {
      fa: 'یانگ (پویا و پیشرو)',
      en: 'Yang (Courageous & Bold)',
      ar: 'يانغ (جريء وقيادي)',
      ckb: 'یانگ (ئازا و پێشەنگ)',
    },
    luckyNumbers: '1, 3, 4',
    luckyColors: {
      fa: 'آبی، خاکستری و نارنجی',
      en: 'Blue, Gray, Orange',
      ar: 'الأزرق، الرمادي، البرتقالي',
      ckb: 'شین، خۆڵەمێشی، پرتەقاڵی',
    },
  },
  rabbit: {
    bestMatches: ['goat', 'pig', 'dog'],
    challenging: 'rooster',
    yinYang: {
      fa: 'یین (درون‌نگر و شهودی)',
      en: 'Yin (Peaceful & Gentle)',
      ar: 'يين (هادئ ولطيف)',
      ckb: 'یین (ئارام و لەسەرخۆ)',
    },
    luckyNumbers: '3, 4, 6',
    luckyColors: {
      fa: 'صورتی، بنفش و آبی',
      en: 'Pink, Purple, Blue',
      ar: 'الوردي، الأرجواني، الأزرق',
      ckb: 'پەمەیی، مۆر، شین',
    },
  },
  dragon: {
    bestMatches: ['rat', 'monkey', 'rooster'],
    challenging: 'dog',
    yinYang: {
      fa: 'یانگ (پویا و پیشرو)',
      en: 'Yang (Majestic & Charismatic)',
      ar: 'يانغ (مهيب وجذاب)',
      ckb: 'یانگ (بەشکۆ و بەهێز)',
    },
    luckyNumbers: '1, 6, 7',
    luckyColors: {
      fa: 'طلایی، نقره‌ای و بنفش',
      en: 'Gold, Silver, Purple',
      ar: 'الذهبي، الفضي، الأرجواني',
      ckb: 'زێڕین، زیوی، مۆر',
    },
  },
  snake: {
    bestMatches: ['ox', 'rooster', 'dragon'],
    challenging: 'pig',
    yinYang: {
      fa: 'یین (درون‌نگر و شهودی)',
      en: 'Yin (Wise & Mystical)',
      ar: 'يين (حكيم وغامض)',
      ckb: 'یین (دانا و نهێنی)',
    },
    luckyNumbers: '2, 8, 9',
    luckyColors: {
      fa: 'سرخ یاقوتی، زرد و مشکی',
      en: 'Ruby Red, Yellow, Black',
      ar: 'الأحمر الياقوتي، الأصفر، الأسود',
      ckb: 'سووری یاقووتی، زەرد، ڕەش',
    },
  },
  horse: {
    bestMatches: ['tiger', 'goat', 'dog'],
    challenging: 'rat',
    yinYang: {
      fa: 'یانگ (پویا و پیشرو)',
      en: 'Yang (Free-spirited & Energetic)',
      ar: 'يانغ (متحمس ومستقل)',
      ckb: 'یانگ (ئازاد و پڕ وزە)',
    },
    luckyNumbers: '2, 3, 7',
    luckyColors: {
      fa: 'سبز، زرد و ارغوانی',
      en: 'Green, Amber Yellow, Violet',
      ar: 'الأخضر، الأصفر، الأرجواني',
      ckb: 'سەوز، زەردی کەهرەبایی، ئەرخەوانی',
    },
  },
  goat: {
    bestMatches: ['rabbit', 'horse', 'pig'],
    challenging: 'ox',
    yinYang: {
      fa: 'یین (درون‌نگر و شهودی)',
      en: 'Yin (Creative & Empathetic)',
      ar: 'يين (مبدع وحنون)',
      ckb: 'یین (داهێنەر و بەسۆز)',
    },
    luckyNumbers: '2, 7',
    luckyColors: {
      fa: 'سبز، سرخ و بنفش',
      en: 'Green, Red, Purple',
      ar: 'الأخضر، الأحمر، الأرجواني',
      ckb: 'سەوز، سوور، مۆر',
    },
  },
  monkey: {
    bestMatches: ['rat', 'dragon', 'snake'],
    challenging: 'tiger',
    yinYang: {
      fa: 'یانگ (پویا و پیشرو)',
      en: 'Yang (Clever & Agile)',
      ar: 'يانغ (ذكي وحيوي)',
      ckb: 'یانگ (زیرەک و کارامە)',
    },
    luckyNumbers: '4, 9',
    luckyColors: {
      fa: 'سفید، آبی آسمانی و طلایی',
      en: 'White, Sky Blue, Gold',
      ar: 'الأبيض، الأزرق السماوي، الذهبي',
      ckb: 'سپی، شینی ئاسمانی، زێڕین',
    },
  },
  rooster: {
    bestMatches: ['ox', 'snake', 'dragon'],
    challenging: 'rabbit',
    yinYang: {
      fa: 'یین (درون‌نگر و شهودی)',
      en: 'Yin (Precise & Dedicated)',
      ar: 'يين (دقيق ومنظم)',
      ckb: 'یین (ورد و پابەند)',
    },
    luckyNumbers: '5, 7, 8',
    luckyColors: {
      fa: 'طلایی، قهوه‌ای و زرد',
      en: 'Gold, Brown, Yellow',
      ar: 'الذهبي، البني، الأصفر',
      ckb: 'زێڕین، قاوەیی، زەرد',
    },
  },
  dog: {
    bestMatches: ['tiger', 'rabbit', 'horse'],
    challenging: 'dragon',
    yinYang: {
      fa: 'یانگ (پویا و پیشرو)',
      en: 'Yang (Loyal & Protective)',
      ar: 'يانغ (مخلص ووفي)',
      ckb: 'یانگ (وەفادار و پارێزەر)',
    },
    luckyNumbers: '3, 4, 9',
    luckyColors: {
      fa: 'سرخ، سبز و بنفش',
      en: 'Red, Green, Purple',
      ar: 'الأحمر، الأخضر، الأرجواني',
      ckb: 'سوور، سەوز، مۆر',
    },
  },
  pig: {
    bestMatches: ['goat', 'rabbit', 'tiger'],
    challenging: 'snake',
    yinYang: {
      fa: 'یین (درون‌نگر و شهودی)',
      en: 'Yin (Generous & Sincere)',
      ar: 'يين (كريم ومخلص)',
      ckb: 'یین (بەخشندە و ڕاستگۆ)',
    },
    luckyNumbers: '2, 5, 8',
    luckyColors: {
      fa: 'زرد طلایی، خاکستری و قهوه‌ای',
      en: 'Golden Yellow, Gray, Brown',
      ar: 'الأصفر الذهبي، الرمادي، البني',
      ckb: 'زەردی زێڕین، خۆڵەمێشی، قاوەیی',
    },
  },
};

const ALL_ANIMALS_LIST: ChineseAnimal[] = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig',
];

export function ChineseScreen() {
  const lang = useLanguageStore((s) => s.lang);

  const [birthDate, setBirthDate] = useState<JalaaliDateValue>({
    year: 1364,
    month: 4,
    day: 1,
  });
  const [result, setResult] = useState<ChineseZodiacResult | null>(null);
  const [selectedGuideAnimal, setSelectedGuideAnimal] = useState<ChineseAnimal | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = useMemo(() => formatLocalizedDate(birthDate, lang, false), [birthDate, lang]);
  const formattedDateFull = useMemo(() => formatLocalizedDate(birthDate, lang, true), [birthDate, lang]);

  const getAnimalName = (key: string) => {
    const item = ANIMAL_NAMES_MAP[key];
    return item ? (item as any)[lang] || item.en : key;
  };

  const getElementName = (key: string) => {
    const item = ELEMENT_NAMES_MAP[key];
    return item ? (item as any)[lang] || item.en : key;
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setError(null);
    try {
      const g = jalaaliToGregorian({
        year: birthDate.year,
        month: birthDate.month,
        day: birthDate.day,
      });
      const chineseResult = calculateChineseZodiac(g.year, g.month, g.day);
      setResult(chineseResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error calculating');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  if (result) {
    const compat = ANIMAL_COMPATIBILITY[result.animal] || ANIMAL_COMPATIBILITY.dragon;
    const animalName = getAnimalName(result.animal);
    const elementName = getElementName(result.element);

    return (
      <div className="space-y-5 pb-24">
        <PageHeader
          title={lang === 'fa' ? 'زودیاک چینی شما' : lang === 'ar' ? 'برجك الصيني' : lang === 'ckb' ? 'بورجی چینی تۆ' : 'Your Chinese Zodiac'}
          subtitle={`${lang === 'fa' ? 'تاریخ تولد' : lang === 'ar' ? 'تاريخ الميلاد' : lang === 'ckb' ? 'ڕێکەوتی لەدایکبوون' : 'Birth Date'}: ${formattedDate}`}
          onBack={handleReset}
        />

        <Card variant="gold-border" padding="lg" className="text-center">
          <div className="flex justify-center mb-3">
            <ChineseAnimalSvg animal={result.animal} className="w-28 h-28" />
          </div>
          <h2 className="font-heading text-2xl text-[var(--luma-gold)] font-bold mb-1">
            {elementName} • {animalName}
          </h2>
          <p className="text-xs text-[var(--luma-text)] font-medium mt-1">
            {formattedDateFull}
          </p>
          <p className="text-[11px] text-[var(--luma-text-muted)] mt-1">
            {lang === 'fa' ? 'سال قمری چینی' : 'Lunar Year'}: {formatNum(result.chineseYear, lang)} • {compat.yinYang[lang] || compat.yinYang.en}
          </p>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-[var(--luma-gold)]" />
            <h3 className="font-heading text-base text-[var(--luma-text)] font-bold">
              {lang === 'fa' ? `شخصیت‌شناسی نماد ${animalName}` : `${animalName} Characteristics`}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--luma-text)] leading-relaxed mb-3 text-start">
            {lang === 'fa' ? result.animalInfo.meaning : `${animalName} symbolizes intelligence, vitality, and distinct natural traits.`}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {result.animalInfo.keywords.map((kw, i) => (
              <span
                key={i}
                className="text-[10px] px-2.5 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)] font-bold"
              >
                {kw}
              </span>
            ))}
          </div>
          <div className="pt-3 border-t border-[var(--luma-border)]">
            <p className="text-[10px] text-[var(--luma-text-muted)] mb-1">
              {lang === 'fa' ? 'سایر سال‌های این نماد:' : 'Other years of this sign:'}
            </p>
            <p className="text-xs text-[var(--luma-gold)]">
              {formatNum(result.animalInfo.years, lang)}
            </p>
          </div>
        </Card>

        <Card variant="elevated" padding="md" className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <h3 className="font-heading text-sm text-[var(--luma-text)] font-bold">
              {lang === 'fa' ? 'سازگاری عاطفی و شاخص‌های شانس (BaZi)' : 'Compatibility & Lucky Markers (BaZi)'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
              <p className="text-[10px] text-emerald-400 font-bold mb-1">
                {lang === 'fa' ? 'بهترین جفت‌های سازگار:' : 'Best Compatibility:'}
              </p>
              <p className="text-[var(--luma-text)] font-medium">
                {compat.bestMatches.map((m) => getAnimalName(m)).join(' • ')}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
              <p className="text-[10px] text-amber-400 font-bold mb-1">
                {lang === 'fa' ? 'نیازمند مدارا و درک بیشتر:' : 'Challenging Match:'}
              </p>
              <p className="text-[var(--luma-text)] font-medium">{getAnimalName(compat.challenging)}</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
              <p className="text-[10px] text-[var(--luma-gold)] font-bold mb-1">
                {lang === 'fa' ? 'اعداد شانس شما:' : 'Lucky Numbers:'}
              </p>
              <p className="text-[var(--luma-text)] font-medium">{formatNum(compat.luckyNumbers, lang)}</p>
            </div>
            <div className="p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)]">
              <p className="text-[10px] text-[var(--luma-gold)] font-bold mb-1">
                {lang === 'fa' ? 'رنگ‌های هم‌ارتعاش:' : 'Lucky Colors:'}
              </p>
              <p className="text-[var(--luma-text)] font-medium">{compat.luckyColors[lang] || compat.luckyColors.en}</p>
            </div>
          </div>
        </Card>

        <Button variant="secondary" fullWidth onClick={handleReset}>
          {lang === 'fa' ? 'محاسبه برای تاریخ تولد دیگر' : 'Calculate Another Date'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <PageHeader
        title={lang === 'fa' ? 'زودیاک چینی و عناصر پنج‌گانه' : lang === 'ar' ? 'الأبراج الصينية والعناصر الخمسة' : lang === 'ckb' ? 'بورجی چینی و پێنج توخمەکە' : 'Chinese Zodiac & 5 Elements'}
        subtitle={lang === 'fa' ? 'شناخت حیوان، عنصر و سازگاری سال تولد' : 'Explore animal sign, elemental balance & compatibility'}
      />

      <Card variant="elevated" padding="md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-sm text-[var(--luma-text)] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[var(--luma-gold)]" />
            <span>{lang === 'fa' ? 'تاریخ تولد خود را انتخاب کنید' : 'Select Birth Date'}</span>
          </h3>
          <span className="text-xs font-bold text-[var(--luma-gold)]">
            {formattedDate}
          </span>
        </div>

        <DatePickerJalaali value={birthDate} onChange={setBirthDate} />

        <div className="mt-3 p-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-center">
          <span className="text-[11px] text-[var(--luma-text-muted)]">
            {lang === 'fa' ? 'تاریخ انتخاب‌شده: ' : 'Selected Date: '}
          </span>
          <span className="text-xs font-bold text-[var(--luma-gold)]">
            {formattedDateFull}
          </span>
        </div>
      </Card>

      {error && (
        <Card variant="elevated" padding="md" className="border-red-500/50">
          <p className="text-sm text-red-400">{error}</p>
        </Card>
      )}

      <Button
        variant="gold"
        fullWidth
        size="lg"
        onClick={handleCalculate}
        disabled={isCalculating}
      >
        {isCalculating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{lang === 'fa' ? 'در حال محاسبه...' : 'Calculating...'}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>
              {lang === 'fa' ? `محاسبه زودیاک چینی (${formattedDate})` : `Calculate Chinese Zodiac (${formattedDate})`}
            </span>
          </>
        )}
      </Button>

      {/* دایره‌المعارف ۱۲ نماد با نام‌های چندزبانه */}
      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)] font-bold">
            {lang === 'fa' ? 'دایره‌المعارف ۱۲ حیوان زودیاک چینی' : '12 Chinese Zodiac Animals Encyclopedia'}
          </h3>
        </div>
        <p className="text-[11px] text-[var(--luma-text-muted)] mb-3 text-start">
          {lang === 'fa'
            ? 'روی هر نماد کلیک کنید تا ویژگی‌ها، سازگاری و سال‌های مربوط به آن را مشاهده نمایید:'
            : 'Click on any animal to view characteristics, compatibility, and corresponding years:'}
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {ALL_ANIMALS_LIST.map((animKey) => {
            const localizedName = getAnimalName(animKey);
            return (
              <button
                key={animKey}
                type="button"
                onClick={() => setSelectedGuideAnimal(animKey)}
                className="p-2.5 rounded-2xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] hover:border-[var(--luma-gold)] transition-all flex flex-col items-center group"
              >
                <img
                  src={getAssetUrl(`icons/chinese/${animKey}.png`)}
                  alt={localizedName}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform"
                />
                <span className="text-[11px] font-bold text-[var(--luma-text)] mt-1.5">
                  {localizedName}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* پنجره مودال دایره‌المعارف */}
      {selectedGuideAnimal && (
        createPortal(<div
          className="modal-backdrop bg-black/75 backdrop-blur-sm"
          onClick={() => setSelectedGuideAnimal(null)}
        >
          <div
            className="modal-panel w-full max-w-md bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/40 rounded-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--luma-border)] pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={getAssetUrl(`icons/chinese/${selectedGuideAnimal}.png`)}
                  alt={getAnimalName(selectedGuideAnimal)}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h4 className="font-heading text-base text-[var(--luma-gold)] font-bold">
                    {getAnimalName(selectedGuideAnimal)}
                  </h4>
                  <p className="text-[10px] text-[var(--luma-text-muted)]">
                    {ANIMAL_COMPATIBILITY[selectedGuideAnimal]?.yinYang[lang] || ANIMAL_COMPATIBILITY[selectedGuideAnimal]?.yinYang.en}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuideAnimal(null)}
                className="p-1.5 rounded-full bg-[var(--luma-bg-subtle)] text-[var(--luma-text-muted)] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--luma-text)] leading-relaxed text-start">
              {lang === 'fa' ? ANIMAL_INFO[selectedGuideAnimal].meaning : `${getAnimalName(selectedGuideAnimal)} possesses profound qualities, strategic focus, and unique symbolic resonance in Eastern astrology.`}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[var(--luma-bg-subtle)]">
                <span className="block text-[10px] text-emerald-400 font-bold mb-0.5">
                  {lang === 'fa' ? 'بهترین سازگاری:' : 'Best Compatibility:'}
                </span>
                <span className="text-[var(--luma-text)]">
                  {ANIMAL_COMPATIBILITY[selectedGuideAnimal]?.bestMatches.map((m) => getAnimalName(m)).join(' • ')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--luma-bg-subtle)]">
                <span className="block text-[10px] text-[var(--luma-gold)] font-bold mb-0.5">
                  {lang === 'fa' ? 'رنگ‌های شانس:' : 'Lucky Colors:'}
                </span>
                <span className="text-[var(--luma-text)]">
                  {ANIMAL_COMPATIBILITY[selectedGuideAnimal]?.luckyColors[lang] || ANIMAL_COMPATIBILITY[selectedGuideAnimal]?.luckyColors.en}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--luma-bg-subtle)] text-xs">
              <span className="block text-[10px] text-[var(--luma-text-muted)] mb-1">
                {lang === 'fa' ? 'سال‌های این نماد:' : 'Sign Years:'}
              </span>
              <span className="text-[var(--luma-gold)] font-mono text-[11px]">
                {formatNum(ANIMAL_INFO[selectedGuideAnimal].years, lang)}
              </span>
            </div>

            <Button variant="gold" fullWidth onClick={() => setSelectedGuideAnimal(null)}>
              {lang === 'fa' ? 'بستن پنجره' : 'Close'}
            </Button>
          </div>
        </div>, document.body)
      )}
    </div>
  );
}