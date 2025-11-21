import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns';
import type { UserStats } from '@/types/achievements';

/**
 * Updates streak information based on the latest activity date
 */
export function calculateStreak(
  currentStats: UserStats,
  activityDate: Date = new Date()
): UserStats {
  const today = startOfDay(activityDate);
  const lastActivity = currentStats.lastActivityDate 
    ? startOfDay(parseISO(currentStats.lastActivityDate))
    : null;

  // If no previous activity, start streak at 1
  if (!lastActivity) {
    return {
      ...currentStats,
      currentStreak: 1,
      longestStreak: Math.max(currentStats.longestStreak, 1),
      lastActivityDate: today.toISOString(),
    };
  }

  const daysDiff = differenceInCalendarDays(today, lastActivity);

  // If activity is on the same day, no change to streak
  if (daysDiff === 0) {
    return currentStats;
  }

  // If activity is exactly 1 day after last activity, increment streak
  if (daysDiff === 1) {
    const newStreak = currentStats.currentStreak + 1;
    return {
      ...currentStats,
      currentStreak: newStreak,
      longestStreak: Math.max(currentStats.longestStreak, newStreak),
      lastActivityDate: today.toISOString(),
    };
  }

  // If gap is larger than 1 day, reset streak to 1
  return {
    ...currentStats,
    currentStreak: 1,
    longestStreak: currentStats.longestStreak, // Keep longest streak record
    lastActivityDate: today.toISOString(),
  };
}

/**
 * Checks if the current streak is broken (no activity yesterday or today)
 * Used for display purposes to show if streak is at risk or lost
 */
export function isStreakBroken(lastActivityDate: string | null): boolean {
  if (!lastActivityDate) return true;
  
  const today = startOfDay(new Date());
  const lastActivity = startOfDay(parseISO(lastActivityDate));
  const daysDiff = differenceInCalendarDays(today, lastActivity);
  
  return daysDiff > 1;
}

/**
 * Checks if streak is active (activity today or yesterday)
 */
export function isStreakActive(lastActivityDate: string | null): boolean {
  if (!lastActivityDate) return false;
  
  const today = startOfDay(new Date());
  const lastActivity = startOfDay(parseISO(lastActivityDate));
  const daysDiff = differenceInCalendarDays(today, lastActivity);
  
  return daysDiff <= 1;
}
