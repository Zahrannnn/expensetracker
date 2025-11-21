import { LucideIcon } from 'lucide-react';

export type AchievementCategory = 'tracking' | 'saving' | 'budgeting' | 'milestone' | 'streak';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  category: AchievementCategory;
  target: number;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  totalExpenses: number;
  totalIncome: number;
  totalSaved: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  categoriesUsed: string[];
  budgetsMet: number;
  goalsCompleted: number;
  goalsCreated: number;
}

export const INITIAL_USER_STATS: UserStats = {
  totalExpenses: 0,
  totalIncome: 0,
  totalSaved: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  categoriesUsed: [],
  budgetsMet: 0,
  goalsCompleted: 0,
  goalsCreated: 0,
};

export const ACHIEVEMENT_DEFINITIONS = [
  // Tracking Achievements
  {
    id: 'first_expense',
    title: 'First Steps',
    description: 'Log your first expense',
    icon: 'Footprints',
    category: 'tracking',
    target: 1,
  },
  {
    id: 'tracker_novice',
    title: 'Tracker Novice',
    description: 'Log 10 expenses',
    icon: 'Pencil',
    category: 'tracking',
    target: 10,
  },
  {
    id: 'tracker_pro',
    title: 'Tracker Pro',
    description: 'Log 100 expenses',
    icon: 'ScrollText',
    category: 'tracking',
    target: 100,
  },
  {
    id: 'category_explorer',
    title: 'Category Explorer',
    description: 'Use 5 different categories',
    icon: 'Palette',
    category: 'tracking',
    target: 5,
  },

  // Streak Achievements
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Log expenses for 7 days in a row',
    icon: 'Flame',
    category: 'streak',
    target: 7,
  },
  {
    id: 'monthly_master',
    title: 'Monthly Master',
    description: 'Log expenses for 30 days in a row',
    icon: 'CalendarRange',
    category: 'streak',
    target: 30,
  },

  // Saving Achievements
  {
    id: 'saver_starter',
    title: 'Piggy Bank',
    description: 'Create your first savings goal',
    icon: 'PiggyBank',
    category: 'saving',
    target: 1,
  },
  {
    id: 'goal_getter',
    title: 'Goal Getter',
    description: 'Complete a savings goal',
    icon: 'Trophy',
    category: 'saving',
    target: 1,
  },
  {
    id: 'big_saver',
    title: 'Big Saver',
    description: 'Save a total of 1,000',
    icon: 'Coins',
    category: 'saving',
    target: 1000,
  },

  // Budgeting Achievements
  {
    id: 'budget_boss',
    title: 'Budget Boss',
    description: 'Set a budget for a category',
    icon: 'Target',
    category: 'budgeting',
    target: 1,
  },
] as const;
