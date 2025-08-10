import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserProfile, CountdownTime } from '../lib/models';
import { calculateLifeTimeLeft } from '../lib/life';
import { formatCountdownTime } from '../lib/time';
import { getRandomPositiveMessage } from '../lib/messages';

interface LifeCountdownCardProps {
  profile: UserProfile;
}

export default function LifeCountdownCard({ profile }: LifeCountdownCardProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<CountdownTime | null>(null);
  const [positiveMessage, setPositiveMessage] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const time = calculateLifeTimeLeft(profile);
      setTimeLeft(time);
    };

    // Update immediately
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [profile]);

  useEffect(() => {
    // Set initial message
    setPositiveMessage(getRandomPositiveMessage());
    
    // Change message every 10 seconds
    const messageInterval = setInterval(() => {
      setPositiveMessage(getRandomPositiveMessage());
    }, 10000);
    
    return () => clearInterval(messageInterval);
  }, []);

  if (!timeLeft) {
    return (
      <div className="card animate-pulse">
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-brand-50 to-cyan-50 border-brand-200">
      <div className="text-center">
        <h2 className="text-lg font-heading font-semibold text-gray-900 mb-6">
          {t('home.title')}
        </h2>
        
        <div className="text-4xl md:text-5xl font-mono font-bold text-brand-600 mb-6 tracking-tight">
          {formatCountdownTime(timeLeft)}
        </div>
        
        <div className="text-gray-600 text-sm mb-4">
          <span className="inline-flex items-center space-x-2">
            <span>{t('common.days')} • {t('common.hours')} : {t('common.minutes')} : {t('common.seconds')}</span>
          </span>
        </div>
        
        <div className="bg-white/60 rounded-lg p-4 border border-brand-200/30">
          <p className="text-brand-700 font-medium text-center italic">
            "{positiveMessage}"
          </p>
        </div>
      </div>
    </div>
  );
}