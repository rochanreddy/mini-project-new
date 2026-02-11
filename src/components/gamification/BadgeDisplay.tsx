import { Badge as BadgeType } from '@/types/gamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface BadgeDisplayProps {
  badges: BadgeType[];
  showAll?: boolean;
}

const rarityColors = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-amber-500',
};

export const BadgeDisplay = ({ badges, showAll = false }: BadgeDisplayProps) => {
  const displayBadges = showAll ? badges : badges.filter(b => b.isUnlocked).slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Badges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {displayBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-lg border-2 ${
                badge.isUnlocked ? 'border-primary' : 'border-muted opacity-50'
              } bg-card hover:shadow-lg transition-shadow cursor-pointer group`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2 relative">
                  {badge.isUnlocked ? (
                    badge.icon
                  ) : (
                    <div className="flex items-center justify-center">
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="font-medium text-sm mb-1">{badge.name}</p>
                <Badge
                  variant="outline"
                  className={`${rarityColors[badge.rarity]} text-white border-none text-xs`}
                >
                  {badge.rarity}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">{badge.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
