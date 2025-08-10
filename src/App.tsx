import { useState, useEffect } from 'react';
import { useHasProfile } from './state/store';
import Header from './components/Header';
import Home from './pages/Home';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import About from './pages/About';
import Onboarding from './pages/Onboarding';
import './i18n';

type Page = 'home' | 'goals' | 'settings' | 'about';

export default function App() {
  const hasProfile = useHasProfile();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [goalsTab, setGoalsTab] = useState<'pending' | 'completed'>('pending');
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    setIsOnboardingComplete(hasProfile);
  }, [hasProfile]);

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
    setCurrentPage('home');
  };

  const handleNavigate = (page: Page, tab?: 'completed') => {
    setCurrentPage(page);
    if (page === 'goals' && tab === 'completed') {
      setGoalsTab('completed');
    } else if (page === 'goals') {
      setGoalsTab('pending');
    }
  };

  if (!isOnboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'goals':
        return <Goals initialTab={goalsTab} />;
      case 'settings':
        return <Settings />;
      case 'about':
        return <About />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 app-background">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="pb-20">
        {renderPage()}
      </main>
    </div>
  );
}