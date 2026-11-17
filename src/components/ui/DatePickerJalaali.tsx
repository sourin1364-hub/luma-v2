import { useEffect, useRef, useMemo } from 'react';
import { jalaaliToGregorian, gregorianToJalaali, jalaaliMonthLength } from '../../engines/calendar/jalaali';
import {
  useLanguageStore,
  UI_TRANSLATIONS,
  MONTHS_BY_LANG,
  gregorianToHijri,
  jalaaliFromHijri,
} from '../../i18n/useLanguageStore';
import { formatNum } from '../../i18n/format';

export interface JalaaliDateValue {
  year: number;
  month: number;
  day: number;
}

interface DatePickerJalaaliProps {
  value: JalaaliDateValue;
  onChange: (value: JalaaliDateValue) => void;
  minYear?: number;
  maxYear?: number;
}

const ITEM_HEIGHT = 40;

interface WheelColumnProps<T extends number> {
  label: string;
  items: { value: T; label: string }[];
  selectedValue: T;
  onSelect: (val: T) => void;
}

/**
 * ستون استوانه‌ای چرخشی به سبک آیفون (iOS Wheel Picker Drum)
 */
function IosWheelColumn<T extends number>({
  label,
  items,
  selectedValue,
  onSelect,
}: WheelColumnProps<T>) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const selectedIndex = useMemo(() => {
    const idx = items.findIndex((i) => i.value === selectedValue);
    return idx >= 0 ? idx : 0;
  }, [items, selectedValue]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const targetTop = selectedIndex * ITEM_HEIGHT;
    if (Math.abs(el.scrollTop - targetTop) > 4) {
      el.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleScroll = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
      const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clampedIdx = Math.max(0, Math.min(items.length - 1, idx));
      const chosen = items[clampedIdx];
      if (chosen && chosen.value !== selectedValue) {
        onSelect(chosen.value);
      }
    }, 90);
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-bold text-[var(--luma-gold)] mb-1">{label}</span>
      <div className="relative w-full h-[200px] rounded-2xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] overflow-hidden shadow-inner">
        {/* نوار انتخاب مرکزی آیفون (Highlight Bar) */}
        <div
          className="pointer-events-none absolute left-1.5 right-1.5 top-1/2 -translate-y-1/2 h-[40px] rounded-xl bg-[var(--luma-gold)]/15 border border-[var(--luma-gold)]/60 z-10"
        />
        {/* سایه بالا و پایین استوانه */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[var(--luma-bg-elevated)]/90 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[var(--luma-bg-elevated)]/90 to-transparent z-10" />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{ scrollSnapType: 'y mandatory' }}
          className="h-full overflow-y-scroll no-scrollbar relative z-20 py-[80px]"
        >
          {items.map((item) => {
            const isSelected = item.value === selectedValue;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onSelect(item.value)}
                style={{ height: `${ITEM_HEIGHT}px`, scrollSnapAlign: 'center' }}
                className={
                  'w-full flex items-center justify-center transition-all select-none px-1 truncate ' +
                  (isSelected
                    ? 'text-[var(--luma-gold)] font-bold text-sm scale-105'
                    : 'text-[var(--luma-text-muted)] text-xs opacity-65 hover:opacity-100')
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getGregorianMonthLength(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function DatePickerJalaali({
  value,
  onChange,
  minYear = 1300,
  maxYear = 1405,
}: DatePickerJalaaliProps) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const gDate = useMemo(() => {
    try {
      return jalaaliToGregorian({ year: value.year, month: value.month, day: value.day });
    } catch {
      return { year: 1990, month: 6, day: 15 };
    }
  }, [value.year, value.month, value.day]);

  const hDate = useMemo(() => {
    return gregorianToHijri(gDate.year, gDate.month, gDate.day);
  }, [gDate.year, gDate.month, gDate.day]);

  // ۱. اسلایدر آیفون میلادی برای زبان انگلیسی
  if (lang === 'en') {
    const gYearItems = [];
    for (let y = 2026; y >= 1925; y--) {
      gYearItems.push({ value: y, label: String(y) });
    }
    const gMonthItems = MONTHS_BY_LANG.en.map((m, idx) => ({ value: idx + 1, label: m.slice(0, 3) }));
    const maxD = getGregorianMonthLength(gDate.year, gDate.month);
    const gDayItems = Array.from({ length: maxD }, (_, i) => ({ value: i + 1, label: String(i + 1) }));

    const updateGreg = (y: number, m: number, d: number) => {
      const clampedD = Math.min(d, getGregorianMonthLength(y, m));
      onChange(gregorianToJalaali({ year: y, month: m, day: clampedD }));
    };

    return (
      <div className="grid grid-cols-3 gap-2" dir="ltr">
        <IosWheelColumn
          label={t['date_label_month']}
          items={gMonthItems}
          selectedValue={gDate.month}
          onSelect={(m) => updateGreg(gDate.year, m, gDate.day)}
        />
        <IosWheelColumn
          label={t['date_label_day']}
          items={gDayItems}
          selectedValue={gDate.day}
          onSelect={(d) => updateGreg(gDate.year, gDate.month, d)}
        />
        <IosWheelColumn
          label={t['date_label_year']}
          items={gYearItems}
          selectedValue={gDate.year}
          onSelect={(y) => updateGreg(y, gDate.month, gDate.day)}
        />
      </div>
    );
  }

  // ۲. اسلایدر آیفون هجری قمری برای زبان عربی
  if (lang === 'ar') {
    const hYearItems = [];
    for (let y = 1448; y >= 1340; y--) {
      hYearItems.push({ value: y, label: formatNum(y, lang) });
    }
    const hMonthItems = MONTHS_BY_LANG.ar.map((m, idx) => ({ value: idx + 1, label: m }));
    const hDayItems = Array.from({ length: 30 }, (_, i) => ({
      value: i + 1,
      label: formatNum(i + 1, lang),
    }));

    const updateHijri = (hy: number, hm: number, hd: number) => {
      onChange(jalaaliFromHijri(hy, hm, hd));
    };

    return (
      <div className="grid grid-cols-3 gap-2" dir="rtl">
        <IosWheelColumn
          label={t['date_label_day']}
          items={hDayItems}
          selectedValue={hDate.day}
          onSelect={(d) => updateHijri(hDate.year, hDate.month, d)}
        />
        <IosWheelColumn
          label={t['date_label_month_hijri']}
          items={hMonthItems}
          selectedValue={hDate.month}
          onSelect={(m) => updateHijri(hDate.year, m, hDate.day)}
        />
        <IosWheelColumn
          label={t['date_label_year_hijri']}
          items={hYearItems}
          selectedValue={hDate.year}
          onSelect={(y) => updateHijri(y, hDate.month, hDate.day)}
        />
      </div>
    );
  }

  // ۳. اسلایدر آیفون شمسی برای زبان فارسی و کوردی سورانی
  const jYearItems = [];
  for (let y = maxYear; y >= minYear; y--) {
    jYearItems.push({ value: y, label: formatNum(y, lang) });
  }
  const monthNames = MONTHS_BY_LANG[lang] || MONTHS_BY_LANG.fa;
  const jMonthItems = monthNames.map((m, idx) => ({ value: idx + 1, label: m }));
  const maxDay = jalaaliMonthLength(value.year, value.month);
  const jDayItems = Array.from({ length: maxDay }, (_, i) => ({
    value: i + 1,
    label: formatNum(i + 1, lang),
  }));

  const updateJal = (y: number, m: number, d: number) => {
    const clampedD = Math.min(d, jalaaliMonthLength(y, m));
    onChange({ year: y, month: m, day: clampedD });
  };

  return (
    <div className="grid grid-cols-3 gap-2" dir="rtl">
      <IosWheelColumn
        label={t['date_label_day']}
        items={jDayItems}
        selectedValue={value.day}
        onSelect={(d) => updateJal(value.year, value.month, d)}
      />
      <IosWheelColumn
        label={t['date_label_month']}
        items={jMonthItems}
        selectedValue={value.month}
        onSelect={(m) => updateJal(value.year, m, value.day)}
      />
      <IosWheelColumn
        label={t['date_label_year']}
        items={jYearItems}
        selectedValue={value.year}
        onSelect={(y) => updateJal(y, value.month, value.day)}
      />
    </div>
  );
}