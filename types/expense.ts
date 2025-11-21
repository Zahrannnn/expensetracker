/**
 * Represents a custom category with icon and color
 */
export interface CustomCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string; // Hex color code
  isDefault: boolean; // True for built-in categories
  createdAt: string;
}

/**
 * Represents a single expense entry
 */
export interface Expense {
  id: string;
  amount: number;
  /** Category ID reference */
  categoryId: string;
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
 * Input data for creating a new category (without ID and timestamps)
 */
export type CategoryInput = Omit<CustomCategory, 'id' | 'createdAt'>;

/**
 * Partial category data for updates
 */
export type CategoryUpdate = Partial<Omit<CustomCategory, 'id' | 'isDefault'>>;

/**
 * Represents a monthly budget for a category
 */
export interface CategoryBudget {
  id: string;
  categoryId: string;
  monthlyLimit: number;
  /** Alert threshold percentage (e.g., 80 for 80%) */
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input data for creating a new budget (without ID and timestamps)
 */
export type BudgetInput = Omit<CategoryBudget, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Partial budget data for updates
 */
export type BudgetUpdate = Partial<Omit<CategoryBudget, 'id' | 'categoryId'>>;

/**
 * Budget status for a category in a specific month
 */
export interface BudgetStatus {
  categoryId: string;
  budget: CategoryBudget | null;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  isNearLimit: boolean;
}


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


/**
 * Represents a savings goal
 */
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string; // Lucide icon name
  color: string; // Hex color code
  createdAt: string;
  updatedAt: string;
}

/**
 * Input data for creating a new savings goal
 */
export type SavingsGoalInput = Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'updatedAt'> & {
  currentAmount?: number; // Optional initial amount
};

/**
 * Partial data for updating a savings goal
 */
export type SavingsGoalUpdate = Partial<Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>>;
