import { useMemo } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MoonPhaseSvg } from '../../components/ui/CosmicIcons';
import { Moon, Sun, Sparkles, X, Compass, AlertTriangle } from 'lucide-react';
import { calculateNatalChart } from '../../engines/astronomy/chart';
import { PLANET_NAMES_FA } from '../../engines/astronomy/constants';
import { toPersianDigits } from '../../engines/calendar/format';

interface CosmicCalendarModalProps {
  onClose: () => void;
}

const SIGN_NAMES_FA: Record<string, string> = {
  aries: 'فروردین (حمل)',
  taurus: 'اردیبهشت (ثور)',
  gemini: 'خرداد (جوزا)',
  cancer: 'تیر (سرطان)',
  leo: 'مرداد (اسد)',
  virgo: 'شهریور (سنبله)',
  libra: 'مهر (میزان)',
  scorpio: 'آبان (عقرب)',
  sagittarius: 'آذر (قوس)',
  capricorn: 'دی (جدی)',
  aquarius: 'بهمن (دلو)',
  pisces: 'اسفند (حوت)',
};

function getSignFa(sign: string): string {
  return SIGN_NAMES_FA[(sign || '').toLowerCase()] || sign;
}

function getMoonPhaseInfo(sunLon: number, moonLon: number) {
  const diff = (moonLon - sunLon + 360) % 360;
  const illumination = Math.round(((1 - Math.cos((diff * Math.PI) / 180)) / 2) * 100);

  if (diff < 22.5 || diff >= 337.5) {
    return {
      phaseIndex: 0,
      nameFa: 'ماه نو (محاق)',
      illumination,
      advice: 'بهترین زمان برای نیت‌گذاری، آغاز پروژه‌های تازه و کاشت بذر اهداف جدید است.',
    };
  }
  if (diff < 67.5) {
    return {
      phaseIndex: 1,
      nameFa: 'هلال فزاینده',
      illumination,
      advice: 'زمان برنامه‌ریزی، جمع‌آوری اطلاعات و برداشتن گام‌های اولیه در مسیر اهداف.',
    };
  }
  if (diff < 112.5) {
    return {
      phaseIndex: 2,
      nameFa: 'تربیع اول',
      illumination,
      advice: 'زمان اقدام قاطعانه، غلبه بر تردیدها و عبور از موانع اولیه است.',
    };
  }
  if (diff < 157.5) {
    return {
      phaseIndex: 3,
      nameFa: 'محدب فزاینده',
      illumination,
      advice: 'زمان پالایش، اصلاح مسیر و تمرکز بر جزئیات پیش از رسیدن به اوج.',
    };
  }
  if (diff < 202.5) {
    return {
      phaseIndex: 4,
      nameFa: 'ماه کامل (بدر)',
      illumination,
      advice: 'اوج انرژی و شهود! زمان برداشت نتیجه، روشن شدن حقایق و رهاسازی احساسات سنگین.',
    };
  }
  if (diff < 247.5) {
    return {
      phaseIndex: 5,
      nameFa: 'محدب کاهنده',
      illumination,
      advice: 'زمان شکرگزاری، به اشتراک گذاشتن تجربیات و مرور دستاوردهای اخیر.',
    };
  }
  if (diff < 292.5) {
    return {
      phaseIndex: 6,
      nameFa: 'تربیع آخر',
      illumination,
      advice: 'زمان بخشش، پاکسازی محیط و رها کردن عادت‌ها یا افکاری که دیگر به کارتان نمی‌آید.',
    };
  }
  return {
    phaseIndex: 7,
    nameFa: 'هلال کاهنده',
    illumination,
    advice: 'زمان استراحت، مراقبه، درون‌نگری و بازیابی انرژی پیش از شروع چرخه بعدی ماه.',
  };
}

