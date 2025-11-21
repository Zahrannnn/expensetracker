import type { CustomCategory } from '@/types/expense';

/**
 * Get category by ID
 */
export function getCategoryById(
  categories: CustomCategory[],
  categoryId: string
): CustomCategory | undefined {
  return categories.find((cat) => cat.id === categoryId);
}

/**
 * Get category name by ID
 */
export function getCategoryName(
  categories: CustomCategory[],
  categoryId: string
): string {
  const category = getCategoryById(categories, categoryId);
  return category?.name || 'Unknown';
}

/**
 * Get category color by ID
 */
export function getCategoryColor(
  categories: CustomCategory[],
  categoryId: string
): string {
  const category = getCategoryById(categories, categoryId);
  return category?.color || '#a4de6c';
}

/**
 * Get category icon by ID
 */
export function getCategoryIcon(
  categories: CustomCategory[],
  categoryId: string
): string {
  const category = getCategoryById(categories, categoryId);
  return category?.icon || 'MoreHorizontal';
}

/**
 * Check if a category name already exists
 */
export function categoryNameExists(
  categories: CustomCategory[],
  name: string,
  excludeId?: string
): boolean {
  return categories.some(
    (cat) => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== excludeId
  );
}

/**
 * Count expenses using a specific category
 */
export function countExpensesByCategory(
  expenses: { categoryId: string }[],
  categoryId: string
): number {
  return expenses.filter((expense) => expense.categoryId === categoryId).length;
}
