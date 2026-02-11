export interface Exercise {
  id: string;
  name: string;
  reps?: string;
  duration?: string;
  instruction?: string;
  completed: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  calories: number;
  image: string;
  exercises: Exercise[];
  category: string;
}

export const workoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Full Body Blast',
    description: 'Complete full-body workout targeting all major muscle groups for strength and endurance',
    difficulty: 'Beginner',
    duration: 30,
    calories: 250,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
    category: 'Strength',
    exercises: [
      { id: 'e1', name: 'Push-ups', reps: '15 reps', instruction: 'Keep your core tight and back straight', completed: false },
      { id: 'e2', name: 'Squats', reps: '20 reps', instruction: 'Lower until thighs are parallel to ground', completed: false },
      { id: 'e3', name: 'Plank', duration: '45 seconds', instruction: 'Hold steady, engage your core', completed: false },
      { id: 'e4', name: 'Lunges', reps: '12 reps each leg', instruction: 'Step forward and lower your hips', completed: false },
      { id: 'e5', name: 'Mountain Climbers', duration: '30 seconds', instruction: 'Keep a steady pace', completed: false },
    ]
  },
  {
    id: '2',
    name: 'Cardio Burn',
    description: 'High-intensity cardio workout designed to maximize calorie burn and improve cardiovascular health',
    difficulty: 'Intermediate',
    duration: 25,
    calories: 300,
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=300&fit=crop',
    category: 'Cardio',
    exercises: [
      { id: 'e6', name: 'Jumping Jacks', duration: '60 seconds', instruction: 'Keep a steady rhythm', completed: false },
      { id: 'e7', name: 'Burpees', reps: '15 reps', instruction: 'Full range of motion', completed: false },
      { id: 'e8', name: 'High Knees', duration: '45 seconds', instruction: 'Drive knees up high', completed: false },
      { id: 'e9', name: 'Jump Squats', reps: '12 reps', instruction: 'Explosive movement', completed: false },
    ]
  },
  {
    id: '3',
    name: 'Core Crusher',
    description: 'Targeted core workout to build a strong, stable midsection and improve overall balance',
    difficulty: 'Beginner',
    duration: 20,
    calories: 150,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    category: 'Core',
    exercises: [
      { id: 'e10', name: 'Crunches', reps: '20 reps', instruction: 'Lift shoulders off the ground', completed: false },
      { id: 'e11', name: 'Russian Twists', reps: '15 reps each side', instruction: 'Rotate your torso', completed: false },
      { id: 'e12', name: 'Leg Raises', reps: '12 reps', instruction: 'Keep legs straight', completed: false },
      { id: 'e13', name: 'Bicycle Crunches', reps: '20 reps', instruction: 'Alternate sides smoothly', completed: false },
    ]
  },
  {
    id: '4',
    name: 'Flexibility Flow',
    description: 'Gentle stretching and mobility routine to improve flexibility and reduce muscle tension',
    difficulty: 'Beginner',
    duration: 15,
    calories: 80,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    category: 'Flexibility',
    exercises: [
      { id: 'e14', name: 'Hamstring Stretch', duration: '30 seconds each leg', instruction: 'Hold the stretch gently', completed: false },
      { id: 'e15', name: 'Shoulder Rolls', reps: '10 reps', instruction: 'Slow and controlled', completed: false },
      { id: 'e16', name: 'Cat-Cow Stretch', reps: '10 reps', instruction: 'Flow with your breath', completed: false },
    ]
  },
  {
    id: '5',
    name: 'Power HIIT',
    description: 'Advanced high-intensity interval training for maximum fat loss and athletic performance',
    difficulty: 'Advanced',
    duration: 35,
    calories: 400,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
    category: 'HIIT',
    exercises: [
      { id: 'e17', name: 'Box Jumps', reps: '15 reps', instruction: 'Land softly on the box', completed: false },
      { id: 'e18', name: 'Kettlebell Swings', reps: '20 reps', instruction: 'Drive through your hips', completed: false },
      { id: 'e19', name: 'Battle Ropes', duration: '30 seconds', instruction: 'Maintain intensity', completed: false },
      { id: 'e20', name: 'Sprint Intervals', duration: '45 seconds', instruction: 'All-out effort', completed: false },
    ]
  },
  {
    id: '6',
    name: 'Upper Body Strength',
    description: 'Build upper body strength and muscle definition with targeted exercises',
    difficulty: 'Intermediate',
    duration: 40,
    calories: 280,
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop',
    category: 'Strength',
    exercises: [
      { id: 'e21', name: 'Pull-ups', reps: '8 reps', instruction: 'Full range of motion', completed: false },
      { id: 'e22', name: 'Dips', reps: '12 reps', instruction: 'Lower until elbows at 90 degrees', completed: false },
      { id: 'e23', name: 'Pike Push-ups', reps: '10 reps', instruction: 'Target shoulders', completed: false },
      { id: 'e24', name: 'Diamond Push-ups', reps: '12 reps', instruction: 'Hands close together', completed: false },
    ]
  },
];

export const motivationalQuotes = [
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Success starts with self-discipline.",
  "Push yourself because no one else is going to do it for you.",
  "The pain you feel today will be the strength you feel tomorrow.",
];
