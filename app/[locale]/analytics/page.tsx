'use client';

import { PieChartComponent } from '@/components/charts/PieChartComponent';
import { LineChartComponent } from '@/components/charts/LineChartComponent';
import { IncomeVsExpensesChart } from '@/components/charts/IncomeVsExpensesChart';
import { HydrationGuard } from '@/components/HydrationGuard';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <HydrationGuard>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Visualize your spending patterns and financial health
          </p>
        </div>

        <IncomeVsExpensesChart />

        <div className="grid gap-6 md:grid-cols-2">
          <PieChartComponent />
          <LineChartComponent />
        </div>
      </div>
    </HydrationGuard>
  );
}

