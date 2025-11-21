
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Expense, Income, Debt, ExpenseInput, ExpenseUpdate, CustomCategory, CategoryInput, CategoryUpdate, CategoryBudget, BudgetInput, BudgetUpdate, SavingsGoal, SavingsGoalInput, SavingsGoalUpdate } from '@/types/expense';
import type { Achievement, UserStats } from '@/types/achievements';
import { INITIAL_USER_STATS } from '@/types/achievements';
import { runMigration, needsMigration, initializeDefaultCategories } from './migration';
import { calculateStreak } from './streak-tracker';
import { checkAchievements, initializeAchievements } from './achievement-engine';

type StatsUpdateValue = {
  categoryId?: string;
  met?: boolean;
};

export type ChatbotMessage = {
  id: string;
  role: 'user' | 'bot';
  content: string;
};

interface AppStore {
  // Version for migration
  version: string;
  
  // Categories
  customCategories: CustomCategory[];
  addCategory: (category: CategoryInput) => void;
  updateCategory: (id: string, category: CategoryUpdate) => void;
  deleteCategory: (id: string) => void;
  
  // Budgets
  categoryBudgets: CategoryBudget[];
  setBudget: (budget: BudgetInput) => void;
  updateBudget: (id: string, budget: BudgetUpdate) => void;
  deleteBudget: (id: string) => void;

