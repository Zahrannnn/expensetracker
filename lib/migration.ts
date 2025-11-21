import { DEFAULT_CATEGORIES, STORAGE_VERSION } from './constants';
import type { CustomCategory, Expense } from '@/types/expense';

interface LegacyExpense {
  id: string;
  amount: number;
  category: string; // Old string-based category
  note?: string;
  date: string;
}

interface MigrationState {
  version?: string;
  expenses?: (Expense | LegacyExpense)[];
  customCategories?: CustomCategory[];
}

/**
 * Initialize default categories as CustomCategory objects
 */
export function initializeDefaultCategories(): CustomCategory[] {
  return DEFAULT_CATEGORIES.map((cat, index) => ({
    id: `default-${index}`,
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
    isDefault: true,
    createdAt: new Date().toISOString(),
  }));
}

/**
 * Migrate legacy expenses to use category IDs
 */
export function migrateLegacyExpenses(
  expenses: (Expense | LegacyExpense)[],
  categories: CustomCategory[]
): Expense[] {
  return expenses.map((expense) => {
    // Check if expense is already migrated
    if ('categoryId' in expense) {
      return expense as Expense;
    }

    // Legacy expense - migrate it
    const legacyExpense = expense as LegacyExpense;
    
    // Find matching category by name
    const matchingCategory = categories.find(
      (cat) => cat.name === legacyExpense.category
    );

    // If no match found, use "Other" category
    const categoryId = matchingCategory?.id || categories.find(cat => cat.name === 'Other')?.id || categories[0].id;

    return {
      id: legacyExpense.id,
      amount: legacyExpense.amount,
      categoryId,
      note: legacyExpense.note,
      date: legacyExpense.date,
    };
  });
}

/**
 * Run migration on app load
 */
export function runMigration(state: MigrationState): {
  expenses: Expense[];
  customCategories: CustomCategory[];
  version: string;
} {
  // Initialize default categories if none exist
  let categories = state.customCategories || [];
  if (categories.length === 0) {
    categories = initializeDefaultCategories();
  }

  // Migrate expenses if needed
  let expenses: Expense[] = [];
  if (state.expenses && state.expenses.length > 0) {
    expenses = migrateLegacyExpenses(state.expenses, categories);
  }

  return {
    expenses,
    customCategories: categories,
    version: STORAGE_VERSION,
  };
}

/**
 * Check if migration is needed
 */
export function needsMigration(state: MigrationState): boolean {
  // No version means it's a fresh install or needs migration
  if (!state.version || state.version !== STORAGE_VERSION) {
    return true;
  }

  // Check if categories need initialization
  if (!state.customCategories || state.customCategories.length === 0) {
    return true;
  }

  // Check if any expenses use old category format
  if (state.expenses && state.expenses.length > 0) {
    const hasLegacyExpenses = state.expenses.some(
      (expense) => 'category' in expense && typeof (expense as any).category === 'string'
    );
    return hasLegacyExpenses;
  }

  return false;
}
