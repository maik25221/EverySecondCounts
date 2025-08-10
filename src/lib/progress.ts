import { Goal, SubGoal } from './models';

export interface GoalProgress {
  completed: number;
  total: number;
  percentage: number;
  isComplete: boolean;
}

export function calculateGoalProgress(goal: Goal): GoalProgress {
  // If the goal is already completed, return 100%
  if (goal.completedAtISO) {
    return {
      completed: goal.subGoals.length,
      total: goal.subGoals.length,
      percentage: 100,
      isComplete: true
    };
  }

  // If there are no sub-goals, use binary completion (0% or 100%)
  if (goal.subGoals.length === 0) {
    return {
      completed: 0,
      total: 1,
      percentage: 0,
      isComplete: false
    };
  }

  // Calculate progress based on sub-goals
  const completedSubGoals = goal.subGoals.filter(sub => sub.completed).length;
  const totalSubGoals = goal.subGoals.length;
  const percentage = Math.round((completedSubGoals / totalSubGoals) * 100);

  return {
    completed: completedSubGoals,
    total: totalSubGoals,
    percentage,
    isComplete: percentage === 100
  };
}

export function shouldAutoCompleteGoal(goal: Goal): boolean {
  const progress = calculateGoalProgress(goal);
  return progress.percentage === 100 && !goal.completedAtISO && goal.subGoals.length > 0;
}

export function getProgressColor(percentage: number): string {
  if (percentage === 0) return 'bg-gray-200';
  if (percentage < 25) return 'bg-red-500';
  if (percentage < 50) return 'bg-orange-500';
  if (percentage < 75) return 'bg-yellow-500';
  if (percentage < 100) return 'bg-blue-500';
  return 'bg-green-500';
}

export function getProgressText(progress: GoalProgress): string {
  if (progress.total === 1) {
    return progress.isComplete ? 'Completado' : 'Pendiente';
  }
  return `${progress.completed}/${progress.total} pasos`;
}

export function createDefaultSubGoal(title: string): Omit<SubGoal, 'id'> {
  return {
    title,
    completed: false
  };
}

export function generateSubGoalId(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}