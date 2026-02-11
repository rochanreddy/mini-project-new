import { useGamification } from '@/contexts/GamificationContext';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export const XPBar = () => {
  const { user, getXPProgress } = useGamification();
  const { current, required, percentage } = getXPProgress();

  return (
    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold"
            >
              {user.level}
            </motion.div>
            <div>
              <p className="text-sm font-medium">Level {user.level}</p>
              <p className="text-xs text-muted-foreground">
                {current} / {required} XP
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-purple-500">{user.xp}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
        </div>
        <Progress value={percentage} className="h-3" />
      </CardContent>
    </Card>
  );
};