  // Savings Goals
  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: SavingsGoalInput) => void;
  updateSavingsGoal: (id: string, goal: SavingsGoalUpdate) => void;
  deleteSavingsGoal: (id: string) => void;
  contributeToSavings: (id: string, amount: number) => void;

  // Achievements & Stats
  achievements: Achievement[];
  userStats: UserStats;
  updateStats: (action: 'expense' | 'income' | 'saving' | 'budget', value?: StatsUpdateValue) => void;

  // Chatbot
  chatbotName: string;
  chatbotApiKey: string;
  setChatbotConfig: (config: { name?: string; apiKey?: string }) => void;
  // Onboarding & reminders
  hasCompletedOnboarding: boolean;
  showOnboardingGuide: boolean;
  remindersEnabled: boolean;
  dismissedReminders: string[];
  notifiedReminders: string[];
  startOnboarding: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setRemindersEnabled: (enabled: boolean) => void;
  dismissReminder: (id: string) => void;
  clearDismissedReminders: () => void;
  markReminderNotified: (id: string) => void;
  pruneNotifiedReminders: (activeIds: string[]) => void;
  chatbotMessages: ChatbotMessage[];
  addChatbotMessage: (message: ChatbotMessage) => void;
  clearChatbotMessages: () => void;
  
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
      version: '',
      expenses: [],
      incomes: [],
      debts: [],
      customCategories: [],
      categoryBudgets: [],
      savingsGoals: [],
      achievements: initializeAchievements(),
      userStats: INITIAL_USER_STATS,
      chatbotName: 'Nova',
      chatbotApiKey: '',
      chatbotMessages: [],
      hasCompletedOnboarding: false,
      showOnboardingGuide: false,
      remindersEnabled: true,
      dismissedReminders: [],
      notifiedReminders: [],
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      // Category actions
      addCategory: (category) =>
        set((state) => ({
          customCategories: [
            ...state.customCategories,
            {
              ...category,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateCategory: (id, updatedFields) =>
        set((state) => ({
          customCategories: state.customCategories.map((category) =>
            category.id === id ? { ...category, ...updatedFields } : category
          ),
        })),

      deleteCategory: (id) =>
        set((state) => {
          // Prevent deleting default categories
          const category = state.customCategories.find((cat) => cat.id === id);
          if (category?.isDefault) {
            console.warn('Cannot delete default category');
            return state;
          }

          // Prevent deleting categories that are in use
          const isInUse = state.expenses.some((expense) => expense.categoryId === id);
          if (isInUse) {
            console.warn('Cannot delete category that is in use');
            return state;
          }

          return {
            customCategories: state.customCategories.filter((cat) => cat.id !== id),
          };
        }),

      // Budget actions
      setBudget: (budget) =>
        set((state) => {
          // Check if budget already exists for this category
          const existingIndex = state.categoryBudgets.findIndex(
            (b) => b.categoryId === budget.categoryId
          );

          if (existingIndex >= 0) {
            // Update existing budget
            const updatedBudgets = [...state.categoryBudgets];
            updatedBudgets[existingIndex] = {
              ...updatedBudgets[existingIndex],
              ...budget,
              updatedAt: new Date().toISOString(),
            };
            return { categoryBudgets: updatedBudgets };
          } else {
            // Create new budget
            return {
              categoryBudgets: [
                ...state.categoryBudgets,
                {
                  ...budget,
                  id: crypto.randomUUID(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            };
          }
        }),

      updateBudget: (id, updatedFields) =>
        set((state) => ({
          categoryBudgets: state.categoryBudgets.map((budget) =>
            budget.id === id
              ? { ...budget, ...updatedFields, updatedAt: new Date().toISOString() }
              : budget
          ),
        })),

      deleteBudget: (id) =>
        set((state) => ({
          categoryBudgets: state.categoryBudgets.filter((budget) => budget.id !== id),
        })),

      // Savings Goals actions
      addSavingsGoal: (goal) =>
        set((state) => {
          const initialAmount = goal.currentAmount ?? 0;
          const newGoal = {
            ...goal,
            id: crypto.randomUUID(),
            currentAmount: initialAmount,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const updatedGoals = [...state.savingsGoals, newGoal];
          const completedGoals = updatedGoals.filter(
            (g) => g.currentAmount >= g.targetAmount
          ).length;

          const newStats = {
            ...state.userStats,
            goalsCreated: state.userStats.goalsCreated + 1,
            totalSaved: state.userStats.totalSaved + initialAmount,
            goalsCompleted: completedGoals,
          };

          const { updatedAchievements } = checkAchievements(state.achievements, newStats);

          return {
            savingsGoals: updatedGoals,
            userStats: newStats,
            achievements: updatedAchievements,
          };
        }),

      updateSavingsGoal: (id, updatedFields) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.map((goal) =>
            goal.id === id
              ? { ...goal, ...updatedFields, updatedAt: new Date().toISOString() }
              : goal
          ),
        })),

      deleteSavingsGoal: (id) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.filter((goal) => goal.id !== id),
        })),

      contributeToSavings: (id, amount) =>
        set((state) => {
          const newSavings = state.savingsGoals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  currentAmount: goal.currentAmount + amount,
                  updatedAt: new Date().toISOString(),
                }
              : goal
          );
          
          // Update stats for saving
          const currentStats = state.userStats;
          const newStats = {
            ...currentStats,
            totalSaved: currentStats.totalSaved + amount,
            goalsCompleted: newSavings.filter(g => g.currentAmount >= g.targetAmount).length,
          };
          
          const { updatedAchievements } = checkAchievements(state.achievements, newStats);

          return {
            savingsGoals: newSavings,
            userStats: newStats,
            achievements: updatedAchievements,
          };
        }),

      // Achievements & Stats
      updateStats: (action, value) =>
        set((state) => {
          let newStats = { ...state.userStats };

          if (action === 'expense') {
            newStats.totalExpenses += 1;
            if (value?.categoryId) {
              newStats.categoriesUsed = Array.from(
                new Set([...newStats.categoriesUsed, value.categoryId])
              );
            }
            newStats = calculateStreak(newStats);
          } else if (action === 'income') {
            newStats.totalIncome += 1;
          } else if (action === 'budget') {
            if (value?.met) newStats.budgetsMet += 1;
          }

          const { updatedAchievements } = checkAchievements(state.achievements, newStats);

          return {
            userStats: newStats,
            achievements: updatedAchievements,
          };
        }),

      setChatbotConfig: ({ name, apiKey }) =>
        set((state) => ({
          chatbotName: typeof name === 'string' ? name : state.chatbotName,
          chatbotApiKey: typeof apiKey === 'string' ? apiKey : state.chatbotApiKey,
        })),

      addChatbotMessage: (message) =>
        set((state) => ({
          chatbotMessages: [...state.chatbotMessages, message].slice(-50),
        })),

      clearChatbotMessages: () => set({ chatbotMessages: [] }),

      startOnboarding: () =>
        set((state) => ({
          showOnboardingGuide: true,
          hasCompletedOnboarding: state.hasCompletedOnboarding,
        })),

      completeOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
          showOnboardingGuide: false,
        }),

      resetOnboarding: () =>
        set({
          hasCompletedOnboarding: false,
          showOnboardingGuide: true,
        }),

      setRemindersEnabled: (enabled) =>
        set((state) => ({
          remindersEnabled: enabled,
          dismissedReminders: enabled ? state.dismissedReminders : state.dismissedReminders,
        })),

      dismissReminder: (id) =>
        set((state) => ({
          dismissedReminders: state.dismissedReminders.includes(id)
            ? state.dismissedReminders
            : [...state.dismissedReminders, id],
        })),

      clearDismissedReminders: () => set({ dismissedReminders: [] }),

      markReminderNotified: (id) =>
        set((state) => ({
          notifiedReminders: state.notifiedReminders.includes(id)
            ? state.notifiedReminders
            : [...state.notifiedReminders, id].slice(-50),
        })),

      pruneNotifiedReminders: (activeIds) =>
        set((state) => ({
          notifiedReminders: state.notifiedReminders.filter((id) => activeIds.includes(id)),
        })),

      // Expense actions
      addExpense: (expense) =>
        set((state) => {
          const newExpenses = [
            { ...expense, id: crypto.randomUUID() },
            ...state.expenses,
          ];
          
          let newStats = { ...state.userStats };
          newStats.totalExpenses += 1;
          newStats.categoriesUsed = Array.from(new Set([...newStats.categoriesUsed, expense.categoryId]));
          newStats = calculateStreak(newStats);
          
          const { updatedAchievements } = checkAchievements(state.achievements, newStats);

          return {
            expenses: newExpenses,
            userStats: newStats,
            achievements: updatedAchievements,
          };
        }),

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
        if (state) {
          // Run migration if needed
          if (needsMigration(state)) {
            const migrated = runMigration(state);
            state.expenses = migrated.expenses;
            state.customCategories = migrated.customCategories;
            state.version = migrated.version;
          }
          
          // Initialize categories if empty (fresh install)
          if (state.customCategories.length === 0) {
            state.customCategories = initializeDefaultCategories();
          }

          if (state.userStats && typeof state.userStats.goalsCreated === 'undefined') {
            state.userStats.goalsCreated = 0;
          }

          if (typeof state.chatbotName === 'undefined') {
            state.chatbotName = 'Nova';
          }
          if (typeof state.chatbotApiKey === 'undefined') {
            state.chatbotApiKey = '';
          }
          if (typeof state.chatbotMessages === 'undefined') {
            state.chatbotMessages = [];
          }
          if (typeof state.hasCompletedOnboarding === 'undefined') {
            state.hasCompletedOnboarding = false;
          }
          if (typeof state.showOnboardingGuide === 'undefined') {
            state.showOnboardingGuide = !state.hasCompletedOnboarding;
          }
          if (typeof state.remindersEnabled === 'undefined') {
            state.remindersEnabled = true;
          }
          if (typeof state.dismissedReminders === 'undefined') {
            state.dismissedReminders = [];
          }
          if (typeof state.notifiedReminders === 'undefined') {
            state.notifiedReminders = [];
          }

          // Initialize achievements
          state.achievements = initializeAchievements(state.achievements);
          
          state.setHydrated();
        }
      },
    }
  )
);

