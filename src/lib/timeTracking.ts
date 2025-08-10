import { Goal, WorkSession } from './models';
import { DateTime } from 'luxon';

export interface TimeAnalysis {
  totalWorkedHours: number;
  estimatedHours: number;
  remainingHours: number;
  daysUntilDeadline: number;
  suggestedDailyHours: number;
  isOnTrack: boolean;
  progressPercentage: number;
  averageHoursPerDay: number;
}

export function calculateTimeAnalysis(goal: Goal): TimeAnalysis {
  const totalWorkedHours = calculateTotalWorkedHours(goal);
  const estimatedHours = goal.estimatedHours || 0;
  const remainingHours = Math.max(0, estimatedHours - totalWorkedHours);
  
  const deadline = DateTime.fromISO(goal.deadlineISO);
  const now = DateTime.local();
  const daysUntilDeadline = Math.max(0, Math.ceil(deadline.diff(now, 'days').days));
  
  const suggestedDailyHours = daysUntilDeadline > 0 ? remainingHours / daysUntilDeadline : 0;
  
  const progressPercentage = estimatedHours > 0 ? (totalWorkedHours / estimatedHours) * 100 : 0;
  
  // Calculate if on track (considering 80% completion rate as acceptable)
  const expectedHoursWorked = estimatedHours > 0 && daysUntilDeadline >= 0 
    ? estimatedHours * (1 - (daysUntilDeadline / Math.ceil(deadline.diff(DateTime.fromISO(goal.createdAt || goal.deadlineISO), 'days').days)))
    : totalWorkedHours;
  
  const isOnTrack = totalWorkedHours >= expectedHoursWorked * 0.8;
  
  // Average hours per day worked so far
  const daysWorked = getWorkingDaysCount(goal);
  const averageHoursPerDay = daysWorked > 0 ? totalWorkedHours / daysWorked : 0;
  
  return {
    totalWorkedHours,
    estimatedHours,
    remainingHours,
    daysUntilDeadline,
    suggestedDailyHours,
    isOnTrack,
    progressPercentage: Math.min(100, progressPercentage),
    averageHoursPerDay
  };
}

export function calculateTotalWorkedHours(goal: Goal): number {
  if (!goal.workSessions) return 0;
  return goal.workSessions.reduce((total, session) => total + session.hours, 0);
}

export function getWorkingDaysCount(goal: Goal): number {
  if (!goal.workSessions || goal.workSessions.length === 0) return 0;
  
  const uniqueDates = new Set(goal.workSessions.map(session => session.date));
  return uniqueDates.size;
}

export function getTodayWorkedHours(goal: Goal): number {
  if (!goal.workSessions) return 0;
  
  const today = DateTime.local().toFormat('yyyy-MM-dd');
  return goal.workSessions
    .filter(session => session.date === today)
    .reduce((total, session) => total + session.hours, 0);
}

export function getWeeklyWorkedHours(goal: Goal): number {
  if (!goal.workSessions) return 0;
  
  const weekStart = DateTime.local().startOf('week');
  return goal.workSessions
    .filter(session => {
      const sessionDate = DateTime.fromFormat(session.date, 'yyyy-MM-dd');
      return sessionDate >= weekStart;
    })
    .reduce((total, session) => total + session.hours, 0);
}

export function formatHours(hours: number): string {
  if (hours === 0) return '0h';
  if (hours < 1) return `${Math.round(hours * 60)}min`;
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (minutes === 0) return `${wholeHours}h`;
  return `${wholeHours}h ${minutes}min`;
}

export function createWorkSession(hours: number, description?: string): Omit<WorkSession, 'id'> {
  return {
    date: DateTime.local().toFormat('yyyy-MM-dd'),
    hours,
    description,
    createdAt: DateTime.local().toISO()
  };
}

export function generateWorkSessionId(): string {
  return `work_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}