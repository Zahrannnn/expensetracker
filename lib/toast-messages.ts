

import { toast } from 'sonner';
import { formatCurrency } from './helpers';

export const toastMessages = {
  expense: {
    added: (category: string, amount: number) => {
      toast.success('Expense added successfully!', {
        description: `${category} - ${formatCurrency(amount)}`,
      });
    },
    
    updated: () => {
      toast.success('Expense updated successfully!');
    },
    
    deleted: (category: string, amount: number) => {
      toast.success('Expense deleted', {
        description: `${category} - ${formatCurrency(amount)}`,
      });
    },
    
    validationError: (errors: string[]) => {
      toast.error('Validation Error', {
        description: errors[0] || 'Please check your input',
      });
    },
  },

  export: {
    json: (count: number) => {
      toast.success('Exported to JSON', {
        description: `${count} expense${count !== 1 ? 's' : ''} exported`,
      });
    },
    
    csv: (count: number) => {
      toast.success('Exported to CSV', {
        description: `${count} expense${count !== 1 ? 's' : ''} exported`,
      });
    },
  },

  settings: {
    cleared: (count: number) => {
      toast.success('All expenses cleared', {
        description: `Deleted ${count} expense${count !== 1 ? 's' : ''}`,
      });
    },
  },

  error: {
    generic: (message?: string) => {
      toast.error('Something went wrong', {
        description: message || 'Please try again',
      });
    },
  },
};