// Selectors
export const useExpenses = (): Expense[] => useAppStore((state) => state.expenses);
export const useIncomes = (): Income[] => useAppStore((state) => state.incomes);
export const useDebts = (): Debt[] => useAppStore((state) => state.debts);
export const useCategories = (): CustomCategory[] => useAppStore((state) => state.customCategories);
export const useBudgets = (): CategoryBudget[] => useAppStore((state) => state.categoryBudgets);
export const useSavingsGoals = (): SavingsGoal[] => useAppStore((state) => state.savingsGoals);
export const useAchievements = (): Achievement[] => useAppStore((state) => state.achievements);
export const useUserStats = (): UserStats => useAppStore((state) => state.userStats);
export const useHydrated = (): boolean => useAppStore((state) => state.hydrated);

export const useChatbotConfig = (): { chatbotName: string; chatbotApiKey: string } => {
  const chatbotName = useAppStore((state) => state.chatbotName);
  const chatbotApiKey = useAppStore((state) => state.chatbotApiKey);
  return { chatbotName, chatbotApiKey };
};

export const useChatbotMessages = (): ChatbotMessage[] =>
  useAppStore((state) => state.chatbotMessages);

export const useExpenseActions = () => {
  const addExpense = useAppStore((state) => state.addExpense);
  const updateExpense = useAppStore((state) => state.updateExpense);
  const deleteExpense = useAppStore((state) => state.deleteExpense);
  const clearExpenses = useAppStore((state) => state.clearExpenses);
  
  return { addExpense, updateExpense, deleteExpense, clearExpenses };
};

