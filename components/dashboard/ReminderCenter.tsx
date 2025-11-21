'use client';

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useBudgets,
  useCategories,
  useExpenses,
  useNotifiedReminders,
  useReminderActions,
  useReminderSettings,
  useSavingsGoals,
} from '@/lib/useExpenseStore';
import { getBudgetStatus } from '@/lib/budget-helpers';
import { getCategoryName } from '@/lib/category-helpers';
import {
  calculateSavingsProgress,
  calculateDaysRemaining,
} from '@/lib/savings-helpers';
import type { CategoryBudget } from '@/types/expense';

interface ReminderItem {
  id: string;
  title: string;
  message: string;
}

export function ReminderCenter() {
  const t = useTranslations('reminders');
  const expenses = useExpenses();
  const budgets = useBudgets();
  const categories = useCategories();
  const goals = useSavingsGoals();
  const { remindersEnabled, dismissedReminders } = useReminderSettings();
  const {
    dismissReminder,
    setRemindersEnabled,
    markReminderNotified,
    pruneNotifiedReminders,
  } = useReminderActions();
  const notified = useNotifiedReminders();

  const reminders = useMemo<ReminderItem[]>(() => {
    const monthReminders: ReminderItem[] = [];

    const statuses = budgets.map((budget: CategoryBudget) =>
      getBudgetStatus(expenses, budget.categoryId, budget)
    );

    statuses.forEach((status) => {
      if (!status.budget) return;
      const name = getCategoryName(categories, status.categoryId);
      if (status.isOverBudget) {
        monthReminders.push({
          id: `budget-over-${status.categoryId}`,
          title: t('budgetOverTitle', { category: name }),
          message: t('budgetOverDescription', {
            spent: status.percentage,
          }),
        });
      } else if (status.isNearLimit) {
        monthReminders.push({
          id: `budget-near-${status.categoryId}`,
          title: t('budgetNearTitle', { category: name }),
          message: t('budgetNearDescription', {
            remaining: Math.max(status.remaining, 0).toFixed(0),
          }),
        });
      }
    });

    goals.forEach((goal) => {
      if (goal.currentAmount >= goal.targetAmount) return;
      const progress = calculateSavingsProgress(
        goal.currentAmount,
        goal.targetAmount
      );
      const daysRemaining = calculateDaysRemaining(goal.deadline ?? undefined);
      if (
        daysRemaining !== null &&
        daysRemaining <= 30 &&
        progress < 90 &&
        goal.deadline
      ) {
        monthReminders.push({
          id: `goal-deadline-${goal.id}`,
          title: t('goalDeadlineTitle', { name: goal.name }),
          message: t('goalDeadlineDescription', {
            days: daysRemaining,
            progress,
          }),
        });
      } else if (progress < 50 && !goal.deadline) {
        monthReminders.push({
          id: `goal-progress-${goal.id}`,
          title: t('goalBehindTitle', { name: goal.name }),
          message: t('goalBehindDescription', { progress }),
        });
      }
    });

    return monthReminders;
  }, [budgets, categories, expenses, goals, t]);

  const activeReminders = reminders.filter(
    (item) => !dismissedReminders.includes(item.id)
  );

  useEffect(() => {
    pruneNotifiedReminders(reminders.map((r) => r.id));
  }, [reminders, pruneNotifiedReminders]);

  useEffect(() => {
    if (!remindersEnabled || typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [remindersEnabled]);

  useEffect(() => {
    if (!remindersEnabled || typeof window === 'undefined') return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    activeReminders.forEach((reminder) => {
      if (!notified.includes(reminder.id)) {
        new Notification(reminder.title, { body: reminder.message });
        markReminderNotified(reminder.id);
      }
    });
  }, [activeReminders, remindersEnabled, notified, markReminderNotified]);

  const notificationPermission =
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : null;

  if (!remindersEnabled || activeReminders.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            {t('title')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setRemindersEnabled(false)}
          className="text-xs"
        >
          {t('disable')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {notificationPermission === 'denied' && (
          <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-xs text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200">
            {t('notificationsDenied')}
          </div>
        )}
        {activeReminders.map((reminder) => (
          <div
            key={reminder.id}
            className="rounded-2xl border bg-muted/40 p-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div className="flex-1 space-y-1">
                <p className="font-semibold">{reminder.title}</p>
                <p className="text-sm text-muted-foreground">
                  {reminder.message}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 h-7"
                  onClick={() => dismissReminder(reminder.id)}
                >
                  {t('dismiss')}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

