// src/components/ui/numerology/WealthCodeScreen.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { computeWealthCode, type WealthCodeResult } from '../../../engines/numerology/wealthCode';
import { jalaaliToGregorian } from '../../../engines/calendar/jalaali';
import { DatePickerJalaali, type JalaaliDateValue } from '../DatePickerJalaali';
import { PageHeader } from '../PageHeader';
import { Card } from '../Card';
import { Button } from '../Button';
import { Sparkles, Loader2, Coins } from 'lucide-react';
import { useLanguageStore, UI_TRANSLATIONS } from '../../../i18n/useLanguageStore';

export default function WealthCodeScreen() {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const [fullName, setFullName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [birthDate, setBirthDate] = useState<JalaaliDateValue>({
    year: 1370,
    month: 1,
    day: 1,
  });
  const [result, setResult] = useState<WealthCodeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompute = () => {
    if (!fullName.trim() || !motherName.trim()) return;

    setLoading(true);
    setTimeout(() => {
      // تبدیل تاریخ شمسی به میلادی برای موتور محاسباتی
      const gDate = jalaaliToGregorian(birthDate);
      setResult(computeWealthCode({ fullName, motherName, birthDate: gDate }));
      setLoading(false);
    }, 700);
  };

  const handleReset = () => {
    setResult(null);
  };

  // ================= خروجی نتیجه =================
  if (result) {
    const weekdayName = t[result.breakdown.day.weekdayKey];
    const luckyDayName = t[result.luckyDayKey];

    return (
      <div className="space-y-5 pb-20">
        <PageHeader
          title={t.wealth_title}
          subtitle={`${fullName} — ${birthDate.year}/${birthDate.month}/${birthDate.day}`}
          onBack={handleReset}
        />

        <Card variant="gold-border" padding="lg" className="text-center">
          <p className="text-xs text-[var(--luma-text-muted)] mb-3">{t.wealth_card_code_label}</p>
          <div className="flex justify-center gap-3" dir="ltr">
            {result.digits.map((d, i) => (
              <motion.div
                key={i}
                initial={{ rotateY: 90, scale: 0.5 }}
                animate={{ rotateY: 0, scale: 1 }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                className="w-16 h-24 rounded-xl bg-gradient-to-b from-[var(--luma-gold-soft)] to-[var(--luma-gold)] flex items-center justify-center text-4xl font-black text-[var(--luma-bg)] shadow-xl shadow-[var(--luma-gold-glow)]"
              >
                {d}
              </motion.div>
            ))}
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="font-heading font-bold text-[var(--luma-gold)] mb-4">{t.wealth_analysis_title}</h3>
          <div className="text-sm space-y-3 text-[var(--luma-text)]">
            <div className="flex justify-between">
              <span className="text-[var(--luma-text-muted)]">{t.wealth_breakdown_name}:</span>
              <span className="text-[var(--luma-gold)] font-medium" dir="rtl">
                {t.wealth_abjad} {result.breakdown.name.abjad} + {t.wealth_pythagorean} {result.breakdown.name.pythagorean} ← {result.breakdown.name.digit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--luma-text-muted)]">{t.wealth_breakdown_mother}:</span>
              <span className="text-[var(--luma-gold)] font-medium" dir="rtl">
                {t.wealth_abjad} {result.breakdown.mother.abjad} + {t.wealth_pythagorean} {result.breakdown.mother.pythagorean} ← {result.breakdown.mother.digit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--luma-text-muted)]">{t.wealth_breakdown_day}:</span>
              <span className="text-[var(--luma-gold)] font-medium" dir="rtl">
                {weekdayName} ({t[result.breakdown.day.planetKey]}) ← {result.breakdown.day.digit}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--luma-text-muted)]">{t.wealth_breakdown_month}:</span>
              <span className="text-[var(--luma-gold)] font-medium" dir="rtl">
                {result.breakdown.month.month} + {result.breakdown.month.yearRoot} ← {result.breakdown.month.digit}
              </span>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="md" className="bg-[var(--luma-gold-glow)] border border-[var(--luma-gold)]/30">
          <p className="text-sm text-[var(--luma-text)] leading-relaxed">
            {t.wealth_msg_intro_a}{' '}
            <strong>{t[result.planetKey]}</strong>{' '}
            {t.wealth_msg_intro_b}{' '}
            <strong>{t[result.colorKey]}</strong>
            {t.wealth_msg_intro_c}{' '}
            {t.wealth_msg_d1_a}{' '}
            (<strong>{t[`wealth_theme_${result.digits[0]}`]}</strong>) {t.wealth_msg_d1_b}{' '}
            {t.wealth_msg_d2_a}{' '}
            (<strong>{t[`wealth_theme_${result.digits[1]}`]}</strong>) {t.wealth_msg_d2_b}{' '}
            {t.wealth_msg_d3_a}{' '}
            <strong>{weekdayName}</strong>{' '}
            {t.wealth_msg_d3_b}{' '}
            {t.wealth_msg_cta_a}{' '}
            <strong>{luckyDayName}</strong>{' '}
            {t.wealth_msg_cta_b}{' '}
            <strong>{t[result.colorKey]}</strong>
            {t.wealth_msg_cta_c}
          </p>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] rounded-xl p-3 text-center transition-colors">
            <div className="text-2xl mb-1">🎨</div>
            <div className="text-[10px] text-[var(--luma-text-muted)]">{t.wealth_lucky_color}</div>
            <div className="text-sm font-bold text-[var(--luma-gold)] mt-1">{t[result.colorKey]}</div>
          </div>
          <div className="bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] rounded-xl p-3 text-center transition-colors">
            <div className="text-2xl mb-1">📅</div>
            <div className="text-[10px] text-[var(--luma-text-muted)]">{t.wealth_lucky_day}</div>
            <div className="text-sm font-bold text-[var(--luma-gold)] mt-1">{luckyDayName}</div>
          </div>
          <div className="bg-[var(--luma-bg-elevated)] border border-[var(--luma-border)] rounded-xl p-3 text-center transition-colors">
            <div className="text-2xl mb-1">🪐</div>
            <div className="text-[10px] text-[var(--luma-text-muted)]">{t.wealth_wealth_planet}</div>
            <div className="text-sm font-bold text-[var(--luma-gold)] mt-1">{t[result.planetKey]}</div>
          </div>
        </div>

        <Button variant="secondary" fullWidth onClick={handleReset}>
          {t.wealth_recalculate}
        </Button>
      </div>
    );
  }

  // ================= فرم ورودی =================
  return (
    <div className="space-y-5 pb-20">
      <PageHeader title={t.wealth_form_title} subtitle={t.wealth_subtitle_form} />

      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Coins className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">{t.wealth_input_info}</h3>
        </div>

        <label className="block text-xs text-[var(--luma-text-muted)] mb-1">
          {t.wealth_full_name_label} <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t.wealth_full_name_placeholder}
          className="w-full px-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors mb-3"
        />

        <label className="block text-xs text-[var(--luma-text-muted)] mb-1">
          {t.wealth_mother_name_label} <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={motherName}
          onChange={(e) => setMotherName(e.target.value)}
          placeholder={t.wealth_mother_name_placeholder}
          className="w-full px-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors"
        />
      </Card>

      <Card variant="elevated" padding="md">
        <h3 className="font-heading text-sm text-[var(--luma-text)] mb-3">{t.wealth_birth_date_title}</h3>
        <DatePickerJalaali value={birthDate} onChange={setBirthDate} />
      </Card>

      <Button
        variant="gold"
        fullWidth
        size="lg"
        onClick={handleCompute}
        disabled={!fullName || !motherName || loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t.wealth_computing}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {t.wealth_compute_btn}
          </>
        )}
      </Button>
    </div>
  );
}