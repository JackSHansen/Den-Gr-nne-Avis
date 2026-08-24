"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("local-storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("local-storage", callback);
  };
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const getSnapshot = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item;
    } catch {
      return null;
    }
  };

  const getServerSnapshot = () => null;

  const rawValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const value: T = rawValue !== null ? JSON.parse(rawValue) : initialValue;

  const setValue = useCallback(
    (newValue: T | ((val: T) => T)) => {
      try {
        const currentItem = window.localStorage.getItem(key);
        const currentVal =
          currentItem !== null ? JSON.parse(currentItem) : initialValue;
        const valToStore =
          newValue instanceof Function ? newValue(currentVal) : newValue;

        window.localStorage.setItem(key, JSON.stringify(valToStore));
        window.dispatchEvent(new Event("local-storage"));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, initialValue],
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(new Event("local-storage"));
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  return [value, setValue, removeValue];
}
