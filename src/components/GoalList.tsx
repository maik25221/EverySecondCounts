import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Goal } from '../lib/models';
import { diffNowToISO } from '../lib/time';
import GoalListItem from './GoalListItem';
import EmptyState from './EmptyState';

interface GoalListProps {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onComplete: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export default function GoalList({
  goals,
  onEdit,
  onComplete,
  onRestore,
  onDelete,
  onCreateNew,
}: GoalListProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const { pendingGoals, completedGoals } = useMemo(() => {
    const pending = goals.filter(goal => !goal.completedAtISO);
    const completed = goals.filter(goal => goal.completedAtISO);

    // Sort pending goals by urgency (less time remaining first)
    const sortedPending = pending.sort((a, b) => {
      const timeA = diffNowToISO(a.deadlineISO);
      const timeB = diffNowToISO(b.deadlineISO);
      return timeA.totalMs - timeB.totalMs;
    });

    // Sort completed goals by completion date (most recent first)
    const sortedCompleted = completed.sort((a, b) => {
      const dateA = new Date(a.completedAtISO!).getTime();
      const dateB = new Date(b.completedAtISO!).getTime();
      return dateB - dateA;
    });

    return {
      pendingGoals: sortedPending,
      completedGoals: sortedCompleted,
    };
  }, [goals]);

  const currentGoals = activeTab === 'pending' ? pendingGoals : completedGoals;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
            activeTab === 'pending'
              ? 'bg-white text-brand-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('goals.pending')} ({pendingGoals.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
            activeTab === 'completed'
              ? 'bg-white text-brand-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('goals.completed')} ({completedGoals.length})
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {currentGoals.length === 0 ? (
          <EmptyState
            icon={activeTab === 'pending' ? '🎯' : '🏆'}
            title={
              activeTab === 'pending'
                ? t('goals.empty')
                : t('goals.completedEmpty')
            }
            subtitle={
              activeTab === 'pending'
                ? t('goals.emptySubtitle')
                : t('goals.completedEmptySubtitle')
            }
            action={
              activeTab === 'pending' ? (
                <button onClick={onCreateNew} className="btn-primary">
                  {t('goals.new')}
                </button>
              ) : null
            }
          />
        ) : (
          currentGoals.map(goal => (
            <GoalListItem
              key={goal.id}
              goal={goal}
              onEdit={onEdit}
              onComplete={onComplete}
              onRestore={onRestore}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Floating Action Button for Pending Tab */}
      {activeTab === 'pending' && (
        <button
          onClick={onCreateNew}
          className="fixed bottom-6 right-6 bg-brand-600 hover:bg-brand-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40"
          aria-label={t('goals.new')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}