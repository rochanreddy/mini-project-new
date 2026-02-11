import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { AppSidebar } from '@/components/fitness/AppSidebar';
import { HomeDashboard } from '@/components/fitness/HomeDashboard';
import { WorkoutDetail } from '@/components/fitness/WorkoutDetail';
import { workoutPlans, WorkoutPlan } from '@/data/workouts';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'workout'>('home');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPlan | null>(null);
  const [workoutData, setWorkoutData] = useState<WorkoutPlan[]>(workoutPlans);
  const [completedWorkouts, setCompletedWorkouts] = useState(0);

  const handleWorkoutSelect = (workout: WorkoutPlan) => {
    setSelectedWorkout(workout);
    setCurrentView('workout');
    setIsSidebarOpen(false);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedWorkout(null);
  };

  const handleExerciseToggle = (exerciseId: string) => {
    if (!selectedWorkout) return;

    const updatedExercises = selectedWorkout.exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
    );
    const updatedWorkout = { ...selectedWorkout, exercises: updatedExercises };
    setSelectedWorkout(updatedWorkout);
    setWorkoutData(prev => prev.map(w => (w.id === updatedWorkout.id ? updatedWorkout : w)));

    const allCompleted = updatedExercises.every(ex => ex.completed);
    if (allCompleted && !selectedWorkout.exercises.every(ex => ex.completed)) {
      setCompletedWorkouts(prev => prev + 1);
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

      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="lg:ml-64 min-h-screen ml-0">
        <AnimatePresence mode="wait">
          {currentView === 'home' ? (
            <HomeDashboard
              workoutData={workoutData}
              completedWorkouts={completedWorkouts}
              onSelectWorkout={handleWorkoutSelect}
            />
          ) : selectedWorkout ? (
            <WorkoutDetail
              workout={selectedWorkout}
              onBack={handleBackToHome}
              onToggleExercise={handleExerciseToggle}
            />
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
