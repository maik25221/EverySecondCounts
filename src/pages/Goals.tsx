import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Goal } from '../lib/models';
import { useAppStore, useGoals } from '../state/store';
import GoalList from '../components/GoalList';
import GoalEditor from '../components/GoalEditor';
import PositiveToast from '../components/PositiveToast';
import ConfettiTrigger from '../components/ConfettiTrigger';

export default function Goals() {
  const { t } = useTranslation();
  const goals = useGoals();
  const { addGoal, updateGoal, completeGoal, restoreGoal, deleteGoal } = useAppStore();
  
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'celebration' } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCreateNew = () => {
    setEditingGoal(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsEditorOpen(true);
  };

  const handleSave = (goal: Goal) => {
    if (editingGoal) {
      updateGoal(goal);
      showToast(t('messages.goalUpdated'), 'success');
    } else {
      addGoal(goal);
      showToast(t('messages.goalCreated'), 'success');
    }
    setIsEditorOpen(false);
    setEditingGoal(null);
  };

  const handleCancel = () => {
    setIsEditorOpen(false);
    setEditingGoal(null);
  };

  const handleComplete = (id: string) => {
    completeGoal(id);
    showToast(t('messages.goalCompleted'), 'celebration');
    setShowConfetti(true);
  };

  const handleRestore = (id: string) => {
    restoreGoal(id);
    showToast(t('messages.goalRestored'), 'info');
  };

  const handleDelete = (id: string) => {
    deleteGoal(id);
    showToast(t('messages.goalDeleted'), 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'celebration') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">
          {t('goals.title')} 🎯
        </h1>
        <p className="text-gray-600">
          {t('goals.subtitle')}
        </p>
      </div>

      <GoalList
        goals={goals}
        onEdit={handleEdit}
        onComplete={handleComplete}
        onRestore={handleRestore}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />

      <GoalEditor
        goal={editingGoal || undefined}
        isOpen={isEditorOpen}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {toast && (
        <PositiveToast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onHide={hideToast}
        />
      )}

      <ConfettiTrigger 
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </div>
  );
}