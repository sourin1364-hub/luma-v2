import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2, Navigation, X } from 'lucide-react';
import { searchCities, findNearestCity } from '../../engines/location';
import type { CityWithProvince } from '../../engines/location';

interface CityPickerProps {
  value: CityWithProvince | null;
  onChange: (city: CityWithProvince) => void;
  placeholder?: string;
}

export function CityPicker({ value, onChange, placeholder = 'جستجوی شهر...' }: CityPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityWithProvince[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const debounceRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // جستجوی پویا با debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const found = await searchCities(query, 12);
        setResults(found);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query]);

  // بستن dropdown با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityWithProvince) => {
    onChange(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setGpsError(null);
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      setGpsError('مرورگر شما از GPS پشتیبانی نمی‌کند');
      return;
    }
    setIsLocating(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const nearest = await findNearestCity(pos.coords.latitude, pos.coords.longitude);
          if (nearest) {
            handleSelect(nearest);
          } else {
            setGpsError('شهر نزدیکی پیدا نشد');
          }
        } catch {
          setGpsError('خطا در پیدا کردن شهر');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setGpsError('دسترسی به موقعیت مکانی رد شد');
        setIsLocating(false);
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  // اگر شهری انتخاب شده
  if (value) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-gold)]/40">
          <MapPin className="w-4 h-4 text-[var(--luma-gold)] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--luma-text)] truncate">
              {value.name}
            </p>
            <p className="text-[10px] text-[var(--luma-text-muted)] truncate">
              {value.province_name} — {Number(value.lat).toFixed(3)}°, {Number(value.lon).toFixed(3)}°
            </p>
          </div>
          <button
            onClick={() => onChange(null as any)}
            className="p-1 rounded-full hover:bg-[var(--luma-bg-elevated)]"
            aria-label="حذف شهر"
          >
            <X className="w-4 h-4 text-[var(--luma-text-muted)]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-text-muted)] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pr-10 pl-10 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--luma-bg-elevated)]"
            aria-label="پاک کردن"
          >
            <X className="w-3 h-3 text-[var(--luma-text-muted)]" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--luma-gold)] animate-spin" />
        )}
      </div>

      {/* دکمه GPS */}
      <button
        onClick={handleGPS}
        disabled={isLocating}
        className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-xs text-[var(--luma-text-muted)] hover:border-[var(--luma-gold)] transition-colors disabled:opacity-50"
      >
        {isLocating ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            در حال پیدا کردن موقعیت...
          </>
        ) : (
          <>
            <Navigation className="w-3 h-3" />
            موقعیت فعلی من
          </>
        )}
      </button>

      {gpsError && (
        <p className="mt-1 text-[10px] text-red-400 text-center">{gpsError}</p>
      )}

      {/* نتایج */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] rounded-xl shadow-card z-50 no-scrollbar">
          {results.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              className="w-full text-right px-3 py-2.5 hover:bg-[var(--luma-bg-subtle)] transition-colors border-b border-[var(--luma-border)] last:border-0 first:rounded-t-xl last:rounded-b-xl"
            >
              <p className="text-sm font-medium text-[var(--luma-text)]">{city.name}</p>
              <p className="text-[10px] text-[var(--luma-text-muted)]">{city.province_name}</p>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] rounded-xl shadow-card z-50">
          <p className="text-xs text-[var(--luma-text-muted)] text-center">شهری پیدا نشد</p>
        </div>
      )}
    </div>
  );
}
