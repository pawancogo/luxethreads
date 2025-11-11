/**
 * useDialog Hook - Clean Architecture Implementation
 * Removed unnecessary useCallback hooks per YAGNI principle
 * Simple state management doesn't require memoization
 */

import { useState } from 'react';

interface UseDialogReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useDialog = (initialState = false): UseDialogReturn => {
  const [isOpen, setIsOpen] = useState(initialState);

  // Simple setters don't need useCallback - React handles re-renders efficiently
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, open, close, toggle };
};

