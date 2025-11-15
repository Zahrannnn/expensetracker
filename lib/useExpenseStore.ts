
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Expense, Income, Debt, ExpenseInput, ExpenseUpdate } from '@/types/expense';

interface AppStore {
  // Expenses
  expenses: Expense[];
  addExpense: (expense: ExpenseInput) => void;
  updateExpense: (id: string, expense: ExpenseUpdate) => void;
  deleteExpense: (id: string) => void;
  clearExpenses: () => void;
  
  // Income
  incomes: Income[];
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (id: string, income: Partial<Omit<Income, 'id'>>) => void;
  deleteIncome: (id: string) => void;
  
  // Debts
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id' | 'isPaid'>) => void;
  updateDebt: (id: string, debt: Partial<Omit<Debt, 'id'>>) => void;
  markDebtAsPaid: (id: string) => void;
  deleteDebt: (id: string) => void;
  
  // Hydration
  hydrated: boolean;
  setHydrated: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      expenses: [],
      incomes: [],
      debts: [],
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      // Expense actions
      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, { ...expense, id: crypto.randomUUID() }],
        })),
      
      updateExpense: (id, updatedFields) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedFields } : expense
          ),
        })),
      
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),
      
      clearExpenses: () => set({ expenses: [] }),

      // Income actions
      addIncome: (income) =>
        set((state) => ({
          incomes: [...state.incomes, { ...income, id: crypto.randomUUID() }],
        })),
      
      updateIncome: (id, updatedFields) =>
        set((state) => ({
          incomes: state.incomes.map((income) =>
            income.id === id ? { ...income, ...updatedFields } : income
          ),
        })),
      
      deleteIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        })),

      // Debt actions
      addDebt: (debt) =>
        set((state) => ({
          debts: [...state.debts, { ...debt, id: crypto.randomUUID(), isPaid: false }],
        })),
      
      updateDebt: (id, updatedFields) =>
        set((state) => ({
          debts: state.debts.map((debt) =>
            debt.id === id ? { ...debt, ...updatedFields } : debt
          ),
        })),
      
      markDebtAsPaid: (id) =>
        set((state) => ({
          debts: state.debts.map((debt) =>
            debt.id === id 
              ? { ...debt, isPaid: true, paidDate: new Date().toISOString() }
              : debt
          ),
        })),
      
      deleteDebt: (id) =>
        set((state) => ({
          debts: state.debts.filter((debt) => debt.id !== id),
        })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

// Selectors
export const useExpenses = () => useAppStore((state) => state.expenses);
export const useIncomes = () => useAppStore((state) => state.incomes);
export const useDebts = () => useAppStore((state) => state.debts);
export const useHydrated = () => useAppStore((state) => state.hydrated);

export const useExpenseActions = () => {
  const addExpense = useAppStore((state) => state.addExpense);
  const updateExpense = useAppStore((state) => state.updateExpense);
  const deleteExpense = useAppStore((state) => state.deleteExpense);
  const clearExpenses = useAppStore((state) => state.clearExpenses);
  
  return { addExpense, updateExpense, deleteExpense, clearExpenses };
};

export const useIncomeActions = () => {
  const addIncome = useAppStore((state) => state.addIncome);
  const updateIncome = useAppStore((state) => state.updateIncome);
  const deleteIncome = useAppStore((state) => state.deleteIncome);
  
  return { addIncome, updateIncome, deleteIncome };
};

export const useDebtActions = () => {
  const addDebt = useAppStore((state) => state.addDebt);
  const updateDebt = useAppStore((state) => state.updateDebt);
  const markDebtAsPaid = useAppStore((state) => state.markDebtAsPaid);
  const deleteDebt = useAppStore((state) => state.deleteDebt);
  
  return { addDebt, updateDebt, markDebtAsPaid, deleteDebt };
};

