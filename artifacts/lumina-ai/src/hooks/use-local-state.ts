import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event("local-storage"));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
    };

    window.addEventListener("local-storage", handleStorageChange);
    return () => window.removeEventListener("local-storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}

export type User = {
  name: string;
  email: string;
};

export type HistoryItem = {
  id: string;
  type: "photo" | "video";
  prompt: string;
  model: string;
  url: string;
  timestamp: number;
};

export function useAppState() {
  const [user, setUser] = useLocalStorage<User | null>("lumina_user", null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("lumina_history", []);
  const [usageCount, setUsageCount] = useLocalStorage<number>("lumina_usage", 0);

  const addHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev]);
    if (!user) {
      setUsageCount((prev) => prev + 1);
    }
  };

  const isLimitReached = !user && usageCount >= 4;

  return {
    user,
    setUser,
    history,
    addHistory,
    usageCount,
    isLimitReached,
    maxFreeLimit: 4,
  };
}
