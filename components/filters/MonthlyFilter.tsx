'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, subMonths } from 'date-fns';

interface MonthlyFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function MonthlyFilter({ value, onChange }: MonthlyFilterProps) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy'),
    };
  });

  return (
    <Select value={value || 'all-months'} onValueChange={(val) => onChange(val === 'all-months' ? '' : val)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All months" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all-months">All months</SelectItem>
        {months.map((month) => (
          <SelectItem key={month.value} value={month.value}>
            {month.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

