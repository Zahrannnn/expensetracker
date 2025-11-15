'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressRing } from './ProgressRing';
import { useExpenses, useIncomes, useDebts } from '@/lib/useExpenseStore';
import { formatCurrency, getCurrentMonth, filterExpensesByMonth } from '@/lib/helpers';
import { TrendingUp, AlertCircle, Wallet } from 'lucide-react';

export function BudgetOverview() {
  const expenses = useExpenses();
  const incomes = useIncomes();
  const debts = useDebts();
  const currentMonth = getCurrentMonth();

  const summary = useMemo(() => {
    const monthExpenses = filterExpensesByMonth(expenses, currentMonth);
    const monthIncomes = incomes.filter(i => i.month === currentMonth);
    const unpaidDebts = debts.filter(d => !d.isPaid);

    const totalIncome = monthIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalDebts = unpaidDebts.reduce((sum, d) => sum + d.amount, 0);
    const remaining = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((remaining / totalIncome) * 100) : 0;
    const spendingRate = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100) : 0;

    return {
      totalIncome,
      totalExpenses,
      totalDebts,
      remaining,
      savingsRate,
      spendingRate,
    };
  }, [expenses, incomes, debts, currentMonth]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Budget Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ProgressRing progress={Math.min(summary.spendingRate, 100)} />
          <p className="mt-4 text-sm text-muted-foreground">
            {formatCurrency(summary.totalExpenses)} / {formatCurrency(summary.totalIncome)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {summary.totalIncome === 0 ? 'Add income to track budget' : 'of income spent'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(summary.totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            {summary.remaining >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            Remaining
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${summary.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(summary.remaining)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Savings: {summary.savingsRate.toFixed(1)}%
            {summary.totalDebts > 0 && ` • Debts: ${formatCurrency(summary.totalDebts)}`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

