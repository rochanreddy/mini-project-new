import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Badge, Challenge, Achievement, XP_REWARDS, LEVELS, BADGES } from '@/types/gamification';
import { WorkoutPlan } from '@/data/workouts';
import { toast } from '@/hooks/use-toast';

interface GamificationContextType {
  user: User;
  challenges: Challenge[];
  achievements: Achievement[];
  addXP: (amount: number, reason: string) => void;
  completeWorkout: (workout: WorkoutPlan) => void;
  completeExercise: (exerciseId: string) => void;
  completeChallenge: (challengeId: string) => void;
  checkAndUnlockBadges: () => void;
  getUserLevel: () => number;
  getXPProgress: () => { current: number; required: number; percentage: number };
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// Generate daily challenges
const generateDailyChallenges = (): Challenge[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return [
    {
      id: 'daily_1',
      title: 'Complete Any Workout',
      description: 'Finish one complete workout today',
      type: 'daily',
      target: 1,
      progress: 0,
      xpReward: XP_REWARDS.DAILY_CHALLENGE,
      expiresAt: tomorrow,
      isCompleted: false,
    },
    {
      id: 'daily_2',
      title: 'Exercise Streak',
      description: 'Complete 10 exercises today',
      type: 'daily',
      target: 10,
      progress: 0,
      xpReward: 75,
      expiresAt: tomorrow,
      isCompleted: false,
    },
    {
      id: 'daily_3',
      title: 'Calorie Burner',
      description: 'Burn 500+ calories today',
      type: 'daily',
      target: 500,
      progress: 0,
      xpReward: 120,
      expiresAt: tomorrow,
      isCompleted: false,
    },
  ];
};

// Get initial user data (synced with auth)
const getInitialUser = (authUserId?: string, authUserName?: string, authUserAvatar?: string): User => {
  const userId = authUserId || 'user_1';
  const stored = localStorage.getItem(`fitflow_gamification_${userId}`);
  
  if (stored) {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      id: userId,
      name: authUserName || parsed.name,
      avatar: authUserAvatar || parsed.avatar,
      badges: parsed.badges.map((b: Badge) => ({
        ...b,
        unlockedAt: b.unlockedAt ? new Date(b.unlockedAt) : undefined,
      })),
    };
  }

  return {
    id: userId,
    name: authUserName || 'Fitness Hero',
    avatar: authUserAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessHero',
    xp: 0,
    level: 1,
    totalWorkouts: 0,
    currentStreak: 0,
    longestStreak: 0,
    badges: BADGES.map(b => ({ ...b })),
  };
};

interface GamificationProviderProps {
  children: ReactNode;
  authUserId?: string;
  authUserName?: string;
  authUserAvatar?: string;
}

