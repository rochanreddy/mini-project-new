import { Dumbbell, Home, Trophy, Users, UsersRound, Zap, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useGamification } from '@/contexts/GamificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AppSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const location = useLocation();
  const { user: gamificationUser } = useGamification();
  const { user: authUser } = useAuth();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/ai-coach', icon: Bot, label: 'AI Coach', badge: 'NEW' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/friends', icon: Users, label: 'Friends' },
    { path: '/groups', icon: UsersRound, label: 'Groups' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-full bg-card border-r border-border transition-transform duration-300 z-40 w-64',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="p-6 border-b border-border">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-foreground">FitFlow</h1>
          <p className="text-xs text-muted-foreground">Your Fitness Journey</p>
        </div>
        
        {authUser && (
          <Link 
            to="/profile" 
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={authUser.avatar} alt={authUser.name} />
              <AvatarFallback>{authUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{authUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{authUser.email}</p>
            </div>
          </Link>
        )}
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive(item.path)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-sm">Level {gamificationUser.level}</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{gamificationUser.xp}</p>
          <p className="text-xs text-muted-foreground">Total XP</p>
          <div className="mt-2 text-xs text-muted-foreground">
            🔥 {gamificationUser.currentStreak} day streak
          </div>
        </div>
      </div>
    </aside>
  );
}
