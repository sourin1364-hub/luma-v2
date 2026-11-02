import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DatePickerJalaali, type JalaaliDateValue } from '../../components/ui/DatePickerJalaali';
import { TimePicker, type TimeValue } from '../../components/ui/TimePicker';
import { CityPicker } from '../../components/ui/CityPicker';
import { ChartWheel } from '../../components/ui/ChartWheel';
import { ChartInterpretation } from '../../components/ui/ChartInterpretation';
import { MapPin, Clock, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { birthToUtc } from '../../engines/calendar/timezone';
import { calculateNatalChart } from '../../engines/astronomy/chart';
import { PLANET_NAMES_FA } from '../../engines/astronomy/constants';
import type { NatalChart, PlanetName } from '../../engines/astronomy/types';
import type { CityWithProvince } from '../../engines/location';

const PLANET_ORDER: PlanetName[] = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
];

// شهر پیش‌فرض: تهران
const DEFAULT_CITY: CityWithProvince = {
  id: 0,
  name: 'تهران',
  en_name: 'Tehran',
  province_id: 1,
  lat: 35.6892,
  lon: 51.389,
  province_name: 'تهران',
  timezone: 'Asia/Tehran'
};

export function ChartScreen() {
  const [birthDate, setBirthDate] = useState<JalaaliDateValue>({
    year: 1364,
    month: 4,
    day: 1
  });
  const [birthTime, setBirthTime] = useState<TimeValue>({
    hour: 14,
    minute: 30
  });
  const [city, setCity] = useState<CityWithProvince | null>(DEFAULT_CITY);
  const [chart, setChart] = useState<NatalChart | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    if (!city) {
      setError('لطفاً شهر تولد را انتخاب کنید');
      return;
    }
    setIsCalculating(true);
    setError(null);
    try {
      const utcDate = birthToUtc(
        { year: birthDate.year, month: birthDate.month, day: birthDate.day },
        birthTime.hour,
        birthTime.minute,
        city.timezone || 'Asia/Tehran'
      );
      const result = calculateNatalChart(utcDate, city.lat, city.lon);
      setChart(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطا در محاسبه چارت');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setChart(null);
    setError(null);
  };

  if (chart && city) {
    const sortedPlanets = PLANET_ORDER
      .map(name => chart.planets.find(p => p.planet === name))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    return (
      <div className="space-y-5">
        <PageHeader
          title="چارت تولد شما"
          subtitle={`${birthDate.day}/${birthDate.month}/${birthDate.year} — ${birthTime.hour}:${String(birthTime.minute).padStart(2, '0')} — ${city.name}`}
          action={
            <Button variant="ghost" size="sm" onClick={handleReset}>
              ویرایش
            </Button>
          }
        />

        <Card variant="glass" padding="md">
          <ChartWheel chart={chart} size={340} />
        </Card>

        <ChartInterpretation chart={chart} />

        <Card variant="elevated" padding="md">
          <h3 className="font-heading text-lg text-[var(--luma-text)] mb-3">موقعیت سیارات</h3>
          <div className="space-y-2 text-sm">
            {sortedPlanets.map(p => (
              <div key={p.planet} className="flex items-center justify-between py-1.5 border-b border-[var(--luma-border)] last:border-0">
                <span className="text-[var(--luma-text)] font-medium">{PLANET_NAMES_FA[p.planet]}</span>
                <span className="text-[var(--luma-text-muted)] text-xs">
                  {p.signDegree.toFixed(1)}° {p.retrograde && <span className="text-amber-500">℞</span>}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="چارت تولد" subtitle="اطلاعات تولد خود را وارد کنید" />

      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">تاریخ تولد (شمسی)</h3>
        </div>
        <DatePickerJalaali value={birthDate} onChange={setBirthDate} />
      </Card>

      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">ساعت تولد</h3>
        </div>
        <TimePicker value={birthTime} onChange={setBirthTime} />
      </Card>

      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">شهر تولد</h3>
        </div>
        <CityPicker value={city} onChange={setCity} />
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
        disabled={isCalculating || !city}
      >
        {isCalculating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            در حال محاسبه...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            محاسبه چارت تولد
          </>
        )}
      </Button>
    </div>
  );
}