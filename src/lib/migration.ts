import { Goal } from './models';
import { DateTime } from 'luxon';

export function migrateGoalToV2(oldGoal: any): Goal {
  // Handle migration from old goal format to new format
  const migratedGoal: Goal = {
    id: oldGoal.id,
    title: oldGoal.title,
    description: undefined,
    category: 'personal', // Default category for old goals
    deadlineISO: oldGoal.deadlineISO,
    completedAtISO: oldGoal.completedAtISO || null,
    subGoals: [],
    reminder: {
      enabled: false,
      frequency: 'none'
    },
    priority: 'medium',
    tags: undefined,
    estimatedHours: undefined,
    workSessions: [],
    createdAt: DateTime.local().toISO()
  };

  return migratedGoal;
}

export function needsMigration(goal: any): boolean {
  // Check if goal needs migration (missing new properties)
  return (
    typeof goal.category === 'undefined' ||
    typeof goal.subGoals === 'undefined' ||
    typeof goal.reminder === 'undefined' ||
    typeof goal.priority === 'undefined' ||
    typeof goal.workSessions === 'undefined'
  );
}

export function migrateGoalsArray(goals: any[]): Goal[] {
  return goals.map(goal => {
    if (needsMigration(goal)) {
      console.log(`Migrating goal: ${goal.title}`);
      return migrateGoalToV2(goal);
    }
    return goal as Goal;
  });
}