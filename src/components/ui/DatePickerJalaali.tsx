import { useMemo } from 'react';
import { WheelPicker } from './WheelPicker';
import { daysInMonth } from '../../engines/calendar/jalaali';
import { MONTH_NAMES_FA } from '../../engines/calendar/types';
import { toPersianDigits } from '../../engines/calendar/format';

export interface JalaaliDateValue {
  year: number;
  month: number;
  day: number;
}

interface DatePickerJalaaliProps {
  value: JalaaliDateValue;
  onChange: (value: JalaaliDateValue) => void;
}

const MIN_YEAR = 1300;
const MAX_YEAR = 1420;

export function DatePickerJalaali({ value, onChange }: DatePickerJalaaliProps) {
  const years = useMemo(() => {
    const arr = [];
    for (let y = MIN_YEAR; y <= MAX_YEAR; y++) {
      arr.push({ value: y, label: toPersianDigits(y) });
    }
    return arr;
  }, []);

  const months = useMemo(
    () =>
      MONTH_NAMES_FA.map((name, idx) => ({
        value: idx + 1,
        label: name
      })),
    []
  );

  const days = useMemo(() => {
    const maxDay = daysInMonth(value.year, value.month);
    const arr = [];
    for (let d = 1; d <= maxDay; d++) {
      arr.push({ value: d, label: toPersianDigits(d) });
    }
    return arr;
  }, [value.year, value.month]);

  const handleYearChange = (year: number) => {
    const maxDay = daysInMonth(year, value.month);
    onChange({
      year,
      month: value.month,
      day: Math.min(value.day, maxDay)
    });
  };

  const handleMonthChange = (month: number) => {
    const maxDay = daysInMonth(value.year, month);
    onChange({
      year: value.year,
      month,
      day: Math.min(value.day, maxDay)
    });
  };

  const handleDayChange = (day: number) => {
    onChange({ ...value, day });
  };

  return (
    <div className="rounded-2xl bg-[var(--luma-bg-subtle)] p-3">
      <div className="flex gap-2">
        <WheelPicker
          items={years}
          value={value.year}
          onChange={(v) => handleYearChange(v as number)}
          width="flex-[2]"
          ariaLabel="سال"
        />
        <WheelPicker
          items={months}
          value={value.month}
          onChange={(v) => handleMonthChange(v as number)}
          width="flex-[2]"
          ariaLabel="ماه"
        />
        <WheelPicker
          items={days}
          value={value.day}
          onChange={(v) => handleDayChange(v as number)}
          width="flex-1"
          ariaLabel="روز"
        />
      </div>
      <p className="text-center text-xs text-[var(--luma-text-muted)] mt-2">
        {toPersianDigits(value.day)} {MONTH_NAMES_FA[value.month - 1]} {toPersianDigits(value.year)}
      </p>
    </div>
  );
}