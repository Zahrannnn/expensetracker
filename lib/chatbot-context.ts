import type { Achievement } from '@/types/achievements';
import type { CustomCategory, Expense, SavingsGoal } from '@/types/expense';
import { formatDate, formatCurrency } from '@/lib/helpers';
import { getCategoryName } from '@/lib/category-helpers';

interface ChatbotContextInput {
  botName: string;
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  achievements: Achievement[];
  categories: CustomCategory[];
}

const MAX_ITEMS = 5;

export function buildChatbotContext({
  botName,
  expenses,
  savingsGoals,
  achievements,
  categories,
}: ChatbotContextInput): string {
  const recentExpenses = expenses
    .slice(0, MAX_ITEMS)
    .map(
      (expense) =>
        `- ${formatDate(expense.date)} • ${formatCurrency(expense.amount)} • ${getCategoryName(
          categories,
          expense.categoryId
        )}${expense.note ? ` • Note: ${expense.note}` : ''}`
    )
    .join('\n');

  const goalSummaries = savingsGoals
    .map((goal) => {
      const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
      return `- ${goal.name}: ${formatCurrency(goal.currentAmount)} / ${formatCurrency(
        goal.targetAmount
      )} (${progress}%)`;
    })
    .slice(0, MAX_ITEMS)
    .join('\n');

  const unlocked = achievements
    .filter((ach) => ach.isUnlocked)
    .slice(0, MAX_ITEMS)
    .map((ach) => `- ${ach.title} (${ach.category})`)
    .join('\n');

  return `You are ${botName}, a friendly personal finance companion.

Recent expenses:
${recentExpenses || 'No expenses recorded yet.'}

Savings goals:
${goalSummaries || 'No savings goals created yet.'}

Unlocked achievements:
${unlocked || 'No achievements unlocked yet.'}`;
}

