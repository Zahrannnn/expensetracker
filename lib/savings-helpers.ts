import { differenceInDays, differenceInMonths, parseISO, startOfDay } from 'date-fns';
import type { SavingsGoal } from '@/types/expense';

/**
 * Calculate progress percentage for a savings goal
 */
export function calculateSavingsProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  const percentage = (current / target) * 100;
  return Math.min(Math.round(percentage), 100);
}

/**
 * Calculate remaining amount to reach target
 */
export function calculateRemainingAmount(current: number, target: number): number {
  return Math.max(target - current, 0);
}

/**
 * Calculate days remaining until deadline
 */
export function calculateDaysRemaining(deadline?: string): number | null {
  if (!deadline) return null;
  
  const today = startOfDay(new Date());
  const deadlineDate = startOfDay(parseISO(deadline));
  const days = differenceInDays(deadlineDate, today);
  
  return Math.max(days, 0);
}

/**
 * Calculate required monthly savings to reach goal by deadline
 */
export function calculateMonthlySavingsNeeded(
  current: number,
  target: number,
  deadline?: string
): number | null {
  if (!deadline) return null;
  
  const remaining = calculateRemainingAmount(current, target);
  if (remaining <= 0) return 0;
  
  const today = new Date();
  const deadlineDate = parseISO(deadline);
  const months = differenceInMonths(deadlineDate, today);
  
  if (months <= 0) return remaining; // If less than a month, need full amount
  
  return Math.ceil(remaining / months);
}

/**
 * Get savings goal status color based on progress
 */
export function getSavingsProgressColor(percentage: number): string {
  if (percentage >= 100) return 'text-green-600';
  if (percentage >= 75) return 'text-emerald-600';
  if (percentage >= 50) return 'text-blue-600';
  if (percentage >= 25) return 'text-yellow-600';
  return 'text-gray-600';
}

/**
 * Get savings goal progress bar color
 */
export function getSavingsProgressBarColor(percentage: number): string {
  if (percentage >= 100) return 'bg-green-600';
  if (percentage >= 75) return 'bg-emerald-600';
  if (percentage >= 50) return 'bg-blue-600';
  if (percentage >= 25) return 'bg-yellow-600';
  return 'bg-gray-600';
}
