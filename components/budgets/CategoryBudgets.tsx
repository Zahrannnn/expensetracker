'use client';

import { Target } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetProgressCard } from './BudgetProgressCard';
import { useCategories, useExpenses, useBudgets } from '@/lib/useExpenseStore';
import { getBudgetStatus, calculateBudgetHealthScore } from '@/lib/budget-helpers';

export function CategoryBudgets() {
  const t = useTranslations('categoryBudgets');
  const categories = useCategories();
  const expenses = useExpenses();
  const budgets = useBudgets();

  // Get budget status for all categories
  const budgetStatuses = categories.map((category) => {
    const budget = budgets.find((b) => b.categoryId === category.id) || null;
    return {
      category,
      ...getBudgetStatus(expenses, category.id, budget),
    };
  });

  // Calculate overall health score
  const healthScore = calculateBudgetHealthScore(
    budgetStatuses.filter((s) => s.budget !== null)
  );

  // Count categories with budgets
  const categoriesWithBudgets = budgetStatuses.filter((s) => s.budget !== null).length;
  const overBudgetCount = budgetStatuses.filter((s) => s.isOverBudget).length;
  const nearLimitCount = budgetStatuses.filter((s) => s.isNearLimit).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {t('title')}
            </CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </div>
          
          {categoriesWithBudgets > 0 && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">{t('healthLabel')}</div>
              <div
                className={`text-2xl font-bold ${
                  healthScore >= 75
                    ? 'text-green-600'
                    : healthScore >= 50
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {healthScore}%
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Stats Summary */}
        {categoriesWithBudgets > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{categoriesWithBudgets}</div>
              <div className="text-xs text-muted-foreground">{t('stats.budgetsSet')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{overBudgetCount}</div>
              <div className="text-xs text-muted-foreground">{t('stats.overBudget')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{nearLimitCount}</div>
              <div className="text-xs text-muted-foreground">{t('stats.nearLimit')}</div>
            </div>
          </div>
        )}

        {/* Budget Cards Grid */}
        {budgetStatuses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>{t('empty.title')}</p>
            <p className="text-sm">{t('empty.subtitle')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetStatuses.map((status) => (
              <BudgetProgressCard
                key={status.category.id}
                category={status.category}
                budget={status.budget}
                spent={status.spent}
                percentage={status.percentage}
                isOverBudget={status.isOverBudget}
                isNearLimit={status.isNearLimit}
              />
            ))}
          </div>
        )}

        {/* Help Text */}
        {categoriesWithBudgets === 0 && budgetStatuses.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {t('tip')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
