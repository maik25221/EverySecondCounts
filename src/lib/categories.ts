import { GoalCategory } from './models';

export interface CategoryConfig {
  id: GoalCategory;
  nameKey: string; // Translation key
  icon: string;
  color: string; // CSS color class
  gradient: string; // CSS gradient classes
}

export const goalCategories: CategoryConfig[] = [
  {
    id: 'work',
    nameKey: 'categories.work',
    icon: '💼',
    color: 'blue',
    gradient: 'from-blue-50 to-indigo-50'
  },
  {
    id: 'personal',
    nameKey: 'categories.personal',
    icon: '🌱',
    color: 'green',
    gradient: 'from-green-50 to-emerald-50'
  },
  {
    id: 'health',
    nameKey: 'categories.health',
    icon: '💪',
    color: 'red',
    gradient: 'from-red-50 to-pink-50'
  },
  {
    id: 'learning',
    nameKey: 'categories.learning',
    icon: '📚',
    color: 'purple',
    gradient: 'from-purple-50 to-violet-50'
  },
  {
    id: 'other',
    nameKey: 'categories.other',
    icon: '✨',
    color: 'gray',
    gradient: 'from-gray-50 to-slate-50'
  }
];

export function getCategoryConfig(category: GoalCategory): CategoryConfig {
  return goalCategories.find(cat => cat.id === category) || goalCategories[4]; // Default to 'other'
}

export function getCategoryColor(category: GoalCategory): string {
  const config = getCategoryConfig(category);
  return config.color;
}

export function getCategoryIcon(category: GoalCategory): string {
  const config = getCategoryConfig(category);
  return config.icon;
}

export function getCategoryGradient(category: GoalCategory): string {
  const config = getCategoryConfig(category);
  return config.gradient;
}