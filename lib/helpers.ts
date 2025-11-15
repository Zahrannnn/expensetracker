import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import type { Expense } from '@/types/expense';
import { DATE_FORMATS, CURRENCY, EXPORT } from './constants';


export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: CURRENCY.CURRENCY,
    minimumFractionDigits: CURRENCY.MIN_FRACTION_DIGITS,
    maximumFractionDigits: CURRENCY.MAX_FRACTION_DIGITS,
  }).format(amount);
};


export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), DATE_FORMATS.DISPLAY);
};


export const getCurrentMonth = (): string => {
  return format(new Date(), DATE_FORMATS.FILTER);
};


export const filterExpensesByMonth = (
  expenses: Expense[],
  month: string
): Expense[] => {
  if (!month) return expenses;
  
  const [year, monthNum] = month.split('-').map(Number);
  const start = startOfMonth(new Date(year, monthNum - 1));
  const end = endOfMonth(new Date(year, monthNum - 1));

  return expenses.filter((expense) => {
    const expenseDate = parseISO(expense.date);
    return expenseDate >= start && expenseDate <= end;
  });
};


export const filterExpensesByCategory = (
  expenses: Expense[],
  category: string
): Expense[] => {
  if (!category || category === 'all') return expenses;
  return expenses.filter((expense) => expense.category === category);
};

export const getTotalAmount = (expenses: Expense[]): number => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};


export const getExpensesByCategory = (
  expenses: Expense[]
): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

export const getExpensesByMonth = (
  expenses: Expense[]
): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    const month = format(parseISO(expense.date), DATE_FORMATS.MONTH);
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};


export const getMostExpensiveCategory = (
  expenses: Expense[]
): { category: string; amount: number } | null => {
  const byCategory = getExpensesByCategory(expenses);
  const entries = Object.entries(byCategory);
  
  if (entries.length === 0) return null;
  
  const [category, amount] = entries.reduce((max, entry) =>
    entry[1] > max[1] ? entry : max
  );
  
  return { category, amount };
};


export const exportToJSON = (expenses: Expense[]): void => {
  const dataStr = JSON.stringify(expenses, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  downloadFile(blob, `${EXPORT.FILE_PREFIX}${Date.now()}.json`);
};


export const exportToCSV = (expenses: Expense[]): void => {
  const rows = expenses.map((expense) => [
    formatDate(expense.date),
    expense.category,
    expense.amount.toString(),
    expense.note || '',
  ]);

  const csvContent = [
    EXPORT.CSV_HEADERS.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  downloadFile(blob, `${EXPORT.FILE_PREFIX}${Date.now()}.csv`);
};


const downloadFile = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

