import { useState, useEffect } from 'react';

/**
 * useState that persists to localStorage, so game scores survive page reloads.
 * Falls back to in-memory state when storage is unavailable.
 */
export default function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? { ...initialValue, ...JSON.parse(saved) } : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors (private mode, quota) – state still works in memory.
    }
  }, [key, value]);

  return [value, setValue];
}
