'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { useExpenseActions } from '@/lib/useExpenseStore';
import { formatCurrency, formatDate } from '@/lib/helpers';
import type { Expense } from '@/types/expense';
import { CATEGORIES } from '@/types/expense';
import { toast } from 'sonner';

interface ExpenseRowProps {
  expense: Expense;
}

export function ExpenseRow({ expense }: ExpenseRowProps) {
  const { updateExpense, deleteExpense } = useExpenseActions();
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(expense.amount.toString());
  const [editCategory, setEditCategory] = useState(expense.category);
  const [editNote, setEditNote] = useState(expense.note || '');
  const [editDate, setEditDate] = useState(
    expense.date.split('T')[0]
  );

  const handleSave = () => {
    updateExpense(expense.id, {
      amount: parseFloat(editAmount),
      category: editCategory,
      note: editNote.trim() || undefined,
      date: new Date(editDate).toISOString(),
    });
    toast.success('Expense updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditAmount(expense.amount.toString());
    setEditCategory(expense.category);
    setEditNote(expense.note || '');
    setEditDate(expense.date.split('T')[0]);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteExpense(expense.id);
    toast.success('Expense deleted', {
      description: `${expense.category} - ${formatCurrency(expense.amount)}`,
    });
  };

  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Select value={editCategory} onValueChange={setEditCategory}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            type="text"
            value={editNote}
            onChange={(e) => setEditNote(e.target.value)}
            placeholder="Note..."
            className="w-full"
          />
        </TableCell>
        <TableCell>
          <Input
            type="number"
            step="0.01"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
            className="w-full text-right"
          />
        </TableCell>
        <TableCell className="text-right">
          <div className="flex gap-1 justify-end">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
              className="h-8 w-8 text-green-600 hover:text-green-700"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCancel}
              className="h-8 w-8 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      className="border-b transition-colors hover:bg-muted/50"
    >
      <TableCell>{formatDate(expense.date)}</TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
          {expense.category}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {expense.note || '-'}
      </TableCell>
      <TableCell className="text-right font-medium">
        {formatCurrency(expense.amount)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-1 justify-end">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </TableCell>
    </motion.tr>
  );
}

