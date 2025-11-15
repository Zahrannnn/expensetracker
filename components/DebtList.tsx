'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDebts, useDebtActions } from '@/lib/useExpenseStore';
import { formatCurrency, formatDate } from '@/lib/helpers';
import { HandCoins, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ConfettiEffect } from './ConfettiEffect';
import { useState } from 'react';

export function DebtList() {
  const debts = useDebts();
  const { markDebtAsPaid, deleteDebt } = useDebtActions();
  const [showConfetti, setShowConfetti] = useState(false);

  const unpaidDebts = debts.filter(d => !d.isPaid);
  const paidDebts = debts.filter(d => d.isPaid);

  const handleMarkPaid = (id: string, creditor: string, amount: number) => {
    markDebtAsPaid(id);
    toast.success('Debt paid! 🎉', {
      description: `${creditor} - ${formatCurrency(amount)}`,
    });
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 100);
  };

  const handleDelete = (id: string) => {
    deleteDebt(id);
    toast.success('Debt record deleted');
  };

  if (debts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HandCoins className="h-5 w-5" />
            Debts & Loans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <HandCoins className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No debts recorded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <HandCoins className="h-5 w-5" />
              Debts & Loans
            </div>
            <span className="text-sm font-normal text-muted-foreground">
              {unpaidDebts.length} unpaid
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {unpaidDebts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Unpaid</h3>
              {unpaidDebts.map((debt) => (
                <motion.div
                  key={debt.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{debt.creditor}</span>
                      <span className="text-lg font-bold text-orange-600">
                        {formatCurrency(debt.amount)}
                      </span>
                    </div>
                    {debt.reason && (
                      <p className="text-sm text-muted-foreground">{debt.reason}</p>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Borrowed: {formatDate(debt.borrowedDate)}
                      {debt.dueDate && ` • Due: ${formatDate(debt.dueDate)}`}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleMarkPaid(debt.id, debt.creditor, debt.amount)}
                      className="h-8 w-8 text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(debt.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {paidDebts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Paid</h3>
              {paidDebts.map((debt) => (
                <motion.div
                  key={debt.id}
                  layout
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 opacity-60"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium line-through">{debt.creditor}</span>
                      <span className="text-lg font-bold line-through">
                        {formatCurrency(debt.amount)}
                      </span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    {debt.paidDate && (
                      <p className="text-xs text-muted-foreground">
                        Paid on {formatDate(debt.paidDate)}
                      </p>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(debt.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <ConfettiEffect trigger={showConfetti} type="achievement" />
    </>
  );
}

