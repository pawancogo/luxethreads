/**
 * useForm Hook - Clean Architecture Implementation
 * Removed unnecessary useCallback hooks per YAGNI principle
 * Simple state management doesn't require memoization
 */

import { useState } from 'react';

export const useForm = <T extends Record<string, any>>(
  initialValues: T
): {
  values: T;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  reset: () => void;
  resetTo: (values: T) => void;
} => {
  const [values, setValues] = useState<T>(initialValues);

  // Simple setters don't need useCallback - React handles re-renders efficiently
  const setValue = <K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const updateValues = (newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  };

  const reset = () => {
    setValues(initialValues);
  };

  const resetTo = (newValues: T) => {
    setValues(newValues);
  };

  return {
    values,
    setValue,
    setValues: updateValues,
    reset,
    resetTo,
  };
};

