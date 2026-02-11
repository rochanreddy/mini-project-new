import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Friend,
  FriendRequest,
  WorkoutGroup,
  GroupMember,
  Message,
  FriendActivity,
  UserProfile,
  SocialStats,
  MOTIVATION_MESSAGES,
} from '@/types/social';
import { toast } from '@/hooks/use-toast';

interface SocialContextType {
  friends: Friend[];
  friendRequests: FriendRequest[];
  groups: WorkoutGroup[];
  messages: Message[];
  friendActivities: FriendActivity[];
  socialStats: SocialStats;
  addFriend: (friendId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (friendId: string) => void;
  createGroup: (name: string, description: string, isPrivate: boolean) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  sendMessage: (toUserId: string | undefined, groupId: string | undefined, content: string, type?: Message['type']) => void;
  sendMotivation: (friendId: string) => void;
  addFriendActivity: (activity: Omit<FriendActivity, 'id'>) => void;
  searchUsers: (query: string) => UserProfile[];
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS: UserProfile[] = [
  {
    id: 'user_2',
    name: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Fitness enthusiast | Marathon runner 🏃‍♀️',
    level: 15,
    xp: 3200,
    totalWorkouts: 45,
    currentStreak: 12,
    longestStreak: 30,
    badges: 8,
    friendsCount: 23,
    groupsCount: 3,
    joinedAt: new Date('2025-01-15'),
    favoriteCategory: 'Cardio',
  },
  {
    id: 'user_3',
    name: 'Mike Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    bio: 'Powerlifter | Strength coach 💪',
    level: 22,
    xp: 5800,
    totalWorkouts: 78,
    currentStreak: 25,
    longestStreak: 45,
    badges: 12,
    friendsCount: 31,
    groupsCount: 5,
    joinedAt: new Date('2024-11-20'),
    favoriteCategory: 'Strength',
  },
  {
    id: 'user_4',
    name: 'Emma Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    bio: 'Yoga instructor | Mind & body wellness 🧘‍♀️',
    level: 18,
    xp: 4100,
    totalWorkouts: 62,
    currentStreak: 18,
    longestStreak: 35,
    badges: 10,
    friendsCount: 28,
    groupsCount: 4,
    joinedAt: new Date('2024-12-10'),
    favoriteCategory: 'Flexibility',
  },
  {
    id: 'user_5',
    name: 'Alex Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'CrossFit athlete | Competitive spirit 🔥',
    level: 28,
    xp: 8500,
    totalWorkouts: 112,
    currentStreak: 42,
    longestStreak: 60,
    badges: 15,
    friendsCount: 45,
    groupsCount: 6,
    joinedAt: new Date('2024-09-05'),
    favoriteCategory: 'HIIT',
  },
];

const getInitialFriends = (): Friend[] => {
  const stored = localStorage.getItem('fitflow_friends');
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed.map((f: Friend) => ({
      ...f,
      addedAt: new Date(f.addedAt),
      lastActive: f.lastActive ? new Date(f.lastActive) : undefined,
    }));
  }

  // Return some initial mock friends
  return MOCK_USERS.slice(0, 2).map(user => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    level: user.level,
    xp: user.xp,
    currentStreak: user.currentStreak,
    status: 'accepted' as const,
    addedAt: new Date(),
    lastActive: new Date(),
  }));
};

const getInitialGroups = (): WorkoutGroup[] => {
  const stored = localStorage.getItem('fitflow_groups');
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed.map((g: WorkoutGroup) => ({
      ...g,
      createdAt: new Date(g.createdAt),
      members: g.members.map((m: GroupMember) => ({
        ...m,
        joinedAt: new Date(m.joinedAt),
      })),
    }));
  }

  return [
    {
      id: 'group_1',
      name: 'Morning Warriors',
      description: 'Early morning workout crew 🌅',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
      createdBy: 'user_2',
      createdAt: new Date('2026-01-01'),
      memberCount: 12,
      members: [
        {
          userId: 'user_2',
          name: 'Sarah Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          role: 'admin',
          joinedAt: new Date('2026-01-01'),
          workoutsThisWeek: 6,
          xp: 3200,
          level: 15,
        },
      ],
      isPrivate: false,
      totalWorkouts: 245,
    },
  ];
};

