'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Trophy, Lock, Unlock } from 'lucide-react';
import { useAchievements } from '@/lib/useExpenseStore';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { StatsWidget } from '@/components/dashboard/StatsWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AchievementsPage() {
  const t = useTranslations('achievementsPage');
  const achievements = useAchievements();

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <StatsWidget />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">{t('tabs.all')}</TabsTrigger>
          <TabsTrigger value="unlocked" className="gap-2">
            <Unlock size={14} />
            {t('tabs.unlocked', { count: unlockedAchievements.length })}
          </TabsTrigger>
          <TabsTrigger value="locked" className="gap-2">
            <Lock size={14} />
            {t('tabs.locked', { count: lockedAchievements.length })}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="unlocked" className="mt-4">
          {unlockedAchievements.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {unlockedAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>{t('emptyUnlocked')}</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="locked" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lockedAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
