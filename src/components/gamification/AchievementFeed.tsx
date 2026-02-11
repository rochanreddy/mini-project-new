import { Achievement } from '@/types/gamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { Trophy, Zap, Award, TrendingUp, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AchievementFeedProps {
  achievements: Achievement[];
}

const typeIcons = {
  workout_completed: Target,
  level_up: TrendingUp,
  badge_unlocked: Award,
  streak_milestone: Zap,
  challenge_completed: Trophy,
};

const typeColors = {
  workout_completed: 'bg-blue-500',
  level_up: 'bg-purple-500',
  badge_unlocked: 'bg-amber-500',
  streak_milestone: 'bg-orange-500',
  challenge_completed: 'bg-green-500',
};

export const AchievementFeed = ({ achievements }: AchievementFeedProps) => {
  const recentAchievements = achievements.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {recentAchievements.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No achievements yet. Complete workouts to earn your first achievement!
              </p>
            ) : (
              recentAchievements.map((achievement, index) => {
                const Icon = typeIcons[achievement.type];
                const colorClass = typeColors[achievement.type];

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {achievement.xpGained > 0 && (
                          <span className="text-xs text-amber-500 font-medium">
                            +{achievement.xpGained} XP
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(achievement.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
