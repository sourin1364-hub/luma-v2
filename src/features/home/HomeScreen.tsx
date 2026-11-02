import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Sparkles, Compass, Hash, Star, Moon } from 'lucide-react';
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
    title: 'زودیاک چینی',
    description: 'حیوان و عنصر سال تولد',
    Icon: Star,
    color: 'from-rose-900/40 to-red-900/40',
    borderColor: 'border-rose-500/30'
  }
];

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const today = new Date();
  const persianDate = new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(today);

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h1 className="font-heading text-3xl gold-gradient mb-2">به لوما خوش آمدید</h1>
        <p className="text-sm text-[var(--luma-text-muted)]">{persianDate}</p>
      </div>

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
            <h3 className="font-bold text-[var(--luma-text)] mb-1">{title}</h3>
            <p className="text-[11px] text-[var(--luma-text-muted)] leading-relaxed">{description}</p>
          </button>
        ))}
      </div>

      <Card variant="gold-border" padding="lg" className="text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-full bg-[var(--luma-gold-glow)]">
            <Moon className="w-6 h-6 text-[var(--luma-gold)]" />
          </div>
        </div>
        <h3 className="font-heading text-xl text-[var(--luma-text)] mb-2">فال روزانه</h3>
        <p className="text-sm text-[var(--luma-text-muted)] mb-4">
          یک کارت برای انرژی امروز شما آماده است
        </p>
        <Button variant="gold" onClick={() => onNavigate('tarot')}>
          <Sparkles className="w-4 h-4" />
          دریافت فال روزانه
        </Button>
      </Card>

      <div className="text-center py-4">
        <p className="text-xs text-[var(--luma-text-subtle)] italic">
          «ستارگان می‌نویسند، اما تو می‌توانی بخوانی»
        </p>
      </div>
    </div>
  );
}