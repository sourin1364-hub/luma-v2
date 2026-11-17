import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { calculateLiveSky } from '../../engines/astronomy/liveSky';
import { calculateAspects } from '../../engines/astronomy/aspects';
import { getAllPlanets } from '../../engines/astronomy/planets';
import {
  calculatePlanetaryHours,
  formatLocalDateTime,
  localDateTimeToUtc,
  type PlanetaryHour,
} from '../../engines/astronomy/planetaryHours';
import type { Aspect, AspectType, PlanetName, PlanetPosition } from '../../engines/astronomy/types';
import { formatNum } from '../../i18n/format';
import { UI_TRANSLATIONS, useLanguageStore } from '../../i18n/useLanguageStore';
import {
  CalendarClock,
  Clock,
  Compass,
  Crosshair,
  Info,
  Loader2,
  MapPin,
  Orbit,
  RotateCcw,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { SkySphere3D } from './SkySphere3D';

interface SkyMap3DModalProps {
  latitude: number;
  longitude: number;
  cityName: string;
  timeZone: string;
  onClose: () => void;
}

interface ObserverLocation {
  latitude: number;
  longitude: number;
  name: string;
  timeZone: string;
  isGps: boolean;
}

interface Result<T> {
  value: T | null;
  error: string | null;
}

const PLANETS: PlanetName[] = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
];

const ASPECT_TYPES: AspectType[] = ['conjunction', 'sextile', 'square', 'trine', 'opposition'];

const ASPECT_COLORS: Record<AspectType, string> = {
  conjunction: '#f4cf67',
  sextile: '#62a8ff',
  square: '#ff596f',
  trine: '#56e39a',
  opposition: '#ff596f',
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unexpected astronomy calculation error.';

function getLocationErrorKey(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) return 'city_gps_error_denied';
  if (error.code === error.POSITION_UNAVAILABLE) return 'city_gps_error_unavailable';
  return 'city_gps_error_timeout';
}

function getCurrentHour(hours: PlanetaryHour[], date: Date) {
  const timestamp = date.getTime();
  return hours.find((hour) =>
    timestamp >= hour.start.getTime() && timestamp < hour.end.getTime()
  ) ?? null;
}

