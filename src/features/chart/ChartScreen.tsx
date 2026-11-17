import { lazy, Suspense, useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DatePickerJalaali, type JalaaliDateValue } from '../../components/ui/DatePickerJalaali';
import { TimePicker, type TimeValue } from '../../components/ui/TimePicker';
import { CityPicker } from '../../components/ui/CityPicker';
import { ChartWheel } from '../../components/ui/ChartWheel';
import { ChartInterpretation } from '../../components/ui/ChartInterpretation';
import { SynastryView } from './SynastryView';
import { SubscriptionScreen } from '../subscription/SubscriptionScreen';
import { SubscriptionStatusNotice } from '../subscription/SubscriptionBadge';
import { MapPin, Clock, Calendar, Sparkles, Loader2, CheckCircle2, Heart, Lock } from 'lucide-react';
import { birthToUtc } from '../../engines/calendar/timezone';
import { calculateNatalChart } from '../../engines/astronomy/chart';
import type { NatalChart, PlanetName } from '../../engines/astronomy/types';
import type { CityWithProvince } from '../../engines/location';
import { saveChart } from './chartService';
import { useAuthStore } from '../../store/useAuthStore';
import { useSubscription } from '../../hooks/useSubscription';
import { formatJalaaliDate } from '../../engines/calendar/format';
import { useLanguageStore, UI_TRANSLATIONS, type TranslationKey } from '../../i18n/useLanguageStore';

const SkyMap3DModal = lazy(() =>
  import('./SkyMap3DModal').then((module) => ({ default: module.SkyMap3DModal }))
);

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
  timezone: 'Asia/Tehran',
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
  } catch {}
}

