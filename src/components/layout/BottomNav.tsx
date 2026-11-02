import { Home, Sparkles, Star, Hash, Compass } from 'lucide-react';

export type TabId = 'home' | 'chart' | 'tarot' | 'numerology' | 'chinese';

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; Icon: typeof Home }[] = [
  { id: 'home', label: 'خانه', Icon: Home },
  { id: 'chart', label: 'چارت', Icon: Compass },
  { id: 'tarot', label: 'تاروت', Icon: Sparkles },
  { id: 'numerology', label: 'اعداد', Icon: Hash },
  { id: 'chinese', label: 'چینی', Icon: Star }
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--luma-border)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={[
                'flex flex-col items-center justify-center gap-1 flex-1 h-full',
                'transition-all duration-200',
                isActive
                  ? 'text-[var(--luma-gold)]'
                  : 'text-[var(--luma-text-subtle)] hover:text-[var(--luma-text-muted)]'
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
              <span className={'text-[10px] font-medium ' + (isActive ? 'opacity-100' : 'opacity-70')}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}