export function SkyMap3DModal({
  latitude,
  longitude,
  cityName,
  timeZone,
  onClose,
}: SkyMap3DModalProps) {
  const lang = useLanguageStore((state) => state.lang);
  const t = UI_TRANSLATIONS[lang];
  const gpsRequestedRef = useRef(false);
  const [now, setNow] = useState(() => new Date());
  const [location, setLocation] = useState<ObserverLocation>({
    latitude,
    longitude,
    name: cityName,
    timeZone: timeZone || 'Asia/Tehran',
    isGps: false,
  });
  const [localDateTime, setLocalDateTime] = useState(() =>
    formatLocalDateTime(new Date(), timeZone || 'Asia/Tehran')
  );
  const [isLive, setIsLive] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetName>('sun');
  const [showAspects, setShowAspects] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rendererError, setRendererError] = useState(false);
  const handleRendererError = useCallback(() => setRendererError(true), []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setLocation({
      latitude,
      longitude,
      name: cityName,
      timeZone: timeZone || 'Asia/Tehran',
      isGps: false,
    });
  }, [latitude, longitude, cityName, timeZone]);

  useEffect(() => {
    if (!isLive) return;
    try {
      setLocalDateTime(formatLocalDateTime(now, location.timeZone));
    } catch (error) {
      setLocationError(getErrorMessage(error));
    }
  }, [isLive, location.timeZone, now]);

  const requestGps = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError(t['city_gps_error_unsupported']);
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || location.timeZone;
        const nextLocation = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          name: t['sky_current_location'],
          timeZone: deviceTimeZone,
          isGps: true,
        };
        setLocation(nextLocation);
        if (isLive) setLocalDateTime(formatLocalDateTime(new Date(), deviceTimeZone));
        setIsLocating(false);
      },
      (error) => {
        setLocationError(t[getLocationErrorKey(error)]);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 }
    );
  }, [isLive, location.timeZone, t]);

  useEffect(() => {
    if (gpsRequestedRef.current) return;
    gpsRequestedRef.current = true;
    requestGps();
  }, [requestGps]);

  const useChartCity = () => {
    setLocation({
      latitude,
      longitude,
      name: cityName,
      timeZone: timeZone || 'Asia/Tehran',
      isGps: false,
    });
    setLocationError(null);
    if (isLive) setLocalDateTime(formatLocalDateTime(new Date(), timeZone || 'Asia/Tehran'));
  };

  const dateTimeResult = useMemo<Result<Date>>(() => {
    if (isLive) return { value: now, error: null };
    try {
      return { value: localDateTimeToUtc(localDateTime, location.timeZone), error: null };
    } catch (error) {
      return { value: null, error: getErrorMessage(error) };
    }
  }, [isLive, localDateTime, location.timeZone, now]);

  const selectedLocalDate = isLive
    ? formatLocalDateTime(now, location.timeZone).slice(0, 10)
    : localDateTime.slice(0, 10);

  const skyResult = useMemo<Result<ReturnType<typeof calculateLiveSky>>>(() => {
    if (!dateTimeResult.value) return { value: null, error: dateTimeResult.error };
    try {
      return {
        value: calculateLiveSky(dateTimeResult.value, location.latitude, location.longitude),
        error: null,
      };
    } catch (error) {
      return { value: null, error: getErrorMessage(error) };
    }
  }, [dateTimeResult, location.latitude, location.longitude]);

  const chartResult = useMemo<Result<{ planets: PlanetPosition[]; aspects: Aspect[] }>>(() => {
    if (!dateTimeResult.value) return { value: null, error: dateTimeResult.error };
    try {
      const planets = getAllPlanets(dateTimeResult.value);
      return {
        value: { planets, aspects: calculateAspects(planets) },
        error: null,
      };
    } catch (error) {
      return { value: null, error: getErrorMessage(error) };
    }
  }, [dateTimeResult, location.latitude, location.longitude]);

  const hoursResult = useMemo<Result<ReturnType<typeof calculatePlanetaryHours>>>(() => {
    try {
      return {
        value: calculatePlanetaryHours(
          selectedLocalDate,
          location.latitude,
          location.longitude,
          location.timeZone
        ),
        error: null,
      };
    } catch (error) {
      return { value: null, error: getErrorMessage(error) };
    }
  }, [selectedLocalDate, location.latitude, location.longitude, location.timeZone]);

  const skyObjects = skyResult.value ?? [];
  const aspects = chartResult.value?.aspects ?? [];
  const selectedObject = skyObjects.find((object) => object.id === selectedPlanet);
  const selectedPlanetPosition = chartResult.value?.planets.find((planet) => planet.planet === selectedPlanet);
  const currentPlanetaryHour = hoursResult.value && dateTimeResult.value
    ? getCurrentHour(hoursResult.value.hours, dateTimeResult.value)
    : null;

  const planetLabels = useMemo(() => Object.fromEntries(
    PLANETS.map((planet) => [planet, t[`chart_planet_${planet}`]])
  ) as Record<PlanetName, string>, [t]);
  const aspectLabels = useMemo(() => Object.fromEntries(
    ASPECT_TYPES.map((type) => [type, t[`sky_aspect_${type}`]])
  ) as Record<AspectType, string>, [t]);
  const planetMeanings = useMemo(() => Object.fromEntries(
    PLANETS.map((planet) => [planet, t[`sky_planet_meaning_${planet}`]])
  ) as Record<PlanetName, string>, [t]);

  const formatClock = (date: Date) => new Intl.DateTimeFormat(
    lang === 'fa' ? 'fa-IR' : lang === 'ar' ? 'ar' : lang === 'ckb' ? 'ku' : 'en',
    { timeZone: location.timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
  ).format(date);
  const selectedObjectLabel = selectedObject && selectedObject.kind === 'planet'
    ? planetLabels[selectedPlanet]
    : '';

  return (
    <div className="space-y-4 pb-24">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-[var(--luma-gold)]">
            <Orbit className="h-5 w-5" />
            {t['sky_title']}
          </h2>
          <p className="mt-1 text-[11px] text-[var(--luma-text-muted)]">
            {t['sky_subtitle_prefix']} {location.name}
          </p>
          <p className="mt-0.5 text-[10px] text-[var(--luma-text-muted)]">
            {t['sky_subtitle_suffix']}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t['sky_back_btn']}
          className="rounded-full border border-[var(--luma-border)] bg-[var(--luma-bg-elevated)] p-2 text-[var(--luma-text-muted)]"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 text-[10px] text-[var(--luma-text-muted)]">
          <span className="inline-flex items-center gap-1 text-[var(--luma-text)]">
            <MapPin className="h-3.5 w-3.5 text-[var(--luma-gold)]" />
            {formatNum(location.latitude.toFixed(3), lang)}, {formatNum(location.longitude.toFixed(3), lang)}
            {' · '}{location.timeZone}
          </span>
          <span className="mt-0.5 block">
            {isLive && <span className="text-emerald-400">● {t['sky_live_now']} · </span>}
            {dateTimeResult.value ? formatClock(dateTimeResult.value) : t['sky_invalid_time']}
          </span>
        </div>
        <div className="flex gap-2">
          {location.isGps && (
            <Button variant="secondary" size="sm" onClick={useChartCity}>
              <MapPin className="h-4 w-4" />
              {t['sky_use_chart_city']}
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={requestGps} disabled={isLocating}>
            {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
            {t['sky_use_gps']}
          </Button>
        </div>
      </div>
      {locationError && <p role="alert" className="text-xs text-amber-300">{locationError}</p>}

      <div className="relative overflow-hidden rounded-2xl border border-[var(--luma-gold)]/45 bg-[#030713] shadow-[0_0_40px_rgba(70,92,180,0.25)]">
        <SkySphere3D
          objects={skyObjects}
          aspects={aspects}
          selectedPlanet={selectedPlanet}
          zoom={zoom}
          showAspects={showAspects}
          planetLabels={planetLabels}
          aspectLabels={aspectLabels}
          ariaLabel={`${t['sky_title']} — ${location.name}`}
          interactionHint={t['sky_drag_hint']}
          onSelectPlanet={setSelectedPlanet}
          onRendererError={handleRendererError}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <button type="button" onClick={() => setZoom((value) => Math.min(1.7, value + 0.12))} className="rounded-xl border border-white/15 bg-black/70 p-2 text-[var(--luma-gold)]" title={t['sky_zoom_in']}>
            <ZoomIn className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setZoom((value) => Math.max(0.7, value - 0.12))} className="rounded-xl border border-white/15 bg-black/70 p-2 text-[var(--luma-gold)]" title={t['sky_zoom_out']}>
            <ZoomOut className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setZoom(1)} className="rounded-xl border border-white/15 bg-black/70 p-2 text-white" title={t['sky_reset']}>
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowAspects((value) => !value)}
          aria-pressed={showAspects}
          className="absolute right-3 top-3 rounded-xl border border-[var(--luma-gold)]/40 bg-black/70 px-2.5 py-1.5 text-[10px] font-bold text-[var(--luma-gold)]"
        >
          {showAspects ? t['sky_aspects_on'] : t['sky_aspects_off']}
        </button>
        {rendererError && (
          <div role="alert" className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-xl bg-black/85 p-4 text-center text-sm text-amber-200">
            {t['sky_webgl_error']}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {PLANETS.map((planet) => {
          const position = skyObjects.find((object) => object.id === planet);
          const chosen = planet === selectedPlanet;
          return (
            <button
              type="button"
              key={planet}
              onClick={() => setSelectedPlanet(planet)}
              aria-pressed={chosen}
              className={`flex min-w-0 items-center justify-between gap-1 rounded-xl border px-2 py-2 text-xs transition-colors ${chosen ? 'border-[var(--luma-gold)] bg-[var(--luma-gold)]/10 text-[var(--luma-gold)]' : 'border-[var(--luma-border)] bg-[var(--luma-bg-elevated)] text-[var(--luma-text)]'}`}
            >
              <span className="truncate">{planetLabels[planet]}</span>
              <span className={`shrink-0 text-[9px] ${position && position.altitude >= 0 ? 'text-emerald-300' : 'text-slate-400'}`}>
                {position && position.altitude >= 0 ? t['sky_above_horizon'] : t['sky_below_horizon']}
              </span>
            </button>
          );
        })}
      </div>

      <Card variant="gold-border" padding="md" className="space-y-2 text-xs">
        <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-[var(--luma-gold)]">
          <Compass className="h-4 w-4" />
          {t['sky_selected_planet']} {selectedObjectLabel}
        </h3>
        {selectedObject && selectedPlanetPosition ? (
          <>
            <p className="text-[var(--luma-text)]">
              {t['sky_altitude']}: <b>{formatNum(selectedObject.altitude.toFixed(1), lang)}°</b>
              {' · '}{t['sky_azimuth']}: <b>{formatNum(selectedObject.azimuth.toFixed(1), lang)}°</b>
              {' · '}{t['sky_sign']}: <b>{t[`chart_zodiac_${selectedPlanetPosition.sign}`]}</b>
              {' · '}{formatNum(selectedPlanetPosition.signDegree.toFixed(2), lang)}°
              {selectedPlanetPosition.retrograde ? ` · ${t['sky_retrograde']}` : ''}
            </p>
          </>
        ) : (
          <p role="alert" className="text-amber-300">{skyResult.error ?? t['sky_calculation_error']}</p>
        )}
      </Card>

      <Card variant="elevated" padding="md" className="space-y-3">
        <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-[var(--luma-gold)]">
          <Sparkles className="h-4 w-4" />
          {t['sky_aspect_patterns_title']}
        </h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[var(--luma-text-muted)]">
          {ASPECT_TYPES.map((type) => (
            <span key={type} className="inline-flex items-center gap-1">
              <i className="h-2 w-2 rounded-full" style={{ backgroundColor: ASPECT_COLORS[type] }} />
              {aspectLabels[type]}
            </span>
          ))}
        </div>
        {chartResult.value && chartResult.value.aspects.length > 0 ? (
          <div className="space-y-2">
            {chartResult.value.aspects.map((aspect) => (
              <AspectCard
                key={`${aspect.planet1}-${aspect.planet2}-${aspect.type}`}
                aspect={aspect}
                planetLabels={planetLabels}
                planetMeanings={planetMeanings}
                aspectLabel={aspectLabels[aspect.type]}
                explanation={t[`sky_aspect_${aspect.type}_meaning`]}
                orbLabel={t['sky_orb']}
                orb={formatNum(aspect.orb.toFixed(2), lang)}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--luma-text-muted)]">
            {chartResult.error ?? t['sky_no_aspects']}
          </p>
        )}
      </Card>

      <Card variant="elevated" padding="md" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-[var(--luma-gold)]">
            <CalendarClock className="h-4 w-4" />
            {t['sky_planetary_hours_title']}
          </h3>
          <Button
            variant={isLive ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => {
              setIsLive(true);
              setLocalDateTime(formatLocalDateTime(new Date(), location.timeZone));
            }}
          >
            <Clock className="h-3.5 w-3.5" />
            {t['sky_live_now']}
          </Button>
        </div>
        <label className="block space-y-1 text-[11px] text-[var(--luma-text-muted)]">
          <span>{t['sky_select_datetime']}</span>
          <input
            type="datetime-local"
            value={localDateTime}
            onChange={(event) => {
              setIsLive(false);
              setLocalDateTime(event.target.value);
            }}
            className="w-full rounded-xl border border-[var(--luma-border)] bg-[var(--luma-bg-elevated)] px-3 py-2 text-[var(--luma-text)]"
          />
        </label>
        {hoursResult.value ? (
          <>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-[var(--luma-bg-subtle)] p-3 text-xs">
              <span>{t['sky_sunrise']}: <b>{formatClock(hoursResult.value.sunrise)}</b></span>
              <span>{t['sky_sunset']}: <b>{formatClock(hoursResult.value.sunset)}</b></span>
            </div>
            {currentPlanetaryHour && (
              <div className="rounded-xl border border-[var(--luma-gold)]/50 bg-[var(--luma-gold)]/10 p-3">
                <p className="text-xs font-bold text-[var(--luma-gold)]">
                  {t['sky_current_planetary_hour']} {formatNum(currentPlanetaryHour.index, lang)}
                  {' · '}{t[`chart_planet_${currentPlanetaryHour.planet}`]}
                  {' · '}{t[`sky_nature_${currentPlanetaryHour.nature}`]}
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[var(--luma-text)]">
                  {t[`sky_hour_advice_${currentPlanetaryHour.planet}`]}
                </p>
              </div>
            )}
            <HourList
              hours={hoursResult.value.hours}
              currentHourIndex={currentPlanetaryHour?.index ?? null}
              formatClock={formatClock}
              lang={lang}
              translate={t}
            />
          </>
        ) : (
          <p role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-5 text-amber-200">
            {hoursResult.error?.includes('Sunrise') || hoursResult.error?.includes('Sunset')
              ? t['sky_polar_hours_unavailable']
              : t['sky_calculation_error']}
            {hoursResult.error && <span className="block text-[var(--luma-text-muted)]">{hoursResult.error}</span>}
          </p>
        )}
        <p className="flex gap-2 text-[10px] leading-5 text-[var(--luma-text-muted)]">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t['sky_planetary_hours_method_note']}
        </p>
      </Card>

      <Button variant="secondary" fullWidth onClick={onClose}>
        {t['sky_back_btn']}
      </Button>
    </div>
  );
}

function AspectCard({
  aspect,
  planetLabels,
  planetMeanings,
  aspectLabel,
  explanation,
  orbLabel,
  orb,
}: {
  aspect: Aspect;
  planetLabels: Record<PlanetName, string>;
  planetMeanings: Record<PlanetName, string>;
  aspectLabel: string;
  explanation: string;
  orbLabel: string;
  orb: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--luma-border)] bg-[var(--luma-bg-subtle)] p-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-1.5 font-bold text-[var(--luma-text)]">
          <i className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: ASPECT_COLORS[aspect.type] }} />
          <span className="truncate">{planetLabels[aspect.planet1]} · {aspectLabel} · {planetLabels[aspect.planet2]}</span>
        </p>
        <span className="shrink-0 text-[10px] text-[var(--luma-text-muted)]">{orbLabel} {orb}°</span>
      </div>
      <p className="mt-1 text-[10px] leading-4 text-[var(--luma-text-muted)]">
        {planetMeanings[aspect.planet1]} · {planetMeanings[aspect.planet2]}
      </p>
      <p className="mt-1 text-[11px] leading-5 text-[var(--luma-text-muted)]">{explanation}</p>
    </div>
  );
}

