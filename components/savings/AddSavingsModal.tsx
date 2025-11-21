'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PiggyBank, Calendar } from 'lucide-react';
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
import { CategoryIconPicker } from '@/components/forms/CategoryIconPicker';
import { CategoryColorPicker } from '@/components/forms/CategoryColorPicker';
import { useSavingsActions } from '@/lib/useExpenseStore';
import { toast } from 'sonner';

interface AddSavingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSavingsModal({ open, onOpenChange }: AddSavingsModalProps) {
  const t = useTranslations('savingsModal');
  const tActions = useTranslations('actions');
  const { addSavingsGoal } = useSavingsActions();
  
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('PiggyBank');
  const [color, setColor] = useState('#10B981'); // Default emerald green

  const resetForm = () => {
    setName('');
    setTargetAmount('');
    setInitialAmount('');
    setDeadline('');
    setIcon('PiggyBank');
    setColor('#10B981');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(t('errors.missingName'));
      return;
    }

    const target = parseFloat(targetAmount);
    if (isNaN(target) || target <= 0) {
      toast.error(t('errors.invalidTarget'));
      return;
    }

    const initial = parseFloat(initialAmount);
    if (initialAmount && (isNaN(initial) || initial < 0)) {
      toast.error(t('errors.invalidInitial'));
      return;
    }

    addSavingsGoal({
      name: name.trim(),
      targetAmount: target,
      currentAmount: initial || 0,
      deadline: deadline || undefined,
      icon,
      color,
    });

    toast.success(t('toast.created'));
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="goal-name">
              {t('fields.name')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="goal-name"
              placeholder={t('fields.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-amount">
                {t('fields.target')} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="target-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initial-amount">{t('fields.initial')}</Label>
              <Input
                id="initial-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">{t('fields.deadline')}</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="deadline"
                type="date"
                className="pl-9"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Icon & Color */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('fields.icon')}</Label>
              <CategoryIconPicker value={icon} onChange={setIcon} />
            </div>
            
            <div className="space-y-2">
              <Label>{t('fields.color')}</Label>
              <CategoryColorPicker value={color} onChange={setColor} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {tActions('cancel')}
            </Button>
            <Button type="submit">{t('primaryButton')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
