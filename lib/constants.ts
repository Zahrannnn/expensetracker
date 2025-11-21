/**
 * Application-wide constants
 */

// Storage keys
export const STORAGE_KEYS = {
  EXPENSES: 'expense-storage',
  THEME: 'expense-tracker-theme',
} as const;

// Toast configuration
export const TOAST_CONFIG = {
  POSITION: 'top-right' as const,
  DURATION: 4000,
  RICH_COLORS: true,
  CLOSE_BUTTON: true,
} as const;

// Animation configuration
export const ANIMATION = {
  SPRING: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 20,
  },
  DURATION: {
    FAST: 0.2,
    NORMAL: 0.3,
    SLOW: 0.5,
  },
} as const;

// UI configuration
export const UI = {
  FAB_POSITION: {
    bottom: 8,
    right: 8,
  },
  SIDEBAR_WIDTH: {
    expanded: 280,
    collapsed: 80,
  },
  MAX_MONTHS_FILTER: 12,
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  MONTH: 'MMM yyyy',
  FILTER: 'yyyy-MM',
  FILTER_LABEL: 'MMMM yyyy',
  INPUT: 'yyyy-MM-dd',
} as const;

// Currency configuration
export const CURRENCY = {
  LOCALE: 'en-US',
  CURRENCY: 'EGP',
  MIN_FRACTION_DIGITS: 2,
  MAX_FRACTION_DIGITS: 2,
} as const;

// Export formats
export const EXPORT = {
  CSV_HEADERS: ['Date', 'Category', 'Amount', 'Note'],
  FILE_PREFIX: 'expenses-',
} as const;

// Chart colors (matching Sage Garden theme)
export const CHART_COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#8dd1e1',
  '#a4de6c',
] as const;

// App metadata
export const APP_INFO = {
  NAME: 'ExpenseTracker',
  VERSION: '1.0.0',
  STORAGE_TYPE: 'LocalStorage',
  MADE_BY: 'Mohamed Zahran',
  TAGLINE: 'Manage your finances',
} as const;

// Default expense categories with icons and colors
export const DEFAULT_CATEGORIES = [
  {
    name: 'FastFood',
    icon: 'UtensilsCrossed', // Lucide icon name
    color: '#FF8042',
  },
  {
    name: 'Drinks',
    icon: 'Coffee',
    color: '#8884D8',
  },
  {
    name: 'Transportation',
    icon: 'Car',
    color: '#0088FE',
  },
  {
    name: 'Clothing',
    icon: 'Shirt',
    color: '#00C49F',
  },
  {
    name: 'Entertainment',
    icon: 'Gamepad2',
    color: '#FFBB28',
  },
  {
    name: 'Bills & Utilities',
    icon: 'Receipt',
    color: '#82ca9d',
  },
  {
    name: 'Healthcare',
    icon: 'Heart',
    color: '#ff7c7c',
  },
  {
    name: 'Other',
    icon: 'MoreHorizontal',
    color: '#a4de6c',
  },
] as const;

// Storage version for data migration
export const STORAGE_VERSION = '1.0.0';
