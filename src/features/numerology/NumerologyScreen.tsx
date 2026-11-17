import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DatePickerJalaali, type JalaaliDateValue } from '../../components/ui/DatePickerJalaali';
import { Hash, Sparkles, Loader2 } from 'lucide-react';
import { calculateAbjad, calculateLifePath, getNumberMeaning } from '../../engines/numerology';
import { jalaaliToGregorian } from '../../engines/calendar/jalaali';
import { formatJalaaliDate } from '../../engines/calendar/format';
import { formatNum } from '../../i18n/format';
import { useLanguageStore, UI_TRANSLATIONS } from '../../i18n/useLanguageStore';

export function NumerologyScreen() {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const [fullName, setFullName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [birthDate, setBirthDate] = useState<JalaaliDateValue>({
    year: 1364,
    month: 4,
    day: 1
  });
  const [results, setResults] = useState<{
    nameAbjad: number;
    nameReduced: number;
    motherAbjad: number;
    motherReduced: number;
    lifePath: number;
    lifePathMaster: boolean;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setIsCalculating(true);
    setError(null);
    try {
      if (!fullName.trim()) {
        throw new Error(t['num_err_name']);
      }

      const nameResult = calculateAbjad(fullName);
      const motherResult = motherName.trim() ? calculateAbjad(motherName) : null;
      const g = jalaaliToGregorian({
        year: birthDate.year,
        month: birthDate.month,
        day: birthDate.day
      });
      const lifePathResult = calculateLifePath(g.year, g.month, g.day);

      setResults({
        nameAbjad: nameResult.total,
        nameReduced: nameResult.reduced,
        motherAbjad: motherResult?.total ?? 0,
        motherReduced: motherResult?.reduced ?? 0,
        lifePath: lifePathResult.reduced,
        lifePathMaster: lifePathResult.isMasterNumber
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : t['num_err_calc']);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  const nameMeaning = results ? getNumberMeaning(results.nameReduced) : null;
  const lifePathMeaning = results ? getNumberMeaning(results.lifePath) : null;

  const BigNumber = ({ value }: { value: number }) => (
    <div
      className="text-6xl font-heading font-black mb-2 leading-none"
      style={{
        color: 'var(--luma-gold)',
        letterSpacing: '-0.02em'
      }}
    >
      {formatNum(value, lang)}
    </div>
  );

  const formattedBirthDate = formatJalaaliDate({
    year: birthDate.year,
    month: birthDate.month,
    day: birthDate.day
  }, { lang });

  if (results) {
    return (
      <div className="space-y-5">
        <PageHeader
          title={t['num_title']}
          subtitle={`${fullName} — ${formattedBirthDate}`}
          onBack={handleReset}
        />

        <Card variant="gold-border" padding="lg" className="text-center">
          <p className="text-xs text-[var(--luma-text-muted)] mb-2">{t['num_name_abjad']}</p>
          <BigNumber value={results.nameReduced} />
          <p className="text-[10px] text-[var(--luma-text-subtle)]">
            {t['num_sum_abjad']} {formatNum(results.nameAbjad, lang)}
          </p>
          {nameMeaning && (
            <div className="mt-4 pt-4 border-t border-[var(--luma-border)]">
              <p className="text-sm text-[var(--luma-text)] mb-2 leading-relaxed">{nameMeaning.meaning}</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {nameMeaning.keywords.map((kw, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {lifePathMeaning && (
          <Card variant="elevated" padding="lg" className="text-center">
            <p className="text-xs text-[var(--luma-text-muted)] mb-2">{t['num_life_path']}</p>
            <BigNumber value={results.lifePath} />
            {results.lifePathMaster && (
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 inline-block mb-3">
                {t['num_master']}
              </span>
            )}
            <p className="text-sm text-[var(--luma-text)] mb-2 leading-relaxed">{lifePathMeaning.meaning}</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {lifePathMeaning.keywords.map((kw, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]">
                  {kw}
                </span>
              ))}
            </div>
          </Card>
        )}

        {results.motherAbjad > 0 && (
          <Card variant="elevated" padding="md">
            <p className="text-sm text-[var(--luma-text)] mb-2">
              {t['num_mother_optional']}
            </p>
            <div className="flex items-center justify-between">
              <BigNumber value={results.motherReduced} />
              <span className="text-[10px] text-[var(--luma-text-subtle)]">
                {t['num_sum_abjad']} {formatNum(results.motherAbjad, lang)}
              </span>
            </div>
          </Card>
        )}

        <Button variant="secondary" fullWidth onClick={handleReset}>
          {t['num_recalculate']}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title={t['num_subtitle']} />

      <Card variant="elevated" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Hash className="w-4 h-4 text-[var(--luma-gold)]" />
          <h3 className="font-heading text-sm text-[var(--luma-text)]">{t['num_info_title']}</h3>
        </div>

        <label className="block text-xs text-[var(--luma-text-muted)] mb-1">
          {t['num_fullname']} <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t['num_fullname_ph']}
          className="w-full px-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors mb-3"
        />

        <label className="block text-xs text-[var(--luma-text-muted)] mb-1">
          {t['num_mother']}
        </label>
        <input
          type="text"
          value={motherName}
          onChange={(e) => setMotherName(e.target.value)}
          placeholder={t['num_mother_ph']}
          className="w-full px-4 py-3 rounded-xl bg-[var(--luma-bg-subtle)] border border-[var(--luma-border)] text-[var(--luma-text)] placeholder:text-[var(--luma-text-subtle)] focus:outline-none focus:border-[var(--luma-gold)] transition-colors"
        />
      </Card>

      <Card variant="elevated" padding="md">
        <h3 className="font-heading text-sm text-[var(--luma-text)] mb-3">{t['num_birth_date']}</h3>
        <DatePickerJalaali value={birthDate} onChange={setBirthDate} />
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
        disabled={isCalculating}
      >
        {isCalculating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t['num_calculating']}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            {t['num_calc_btn']}
          </>
        )}
      </Button>
    </div>
  );
}