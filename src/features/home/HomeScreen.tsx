import { Card } from '../../components/ui/Card';
import { DailyCardSection } from './DailyCardSection';
import { Sparkles, Compass, Hash, Star } from 'lucide-react';
import { type TabId } from '../../components/layout/BottomNav';

interface HomeScreenProps {
  onNavigate: (tab: TabId) => void;
}

const MODULES = [
  {
    id: 'chart' as TabId,
    title: 'چارت تولد',
    description: 'نقشه آسمان در لحظه تولد شما',
    Icon: Compass,
    color: 'from-purple-900/40 to-indigo-900/40',
    borderColor: 'border-purple-500/30'
  },
  {
    id: 'tarot' as TabId,
    title: 'تاروت',
    description: 'پیام کارت‌ها برای امروز',
    Icon: Sparkles,
    color: 'from-amber-900/40 to-yellow-900/40',
    borderColor: 'border-amber-500/30'
  },
  {
    id: 'numerology' as TabId,
    title: 'علم اعداد',
    description: 'ابجد و شماره مسیر زندگی',
    Icon: Hash,
    color: 'from-emerald-900/40 to-teal-900/40',
    borderColor: 'border-emerald-500/30'
  },
  {
    id: 'chinese' as TabId,
    title: 'چینی',
    description: 'حیوان و عنصر سال تولد',
    Icon: Star,
    color: 'from-rose-900/40 to-red-900/40',
    borderColor: 'border-rose-500/30'
  }
];

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const today = new Date();

  // ساخت تاریخ با ترتیب صحیح RTL: روز ماه سال
  const formatPersianDate = (date: Date): string => {
    const parts = new Intl.DateTimeFormat('fa-IR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).formatToParts(date);

    const weekday = parts.find(p => p.type === 'weekday')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';

    return `${weekday}، ${day} ${month} ${year}`;
  };

  const persianDate = formatPersianDate(today);

  return (
    <div className="space-y-6">
      {/* خوش‌آمد */}
      <div className="text-center py-4">
        <h1 className="font-heading text-3xl gold-gradient mb-2">به لوما خوش آمدید</h1>
        <p
          className="text-sm text-[var(--luma-text-muted)]"
          dir="rtl"
          style={{ unicodeBidi: 'plaintext' }}
        >
          {persianDate}
        </p>
      </div>

      {/* فال روزانه */}
      <DailyCardSection onNavigateToTarot={() => onNavigate('tarot')} />

      {/* ماژول‌ها */}
      <div>
        <h2 className="font-heading text-base text-[var(--luma-text)] mb-3">کشف کنید</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODULES.map(({ id, title, description, Icon, color, borderColor }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={
                'relative p-4 rounded-2xl bg-gradient-to-br border transition-all duration-300 ' +
                'hover:scale-[1.02] hover:shadow-glow-gold-sm active:scale-[0.98] text-right ' +
                color + ' ' + borderColor
              }
            >
              <Icon className="w-7 h-7 text-[var(--luma-gold)] mb-3" />
              <h3 className="font-heading text-sm text-[var(--luma-text)] mb-1">{title}</h3>
              <p className="text-[11px] text-[var(--luma-text-muted)] leading-relaxed">{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* نقل قول */}
      <Card variant="glass" padding="md" className="text-center">
        <p className="text-xs text-[var(--luma-text-muted)] italic leading-relaxed">
          «ستارگان می‌نویسند، اما تو می‌توانی بخوانی»
        </p>
      </Card>
    </div>
  );
}