'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useExpenses } from '@/lib/useExpenseStore';
import {
  filterExpensesByMonth,
  filterExpensesByCategory,
  getTotalAmount,
  formatCurrency,
} from '@/lib/helpers';
import { Receipt } from 'lucide-react';

export function ExpenseTable() {
  const t = useTranslations('expense');
  const expenses = useExpenses();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredExpenses = filterExpensesByCategory(
    filterExpensesByMonth(expenses, selectedMonth),
    selectedCategory
  );

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const total = getTotalAmount(filteredExpenses);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {t('title')}
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <MonthlyFilter value={selectedMonth} onChange={setSelectedMonth} />
            <CategoryFilter
              value={selectedCategory}
              onChange={setSelectedCategory}
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
                    {sortedExpenses.map((expense) => (
                      <ExpenseRow key={expense.id} expense={expense} />
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {t('count', { count: sortedExpenses.length })}
              </p>
              <p className="text-lg font-bold">
                {t('total')}: {formatCurrency(total)}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

