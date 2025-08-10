import { useTranslation } from 'react-i18next';

interface HeaderProps {
  currentPage: 'home' | 'goals' | 'settings' | 'about';
  onNavigate: (page: 'home' | 'goals' | 'settings' | 'about') => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { t } = useTranslation();

  const navItems = [
    { key: 'home' as const, label: t('nav.home'), icon: '🏠' },
    { key: 'goals' as const, label: t('nav.goals'), icon: '🎯' },
    { key: 'settings' as const, label: t('nav.settings'), icon: '⚙️' },
    { key: 'about' as const, label: t('nav.about'), icon: 'ℹ️' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="text-2xl group-hover:scale-110 transition-transform">⏰</div>
            <h1 className="text-xl font-heading font-bold text-brand-600 group-hover:text-brand-700 transition-colors">
              everySecondCounts
            </h1>
          </div>
          
          <nav className="flex space-x-1">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.key
                    ? 'bg-brand-100 text-brand-700 shadow-sm'
                    : 'text-gray-600 hover:text-brand-600 hover:bg-brand-50'
                }`}
                aria-label={item.label}
              >
                <span className="text-base">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}