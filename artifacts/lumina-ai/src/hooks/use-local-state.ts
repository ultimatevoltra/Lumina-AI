import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        window.dispatchEvent(new Event("local-storage"));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) setStoredValue(JSON.parse(item));
      } catch {
        // ignore
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
  avatar?: string;
  provider?: "email" | "google";
};

export type HistoryItem = {
  id: string;
  type: "photo" | "video";
  prompt: string;
  model: string;
  url: string;
  timestamp: number;
};

export type PointsData = {
  balance: number;
  monthKey: string; // YYYY-MM to detect new month
};

// Points config
export const FREE_POINTS_PER_MONTH = 250_000;
export const PHOTO_POINT_COST = 1_000;
export const VIDEO_POINT_COST = 2_000;

function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function useAppState() {
  const [user, setUser] = useLocalStorage<User | null>("lumina_user", null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("lumina_history", []);
  const [pointsData, setPointsData] = useLocalStorage<PointsData>("lumina_points", {
    balance: FREE_POINTS_PER_MONTH,
    monthKey: getCurrentMonthKey(),
  });

  // Reset points at start of new month (for free users)
  const currentMonth = getCurrentMonthKey();
  const effectivePoints: PointsData = (() => {
    if (!user && pointsData.monthKey !== currentMonth) {
      // New month — reset
      return { balance: FREE_POINTS_PER_MONTH, monthKey: currentMonth };
    }
    return pointsData;
  })();

  const addHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const spendPoints = (cost: number): boolean => {
    if (user) return true; // signed in = unlimited
    if (effectivePoints.balance < cost) return false;
    const updated = { balance: effectivePoints.balance - cost, monthKey: currentMonth };
    setPointsData(updated);
    return true;
  };

  const canGenerate = (cost: number) => {
    if (user) return true;
    return effectivePoints.balance >= cost;
  };

  const pointsBalance = user ? Infinity : effectivePoints.balance;
  const pointsUsed = user ? 0 : FREE_POINTS_PER_MONTH - effectivePoints.balance;
  const pointsPercent = user ? 0 : Math.min((pointsUsed / FREE_POINTS_PER_MONTH) * 100, 100);

  return {
    user,
    setUser,
    history,
    setHistory,
    addHistory,
    pointsBalance,
    pointsUsed,
    pointsPercent,
    spendPoints,
    canGenerate,
  };
}