export function CosmicCalendarModal({ onClose }: CosmicCalendarModalProps) {
  const now = useMemo(() => new Date(), []);

  const transitChart = useMemo(() => {
    return calculateNatalChart(now, 35.6892, 51.3890);
  }, [now]);

  const sunPlanet = transitChart.planets.find((p) => p.planet === 'sun');
  const moonPlanet = transitChart.planets.find((p) => p.planet === 'moon');

  const moonPhase = useMemo(() => {
    return getMoonPhaseInfo(sunPlanet?.longitude || 0, moonPlanet?.longitude || 0);
  }, [sunPlanet, moonPlanet]);

  const retrogrades = transitChart.planets.filter((p) => p.retrograde);

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-[var(--luma-gold)] flex items-center gap-2">
            <Compass className="w-5 h-5" />
            تقویم نجومی و ترانزیت امروز
          </h2>
          <p className="text-xs text-[var(--luma-text-muted)] mt-0.5">
            وضعیت زنده سیارات و فاز ماه در آسمان امروز
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] text-[var(--luma-text-muted)] hover:text-[var(--luma-text)]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <Card variant="gold-border" padding="lg" className="text-center">
        <div className="flex justify-center mb-3">
          <MoonPhaseSvg phaseIndex={moonPhase.phaseIndex} className="w-20 h-20" />
        </div>
        <h3 className="font-heading text-lg text-[var(--luma-text)] mb-1">{moonPhase.nameFa}</h3>
        <p className="text-xs text-[var(--luma-gold)] mb-3">
          روشنایی ماه: {toPersianDigits(moonPhase.illumination)}٪ • در برج{' '}
          {moonPlanet ? getSignFa(moonPlanet.sign) : ''}
        </p>
        <p className="text-xs text-[var(--luma-text-muted)] leading-relaxed text-justify">
          {moonPhase.advice}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-1.5 text-amber-500 mb-1">
            <Sun className="w-4 h-4" />
            <span className="text-xs font-bold">خورشید در آسمان</span>
          </div>
          <p className="font-heading text-sm text-[var(--luma-text)]">
            برج {sunPlanet ? getSignFa(sunPlanet.sign) : '—'}
          </p>
          <p className="text-[11px] text-[var(--luma-text-muted)] mt-0.5">
            درجه {toPersianDigits((sunPlanet?.signDegree || 0).toFixed(1))}°
          </p>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
            <Moon className="w-4 h-4" />
            <span className="text-xs font-bold">ماه در آسمان</span>
          </div>
          <p className="font-heading text-sm text-[var(--luma-text)]">
            برج {moonPlanet ? getSignFa(moonPlanet.sign) : '—'}
          </p>
          <p className="text-[11px] text-[var(--luma-text-muted)] mt-0.5">
            درجه {toPersianDigits((moonPlanet?.signDegree || 0).toFixed(1))}°
          </p>
        </Card>
      </div>

      {retrogrades.length > 0 && (
        <Card variant="elevated" padding="md" className="border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="font-heading text-xs font-bold">
              سیارات در حرکت برگشتی (Retrograde ℞)
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {retrogrades.map((p) => (
              <span
                key={p.planet}
                className="text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-[var(--luma-text)] border border-amber-500/30"
              >
                {PLANET_NAMES_FA[p.planet]} در {getSignFa(p.sign)} ℞
              </span>
            ))}
          </div>
        </Card>
      )}

      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">موقعیت لحظه‌ای سیارات</h3>
        </div>
        <div className="space-y-2 text-xs">
          {transitChart.planets.map((p) => (
            <div
              key={p.planet}
              className="flex items-center justify-between py-1.5 border-b border-[var(--luma-border)] last:border-0"
            >
              <span className="font-medium text-[var(--luma-text)]">{PLANET_NAMES_FA[p.planet]}</span>
              <div className="flex items-center gap-2">
                <span className="text-[var(--luma-gold)] font-medium">{getSignFa(p.sign)}</span>
                <span className="text-[var(--luma-text-muted)]">
                  {toPersianDigits(p.signDegree.toFixed(1))}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Button variant="secondary" fullWidth onClick={onClose}>
        بازگشت به صفحه اصلی
      </Button>
    </div>
  );
}
