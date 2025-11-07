/**
 * Form Validation Hook
 * Enhances useForm with validation capabilities
 * Follows Single Responsibility Principle
 */

import { useState, useCallback, useMemo } from 'react';
import { useForm } from './useForm';
import { validateForm, validateField, ValidationRules, ValidationResult, getFirstError, hasError } from '@/utils/validation';

export interface UseFormValidationOptions<T extends Record<string, any>> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormValidationReturn<T extends Record<string, any>> {
  // Form state
  values: T;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  reset: () => void;
  resetTo: (values: T) => void;
  
  // Validation state
  errors: Record<string, string[]>;
  isValid: boolean;
  touched: Record<string, boolean>;
  
  // Validation helpers
  getError: (field: keyof T) => string | undefined;
  hasFieldError: (field: keyof T) => boolean;
  validate: () => ValidationResult;
  validateField: (field: keyof T) => void;
  
  // Form handlers
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleBlur: (field: keyof T) => () => void;
  handleChange: <K extends keyof T>(field: K) => (value: T[K]) => void;
  
  // Submission state
  isSubmitting: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  options: UseFormValidationOptions<T>
): UseFormValidationReturn<T> {
  const {
    initialValues,
    validationRules = {},
    onSubmit,
    validateOnChange = false,
    validateOnBlur = true,
  } = options;

  const form = useForm(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate entire form
  const validate = useCallback((): ValidationResult => {
    const result = validateForm(form.values, validationRules);
    setErrors(result.errors);
    return result;
  }, [form.values, validationRules]);

  // Validate single field
  const validateSingleField = useCallback((field: keyof T) => {
    const fieldRules = validationRules[field];
    if (fieldRules && fieldRules.length > 0) {
      const fieldErrors = validateField(form.values[field], fieldRules);
      setErrors(prev => ({
        ...prev,
        [field as string]: fieldErrors,
      }));
    }
  }, [form.values, validationRules]);

  // Handle field change
  const handleFieldChange = useCallback(<K extends keyof T>(field: K) => {
    return (value: T[K]) => {
      form.setValue(field, value);
      
      // Clear error for this field when user starts typing
      if (errors[field as string]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field as string];
          return newErrors;
        });
      }
      
      // Validate on change if enabled
      if (validateOnChange && touched[field as string]) {
        validateSingleField(field);
      }
    };
  }, [form, errors, touched, validateOnChange, validateSingleField]);

  // Handle field blur
  const handleFieldBlur = useCallback((field: keyof T) => {
    return () => {
      setTouched(prev => ({ ...prev, [field as string]: true }));
      
      if (validateOnBlur) {
        validateSingleField(field);
      }
    };
  }, [validateOnBlur, validateSingleField]);

  // Handle form submit
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(form.values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate form
    const result = validate();
    
    if (!result.isValid) {
      return;
    }

    // Call onSubmit if provided
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(form.values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [form.values, validate, onSubmit]);

  // Get error for field
  const getError = useCallback((field: keyof T): string | undefined => {
    return getFirstError(errors, field as string);
  }, [errors]);

  // Check if field has error
  const hasFieldError = useCallback((field: keyof T): boolean => {
    return hasError(errors, field as string);
  }, [errors]);

  // Reset form
  const reset = useCallback(() => {
    form.reset();
    setErrors({});
    setTouched({});
  }, [form]);

  // Reset to specific values
  const resetTo = useCallback((newValues: T) => {
    form.resetTo(newValues);
    setErrors({});
    setTouched({});
  }, [form]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    // Form state
    values: form.values,
    setValue: form.setValue,
    setValues: form.setValues,
    reset,
    resetTo,
    
    // Validation state
    errors,
    isValid,
    touched,
    
    // Validation helpers
    getError,
    hasFieldError,
    validate,
    validateField: validateSingleField,
    
    // Form handlers
    handleSubmit,
    handleBlur: handleFieldBlur,
    handleChange: handleFieldChange,
    
    // Submission state
    isSubmitting,
  };
}

