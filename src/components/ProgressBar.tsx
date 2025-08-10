import { GoalProgress, getProgressColor } from '../lib/progress';

interface ProgressBarProps {
  progress: GoalProgress;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProgressBar({ 
  progress, 
  showText = true, 
  size = 'md',
  className = '' 
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {showText && (
        <div className={`flex justify-between items-center ${textSizeClasses[size]}`}>
          <span className="text-gray-600 font-medium">
            Progreso
          </span>
          <span className="text-gray-500">
            {progress.percentage}%
          </span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(progress.percentage)}`}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
      
      {showText && progress.total > 1 && (
        <div className={`text-gray-500 ${textSizeClasses[size]}`}>
          {progress.completed} de {progress.total} pasos completados
        </div>
      )}
    </div>
  );
}