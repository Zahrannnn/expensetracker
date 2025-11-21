'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, DollarSign, HandCoins, Receipt } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExpenseActions, useIncomeActions, useDebtActions, useCategories } from '@/lib/useExpenseStore';
import { INCOME_SOURCES } from '@/types/expense';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ConfettiEffect } from '@/components/shared/ConfettiEffect';
import { motion } from 'framer-motion';

type ActionType = 'expense' | 'income' | 'debt' | null;

export function ActionsMenu() {
  const t = useTranslations('actions');
  const tExpense = useTranslations('expense');
  const tIncome = useTranslations('income');
  const tDebt = useTranslations('debt');
  const tToast = useTranslations('toast');
  
  const [openAction, setOpenAction] = useState<ActionType>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiType, setConfettiType] = useState<'success' | 'milestone' | 'achievement'>('success');

  const { addExpense } = useExpenseActions();
  const { addIncome } = useIncomeActions();
  const { addDebt } = useDebtActions();
  const categories = useCategories();

  // Expense form state
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategoryId, setExpenseCategoryId] = useState('');
  const [expenseNote, setExpenseNote] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  // Income form state
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeSource, setIncomeSource] = useState('');
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split('T')[0]);

  // Debt form state
  const [debtAmount, setDebtAmount] = useState('');
  const [debtCreditor, setDebtCreditor] = useState('');
  const [debtReason, setDebtReason] = useState('');
  const [debtBorrowedDate, setDebtBorrowedDate] = useState(new Date().toISOString().split('T')[0]);
  const [debtDueDate, setDebtDueDate] = useState('');

  const triggerConfetti = (type: 'success' | 'milestone' | 'achievement' = 'success') => {
    setConfettiType(type);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  };

  const resetExpenseForm = () => {
    setExpenseAmount('');
    setExpenseCategoryId('');
    setExpenseNote('');
    setExpenseDate(new Date().toISOString().split('T')[0]);
  };

  const resetIncomeForm = () => {
    setIncomeAmount('');
    setIncomeSource('');
    setIncomeDate(new Date().toISOString().split('T')[0]);
  };

  const resetDebtForm = () => {
    setDebtAmount('');
    setDebtCreditor('');
    setDebtReason('');
    setDebtBorrowedDate(new Date().toISOString().split('T')[0]);
    setDebtDueDate('');
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount || !expenseCategoryId) {
      toast.error(tToast('fillRequired'));
      return;
    }

    const selectedCategory = categories.find(cat => cat.id === expenseCategoryId);

    addExpense({
      amount: parseFloat(expenseAmount),
      categoryId: expenseCategoryId,
      note: expenseNote.trim() || undefined,
      date: new Date(expenseDate).toISOString(),
    });

    toast.success(tToast('expenseAdded'), {
      description: `${selectedCategory?.name || 'Unknown'} - $${parseFloat(expenseAmount).toFixed(2)}`,
    });

    triggerConfetti('success');
    resetExpenseForm();
    setOpenAction(null);
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeAmount || !incomeSource) {
      toast.error(tToast('fillRequired'));
      return;
    }

    const incomeDateObj = new Date(incomeDate);
    const parsedAmount = parseFloat(incomeAmount);

    addIncome({
      amount: parsedAmount,
      source: incomeSource,
      date: incomeDateObj.toISOString(),
      month: format(incomeDateObj, 'yyyy-MM'),
    });

    toast.success(tToast('incomeAdded'), {
      description: `${incomeSource} - $${parsedAmount.toFixed(2)}`,
    });

    triggerConfetti('success');
    resetIncomeForm();
    setOpenAction(null);
  };

  const handleDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtAmount || !debtCreditor) {
      toast.error(tToast('fillRequired'));
      return;
    }

    const parsedAmount = parseFloat(debtAmount);

    addDebt({
      amount: parsedAmount,
      creditor: debtCreditor,
      reason: debtReason.trim() || undefined,
      borrowedDate: new Date(debtBorrowedDate).toISOString(),
      dueDate: debtDueDate ? new Date(debtDueDate).toISOString() : undefined,
    });

    toast.info(tToast('debtRecorded'), {
      description: `${debtCreditor} - $${parsedAmount.toFixed(2)}`,
    });

    resetDebtForm();
    setOpenAction(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="gap-2 shadow-lg">
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">{t('addTransaction')}</span>
            <span className="sm:hidden">{t('add')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t('recordTransaction')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenAction('expense')} className="gap-2 cursor-pointer">
            <Receipt className="h-4 w-4 text-red-600" />
            <div className="flex flex-col">
              <span className="font-medium">{t('addExpense')}</span>
              <span className="text-xs text-muted-foreground">{tExpense('recordPurchase')}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenAction('income')} className="gap-2 cursor-pointer">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div className="flex flex-col">
              <span className="font-medium">{t('addIncome')}</span>
              <span className="text-xs text-muted-foreground">{tIncome('recordMoneyReceived')}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenAction('debt')} className="gap-2 cursor-pointer">
            <HandCoins className="h-4 w-4 text-orange-600" />
            <div className="flex flex-col">
              <span className="font-medium">{t('addDebt')}</span>
              <span className="text-xs text-muted-foreground">{tDebt('recordBorrowedMoney')}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Expense Dialog */}
      <Dialog open={openAction === 'expense'} onOpenChange={(open) => !open && setOpenAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-red-600" />
              {t('addExpense')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">{tExpense('amount')} *</Label>
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-category">{tExpense('category')} *</Label>
              <Select value={expenseCategoryId} onValueChange={setExpenseCategoryId} required>
                <SelectTrigger id="expense-category">
                  <SelectValue placeholder={tExpense('selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => {
                    const IconComponent = LucideIcons[cat.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                    return (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          {IconComponent && (
                            <div
                              className="flex items-center justify-center h-4 w-4 rounded"
                              style={{ backgroundColor: cat.color + '20', color: cat.color }}
                            >
                              <IconComponent className="h-3 w-3" />
                            </div>
                          )}
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-note">{tExpense('note')} {tExpense('optional')}</Label>
              <Input
                id="expense-note"
                type="text"
                placeholder={tExpense('whatWasThisFor')}
                value={expenseNote}
                onChange={(e) => setExpenseNote(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-date">{tExpense('date')} *</Label>
              <Input
                id="expense-date"
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpenAction(null)} className="flex-1">
                {t('cancel')}
              </Button>
              <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('addExpense')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Income Dialog */}
      <Dialog open={openAction === 'income'} onOpenChange={(open) => !open && setOpenAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              {t('addIncome')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleIncomeSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income-amount">{tIncome('amount')} *</Label>
              <Input
                id="income-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="income-source">{tIncome('source')} *</Label>
              <Select value={incomeSource} onValueChange={setIncomeSource} required>
                <SelectTrigger id="income-source">
                  <SelectValue placeholder={tIncome('selectSource')} />
                </SelectTrigger>
                <SelectContent>
                  {INCOME_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>{tIncome(`sources.${s}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="income-date">{tIncome('date')} *</Label>
              <Input
                id="income-date"
                type="date"
                value={incomeDate}
                onChange={(e) => setIncomeDate(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpenAction(null)} className="flex-1">
                {t('cancel')}
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('addIncome')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Debt Dialog */}
      <Dialog open={openAction === 'debt'} onOpenChange={(open) => !open && setOpenAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HandCoins className="h-5 w-5 text-orange-600" />
              {tDebt('addDebt')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDebtSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="debt-amount">{tDebt('amount')} *</Label>
              <Input
                id="debt-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={debtAmount}
                onChange={(e) => setDebtAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="debt-creditor">{tDebt('borrowedFrom')} *</Label>
              <Input
                id="debt-creditor"
                type="text"
                placeholder={tDebt('personOrInstitution')}
                value={debtCreditor}
                onChange={(e) => setDebtCreditor(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="debt-reason">{tDebt('reason')} {tDebt('optional')}</Label>
              <Input
                id="debt-reason"
                type="text"
                placeholder={tDebt('whatWasItFor')}
                value={debtReason}
                onChange={(e) => setDebtReason(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="debt-borrowed-date">{tDebt('borrowedDate')} *</Label>
                <Input
                  id="debt-borrowed-date"
                  type="date"
                  value={debtBorrowedDate}
                  onChange={(e) => setDebtBorrowedDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="debt-due-date">{tDebt('dueDate')} {tDebt('optional')}</Label>
                <Input
                  id="debt-due-date"
                  type="date"
                  value={debtDueDate}
                  onChange={(e) => setDebtDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpenAction(null)} className="flex-1">
                {t('cancel')}
              </Button>
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('recordDebt')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfettiEffect trigger={showConfetti} type={confettiType} />
    </>
  );
}

