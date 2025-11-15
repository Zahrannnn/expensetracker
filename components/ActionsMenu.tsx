'use client';

import { useState } from 'react';
import { Plus, DollarSign, HandCoins, Receipt } from 'lucide-react';
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
import { useExpenseActions, useIncomeActions, useDebtActions } from '@/lib/useExpenseStore';
import { CATEGORIES, INCOME_SOURCES } from '@/types/expense';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ConfettiEffect } from './ConfettiEffect';
import { motion } from 'framer-motion';

type ActionType = 'expense' | 'income' | 'debt' | null;

export function ActionsMenu() {
  const [openAction, setOpenAction] = useState<ActionType>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiType, setConfettiType] = useState<'success' | 'milestone' | 'achievement'>('success');

  const { addExpense } = useExpenseActions();
  const { addIncome } = useIncomeActions();
  const { addDebt } = useDebtActions();

  // Expense form state
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
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
    setExpenseCategory('');
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
    if (!expenseAmount || !expenseCategory) {
      toast.error('Please fill in all required fields');
      return;
    }

    addExpense({
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      note: expenseNote.trim() || undefined,
      date: new Date(expenseDate).toISOString(),
    });

    toast.success('Expense added successfully!', {
      description: `${expenseCategory} - $${parseFloat(expenseAmount).toFixed(2)}`,
    });

    triggerConfetti('success');
    resetExpenseForm();
    setOpenAction(null);
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeAmount || !incomeSource) {
      toast.error('Please fill in all required fields');
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

    toast.success('Income added! 💰', {
      description: `${incomeSource} - $${parsedAmount.toFixed(2)}`,
    });

    triggerConfetti('success');
    resetIncomeForm();
    setOpenAction(null);
  };

  const handleDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtAmount || !debtCreditor) {
      toast.error('Please fill in required fields');
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

    toast.info('Debt recorded', {
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
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Record Transaction</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenAction('expense')} className="gap-2 cursor-pointer">
            <Receipt className="h-4 w-4 text-red-600" />
            <div className="flex flex-col">
              <span className="font-medium">Add Expense</span>
              <span className="text-xs text-muted-foreground">Record a purchase or payment</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenAction('income')} className="gap-2 cursor-pointer">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div className="flex flex-col">
              <span className="font-medium">Add Income</span>
              <span className="text-xs text-muted-foreground">Record money received</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenAction('debt')} className="gap-2 cursor-pointer">
            <HandCoins className="h-4 w-4 text-orange-600" />
            <div className="flex flex-col">
              <span className="font-medium">Add Debt</span>
              <span className="text-xs text-muted-foreground">Record borrowed money</span>
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
              Add Expense
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount *</Label>
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
              <Label htmlFor="expense-category">Category *</Label>
              <Select value={expenseCategory} onValueChange={setExpenseCategory} required>
                <SelectTrigger id="expense-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-note">Note (Optional)</Label>
              <Input
                id="expense-note"
                type="text"
                placeholder="What was this for?"
                value={expenseNote}
                onChange={(e) => setExpenseNote(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense-date">Date *</Label>
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
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
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
              Add Income
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleIncomeSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income-amount">Amount *</Label>
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
              <Label htmlFor="income-source">Source *</Label>
              <Select value={incomeSource} onValueChange={setIncomeSource} required>
                <SelectTrigger id="income-source">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {INCOME_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="income-date">Date *</Label>
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
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Income
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
              Record Borrowed Money
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDebtSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="debt-amount">Amount *</Label>
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
              <Label htmlFor="debt-creditor">Borrowed From *</Label>
              <Input
                id="debt-creditor"
                type="text"
                placeholder="Person or institution"
                value={debtCreditor}
                onChange={(e) => setDebtCreditor(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="debt-reason">Reason (Optional)</Label>
              <Input
                id="debt-reason"
                type="text"
                placeholder="What was it for?"
                value={debtReason}
                onChange={(e) => setDebtReason(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="debt-borrowed-date">Borrowed Date *</Label>
                <Input
                  id="debt-borrowed-date"
                  type="date"
                  value={debtBorrowedDate}
                  onChange={(e) => setDebtBorrowedDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="debt-due-date">Due Date (Optional)</Label>
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
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Record Debt
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfettiEffect trigger={showConfetti} type={confettiType} />
    </>
  );
}