export const GamificationProvider = ({ 
  children, 
  authUserId, 
  authUserName, 
  authUserAvatar 
}: GamificationProviderProps) => {
  const [user, setUser] = useState<User>(() => 
    getInitialUser(authUserId, authUserName, authUserAvatar)
  );

  // Update when auth props change
  useEffect(() => {
    if (authUserId && authUserName) {
      setUser(prev => ({
        ...prev,
        id: authUserId,
        name: authUserName,
        avatar: authUserAvatar || prev.avatar,
      }));
    }
  }, [authUserId, authUserName, authUserAvatar]);
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const stored = localStorage.getItem('fitflow_challenges');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((c: Challenge) => ({
        ...c,
        expiresAt: new Date(c.expiresAt),
      }));
    }
    return generateDailyChallenges();
  });
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const stored = localStorage.getItem('fitflow_achievements');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((a: Achievement) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      }));
    }
    return [];
  });

  // Save to localStorage whenever state changes (per user)
  useEffect(() => {
    if (user.id) {
      localStorage.setItem(`fitflow_gamification_${user.id}`, JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fitflow_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('fitflow_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Check for expired challenges and regenerate
  useEffect(() => {
    const checkChallenges = () => {
      const now = new Date();
      const hasExpired = challenges.some(c => c.expiresAt < now);
      if (hasExpired) {
        setChallenges(generateDailyChallenges());
      }
    };

    checkChallenges();
    const interval = setInterval(checkChallenges, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [challenges]);

  const addXP = (amount: number, reason: string) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      const newLevel = LEVELS.findIndex(l => newXP < l.xpRequired) || LEVELS.length;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        toast({
          title: '🎉 Level Up!',
          description: `You've reached level ${newLevel}! Keep it up!`,
        });

        // Add achievement
        const achievement: Achievement = {
          id: `achievement_${Date.now()}`,
          userId: prev.id,
          type: 'level_up',
          title: `Level ${newLevel} Reached!`,
          description: `You've leveled up to ${LEVELS[newLevel - 1].title}`,
          xpGained: amount,
          timestamp: new Date(),
        };
        setAchievements(prevAchievements => [...prevAchievements, achievement]);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });

    toast({
      title: `+${amount} XP`,
      description: reason,
    });
  };

  const completeWorkout = (workout: WorkoutPlan) => {
    const difficultyMultiplier = XP_REWARDS.DIFFICULTY_MULTIPLIER[workout.difficulty];
    const baseXP = XP_REWARDS.WORKOUT_COMPLETE;
    const streakBonus = user.currentStreak * XP_REWARDS.STREAK_BONUS_PER_DAY;
    const totalXP = Math.floor((baseXP + streakBonus) * difficultyMultiplier);

    setUser(prev => ({
      ...prev,
      totalWorkouts: prev.totalWorkouts + 1,
      currentStreak: prev.currentStreak + 1,
      longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
    }));

    addXP(totalXP, `Completed ${workout.name}`);

    // Update challenges
    setChallenges(prev =>
      prev.map(challenge => {
        if (challenge.id === 'daily_1' && !challenge.isCompleted) {
          const newProgress = challenge.progress + 1;
          const completed = newProgress >= challenge.target;
          if (completed) {
            addXP(challenge.xpReward, `Challenge completed: ${challenge.title}`);
            toast({
              title: '🏆 Challenge Complete!',
              description: challenge.title,
            });
          }
          return { ...challenge, progress: newProgress, isCompleted: completed };
        }
        if (challenge.id === 'daily_3' && !challenge.isCompleted) {
          const newProgress = challenge.progress + workout.calories;
          const completed = newProgress >= challenge.target;
          if (completed) {
            addXP(challenge.xpReward, `Challenge completed: ${challenge.title}`);
            toast({
              title: '🏆 Challenge Complete!',
              description: challenge.title,
            });
          }
          return { ...challenge, progress: newProgress, isCompleted: completed };
        }
        return challenge;
      })
    );

    // Add achievement
    const achievement: Achievement = {
      id: `achievement_${Date.now()}`,
      userId: user.id,
      type: 'workout_completed',
      title: `${workout.name} Completed!`,
      description: `You earned ${totalXP} XP`,
      xpGained: totalXP,
      timestamp: new Date(),
    };
    setAchievements(prev => [...prev, achievement]);

    checkAndUnlockBadges();
  };

  const completeExercise = (exerciseId: string) => {
    const xp = XP_REWARDS.EXERCISE_COMPLETE;
    addXP(xp, 'Exercise completed');

    // Update challenge
    setChallenges(prev =>
      prev.map(challenge => {
        if (challenge.id === 'daily_2' && !challenge.isCompleted) {
          const newProgress = challenge.progress + 1;
          const completed = newProgress >= challenge.target;
          if (completed) {
            addXP(challenge.xpReward, `Challenge completed: ${challenge.title}`);
            toast({
              title: '🏆 Challenge Complete!',
              description: challenge.title,
            });
          }
          return { ...challenge, progress: newProgress, isCompleted: completed };
        }
        return challenge;
      })
    );
  };

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(challenge => {
        if (challenge.id === challengeId && !challenge.isCompleted) {
          addXP(challenge.xpReward, `Challenge completed: ${challenge.title}`);
          return { ...challenge, isCompleted: true, progress: challenge.target };
        }
        return challenge;
      })
    );
  };

  const checkAndUnlockBadges = () => {
    setUser(prev => {
      const updatedBadges = prev.badges.map(badge => {
        if (badge.isUnlocked) return badge;

        let shouldUnlock = false;

        // Check badge conditions
        switch (badge.id) {
          case 'first_workout':
            shouldUnlock = prev.totalWorkouts >= 1;
            break;
          case 'workouts_10':
            shouldUnlock = prev.totalWorkouts >= 10;
            break;
          case 'workouts_50':
            shouldUnlock = prev.totalWorkouts >= 50;
            break;
          case 'workouts_100':
            shouldUnlock = prev.totalWorkouts >= 100;
            break;
          case 'streak_7':
            shouldUnlock = prev.currentStreak >= 7;
            break;
          case 'streak_30':
            shouldUnlock = prev.currentStreak >= 30;
            break;
          case 'level_10':
            shouldUnlock = prev.level >= 10;
            break;
          case 'level_25':
            shouldUnlock = prev.level >= 25;
            break;
          case 'level_50':
            shouldUnlock = prev.level >= 50;
            break;
        }

        if (shouldUnlock) {
          toast({
            title: '🎖️ Badge Unlocked!',
            description: `${badge.icon} ${badge.name} - ${badge.description}`,
          });

          const achievement: Achievement = {
            id: `achievement_${Date.now()}`,
            userId: prev.id,
            type: 'badge_unlocked',
            title: `Badge Unlocked: ${badge.name}`,
            description: badge.description,
            xpGained: 0,
            timestamp: new Date(),
          };
          setAchievements(prevAchievements => [...prevAchievements, achievement]);

          return { ...badge, isUnlocked: true, unlockedAt: new Date() };
        }

        return badge;
      });

      return { ...prev, badges: updatedBadges };
    });
  };

  const getUserLevel = () => user.level;

  const getXPProgress = () => {
    const currentLevelData = LEVELS[user.level - 1];
    const nextLevelData = LEVELS[user.level];

    if (!nextLevelData) {
      return { current: user.xp, required: currentLevelData.xpRequired, percentage: 100 };
    }

    const current = user.xp - currentLevelData.xpRequired;
    const required = nextLevelData.xpRequired - currentLevelData.xpRequired;
    const percentage = (current / required) * 100;

    return { current, required, percentage };
  };

  return (
    <GamificationContext.Provider
      value={{
        user,
        challenges,
        achievements,
        addXP,
        completeWorkout,
        completeExercise,
        completeChallenge,
        checkAndUnlockBadges,
        getUserLevel,
        getXPProgress,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};
