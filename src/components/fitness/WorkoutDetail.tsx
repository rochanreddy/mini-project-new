import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flame, Target, CheckCircle2, ChevronRight, Award, Zap, Trophy, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WorkoutPlan, motivationalQuotes } from '@/data/workouts';
import { useGamification } from '@/contexts/GamificationContext';
import { useSocial } from '@/contexts/SocialContext';
import { useState, useEffect } from 'react';

interface WorkoutDetailProps {
  workout: WorkoutPlan;
  onBack: () => void;
  onToggleExercise: (exerciseId: string) => void;
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

export function WorkoutDetail({ workout, onBack, onToggleExercise }: WorkoutDetailProps) {
  const { completeWorkout, completeExercise, user } = useGamification();
  const { addFriendActivity } = useSocial();
  const [hasCompleted, setHasCompleted] = useState(false);
  
  const completedCount = workout.exercises.filter(ex => ex.completed).length;
  const progress = (completedCount / workout.exercises.length) * 100;
  const isComplete = workout.exercises.every(ex => ex.completed);

  useEffect(() => {
    if (isComplete && !hasCompleted) {
      setHasCompleted(true);
      completeWorkout(workout);
      addFriendActivity({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        type: 'workout_completed',
        title: 'Workout Completed',
        description: `completed ${workout.name}`,
        workoutName: workout.name,
        workoutId: workout.id,
        timestamp: new Date(),
      });
    }
  }, [isComplete, hasCompleted, workout, completeWorkout, addFriendActivity, user]);

  const handleToggleExercise = (exerciseId: string) => {
    const exercise = workout.exercises.find(ex => ex.id === exerciseId);
    if (exercise && !exercise.completed) {
      completeExercise(exerciseId);
    }
    onToggleExercise(exerciseId);
  };

  return (
    <motion.div
      key="workout"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 sm:p-8"
    >
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronRight className="w-5 h-5 rotate-180" />
        <span>Back to Workouts</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{workout.name}</h2>
            <p className="text-muted-foreground text-lg mb-4">{workout.description}</p>
          </div>
          <span className={cn('px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap', getDifficultyColor(workout.difficulty))}>
            {workout.difficulty}
          </span>
        </div>
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground font-medium">{workout.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground font-medium">{workout.calories} calories</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            <span className="text-foreground font-medium">{workout.category}</span>
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-primary font-medium italic">
            💪 {motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-foreground">Your Progress</h3>
          <span className="text-sm font-medium text-muted-foreground">
            {completedCount} / {workout.exercises.length} completed
          </span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground mb-4">Exercises</h3>
        {workout.exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn('cursor-pointer transition-all', exercise.completed && 'bg-muted/50')}
              onClick={() => handleToggleExercise(exercise.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                    exercise.completed ? 'bg-primary border-primary' : 'border-muted-foreground'
                  )}>
                    {exercise.completed && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={cn('text-lg font-semibold mb-1', exercise.completed ? 'text-muted-foreground line-through' : 'text-foreground')}>
                      {exercise.name}
                    </h4>
                    <p className="text-sm text-primary font-medium mb-2">{exercise.reps || exercise.duration}</p>
                    {exercise.instruction && <p className="text-sm text-muted-foreground mb-3">{exercise.instruction}</p>}
                    <a
                      href={`https://www.youtube.com/results?search_query=${exercise.youtubeSearch}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Watch Demo on YouTube
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4"
            onClick={onBack}
          >
            <Card className="max-w-md w-full" onClick={e => e.stopPropagation()}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">🎉 Workout Completed!</h3>
                <p className="text-muted-foreground mb-4">Great job—keep pushing! You're one step closer to your fitness goals.</p>
                
                <div className="flex items-center justify-center gap-4 mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-amber-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-center gap-2 text-purple-500">
                    <Zap className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-sm text-muted-foreground">Level</div>
                      <div className="font-bold">{user.level}</div>
                    </div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex items-center gap-2 text-amber-500">
                    <Trophy className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-sm text-muted-foreground">Total XP</div>
                      <div className="font-bold">{user.xp}</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={onBack}
                  className="w-full bg-primary text-primary-foreground font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Back to Workouts
                </button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
