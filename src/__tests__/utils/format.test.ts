import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPrice,
  formatDate,
  formatRelativeTime,
  formatPercentage,
  formatFileSize,
  formatPhoneNumber,
  truncate,
  formatOrderNumber,
} from '@/utils/format';

describe('format utilities', () => {
  describe('formatCurrency', () => {
    it('formats amount as currency', () => {
      expect(formatCurrency(1000)).toContain('1,000');
    });

    it('handles null amount', () => {
      expect(formatCurrency(null)).toBe('₹0');
    });

    it('formats with custom currency', () => {
      const result = formatCurrency(1000, { currency: 'USD' });
      expect(result).toContain('1,000');
    });
  });

  describe('formatPrice', () => {
    it('formats price without currency symbol', () => {
      expect(formatPrice(1000)).toBe('1,000');
    });

    it('handles null amount', () => {
      expect(formatPrice(null)).toBe('0');
    });
  });

  describe('formatDate', () => {
    it('formats date', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('2024');
    });

    it('handles null date', () => {
      expect(formatDate(null)).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    it('formats recent time', () => {
      const date = new Date();
      expect(formatRelativeTime(date)).toBe('just now');
    });

    it('formats time ago', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      expect(formatRelativeTime(date)).toContain('hour');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage', () => {
      expect(formatPercentage(20)).toContain('%');
    });
  });

  describe('formatFileSize', () => {
    it('formats file size', () => {
      expect(formatFileSize(1024)).toContain('KB');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats phone number', () => {
      expect(formatPhoneNumber('1234567890')).toContain(' ');
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      expect(truncate('This is a long text', 10)).toBe('This is a ...');
    });

    it('does not truncate short text', () => {
      expect(truncate('Short', 10)).toBe('Short');
    });
  });

  describe('formatOrderNumber', () => {
    it('formats order number', () => {
      expect(formatOrderNumber(1)).toBe('ORD-00000001');
    });
  });
});





