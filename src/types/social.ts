// Social Features Types

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  currentStreak: number;
  status: 'pending' | 'accepted' | 'blocked';
  addedAt: Date;
  lastActive?: Date;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  sentAt: Date;
}

export interface WorkoutGroup {
  id: string;
  name: string;
  description: string;
  image: string;
  createdBy: string;
  createdAt: Date;
  memberCount: number;
  members: GroupMember[];
  isPrivate: boolean;
  totalWorkouts: number;
}

export interface GroupMember {
  userId: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  joinedAt: Date;
  workoutsThisWeek: number;
  xp: number;
  level: number;
}

export interface Message {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  toUserId?: string; // For direct messages
  groupId?: string; // For group messages
  content: string;
  type: 'text' | 'motivation' | 'workout_share' | 'achievement';
  metadata?: {
    workoutId?: string;
    achievementId?: string;
  };
  sentAt: Date;
  readAt?: Date;
}

export interface FriendActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'workout_completed' | 'level_up' | 'badge_unlocked' | 'streak_milestone' | 'challenge_completed';
  title: string;
  description: string;
  workoutName?: string;
  workoutId?: string;
  badgeName?: string;
  levelReached?: number;
  timestamp: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  level: number;
  xp: number;
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  badges: number;
  friendsCount: number;
  groupsCount: number;
  joinedAt: Date;
  favoriteCategory?: string;
}

export interface SocialStats {
  friendsCount: number;
  pendingRequestsCount: number;
  groupsCount: number;
  unreadMessagesCount: number;
  friendsActiveToday: number;
}

// Pre-defined motivation messages
export const MOTIVATION_MESSAGES = [
  "💪 Keep crushing it!",
  "🔥 You're on fire!",
  "⭐ Great work today!",
  "🎯 Stay consistent!",
  "💯 Don't break the streak!",
  "🏆 You got this!",
  "⚡ Keep up the energy!",
  "🌟 Proud of you!",
  "👏 Amazing progress!",
  "💥 Let's get it!",
];
