import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">⏰</div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
          {t('about.title')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('about.subtitle')}
        </p>
      </div>

      <div className="space-y-12">
        {/* Description */}
        <div className="card">
          <p className="text-gray-700 leading-relaxed text-lg">
            {t('about.description')}
          </p>
        </div>

        {/* Philosophy */}
        <div className="card bg-gradient-to-r from-brand-50 to-cyan-50 border-brand-200">
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-3">💡</span>
            {t('about.philosophy')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('about.philosophyText')}
          </p>
        </div>

        {/* Features */}
        <div className="card">
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">✨</span>
            {t('about.features')}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">⏱️</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('about.feature1')}
                </h3>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('about.feature2')}
                </h3>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">💬</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('about.feature3')}
                </h3>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">🎨</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('about.feature4')}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="card bg-amber-50 border-amber-200">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h2 className="text-lg font-heading font-semibold text-amber-800 mb-2">
                {t('about.disclaimer')}
              </h2>
              <p className="text-amber-700 leading-relaxed">
                {t('about.disclaimerText')}
              </p>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="card bg-gray-50">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-heading font-semibold text-gray-900">
              {t('about.version')}
            </h3>
            
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="px-3 py-1 bg-white rounded-full border">React</span>
              <span className="px-3 py-1 bg-white rounded-full border">TypeScript</span>
              <span className="px-3 py-1 bg-white rounded-full border">Tailwind CSS</span>
              <span className="px-3 py-1 bg-white rounded-full border">Zustand</span>
              <span className="px-3 py-1 bg-white rounded-full border">i18next</span>
              <span className="px-3 py-1 bg-white rounded-full border">Luxon</span>
            </div>
            
            <p className="text-gray-600 italic">
              {t('about.madeWith')}
            </p>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="text-center py-8">
          <blockquote className="text-xl font-medium text-gray-700 italic mb-4">
            "El tiempo que disfrutas perdiendo, no es tiempo perdido"
          </blockquote>
          <cite className="text-sm text-gray-500">— John Lennon</cite>
        </div>
      </div>
    </div>
  );
}