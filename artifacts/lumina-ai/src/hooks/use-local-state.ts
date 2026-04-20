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
  plan?: "free" | "pro" | "premium" | "max" | "ultra";
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
  monthKey: string;
};

export const FREE_POINTS_PER_MONTH = 250_000;
export const PHOTO_POINT_COST = 1_000;
export const VIDEO_POINT_COST = 2_000;

export const VALID_COUPON = "Illusion@123";

export const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  premium: "Premium",
  max: "Max",
  ultra: "Ultra",
};

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
  const [appliedCoupon, setAppliedCoupon] = useLocalStorage<string>("lumina_coupon", "");

  const couponUnlocked = appliedCoupon === VALID_COUPON;
  const isUnlimited = !!user || couponUnlocked;

  const currentMonth = getCurrentMonthKey();
  const effectivePoints: PointsData = (() => {
    if (!isUnlimited && pointsData.monthKey !== currentMonth) {
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
    if (isUnlimited) return true;
    if (effectivePoints.balance < cost) return false;
    const updated = { balance: effectivePoints.balance - cost, monthKey: currentMonth };
    setPointsData(updated);
    return true;
  };

  const canGenerate = (cost: number) => {
    if (isUnlimited) return true;
    return effectivePoints.balance >= cost;
  };

  const applyCoupon = (code: string): boolean => {
    if (code === VALID_COUPON) {
      setAppliedCoupon(code);
      return true;
    }
    return false;
  };

  const pointsBalance = isUnlimited ? Infinity : effectivePoints.balance;
  const pointsUsed = isUnlimited ? 0 : FREE_POINTS_PER_MONTH - effectivePoints.balance;
  const pointsPercent = isUnlimited ? 0 : Math.min((pointsUsed / FREE_POINTS_PER_MONTH) * 100, 100);

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
    isUnlimited,
    couponUnlocked,
    appliedCoupon,
    applyCoupon,
  };
}
