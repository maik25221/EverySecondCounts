import { create } from 'zustand';
import { DateTime } from 'luxon';
import { AppState, UserProfile, Goal } from '../lib/models';
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
    set(state => ({
      goals: [...state.goals, { ...goal, id: generateId() }],
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
    set({
      profile: data.profile,
      goals: data.goals,
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