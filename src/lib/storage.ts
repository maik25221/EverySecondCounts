import { UserProfile, Goal, UserSettings } from './models';

const STORAGE_KEY = 'esc:v1';

export interface StorageData {
  version: number;
  profile: UserProfile | null;
  goals: Goal[];
  settings?: UserSettings;
}

const DEFAULT_DATA: StorageData = {
  version: 1,
  profile: null,
  goals: [],
  settings: {
    themeId: 'turquoise',
    backgroundImage: undefined,
  },
};

export function loadFromStorage(): StorageData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_DATA;
    
    const data = JSON.parse(stored) as StorageData;
    
    // Basic migration support for future versions
    return migrate(data);
  } catch (error) {
    console.error('Error loading from storage:', error);
    return DEFAULT_DATA;
  }
}

export function saveToStorage(data: Partial<StorageData>): void {
  try {
    const current = loadFromStorage();
    const updated = { ...current, ...data, version: 1 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
}

function migrate(data: StorageData): StorageData {
  // Future migration logic goes here
  // For now, just ensure version is set
  return { ...data, version: data.version || 1 };
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

export function exportData(): string {
  const data = loadFromStorage();
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as StorageData;
    const migrated = migrate(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}