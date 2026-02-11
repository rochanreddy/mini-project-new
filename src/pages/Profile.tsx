import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useSocial } from '@/contexts/SocialContext';
import { AppSidebar } from '@/components/fitness/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Menu, X, User, Mail, Calendar, Trophy, Users, Zap, LogOut, Save } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, updateProfile } = useAuth();
  const { user: gamificationUser } = useGamification();
  const { socialStats } = useSocial();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  if (!user) {
    return null;
  }

  const handleSave = () => {
    if (editedName.trim()) {
      updateProfile({ name: editedName });
      setIsEditing(false);
    }
  };

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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account and view your progress</p>
          </motion.div>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar & Basic Info */}
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  {/* Name */}
                  <div>
                    <Label>Full Name</Label>
                    {isEditing ? (
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="Enter your name"
                        />
                        <Button onClick={handleSave} size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={() => {
                          setIsEditing(false);
                          setEditedName(user.name);
                        }} size="sm" variant="outline">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-lg font-medium">{user.name}</p>
                        <Button onClick={() => setIsEditing(true)} size="sm" variant="ghost">
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label>Email</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">{user.email}</p>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div>
                    <Label>Member Since</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm">
                        {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{gamificationUser.level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                <div className="text-2xl font-bold">{gamificationUser.totalWorkouts}</div>
                <div className="text-sm text-muted-foreground">Total Workouts</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{socialStats.friendsCount}</div>
                <div className="text-sm text-muted-foreground">Friends</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Badge className="w-8 h-8 mx-auto mb-2 text-green-500 flex items-center justify-center">
                  🏅
                </Badge>
                <div className="text-2xl font-bold">
                  {gamificationUser.badges.filter(b => b.isUnlocked).length}
                </div>
                <div className="text-sm text-muted-foreground">Badges</div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your fitness milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Level {gamificationUser.level}</p>
                    <p className="text-sm text-muted-foreground">{gamificationUser.xp} XP earned</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    🔥
                  </div>
                  <div>
                    <p className="font-medium">{gamificationUser.currentStreak} Day Streak</p>
                    <p className="text-sm text-muted-foreground">
                      Longest: {gamificationUser.longestStreak} days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">{gamificationUser.totalWorkouts} Workouts Completed</p>
                    <p className="text-sm text-muted-foreground">Keep crushing it! 💪</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logout Button */}
          <Card>
            <CardContent className="p-6">
              <Button onClick={logout} variant="destructive" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
