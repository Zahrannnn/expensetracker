import React from 'react';
import { motion } from 'framer-motion';
import { icons } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Achievement } from '@/types/achievements';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ConfettiEffect } from '@/components/shared/ConfettiEffect';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const t = useTranslations('achievementCard');
  const tDefinition = useTranslations('achievementDefinitions');
  const Icon = icons[achievement.icon as keyof typeof icons] || icons.Trophy;
  const isUnlocked = achievement.isUnlocked;
  const progressPercent = Math.min(100, (achievement.progress / achievement.target) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isUnlocked ? [1, 1.01, 1] : 1,
        boxShadow: isUnlocked
          ? [
              '0px 0px 0px rgba(0,0,0,0)',
              '0px 10px 30px rgba(99,102,241,0.35)',
              '0px 0px 0px rgba(0,0,0,0)',
            ]
          : 'none',
      }}
      transition={{
        duration: 0.3,
        delay: 0.05,
        scale: { duration: 2, repeat: isUnlocked ? Infinity : 0, ease: 'easeInOut' },
        boxShadow: { duration: 2, repeat: isUnlocked ? Infinity : 0 },
      }}
    >
      {isUnlocked && (
        <ConfettiEffect
          key={`${achievement.id}-${achievement.progress}`}
          trigger
          type="achievement"
        />
      )}
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          isUnlocked
            ? 'border-transparent shadow-lg'
            : 'opacity-70 bg-muted/50 border-dashed'
        )}
      >
        {isUnlocked && (
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-90"
            initial={{ opacity: 0.7 }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundImage:
                'linear-gradient(130deg, rgba(99,102,241,0.4), rgba(236,72,153,0.35), rgba(45,212,191,0.35))',
              backgroundSize: '200% 200%',
            }}
          >
            <div className="absolute inset-0 blur-3xl bg-primary/30 animate-pulse" />
          </motion.div>
        )}
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <motion.div
              className={cn(
              "p-3 rounded-xl flex items-center justify-center shrink-0",
              isUnlocked 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-muted text-muted-foreground"
            )}
              animate={
                isUnlocked
                  ? { scale: [1, 1.1, 1], rotate: [0, -4, 4, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={{
                duration: 1.6,
                repeat: isUnlocked ? Infinity : 0,
                ease: 'easeInOut',
              }}
            >
              <Icon size={24} />
            </motion.div>
            
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h3 className={cn(
                  "font-semibold leading-none",
                  isUnlocked ? "text-foreground" : "text-muted-foreground"
                )}>
                  {tDefinition(`${achievement.id}.title`)}
                </h3>
                {isUnlocked && (
                  <motion.span
                    className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full shadow-sm"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {t('badge')}
                  </motion.span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tDefinition(`${achievement.id}.description`)}
              </p>
              
              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('progressLabel')}</span>
                  <span>
                    {t('progressValue', {
                      progress: achievement.progress,
                      target: achievement.target,
                    })}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
