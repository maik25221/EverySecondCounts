import { DateTime } from 'luxon';
import { CountdownTime } from './models';

export function formatCountdownTime(time: CountdownTime): string {
  const { days, hours, minutes, seconds } = time;
  
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  if (days > 0) {
    return `${days} • ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function diffNowToISO(iso: string): CountdownTime {
  const now = DateTime.local();
  const target = DateTime.fromISO(iso);
  const diff = target.diff(now, ['days', 'hours', 'minutes', 'seconds']);
  
  const totalMs = target.toMillis() - now.toMillis();
  
  // If the date has passed, return negative values
  if (totalMs < 0) {
    const absDiff = now.diff(target, ['days', 'hours', 'minutes', 'seconds']);
    return {
      days: -Math.floor(absDiff.days),
      hours: -Math.floor(absDiff.hours % 24),
      minutes: -Math.floor(absDiff.minutes % 60),
      seconds: -Math.floor(absDiff.seconds % 60),
      totalMs,
    };
  }
  
  return {
    days: Math.floor(diff.days),
    hours: Math.floor(diff.hours % 24),
    minutes: Math.floor(diff.minutes % 60),
    seconds: Math.floor(diff.seconds % 60),
    totalMs,
  };
}

export function isOverdue(time: CountdownTime): boolean {
  return time.totalMs < 0;
}

export function isUrgent(time: CountdownTime): boolean {
  return !isOverdue(time) && time.totalMs < 24 * 60 * 60 * 1000; // Less than 24 hours
}

export function formatTimeLeft(time: CountdownTime): string {
  if (isOverdue(time)) {
    const days = Math.abs(time.days);
    return days > 0 ? `+${days} días` : 'Vencido';
  }
  
  return formatCountdownTime(time);
}