import { create } from 'zustand';
import { DateTime } from 'luxon';
import { AppState, UserProfile, Goal, SubGoal, WorkSession } from '../lib/models';
import { migrateGoalsArray } from '../lib/migration';
import { generateId } from '../lib/utils';
import { loadFromStorage, saveToStorage } from '../lib/storage';
import { applyTheme, getThemeById, setBackgroundImage } from '../lib/themes';

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  goals: [],
  settings: {
    themeId: 'turquoise',
    backgroundImage: undefined,
  },
  
  setProfile: (profile: UserProfile) => {
    set({ profile });
    get().saveToStorage();
  },
  
  addGoal: (goal: Goal) => {
    const newGoal = {
      ...goal,
      id: generateId(),
      subGoals: goal.subGoals || [],
      reminder: goal.reminder || { enabled: false, frequency: 'none' },
      category: goal.category || 'other',
      priority: goal.priority || 'medium',
      workSessions: goal.workSessions || [],
      createdAt: DateTime.local().toISO()
    };
    set(state => ({
      goals: [...state.goals, newGoal],
    }));
    get().saveToStorage();
  },
  
  updateGoal: (updatedGoal: Goal) => {
    set(state => ({
      goals: state.goals.map(goal =>
        goal.id === updatedGoal.id ? updatedGoal : goal
      ),
    }));
    get().saveToStorage();
  },
  
  completeGoal: (id: string) => {
    const now = DateTime.local().toISO();
    set(state => ({
      goals: state.goals.map(goal =>
        goal.id === id 
          ? { ...goal, completedAtISO: now }
          : goal
      ),
    }));
    get().saveToStorage();
  },
  
  restoreGoal: (id: string) => {
    set(state => ({
      goals: state.goals.map(goal =>
        goal.id === id 
          ? { ...goal, completedAtISO: null }
          : goal
      ),
    }));
    get().saveToStorage();
  },
  
  deleteGoal: (id: string) => {
    set(state => ({
      goals: state.goals.filter(goal => goal.id !== id),
    }));
    get().saveToStorage();
  },

  // Sub-goals actions
  addSubGoal: (goalId: string, subGoal: SubGoal) => {
    set(state => ({
      goals: state.goals.map(goal =>
        goal.id === goalId
          ? { ...goal, subGoals: [...goal.subGoals, subGoal] }
          : goal
      ),
    }));
    get().saveToStorage();
  },

  updateSubGoal: (goalId: string, subGoalId: string, updates: Partial<SubGoal>) => {
    set(state => ({
      goals: state.goals.map(goal =>
        goal.id === goalId
          ? {
              ...goal,
              subGoals: goal.subGoals.map(sub =>
                sub.id === subGoalId ? { ...sub, ...updates } : sub
              )
            }
          : goal
      ),
    }));
    get().saveToStorage();
  },

  completeSubGoal: (goalId: string, subGoalId: string) => {
    const now = DateTime.local().toISO();
    set(state => ({
      goals: state.goals.map(goal =>
        goal.id === goalId
          ? {
              ...goal,
              subGoals: goal.subGoals.map(sub =>
                sub.id === subGoalId 
                  ? { ...sub, completed: true, completedAtISO: now }
                  : sub
              )
            }
          : goal
      ),
    }));
    get().saveToStorage();
  },

  deleteSubGoal: (goalId: string, subGoalId: string) => {
    set(state => ({
      goals: state.goals.map(goal =>
        goal.id === goalId
          ? { ...goal, subGoals: goal.subGoals.filter(sub => sub.id !== subGoalId) }
          : goal
      ),
    }));
    get().saveToStorage();
  },

  // Work sessions actions
  addWorkSession: (goalId: string, workSession: WorkSession) => {
    set(state => ({
      goals: state.goals.map(goal =>
        goal.id === goalId
          ? { ...goal, workSessions: [...(goal.workSessions || []), workSession] }
          : goal
      ),
    }));
    get().saveToStorage();
  },

  updateWorkSession: (goalId: string, sessionId: string, updates: Partial<WorkSession>) => {
    set(state => ({
      goals: state.goals.map(goal =>
        goal.id === goalId
          ? {
              ...goal,
              workSessions: (goal.workSessions || []).map(session =>
                session.id === sessionId ? { ...session, ...updates } : session
              )
            }
          : goal
      ),
    }));
    get().saveToStorage();
  },

  deleteWorkSession: (goalId: string, sessionId: string) => {
    set(state => ({
      goals: state.goals.map(goal =>
        goal.id === goalId
          ? { ...goal, workSessions: (goal.workSessions || []).filter(session => session.id !== sessionId) }
          : goal
      ),
    }));
    get().saveToStorage();
  },

  setTheme: (themeId: string) => {
    set(state => ({
      settings: { ...state.settings, themeId },
    }));
    const theme = getThemeById(themeId);
    applyTheme(theme);
    get().saveToStorage();
  },

  setBackgroundImage: (imageUrl: string) => {
    set(state => ({
      settings: { ...state.settings, backgroundImage: imageUrl },
    }));
    setBackgroundImage(imageUrl);
    get().saveToStorage();
  },
  
  loadFromStorage: () => {
    const data = loadFromStorage();
    const settings = data.settings || { themeId: 'turquoise', backgroundImage: undefined };
    
    // Migrate goals if needed
    const migratedGoals = data.goals ? migrateGoalsArray(data.goals) : [];
    
    set({
      profile: data.profile,
      goals: migratedGoals,
      settings,
    });
    
    // Apply theme and background on load
    const theme = getThemeById(settings.themeId);
    applyTheme(theme);
    if (settings.backgroundImage) {
      setBackgroundImage(settings.backgroundImage);
    }
  },
  
  saveToStorage: () => {
    const state = get();
    saveToStorage({
      profile: state.profile,
      goals: state.goals,
      settings: state.settings,
    });
  },
}));

// Load initial data
useAppStore.getState().loadFromStorage();

// Selectors
export const useProfile = () => useAppStore(state => state.profile);
export const useGoals = () => useAppStore(state => state.goals);
export const useSettings = () => useAppStore(state => state.settings);
export const useActiveGoals = () => useAppStore(state => 
  state.goals.filter(goal => !goal.completedAtISO)
);
export const useCompletedGoals = () => useAppStore(state => 
  state.goals.filter(goal => goal.completedAtISO)
);
export const useHasProfile = () => useAppStore(state => !!state.profile);