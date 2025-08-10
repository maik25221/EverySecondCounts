import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserProfile, Sex } from '../lib/models';
import { countries, getLifeExpectancyByCountry } from '../lib/countries';
import { useAppStore } from '../state/store';
import { createISOFromDate } from '../lib/life';
import { clamp } from '../lib/utils';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { t } = useTranslation();
  const setProfile = useAppStore(state => state.setProfile);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    birthDate: '',
    sex: 'male' as Sex,
    nationalityCode: 'GLOBAL',
    lifeExpectancyYears: 82,
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      
      // Update life expectancy when nationality is selected
      if (step === 2) {
        const lifeExp = getLifeExpectancyByCountry(formData.nationalityCode);
        setFormData(prev => ({ ...prev, lifeExpectancyYears: lifeExp }));
      }
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      birthDateISO: createISOFromDate(formData.birthDate),
      sex: formData.sex,
      nationalityCode: formData.nationalityCode === 'GLOBAL' ? undefined : formData.nationalityCode,
      lifeExpectancyYears: formData.lifeExpectancyYears,
    };

    setProfile(profile);
    onComplete();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.birthDate !== '';
      case 2:
        return formData.nationalityCode !== '';
      case 3:
        return formData.lifeExpectancyYears >= 40 && formData.lifeExpectancyYears <= 120;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-cyan-50 app-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-3xl font-heading font-bold text-brand-600 mb-2">
            everySecondCounts
          </h1>
          <p className="text-gray-600">{t('onboarding.welcome')}</p>
        </div>

        <div className="card">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-heading font-semibold text-gray-900">
                {t('onboarding.title')}
              </h2>
              <span className="text-sm text-gray-500">
                {step} / {totalSteps}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.birthDateLabel')}
                </label>
                <input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="input-field"
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.sexLabel')}
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.nationalityLabel')}
                </label>
                <select
                  id="nationality"
                  value={formData.nationalityCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationalityCode: e.target.value }))}
                  className="input-field"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {t(`countries.${country.code}`, { defaultValue: country.name })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="lifeExpectancy" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.lifeExpLabel')}
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  {t('onboarding.lifeExpHint')}
                </p>
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
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('onboarding.back')}
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === totalSteps ? t('onboarding.finish') : t('onboarding.continue')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}