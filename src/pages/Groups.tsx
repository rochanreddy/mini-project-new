import { useState } from 'react';
import { useSocial } from '@/contexts/SocialContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppSidebar } from '@/components/fitness/AppSidebar';
import { motion } from 'framer-motion';
import { Users, Plus, TrendingUp, Zap, Trophy, UserPlus, Lock, Globe, Menu, X } from 'lucide-react';

const Groups = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { groups, joinGroup, leaveGroup, createGroup } = useSocial();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      createGroup(newGroupName, newGroupDescription, isPrivate);
      setNewGroupName('');
      setNewGroupDescription('');
      setIsPrivate(false);
      setIsCreateOpen(false);
    }
  };

  const selectedGroupData = groups.find(g => g.id === selectedGroup);
  const isMember = selectedGroupData?.members.some(m => m.userId === 'user_1');

  // Mock available groups to join
  const availableGroups = [
    {
      id: 'group_2',
      name: 'Evening Grind',
      description: 'After work workout squad 💼',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      memberCount: 24,
      isPrivate: false,
    },
    {
      id: 'group_3',
      name: 'Strength Squad',
      description: 'Powerlifting and strength training focused 🏋️',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
      memberCount: 18,
      isPrivate: false,
    },
    {
      id: 'group_4',
      name: 'Cardio Kings',
      description: 'Running, HIIT, and cardio enthusiasts 🏃',
      image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=300&fit=crop',
      memberCount: 31,
      isPrivate: false,
    },
  ];

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
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Workout Groups
            </h1>
            <p className="text-muted-foreground">
              Join communities and workout together
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a Workout Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    placeholder="Enter group name..."
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="group-description">Description</Label>
                  <Textarea
                    id="group-description"
                    placeholder="Describe your group..."
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="private-group">Private Group</Label>
                  <Switch
                    id="private-group"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                </div>
                <Button onClick={handleCreateGroup} className="w-full">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* My Groups */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Groups</h2>
          {groups.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No groups yet</p>
                <p className="text-muted-foreground mb-4">
                  Create or join a group to workout with others!
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Group
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    <div
                      className="h-32 bg-cover bg-center rounded-t-lg"
                      style={{ backgroundImage: `url(${group.image})` }}
                    >
                      <div className="h-full bg-gradient-to-t from-black/60 to-transparent rounded-t-lg flex items-end p-4">
                        <h3 className="text-white font-bold text-xl">{group.name}</h3>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        {group.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4" />
                          <span>{group.memberCount} members</span>
                        </div>
                        <Badge variant={group.isPrivate ? 'secondary' : 'outline'}>
                          {group.isPrivate ? (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Private
                            </>
                          ) : (
                            <>
                              <Globe className="w-3 h-3 mr-1" />
                              Public
                            </>
                          )}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Discover Groups */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Discover Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <div
                    className="h-32 bg-cover bg-center rounded-t-lg"
                    style={{ backgroundImage: `url(${group.image})` }}
                  >
                    <div className="h-full bg-gradient-to-t from-black/60 to-transparent rounded-t-lg flex items-end p-4">
                      <h3 className="text-white font-bold text-xl">{group.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-4 h-4" />
                        <span>{group.memberCount} members</span>
                      </div>
                      <Badge variant="outline">
                        <Globe className="w-3 h-3 mr-1" />
                        Public
                      </Badge>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => joinGroup(group.id)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Group Detail Dialog */}
        {selectedGroupData && (
          <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <div
                  className="h-40 -mx-6 -mt-6 mb-4 bg-cover bg-center rounded-t-lg"
                  style={{ backgroundImage: `url(${selectedGroupData.image})` }}
                >
                  <div className="h-full bg-gradient-to-t from-black/80 to-transparent rounded-t-lg flex items-end p-6">
                    <div>
                      <DialogTitle className="text-white text-2xl mb-2">
                        {selectedGroupData.name}
                      </DialogTitle>
                      <p className="text-white/90 text-sm">{selectedGroupData.description}</p>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {/* Group Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <div className="text-xl font-bold">{selectedGroupData.memberCount}</div>
                      <div className="text-xs text-muted-foreground">Members</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Trophy className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                      <div className="text-xl font-bold">{selectedGroupData.totalWorkouts}</div>
                      <div className="text-xs text-muted-foreground">Workouts</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      {selectedGroupData.isPrivate ? (
                        <Lock className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                      ) : (
                        <Globe className="w-6 h-6 mx-auto mb-2 text-green-500" />
                      )}
                      <div className="text-xs font-semibold">
                        {selectedGroupData.isPrivate ? 'Private' : 'Public'}
                      </div>
                      <div className="text-xs text-muted-foreground">Group</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Members */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Members This Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-3">
                        {selectedGroupData.members
                          .sort((a, b) => b.workoutsThisWeek - a.workoutsThisWeek)
                          .map((member, index) => (
                            <div
                              key={member.userId}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
                            >
                              <div className="text-lg font-bold w-8 text-center">
                                {index + 1}
                              </div>
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{member.name}</p>
                                  {member.role === 'admin' && (
                                    <Badge variant="secondary" className="text-xs">
                                      Admin
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Level {member.level}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    {member.xp.toLocaleString()} XP
                                  </span>
                                </div>
                              </div>
                              <Badge variant="outline">
                                <Trophy className="w-3 h-3 mr-1 text-amber-500" />
                                {member.workoutsThisWeek} this week
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-2">
                  {isMember ? (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        leaveGroup(selectedGroupData.id);
                        setSelectedGroup(null);
                      }}
                    >
                      Leave Group
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      onClick={() => {
                        joinGroup(selectedGroupData.id);
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join Group
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        </div>
      </main>
    </div>
  );
};

export default Groups;
