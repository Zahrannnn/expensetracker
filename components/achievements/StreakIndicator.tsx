import React from 'react';
import { Flame } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useUserStats } from '@/lib/useExpenseStore';
import { isStreakBroken, isStreakActive } from '@/lib/streak-tracker';

interface StreakIndicatorProps {
  className?: string;
}

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({ className }) => {
  const t = useTranslations('streakIndicator');
  const stats = useUserStats();
  const isActive = isStreakActive(stats.lastActivityDate);
  const isBroken = isStreakBroken(stats.lastActivityDate);
  
  // Don't show if 0 streak and never started
  if (stats.currentStreak === 0 && stats.longestStreak === 0) {
    return null;
  }

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
      isActive 
        ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20" 
        : "bg-muted text-muted-foreground",
      className
    )}>
      <Flame 
        size={16} 
        className={cn(
          isActive && "fill-orange-500 text-orange-500 animate-pulse",
          !isActive && "text-muted-foreground"
        )} 
      />
      <span>{t('label', { count: stats.currentStreak })}</span>
    </div>
  );
};
