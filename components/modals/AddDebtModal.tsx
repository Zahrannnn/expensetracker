'use client';

import { useState } from 'react';
import { HandCoins, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebtActions } from '@/lib/useExpenseStore';
import { toast } from 'sonner';

export function AddDebtModal() {
  const { addDebt } = useDebtActions();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [creditor, setCreditor] = useState('');
  const [reason, setReason] = useState('');
  const [borrowedDate, setBorrowedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !creditor) {
      toast.error('Please fill in required fields');
      return;
    }

    const parsedAmount = parseFloat(amount);
    
    addDebt({
      amount: parsedAmount,
      creditor,
      reason: reason.trim() || undefined,
      borrowedDate: new Date(borrowedDate).toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    });

    toast.info('Debt recorded', {
      description: `${creditor} - $${parsedAmount.toFixed(2)}`,
    });

    setAmount('');
    setCreditor('');
    setReason('');
    setBorrowedDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <HandCoins className="h-4 w-4" />
          Add Debt
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HandCoins className="h-5 w-5 text-orange-600" />
            Record Borrowed Money
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="debt-amount">Amount *</Label>
            <Input
              id="debt-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="debt-creditor">Borrowed From *</Label>
            <Input
              id="debt-creditor"
              type="text"
              placeholder="Person or institution"
              value={creditor}
              onChange={(e) => setCreditor(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="debt-reason">Reason (Optional)</Label>
            <Input
              id="debt-reason"
              type="text"
              placeholder="What was it for?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="debt-borrowed-date">Borrowed Date *</Label>
              <Input
                id="debt-borrowed-date"
                type="date"
                value={borrowedDate}
                onChange={(e) => setBorrowedDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="debt-due-date">Due Date (Optional)</Label>
              <Input
                id="debt-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
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
  );
}

