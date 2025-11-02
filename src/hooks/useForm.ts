import { useState, useCallback } from 'react';

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

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...newValues }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const resetTo = useCallback((newValues: T) => {
    setValues(newValues);
  }, []);

  return {
    values,
    setValue,
    setValues: updateValues,
    reset,
    resetTo,
  };
};

