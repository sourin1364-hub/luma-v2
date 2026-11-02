import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DatePickerJalaali, type JalaaliDateValue } from '../../components/ui/DatePickerJalaali';
import { TimePicker, type TimeValue } from '../../components/ui/TimePicker';
import { CityPicker } from '../../components/ui/CityPicker';
import { ChartWheel } from '../../components/ui/ChartWheel';
import { ChartInterpretation } from '../../components/ui/ChartInterpretation';
import { ZodiacScreen } from './ZodiacScreen';
import { getZodiacFromBirthDate, getBirthstoneFromBirthDate } from '../../engines/zodiac';
import { MapPin, Clock, Calendar, Sparkles, Loader2, CheckCircle2, Star } from 'lucide-react';
import { birthToUtc } from '../../engines/calendar/timezone';
import { calculateNatalChart } from '../../engines/astronomy/chart';
import { PLANET_NAMES_FA } from '../../engines/astronomy/constants';
import type { NatalChart, PlanetName } from '../../engines/astronomy/types';
import type { CityWithProvince } from '../../engines/location';
import { saveChart } from './chartService';
import { useAuthStore } from '../../store/useAuthStore';
import { formatJalaaliDate } from '../../engines/calendar/format';

const PLANET_ORDER: PlanetName[] = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
];

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

const STORAGE_KEY = 'luma_chart_state';

interface ChartState {
  birthDate: JalaaliDateValue;
  birthTime: TimeValue;
  city: CityWithProvince | null;
  chart: NatalChart | null;
}

function loadState(): ChartState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state: ChartState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function ChartScreen() {
  const user = useAuthStore((s) => s.user);
  const savedState = loadState();

  const [birthDate, setBirthDate] = useState<JalaaliDateValue>(
    savedState?.birthDate || { year: 1364, month: 4, day: 1 }
  );
  const [birthTime, setBirthTime] = useState<TimeValue>(
    savedState?.birthTime || { hour: 14, minute: 30 }
  );
  const [city, setCity] = useState<CityWithProvince | null>(
    savedState?.city || DEFAULT_CITY
  );
  const [chart, setChart] = useState<NatalChart | null>(savedState?.chart || null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showZodiac, setShowZodiac] = useState(false);
  const [zodiacInfo, setZodiacInfo] = useState<any>(null);
  const [birthstoneInfo, setBirthstoneInfo] = useState<any>(null);

  useEffect(() => {
    saveState({ birthDate, birthTime, city, chart });
  }, [birthDate, birthTime, city, chart]);

  const handleCalculate = async () => {
    if (!city) {
      setError('لطفاً شهر تولد را انتخاب کنید');
      return;
    }
    setIsCalculating(true);
    setError(null);
    setSaved(false);
    try {
      const utcDate = birthToUtc(
        { year: birthDate.year, month: birthDate.month, day: birthDate.day },
        birthTime.hour,
        birthTime.minute,
        city.timezone || 'Asia/Tehran'
      );
      const result = calculateNatalChart(utcDate, city.lat, city.lon);
      // محاسبه برج و سنگ از تاریخ تولد
      const zodiacInfo = getZodiacFromBirthDate({
        year: birthDate.year, month: birthDate.month, day: birthDate.day
      });
      const birthstoneInfo = getBirthstoneFromBirthDate({
        year: birthDate.year, month: birthDate.month, day: birthDate.day
      });
      setZodiacInfo(zodiacInfo);
      setBirthstoneInfo(birthstoneInfo);
      setChart(result);

      if (user) {
        try {
          await saveChart(user.id, birthDate, birthTime, city, result);
          setSaved(true);
        } catch (saveErr) {
          console.error('Save chart error:', saveErr);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطا در محاسبه چارت');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setChart(null);
    setError(null);
    setSaved(false);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  // صفحه زودیاک
  if (showZodiac) {
    return <ZodiacScreen onBack={() => setShowZodiac(false)} />;
  }

  if (chart && city) {
    const sortedPlanets = PLANET_ORDER
      .map(name => chart.planets.find(p => p.planet === name))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    return (
      <div className="space-y-5">
        <PageHeader
          title="چارت تولد شما"
          subtitle={`${formatJalaaliDate({ year: birthDate.year, month: birthDate.month, day: birthDate.day })} — ${birthTime.hour}:${String(birthTime.minute).padStart(2, '0')} — ${city.name}`}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowZodiac(true)}>
                <Star className="w-4 h-4" />
                زودیاک
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                ویرایش
              </Button>
            </div>
          }
        />

        <Card variant="glass" padding="md">
          {saved && (
            <div className="mb-3 flex items-center justify-center gap-1.5 text-xs text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              چارت در حساب شما ذخیره شد
            </div>
          )}
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
      <PageHeader
        title="چارت تولد"
        subtitle="اطلاعات تولد خود را وارد کنید"
        action={
          <Button variant="ghost" size="sm" onClick={() => setShowZodiac(true)}>
            <Star className="w-4 h-4" />
            زودیاک
          </Button>
        }
      />

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