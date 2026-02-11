import { useState } from 'react';
import { useGamification } from '@/contexts/GamificationContext';
import { useSocial } from '@/contexts/SocialContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppSidebar } from '@/components/fitness/AppSidebar';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users, Zap, Menu, X } from 'lucide-react';
import { LeaderboardEntry } from '@/types/gamification';

const Leaderboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useGamification();
  const { friends } = useSocial();
  const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global');

  // Generate mock global leaderboard
  const globalLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: 'user_5',
      name: 'Alex Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      xp: 8500,
      level: 28,
      workoutsThisWeek: 7,
    },
    {
      rank: 2,
      userId: 'user_3',
      name: 'Mike Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      xp: 5800,
      level: 22,
      workoutsThisWeek: 6,
    },
    {
      rank: 3,
      userId: 'user_4',
      name: 'Emma Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      xp: 4100,
      level: 18,
      workoutsThisWeek: 5,
    },
    {
      rank: 4,
      userId: 'user_2',
      name: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      xp: 3200,
      level: 15,
      workoutsThisWeek: 6,
    },
    {
      rank: 5,
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      workoutsThisWeek: 4,
    },
  ].sort((a, b) => b.xp - a.xp).map((entry, index) => ({ ...entry, rank: index + 1 }));

  // Friends leaderboard
  const friendsLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      workoutsThisWeek: 4,
    },
    ...friends.map((friend, index) => ({
      rank: index + 2,
      userId: friend.id,
      name: friend.name,
      avatar: friend.avatar,
      xp: friend.xp,
      level: friend.level,
      workoutsThisWeek: Math.floor(Math.random() * 7) + 1,
    })),
  ].sort((a, b) => b.xp - a.xp).map((entry, index) => ({ ...entry, rank: index + 1 }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  const LeaderboardList = ({ entries }: { entries: LeaderboardEntry[] }) => (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.userId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className={`${
              entry.userId === user.id
                ? 'border-primary bg-primary/5'
                : ''
            } hover:shadow-md transition-shadow`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold w-12 text-center">
                  {getRankIcon(entry.rank)}
                </div>

                <Avatar className="h-12 w-12">
                  <AvatarImage src={entry.avatar} alt={entry.name} />
                  <AvatarFallback>{entry.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{entry.name}</p>
                    {entry.userId === user.id && (
                      <Badge variant="secondary" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Level {entry.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      {entry.xp.toLocaleString()} XP
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-green-500" />
                      {entry.workoutsThisWeek} this week
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsSidebarOpen(false)} />
      )}

      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Compete with friends and climb to the top!
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'global' | 'friends')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Global
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Friends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-6">
            <LeaderboardList entries={globalLeaderboard} />
          </TabsContent>

          <TabsContent value="friends" className="mt-6">
            {friendsLeaderboard.length > 1 ? (
              <LeaderboardList entries={friendsLeaderboard} />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No friends yet</p>
                  <p className="text-muted-foreground">
                    Add friends to compete with them on the leaderboard!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* User Stats Card */}
        <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{user.level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">
                  {user.xp.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{user.totalWorkouts}</div>
                <div className="text-sm text-muted-foreground">Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{user.currentStreak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
