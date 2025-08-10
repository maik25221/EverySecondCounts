import { useTranslation } from 'react-i18next';
import { Goal } from '../lib/models';
import { calculateTimeAnalysis, formatHours } from '../lib/timeTracking';

interface TimeAnalysisCardProps {
  goal: Goal;
  className?: string;
}

export default function TimeAnalysisCard({ goal, className = '' }: TimeAnalysisCardProps) {
  const { t } = useTranslation();
  const analysis = calculateTimeAnalysis(goal);

  if (!goal.estimatedHours) {
    return null; // Don't show if no estimated hours
  }

  const getStatusColor = () => {
    if (analysis.progressPercentage >= 100) return 'text-green-600 bg-green-50 border-green-200';
    if (analysis.isOnTrack) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getStatusIcon = () => {
    if (analysis.progressPercentage >= 100) return '✅';
    if (analysis.isOnTrack) return '📊';
    return '⚠️';
  };

  const getStatusText = () => {
    if (analysis.progressPercentage >= 100) return t('goals.timeComplete');
    if (analysis.isOnTrack) return t('goals.onTrack');
    return t('goals.needsAttention');
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">{t('goals.timeAnalysis')}</h4>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          <span>{getStatusIcon()}</span>
          <span>{getStatusText()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Time Progress */}
        <div className="space-y-1">
          <div className="text-sm text-gray-600">{t('goals.timeProgress')}</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatHours(analysis.totalWorkedHours)} / {formatHours(analysis.estimatedHours)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, analysis.progressPercentage)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500">
            {analysis.progressPercentage.toFixed(1)}% completado
          </div>
        </div>

        {/* Daily Recommendation */}
        <div className="space-y-1">
          <div className="text-sm text-gray-600">{t('goals.dailyRecommendation')}</div>
          <div className="text-lg font-semibold text-gray-900">
            {analysis.daysUntilDeadline > 0 ? formatHours(analysis.suggestedDailyHours) : '—'}
          </div>
          <div className="text-xs text-gray-500">
            {analysis.daysUntilDeadline > 0 
              ? t('goals.daysRemaining', { days: analysis.daysUntilDeadline })
              : t('goals.deadlinePassed')
            }
          </div>
          {analysis.averageHoursPerDay > 0 && (
            <div className="text-xs text-gray-500">
              {t('goals.averageDaily', { hours: formatHours(analysis.averageHoursPerDay) })}
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-100 pt-3">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {formatHours(analysis.remainingHours)}
          </div>
          <div className="text-xs text-gray-500">{t('goals.remaining')}</div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-900">
            {analysis.daysUntilDeadline}
          </div>
          <div className="text-xs text-gray-500">{t('goals.daysLeft')}</div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-900">
            {goal.workSessions?.length || 0}
          </div>
          <div className="text-xs text-gray-500">{t('goals.sessions')}</div>
        </div>
      </div>

      {/* Recommendations */}
      {analysis.daysUntilDeadline > 0 && analysis.remainingHours > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-600">
            💡 {analysis.suggestedDailyHours > 8 
              ? t('goals.intensiveScheduleNeeded')
              : analysis.suggestedDailyHours > 4
                ? t('goals.moderateEffortNeeded')
                : t('goals.lightEffortNeeded')
            }
          </div>
        </div>
      )}
    </div>
  );
}