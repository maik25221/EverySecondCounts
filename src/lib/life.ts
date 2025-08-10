import { DateTime } from 'luxon';
import { UserProfile, CountdownTime } from './models';
import { diffNowToISO } from './time';

export function estimatedEndOfLife(profile: UserProfile): string {
  const birthDate = DateTime.fromISO(profile.birthDateISO);
  const endDate = birthDate.plus({ years: profile.lifeExpectancyYears });
  
  // Set to end of day (23:59:59)
  const endOfDay = endDate.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
  
  return endOfDay.toISO() || '';
}

export function calculateLifeTimeLeft(profile: UserProfile): CountdownTime {
  const endOfLifeISO = estimatedEndOfLife(profile);
  return diffNowToISO(endOfLifeISO);
}

export function calculateAge(birthDateISO: string): number {
  const birthDate = DateTime.fromISO(birthDateISO);
  const now = DateTime.local();
  const age = now.diff(birthDate, 'years');
  return Math.floor(age.years);
}

export function formatDateForInput(iso: string): string {
  const date = DateTime.fromISO(iso);
  return date.toFormat('yyyy-MM-dd');
}

export function createISOFromDate(date: string): string {
  return DateTime.fromFormat(date, 'yyyy-MM-dd').toISO() || '';
}

export function createDeadlineISO(date: string, time?: string): string {
  let dateTime = DateTime.fromFormat(date, 'yyyy-MM-dd');
  
  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    dateTime = dateTime.set({ hour: hours, minute: minutes, second: 0 });
  } else {
    // Default to end of day
    dateTime = dateTime.set({ hour: 23, minute: 59, second: 59 });
  }
  
  return dateTime.toISO() || '';
}