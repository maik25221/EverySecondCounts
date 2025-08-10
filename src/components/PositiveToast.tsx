import { useEffect, useState } from 'react';
import { classNames } from '../lib/utils';

interface PositiveToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
  duration?: number;
  type?: 'success' | 'info' | 'celebration';
}

export default function PositiveToast({ 
  message,
  isVisible,
  onHide,
  duration = 3000,
  type = 'success'
}: PositiveToastProps) {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(onHide, 300); // Wait for animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide, duration]);

  if (!isVisible) return null;

  const icons = {
    success: '✨',
    info: 'ℹ️',
    celebration: '🎉',
  };

  const colors = {
    success: 'bg-emerald-500 text-white',
    info: 'bg-blue-500 text-white',
    celebration: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={classNames(
        'flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 max-w-sm',
        colors[type],
        isShowing 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      )}>
        <span className="text-xl">{icons[type]}</span>
        <span className="font-medium text-sm">{message}</span>
        <button
          onClick={() => setIsShowing(false)}
          className="text-white/80 hover:text-white ml-2"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
}