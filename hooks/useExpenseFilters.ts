/**
 * Custom hook for managing expense filters
 */

import { useState, useMemo } from 'react';
import type { Expense } from '@/types/expense';
import {
  filterExpensesByMonth,
  filterExpensesByCategory,
} from '@/lib/helpers';

export function useExpenseFilters(expenses: Expense[]) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredExpenses = useMemo(() => {
    let filtered = expenses;
    
    if (selectedMonth) {
      filtered = filterExpensesByMonth(filtered, selectedMonth);
    }
    
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filterExpensesByCategory(filtered, selectedCategory);
    }
    
    return filtered;
  }, [expenses, selectedMonth, selectedCategory]);

  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredExpenses]);

  const resetFilters = () => {
    setSelectedMonth('');
    setSelectedCategory('all');
  };

  return {
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
    filteredExpenses,
    sortedExpenses,
    resetFilters,
    hasActiveFilters: selectedMonth !== '' || selectedCategory !== 'all',
  };
}

