import React from 'react';
import { Trophy, Flame, Target, Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStats, useAchievements } from '@/lib/useExpenseStore';

export const StatsWidget: React.FC = () => {
  const t = useTranslations('statsWidget');
  const stats = useUserStats();
  const achievements = useAchievements();
  
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalAchievements = achievements.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase">
              <Flame size={14} className="text-orange-500" />
              {t('currentStreak.label')}
            </div>
            <div className="text-2xl font-bold">
              {stats.currentStreak}{' '}
              <span className="text-sm font-normal text-muted-foreground">
                {t('currentStreak.unit')}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase">
              <Trophy size={14} className="text-yellow-500" />
              {t('achievements.label')}
            </div>
            <div className="text-2xl font-bold">
              {t('achievements.value', { unlocked: unlockedCount, total: totalAchievements })}
            </div>
          </div>
          
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase">
              <Target size={14} className="text-blue-500" />
              {t('goalsMet.label')}
            </div>
            <div className="text-2xl font-bold">{stats.goalsCompleted}</div>
          </div>

          <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase">
              <Activity size={14} className="text-green-500" />
              {t('totalLogged.label')}
            </div>
            <div className="text-2xl font-bold">{stats.totalExpenses}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
