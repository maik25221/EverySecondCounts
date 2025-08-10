import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Goal } from '../lib/models';
import { generateId } from '../lib/utils';
import { createDeadlineISO } from '../lib/life';
import { DateTime } from 'luxon';

interface GoalEditorProps {
  goal?: Goal;
  isOpen: boolean;
  onSave: (goal: Goal) => void;
  onCancel: () => void;
}

export default function GoalEditor({ goal, isOpen, onSave, onCancel }: GoalEditorProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    deadline: '',
    time: '',
  });

  const isEditing = !!goal;

  useEffect(() => {
    if (isOpen) {
      if (goal) {
        // Editing existing goal
        const deadline = DateTime.fromISO(goal.deadlineISO);
        setFormData({
          title: goal.title,
          deadline: deadline.toFormat('yyyy-MM-dd'),
          time: deadline.toFormat('HH:mm'),
        });
      } else {
        // Creating new goal
        setFormData({
          title: '',
          deadline: '',
          time: '23:59',
        });
      }
    }
  }, [goal, isOpen]);

  const handleSave = () => {
    if (!formData.title.trim() || !formData.deadline) return;

    const deadlineISO = createDeadlineISO(formData.deadline, formData.time);

    const goalToSave: Goal = {
      id: goal?.id || generateId(),
      title: formData.title.trim(),
      deadlineISO,
      completedAtISO: goal?.completedAtISO || null,
    };

    onSave(goalToSave);
  };

  const canSave = formData.title.trim() !== '' && formData.deadline !== '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-gray-900">
              {isEditing ? t('goals.edit') : t('goals.new')}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={t('common.close')}
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="goalTitle" className="block text-sm font-medium text-gray-700 mb-2">
                {t('goals.title_label')} *
              </label>
              <input
                id="goalTitle"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t('goals.title_placeholder')}
                className="input-field"
                maxLength={100}
                required
              />
              <div className="mt-1 text-xs text-gray-500 text-right">
                {formData.title.length}/100
              </div>
            </div>

            <div>
              <label htmlFor="goalDeadline" className="block text-sm font-medium text-gray-700 mb-2">
                {t('goals.deadlineLabel')} *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    id="goalDeadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                    required
                  />
                  <div className="mt-1 text-xs text-gray-500">Fecha</div>
                </div>
                <div>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="input-field"
                  />
                  <div className="mt-1 text-xs text-gray-500">Hora</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-8">
            <button
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}