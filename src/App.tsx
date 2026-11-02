import { useEffect, useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { type TabId } from './components/layout/BottomNav';
import { AuthScreen } from './features/auth/AuthScreen';
import { HomeScreen } from './features/home/HomeScreen';
import { ChartScreen } from './features/chart/ChartScreen';
import { TarotScreen } from './features/tarot/TarotScreen';
import { NumerologyScreen } from './features/numerology/NumerologyScreen';
import { ChineseScreen } from './features/chinese/ChineseScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { useAuthStore } from './store/useAuthStore';
import { getCurrentUser, onAuthStateChange } from './features/auth/authService';
import { Loader2 } from 'lucide-react';

function App() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [activeTab, setActiveTab] = useState<TabId>('home');

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser(u))
      .catch((err) => {
        console.error('Auth init error:', err);
        setUser(null);
      })
      .finally(() => setLoading(false));

    const { data: { subscription } } = onAuthStateChange((u) => {
      setUser(u);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--luma-bg)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--luma-gold)] animate-spin mx-auto mb-3" />
          <p className="text-sm text-[var(--luma-text-muted)]">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen onNavigate={setActiveTab} />;
      case 'chart': return <ChartScreen />;
      case 'tarot': return <TarotScreen />;
      case 'numerology': return <NumerologyScreen />;
      case 'chinese': return <ChineseScreen />;
      case 'profile': return <ProfileScreen />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderScreen()}
    </AppLayout>
  );
}

export default App;