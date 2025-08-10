import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubGoal } from '../lib/models';
import { useAppStore } from '../state/store';
import { generateSubGoalId } from '../lib/progress';

interface SubGoalManagerProps {
  goalId: string;
  subGoals: SubGoal[];
  disabled?: boolean;
}

export default function SubGoalManager({ goalId, subGoals, disabled = false }: SubGoalManagerProps) {
  const { t } = useTranslation();
  const { addSubGoal, updateSubGoal, completeSubGoal, deleteSubGoal } = useAppStore();
  const [newSubGoalTitle, setNewSubGoalTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleAddSubGoal = () => {
    if (newSubGoalTitle.trim()) {
      const newSubGoal: SubGoal = {
        id: generateSubGoalId(),
        title: newSubGoalTitle.trim(),
        completed: false
      };
      addSubGoal(goalId, newSubGoal);
      setNewSubGoalTitle('');
    }
  };

  const handleEditSubGoal = (subGoal: SubGoal) => {
    setEditingId(subGoal.id);
    setEditingTitle(subGoal.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editingTitle.trim()) {
      updateSubGoal(goalId, editingId, { title: editingTitle.trim() });
      setEditingId(null);
      setEditingTitle('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const handleToggleComplete = (subGoalId: string, completed: boolean) => {
    if (completed) {
      updateSubGoal(goalId, subGoalId, { 
        completed: false, 
        completedAtISO: undefined 
      });
    } else {
      completeSubGoal(goalId, subGoalId);
    }
  };

  const handleDeleteSubGoal = (subGoalId: string) => {
    if (confirm(t('messages.deleteSubGoalConfirm'))) {
      deleteSubGoal(goalId, subGoalId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">{t('goals.subGoals')}</h4>
        <span className="text-sm text-gray-500">
          {subGoals.filter(sub => sub.completed).length}/{subGoals.length}
        </span>
      </div>

      {/* Sub-goals list */}
      <div className="space-y-2">
        {subGoals.map((subGoal) => (
          <div key={subGoal.id} className="flex items-center space-x-2 group">
            <button
              onClick={() => handleToggleComplete(subGoal.id, subGoal.completed)}
              disabled={disabled}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                subGoal.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-400'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {subGoal.completed && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {editingId === subGoal.id ? (
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleSaveEdit)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="text-green-600 hover:text-green-700 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-between">
                <span 
                  className={`text-sm ${subGoal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
                >
                  {subGoal.title}
                </span>
                {!disabled && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button
                      onClick={() => handleEditSubGoal(subGoal)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteSubGoal(subGoal.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new sub-goal */}
      {!disabled && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newSubGoalTitle}
            onChange={(e) => setNewSubGoalTitle(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleAddSubGoal)}
            placeholder={t('goals.addSubGoalPlaceholder')}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
          <button
            onClick={handleAddSubGoal}
            disabled={!newSubGoalTitle.trim()}
            className="btn-primary text-sm px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.add')}
          </button>
        </div>
      )}
    </div>
  );
}