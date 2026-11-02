import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DatePickerJalaali, type JalaaliDateValue } from '../../components/ui/DatePickerJalaali';
import { Star, Sparkles, Loader2 } from 'lucide-react';
import { calculateChineseZodiac } from '../../engines/chinese';
import { jalaaliToGregorian } from '../../engines/calendar/jalaali';
import { toPersianDigits } from '../../engines/calendar/format';
import type { ChineseZodiacResult } from '../../engines/chinese';

export function ChineseScreen() {
  const [birthDate, setBirthDate] = useState<JalaaliDateValue>({
    year: 1364,
    month: 4,
    day: 1
  });
  const [result, setResult] = useState<ChineseZodiacResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setIsCalculating(true);
    setError(null);
    try {
      const g = jalaaliToGregorian({
        year: birthDate.year,
        month: birthDate.month,
        day: birthDate.day
      });
      const chineseResult = calculateChineseZodiac(g.year, g.month, g.day);
      setResult(chineseResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطا در محاسبه');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <div className="space-y-5">
        <PageHeader
          title="زودیاک چینی شما"
          subtitle={`${toPersianDigits(birthDate.day)}/${toPersianDigits(birthDate.month)}/${toPersianDigits(birthDate.year)}`}
          onBack={handleReset}
        />

        <Card variant="gold-border" padding="lg" className="text-center">
          <div className="text-7xl mb-3" aria-hidden="true">
            {getAnimalEmoji(result.animal)}
          </div>
          <h2 className="font-heading text-3xl text-[var(--luma-text)] mb-1">
            {result.combinedName}
          </h2>
          <p className="text-xs text-[var(--luma-text-muted)]">
            سال چینی {toPersianDigits(result.chineseYear)}
          </p>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-[var(--luma-gold)]" />
            <h3 className="font-heading text-base text-[var(--luma-text)]">{result.animalInfo.nameFa}</h3>
          </div>
          <p className="text-sm text-[var(--luma-text-muted)] leading-relaxed mb-3">
            {result.animalInfo.meaning}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {result.animalInfo.keywords.map((kw, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]">
                {kw}
              </span>
            ))}
          </div>
          <div className="pt-3 border-t border-[var(--luma-border)]">
            <p className="text-[10px] text-[var(--luma-text-subtle)] mb-1">سال‌های این حیوان:</p>
            <p className="text-xs text-[var(--luma-text-muted)]">{result.animalInfo.years}</p>
          </div>
        </Card>

        <Card variant="elevated" padding="md">
          <h3 className="font-heading text-base text-[var(--luma-text)] mb-2">
            عنصر {result.elementInfo.nameFa}
          </h3>
          <p className="text-sm text-[var(--luma-text-muted)] leading-relaxed mb-3">
            {result.elementInfo.meaning}
          </p>
          <div className="flex flex-wrap gap-1">
            {result.elementInfo.keywords.map((kw, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--luma-gold-glow)] text-[var(--luma-gold)]">
                {kw}
              </span>
            ))}
          </div>
        </Card>

        <Button variant="secondary" fullWidth onClick={handleReset}>
          محاسبه مجدد
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader title="زودیاک چینی" subtitle="حیوان و عنصر سال تولد" />

      <Card variant="elevated" padding="md">
        <h3 className="font-heading text-sm text-[var(--luma-text)] mb-3">تاریخ تولد</h3>
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
            در حال محاسبه...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            محاسبه زودیاک چینی
          </>
        )}
      </Button>
    </div>
  );
}

function getAnimalEmoji(animal: string): string {
  const emojis: Record<string, string> = {
    rat: '🐀', ox: '🐂', tiger: '🐅', rabbit: '🐇',
    dragon: '🐉', snake: '🐍', horse: '🐎', goat: '🐐',
    monkey: '🐒', rooster: '🐓', dog: '🐕', pig: '🐖'
  };
  return emojis[animal] || '⭐';
}