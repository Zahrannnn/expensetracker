import { format, startOfMonth, endOfMonth } from 'date-fns';
import type { Expense, CategoryBudget, BudgetStatus } from '@/types/expense';

/**
 * Get the current month in yyyy-MM format
 */
export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

/**
 * Calculate total spending for a category in a specific month
 */
export function calculateCategorySpending(
  expenses: Expense[],
  categoryId: string,
  month: string = getCurrentMonth()
): number {
  const [year, monthNum] = month.split('-').map(Number);
  const start = startOfMonth(new Date(year, monthNum - 1));
  const end = endOfMonth(new Date(year, monthNum - 1));

  return expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expense.categoryId === categoryId &&
        expenseDate >= start &&
        expenseDate <= end
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * Calculate budget progress percentage
 */
export function calculateBudgetProgress(spent: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.round((spent / limit) * 100);
}

/**
 * Get budget status for a category
 */
export function getBudgetStatus(
  expenses: Expense[],
  categoryId: string,
  budget: CategoryBudget | null,
  month: string = getCurrentMonth()
): BudgetStatus {
  const spent = calculateCategorySpending(expenses, categoryId, month);
  
  if (!budget) {
    return {
      categoryId,
      budget: null,
      spent,
      remaining: 0,
      percentage: 0,
      isOverBudget: false,
      isNearLimit: false,
    };
  }

  const remaining = budget.monthlyLimit - spent;
  const percentage = calculateBudgetProgress(spent, budget.monthlyLimit);
  const isOverBudget = spent > budget.monthlyLimit;
  const isNearLimit = percentage >= budget.alertThreshold && !isOverBudget;

  return {
    categoryId,
    budget,
    spent,
    remaining,
    percentage,
    isOverBudget,
    isNearLimit,
  };
}

/**
 * Get all budget statuses for categories with budgets
 */
export function getAllBudgetStatuses(
  expenses: Expense[],
  budgets: CategoryBudget[],
  month: string = getCurrentMonth()
): BudgetStatus[] {
  return budgets.map((budget) =>
    getBudgetStatus(expenses, budget.categoryId, budget, month)
  );
}

/**
 * Check if adding an expense would exceed budget
 */
export function wouldExceedBudget(
  expenses: Expense[],
  categoryId: string,
  amount: number,
  budget: CategoryBudget | null,
  month: string = getCurrentMonth()
): boolean {
  if (!budget) return false;
  
  const currentSpent = calculateCategorySpending(expenses, categoryId, month);
  return currentSpent + amount > budget.monthlyLimit;
}

/**
 * Check if adding an expense would trigger alert threshold
 */
export function wouldTriggerAlert(
  expenses: Expense[],
  categoryId: string,
  amount: number,
  budget: CategoryBudget | null,
  month: string = getCurrentMonth()
): boolean {
  if (!budget) return false;
  
  const currentSpent = calculateCategorySpending(expenses, categoryId, month);
  const newSpent = currentSpent + amount;
  const newPercentage = calculateBudgetProgress(newSpent, budget.monthlyLimit);
  
  return newPercentage >= budget.alertThreshold && newSpent <= budget.monthlyLimit;
}

/**
 * Get budget color based on percentage
 */
export function getBudgetColor(percentage: number, isOverBudget: boolean): string {
  if (isOverBudget) return 'text-red-600';
  if (percentage >= 80) return 'text-yellow-600';
  return 'text-green-600';
}

/**
 * Get budget background color based on percentage
 */
export function getBudgetBgColor(percentage: number, isOverBudget: boolean): string {
  if (isOverBudget) return 'bg-red-100 dark:bg-red-900/20';
  if (percentage >= 80) return 'bg-yellow-100 dark:bg-yellow-900/20';
  return 'bg-green-100 dark:bg-green-900/20';
}

/**
 * Calculate overall budget health score (0-100)
 */
export function calculateBudgetHealthScore(statuses: BudgetStatus[]): number {
  if (statuses.length === 0) return 100;
  
  const scores = statuses.map((status) => {
    if (status.isOverBudget) return 0;
    if (status.percentage >= 90) return 25;
    if (status.percentage >= 80) return 50;
    if (status.percentage >= 70) return 75;
    return 100;
  });
  
  return Math.round(scores.reduce((sum: number, score) => sum + score, 0) / scores.length);
}
