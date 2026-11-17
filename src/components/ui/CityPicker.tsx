import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Navigation, ExternalLink, AlertTriangle, Check, Crosshair, Loader2 } from 'lucide-react';
import { loadCitiesWithProvinces, findNearestCity } from '../../engines/location/cities';
import type { CityWithProvince } from '../../engines/location/types';
import { useLanguageStore, UI_TRANSLATIONS, type TranslationKey } from '../../i18n/useLanguageStore';
import { formatNum } from '../../i18n/format';

interface CityPickerProps {
  value: CityWithProvince | null;
  onChange: (city: CityWithProvince) => void;
}

const GLOBAL_CITIES: CityWithProvince[] = [
  { id: 9001, name: 'اربیل (هەولێر)', en_name: 'Erbil', province_id: 90, province_name: 'اقلیم کردستان', lat: 36.1901, lon: 44.0091, timezone: 'Asia/Baghdad' },
  { id: 9002, name: 'سلیمانیه (سلێمانی)', en_name: 'Sulaymaniyah', province_id: 90, province_name: 'اقلیم کردستان', lat: 35.5650, lon: 45.4329, timezone: 'Asia/Baghdad' },
  { id: 9003, name: 'بغداد', en_name: 'Baghdad', province_id: 91, province_name: 'عراق', lat: 33.3152, lon: 44.3661, timezone: 'Asia/Baghdad' },
  { id: 9004, name: 'دبی (Dubai)', en_name: 'Dubai', province_id: 92, province_name: 'امارات', lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai' },
  { id: 9005, name: 'استانبول (Istanbul)', en_name: 'Istanbul', province_id: 93, province_name: 'ترکیه', lat: 41.0082, lon: 28.9784, timezone: 'Europe/Istanbul' },
  { id: 9006, name: 'لندن (London)', en_name: 'London', province_id: 94, province_name: 'بریتانیا', lat: 51.5072, lon: -0.1276, timezone: 'Europe/London' },
  { id: 9007, name: 'پاریس (Paris)', en_name: 'Paris', province_id: 95, province_name: 'فرانسه', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
  { id: 9008, name: 'فرانکفورت (Frankfurt)', en_name: 'Frankfurt', province_id: 96, province_name: 'آلمان', lat: 50.1109, lon: 8.6821, timezone: 'Europe/Berlin' },
  { id: 9009, name: 'تورنتو (Toronto)', en_name: 'Toronto', province_id: 97, province_name: 'کانادا', lat: 43.6532, lon: -79.3832, timezone: 'America/Toronto' },
  { id: 9010, name: 'لس‌آنجلس (Los Angeles)', en_name: 'Los Angeles', province_id: 98, province_name: 'آمریکا', lat: 34.0522, lon: -118.2437, timezone: 'America/Los_Angeles' },
];

const GLOBAL_CITY_KEY_MAP: Record<number, { nameKey: TranslationKey; provKey: TranslationKey }> = {
  9001: { nameKey: 'city_erbil', provKey: 'prov_kurdistan_region' },
  9002: { nameKey: 'city_sulaymaniyah', provKey: 'prov_kurdistan_region' },
  9003: { nameKey: 'city_baghdad', provKey: 'prov_iraq' },
  9004: { nameKey: 'city_dubai', provKey: 'prov_uae' },
  9005: { nameKey: 'city_istanbul', provKey: 'prov_turkey' },
  9006: { nameKey: 'city_london', provKey: 'prov_uk' },
  9007: { nameKey: 'city_paris', provKey: 'prov_france' },
  9008: { nameKey: 'city_frankfurt', provKey: 'prov_germany' },
  9009: { nameKey: 'city_toronto', provKey: 'prov_canada' },
  9010: { nameKey: 'city_los_angeles', provKey: 'prov_usa' },
};

function localizeCity(
  city: CityWithProvince,
  t: Record<TranslationKey, string>,
  lang: 'fa' | 'ckb' | 'ar' | 'en'
): CityWithProvince {
  const m = GLOBAL_CITY_KEY_MAP[city.id];
  if (m) return { ...city, name: t[m.nameKey], province_name: t[m.provKey] };
  if (lang === 'fa') return city;
  return {
    ...city,
    name: city.en_name || city.name,
    province_name: city.province_en_name || city.province_name,
  };
}

export function CityPicker({ value, onChange }: CityPickerProps) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];
  const [cities, setCities] = useState<CityWithProvince[]>([]);
  const [query, setQuery] = useState('');
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsSuccess, setGpsSuccess] = useState<string | null>(null);

  // مختصات فعلی روی نقشه (پیش‌فرض: شهر انتخاب‌شده یا تهران)
  const [mapCoords, setMapCoords] = useState<{ lat: number; lon: number }>({
    lat: value?.lat || 35.6892,
    lon: value?.lon || 51.3890,
  });

  useEffect(() => {
    let mounted = true;
    loadCitiesWithProvinces()
      .then((list: CityWithProvince[]) => {
        if (mounted) {
          setCities([...list, ...GLOBAL_CITIES]);
          setIsLoadingCities(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoadingCities(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (value?.lat && value?.lon) {
      setMapCoords({ lat: value.lat, lon: value.lon });
    }
  }, [value?.lat, value?.lon]);

  const filteredCities = useMemo(() => {
    if (!query.trim()) return cities.slice(0, 30);
    const q = query.trim().toLowerCase();
    return cities
      .filter((c) => {
        const loc = localizeCity(c, t, lang);
        return (
          c.name.toLowerCase().includes(q) ||
          loc.name.toLowerCase().includes(q) ||
          c.province_name.toLowerCase().includes(q) ||
          loc.province_name.toLowerCase().includes(q) ||
          (c.en_name && c.en_name.toLowerCase().includes(q))
        );
      })
      .slice(0, 30);
  }, [cities, query, t, lang]);

  useEffect(() => {
    if (query.trim() && filteredCities.length > 0) {
      const first = filteredCities[0];
      setMapCoords({ lat: first.lat, lon: first.lon });
    }
  }, [query, filteredCities]);

  const handleSelectCity = (city: CityWithProvince) => {
    setMapCoords({ lat: city.lat, lon: city.lon });
    setGpsError(null);
    onChange(city);
  };

  const handleGetGpsLocation = () => {
    setGpsError(null);
    setGpsSuccess(null);

    if (!('geolocation' in navigator)) {
      setGpsError(t['city_gps_error_unsupported']);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lon = Number(pos.coords.longitude.toFixed(5));
        setMapCoords({ lat, lon });

        try {
          const nearest = await findNearestCity(lat, lon);
          if (nearest) {
            const exactCity: CityWithProvince = {
              ...nearest,
              lat,
              lon,
            };
            onChange(exactCity);
            setQuery(nearest.name);
            const locNearest = localizeCity(nearest, t, lang);
            setGpsSuccess(
              `${t['city_gps_success_exact_prefix']}${locNearest.name} (${locNearest.province_name}) — ${t['city_gps_success_exact_lat_label']}${formatNum(lat, lang)}, ${t['city_gps_success_exact_lon_label']}${formatNum(lon, lang)}`
            );
          } else {
            const customCity: CityWithProvince = {
              id: Date.now(),
              name: t['city_gps_custom_name'],
              en_name: 'GPS Location',
              province_id: 0,
              province_name: t['city_gps_custom_province'],
              lat,
              lon,
              timezone: 'Asia/Tehran',
            };
            onChange(customCity);
            setGpsSuccess(
              `${t['city_gps_success_coords_prefix']}${formatNum(lat, lang)}, ${formatNum(lon, lang)}${t['city_gps_success_coords_suffix']}`
            );
          }
        } catch {
          setGpsError(t['city_gps_error_match']);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError(t['city_gps_error_denied']);
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setGpsError(t['city_gps_error_unavailable']);
        } else {
          setGpsError(t['city_gps_error_timeout']);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  const handleManualNudge = async (dLat: number, dLon: number) => {
    const newLat = Number((mapCoords.lat + dLat).toFixed(4));
    const newLon = Number((mapCoords.lon + dLon).toFixed(4));
    setMapCoords({ lat: newLat, lon: newLon });

    const nearest = await findNearestCity(newLat, newLon);
    if (nearest) {
      onChange({
        ...nearest,
        lat: newLat,
        lon: newLon,
      });
    }
  };

  const nativeMapUrl = `https://www.google.com/maps/search/?api=1&query=${mapCoords.lat},${mapCoords.lon}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapCoords.lon - 0.08}%2C${mapCoords.lat - 0.06}%2C${mapCoords.lon + 0.08}%2C${mapCoords.lat + 0.06}&layer=mapnik&marker=${mapCoords.lat}%2C${mapCoords.lon}`;

  return (
    <div className="space-y-3">
      {/* ۱. کادر جستجوی سریع شهر و دکمه GPS */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t['city_search_ph']}
            className="w-full pr-9 pl-3 py-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-xs focus:outline-none focus:border-[var(--luma-gold)]"
          />
        </div>

        <button
          type="button"
          onClick={handleGetGpsLocation}
          disabled={isLocating}
          className="px-3 py-2.5 rounded-xl bg-[var(--luma-gold)] text-[#0B0D1A] font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 disabled:opacity-50 flex-shrink-0"
          title={t['city_gps_title']}
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          <span>{t['city_gps_btn']}</span>
        </button>
      </div>

      {/* پیام هشدار در صورت خاموش بودن GPS یا عدم صدور مجوز */}
      {gpsError && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-300 leading-relaxed text-justify">{gpsError}</p>
        </div>
      )}

      {gpsSuccess && (
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-[11px] text-emerald-400">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{gpsSuccess}</span>
        </div>
      )}

      {/* ۲. لیست شهرهای پیشنهادی بر اساس جستجو */}
      <div className="max-h-36 overflow-y-auto rounded-xl border border-[var(--luma-border)] bg-[var(--luma-bg-subtle)] divide-y divide-[var(--luma-border)]">
        {isLoadingCities ? (
          <div className="p-3 text-center text-xs text-[var(--luma-text-muted)]">
            {t['city_loading']}
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="p-3 text-center text-xs text-[var(--luma-text-muted)]">
            {t['city_not_found']}
          </div>
        ) : (
          filteredCities.map((c) => {
            const loc = localizeCity(c, t, lang);
            const isSelected = value?.id === c.id;
            return (
              <button
                key={`${c.id}-${c.name}`}
                type="button"
                onClick={() => handleSelectCity(c)}
                className={
                  'w-full px-3 py-2 text-right flex items-center justify-between text-xs transition-colors ' +
                  (isSelected
                    ? 'bg-[var(--luma-gold)]/20 text-[var(--luma-gold)] font-bold'
                    : 'text-[var(--luma-text)] hover:bg-[var(--luma-bg-elevated)]')
                }
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--luma-gold)]" />
                  <span>{loc.name}</span>
                  <span className="text-[10px] text-[var(--luma-text-muted)]">({loc.province_name})</span>
                </div>
                <span className="text-[10px] text-[var(--luma-text-subtle)]" dir="ltr">
                  {c.lat.toFixed(2)}, {c.lon.toFixed(2)}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* ۳. نقشه زنده در زیر کادر جستجو + کنترل تنظیم دقیق دستی + باز کردن در Google Maps گوشی */}
      <div className="rounded-2xl overflow-hidden border border-[var(--luma-gold)]/40 bg-[var(--luma-bg-elevated)]">
        <div className="px-3 py-2 bg-[var(--luma-bg-subtle)] border-b border-[var(--luma-border)] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[var(--luma-text)] font-medium">
            <Crosshair className="w-3.5 h-3.5 text-[var(--luma-gold)]" />
            <span>
              {t['city_map_header']} {value ? localizeCity(value, t, lang).name : t['city_map_default_city']}{' '}
              <span className="text-[10px] text-[var(--luma-text-muted)]">
                ({formatNum(mapCoords.lat.toFixed(3), lang)}°, {formatNum(mapCoords.lon.toFixed(3), lang)}°)
              </span>
            </span>
          </div>

          <a
            href={nativeMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-[var(--luma-gold)]/15 text-[var(--luma-gold)] hover:bg-[var(--luma-gold)]/25 transition-colors font-bold"
          >
            <ExternalLink className="w-3 h-3" />
            <span>{t['city_open_in_map']}</span>
          </a>
        </div>

        <div className="relative w-full h-48 bg-slate-900">
          <iframe
            title={t['city_map_iframe_title']}
            src={osmEmbedUrl}
            className="w-full h-full border-0"
            loading="lazy"
          />
          {/* دکمه‌های جابجایی دستی پین روی نقشه */}
          <div className="absolute bottom-2 left-2 flex gap-1 bg-black/75 backdrop-blur-sm p-1 rounded-xl border border-white/15">
            <button
              type="button"
              onClick={() => handleManualNudge(0.02, 0)}
              className="px-2 py-1 text-[10px] text-white hover:text-[var(--luma-gold)]"
              title={t['city_north']}
            >
              {t['city_north']}
            </button>
            <button
              type="button"
              onClick={() => handleManualNudge(-0.02, 0)}
              className="px-2 py-1 text-[10px] text-white hover:text-[var(--luma-gold)]"
              title={t['city_south']}
            >
              {t['city_south']}
            </button>
            <button
              type="button"
              onClick={() => handleManualNudge(0, 0.02)}
              className="px-2 py-1 text-[10px] text-white hover:text-[var(--luma-gold)]"
              title={t['city_east']}
            >
              {t['city_east']}
            </button>
            <button
              type="button"
              onClick={() => handleManualNudge(0, -0.02)}
              className="px-2 py-1 text-[10px] text-white hover:text-[var(--luma-gold)]"
              title={t['city_west']}
            >
              {t['city_west']}
            </button>
          </div>
        </div>

        <div className="px-3 py-2 bg-[var(--luma-bg-subtle)] text-[10px] text-[var(--luma-text-muted)] leading-relaxed text-justify">
          {t['city_map_note']}
        </div>
      </div>
    </div>
  );
}