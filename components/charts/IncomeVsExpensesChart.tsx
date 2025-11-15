'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExpenses, useIncomes } from '@/lib/useExpenseStore';
import { getExpensesByMonth } from '@/lib/helpers';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/helpers';
import { format } from 'date-fns';

export function IncomeVsExpensesChart() {
  const expenses = useExpenses();
  const incomes = useIncomes();

  const chartData = useMemo(() => {
    // Convert expenses to yyyy-MM format for consistency
    const expensesByMonth = expenses.reduce((acc, expense) => {
      const month = format(new Date(expense.date), 'yyyy-MM');
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    // Incomes already use yyyy-MM format
    const incomesByMonth = incomes.reduce((acc, income) => {
      if (!acc[income.month]) {
        acc[income.month] = 0;
      }
      acc[income.month] += income.amount;
      return acc;
    }, {} as Record<string, number>);

    const allMonths = new Set([
      ...Object.keys(expensesByMonth),
      ...Object.keys(incomesByMonth),
    ]);

    const data = Array.from(allMonths)
      .sort()
      .map((month) => ({
        month: format(new Date(month + '-01'), 'MMM yyyy'),
        expenses: expensesByMonth[month] || 0,
        income: incomesByMonth[month] || 0,
        savings: (incomesByMonth[month] || 0) - (expensesByMonth[month] || 0),
      }))
      .slice(-6); // Last 6 months

    return data;
  }, [expenses, incomes]);

  const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
  const netSavings = totalIncome - totalExpenses;

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <p>No data available yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Income vs Expenses</span>
          <div className="flex items-center gap-4 text-sm overflow-x-auto">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-red-600">{formatCurrency(totalExpenses)}</span>
            </div>
          
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
            <CartesianGrid className='text-white' strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'currentColor' }}
              stroke="hsl(var(--border))"
              className="text-muted-foreground"
            />
            <YAxis 
              tick={{ fill: 'currentColor' }}
              stroke="hsl(var(--border))"
              className="text-muted-foreground"
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                
              }}
            />
            <Legend />
            <Bar 
              dataKey="income" 
              fill="#10b981" 
              name="Income" 
              radius={[8, 8, 0, 0]}
              barSize={60}
            />
            <Bar 
              dataKey="expenses" 
              fill="#ef4444" 
              name="Expenses" 
              radius={[8, 8, 0, 0]}
              barSize={60}
            />
            <Line 
              type="monotone" 
              dataKey="savings" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 5 }}
              activeDot={{ r: 7 }}
              name="Net Savings"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

