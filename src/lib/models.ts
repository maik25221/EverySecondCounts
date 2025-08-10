export type Sex = 'male' | 'female';

export interface UserProfile {
  birthDateISO: string;
  sex: Sex;
  nationalityCode?: string;
  lifeExpectancyYears: number;
}

export interface Goal {
  id: string;
  title: string;
  deadlineISO: string;
  completedAtISO?: string | null;
}

export interface AppState {
  profile: UserProfile | null;
  goals: Goal[];
  settings: UserSettings;
  // Actions
  setProfile(profile: UserProfile): void;
  addGoal(goal: Goal): void;
  updateGoal(goal: Goal): void;
  completeGoal(id: string): void;
  restoreGoal(id: string): void;
  deleteGoal(id: string): void;
  // Settings actions
  setTheme(themeId: string): void;
  setBackgroundImage(imageUrl: string): void;
  // Internal actions
  loadFromStorage(): void;
  saveToStorage(): void;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export interface Country {
  code: string;
  name: string;
  lifeExpectancy: number;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface UserSettings {
  themeId: string;
  backgroundImage?: string;
}