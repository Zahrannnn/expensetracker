'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, PiggyBank, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SavingsGoalCard } from '@/components/savings/SavingsGoalCard';
import { AddSavingsModal } from '@/components/savings/AddSavingsModal';
import { useSavingsGoals } from '@/lib/useExpenseStore';
import { formatCurrency } from '@/lib/helpers';
import { HydrationGuard } from '@/components/shared/HydrationGuard';

export default function SavingsPage() {
  const t = useTranslations('savingsPage');
  const goals = useSavingsGoals();
  const [showAddModal, setShowAddModal] = useState(false);

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <HydrationGuard>
      <div className="space-y-6 pb-20 md:pb-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> {t('newGoal')}
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('stats.totalSaved')}</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSaved)}</div>
              <p className="text-xs text-muted-foreground">
                {t('stats.totalSavedHelper', { count: goals.length })}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('stats.totalTarget')}</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalTarget)}</div>
              <p className="text-xs text-muted-foreground">
                {t('stats.totalTargetHelper')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('stats.overallProgress')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <div className="h-2 w-full bg-secondary mt-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
            <div className="bg-background p-4 rounded-full inline-flex mb-4 shadow-sm">
              <PiggyBank className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('empty.title')}</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              {t('empty.subtitle')}
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              {t('empty.cta')}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}

        <AddSavingsModal open={showAddModal} onOpenChange={setShowAddModal} />
      </div>
    </HydrationGuard>
  );
}
