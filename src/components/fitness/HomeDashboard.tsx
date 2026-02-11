import { motion } from 'framer-motion';
import { Clock, Flame, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { WorkoutPlan, motivationalQuotes } from '@/data/workouts';
import { useGamification } from '@/contexts/GamificationContext';
import { XPBar } from '@/components/gamification/XPBar';
import { ChallengeCard } from '@/components/gamification/ChallengeCard';
import { BadgeDisplay } from '@/components/gamification/BadgeDisplay';

interface HomeDashboardProps {
  workoutData: WorkoutPlan[];
  completedWorkouts: number;
  onSelectWorkout: (workout: WorkoutPlan) => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    case 'Intermediate':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    case 'Advanced':
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function HomeDashboard({ workoutData, completedWorkouts, onSelectWorkout }: HomeDashboardProps) {
  const { user, challenges } = useGamification();
  
  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 sm:p-8"
    >
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Ready to Crush Your Goals?
        </h2>
        <p className="text-muted-foreground text-lg">
          {motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}
        </p>
      </div>

      {/* XP Bar */}
      <div className="mb-8">
        <XPBar />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Flame className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.totalWorkouts}</p>
                <p className="text-sm text-muted-foreground">Total Workouts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <Flame className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{user.badges.filter(b => b.isUnlocked).length}</p>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Challenges */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-4">Daily Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-8">
        <BadgeDisplay badges={user.badges} />
      </div>

      {/* Workout Grid */}
      <h3 className="text-2xl font-bold text-foreground mb-6">Discover Workouts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {workoutData.map((workout) => (
          <motion.div key={workout.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className="cursor-pointer overflow-hidden hover:shadow-xl transition-shadow"
              onClick={() => onSelectWorkout(workout)}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={workout.image} alt={workout.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <span className={cn('px-3 py-1 rounded-full text-xs font-medium border', getDifficultyColor(workout.difficulty))}>
                    {workout.difficulty}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-foreground mb-2">{workout.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">{workout.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    <span>{workout.calories} cal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
