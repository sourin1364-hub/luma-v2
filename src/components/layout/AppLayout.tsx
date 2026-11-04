import { type ReactNode } from 'react';
import { BottomNav, type TabId } from './BottomNav';
import { ElementalBackground } from './ElementalBackground';

interface AppLayoutProps {
  children: ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--luma-bg)] text-[var(--luma-text)] relative transition-colors duration-300">
      <ElementalBackground />
      <main className="relative z-10 max-w-md mx-auto px-4 pt-4 pb-24">
        {children}
      </main>
      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  );
}
