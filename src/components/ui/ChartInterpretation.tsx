import type { NatalChart, Element } from '../../engines/astronomy/types';
import { ZODIAC_SIGNS, PLANET_NAMES_FA } from '../../engines/astronomy/constants';
import { Card } from './Card';

interface ChartInterpretationProps {
  chart: NatalChart;
}

const ELEMENT_NAMES_FA: Record<Element, string> = {
  fire: 'آتش',
  earth: 'خاک',
  air: 'هوا',
  water: 'آب'
};

const ELEMENT_COLORS: Record<Element, string> = {
  fire: '#EF4444',
  earth: '#10B981',
  air: '#3B82F6',
  water: '#8B5CF6'
};

// تفسیر کوتاه هر سیاره در هر برج
const PLANET_IN_SIGN_INTERPRETATIONS: Record<string, string> = {
  // خورشید
  'sun-aries': 'پرانرژی، پیشرو و مستقل. شما با شور و شوق زندگی می‌کنید و از چالش لذت می‌برید.',
  'sun-taurus': 'پایدار، حسی و اهل لذت. شما به امنیت و زیبایی اهمیت می‌دهید و با صبر به اهدافتان می‌رسید.',
  'sun-gemini': 'کنجکاو، ارتباطی و سازگار. شما عاشق یادگیری و گفتگو هستید و ذهنی چابک دارید.',
  'sun-cancer': 'مهربان، حساس و خانواده‌دوست. شما به خانه و عزیزانتان اهمیت می‌دهید و شهودی قوی دارید.',
  'sun-leo': 'خلاق، رهبر و درخشان. شما به دنبال شناخت و ابراز وجود هستید و قلبی سخاوتمند دارید.',
  'sun-virgo': 'دقیق، تحلیلی و خدمتگزار. شما به جزئیات توجه دارید و به دنبال کمال و بهبود هستید.',
  'sun-libra': 'دیپلمات، اجتماعی و عاشق زیبایی. شما به تعادل و روابط هماهنگ اهمیت می‌دهید.',
  'sun-scorpio': 'عمیق، قدرتمند و رازآلود. شما با شدت و تعهد زندگی می‌کنید و شهودی نافذ دارید.',
  'sun-sagittarius': 'ماجراجو، خوش‌بین و فلسفی. شما به دنبال معنا و آزادی هستید و عاشق سفر و کشف.',
  'sun-capricorn': 'جاه‌طلب، مسئولیت‌پذیر و منظم. شما برای اهداف بلندمدت تلاش می‌کنید و پایدار هستید.',
  'sun-aquarius': 'مبتکر، مستقل و انسان‌دوست. شما به دنبال تغییر و نوآوری هستید و ذهنی آزاد دارید.',
  'sun-pisces': 'شهودی، هنرمند و دلسوز. شما با تخیل و همدلی زندگی می‌کنید و به دنیای درون اهمیت می‌دهید.',
  // ماه
  'moon-aries': 'احساسات سریع و پرشور. شما در واکنش‌ها spontaneous هستید و به استقلال نیاز دارید.',
  'moon-taurus': 'احساسات پایدار و آرام. شما به امنیت عاطفی و لمس فیزیکی نیاز دارید.',
  'moon-gemini': 'احساسات متغیر و کنجکاو. شما از طریق گفتگو و یادگیری به آرامش می‌رسید.',
  'moon-cancer': 'احساسات عمیق و خانواده‌دوست. شما به خانه و عزیزانتان وابسته هستید.',
  'moon-leo': 'احساسات پرشور و خلاق. شما به شناخت و توجه عاطفی نیاز دارید.',
  'moon-virgo': 'احساسات کنترل‌شده و خدمتگزار. شما از طریق نظم و کمک به دیگران به آرامش می‌رسید.',
  'moon-libra': 'احساسات هماهنگ و اجتماعی. شما به روابط متعادل و زیبایی نیاز دارید.',
  'moon-scorpio': 'احساسات شدید و عمیق. شما در روابط عاطفی بسیار متعهد و حساس هستید.',
  'moon-sagittarius': 'احساسات خوش‌بین و ماجراجو. شما از طریق کشف و سفر به آرامش می‌رسید.',
  'moon-capricorn': 'احساسات کنترل‌شده و مسئول. شما از طریق دستاورد و نظم به امنیت عاطفی می‌رسید.',
  'moon-aquarius': 'احساسات مستقل و منطقی. شما به آزادی عاطفی و دوستی‌های عمیق نیاز دارید.',
  'moon-pisces': 'احساسات شهودی و دلسوز. شما بسیار حساس و همدل هستید و به هنر و معنویت کشش دارید.',
  // ASC
  'asc-aries': 'ظاهر پرانرژی و پیشرو. شما در برخورد اول قوی و مستقل به نظر می‌رسید.',
  'asc-taurus': 'ظاهر آرام و پایدار. شما در برخورد اول قابل اعتماد و حسی به نظر می‌رسید.',
  'asc-gemini': 'ظاهر کنجکاو و ارتباطی. شما در برخورد اول باهوش و اجتماعی به نظر می‌رسید.',
  'asc-cancer': 'ظاهر مهربان و حساس. شما در برخورد اول دلسوز و خانواده‌دوست به نظر می‌رسید.',
  'asc-leo': 'ظاهر درخشان و مطمئن. شما در برخورد اول جذاب و رهبر به نظر می‌رسید.',
  'asc-virgo': 'ظاهر دقیق و متواضع. شما در برخورد اول منظم و تحلیلی به نظر می‌رسید.',
  'asc-libra': 'ظاهر جذاب و دیپلمات. شما در برخورد اول خوش‌برخورد و متعادل به نظر می‌رسید.',
  'asc-scorpio': 'ظاهر مرموز و قدرتمند. شما در برخورد اول عمیق و نافذ به نظر می‌رسید.',
  'asc-sagittarius': 'ظاهر خوش‌بین و ماجراجو. شما در برخورد اول پرانرژی و فلسفی به نظر می‌رسید.',
  'asc-capricorn': 'ظاهر جدی و مسئول. شما در برخورد اول قابل اعتماد و منظم به نظر می‌رسید.',
  'asc-aquarius': 'ظاهر منحصربه‌فرد و مستقل. شما در برخورد اول متفاوت و مبتکر به نظر می‌رسید.',
  'asc-pisces': 'ظاهر آرام و شهودی. شما در برخورد اول حساس و هنرمند به نظر می‌رسید.'
};

