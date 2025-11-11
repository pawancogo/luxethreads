import { describe, it, expect } from 'vitest';
import {
  validators,
  validateField,
  validateForm,
  getFirstError,
  hasError,
} from '@/utils/validation';

describe('validation utilities', () => {
  describe('validators', () => {
    it('validates required field', () => {
      const rule = validators.required();
      expect(rule.validate('')).toBe(false);
      expect(rule.validate('value')).toBe(true);
    });

    it('validates email', () => {
      const rule = validators.email();
      expect(rule.validate('invalid')).toBe(false);
      expect(rule.validate('test@example.com')).toBe(true);
    });

    it('validates min length', () => {
      const rule = validators.minLength(5);
      expect(rule.validate('abc')).toBe(false);
      expect(rule.validate('abcdef')).toBe(true);
    });

    it('validates max length', () => {
      const rule = validators.maxLength(5);
      expect(rule.validate('abcdef')).toBe(false);
      expect(rule.validate('abc')).toBe(true);
    });

    it('validates phone number', () => {
      const rule = validators.phone();
      expect(rule.validate('123')).toBe(false);
      expect(rule.validate('1234567890')).toBe(true);
    });

    it('validates password', () => {
      const rule = validators.password();
      expect(rule.validate('short')).toBe(false);
      expect(rule.validate('longpassword')).toBe(true);
    });
  });

  describe('validateField', () => {
    it('returns errors for invalid field', () => {
      const errors = validateField('', [validators.required()]);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('returns empty array for valid field', () => {
      const errors = validateField('value', [validators.required()]);
      expect(errors).toEqual([]);
    });
  });

  describe('validateForm', () => {
    it('validates entire form', () => {
      const values = { email: '', password: 'short' };
      const rules = {
        email: [validators.required(), validators.email()],
        password: [validators.password()],
      };

      const result = validateForm(values, rules);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });

    it('returns valid for correct form', () => {
      const values = { email: 'test@example.com', password: 'password123' };
      const rules = {
        email: [validators.email()],
        password: [validators.password()],
      };

      const result = validateForm(values, rules);
      expect(result.isValid).toBe(true);
    });
  });

  describe('getFirstError', () => {
    it('returns first error message', () => {
      const errors = { email: ['Required', 'Invalid format'] };
      expect(getFirstError(errors, 'email')).toBe('Required');
    });
  });

  describe('hasError', () => {
    it('checks if field has errors', () => {
      const errors = { email: ['Required'] };
      expect(hasError(errors, 'email')).toBe(true);
      expect(hasError(errors, 'password')).toBe(false);
    });
  });
});





