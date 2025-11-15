'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence } from 'framer-motion';
import { ExpenseRow } from './ExpenseRow';
import { MonthlyFilter } from '@/components/filters/MonthlyFilter';
import { CategoryFilter } from '@/components/filters/CategoryFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useExpenses } from '@/lib/useExpenseStore';
import {
  filterExpensesByMonth,
  filterExpensesByCategory,
  getTotalAmount,
  formatCurrency,
} from '@/lib/helpers';
import { Receipt, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

export function ExpenseTable() {
  const t = useTranslations('expense');
  const expenses = useExpenses();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredExpenses = filterExpensesByCategory(
    filterExpensesByMonth(expenses, selectedMonth),
    selectedCategory
  );

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const total = getTotalAmount(filteredExpenses);

  // Pagination calculations
  const totalPages = Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedExpenses = sortedExpenses.slice(startIndex, endIndex);

  // Debug logging
  console.log('Pagination Debug:', {
    totalExpenses: sortedExpenses.length,
    totalPages,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    showingFrom: startIndex + 1,
    showingTo: Math.min(endIndex, sortedExpenses.length),
  });

  // Reset to page 1 when filters change
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {t('title')}
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <MonthlyFilter value={selectedMonth} onChange={handleMonthChange} />
            <CategoryFilter
              value={selectedCategory}
              onChange={handleCategoryChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedExpenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>{t('noExpenses')}</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('category')}</TableHead>
                    <TableHead>{t('note')}</TableHead>
                    <TableHead className="text-right">{t('amount')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {paginatedExpenses.map((expense) => (
                      <ExpenseRow key={expense.id} expense={expense} />
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {t('count', { count: sortedExpenses.length })}
                </p>
                <p className="text-lg font-bold">
                  {t('total')}: {formatCurrency(total)}
                </p>
              </div>
              
              {/* Pagination Controls - Always show when there are expenses */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t pt-4 bg-muted/30 p-3 rounded-md">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, sortedExpenses.length)} of {sortedExpenses.length} expenses
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="text-sm font-medium min-w-[120px] text-center">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

