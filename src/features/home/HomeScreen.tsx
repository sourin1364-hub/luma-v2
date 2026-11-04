import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { DailyCardSection } from './DailyCardSection';
import { CosmicCalendarModal } from '../calendar/CosmicCalendarModal';
import { Sparkles, Compass, Hash, Star, Moon, Calendar } from 'lucide-react';
import { type TabId } from '../../components/layout/BottomNav';

interface HomeScreenProps {
  onNavigate: (tab: TabId) => void;
}

const MODULES = [
  {
    id: 'chart' as TabId,
    title: 'چارت تولد و سیناستری',
    description: 'نقشه آسمان و تطابق عاطفی دو چارت',
    Icon: Compass,
    color: 'from-purple-900/40 to-indigo-900/40',
    borderColor: 'border-purple-500/30',
  },
  {
    id: 'tarot' as TabId,
    title: 'تاروت کبیر و صغیر',
    description: '۱۱ چیدمان تخصصی با ۷۸ کارت',
    Icon: Sparkles,
    color: 'from-amber-900/40 to-yellow-900/40',
    borderColor: 'border-amber-500/30',
  },
  {
    id: 'numerology' as TabId,
    title: 'علم اعداد و ابجد',
    description: 'ابجد کبیر و شماره مسیر زندگی',
    Icon: Hash,
    color: 'from-emerald-900/40 to-teal-900/40',
    borderColor: 'border-emerald-500/30',
  },
  {
    id: 'chinese' as TabId,
    title: 'زودیاک چینی',
    description: 'حیوان و عنصر سال تولد شما',
    Icon: Star,
    color: 'from-rose-900/40 to-red-900/40',
    borderColor: 'border-rose-500/30',
  },
];

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [showCosmicCalendar, setShowCosmicCalendar] = useState(false);
  const today = new Date();

  const formatPersianDate = (date: Date): string => {
    const parts = new Intl.DateTimeFormat('fa-IR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).formatToParts(date);

    const weekday = parts.find((p) => p.type === 'weekday')?.value || '';
    const day = parts.find((p) => p.type === 'day')?.value || '';
    const month = parts.find((p) => p.type === 'month')?.value || '';
    const year = parts.find((p) => p.type === 'year')?.value || '';

    return `${weekday}، ${day} ${month} ${year}`;
  };

  const persianDate = formatPersianDate(today);

  if (showCosmicCalendar) {
    return <CosmicCalendarModal onClose={() => setShowCosmicCalendar(false)} />;
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-3">
        <h1 className="font-heading text-3xl gold-gradient mb-2">به لوما خوش آمدید</h1>
        <p
          className="text-sm text-[var(--luma-text-muted)]"
          dir="rtl"
          style={{ unicodeBidi: 'plaintext' }}
        >
          {persianDate}
        </p>
      </div>

      {/* دکمه تقویم نجومی و فاز ماه امروز */}
      <button
        type="button"
        onClick={() => setShowCosmicCalendar(true)}
        className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/60 to-amber-950/50 border border-[var(--luma-gold)]/40 flex items-center justify-between hover:border-[var(--luma-gold)] transition-all text-right"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--luma-gold)]/15 flex items-center justify-center text-[var(--luma-gold)]">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-sm text-[var(--luma-text)] flex items-center gap-1.5">
              <span>تقویم نجومی و ترانزیت زنده امروز</span>
            </h3>
            <p className="text-[11px] text-[var(--luma-text-muted)] mt-0.5">
              مشاهده فاز ماه، موقعیت لحظه‌ای سیارات و انرژی روز
            </p>
          </div>
        </div>
        <Calendar className="w-4 h-4 text-[var(--luma-gold)] flex-shrink-0" />
      </button>

      {/* فال روزانه */}
      <DailyCardSection />

      {/* ماژول‌ها */}
      <div>
        <h2 className="font-heading text-base text-[var(--luma-text)] mb-3">کشف کنید</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODULES.map(({ id, title, description, Icon, color, borderColor }) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={
                'relative p-4 rounded-2xl bg-gradient-to-br border transition-all duration-300 ' +
                'hover:scale-[1.02] hover:shadow-glow-gold-sm active:scale-[0.98] text-right ' +
                color +
                ' ' +
                borderColor
              }
            >
              <Icon className="w-7 h-7 text-[var(--luma-gold)] mb-3" />
              <h3 className="font-heading text-sm text-[var(--luma-text)] mb-1">{title}</h3>
              <p className="text-[11px] text-[var(--luma-text-muted)] leading-relaxed">
                {description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <Card variant="glass" padding="md" className="text-center">
        <p className="text-xs text-[var(--luma-text-muted)] italic leading-relaxed">
          «ستارگان می‌نویسند، اما تو می‌توانی بخوانی»
        </p>
      </Card>
    </div>
  );
}

