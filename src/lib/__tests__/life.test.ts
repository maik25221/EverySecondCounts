import { describe, it, expect, vi } from 'vitest';
import { DateTime } from 'luxon';
import { estimatedEndOfLife, calculateAge, formatDateForInput, createISOFromDate, createDeadlineISO } from '../life';
import { UserProfile } from '../models';

describe('life utilities', () => {
  describe('estimatedEndOfLife', () => {
    it('should calculate correct end of life date', () => {
      const profile: UserProfile = {
        birthDateISO: '1990-01-01T00:00:00.000Z',
        sex: 'male',
        lifeExpectancyYears: 80,
      };

      const result = estimatedEndOfLife(profile);
      const endDate = DateTime.fromISO(result);
      
      expect(endDate.year).toBe(2070);
      expect(endDate.month).toBe(1);
      expect(endDate.day).toBe(1);
      expect(endDate.hour).toBe(23);
      expect(endDate.minute).toBe(59);
    });
  });

  describe('calculateAge', () => {
    it('should calculate correct age', () => {
      // Mock DateTime.local to return a fixed date
      const mockNow = DateTime.fromISO('2024-01-01T12:00:00');
      vi.spyOn(DateTime, 'local').mockReturnValue(mockNow as any);

      const birthDate = '1990-01-01T00:00:00.000Z';
      const age = calculateAge(birthDate);
      
      expect(age).toBe(34);
    });

    it('should handle birthday not yet reached this year', () => {
      const mockNow = DateTime.fromISO('2024-06-01T12:00:00');
      vi.spyOn(DateTime, 'local').mockReturnValue(mockNow as any);

      const birthDate = '1990-07-15T00:00:00.000Z';
      const age = calculateAge(birthDate);
      
      expect(age).toBe(33); // Birthday hasn't happened yet in 2024
    });
  });

  describe('formatDateForInput', () => {
    it('should format ISO date for HTML input', () => {
      const iso = '1990-01-15T00:00:00.000Z';
      const result = formatDateForInput(iso);
      expect(result).toBe('1990-01-15');
    });
  });

  describe('createISOFromDate', () => {
    it('should create ISO from date string', () => {
      const date = '1990-01-15';
      const result = createISOFromDate(date);
      const parsed = DateTime.fromISO(result);
      
      expect(parsed.year).toBe(1990);
      expect(parsed.month).toBe(1);
      expect(parsed.day).toBe(15);
    });
  });

  describe('createDeadlineISO', () => {
    it('should create deadline with specific time', () => {
      const date = '2024-12-25';
      const time = '15:30';
      const result = createDeadlineISO(date, time);
      const parsed = DateTime.fromISO(result);
      
      expect(parsed.year).toBe(2024);
      expect(parsed.month).toBe(12);
      expect(parsed.day).toBe(25);
      expect(parsed.hour).toBe(15);
      expect(parsed.minute).toBe(30);
    });

    it('should default to end of day when no time provided', () => {
      const date = '2024-12-25';
      const result = createDeadlineISO(date);
      const parsed = DateTime.fromISO(result);
      
      expect(parsed.year).toBe(2024);
      expect(parsed.month).toBe(12);
      expect(parsed.day).toBe(25);
      expect(parsed.hour).toBe(23);
      expect(parsed.minute).toBe(59);
      expect(parsed.second).toBe(59);
    });
  });
});