export const useCategoryActions = () => {
  const addCategory = useAppStore((state) => state.addCategory);
  const updateCategory = useAppStore((state) => state.updateCategory);
  const deleteCategory = useAppStore((state) => state.deleteCategory);
  
  return { addCategory, updateCategory, deleteCategory };
};

export const useBudgetActions = () => {
  const setBudget = useAppStore((state) => state.setBudget);
  const updateBudget = useAppStore((state) => state.updateBudget);
  const deleteBudget = useAppStore((state) => state.deleteBudget);
  
  return { setBudget, updateBudget, deleteBudget };
};

export const useSavingsActions = () => {
  const addSavingsGoal = useAppStore((state) => state.addSavingsGoal);
  const updateSavingsGoal = useAppStore((state) => state.updateSavingsGoal);
  const deleteSavingsGoal = useAppStore((state) => state.deleteSavingsGoal);
  const contributeToSavings = useAppStore((state) => state.contributeToSavings);
  
  return { addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, contributeToSavings };
};

export const useAchievementActions = () => {
  const updateStats = useAppStore((state) => state.updateStats);
  return { updateStats };
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

export const useChatbotActions = () => {
  const setChatbotConfig = useAppStore((state) => state.setChatbotConfig);
  const addChatbotMessage = useAppStore((state) => state.addChatbotMessage);
  const clearChatbotMessages = useAppStore((state) => state.clearChatbotMessages);
  return { setChatbotConfig, addChatbotMessage, clearChatbotMessages };
};

export const useOnboardingState = () => {
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  const showOnboardingGuide = useAppStore((state) => state.showOnboardingGuide);
  return { hasCompletedOnboarding, showOnboardingGuide };
};

export const useOnboardingActions = () => {
  const startOnboarding = useAppStore((state) => state.startOnboarding);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const resetOnboarding = useAppStore((state) => state.resetOnboarding);
  return { startOnboarding, completeOnboarding, resetOnboarding };
};

export const useReminderSettings = () => {
  const remindersEnabled = useAppStore((state) => state.remindersEnabled);
  const dismissedReminders = useAppStore((state) => state.dismissedReminders);
  return { remindersEnabled, dismissedReminders };
};

export const useNotifiedReminders = () => useAppStore((state) => state.notifiedReminders);

export const useReminderActions = () => {
  const setRemindersEnabled = useAppStore((state) => state.setRemindersEnabled);
  const dismissReminder = useAppStore((state) => state.dismissReminder);
  const clearDismissedReminders = useAppStore((state) => state.clearDismissedReminders);
  const markReminderNotified = useAppStore((state) => state.markReminderNotified);
  const pruneNotifiedReminders = useAppStore((state) => state.pruneNotifiedReminders);
  return {
    setRemindersEnabled,
    dismissReminder,
    clearDismissedReminders,
    markReminderNotified,
    pruneNotifiedReminders,
  };
};

