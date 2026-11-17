import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { DailyCardSection } from './DailyCardSection';
import { CosmicCalendarModal } from '../calendar/CosmicCalendarModal';
import { Sparkles, Compass, Hash, Star, Moon, Calendar, Clock, Coins } from 'lucide-react';
import { type TabId } from '../../components/layout/BottomNav';
import { getAssetUrl } from '../../utils/assetPath';
import { useLanguageStore, UI_TRANSLATIONS, formatLiveTodayDate } from '../../i18n/useLanguageStore';
import { formatNum } from '../../i18n/format';

interface HomeScreenProps {
  onNavigate: (tab: TabId) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { lang, dir } = useLanguageStore();
  const t = UI_TRANSLATIONS[lang];

  const [showCosmicCalendar, setShowCosmicCalendar] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLiveTime = (date: Date): string => {
    const rawH = String(date.getHours()).padStart(2, '0');
    const rawM = String(date.getMinutes()).padStart(2, '0');
    const rawS = String(date.getSeconds()).padStart(2, '0');
    if (lang === 'en') return `${rawH}:${rawM}:${rawS}`;
    return `${formatNum(rawH, lang)}:${formatNum(rawM, lang)}:${formatNum(rawS, lang)}`;
  };

  const MODULES = [
    {
      id: 'chart' as TabId,
      title: t['mod_chart_title'] || '3D Sky & Natal Chart',
      description: t['mod_chart_desc'] || '3D Stellarium View',
      Icon: Compass,
      color: 'from-purple-900/40 to-indigo-900/40',
      borderColor: 'border-purple-500/30',
    },
    {
      id: 'tarot' as TabId,
      title: t['mod_tarot_title'] || 'Major & Minor Tarot',
      description: t['mod_tarot_desc'] || '13 Professional Spreads',
      Icon: Sparkles,
      color: 'from-amber-900/40 to-yellow-900/40',
      borderColor: 'border-amber-500/30',
    },
    {
      id: 'wealth-code' as TabId,
      title: t['mod_wealth_title'] || 'Wealth Code',
      description: t['mod_wealth_desc'] || 'Calculate your 4-digit wealth code',
      Icon: Coins,
      color: 'from-yellow-900/40 to-amber-900/40',
      borderColor: 'border-yellow-500/30',
    },
    {
      id: 'numerology' as TabId,
      title: t['mod_num_title'] || 'Numerology',
      description: t['mod_num_desc'] || 'Life Path Number',
      Icon: Hash,
      color: 'from-emerald-900/40 to-teal-900/40',
      borderColor: 'border-emerald-500/30',
    },
    {
      id: 'chinese' as TabId,
      title: t['mod_chinese_title'] || 'Chinese Zodiac',
      description: t['mod_chinese_desc'] || 'Birth Year Animal',
      Icon: Star,
      color: 'from-rose-900/40 to-red-900/40',
      borderColor: 'border-rose-500/30',
    },
  ];

  if (showCosmicCalendar) {
    return <CosmicCalendarModal onClose={() => setShowCosmicCalendar(false)} />;
  }

  return (
    <div className="space-y-5 pb-20" dir={dir}>
      <div className="text-center pt-2">
        <h1 className="font-heading text-3xl gold-gradient mb-3">{t['welcome_title']}</h1>
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 rounded-2xl bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/35 shadow-md">
          <div className="flex items-center gap-1.5 text-xs text-[var(--luma-text)] font-medium">
            <img src={getAssetUrl('icons/ui/calendar.png')} alt="Calendar" className="w-5 h-5" />
            <span>{formatLiveTodayDate(now, lang)}</span>
          </div>
          <span className="text-[var(--luma-gold)]/40">|</span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--luma-gold)]">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{t['live_clock_prefix']} {formatLiveTime(now)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowCosmicCalendar(true)}
        className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/60 to-amber-950/50 border border-[var(--luma-gold)]/40 flex items-center justify-between hover:border-[var(--luma-gold)] transition-all text-start"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--luma-gold)]/15 flex items-center justify-center text-[var(--luma-gold)]">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-sm text-[var(--luma-text)] flex items-center gap-1.5">
              <span>{t['cosmic_calendar_btn']}</span>
            </h3>
            <p className="text-[11px] text-[var(--luma-text-muted)] mt-0.5">{t['cosmic_calendar_sub']}</p>
          </div>
        </div>
        <Calendar className="w-4 h-4 text-[var(--luma-gold)] flex-shrink-0" />
      </button>

      <DailyCardSection />

      <div>
        <h2 className="font-heading text-base text-[var(--luma-text)] mb-3">{t['discover_title']}</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODULES.map(({ id, title, description, Icon, color, borderColor }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`relative p-4 rounded-2xl bg-gradient-to-br border transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-gold-sm active:scale-[0.98] text-start ${color} ${borderColor}`}
            >
              <Icon className="w-7 h-7 text-[var(--luma-gold)] mb-3" />
              <h3 className="font-heading text-sm text-[var(--luma-text)] mb-1">{title}</h3>
              <p className="text-[11px] text-[var(--luma-text-muted)] leading-relaxed">{description}</p>
            </button>
          ))}
        </div>
      </div>

      <Card variant="glass" padding="md" className="text-center">
        <p className="text-xs text-[var(--luma-text-muted)] italic leading-relaxed">{t['quote_footer']}</p>
      </Card>
    </div>
  );
}