import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { type TabId } from './components/layout/BottomNav';
import { HomeScreen } from './features/home/HomeScreen';
import { ChartScreen } from './features/chart/ChartScreen';
import { TarotScreen } from './features/tarot/TarotScreen';
import { NumerologyScreen } from './features/numerology/NumerologyScreen';
import { ChineseScreen } from './features/chinese/ChineseScreen';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen onNavigate={setActiveTab} />;
      case 'chart': return <ChartScreen />;
      case 'tarot': return <TarotScreen />;
      case 'numerology': return <NumerologyScreen />;
      case 'chinese': return <ChineseScreen />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderScreen()}
    </AppLayout>
  );
}

export default App;