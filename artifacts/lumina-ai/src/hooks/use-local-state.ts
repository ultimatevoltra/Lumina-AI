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
    } catch { }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) setStoredValue(JSON.parse(item));
      } catch { }
    };
    window.addEventListener("local-storage", handleStorageChange);
    return () => window.removeEventListener("local-storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}

export type Plan = "free" | "pro" | "premium" | "max" | "ultra";

export type User = {
  name: string;
  email: string;
  avatar?: string;
  provider?: "email" | "google";
  plan?: Plan;
};

export type HistoryItem = {
  id: string;
  type: "photo" | "video";
  prompt: string;
  model: string;
  url: string;
  timestamp: number;
};

// ── Guest limits (no account) ──────────────────────────────────────────────
export const MAX_GUEST_PHOTOS = 50;
export const MAX_GUEST_VIDEOS = 10;

type GuestUsage = {
  photoCount: number;
  videoCount: number;
  monthKey: string;
};

// ── Signed-in plan limits ──────────────────────────────────────────────────
export const PLAN_MONTHLY_POINTS: Record<Plan, number> = {
  free:    250_000,
  pro:   2_000_000,
  premium: 5_000_000,
  max:  15_000_000,
  ultra:   Infinity,
};

export const PHOTO_POINT_COST = 1_000;
export const VIDEO_POINT_COST = 2_000;

export const PLAN_LABELS: Record<Plan, string> = {
  free: "Free",
  pro: "Pro",
  premium: "Premium",
  max: "Max",
  ultra: "Ultra",
};

export const VALID_COUPON = "Illusion@123";

type PointsData = {
  balance: number;
  monthKey: string;
};

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function useAppState() {
  const [user, setUser] = useLocalStorage<User | null>("lumina_user", null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("lumina_history", []);

  // Signed-in points balance
  const [pointsData, setPointsData] = useLocalStorage<PointsData>("lumina_points", {
    balance: PLAN_MONTHLY_POINTS["free"],
    monthKey: currentMonthKey(),
  });

  // Guest usage counts
  const [guestUsage, setGuestUsage] = useLocalStorage<GuestUsage>("lumina_guest", {
    photoCount: 0,
    videoCount: 0,
    monthKey: currentMonthKey(),
  });

  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useLocalStorage<string>("lumina_coupon", "");
  const couponUnlocked = appliedCoupon === VALID_COUPON;

  const month = currentMonthKey();

  // Reset guest usage on new month
  const effectiveGuest: GuestUsage =
    guestUsage.monthKey !== month
      ? { photoCount: 0, videoCount: 0, monthKey: month }
      : guestUsage;

  // Reset signed-in points on new month (or plan change)
  const planLimit = PLAN_MONTHLY_POINTS[user?.plan ?? "free"] ?? PLAN_MONTHLY_POINTS["free"];
  const isUnlimited = couponUnlocked || user?.plan === "ultra";

  const effectivePoints: PointsData = (() => {
    if (!user) return pointsData; // not used for guests
    if (pointsData.monthKey !== month) {
      return { balance: planLimit === Infinity ? Number.MAX_SAFE_INTEGER : planLimit, monthKey: month };
    }
    return pointsData;
  })();

  // ── Helpers ──────────────────────────────────────────────────────────────

  const addHistory = (item: Omit<HistoryItem, "id" | "timestamp">) => {
    const newItem: HistoryItem = { ...item, id: crypto.randomUUID(), timestamp: Date.now() };
    setHistory((prev) => [newItem, ...prev]);
  };

  /** Can the user generate something of this type? */
  const canGenerate = (type: "photo" | "video"): boolean => {
    if (isUnlimited) return true;
    if (user) {
      // Points-based for signed users
      const cost = type === "photo" ? PHOTO_POINT_COST : VIDEO_POINT_COST;
      return effectivePoints.balance >= cost;
    }
    // Count-based for guests
    if (type === "photo") return effectiveGuest.photoCount < MAX_GUEST_PHOTOS;
    return effectiveGuest.videoCount < MAX_GUEST_VIDEOS;
  };

  /** Deduct cost. Returns false if insufficient. */
  const spendPoints = (type: "photo" | "video"): boolean => {
    if (isUnlimited) return true;
    if (user) {
      const cost = type === "photo" ? PHOTO_POINT_COST : VIDEO_POINT_COST;
      if (effectivePoints.balance < cost) return false;
      setPointsData({ balance: effectivePoints.balance - cost, monthKey: month });
      return true;
    }
    // Guest
    if (type === "photo") {
      if (effectiveGuest.photoCount >= MAX_GUEST_PHOTOS) return false;
      setGuestUsage({ ...effectiveGuest, photoCount: effectiveGuest.photoCount + 1, monthKey: month });
      return true;
    } else {
      if (effectiveGuest.videoCount >= MAX_GUEST_VIDEOS) return false;
      setGuestUsage({ ...effectiveGuest, videoCount: effectiveGuest.videoCount + 1, monthKey: month });
      return true;
    }
  };

  const applyCoupon = (code: string): boolean => {
    if (code === VALID_COUPON) {
      setAppliedCoupon(code);
      return true;
    }
    return false;
  };

  // Derived display values for signed users
  const pointsBalance = !user ? null : isUnlimited ? Infinity : effectivePoints.balance;
  const pointsUsed = !user ? null : planLimit === Infinity ? 0 : planLimit - (effectivePoints.balance ?? planLimit);
  const pointsPercent = !user || planLimit === Infinity ? 0 : Math.min(((pointsUsed ?? 0) / planLimit) * 100, 100);

  // Guest remaining counts
  const guestPhotoRemaining = MAX_GUEST_PHOTOS - effectiveGuest.photoCount;
  const guestVideoRemaining = MAX_GUEST_VIDEOS - effectiveGuest.videoCount;

  return {
    user,
    setUser,
    history,
    setHistory,
    addHistory,
    canGenerate,
    spendPoints,
    isUnlimited,
    couponUnlocked,
    appliedCoupon,
    applyCoupon,
    pointsBalance,
    pointsUsed,
    pointsPercent,
    guestPhotoRemaining,
    guestVideoRemaining,
    planLimit,
  };
}
