// hooks/useUnsignedUserTracker.ts 

import { useState, useEffect, useCallback } from 'react';
import {
  initializeUserTracking,
  incrementUserCount,
  resetUserCount,
  getUnsignedUserCount,
  getUnsignedUserId             
} from '../../utils/userTracker'; 

interface UseUnsignedUserTrackerResult {
  userId: string | null;
  count: number;
  increment: () => void;
  reset: () => void;
}

export function useUnsignedUserTracker(): UseUnsignedUserTrackerResult {
  const [userId, setUserId] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // This code ONLY runs on the client-side after hydration
    const { userId: initialUserId, count: initialCount } = initializeUserTracking();
    setUserId(initialUserId);
    setCount(initialCount);

    const handleStorageChange = () => {
      const currentCount = getUnsignedUserCount();
      setCount(currentCount);
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const increment = useCallback(() => {
    const newCount = incrementUserCount();
    setCount(newCount);
  }, []);

  const reset = useCallback(() => {
    const newCount = resetUserCount();
    setCount(newCount);
  }, []);

  return { userId, count, increment, reset };
}