import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sex, UserProfile } from '../lib/models';
import { useAppStore, useProfile, useSettings } from '../state/store';
import { countries, getLifeExpectancyByCountry } from '../lib/countries';
import { formatDateForInput, createISOFromDate, calculateAge } from '../lib/life';
import { clamp } from '../lib/utils';
import { themes } from '../lib/themes';
import PositiveToast from '../components/PositiveToast';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const profile = useProfile();
  const settings = useSettings();
  const { setProfile, setTheme, setBackgroundImage } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    birthDate: '',
    sex: 'male' as Sex,
    nationalityCode: 'GLOBAL',
    lifeExpectancyYears: 82,
  });
  const [toast, setToast] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        birthDate: formatDateForInput(profile.birthDateISO),
        sex: profile.sex,
        nationalityCode: profile.nationalityCode || 'GLOBAL',
        lifeExpectancyYears: profile.lifeExpectancyYears,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      const current = {
        birthDate: formatDateForInput(profile.birthDateISO),
        sex: profile.sex,
        nationalityCode: profile.nationalityCode || 'GLOBAL',
        lifeExpectancyYears: profile.lifeExpectancyYears,
      };
      
      const changed = JSON.stringify(current) !== JSON.stringify(formData);
      setHasChanges(changed);
    }
  }, [formData, profile]);

  const handleSave = () => {
    if (!profile) return;

    const updatedProfile: UserProfile = {
      birthDateISO: createISOFromDate(formData.birthDate),
      sex: formData.sex,
      nationalityCode: formData.nationalityCode === 'GLOBAL' ? undefined : formData.nationalityCode,
      lifeExpectancyYears: formData.lifeExpectancyYears,
    };

    setProfile(updatedProfile);
    setToast(t('messages.profileUpdated'));
    setHasChanges(false);
  };

  const handleNationalityChange = (nationalityCode: string) => {
    const lifeExp = getLifeExpectancyByCountry(nationalityCode === 'GLOBAL' ? undefined : nationalityCode);
    setFormData(prev => ({
      ...prev,
      nationalityCode,
      lifeExpectancyYears: lifeExp,
    }));
  };

  const currentAge = profile ? calculateAge(profile.birthDateISO) : 0;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setBackgroundImage(imageUrl);
        setToast(t('settings.backgroundUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBackground = () => {
    setBackgroundImage('');
    setToast(t('settings.backgroundRemoved'));
  };

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
          {t('settings.title')} ⚙️
        </h1>
        <p className="text-gray-600">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-1">
              {t('settings.profile')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('settings.profileSubtitle')}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.birthDate')}
              </label>
              <input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                className="input-field"
                max={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 mt-1">
                Edad actual: {currentAge} años
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.sex')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['male', 'female'] as Sex[]).map((sex) => (
                  <label key={sex} className="relative">
                    <input
                      type="radio"
                      name="sex"
                      value={sex}
                      checked={formData.sex === sex}
                      onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value as Sex }))}
                      className="sr-only"
                    />
                    <div className={`p-3 border-2 rounded-lg text-center cursor-pointer transition-all ${
                      formData.sex === sex
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-gray-200 hover:border-brand-300'
                    }`}>
                      {t(`onboarding.${sex}`)}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.nationality')}
              </label>
              <select
                id="nationality"
                value={formData.nationalityCode}
                onChange={(e) => handleNationalityChange(e.target.value)}
                className="input-field"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {t(`countries.${country.code}`, { defaultValue: country.name })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="lifeExpectancy" className="block text-sm font-medium text-gray-700 mb-2">
                {t('onboarding.lifeExp')}
              </label>
              <div className="space-y-3">
                <input
                  id="lifeExpectancy"
                  type="number"
                  min="40"
                  max="120"
                  value={formData.lifeExpectancyYears}
                  onChange={(e) => {
                    const value = clamp(parseInt(e.target.value) || 40, 40, 120);
                    setFormData(prev => ({ ...prev, lifeExpectancyYears: value }));
                  }}
                  className="input-field text-center text-lg font-semibold"
                />
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={formData.lifeExpectancyYears}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setFormData(prev => ({ ...prev, lifeExpectancyYears: value }));
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>40 años</span>
                  <span>120 años</span>
                </div>
              </div>
            </div>
          </div>

          {hasChanges && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    if (profile) {
                      setFormData({
                        birthDate: formatDateForInput(profile.birthDateISO),
                        sex: profile.sex,
                        nationalityCode: profile.nationalityCode || 'GLOBAL',
                        lifeExpectancyYears: profile.lifeExpectancyYears,
                      });
                    }
                  }}
                  className="btn-secondary flex-1"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary flex-1"
                >
                  {t('common.save')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Section */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-1">
              🎨 {t('settings.theme')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('settings.themeSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((theme) => (
              <label key={theme.id} className="relative">
                <input
                  type="radio"
                  name="theme"
                  value={theme.id}
                  checked={settings.themeId === theme.id}
                  onChange={() => setTheme(theme.id)}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  settings.themeId === theme.id
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200" 
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200" 
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200" 
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{t(theme.name)}</div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Background Section */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-1">
              🖼️ {t('settings.background')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('settings.backgroundSubtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {settings.backgroundImage && (
              <div className="relative">
                <img 
                  src={settings.backgroundImage} 
                  alt={t('settings.currentBackground')} 
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  onClick={handleRemoveBackground}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary flex-1"
              >
                📁 {t('settings.uploadImage')}
              </button>
              {settings.backgroundImage && (
                <button
                  onClick={handleRemoveBackground}
                  className="btn-secondary"
                >
                  🗑️ {t('settings.removeBackground')}
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <p className="text-xs text-gray-500">
              {t('settings.backgroundHint')}
            </p>
          </div>
        </div>

        {/* Language Section */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-1">
              {t('settings.language')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('settings.languageSubtitle')}
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="language"
                value="es-ES"
                checked={i18n.language === 'es-ES'}
                onChange={() => {
                  i18n.changeLanguage('es-ES');
                  localStorage.setItem('language', 'es-ES');
                }}
                className="text-brand-600"
              />
              <div>
                <div className="font-medium">Español</div>
                <div className="text-sm text-gray-500">Spanish</div>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="language"
                value="en-US"
                checked={i18n.language === 'en-US'}
                onChange={() => {
                  i18n.changeLanguage('en-US');
                  localStorage.setItem('language', 'en-US');
                }}
                className="text-brand-600"
              />
              <div>
                <div className="font-medium">English</div>
                <div className="text-sm text-gray-500">English</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {toast && (
        <PositiveToast
          message={toast}
          type="success"
          isVisible={!!toast}
          onHide={() => setToast(null)}
        />
      )}
    </div>
  );
}