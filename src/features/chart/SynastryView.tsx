import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DatePickerJalaali, type JalaaliDateValue } from '../../components/ui/DatePickerJalaali';
import { TimePicker, type TimeValue } from '../../components/ui/TimePicker';
import { CityPicker } from '../../components/ui/CityPicker';
import { Heart, Sparkles, Users, Flame, Brain, ShieldCheck } from 'lucide-react';
import { birthToUtc } from '../../engines/calendar/timezone';
import { calculateNatalChart } from '../../engines/astronomy/chart';
import type { NatalChart } from '../../engines/astronomy/types';
import type { CityWithProvince } from '../../engines/location';
import { toPersianDigits } from '../../engines/calendar/format';

interface SynastryViewProps {
  person1Chart: NatalChart;
  person1Name?: string;
  onBack: () => void;
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

const SIGN_ELEMENT_FA: Record<string, string> = {
  aries: 'آتش',
  leo: 'آتش',
  sagittarius: 'آتش',
  taurus: 'خاک',
  virgo: 'خاک',
  capricorn: 'خاک',
  gemini: 'باد',
  libra: 'باد',
  aquarius: 'باد',
  cancer: 'آب',
  scorpio: 'آب',
  pisces: 'آب',
};

function getSignFa(sign: string): string {
  return SIGN_NAMES_FA[(sign || '').toLowerCase()] || sign;
}

function getElementFa(sign: string): string {
  return SIGN_ELEMENT_FA[(sign || '').toLowerCase()] || 'کیهانی';
}

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

function angleDiff(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function scorePlanetPair(lon1: number, lon2: number): number {
  const diff = angleDiff(lon1, lon2);
  if (diff <= 12 || Math.abs(diff - 120) <= 12 || Math.abs(diff - 60) <= 10) return 92;
  if (Math.abs(diff - 180) <= 12) return 78;
  if (Math.abs(diff - 90) <= 10) return 62;
  return 74;
}

export function SynastryView({ person1Chart, person1Name = 'شما', onBack }: SynastryViewProps) {
  const [partnerName, setPartnerName] = useState('');
  const [birthDate, setBirthDate] = useState<JalaaliDateValue>({ year: 1368, month: 7, day: 15 });
  const [birthTime, setBirthTime] = useState<TimeValue>({ hour: 12, minute: 0 });
  const [city, setCity] = useState<CityWithProvince | null>(DEFAULT_CITY);
  const [partnerChart, setPartnerChart] = useState<NatalChart | null>(null);

  const handleCalculateSynastry = () => {
    const selectedCity = city || DEFAULT_CITY;
    const utc = birthToUtc(birthDate, birthTime.hour, birthTime.minute, selectedCity.timezone || 'Asia/Tehran');
    const c2 = calculateNatalChart(utc, selectedCity.lat, selectedCity.lon);
    setPartnerChart(c2);
  };

  if (partnerChart) {
    const p1Sun = person1Chart.planets.find((p) => p.planet === 'sun')!;
    const p1Moon = person1Chart.planets.find((p) => p.planet === 'moon')!;
    const p1Venus = person1Chart.planets.find((p) => p.planet === 'venus')!;
    const p1Mercury = person1Chart.planets.find((p) => p.planet === 'mercury')!;

    const p2Sun = partnerChart.planets.find((p) => p.planet === 'sun')!;
    const p2Moon = partnerChart.planets.find((p) => p.planet === 'moon')!;
    const p2Venus = partnerChart.planets.find((p) => p.planet === 'venus')!;
    const p2Mercury = partnerChart.planets.find((p) => p.planet === 'mercury')!;

    const emotionalScore = Math.round(
      (scorePlanetPair(p1Moon.longitude, p2Moon.longitude) +
        scorePlanetPair(p1Sun.longitude, p2Moon.longitude)) /
        2
    );
    const romanticScore = Math.round(
      (scorePlanetPair(p1Venus.longitude, p2Venus.longitude) +
        scorePlanetPair(p1Sun.longitude, p2Venus.longitude)) /
        2
    );
    const mentalScore = scorePlanetPair(p1Mercury.longitude, p2Mercury.longitude);
    const overallScore = Math.round((emotionalScore + romanticScore + mentalScore) / 3);

    return (
      <div className="space-y-5 pb-24">
        <PageHeader
          title="نتیجه سیناستری و تطابق دو چارت"
          subtitle={`${person1Name} و ${partnerName.trim() || 'طرف مقابل'}`}
          onBack={() => setPartnerChart(null)}
        />

        <Card variant="gold-border" padding="lg" className="text-center">
          <Heart className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <div className="text-4xl font-heading font-bold text-[var(--luma-gold)] mb-1">
            {toPersianDigits(overallScore)}٪
          </div>
          <p className="text-xs text-[var(--luma-text)] font-medium">شاخص کل هماهنگی کیهانی</p>
          <p className="text-xs text-[var(--luma-text-muted)] mt-2 leading-relaxed text-justify">
            ترکیب خورشید در {getSignFa(p1Sun.sign)} (عنصر {getElementFa(p1Sun.sign)}) با خورشید در{' '}
            {getSignFa(p2Sun.sign)} (عنصر {getElementFa(p2Sun.sign)}) پیوندی با پتانسیل رشد متقابل و درک عاطفی ایجاد می‌کند.
          </p>
        </Card>

        <div className="grid grid-cols-3 gap-2.5">
          <Card variant="elevated" padding="sm" className="text-center">
            <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
            <p className="text-base font-bold text-[var(--luma-text)]">{toPersianDigits(emotionalScore)}٪</p>
            <p className="text-[10px] text-[var(--luma-text-muted)]">پیوند عاطفی (ماه)</p>
          </Card>
          <Card variant="elevated" padding="sm" className="text-center">
            <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-base font-bold text-[var(--luma-text)]">{toPersianDigits(romanticScore)}٪</p>
            <p className="text-[10px] text-[var(--luma-text-muted)]">جاذبه و عشق (ناهید)</p>
          </Card>
          <Card variant="elevated" padding="sm" className="text-center">
            <Brain className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <p className="text-base font-bold text-[var(--luma-text)]">{toPersianDigits(mentalScore)}٪</p>
            <p className="text-[10px] text-[var(--luma-text-muted)]">تفاهم فکری (تیر)</p>
          </Card>
        </div>

        <Card variant="elevated" padding="md">
          <h3 className="font-heading text-sm text-[var(--luma-gold)] mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            مقایسه سیارات کلیدی دو چارت
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-[var(--luma-border)]">
              <span className="text-[var(--luma-text-muted)]">خورشید (هویت):</span>
              <span className="text-[var(--luma-text)]">
                {getSignFa(p1Sun.sign)} ⟷ {getSignFa(p2Sun.sign)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--luma-border)]">
              <span className="text-[var(--luma-text-muted)]">ماه (احساسات):</span>
              <span className="text-[var(--luma-text)]">
                {getSignFa(p1Moon.sign)} ⟷ {getSignFa(p2Moon.sign)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[var(--luma-border)]">
              <span className="text-[var(--luma-text-muted)]">ناهید (سبک عشق):</span>
              <span className="text-[var(--luma-text)]">
                {getSignFa(p1Venus.sign)} ⟷ {getSignFa(p2Venus.sign)}
              </span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-[var(--luma-text-muted)]">تیر (گفتگو و ذهن):</span>
              <span className="text-[var(--luma-text)]">
                {getSignFa(p1Mercury.sign)} ⟷ {getSignFa(p2Mercury.sign)}
              </span>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="md">
          <h3 className="font-heading text-sm text-[var(--luma-gold)] mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            توصیه لوما برای بهبود رابطه
          </h3>
          <p className="text-xs text-[var(--luma-text-muted)] leading-relaxed text-justify">
            برای حفظ تعادل بین نیازهای عاطفی ماه در {getSignFa(p1Moon.sign)} و ماه در{' '}
            {getSignFa(p2Moon.sign)}، به تفاوت در شیوه ابراز محبت احترام بگذارید و گفتگوهای مهم را با شفافیت و بدون پیش‌داوری انجام دهید.
          </p>
        </Card>

        <Button variant="secondary" fullWidth onClick={onBack}>
          بازگشت به چارت تولد
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <PageHeader
        title="سیناستری (تطابق دو چارت)"
        subtitle="مشخصات تولد طرف مقابل را وارد کنید"
        onBack={onBack}
      />

      <Card variant="elevated" padding="md">
        <label className="block text-xs text-[var(--luma-text-muted)] mb-1.5">نام طرف مقابل</label>
        <input
          type="text"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder="مثال: سارا"
          className="w-full px-4 py-2.5 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] text-sm focus:outline-none focus:border-[var(--luma-gold)]"
        />
      </Card>

      <Card variant="elevated" padding="md">
        <h3 className="font-heading text-xs text-[var(--luma-text-muted)] mb-2">تاریخ تولد طرف مقابل</h3>
        <DatePickerJalaali value={birthDate} onChange={setBirthDate} />
      </Card>

      <Card variant="elevated" padding="md">
        <h3 className="font-heading text-xs text-[var(--luma-text-muted)] mb-2">ساعت تولد طرف مقابل</h3>
        <TimePicker value={birthTime} onChange={setBirthTime} />
      </Card>

      <Card variant="elevated" padding="md">
        <h3 className="font-heading text-xs text-[var(--luma-text-muted)] mb-2">شهر تولد طرف مقابل</h3>
        <CityPicker value={city} onChange={setCity} />
      </Card>

      <Button variant="gold" fullWidth size="lg" onClick={handleCalculateSynastry}>
        <Sparkles className="w-4 h-4" />
        محاسبه سیناستری و تطابق عاطفی
      </Button>
    </div>
  );
}