export function ChartScreen() {
  const lang = useLanguageStore((s) => s.lang);
  const kurdishCalendar = useLanguageStore((s) => s.kurdishCalendar) as 'shamsi' | 'miladi' | undefined;
  const t = UI_TRANSLATIONS[lang];

  const [showSky3D, setShowSky3D] = useState(false);
  const user = useAuthStore((s) => s.user);
  const subscription = useSubscription();
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
  const [showSynastry, setShowSynastry] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const skyCity = city || DEFAULT_CITY;
  const renderSkyMap = () => (
    <Suspense fallback={<div className="p-6 text-center text-sm text-[var(--luma-text-muted)]">{t['sky_loading']}</div>}>
      <SkyMap3DModal
        latitude={skyCity.lat}
        longitude={skyCity.lon}
        cityName={lang === 'en' ? skyCity.en_name || skyCity.name : skyCity.name}
        timeZone={skyCity.timezone || 'Asia/Tehran'}
        onClose={() => setShowSky3D(false)}
      />
    </Suspense>
  );

  useEffect(() => {
    saveState({ birthDate, birthTime, city, chart });
  }, [birthDate, birthTime, city, chart]);

  const handleCalculate = async () => {
    if (!city) {
      setError(t['chart_err_city']);
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
      setError(e instanceof Error ? e.message : t['chart_err_calc']);
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

  if (showSubscription) {
    return <SubscriptionScreen onBack={() => setShowSubscription(false)} />;
  }

  if (showSynastry && chart) {
    if (showSky3D) return renderSkyMap();
    return (
      <SynastryView
        person1Chart={chart}
        person1Name={user?.displayName || t['chart_you']}
        onBack={() => setShowSynastry(false)}
      />
    );
  }

  if (chart && city) {
    const sortedPlanets = PLANET_ORDER
      .map((name) => chart.planets.find((p) => p.planet === name))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    const canAccessSynastry = subscription.canUseSynastry();

    if (showSky3D) return renderSkyMap();
    return (
      <div className="space-y-5 pb-24">
        <SubscriptionStatusNotice error={subscription.error} />
        <button
          type="button"
          onClick={() => setShowSky3D(true)}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-900/50 to-amber-900/40 border border-[var(--luma-gold)]/50 flex items-center justify-between text-right hover:scale-[1.01] transition-all shadow-lg"
        >
          <div>
            <h4 className="font-heading text-xs sm:text-sm text-[var(--luma-gold)] font-bold">
              {t['chart_3d_banner_title']}
            </h4>
            <p className="text-[10px] text-[var(--luma-text-muted)] mt-0.5">
              {t['chart_3d_banner_desc']}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[var(--luma-gold)] text-[#0B0D1A] text-[10px] font-bold flex-shrink-0">
            {t['chart_3d_enter']}
          </span>
        </button>
        <PageHeader
          title={t['chart_title']}
          subtitle={`${formatJalaaliDate({ year: birthDate.year, month: birthDate.month, day: birthDate.day }, { lang, kurdishCalendar })} — ${birthTime.hour}:${String(birthTime.minute).padStart(2, '0')} — ${lang === 'en' ? (city.en_name || city.name) : city.name}`}
          action={
            <Button variant="ghost" size="sm" onClick={handleReset}>
              {t['chart_btn_edit']}
            </Button>
          }
        />

        {/* دکمه سیناستری (مقایسه دو چارت) */}
        <Card variant="gold-border" padding="sm">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <div>
                <h4 className="font-heading text-xs text-[var(--luma-text)] font-bold">
                  {t['chart_synastry_title']}
                </h4>
                <p className="text-[10px] text-[var(--luma-text-muted)]">
                  {t['chart_synastry_desc']}
                </p>
              </div>
            </div>
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                if (canAccessSynastry) {
                  setShowSynastry(true);
                } else {
                  setShowSubscription(true);
                }
              }}
            >
              {!canAccessSynastry && <Lock className="w-3 h-3" />}
              {canAccessSynastry ? t['chart_synastry_start'] : t['chart_synastry_locked']}
            </Button>
          </div>
        </Card>

        <Card variant="glass" padding="md">
          {saved && (
            <div className="mb-3 flex items-center justify-center gap-1.5 text-xs text-green-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t['chart_saved_success']}
            </div>
          )}
          <ChartWheel chart={chart} size={340} />
        </Card>

        <ChartInterpretation chart={chart} />

        <Card variant="elevated" padding="md">
          <h3 className="font-heading text-lg text-[var(--luma-text)] mb-3">{t['chart_planet_positions']}</h3>
          <div className="space-y-2 text-sm">
            {sortedPlanets.map((p) => (
              <div
                key={p.planet}
                className="flex items-center justify-between py-1.5 border-b border-[var(--luma-border)] last:border-0"
              >
                <span className="text-[var(--luma-text)] font-medium">
                  {t[`chart_planet_${p.planet}` as TranslationKey] || p.planet}
                </span>
                <span className="text-[var(--luma-text-muted)] text-xs">
                  {p.signDegree.toFixed(1)}°{' '}
                  {p.retrograde && <span className="text-amber-500">℞</span>}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (showSky3D) return renderSkyMap();
  return (
    <div className="space-y-5 pb-24">
      <SubscriptionStatusNotice error={subscription.error} />
      <button
        type="button"
        onClick={() => setShowSky3D(true)}
        className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-900/50 to-amber-900/40 border border-[var(--luma-gold)]/50 flex items-center justify-between text-right hover:scale-[1.01] transition-all shadow-lg"
      >
        <div>
          <h4 className="font-heading text-xs sm:text-sm text-[var(--luma-gold)] font-bold">
            {t['chart_3d_banner_title']}
          </h4>
          <p className="text-[10px] text-[var(--luma-text-muted)] mt-0.5">
            {t['chart_3d_banner_desc']}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[var(--luma-gold)] text-[#0B0D1A] text-[10px] font-bold flex-shrink-0">
          {t['chart_3d_enter']}
        </span>
      </button>
      <PageHeader
        title={t['chart_title']}
        subtitle={t['chart_subtitle']}
      />

      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">{t['chart_birth_date']}</h3>
        </div>
        <DatePickerJalaali value={birthDate} onChange={setBirthDate} />
      </Card>

      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">{t['chart_birth_time']}</h3>
        </div>
        <TimePicker value={birthTime} onChange={setBirthTime} />
      </Card>

      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">{t['chart_birth_city']}</h3>
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
            {t['chart_calculating']}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {t['chart_calc_btn']}
          </>
        )}
      </Button>
    </div>
  );
}