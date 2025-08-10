import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Goal, GoalCategory, SubGoal } from '../lib/models';
import { generateId } from '../lib/utils';
import { createDeadlineISO } from '../lib/life';
import { DateTime } from 'luxon';
import CategorySelector from './CategorySelector';
import SubGoalManager from './SubGoalManager';
import { generateSubGoalId } from '../lib/progress';

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
    description: '',
    category: 'personal' as GoalCategory,
    deadline: '',
    time: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedHours: '',
    tags: '',
  });
  const [subGoals, setSubGoals] = useState<SubGoal[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'subgoals'>('basic');

  const isEditing = !!goal;

  useEffect(() => {
    if (isOpen) {
      if (goal) {
        // Editing existing goal
        const deadline = DateTime.fromISO(goal.deadlineISO);
        setFormData({
          title: goal.title,
          description: goal.description || '',
          category: goal.category || 'personal',
          deadline: deadline.toFormat('yyyy-MM-dd'),
          time: deadline.toFormat('HH:mm'),
          priority: goal.priority || 'medium',
          estimatedHours: goal.estimatedHours?.toString() || '',
          tags: goal.tags?.join(', ') || '',
        });
        setSubGoals(goal.subGoals || []);
      } else {
        // Creating new goal
        setFormData({
          title: '',
          description: '',
          category: 'personal',
          deadline: '',
          time: '23:59',
          priority: 'medium',
          estimatedHours: '',
          tags: '',
        });
        setSubGoals([]);
      }
    }
  }, [goal, isOpen]);

  const handleSave = () => {
    if (!formData.title.trim() || !formData.deadline) return;

    const deadlineISO = createDeadlineISO(formData.deadline, formData.time);

    const goalToSave: Goal = {
      id: goal?.id || generateId(),
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category,
      deadlineISO,
      completedAtISO: goal?.completedAtISO || null,
      subGoals: subGoals,
      reminder: goal?.reminder || { enabled: false, frequency: 'none' },
      priority: formData.priority,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
      actualHours: goal?.actualHours,
    };

    onSave(goalToSave);
  };

  const canSave = formData.title.trim() !== '' && formData.deadline !== '';

  if (!isOpen) return null;

  const addSubGoal = (title: string) => {
    if (title.trim()) {
      const newSubGoal: SubGoal = {
        id: generateSubGoalId(),
        title: title.trim(),
        completed: false
      };
      setSubGoals(prev => [...prev, newSubGoal]);
    }
  };

  const updateSubGoal = (subGoalId: string, updates: Partial<SubGoal>) => {
    setSubGoals(prev => prev.map(sub => 
      sub.id === subGoalId ? { ...sub, ...updates } : sub
    ));
  };

  const deleteSubGoal = (subGoalId: string) => {
    setSubGoals(prev => prev.filter(sub => sub.id !== subGoalId));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            {[
              { id: 'basic', label: t('goals.basicInfo') },
              { id: 'details', label: t('goals.details') },
              { id: 'subgoals', label: t('goals.subGoals') }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-brand-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                {tab.id === 'subgoals' && subGoals.length > 0 && (
                  <span className="ml-1 text-xs bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded-full">
                    {subGoals.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'basic' && (
              <>
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
                  <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('goals.description')}
                  </label>
                  <textarea
                    id="goalDescription"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('goals.descriptionPlaceholder')}
                    className="input-field h-20 resize-none"
                    maxLength={300}
                  />
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {formData.description.length}/300
                  </div>
                </div>

                <CategorySelector
                  value={formData.category}
                  onChange={(category) => setFormData(prev => ({ ...prev, category }))}
                />

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
                      <div className="mt-1 text-xs text-gray-500">{t('common.date')}</div>
                    </div>
                    <div>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="input-field"
                      />
                      <div className="mt-1 text-xs text-gray-500">{t('common.time')}</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'details' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('goals.priority')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority }))}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          formData.priority === priority
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {t(`goals.priorities.${priority}`)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('goals.estimatedHours')}
                  </label>
                  <input
                    id="estimatedHours"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                    placeholder="ej: 10"
                    className="input-field"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {t('goals.estimatedHoursHint')}
                  </div>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('goals.tags')}
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder={t('goals.tagsPlaceholder')}
                    className="input-field"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {t('goals.tagsHint')}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'subgoals' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    {t('goals.subGoalsInfo')}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {t('goals.subGoalsDescription')}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{t('goals.subGoals')}</h4>
                    <span className="text-sm text-gray-500">
                      {subGoals.filter(sub => sub.completed).length}/{subGoals.length}
                    </span>
                  </div>

                  {/* Sub-goals list */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {subGoals.map((subGoal, index) => (
                      <div key={subGoal.id} className="flex items-center space-x-2 group bg-gray-50 p-3 rounded-lg">
                        <button
                          type="button"
                          onClick={() => updateSubGoal(subGoal.id, { completed: !subGoal.completed })}
                          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            subGoal.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-400'
                          } cursor-pointer`}
                        >
                          {subGoal.completed && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>

                        <div className="flex-1">
                          <span className={`text-sm ${subGoal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {subGoal.title}
                          </span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => deleteSubGoal(subGoal.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add new sub-goal */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={t('goals.addSubGoalPlaceholder')}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          const title = input.value.trim();
                          if (title) {
                            addSubGoal(title);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="' + t('goals.addSubGoalPlaceholder') + '"]') as HTMLInputElement;
                        const title = input?.value.trim();
                        if (title) {
                          addSubGoal(title);
                          input.value = '';
                        }
                      }}
                      className="btn-primary text-sm px-3 py-2"
                    >
                      {t('common.add')}
                    </button>
                  </div>
                </div>
              </div>
            )}
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