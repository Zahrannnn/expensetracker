import { Achievement, ACHIEVEMENT_DEFINITIONS, UserStats } from '@/types/achievements';

/**
 * Checks for newly unlocked achievements based on updated stats
 */
export function checkAchievements(
  currentAchievements: Achievement[],
  stats: UserStats
): { updatedAchievements: Achievement[]; newUnlocks: Achievement[] } {
  const newUnlocks: Achievement[] = [];
  
  const updatedAchievements = currentAchievements.map((achievement) => {
    // Skip already unlocked achievements
    if (achievement.isUnlocked) return achievement;

    let progress = 0;
    let isUnlocked = false;

    // Calculate progress based on achievement ID/Category
    switch (achievement.id) {
      // Tracking
      case 'first_expense':
      case 'tracker_novice':
      case 'tracker_pro':
        progress = stats.totalExpenses;
        break;
      
      case 'category_explorer':
        progress = stats.categoriesUsed.length;
        break;

      // Streak
      case 'week_warrior':
      case 'monthly_master':
        progress = stats.currentStreak;
        break;

      // Saving
      case 'saver_starter':
        progress = stats.goalsCreated;
        break;
        
      case 'goal_getter':
        progress = stats.goalsCompleted;
        break;
        
      case 'big_saver':
        progress = stats.totalSaved;
        break;

      // Budgeting
      case 'budget_boss':
        progress = stats.budgetsMet; // This might need better tracking
        break;
        
      default:
        progress = achievement.progress;
    }

    // Check if target met
    if (progress >= achievement.target) {
      isUnlocked = true;
      progress = achievement.target; // Cap at target
    }

    // If newly unlocked
    if (isUnlocked && !achievement.isUnlocked) {
      const unlockedAchievement = {
        ...achievement,
        progress,
        isUnlocked,
        unlockedAt: new Date().toISOString(),
      };
      newUnlocks.push(unlockedAchievement);
      return unlockedAchievement;
    }

    // Update progress even if not unlocked
    return {
      ...achievement,
      progress,
    };
  });

  return { updatedAchievements, newUnlocks };
}

/**
 * Initializes achievements list from definitions, merging with existing state if any
 */
export function initializeAchievements(existingAchievements: Achievement[] = []): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    const existing = existingAchievements.find((a) => a.id === def.id);
    if (existing) {
      return { ...existing, ...def }; // Update definition but keep progress/unlocked state
    }
    return {
      ...def,
      progress: 0,
      isUnlocked: false,
    };
  });
}
