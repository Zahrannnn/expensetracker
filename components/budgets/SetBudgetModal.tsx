'use client';

import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBudgetActions, useExpenses, useBudgets } from '@/lib/useExpenseStore';
import { calculateCategorySpending } from '@/lib/budget-helpers';
import { formatCurrency } from '@/lib/helpers';
import type { CustomCategory } from '@/types/expense';
import { toast } from 'sonner';

interface SetBudgetModalProps {
  category: CustomCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SetBudgetModal({ category, open, onOpenChange }: SetBudgetModalProps) {
  const t = useTranslations('budgetModal');
  const tActions = useTranslations('actions');
  const { setBudget } = useBudgetActions();
  const expenses = useExpenses();
  const budgets = useBudgets();
  
  const existingBudget = budgets.find((b) => b.categoryId === category.id);
  const currentSpending = calculateCategorySpending(expenses, category.id);
  
  const [monthlyLimit, setMonthlyLimit] = useState(
    existingBudget?.monthlyLimit.toString() || ''
  );
  const [alertThreshold, setAlertThreshold] = useState(
    existingBudget?.alertThreshold.toString() || '80'
  );
  const resetForm = () => {
    setMonthlyLimit(existingBudget?.monthlyLimit?.toString() || '');
    setAlertThreshold(existingBudget?.alertThreshold?.toString() || '80');
  };
  const handleDialogChange = (nextOpen: boolean) => {
    if (nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const limit = parseFloat(monthlyLimit);
    const threshold = parseFloat(alertThreshold);

    if (isNaN(limit) || limit <= 0) {
      toast.error(t('errors.invalidAmount'));
      return;
    }

    if (isNaN(threshold) || threshold < 0 || threshold > 100) {
      toast.error(t('errors.invalidThreshold'));
      return;
    }

    setBudget({
      categoryId: category.id,
      monthlyLimit: limit,
      alertThreshold: threshold,
    });

    toast.success(existingBudget ? t('toast.updated') : t('toast.created'), {
      description: t('toast.description', {
        category: category.name,
        amount: formatCurrency(limit),
      }),
    });

    handleDialogChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('title', { category: category.name })}
          </DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Spending Info */}
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm text-muted-foreground">{t('currentSpending')}</div>
            <div className="text-2xl font-bold">{formatCurrency(currentSpending)}</div>
          </div>

          {/* Monthly Limit */}
          <div className="space-y-2">
            <Label htmlFor="monthly-limit">
              {t('monthlyLimitLabel')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="monthly-limit"
              type="number"
              step="10"
              placeholder="0.00"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t('monthlyLimitHelper', { category: category.name })}
            </p>
          </div>

          {/* Alert Threshold */}
          <div className="space-y-2">
            <Label htmlFor="alert-threshold">
              {t('alertThresholdLabel')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="alert-threshold"
              type="number"
              min="0"
              max="100"
              placeholder="80"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t('alertThresholdHelper')}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
              {tActions('cancel')}
            </Button>
            <Button type="submit">
              {existingBudget ? t('updateButton') : t('setButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