export const SocialProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<Friend[]>(getInitialFriends);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    const stored = localStorage.getItem('fitflow_friend_requests');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((r: FriendRequest) => ({
        ...r,
        sentAt: new Date(r.sentAt),
      }));
    }
    return [];
  });
  const [groups, setGroups] = useState<WorkoutGroup[]>(getInitialGroups);
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem('fitflow_messages');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((m: Message) => ({
        ...m,
        sentAt: new Date(m.sentAt),
        readAt: m.readAt ? new Date(m.readAt) : undefined,
      }));
    }
    return [];
  });
  const [friendActivities, setFriendActivities] = useState<FriendActivity[]>(() => {
    const stored = localStorage.getItem('fitflow_friend_activities');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((a: FriendActivity) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      }));
    }
    // Generate some initial mock activities
    return [];
  });

  // Calculate social stats
  const socialStats: SocialStats = {
    friendsCount: friends.filter(f => f.status === 'accepted').length,
    pendingRequestsCount: friendRequests.filter(r => r.status === 'pending').length,
    groupsCount: groups.length,
    unreadMessagesCount: messages.filter(m => !m.readAt).length,
    friendsActiveToday: friends.filter(f => {
      if (!f.lastActive) return false;
      const today = new Date();
      return f.lastActive.toDateString() === today.toDateString();
    }).length,
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('fitflow_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('fitflow_friend_requests', JSON.stringify(friendRequests));
  }, [friendRequests]);

  useEffect(() => {
    localStorage.setItem('fitflow_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('fitflow_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('fitflow_friend_activities', JSON.stringify(friendActivities));
  }, [friendActivities]);

  const addFriend = (friendId: string) => {
    const user = MOCK_USERS.find(u => u.id === friendId);
    if (!user) return;

    const request: FriendRequest = {
      id: `request_${Date.now()}`,
      fromUserId: 'user_1',
      fromUserName: 'Fitness Hero',
      fromUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessHero',
      toUserId: friendId,
      status: 'pending',
      sentAt: new Date(),
    };

    setFriendRequests(prev => [...prev, request]);

    toast({
      title: 'Friend Request Sent',
      description: `Friend request sent to ${user.name}`,
    });

    // Auto-accept for demo purposes
    setTimeout(() => {
      acceptFriendRequest(request.id);
    }, 1000);
  };

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request) return;

    const user = MOCK_USERS.find(u => u.id === request.fromUserId);
    if (!user) return;

    const newFriend: Friend = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      level: user.level,
      xp: user.xp,
      currentStreak: user.currentStreak,
      status: 'accepted',
      addedAt: new Date(),
      lastActive: new Date(),
    };

    setFriends(prev => [...prev, newFriend]);
    setFriendRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'accepted' as const } : r))
    );

    toast({
      title: 'Friend Added!',
      description: `You are now friends with ${user.name}`,
    });
  };

  const rejectFriendRequest = (requestId: string) => {
    setFriendRequests(prev =>
      prev.map(r => (r.id === requestId ? { ...r, status: 'rejected' as const } : r))
    );
  };

  const removeFriend = (friendId: string) => {
    setFriends(prev => prev.filter(f => f.id !== friendId));
    toast({
      title: 'Friend Removed',
      description: 'Friend has been removed from your list',
    });
  };

  const createGroup = (name: string, description: string, isPrivate: boolean) => {
    const newGroup: WorkoutGroup = {
      id: `group_${Date.now()}`,
      name,
      description,
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
      createdBy: 'user_1',
      createdAt: new Date(),
      memberCount: 1,
      members: [
        {
          userId: 'user_1',
          name: 'Fitness Hero',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessHero',
          role: 'admin',
          joinedAt: new Date(),
          workoutsThisWeek: 0,
          xp: 0,
          level: 1,
        },
      ],
      isPrivate,
      totalWorkouts: 0,
    };

    setGroups(prev => [...prev, newGroup]);

    toast({
      title: 'Group Created!',
      description: `${name} has been created`,
    });
  };

  const joinGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id === groupId) {
          const newMember: GroupMember = {
            userId: 'user_1',
            name: 'Fitness Hero',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessHero',
            role: 'member',
            joinedAt: new Date(),
            workoutsThisWeek: 0,
            xp: 0,
            level: 1,
          };

          return {
            ...group,
            memberCount: group.memberCount + 1,
            members: [...group.members, newMember],
          };
        }
        return group;
      })
    );

    toast({
      title: 'Joined Group!',
      description: 'You have joined the group',
    });
  };

  const leaveGroup = (groupId: string) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            memberCount: group.memberCount - 1,
            members: group.members.filter(m => m.userId !== 'user_1'),
          };
        }
        return group;
      })
    );

    toast({
      title: 'Left Group',
      description: 'You have left the group',
    });
  };

  const sendMessage = (
    toUserId: string | undefined,
    groupId: string | undefined,
    content: string,
    type: Message['type'] = 'text'
  ) => {
    const message: Message = {
      id: `message_${Date.now()}`,
      fromUserId: 'user_1',
      fromUserName: 'Fitness Hero',
      fromUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FitnessHero',
      toUserId,
      groupId,
      content,
      type,
      sentAt: new Date(),
    };

    setMessages(prev => [...prev, message]);

    toast({
      title: 'Message Sent',
      description: content,
    });
  };

  const sendMotivation = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    const randomMessage = MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)];
    sendMessage(friendId, undefined, randomMessage, 'motivation');

    toast({
      title: 'Motivation Sent!',
      description: `Sent to ${friend.name}`,
    });
  };

  const addFriendActivity = (activity: Omit<FriendActivity, 'id'>) => {
    const newActivity: FriendActivity = {
      ...activity,
      id: `activity_${Date.now()}`,
    };

    setFriendActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep only latest 50
  };

  const searchUsers = (query: string): UserProfile[] => {
    if (!query.trim()) return MOCK_USERS;

    const lowerQuery = query.toLowerCase();
    return MOCK_USERS.filter(
      user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.bio?.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <SocialContext.Provider
      value={{
        friends,
        friendRequests,
        groups,
        messages,
        friendActivities,
        socialStats,
        addFriend,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        createGroup,
        joinGroup,
        leaveGroup,
        sendMessage,
        sendMotivation,
        addFriendActivity,
        searchUsers,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within SocialProvider');
  }
  return context;
};
