/**
 * Custom hook for managing expense form state
 */

import { useState } from 'react';
import type { Expense } from '@/types/expense';
import { validateExpense, sanitizeNote, parseAmount } from '@/lib/validations';

interface UseExpenseFormProps {
  initialData?: Partial<Expense>;
  onSubmit: (data: Omit<Expense, 'id'>) => void;
  onCancel?: () => void;
}

export function useExpenseForm({
  initialData,
  onSubmit,
  onCancel,
}: UseExpenseFormProps) {
  const [amount, setAmount] = useState(
    initialData?.amount?.toString() || ''
  );
  const [category, setCategory] = useState(initialData?.category || '');
  const [note, setNote] = useState(initialData?.note || '');
  const [date, setDate] = useState(
    initialData?.date?.split('T')[0] || new Date().toISOString().split('T')[0]
  );
  const [errors, setErrors] = useState<string[]>([]);

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors([]);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const parsedAmount = parseAmount(amount);
    
    if (parsedAmount === null) {
      setErrors(['Invalid amount']);
      return false;
    }

    const expenseData = {
      amount: parsedAmount,
      category,
      note: sanitizeNote(note),
      date: new Date(date).toISOString(),
    };

    const validation = validateExpense(expenseData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }

    setErrors([]);
    onSubmit(expenseData);
    resetForm();
    return true;
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  const isDirty =
    amount !== (initialData?.amount?.toString() || '') ||
    category !== (initialData?.category || '') ||
    note !== (initialData?.note || '') ||
    date !== (initialData?.date?.split('T')[0] || new Date().toISOString().split('T')[0]);

  return {
    formData: { amount, category, note, date },
    setAmount,
    setCategory,
    setNote,
    setDate,
    errors,
    handleSubmit,
    handleCancel,
    resetForm,
    isDirty,
  };
}

