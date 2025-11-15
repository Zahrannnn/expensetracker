'use client';

import { useState } from 'react';
import { DollarSign, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIncomeActions } from '@/lib/useExpenseStore';
import { INCOME_SOURCES } from '@/types/expense';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ConfettiEffect } from './ConfettiEffect';

export function AddIncomeModal() {
  const { addIncome } = useIncomeActions();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !source) {
      toast.error('Please fill in all fields');
      return;
    }

    const incomeDate = new Date(date);
    const parsedAmount = parseFloat(amount);
    
    addIncome({
      amount: parsedAmount,
      source,
      date: incomeDate.toISOString(),
      month: format(incomeDate, 'yyyy-MM'),
    });

    toast.success('Income added! 💰', {
      description: `${source} - $${parsedAmount.toFixed(2)}`,
    });

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);

    setAmount('');
    setSource('');
    setDate(new Date().toISOString().split('T')[0]);
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Add Income
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Add Income
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income-amount">Amount</Label>
              <Input
                id="income-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="income-source">Source</Label>
              <Select value={source} onValueChange={setSource} required>
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
              <Label htmlFor="income-date">Date</Label>
              <Input
                id="income-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
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
      <ConfettiEffect trigger={showConfetti} type="success" />
    </>
  );
}

