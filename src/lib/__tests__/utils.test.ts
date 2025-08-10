import { describe, it, expect } from 'vitest';
import { generateId, clamp, classNames } from '../utils';

describe('utils', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });

    it('should generate IDs with expected format', () => {
      const id = generateId();
      // Should be timestamp in base36 + random string
      expect(id).toMatch(/^[a-z0-9]+$/);
    });
  });

  describe('clamp', () => {
    it('should clamp value to minimum', () => {
      expect(clamp(5, 10, 20)).toBe(10);
    });

    it('should clamp value to maximum', () => {
      expect(clamp(25, 10, 20)).toBe(20);
    });

    it('should return value when within range', () => {
      expect(clamp(15, 10, 20)).toBe(15);
    });

    it('should handle edge cases', () => {
      expect(clamp(10, 10, 20)).toBe(10);
      expect(clamp(20, 10, 20)).toBe(20);
    });
  });

  describe('classNames', () => {
    it('should join valid class names', () => {
      expect(classNames('class1', 'class2', 'class3')).toBe('class1 class2 class3');
    });

    it('should filter out falsy values', () => {
      expect(classNames('class1', null, 'class2', undefined, false, 'class3')).toBe('class1 class2 class3');
    });

    it('should handle empty input', () => {
      expect(classNames()).toBe('');
    });

    it('should handle all falsy values', () => {
      expect(classNames(null, undefined, false)).toBe('');
    });
  });
});