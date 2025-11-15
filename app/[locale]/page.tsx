'use client';

import { ExpenseTable } from '@/components/ExpenseTable';
import { MonthlySummary } from '@/components/MonthlySummary';
import { HydrationGuard } from '@/components/HydrationGuard';
import { BudgetOverview } from '@/components/BudgetOverview';
import { DebtList } from '@/components/DebtList';
import { ActionsMenu } from '@/components/ActionsMenu';

export default function Home() {
  return (
    <HydrationGuard>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Track and manage your finances
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