function getInterpretation(planet: string, sign: string): string {
  const key = planet + '-' + sign;
  return PLANET_IN_SIGN_INTERPRETATIONS[key] || 'این ترکیب نیازمند تحلیل عمیق‌تر است.';
}

export function ChartInterpretation({ chart }: ChartInterpretationProps) {
  // پیدا کردن خورشید، ماه، ASC
  const sun = chart.planets.find(p => p.planet === 'sun');
  const moon = chart.planets.find(p => p.planet === 'moon');
  const asc = chart.ascendant;

  // محاسبه عناصر غالب
  const elementCounts: Record<Element, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  chart.planets.forEach(p => {
    const sign = ZODIAC_SIGNS.find(s => s.name === p.sign);
    if (sign) elementCounts[sign.element]++;
  });
  // ASC هم حساب می‌شود
  const ascSign = ZODIAC_SIGNS.find(s => s.name === asc.sign);
  if (ascSign) elementCounts[ascSign.element]++;

  const totalElements = Object.values(elementCounts).reduce((a, b) => a + b, 0);
  const dominantElement = (Object.entries(elementCounts) as [Element, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  const sunSign = ZODIAC_SIGNS.find(s => s.name === sun?.sign);
  const moonSign = ZODIAC_SIGNS.find(s => s.name === moon?.sign);
  const ascSignData = ZODIAC_SIGNS.find(s => s.name === asc.sign);

  return (
    <div className="space-y-4">
      {/* سه ستاره اصلی */}
      <Card variant="gold-border" padding="md">
        <h3 className="font-heading text-lg text-[var(--luma-text)] mb-3">سه ستاره اصلی</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[var(--luma-gold)] text-lg">☉</span>
              <span className="text-sm font-medium text-[var(--luma-text)]">خورشید در {sunSign?.nameFa}</span>
            </div>
            <p className="text-xs text-[var(--luma-text-muted)] leading-relaxed pr-6">
              {getInterpretation('sun', sun?.sign || '')}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[var(--luma-gold)] text-lg">☽</span>
              <span className="text-sm font-medium text-[var(--luma-text)]">ماه در {moonSign?.nameFa}</span>
            </div>
            <p className="text-xs text-[var(--luma-text-muted)] leading-relaxed pr-6">
              {getInterpretation('moon', moon?.sign || '')}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[var(--luma-gold)] text-lg">↑</span>
              <span className="text-sm font-medium text-[var(--luma-text)]">طالع در {ascSignData?.nameFa}</span>
            </div>
            <p className="text-xs text-[var(--luma-text-muted)] leading-relaxed pr-6">
              {getInterpretation('asc', asc.sign)}
            </p>
          </div>
        </div>
      </Card>

      {/* عناصر غالب */}
      <Card variant="elevated" padding="md">
        <h3 className="font-heading text-lg text-[var(--luma-text)] mb-3">عناصر غالب</h3>
        <div className="space-y-2">
          {(['fire', 'earth', 'air', 'water'] as Element[]).map(el => {
            const count = elementCounts[el];
            const percent = totalElements > 0 ? (count / totalElements) * 100 : 0;
            return (
              <div key={el}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--luma-text)]">{ELEMENT_NAMES_FA[el]}</span>
                  <span className="text-[10px] text-[var(--luma-text-muted)]">{count}</span>
                </div>
                <div className="h-1.5 bg-[var(--luma-bg-subtle)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: ELEMENT_COLORS[el] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-[var(--luma-text-muted)] mt-3 leading-relaxed">
          عنصر غالب شما <span className="text-[var(--luma-gold)] font-medium">{ELEMENT_NAMES_FA[dominantElement]}</span> است. این عنصر کیفیت اصلی انرژی شما را نشان می‌دهد.
        </p>
      </Card>

      {/* جنبه‌های اصلی */}
      {chart.aspects.length > 0 && (
        <Card variant="elevated" padding="md">
          <h3 className="font-heading text-lg text-[var(--luma-text)] mb-3">جنبه‌های اصلی</h3>
          <div className="space-y-1.5 text-xs">
            {chart.aspects.slice(0, 6).map((a, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-[var(--luma-border)] last:border-0">
                <span className="text-[var(--luma-text)]">
                  {PLANET_NAMES_FA[a.planet1]} — {PLANET_NAMES_FA[a.planet2]}
                </span>
                <span className="text-[var(--luma-text-muted)]">
                  {a.type === 'conjunction' ? 'قران' :
                   a.type === 'opposition' ? 'مقابله' :
                   a.type === 'trine' ? 'تثلیث' :
                   a.type === 'square' ? 'تربیع' : 'تسدیس'} ({a.orb.toFixed(1)}°)
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}