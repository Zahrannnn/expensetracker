'use client';

import { HydrationGuard } from '@/components/HydrationGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIncomes, useIncomeActions } from '@/lib/useExpenseStore';
import { formatCurrency, formatDate } from '@/lib/helpers';
import { DollarSign, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ActionsMenu } from '@/components/ActionsMenu';
import { format } from 'date-fns';
import { useMemo } from 'react';

export default function IncomePage() {
  const incomes = useIncomes();
  const { deleteIncome } = useIncomeActions();

  const handleDelete = (id: string, source: string, amount: number) => {
    deleteIncome(id);
    toast.success('Income deleted', {
      description: `${source} - ${formatCurrency(amount)}`,
    });
  };

  // Group by month
  const groupedIncomes = useMemo(() => {
    const groups: Record<string, typeof incomes> = {};
    incomes.forEach((income) => {
      if (!groups[income.month]) {
        groups[income.month] = [];
      }
      groups[income.month].push(income);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [incomes]);

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  return (
    <HydrationGuard>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Income</h1>
            <p className="text-muted-foreground">
              Track your income sources
            </p>
          </div>
          <ActionsMenu />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Total Income: {formatCurrency(totalIncome)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incomes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg mb-2">No income recorded</p>
                <p className="text-sm">Start tracking your income to see insights</p>
              </div>
            ) : (
              <div className="space-y-8">
                {groupedIncomes.map(([month, monthIncomes]) => {
                  const monthTotal = monthIncomes.reduce((sum, i) => sum + i.amount, 0);
                  return (
                    <div key={month}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {format(new Date(month + '-01'), 'MMMM yyyy')}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          Total: {formatCurrency(monthTotal)}
                        </span>
                      </div>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Source</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                              <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <AnimatePresence>
                              {monthIncomes
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((income) => (
                                  <motion.tr
                                    key={income.id}
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="group"
                                  >
                                    <TableCell>{formatDate(income.date)}</TableCell>
                                    <TableCell className="font-medium">{income.source}</TableCell>
                                    <TableCell className="text-right font-semibold text-green-600">
                                      {formatCurrency(income.amount)}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDelete(income.id, income.source, income.amount)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </TableCell>
                                  </motion.tr>
                                ))}
                            </AnimatePresence>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </HydrationGuard>
  );
}

