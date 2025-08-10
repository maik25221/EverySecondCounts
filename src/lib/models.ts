export type Sex = 'male' | 'female';

export type GoalCategory = 'work' | 'personal' | 'health' | 'learning' | 'other';

export type ReminderFrequency = 'none' | 'daily' | 'weekly' | 'custom';

export interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
  completedAtISO?: string;
}

export interface GoalReminder {
  enabled: boolean;
  frequency: ReminderFrequency;
  customDays?: number; // For custom frequency
  lastNotified?: string;
}

export interface WorkSession {
  id: string;
  date: string; // ISO date string
  hours: number;
  description?: string;
  createdAt: string; // ISO datetime
}

export interface UserProfile {
  birthDateISO: string;
  sex: Sex;
  nationalityCode?: string;
  lifeExpectancyYears: number;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  deadlineISO: string;
  completedAtISO?: string | null;
  subGoals: SubGoal[];
  reminder: GoalReminder;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  estimatedHours?: number;
  workSessions: WorkSession[];
  createdAt?: string;
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
  // Sub-goals actions
  addSubGoal(goalId: string, subGoal: SubGoal): void;
  updateSubGoal(goalId: string, subGoalId: string, updates: Partial<SubGoal>): void;
  completeSubGoal(goalId: string, subGoalId: string): void;
  deleteSubGoal(goalId: string, subGoalId: string): void;
  // Work sessions actions
  addWorkSession(goalId: string, workSession: WorkSession): void;
  updateWorkSession(goalId: string, sessionId: string, updates: Partial<WorkSession>): void;
  deleteWorkSession(goalId: string, sessionId: string): void;
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