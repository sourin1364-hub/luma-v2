import { useMemo } from 'react';
import { WheelPicker } from './WheelPicker';
import { useLanguageStore } from '../../i18n/useLanguageStore';
import { formatNum } from '../../i18n/format';

export interface TimeValue {
  hour: number;
  minute: number;
}

interface TimePickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const lang = useLanguageStore((s) => s.lang);

  const hours = useMemo(() => {
    const arr = [];
    for (let h = 0; h <= 23; h++) {
      arr.push({ value: h, label: formatNum(String(h).padStart(2, '0'), lang) });
    }
    return arr;
  }, [lang]);

  const minutes = useMemo(() => {
    const arr = [];
    for (let m = 0; m <= 59; m++) {
      arr.push({ value: m, label: formatNum(String(m).padStart(2, '0'), lang) });
    }
    return arr;
  }, [lang]);

  return (
    <div className="rounded-2xl bg-[var(--luma-bg-subtle)] p-3">
      {/* dir="ltr" تضمین می‌کند ساعت همیشه در سمت چپ و دقیقه در سمت راست باشد */}
      <div className="flex gap-2 items-center justify-center" dir="ltr">
        <WheelPicker
          items={hours}
          value={value.hour}
          onChange={(v) => onChange({ ...value, hour: v as number })}
          ariaLabel="Hour"
        />
        <span className="text-2xl font-bold text-[var(--luma-gold)]">:</span>
        <WheelPicker
          items={minutes}
          value={value.minute}
          onChange={(v) => onChange({ ...value, minute: v as number })}
          ariaLabel="Minute"
        />
      </div>
      <p className="text-center text-xs text-[var(--luma-text-muted)] mt-2" dir="ltr">
        {formatNum(String(value.hour).padStart(2, '0'), lang)}:
        {formatNum(String(value.minute).padStart(2, '0'), lang)}
      </p>
    </div>
  );
}