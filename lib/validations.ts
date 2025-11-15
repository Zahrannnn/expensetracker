/**
 * Input validation utilities
 */

import type { Expense } from '@/types/expense';
import { CATEGORIES } from '@/types/expense';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates expense data before submission
 */
export function validateExpense(
  data: Partial<Omit<Expense, 'id'>>
): ValidationResult {
  const errors: string[] = [];

  // Validate amount
  if (data.amount === undefined || data.amount === null) {
    errors.push('Amount is required');
  } else if (data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  } else if (isNaN(data.amount)) {
    errors.push('Amount must be a valid number');
  }

  // Validate category
  if (!data.category) {
    errors.push('Category is required');
  } else if (!CATEGORIES.includes(data.category as typeof CATEGORIES[number])) {
    errors.push('Invalid category selected');
  }

  // Validate date
  if (!data.date) {
    errors.push('Date is required');
  } else {
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    }
  }

  // Validate note length (optional field)
  if (data.note && data.note.length > 500) {
    errors.push('Note must be less than 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes user input for notes
 */
export function sanitizeNote(note: string | undefined): string | undefined {
  if (!note) return undefined;
  
  return note
    .trim()
    .replace(/\s+/g, ' ') 
    .slice(0, 500); 
}


export function parseAmount(value: string): number | null {
  const parsed = parseFloat(value);
  
  if (isNaN(parsed) || parsed <= 0) {
    return null;
  }
  
  
  return Math.round(parsed * 100) / 100;
}

/**
 * Validates date is not in the future
 */
export function isValidExpenseDate(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  
  // Set time to start of day for comparison
  date.setHours(0, 0, 0, 0);
  now.setHours(23, 59, 59, 999);
  
  return date <= now;
}

