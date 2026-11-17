import { useEffect, useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { type TabId } from './components/layout/BottomNav';
import { AuthScreen } from './features/auth/AuthScreen';
import { HomeScreen } from './features/home/HomeScreen';
import { MyCosmicProfileScreen } from './features/cosmic-profile/MyCosmicProfileScreen';
import { ChartScreen } from './features/chart/ChartScreen';
import { TarotScreen } from './features/tarot/TarotScreen';
import { NumerologyScreen } from './features/numerology/NumerologyScreen';
import { ChineseScreen } from './features/chinese/ChineseScreen';
import WealthCodeScreen from './components/ui/numerology/WealthCodeScreen';
import ResearchScreen from './features/research/ResearchScreen';
import { ZodiacScreen } from './features/chart/ZodiacScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { SubscriptionScreen } from './features/subscription/SubscriptionScreen';
import { useAuthStore } from './store/useAuthStore';
import { getCurrentUser, onAuthStateChange } from './features/auth/authService';
import { Loader2 } from 'lucide-react';
import { verifyZarinpalPayment } from './features/subscription/zarinpalService';
import { useLanguageStore, UI_TRANSLATIONS } from './i18n/useLanguageStore';

function App() {
  const user = useAuthStore((s) => s.user);
  const lang = useLanguageStore((s) => s.lang);
  const t = UI_TRANSLATIONS[lang];
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [showSubscription, setShowSubscription] = useState(false);

  useEffect(() => {
    const openSubscription = () => setShowSubscription(true);
    window.addEventListener('luma:open-subscription', openSubscription);
    return () => window.removeEventListener('luma:open-subscription', openSubscription);
  }, []);

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser(u))
      .catch((err) => {
        console.error('Auth init error:', err);
        setUser(null);
      })
      .finally(() => setLoading(false));

    const {
      data: { subscription },
    } = onAuthStateChange((u) => {
      setUser(u);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  useEffect(() => {
    if (isLoading || !user) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('payment_verify') !== '1') return;

    const authority = url.searchParams.get('Authority') || url.searchParams.get('authority') || '';
    const status = url.searchParams.get('Status') || url.searchParams.get('status') || '';
    window.history.replaceState({}, '', `${url.pathname}${url.hash}`);
    if (!authority) {
      window.alert(t.payment_return_incomplete);
      return;
    }

    let active = true;
    verifyZarinpalPayment(authority, status)
      .then((result) => {
        if (!active) return;
        window.alert(result.success ? t.payment_verify_success : t.payment_verify_failed);
        if (result.success) window.dispatchEvent(new Event('luma:subscription-updated'));
      })
      .catch((error: unknown) => {
        console.error('Payment return verification failed:', error);
        if (active) window.alert(t.payment_verify_failed);
      });

    return () => {
      active = false;
    };
  }, [isLoading, user, t.payment_return_incomplete, t.payment_verify_failed, t.payment_verify_success]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--luma-bg)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--luma-gold)] animate-spin mx-auto mb-3" />
          <p className="text-sm text-[var(--luma-text-muted)]">{t.app_loading}</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  const renderScreen = () => {
    if (showSubscription) {
      return <SubscriptionScreen onBack={() => setShowSubscription(false)} />;
    }
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={setActiveTab} />;
      case 'cosmic':
        return <MyCosmicProfileScreen onNavigate={setActiveTab} />;
      case 'chart':
        return <ChartScreen />;
      case 'tarot':
        return <TarotScreen />;
      case 'numerology':
        return <NumerologyScreen />;
      case 'wealth-code':
        return <WealthCodeScreen />;
      case 'zodiac':
        return <ZodiacScreen onBack={() => setActiveTab('chart')} />;
      case 'research':
        return <ResearchScreen />;
      case 'chinese':
        return <ChineseScreen />;
      case 'profile':
        return <ProfileScreen />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderScreen()}
    </AppLayout>
  );
}

export default App;
