'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Calendar, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DepositModal } from './DepositModal';
import { formatCurrency } from '@/lib/helpers';
import {
  calculateSavingsProgress,
  calculateDaysRemaining,
  calculateMonthlySavingsNeeded,
  getSavingsProgressColor,
  getSavingsProgressBarColor,
} from '@/lib/savings-helpers';
import { useSavingsActions } from '@/lib/useExpenseStore';
import type { SavingsGoal } from '@/types/expense';
import { toast } from 'sonner';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

export function SavingsGoalCard({ goal }: SavingsGoalCardProps) {
  const t = useTranslations('savingsCard');
  const tToast = useTranslations('toast');
  const { deleteSavingsGoal } = useSavingsActions();
  const [showDepositModal, setShowDepositModal] = useState(false);

  const IconComponent = LucideIcons[goal.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
  
  const progress = calculateSavingsProgress(goal.currentAmount, goal.targetAmount);
  const daysRemaining = calculateDaysRemaining(goal.deadline);
  const monthlyNeeded = calculateMonthlySavingsNeeded(goal.currentAmount, goal.targetAmount, goal.deadline);
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  const handleDelete = () => {
    if (
      confirm(
        t('confirmDelete', {
          name: goal.name,
        })
      )
    ) {
      deleteSavingsGoal(goal.id);
      toast.success(tToast('deleted'));
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`h-full flex flex-col ${isCompleted ? 'border-green-500 bg-green-50/30 dark:bg-green-900/10' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {IconComponent && (
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-xl shadow-sm"
                    style={{ backgroundColor: goal.color + '20', color: goal.color }}
                  >
                    <IconComponent className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg leading-none mb-1">{goal.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {t('target', { amount: formatCurrency(goal.targetAmount) })}
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <LucideIcons.MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDepositModal(true)}>
                    <Plus className="mr-2 h-4 w-4" /> {t('actions.deposit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" /> {t('actions.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="flex-1 pb-2">
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className={getSavingsProgressColor(progress)}>
                    {progress}%
                  </span>
                  <span>
                    {formatCurrency(goal.currentAmount)}
                  </span>
                </div>
                <Progress
                  value={progress}
                  className="h-2.5"
                  indicatorClassName={getSavingsProgressBarColor(progress)}
                />
              </div>

              {/* Stats */}
              {!isCompleted && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {goal.deadline && (
                    <div className="bg-muted/50 p-2 rounded">
                      <div className="text-muted-foreground mb-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {t('deadlineLabel')}
                      </div>
                      <div className="font-medium">
                        {t('deadlineValue', { days: daysRemaining })}
                      </div>
                    </div>
                  )}
                  
                  {monthlyNeeded !== null && monthlyNeeded > 0 && (
                    <div className="bg-muted/50 p-2 rounded">
                      <div className="text-muted-foreground mb-1">{t('monthlyLabel')}</div>
                      <div className="font-medium">
                        {formatCurrency(monthlyNeeded)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isCompleted && (
                <div className="flex items-center justify-center gap-2 text-green-600 bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">{t('completed')}</span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              className="w-full"
              variant={isCompleted ? 'outline' : 'default'}
              onClick={() => setShowDepositModal(true)}
            >
              {isCompleted ? t('actions.addExtra') : t('actions.depositPrimary')}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <DepositModal
        goal={goal}
        open={showDepositModal}
        onOpenChange={setShowDepositModal}
      />
    </>
  );
}
