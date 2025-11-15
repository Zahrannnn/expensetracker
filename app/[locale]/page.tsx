'use client';

import { useTranslations } from 'next-intl';
import { ExpenseTable } from '@/components/expenses/ExpenseTable';
import { MonthlySummary } from '@/components/dashboard/MonthlySummary';
import { HydrationGuard } from '@/components/shared/HydrationGuard';
import { BudgetOverview } from '@/components/dashboard/BudgetOverview';
import { DebtList } from '@/components/dashboard/DebtList';
import { ActionsMenu } from '@/components/dashboard/ActionsMenu';

export default function Home() {
  const t = useTranslations('dashboard');
  
  return (
    <HydrationGuard>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          <ActionsMenu />
        </div>

        <BudgetOverview />
        <MonthlySummary />
        <DebtList />
        <ExpenseTable />
      </div>
    </HydrationGuard>
  );
}
