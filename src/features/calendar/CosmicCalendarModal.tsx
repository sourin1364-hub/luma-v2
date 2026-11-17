import { useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MoonPhaseSvg } from '../../components/ui/CosmicIcons';
import { Moon, Sun, Sparkles, X, Compass, AlertTriangle } from 'lucide-react';
import { calculateNatalChart } from '../../engines/astronomy/chart';
import { useLanguageStore, UI_TRANSLATIONS } from '../../i18n/useLanguageStore';
import { formatNum } from '../../i18n/format';

interface CosmicCalendarModalProps {
  onClose: () => void;
}

function getMoonPhaseKey(sunLon: number, moonLon: number) {
  const diff = (moonLon - sunLon + 360) % 360;
  const illumination = Math.round(((1 - Math.cos((diff * Math.PI) / 180)) / 2) * 100);

  if (diff < 22.5 || diff >= 337.5) return { phaseIndex: 0, nameKey: 'moon_phase_0', adviceKey: 'moon_advice_0', illumination };
  if (diff < 67.5) return { phaseIndex: 1, nameKey: 'moon_phase_1', adviceKey: 'moon_advice_1', illumination };
  if (diff < 112.5) return { phaseIndex: 2, nameKey: 'moon_phase_2', adviceKey: 'moon_advice_2', illumination };
  if (diff < 157.5) return { phaseIndex: 3, nameKey: 'moon_phase_3', adviceKey: 'moon_advice_3', illumination };
  if (diff < 202.5) return { phaseIndex: 4, nameKey: 'moon_phase_4', adviceKey: 'moon_advice_4', illumination };
  if (diff < 247.5) return { phaseIndex: 5, nameKey: 'moon_phase_5', adviceKey: 'moon_advice_5', illumination };
  if (diff < 292.5) return { phaseIndex: 6, nameKey: 'moon_phase_6', adviceKey: 'moon_advice_6', illumination };
  return { phaseIndex: 7, nameKey: 'moon_phase_7', adviceKey: 'moon_advice_7', illumination };
}

export function CosmicCalendarModal({ onClose }: CosmicCalendarModalProps) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const now = useMemo(() => new Date(), []);
  const transitChart = useMemo(() => calculateNatalChart(now, 35.6892, 51.3890), [now]);

  const sunPlanet = transitChart.planets.find((p) => p.planet === 'sun');
  const moonPlanet = transitChart.planets.find((p) => p.planet === 'moon');
  const moonPhase = useMemo(() => getMoonPhaseKey(sunPlanet?.longitude || 0, moonPlanet?.longitude || 0), [sunPlanet, moonPlanet]);

  const retrogrades = transitChart.planets.filter((p) => p.retrograde);

  const getSign = (signKey: string) => t[`chart_zodiac_${signKey}`] || signKey;
  const getPlanet = (planetKey: string) => t[`chart_planet_${planetKey}`] || planetKey;

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-[var(--luma-gold)] flex items-center gap-2">
            <Compass className="w-5 h-5" />
            {t['cosmic_calendar_title']}
          </h2>
          <p className="text-xs text-[var(--luma-text-muted)] mt-0.5">
            {t['cosmic_calendar_subtitle']}
          </p>
        </div>
        <button type="button" onClick={onClose} className="p-2 rounded-full bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text-muted)] hover:text-[var(--luma-text)]">
          <X className="w-4 h-4" />
        </button>
      </div>

      <Card variant="gold-border" padding="lg" className="text-center">
        <div className="flex justify-center mb-3">
          <MoonPhaseSvg phaseIndex={moonPhase.phaseIndex} className="w-20 h-20" />
        </div>
        <h3 className="font-heading text-lg text-[var(--luma-text)] mb-1">{t[moonPhase.nameKey]}</h3>
        <p className="text-xs text-[var(--luma-gold)] mb-3">
          {t['cosmic_calendar_illumination']} {formatNum(moonPhase.illumination, lang)}{lang === 'en' ? '%' : '٪'} • {t['cosmic_calendar_in_sign']} {moonPlanet ? getSign(moonPlanet.sign) : ''}
        </p>
        <p className="text-xs text-[var(--luma-text-muted)] leading-relaxed text-justify">
          {t[moonPhase.adviceKey]}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-1.5 text-amber-500 mb-1">
            <Sun className="w-4 h-4" />
            <span className="text-xs font-bold">{t['cosmic_calendar_sun_in_sky']}</span>
          </div>
          <p className="font-heading text-sm text-[var(--luma-text)]">{t['cosmic_calendar_sign']} {sunPlanet ? getSign(sunPlanet.sign) : '—'}</p>
          <p className="text-[11px] text-[var(--luma-text-muted)] mt-0.5">{t['cosmic_calendar_degree']} {formatNum((sunPlanet?.signDegree || 0).toFixed(1), lang)}°</p>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
            <Moon className="w-4 h-4" />
            <span className="text-xs font-bold">{t['cosmic_calendar_moon_in_sky']}</span>
          </div>
          <p className="font-heading text-sm text-[var(--luma-text)]">{t['cosmic_calendar_sign']} {moonPlanet ? getSign(moonPlanet.sign) : '—'}</p>
          <p className="text-[11px] text-[var(--luma-text-muted)] mt-0.5">{t['cosmic_calendar_degree']} {formatNum((moonPlanet?.signDegree || 0).toFixed(1), lang)}°</p>
        </Card>
      </div>

      {retrogrades.length > 0 && (
        <Card variant="elevated" padding="md" className="border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="font-heading text-xs font-bold">{t['cosmic_calendar_retrograde']}</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {retrogrades.map((p) => (
              <span key={p.planet} className="text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-[var(--luma-text)] border border-amber-500/30">
                {getPlanet(p.planet)} {t['cosmic_calendar_in_sign']} {getSign(p.sign)} ℞
              </span>
            ))}
          </div>
        </Card>
      )}

      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">{t['cosmic_calendar_live_positions']}</h3>
        </div>
        <div className="space-y-2 text-xs">
          {transitChart.planets.map((p) => (
            <div key={p.planet} className="flex items-center justify-between py-1.5 border-b border-[var(--luma-border)] last:border-0">
              <span className="font-medium text-[var(--luma-text)]">{getPlanet(p.planet)}</span>
              <div className="flex items-center gap-2">
                <span className="text-[var(--luma-gold)] font-medium">{getSign(p.sign)}</span>
                <span className="text-[var(--luma-text-muted)]">{formatNum(p.signDegree.toFixed(1), lang)}°</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Button variant="secondary" fullWidth onClick={onClose}>{t['sky_back_btn']}</Button>
    </div>
  );
}