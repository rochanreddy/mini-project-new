import { useState } from 'react';
import { useSocial } from '@/contexts/SocialContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AppSidebar } from '@/components/fitness/AppSidebar';
import { motion } from 'framer-motion';
import { Users, Search, UserPlus, Send, TrendingUp, Zap, Flame, X, Menu } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Friends = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    friends,
    friendRequests,
    friendActivities,
    socialStats,
    addFriend,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    sendMotivation,
    searchUsers,
  } = useSocial();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'activity' | 'requests'>('friends');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchResults = searchUsers(searchQuery);
  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const pendingRequests = friendRequests.filter(r => r.status === 'pending');

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
        <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Friends
            </h1>
            <p className="text-muted-foreground">
              Connect and compete with your workout buddies
            </p>
          </div>
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add Friend
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Find Friends</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {searchResults.map((user) => {
                      const isFriend = acceptedFriends.some(f => f.id === user.id);
                      const hasPendingRequest = pendingRequests.some(
                        r => r.fromUserId === user.id || r.toUserId === user.id
                      );

                      return (
                        <Card key={user.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">{user.name}</p>
                                  <Badge variant="secondary" className="text-xs">
                                    Level {user.level}
                                  </Badge>
                                </div>
                                {user.bio && (
                                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                                )}
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span>{user.totalWorkouts} workouts</span>
                                  <span>🔥 {user.currentStreak} day streak</span>
                                </div>
                              </div>
                              {isFriend ? (
                                <Badge variant="outline" className="text-green-500 border-green-500">
                                  ✓ Friends
                                </Badge>
                              ) : hasPendingRequest ? (
                                <Badge variant="outline">Pending</Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    addFriend(user.id);
                                  }}
                                >
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Add
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{socialStats.friendsCount}</div>
              <div className="text-xs text-muted-foreground">Friends</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{socialStats.friendsActiveToday}</div>
              <div className="text-xs text-muted-foreground">Active Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserPlus className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{socialStats.pendingRequestsCount}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Send className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{socialStats.unreadMessagesCount}</div>
              <div className="text-xs text-muted-foreground">Messages</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">Friends ({acceptedFriends.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-6">
            <div className="grid gap-4">
              {acceptedFriends.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">No friends yet</p>
                    <p className="text-muted-foreground mb-4">
                      Add friends to stay motivated and compete together!
                    </p>
                    <Button onClick={() => setIsSearchOpen(true)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Find Friends
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                acceptedFriends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>{friend.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-lg">{friend.name}</p>
                              {friend.lastActive &&
                                friend.lastActive.toDateString() === new Date().toDateString() && (
                                  <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-500">
                                    Online
                                  </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Level {friend.level}
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap className="w-3 h-3 text-amber-500" />
                                {friend.xp.toLocaleString()} XP
                              </span>
                              <span className="flex items-center gap-1">
                                <Flame className="w-3 h-3 text-orange-500" />
                                {friend.currentStreak} day streak
                              </span>
                            </div>
                            {friend.lastActive && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Last active {formatDistanceToNow(friend.lastActive, { addSuffix: true })}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendMotivation(friend.id)}
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Motivate
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFriend(friend.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Friend Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  {friendActivities.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No recent activity. Add friends to see their progress!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {friendActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                            <AvatarFallback>{activity.userName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm">
                              <span className="font-medium">{activity.userName}</span>{' '}
                              {activity.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <UserPlus className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">No pending requests</p>
                    <p className="text-muted-foreground">
                      You're all caught up!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pendingRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.fromUserAvatar} alt={request.fromUserName} />
                          <AvatarFallback>{request.fromUserName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{request.fromUserName}</p>
                          <p className="text-sm text-muted-foreground">
                            Sent {formatDistanceToNow(request.sentAt, { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => acceptFriendRequest(request.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectFriendRequest(request.id)}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Friends;
