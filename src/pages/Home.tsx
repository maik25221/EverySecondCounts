import { useTranslation } from 'react-i18next';
import { useProfile } from '../state/store';
import LifeCountdownCard from '../components/LifeCountdownCard';

interface HomeProps {
  onNavigate: (page: 'goals', tab?: 'completed') => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { t } = useTranslation();
  const profile = useProfile();

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-cyan-50 app-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⏰</div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
          ¡Hola! 👋
        </h1>
        <p className="text-gray-600">
          Cada segundo es una oportunidad para hacer algo extraordinario
        </p>
      </div>

      <LifeCountdownCard profile={profile} />

      <div className="mt-8 space-y-4">
        <button
          onClick={() => onNavigate('goals')}
          className="card bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 hover:from-cyan-100 hover:to-blue-100 transition-all cursor-pointer w-full text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🎯</div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-gray-900 mb-1">
                Define tus hitos
              </h3>
              <p className="text-sm text-gray-600">
                Crea metas significativas y observa cómo cada segundo te acerca a ellas
              </p>
            </div>
            <div className="text-cyan-600 hover:text-cyan-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('goals', 'completed')}
          className="card bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:from-amber-100 hover:to-orange-100 transition-all cursor-pointer w-full text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="text-3xl">✨</div>
            <div className="flex-1">
              <h3 className="font-heading font-semibold text-gray-900 mb-1">
                Celebra cada logro
              </h3>
              <p className="text-sm text-gray-600">
                Reconoce tus avances y mantén una perspectiva positiva del tiempo
              </p>
            </div>
            <div className="text-amber-600 hover:text-amber-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 italic">
          "El tiempo que disfrutas perdiendo, no es tiempo perdido"
        </p>
      </div>
    </div>
  );
}