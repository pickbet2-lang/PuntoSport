import { useCallback, useState } from "react";

const STORAGE_PREFIX = "punto-sport:v1:";

export const storageKeys = {
  playerCode: "player-code",
  userProfile: "user-profile",
  matchConfirmations: "match-confirmations",
  reservationDraft: "reservation-draft",
  registrationDrafts: "registration-drafts",
} as const;

const getKey = (key: string) => `${STORAGE_PREFIX}${key}`;

export const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const storedValue = window.localStorage.getItem(getKey(key));
    return storedValue === null ? fallback : (JSON.parse(storedValue) as T);
  } catch {
    return fallback;
  }
};

export const writeStorage = <T,>(key: string, value: T) => {
  try {
    window.localStorage.setItem(getKey(key), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeStorage = (key: string) => {
  try {
    window.localStorage.removeItem(getKey(key));
  } catch {
    // El navegador puede bloquear el almacenamiento en modo privado.
  }
};

export const usePersistentState = <T,>(key: string, initialValue: T | (() => T)) => {
  const [value, setValue] = useState<T>(() => {
    const fallback = initialValue instanceof Function ? initialValue() : initialValue;
    return readStorage(key, fallback);
  });

  const setPersistentValue = useCallback(
    (nextValue: T | ((currentValue: T) => T)) => {
      setValue((currentValue) => {
        const resolvedValue =
          nextValue instanceof Function
            ? (nextValue as (currentValue: T) => T)(currentValue)
            : nextValue;
        writeStorage(key, resolvedValue);
        return resolvedValue;
      });
    },
    [key],
  );

  return [value, setPersistentValue] as const;
};
