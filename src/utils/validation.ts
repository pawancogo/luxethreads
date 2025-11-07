/**
 * Validation Utilities
 * Centralized validation functions following DRY principle
 */

export type ValidationRule<T = any> = {
  validate: (value: T) => boolean;
  message: string;
};

export type ValidationRules<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

/**
 * Common validation rules
 */
export const validators = {
  required: <T>(message = 'This field is required'): ValidationRule<T> => ({
    validate: (value: T) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    },
    message,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule<string> => ({
    validate: (value: string) => {
      if (!value) return true; // Use required for empty check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => {
      if (!value) return true; // Use required for empty check
      return value.length >= min;
    },
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<string> => ({
    validate: (value: string) => {
      if (!value) return true; // Use required for empty check
      return value.length <= max;
    },
    message: message || `Must be no more than ${max} characters`,
  }),

  min: (min: number, message?: string): ValidationRule<number> => ({
    validate: (value: number) => {
      if (value === null || value === undefined) return true;
      return value >= min;
    },
    message: message || `Must be at least ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule<number> => ({
    validate: (value: number) => {
      if (value === null || value === undefined) return true;
      return value <= max;
    },
    message: message || `Must be no more than ${max}`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    validate: (value: string) => {
      if (!value) return true; // Use required for empty check
      return regex.test(value);
    },
    message,
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule<string> => ({
    validate: (value: string) => {
      if (!value) return true; // Use required for empty check
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
    },
    message,
  }),

  password: (message = 'Password must be at least 8 characters'): ValidationRule<string> => ({
    validate: (value: string) => {
      if (!value) return true; // Use required for empty check
      return value.length >= 8;
    },
    message,
  }),

  match: <T>(otherValue: T, message = 'Values do not match'): ValidationRule<T> => ({
    validate: (value: T) => value === otherValue,
    message,
  }),

  custom: <T>(validator: (value: T) => boolean, message: string): ValidationRule<T> => ({
    validate: validator,
    message,
  }),
};

/**
 * Validate a single field
 */
export function validateField<T>(
  value: T,
  rules: ValidationRule<T>[]
): string[] {
  const errors: string[] = [];
  
  for (const rule of rules) {
    if (!rule.validate(value)) {
      errors.push(rule.message);
    }
  }
  
  return errors;
}

/**
 * Validate entire form
 */
export function validateForm<T extends Record<string, any>>(
  values: T,
  rules: ValidationRules<T>
): ValidationResult {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  for (const field in rules) {
    const fieldRules = rules[field];
    if (fieldRules && fieldRules.length > 0) {
      const fieldErrors = validateField(values[field], fieldRules);
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
    }
  }

  return { isValid, errors };
}

/**
 * Get first error message for a field
 */
export function getFirstError(errors: Record<string, string[]>, field: string): string | undefined {
  return errors[field]?.[0];
}

/**
 * Check if field has errors
 */
export function hasError(errors: Record<string, string[]>, field: string): boolean {
  return !!errors[field] && errors[field].length > 0;
}

