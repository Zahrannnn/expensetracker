'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { SetBudgetModal } from './SetBudgetModal';
import { formatCurrency } from '@/lib/helpers';
import { getBudgetColor } from '@/lib/budget-helpers';
import type { CustomCategory, CategoryBudget } from '@/types/expense';

interface BudgetProgressCardProps {
  category: CustomCategory;
  budget: CategoryBudget | null;
  spent: number;
  percentage: number;
  isOverBudget: boolean;
  isNearLimit: boolean;
}

export function BudgetProgressCard({
  category,
  budget,
  spent,
  percentage,
  isOverBudget,
  isNearLimit,
}: BudgetProgressCardProps) {
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const t = useTranslations('budgetCard');
  
  const IconComponent = LucideIcons[category.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
  const remaining = budget ? budget.monthlyLimit - spent : 0;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            isOverBudget ? 'border-red-500' : isNearLimit ? 'border-yellow-500' : ''
          }`}
          onClick={() => setShowBudgetModal(true)}
        >
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {IconComponent && (
                  <div
                    className="flex items-center justify-center h-10 w-10 rounded-lg"
                    style={{ backgroundColor: category.color + '20', color: category.color }}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{category.name}</h3>
                  {budget && (
                    <p className="text-xs text-muted-foreground">
                      {t('perMonth', { amount: formatCurrency(budget.monthlyLimit) })}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Icon */}
              {isOverBudget && (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              )}
              {isNearLimit && !isOverBudget && (
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              )}
            </div>

            {budget ? (
              <>
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress
                    value={Math.min(percentage, 100)}
                    className="h-2"
                    indicatorClassName={
                      isOverBudget
                        ? 'bg-red-600'
                        : isNearLimit
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }
                  />

                  {/* Stats */}
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">{t('spentLabel')} </span>
                      <span className={`font-semibold ${getBudgetColor(percentage, isOverBudget)}`}>
                        {formatCurrency(spent)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {isOverBudget ? `${t('overLabel')} ` : `${t('leftLabel')} `}
                      </span>
                      <span className={`font-semibold ${getBudgetColor(percentage, isOverBudget)}`}>
                        {formatCurrency(Math.abs(remaining))}
                      </span>
                    </div>
                  </div>

                  {/* Percentage */}
                  <div className="text-center">
                    <span className={`text-lg font-bold ${getBudgetColor(percentage, isOverBudget)}`}>
                      {percentage}%
                    </span>
                    {isOverBudget && (
                      <span className="ml-2 text-xs text-red-600 font-medium">
                        {t('overBudgetAlert')}
                      </span>
                    )}
                    {isNearLimit && !isOverBudget && (
                      <span className="ml-2 text-xs text-yellow-600 font-medium">
                        {t('nearLimitAlert')}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground mb-2">{t('noBudget')}</p>
                <p className="text-xs text-muted-foreground">
                  {t('spentThisMonth')} {formatCurrency(spent)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBudgetModal(true);
                  }}
                >
                  {t('setBudget')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <SetBudgetModal
        category={category}
        open={showBudgetModal}
        onOpenChange={setShowBudgetModal}
      />
    </>
  );
}
