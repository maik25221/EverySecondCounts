import { describe, it, expect, vi } from 'vitest';
import { diffNowToISO, formatCountdownTime, isOverdue, isUrgent, formatTimeLeft } from '../time';

// Mock DateTime.local directly instead of entire module
vi.mock('luxon', async () => {
  const actual = await vi.importActual('luxon') as any;
  return {
    ...actual,
    DateTime: {
      ...actual.DateTime,
      local: vi.fn(() => actual.DateTime.fromISO('2024-01-01T12:00:00')),
    },
  };
});

describe('time utilities', () => {

  describe('formatCountdownTime', () => {
    it('should format time with days', () => {
      const time = { days: 5, hours: 10, minutes: 30, seconds: 45, totalMs: 0 };
      expect(formatCountdownTime(time)).toBe('5 • 10:30:45');
    });

    it('should format time without days', () => {
      const time = { days: 0, hours: 2, minutes: 5, seconds: 8, totalMs: 0 };
      expect(formatCountdownTime(time)).toBe('02:05:08');
    });

    it('should pad single digits', () => {
      const time = { days: 0, hours: 1, minutes: 2, seconds: 3, totalMs: 0 };
      expect(formatCountdownTime(time)).toBe('01:02:03');
    });
  });

  describe('diffNowToISO', () => {
    it('should calculate positive time difference', () => {
      const futureISO = '2024-01-02T12:00:00.000Z';
      const result = diffNowToISO(futureISO);
      
      expect(result.totalMs).toBeGreaterThan(0);
      expect(result.days).toBe(1);
    });

    it('should calculate negative time difference for past dates', () => {
      const pastISO = '2023-12-31T12:00:00.000Z';
      const result = diffNowToISO(pastISO);
      
      expect(result.totalMs).toBeLessThan(0);
      expect(result.days).toBe(-1);
    });
  });

  describe('isOverdue', () => {
    it('should return true for negative totalMs', () => {
      const time = { days: -1, hours: 0, minutes: 0, seconds: 0, totalMs: -86400000 };
      expect(isOverdue(time)).toBe(true);
    });

    it('should return false for positive totalMs', () => {
      const time = { days: 1, hours: 0, minutes: 0, seconds: 0, totalMs: 86400000 };
      expect(isOverdue(time)).toBe(false);
    });
  });

  describe('isUrgent', () => {
    it('should return true for less than 24 hours remaining', () => {
      const time = { days: 0, hours: 12, minutes: 0, seconds: 0, totalMs: 43200000 };
      expect(isUrgent(time)).toBe(true);
    });

    it('should return false for more than 24 hours remaining', () => {
      const time = { days: 2, hours: 0, minutes: 0, seconds: 0, totalMs: 172800000 };
      expect(isUrgent(time)).toBe(false);
    });

    it('should return false for overdue items', () => {
      const time = { days: -1, hours: 0, minutes: 0, seconds: 0, totalMs: -86400000 };
      expect(isUrgent(time)).toBe(false);
    });
  });

  describe('formatTimeLeft', () => {
    it('should format overdue time with days', () => {
      const time = { days: -2, hours: 0, minutes: 0, seconds: 0, totalMs: -172800000 };
      expect(formatTimeLeft(time)).toBe('+2 días');
    });

    it('should format overdue time without days', () => {
      const time = { days: 0, hours: -2, minutes: 0, seconds: 0, totalMs: -7200000 };
      expect(formatTimeLeft(time)).toBe('Vencido');
    });

    it('should format regular countdown time', () => {
      const time = { days: 1, hours: 2, minutes: 30, seconds: 45, totalMs: 95445000 };
      expect(formatTimeLeft(time)).toBe('1 • 02:30:45');
    });
  });
});