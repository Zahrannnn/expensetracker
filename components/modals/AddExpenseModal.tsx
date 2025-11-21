'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useExpenseActions, useCategories } from '@/lib/useExpenseStore';
import { toast } from 'sonner';
import { ConfettiEffect } from '@/components/shared/ConfettiEffect';

export function AddExpenseModal() {
  const { addExpense } = useExpenseActions();
  const categories = useCategories();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !categoryId) {
      toast.error('Please fill in required fields');
      return;
    }

    const selectedCategory = categories.find(cat => cat.id === categoryId);

    addExpense({
      amount: parseFloat(amount),
      categoryId,
      note: note.trim() || undefined,
      date: new Date(date).toISOString(),
    });

    toast.success('Expense added successfully!', {
      description: `${selectedCategory?.name || 'Unknown'} - $${parseFloat(amount).toFixed(2)}`,
    });

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);

    // Reset form and close modal
    setAmount('');
    setCategoryId('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Expense
              </DialogTitle>
              <DialogDescription>
                Track a new expense by filling in the details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modal-amount">Amount *</Label>
                  <Input
                    id="modal-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modal-date">Date *</Label>
                  <Input
                    id="modal-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modal-category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger id="modal-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => {
                      const IconComponent = LucideIcons[cat.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                      
                      return (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div className="flex items-center gap-2">
                            {IconComponent && (
                              <div
                                className="flex items-center justify-center h-5 w-5 rounded"
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
                <Label htmlFor="modal-note">Note (Optional)</Label>
                <Input
                  id="modal-note"
                  type="text"
                  placeholder="Add a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
      <ConfettiEffect trigger={showConfetti} type="success" />
    </>
  );
}

