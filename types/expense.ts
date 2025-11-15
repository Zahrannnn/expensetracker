/**
 * Represents a single expense entry
 */
export interface Expense {

  id: string;
  
  amount: number;
  /** Expense category */
  category: string;

  note?: string;

  date: string;
}

/**
 * Input data for creating a new expense (without ID)
 */
export type ExpenseInput = Omit<Expense, 'id'>;

/**
 * Partial expense data for updates
 */
export type ExpenseUpdate = Partial<ExpenseInput>;

/**
 * Zustand store interface for expense management
 */
export interface ExpenseStore {
  /** Array of all expenses */
  expenses: Expense[];
  /** Adds a new expense */
  addExpense: (expense: ExpenseInput) => void;
  /** Updates an existing expense */
  updateExpense: (id: string, expense: ExpenseUpdate) => void;
  /** Deletes an expense by ID */
  deleteExpense: (id: string) => void;
  /** Clears all expenses */
  clearExpenses: () => void;
  /** Flag indicating if store has been hydrated from storage */
  hydrated: boolean;
  /** Sets the hydrated flag */
  setHydrated: () => void;
}

/**
 * Available expense categories
 */
export const CATEGORIES = [
  'FastFood',
  'Drinks',
  'Transportation',
  'Clothing',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Other',
] as const;

/**
 * Type-safe category string
 */
export type Category = typeof CATEGORIES[number];

/**
 * Represents a monthly income entry
 */
export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
  month: string; // "yyyy-MM"
}

/**
 * Represents borrowed money (debt/loan)
 */
export interface Debt {
  id: string;
  amount: number;
  creditor: string;
  reason?: string;
  borrowedDate: string;
  dueDate?: string;
  isPaid: boolean;
  paidDate?: string;
}

/**
 * Income sources
 */
export const INCOME_SOURCES = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Gift',
  'Other',
] as const;

