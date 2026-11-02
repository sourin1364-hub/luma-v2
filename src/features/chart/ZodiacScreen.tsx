import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { ZODIAC_SIGNS } from '../../engines/astronomy/constants';
import { BIRTHSTONES } from '../../engines/birthstone';

const ZODIAC_DATES: Record<string, string> = {
  aries: '۲۱ مارس – ۱۹ آوریل',
  taurus: '۲۰ آوریل – ۲۰ می',
  gemini: '۲۱ می – ۲۰ ژوئن',
  cancer: '۲۱ ژوئن – ۲۲ جولای',
  leo: '۲۳ جولای – ۲۲ آگوست',
  virgo: '۲۳ آگوست – ۲۲ سپتامبر',
  libra: '۲۳ سپتامبر – ۲۲ اکتبر',
  scorpio: '۲۳ اکتبر – ۲۱ نوامبر',
  sagittarius: '۲۲ نوامبر – ۲۱ دسامبر',
  capricorn: '۲۲ دسامبر – ۱۹ ژانویه',
  aquarius: '۲۰ ژانویه – ۱۸ فوریه',
  pisces: '۱۹ فوریه – ۲۰ مارس'
};

const ZODIAC_ICONS: Record<string, string> = {
  aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer',
  leo: 'Leo', virgo: 'Virgo', libra: 'Libra', scorpio: 'Scorpio',
  sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces'
};

// نگاشت نام انگلیسی سنگ به نام فایل (حروف کوچک)
const BIRTHSTONE_IMAGES: Record<string, string> = {
  garnet: 'garnet',
  amethyst: 'amethyst',
  aquamarine: 'aquamarine',
  diamond: 'diamond',
  emerald: 'emerald',
  pearl: 'pearl',
  ruby: 'ruby',
  peridot: 'peridot',
  sapphire: 'sapphire',
  opal: 'opal',
  topaz: 'topaz',
  turquoise: 'turquoise'
};

const ELEMENT_NAMES_FA: Record<string, string> = {
  fire: 'آتش', earth: 'خاک', air: 'هوا', water: 'آب'
};

const ELEMENT_COLORS: Record<string, string> = {
  fire: '#EF4444', earth: '#10B981', air: '#3B82F6', water: '#8B5CF6'
};

interface ZodiacScreenProps {
  onBack: () => void;
}

export function ZodiacScreen({ onBack }: ZodiacScreenProps) {
  return (
    <div className="space-y-5">
      <PageHeader title="زودیاک ماه‌ها" subtitle="۱۲ برج غربی و سنگ ماه تولد" onBack={onBack} />

      <div className="grid grid-cols-2 gap-3">
        {ZODIAC_SIGNS.map((sign) => {
          const birthstone = BIRTHSTONES[sign.index - 1];
          const elementColor = ELEMENT_COLORS[sign.element] || '#888';
          const iconName = ZODIAC_ICONS[sign.name] || 'Aries';
          const stoneImage = birthstone ? BIRTHSTONE_IMAGES[birthstone.nameEn.toLowerCase()] : null;

          return (
            <Card key={sign.name} variant="elevated" padding="md">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={`/icons/zodiac/${iconName}.svg`}
                  alt={sign.nameFa}
                  className="w-10 h-10 zodiac-icon"
                />
                <h3 className="font-heading text-sm text-[var(--luma-text)]">{sign.nameFa}</h3>
              </div>
              <p className="text-[10px] text-[var(--luma-text-subtle)] mb-1">{ZODIAC_DATES[sign.name]}</p>
              <p className="text-[10px] text-[var(--luma-text-muted)] mb-1">
                عنصر: <span style={{ color: elementColor }}>{ELEMENT_NAMES_FA[sign.element] || sign.element}</span>
              </p>
              {birthstone && stoneImage && (
                <div className="mt-2 pt-2 border-t border-[var(--luma-border)]">
                  <div className="flex items-center gap-2">
                    <img
                      src={`/icons/birthstones/${stoneImage}.png`}
                      alt={birthstone.nameFa}
                      className="w-8 h-8 rounded-full object-cover border border-[var(--luma-gold)]/40 bg-[var(--luma-bg-subtle)]"
                      onError={(e) => {
                        console.error('Birthstone image failed:', e.currentTarget.src);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[var(--luma-text-muted)]">
                        💎 سنگ: {birthstone.nameFa}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}