function HourList({
  hours,
  currentHourIndex,
  formatClock,
  lang,
  translate,
}: {
  hours: PlanetaryHour[];
  currentHourIndex: number | null;
  formatClock: (date: Date) => string;
  lang: 'fa' | 'ckb' | 'ar' | 'en';
  translate: Record<string, string>;
}) {
  return (
    <div className="space-y-3">
      {(['day', 'night'] as const).map((period) => (
        <section key={period}>
          <h4 className="mb-1.5 text-xs font-bold text-[var(--luma-text)]">
            {translate[period === 'day' ? 'sky_day_hours' : 'sky_night_hours']}
          </h4>
          <div className="space-y-1.5">
            {hours.filter((hour) => hour.period === period).map((hour) => {
              const isCurrent = currentHourIndex === hour.index;
              return (
                <div
                  key={hour.index}
                  className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg border px-2.5 py-2 ${isCurrent ? 'border-[var(--luma-gold)]/70 bg-[var(--luma-gold)]/10' : 'border-[var(--luma-border)] bg-[var(--luma-bg-subtle)]'}`}
                >
                  <span className="text-[10px] text-[var(--luma-text-muted)]">
                    {translate['sky_hour_number']} {formatNum(hour.index, lang)}
                  </span>
                  <span className="text-xs font-semibold text-[var(--luma-text)]">
                    {translate[`chart_planet_${hour.planet}`]}
                    <span className="ms-1 text-[10px] text-[var(--luma-gold)]">
                      {translate[`sky_nature_${hour.nature}`]}
                    </span>
                  </span>
                  <span className="text-[10px] text-[var(--luma-text-muted)]" dir="ltr">
                    {formatClock(hour.start)}–{formatClock(hour.end)}
                  </span>
                  <p className="col-span-3 text-[10px] leading-4 text-[var(--luma-text-muted)]">
                    {translate[`sky_hour_advice_${hour.planet}`]}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
