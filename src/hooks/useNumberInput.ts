import { useState, useCallback } from 'react';

export interface NumberInputState {
  inputValue: string;
  isChecking: boolean;
}

export interface NumberInputActions {
  setInputValue: (value: string) => void;
  setIsChecking: (checking: boolean) => void;
  reset: () => void;
}

export interface NumberInputHook extends NumberInputState, NumberInputActions {}

export function useNumberInput(): NumberInputHook {
  const [inputValue, setInputValue] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const reset = useCallback(() => {
    setInputValue('');
    setIsChecking(false);
  }, []);

  return {
    inputValue,
    isChecking,
    setInputValue,
    setIsChecking,
    reset,
  };
}