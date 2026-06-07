import { describe, it, expect, afterEach } from 'vitest';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
  parseDate,
  isDateInPast,
  isToday,
} from '../calendar-helpers';

describe('calendar-helpers', () => {
  describe('getDaysInMonth', () => {
    it('should return 31 for January', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
    });

    it('should return 28 for February in non-leap year', () => {
      expect(getDaysInMonth(2023, 1)).toBe(28);
    });

    it('should return 29 for February in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });

    it('should return 30 for April', () => {
      expect(getDaysInMonth(2024, 3)).toBe(30);
    });

    it('should return 31 for December', () => {
      expect(getDaysInMonth(2024, 11)).toBe(31);
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('should return 1 for Monday (January 2024)', () => {
      expect(getFirstDayOfMonth(2024, 0)).toBe(1);
    });

    it('should return 4 for Thursday (February 2024)', () => {
      expect(getFirstDayOfMonth(2024, 1)).toBe(4);
    });

    it('should return 5 for Friday (March 2024)', () => {
      expect(getFirstDayOfMonth(2024, 2)).toBe(5);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date(2024, 0, 15);
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('should format date with single digit month and day', () => {
      const date = new Date(2024, 0, 5);
      expect(formatDate(date)).toBe('2024-01-05');
    });

    it('should format date with double digit month and day', () => {
      const date = new Date(2024, 11, 31);
      expect(formatDate(date)).toBe('2024-12-31');
    });
  });

  describe('parseDate', () => {
    it('should parse date string correctly', () => {
      const dateString = '2024-01-15';
      const date = parseDate(dateString);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });

    it('should parse date string with different format', () => {
      const dateString = '2024-12-31';
      const date = parseDate(dateString);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(11);
      expect(date.getDate()).toBe(31);
    });
  });

  describe('isDateInPast', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return true for past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isDateInPast(pastDate)).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isDateInPast(futureDate)).toBe(false);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(isDateInPast(today)).toBe(false);
    });

    it('should return true for date in previous month', () => {
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 1);
      expect(isDateInPast(pastDate)).toBe(true);
    });

    it('should return false for date in next month', () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);
      expect(isDateInPast(futureDate)).toBe(false);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });

    it('should return false for same day different month', () => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      expect(isToday(date)).toBe(false);
    });

    it('should return false for same day different year', () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      expect(isToday(date)).toBe(false);
    });
  });
});
