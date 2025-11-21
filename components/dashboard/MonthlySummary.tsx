'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories, useExpenses } from '@/lib/useExpenseStore';
import {
  filterExpensesByMonth,
  getTotalAmount,
  getMostExpensiveCategory,
  formatCurrency,
  getCurrentMonth,
} from '@/lib/helpers';
import { getCategoryName } from '@/lib/category-helpers';
import { TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';

export function MonthlySummary() {
  const t = useTranslations('summary');
  const expenses = useExpenses();
  const categories = useCategories();
  const currentMonth = getCurrentMonth();
  const monthlyExpenses = filterExpensesByMonth(expenses, currentMonth);
  
  const total = getTotalAmount(monthlyExpenses);
  const count = monthlyExpenses.length;
  const mostExpensive = getMostExpensiveCategory(monthlyExpenses);
  const mostExpensiveName = mostExpensive
    ? getCategoryName(categories, mostExpensive.category)
    : '-';

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('totalThisMonth')}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(total)}</div>
          <p className="text-xs text-muted-foreground">
            {t('transactions', { count })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('topCategory')}
          </CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {mostExpensiveName}
          </div>
          <p className="text-xs text-muted-foreground">
            {mostExpensive ? formatCurrency(mostExpensive.amount) : t('noData')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('averagePerDay')}
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(count > 0 ? total / new Date().getDate() : 0)}
          </div>
          <p className="text-xs text-muted-foreground">
            {t('basedOnDate')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

