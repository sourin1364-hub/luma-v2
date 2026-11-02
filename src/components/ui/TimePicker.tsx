import { useMemo } from 'react';
import { WheelPicker } from './WheelPicker';
import { toPersianDigits } from '../../engines/calendar/format';

export interface TimeValue {
  hour: number;
  minute: number;
}

interface TimePickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const hours = useMemo(() => {
    const arr = [];
    for (let h = 0; h <= 23; h++) {
      arr.push({ value: h, label: toPersianDigits(String(h).padStart(2, '0')) });
    }
    return arr;
  }, []);

  const minutes = useMemo(() => {
    const arr = [];
    for (let m = 0; m <= 59; m++) {
      arr.push({ value: m, label: toPersianDigits(String(m).padStart(2, '0')) });
    }
    return arr;
  }, []);

  return (
    <div className="rounded-2xl bg-[var(--luma-bg-subtle)] p-3">
      <div className="flex gap-2 items-center">
        <WheelPicker
          items={hours}
          value={value.hour}
          onChange={(v) => onChange({ ...value, hour: v as number })}
          ariaLabel="ساعت"
        />
        <span className="text-2xl font-bold text-[var(--luma-gold)]">:</span>
        <WheelPicker
          items={minutes}
          value={value.minute}
          onChange={(v) => onChange({ ...value, minute: v as number })}
          ariaLabel="دقیقه"
        />
      </div>
      <p className="text-center text-xs text-[var(--luma-text-muted)] mt-2">
        {toPersianDigits(String(value.hour).padStart(2, '0'))}:
        {toPersianDigits(String(value.minute).padStart(2, '0'))}
      </p>
    </div>
  );
}