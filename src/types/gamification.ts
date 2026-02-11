// Gamification Types

export interface User {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export interface Level {
  level: number;
  title: string;
  xpRequired: number;
  xpToNext: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  progress: number;
  xpReward: number;
  badgeReward?: string;
  expiresAt: Date;
  isCompleted: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  workoutsThisWeek: number;
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'workout_completed' | 'level_up' | 'badge_unlocked' | 'streak_milestone' | 'challenge_completed';
  title: string;
  description: string;
  xpGained: number;
  timestamp: Date;
}

// XP calculation constants
export const XP_REWARDS = {
  WORKOUT_COMPLETE: 50,
  EXERCISE_COMPLETE: 10,
  DAILY_CHALLENGE: 100,
  WEEKLY_CHALLENGE: 300,
  MONTHLY_CHALLENGE: 1000,
  STREAK_BONUS_PER_DAY: 5,
  DIFFICULTY_MULTIPLIER: {
    Beginner: 1,
    Intermediate: 1.5,
    Advanced: 2,
  },
};

// Level progression (exponential growth)
export const LEVELS: Level[] = Array.from({ length: 100 }, (_, i) => {
  const level = i + 1;
  const xpRequired = Math.floor(100 * Math.pow(level, 1.5));
  const xpToNext = level < 100 ? Math.floor(100 * Math.pow(level + 1, 1.5)) - xpRequired : 0;
  
  // Level titles
  let title = 'Newbie';
  if (level >= 50) title = 'Fitness Legend';
  else if (level >= 40) title = 'Elite Athlete';
  else if (level >= 30) title = 'Champion';
  else if (level >= 20) title = 'Expert';
  else if (level >= 15) title = 'Advanced';
  else if (level >= 10) title = 'Intermediate';
  else if (level >= 5) title = 'Beginner';
  
  return { level, title, xpRequired, xpToNext };
});

// Predefined badges
export const BADGES: Badge[] = [
  {
    id: 'first_workout',
    name: 'First Steps',
    description: 'Complete your first workout',
    icon: '🎯',
    rarity: 'common',
    isUnlocked: false,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day workout streak',
    icon: '🔥',
    rarity: 'common',
    isUnlocked: false,
  },
  {
    id: 'streak_30',
    name: 'Month Master',
    description: 'Maintain a 30-day workout streak',
    icon: '⭐',
    rarity: 'rare',
    isUnlocked: false,
  },
  {
    id: 'workouts_10',
    name: 'Getting Started',
    description: 'Complete 10 workouts',
    icon: '💪',
    rarity: 'common',
    isUnlocked: false,
  },
  {
    id: 'workouts_50',
    name: 'Dedicated',
    description: 'Complete 50 workouts',
    icon: '🏆',
    rarity: 'rare',
    isUnlocked: false,
  },
  {
    id: 'workouts_100',
    name: 'Centurion',
    description: 'Complete 100 workouts',
    icon: '👑',
    rarity: 'epic',
    isUnlocked: false,
  },
  {
    id: 'level_10',
    name: 'Level Up',
    description: 'Reach level 10',
    icon: '⚡',
    rarity: 'rare',
    isUnlocked: false,
  },
  {
    id: 'level_25',
    name: 'Rising Star',
    description: 'Reach level 25',
    icon: '🌟',
    rarity: 'epic',
    isUnlocked: false,
  },
  {
    id: 'level_50',
    name: 'Legendary',
    description: 'Reach level 50',
    icon: '💎',
    rarity: 'legendary',
    isUnlocked: false,
  },
  {
    id: 'all_categories',
    name: 'Well Rounded',
    description: 'Complete workouts in all categories',
    icon: '🎨',
    rarity: 'epic',
    isUnlocked: false,
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a workout before 7 AM',
    icon: '🌅',
    rarity: 'rare',
    isUnlocked: false,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a workout after 10 PM',
    icon: '🦉',
    rarity: 'rare',
    isUnlocked: false,
  },
];
