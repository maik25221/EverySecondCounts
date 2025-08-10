import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Goal, CountdownTime } from '../lib/models';
import { diffNowToISO, isOverdue, isUrgent, formatTimeLeft } from '../lib/time';
import { classNames } from '../lib/utils';
import { getCategoryConfig } from '../lib/categories';
import { calculateGoalProgress } from '../lib/progress';
import ProgressBar from './ProgressBar';
import SubGoalManager from './SubGoalManager';

interface GoalListItemProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onComplete: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function GoalListItem({ 
  goal,
  onEdit,
  onComplete,
  onRestore,
  onDelete 
}: GoalListItemProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<CountdownTime | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [showSubGoals, setShowSubGoals] = useState(false);
  
  const categoryConfig = getCategoryConfig(goal.category || 'other');
  const progress = calculateGoalProgress(goal);

  const isCompleted = !!goal.completedAtISO;

  useEffect(() => {
    if (isCompleted) return;

    const updateCountdown = () => {
      const time = diffNowToISO(goal.deadlineISO);
      setTimeLeft(time);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [goal.deadlineISO, isCompleted]);

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600 bg-green-50 border-green-200';
    if (!timeLeft) return 'text-gray-600 bg-gray-50 border-gray-200';
    if (timeLeft && isOverdue(timeLeft)) return 'text-red-600 bg-red-50 border-red-200';
    if (timeLeft && isUrgent(timeLeft)) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-brand-600 bg-brand-50 border-brand-200';
  };

  const getStatusText = () => {
    if (isCompleted) return t('goals.completed');
    if (!timeLeft) return t('common.loading');
    if (isOverdue(timeLeft)) return t('goals.overdue');
    return formatTimeLeft(timeLeft);
  };

  return (
    <div className={classNames(
      'card transition-all duration-200 hover:shadow-md',
      getStatusColor(),
      timeLeft && isUrgent(timeLeft) && !isCompleted && !isOverdue(timeLeft) ? 'animate-pulse' : ''
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xl">{categoryConfig.icon}</span>
                <h3 className={classNames(
                  'font-heading font-semibold text-lg',
                  isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                )}>
                  {goal.title}
                </h3>
                {goal.priority && goal.priority !== 'medium' && (
                  <span className={classNames(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    goal.priority === 'high' 
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  )}>
                    {t(`goals.priorities.${goal.priority}`)}
                  </span>
                )}
              </div>
              
              {goal.description && (
                <p className="text-sm text-gray-600 mb-2">
                  {goal.description}
                </p>
              )}
              
              <div className="flex items-center space-x-3 text-sm mb-2">
                <div className={classNames(
                  'flex items-center space-x-2 px-2 py-1 rounded-full',
                  getStatusColor()
                )}>
                  <div className={classNames(
                    'w-2 h-2 rounded-full',
                    isCompleted 
                      ? 'bg-green-500'
                      : !timeLeft 
                        ? 'bg-gray-400'
                        : isOverdue(timeLeft)
                          ? 'bg-red-500'
                          : isUrgent(timeLeft)
                            ? 'bg-amber-500'
                            : 'bg-brand-500'
                  )} />
                  <span className="font-medium">{getStatusText()}</span>
                </div>
                
                <span className="text-gray-500">
                  {t(categoryConfig.nameKey)}
                </span>
                
                {goal.estimatedHours && (
                  <span className="text-gray-500">
                    {goal.estimatedHours}h estimadas
                  </span>
                )}
              </div>
              
              {goal.tags && goal.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {goal.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {goal.subGoals && goal.subGoals.length > 0 && (
                <div className="space-y-2">
                  <ProgressBar 
                    progress={progress} 
                    showText={false} 
                    size="sm" 
                  />
                  
                  {goal.subGoals.length > 0 && (
                    <button
                      onClick={() => setShowSubGoals(!showSubGoals)}
                      className="flex items-center space-x-1 text-sm text-brand-600 hover:text-brand-700"
                    >
                      <span>{progress.completed}/{progress.total} pasos</span>
                      <svg className={`w-4 h-4 transition-transform ${showSubGoals ? 'rotate-180' : ''}`} 
                           fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {showSubGoals && goal.subGoals && goal.subGoals.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <SubGoalManager 
                goalId={goal.id}
                subGoals={goal.subGoals}
                disabled={isCompleted}
              />
            </div>
          )}
        </div>

        <div className="relative ml-4">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Más acciones"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 min-w-32">
                {!isCompleted && (
                  <button
                    onClick={() => {
                      onComplete(goal.id);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-green-600 hover:text-green-700"
                  >
                    ✓ {t('common.complete')}
                  </button>
                )}
                
                {isCompleted && (
                  <button
                    onClick={() => {
                      onRestore(goal.id);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-blue-600 hover:text-blue-700"
                  >
                    ↺ {t('common.restore')}
                  </button>
                )}

                <button
                  onClick={() => {
                    onEdit(goal);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-600 hover:text-gray-700"
                >
                  ✏️ {t('common.edit')}
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(t('messages.deleteConfirm'))) {
                      onDelete(goal.id);
                    }
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 hover:text-red-700"
                >
                  🗑️ {t('common.delete')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}