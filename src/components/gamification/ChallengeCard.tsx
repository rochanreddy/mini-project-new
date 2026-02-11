import { Challenge } from '@/types/gamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Trophy, Zap, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChallengeCardProps {
  challenge: Challenge;
}

const typeIcons = {
  daily: Calendar,
  weekly: Zap,
  monthly: Trophy,
};

const typeColors = {
  daily: 'bg-blue-500',
  weekly: 'bg-purple-500',
  monthly: 'bg-amber-500',
};

export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const Icon = typeIcons[challenge.type];
  const percentage = (challenge.progress / challenge.target) * 100;
  const timeLeft = formatDistanceToNow(challenge.expiresAt, { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={challenge.isCompleted ? 'border-green-500 bg-green-500/5' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${typeColors[challenge.type]}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
              </div>
            </div>
            <Badge variant={challenge.isCompleted ? 'default' : 'secondary'}>
              {challenge.isCompleted ? '✓ Complete' : challenge.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>
                  Progress: {challenge.progress} / {challenge.target}
                </span>
                <span className="text-muted-foreground">{Math.round(percentage)}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <Zap className="w-4 h-4" />
                <span className="font-medium">+{challenge.xpReward} XP</span>
              </div>
              {!challenge.isCompleted && (
                <span className="text-muted-foreground text-xs">Expires {timeLeft}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
