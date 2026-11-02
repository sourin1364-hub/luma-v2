import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { BottomNav, type TabId } from './BottomNav';

interface AppLayoutProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children: React.ReactNode;
}

export function AppLayout({ activeTab, onTabChange, children }: AppLayoutProps) {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('luma_theme', newDark ? 'dark' : 'light');
  };

  // اسکرول به بالا هنگام تغییر تب
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[var(--luma-bg)] text-[var(--luma-text)] transition-colors">
      {/* هدر */}
      <header className="sticky top-0 z-40 glass border-b border-[var(--luma-border)]">
        <div className="max-w-md mx-auto flex items-center justify-between px-5 h-14">
          <Logo size="sm" showSubtitle={false} />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--luma-bg-subtle)] transition-colors"
            aria-label="تغییر تم"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* محتوا */}
      <main
        className="max-w-md mx-auto px-5 pt-6 pb-24 animate-fade-in"
        style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}
      >
        {children}
      </main>

      {/* ناوبری پایین */}
      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  );
}