import { type ReactNode, useEffect, useRef, useState } from 'react';
import { BottomNav, type TabId } from './BottomNav';
import { ElementalBackground } from './ElementalBackground';
import { useLanguageStore, translateNodeText, UI_TRANSLATIONS } from '../../i18n/useLanguageStore';
import { Home, Sparkles, Star, Hash, Compass, User, Orbit, Menu, X, ChevronLeft, Coins, BookOpen, Gem } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface AppLayoutProps {
  children: ReactNode;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  const { lang, dir } = useLanguageStore();
  const t = UI_TRANSLATIONS[lang];
  const mainRef = useRef<HTMLElement | null>(null);
  const sourceTexts = useRef(new WeakMap<Text, { source: string; rendered: string }>());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const NAV_ITEMS: { id: TabId; label: string; Icon: typeof Home }[] = [
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

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;

    if (!mainRef.current) return;

    const translateDomTree = () => {
      if (!mainRef.current) return;
      const walker = document.createTreeWalker(mainRef.current, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const textNode = node as Text;
        const currentText = textNode.nodeValue || '';
        const previous = sourceTexts.current.get(textNode);
        const source = previous && currentText === previous.rendered ? previous.source : currentText;
        if (!source.trim()) continue;

        const parent = textNode.parentElement;
        if (parent?.closest('code, pre, input, textarea, script, style')) continue;

        const rendered = translateNodeText(source, lang);
        if (rendered !== currentText) textNode.nodeValue = rendered;
        sourceTexts.current.set(textNode, { source, rendered });
      }
    };

    translateDomTree();
    const observer = new MutationObserver(() => translateDomTree());
    observer.observe(mainRef.current, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [lang, dir, activeTab]);

  const handleTabSelect = (tab: TabId) => {
    onTabChange(tab);
    setIsDrawerOpen(false);
  };

  return (
    <div
      dir={dir}
      className="min-h-screen bg-[var(--luma-bg)] text-[var(--luma-text)] relative transition-colors duration-300 overflow-x-hidden flex flex-col items-center"
    >
      <ElementalBackground />

      {/* دکمه شناور لوکس باز کردن منو در دسکتاپ و مانیتورها */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        aria-label={t.nav_toggle}
        className="hidden lg:flex fixed top-5 start-5 z-40 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[var(--luma-bg-elevated)]/85 hover:bg-[var(--luma-bg-elevated)] border border-[var(--luma-gold)]/40 hover:border-[var(--luma-gold)] text-[var(--luma-gold)] shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:scale-105 group"
      >
        <Menu className="w-5 h-5 text-[var(--luma-gold)] group-hover:rotate-180 transition-transform duration-500" />
        <span className="text-xs font-bold tracking-wide font-heading">
          {NAV_ITEMS.find((n) => n.id === activeTab)?.label || t.nav_toggle}
        </span>
      </button>

      {/* پرده تیره پس‌زمینه منو با بلور شیشه‌ای مدرن */}
      <div
        className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-md transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* سایدبار کشویی لوکس با لوگوی طلایی و ساختار هدر مرتب‌شده */}
      <aside
        className={`fixed top-0 bottom-0 ${
          dir === 'rtl' ? 'right-0' : 'left-0'
        } z-50 w-80 max-w-[85vw] bg-gradient-to-b from-[#131124]/95 via-[#0e0c1a]/95 to-[#080711]/95 border-s border-[var(--luma-gold)]/30 backdrop-blur-2xl shadow-2xl transition-transform duration-400 ease-out flex flex-col p-6 ${
          isDrawerOpen
            ? 'translate-x-0'
            : dir === 'rtl'
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
      >
        {/* هدر سایدبار با لوگوی اختصاصی و بدون هیچ تداخلی */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <Logo size="md" />
            <div className="min-w-0">
              <h2 className="font-heading text-base font-extrabold text-[var(--luma-gold)] tracking-wider truncate">
                LUMA
              </h2>
              <p className="text-[10px] text-[var(--luma-text-muted)] tracking-widest uppercase truncate">
                Cosmic Oracle
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* لیست گزینه‌های منو */}
        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTabSelect(id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--luma-gold-glow)] via-[var(--luma-gold-glow)]/50 to-transparent text-[var(--luma-gold)] border border-[var(--luma-gold)]/50 shadow-lg shadow-[var(--luma-gold-glow)]/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[var(--luma-gold)]' : 'text-slate-400'}`} />
                  <span>{label}</span>
                </div>
                {isActive && <ChevronLeft className="w-4 h-4 text-[var(--luma-gold)] animate-pulse" />}
              </button>
            );
          })}
        </nav>

        {/* فوتر منو */}
        <div className="pt-4 border-t border-white/10 text-center flex flex-col items-center gap-1">
          <p className="text-[11px] text-[var(--luma-gold)] font-medium">{t['layout_brand']}</p>
          <p className="text-[9px] text-[var(--luma-text-muted)]">{t['layout_tagline']}</p>
        </div>
      </aside>

      {/* کانتینر اصلی محتوا */}
      <div className="w-full flex-1 flex flex-col items-center">
        <main
          ref={mainRef}
          className="relative z-10 w-full max-w-md lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 lg:pb-16 transition-all"
        >
          {children}
        </main>
      </div>

      {/* منوی استاندارد پایین فقط در حالت موبایل */}
      <div className="lg:hidden">
        <BottomNav active={activeTab} onChange={onTabChange} />
      </div>
    </div>
  );
}