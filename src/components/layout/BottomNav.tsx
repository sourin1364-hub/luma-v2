import { Home, Sparkles, Star, Hash, Compass, User, Orbit, Coins, BookOpen, Gem } from 'lucide-react';
import { useLanguageStore, UI_TRANSLATIONS } from '../../i18n/useLanguageStore';

export type TabId = 'home' | 'cosmic' | 'chart' | 'tarot' | 'numerology' | 'chinese' | 'profile' | 'wealth-code' | 'zodiac' | 'research';

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];

  const TABS: { id: TabId; label: string; Icon: typeof Home }[] = [
    { id: 'home', label: t.nav_home, Icon: Home },
    { id: 'cosmic', label: t.nav_cosmic, Icon: Orbit },
    { id: 'tarot', label: t.nav_tarot, Icon: Sparkles },
    { id: 'chart', label: t.nav_chart, Icon: Compass },
    { id: 'numerology', label: t.nav_numerology, Icon: Hash },
    { id: 'chinese', label: t.nav_chinese, Icon: Star },
    { id: 'wealth-code', label: t.nav_wealth, Icon: Coins },
    { id: 'zodiac', label: t.nav_zodiac_bridge, Icon: Gem },
    { id: 'research', label: t.nav_research, Icon: BookOpen },
    { id: 'profile', label: t.nav_profile, Icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-[var(--luma-border)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-md mx-auto flex items-center overflow-x-auto h-16 px-1">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={[
                'flex flex-col items-center justify-center gap-1 flex-none w-14 h-full',
                'transition-all duration-200',
                isActive
                  ? 'text-[var(--luma-gold)]'
                  : 'text-[var(--luma-text-subtle)] hover:text-[var(--luma-text-muted)]',
              ].join(' ')}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                {isActive && (
                  <span className="absolute inset-0 -m-1 rounded-full bg-[var(--luma-gold-glow)] blur-md" />
                )}
                <Icon className="w-5 h-5 relative" strokeWidth={isActive ? 2.2 : 1.6} />
              </div>
              <span className={'text-[9px] font-medium ' + (isActive ? 'opacity-100' : 'opacity-70')}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}