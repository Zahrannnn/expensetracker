'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSavingsActions, useSavingsGoals } from '@/lib/useExpenseStore';
import { formatCurrency } from '@/lib/helpers';
import { ConfettiEffect } from '@/components/shared/ConfettiEffect';
import type { SavingsGoal } from '@/types/expense';
import { toast } from 'sonner';

interface DepositModalProps {
  goal: SavingsGoal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositModal({ goal, open, onOpenChange }: DepositModalProps) {
  const t = useTranslations('depositModal');
  const tActions = useTranslations('actions');
  const { contributeToSavings } = useSavingsActions();
  const goals = useSavingsGoals();
  const otherGoals = useMemo(() => goals.filter((g) => g.id !== goal.id), [goals, goal.id]);
  const [amount, setAmount] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [overflowStep, setOverflowStep] = useState<{ depositAmount: number; overflowAmount: number } | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(otherGoals[0]?.id ?? null);

  useEffect(() => {
    if (overflowStep) {
      setSelectedGoalId(otherGoals[0]?.id ?? null);
    }
  }, [overflowStep, otherGoals]);

  useEffect(() => {
    if (!open) {
      setOverflowStep(null);
      setSelectedGoalId(null);
      setAmount('');
      setShowConfetti(false);
    }
  }, [open]);

  const finalizeDeposit = (totalAmount: number, moveOverflowTo?: string | null) => {
    const currentGoalState = goals.find((g) => g.id === goal.id) ?? goal;
    const amountNeeded = Math.max(currentGoalState.targetAmount - currentGoalState.currentAmount, 0);

    let amountForCurrent = totalAmount;
    if (moveOverflowTo) {
      amountForCurrent = Math.min(amountNeeded, totalAmount);
    }

    if (amountForCurrent > 0) {
      contributeToSavings(goal.id, amountForCurrent);
    }

    const remainder = totalAmount - amountForCurrent;
    if (remainder > 0 && moveOverflowTo) {
      contributeToSavings(moveOverflowTo, remainder);
    }

    const reachedGoal =
      amountForCurrent > 0 &&
      currentGoalState.currentAmount < currentGoalState.targetAmount &&
      currentGoalState.currentAmount + amountForCurrent >= currentGoalState.targetAmount;

    const closeModal = () => {
      setAmount('');
      setOverflowStep(null);
      setSelectedGoalId(null);
      onOpenChange(false);
    };

    if (reachedGoal || (moveOverflowTo && remainder > 0)) {
      const otherGoalName = moveOverflowTo
        ? goals.find((g) => g.id === moveOverflowTo)?.name ?? ''
        : '';
      const description =
        moveOverflowTo && remainder > 0
          ? t('toast.overflowMovedDescription', {
              remainder: formatCurrency(remainder),
              other: otherGoalName,
            })
          : undefined;
      toast.success(
        reachedGoal ? t('toast.goalReached') : t('toast.overflowMovedTitle'),
        {
          description,
          duration: reachedGoal ? 5000 : undefined,
        }
      );
    } else {
      toast.success(
        t('toast.deposited', {
          amount: formatCurrency(totalAmount),
          name: goal.name,
        })
      );
    }

    if (reachedGoal) {
      setShowConfetti(true);

      setTimeout(() => {
        setShowConfetti(false);
        closeModal();
      }, 3000);
    } else {
      closeModal();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error(t('errors.invalidAmount'));
      return;
    }

    const newTotal = goal.currentAmount + depositAmount;
    const overflowAmount = Math.max(newTotal - goal.targetAmount, 0);

    if (overflowAmount > 0 && otherGoals.length > 0) {
      setOverflowStep({ depositAmount, overflowAmount });
      return;
    }

    finalizeDeposit(depositAmount);
  };

  const handleKeepOverflow = () => {
    if (!overflowStep) return;
    finalizeDeposit(overflowStep.depositAmount);
  };

  const handleMoveOverflow = () => {
    if (!overflowStep || !selectedGoalId) return;
    finalizeDeposit(overflowStep.depositAmount, selectedGoalId);
  };

  return (
    <>
      <ConfettiEffect trigger={showConfetti} />
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {overflowStep
                ? t('overflow.title', { amount: formatCurrency(overflowStep.overflowAmount) })
                : t('title', { name: goal.name })}
            </DialogTitle>
            <DialogDescription>
              {overflowStep
                ? t('overflow.description', { name: goal.name })
                : t('description', {
                    current: formatCurrency(goal.currentAmount),
                    target: formatCurrency(goal.targetAmount),
                  })}
            </DialogDescription>
          </DialogHeader>

          {overflowStep ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('overflow.selectLabel')}</Label>
                <Select
                  value={selectedGoalId ?? ''}
                  onValueChange={(value) => setSelectedGoalId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('overflow.selectPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {otherGoals.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name} — {formatCurrency(g.currentAmount)} / {formatCurrency(g.targetAmount)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => setOverflowStep(null)}>
                  {t('overflow.editAmount')}
                </Button>
                <Button variant="outline" onClick={handleKeepOverflow}>
                  {t('overflow.keepHere')}
                </Button>
                <Button onClick={handleMoveOverflow} disabled={!selectedGoalId}>
                  {t('overflow.moveAction')}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">{t('fields.amount')}</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {tActions('cancel')}
                </Button>
                <Button type="submit">{t('primaryButton')}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
