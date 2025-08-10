import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkSession } from '../lib/models';
import { useAppStore } from '../state/store';
import { createWorkSession, generateWorkSessionId, formatHours } from '../lib/timeTracking';

interface WorkSessionLoggerProps {
  goalId: string;
  workSessions: WorkSession[];
  disabled?: boolean;
}

export default function WorkSessionLogger({ goalId, workSessions, disabled = false }: WorkSessionLoggerProps) {
  const { t } = useTranslation();
  const { addWorkSession, deleteWorkSession } = useAppStore();
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAddSession = () => {
    const hoursNum = parseFloat(hours);
    if (hoursNum > 0 && hoursNum <= 24) {
      const session: WorkSession = {
        id: generateWorkSessionId(),
        ...createWorkSession(hoursNum, description.trim() || undefined)
      };
      
      addWorkSession(goalId, session);
      setHours('');
      setDescription('');
      setShowForm(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    if (confirm(t('messages.deleteWorkSessionConfirm'))) {
      deleteWorkSession(goalId, sessionId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddSession();
    }
  };

  const canSave = hours && parseFloat(hours) > 0 && parseFloat(hours) <= 24;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">{t('goals.workSessions')}</h4>
        {!disabled && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            {showForm ? t('common.cancel') : t('goals.logHours')}
          </button>
        )}
      </div>

      {/* Add work session form */}
      {showForm && !disabled && (
        <div className="bg-brand-50 p-4 rounded-lg border border-brand-200">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('goals.hoursWorked')} *
              </label>
              <input
                type="number"
                min="0.25"
                max="24"
                step="0.25"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ej: 2.5"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <div className="mt-1 text-xs text-gray-500">
                {t('goals.hoursHint')}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('goals.workDescription')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('goals.workDescriptionPlaceholder')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent h-16 resize-none"
                maxLength={200}
              />
              <div className="mt-1 text-xs text-gray-500 text-right">
                {description.length}/200
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleAddSession}
                disabled={!canSave}
                className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
              >
                {t('goals.addWorkSession')}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="btn-secondary text-sm px-4 py-2 flex-1"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Work sessions list */}
      {workSessions.length > 0 ? (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {workSessions
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((session) => (
              <div key={session.id} className="flex items-start justify-between bg-gray-50 p-3 rounded-lg group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-brand-600">
                      {formatHours(session.hours)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(session.date).toLocaleDateString()}
                    </span>
                  </div>
                  {session.description && (
                    <p className="text-sm text-gray-600 truncate">
                      {session.description}
                    </p>
                  )}
                </div>
                
                {!disabled && (
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 transition-opacity ml-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm">
          {t('goals.noWorkSessions')}
        </div>
      )}
    </div>
  );
}