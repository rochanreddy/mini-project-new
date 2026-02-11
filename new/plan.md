

# FitFlow - Fitness Workout Tracker

A sleek fitness app where users can browse workout plans, track exercise completion, and see their progress.

## Pages & Features

### 1. Home Dashboard
- Motivational hero section with rotating quotes
- Stats cards showing calories burned, workouts completed, and day streak
- Grid of workout plan cards with images, difficulty badges, duration, and calorie info
- Smooth hover animations on cards

### 2. Workout Detail View
- Back navigation to home
- Workout header with name, description, difficulty badge, duration, calories, and category
- Motivational quote banner
- Progress bar showing completion percentage
- Interactive exercise checklist — tap to mark exercises complete with animations
- Each exercise shows name, reps/duration, and instructions

### 3. Workout Completion Celebration
- Modal overlay appears when all exercises are checked off
- Award icon with congratulatory message
- Button to return to workout list
- Completed workout count increments

### 4. Sidebar Navigation
- App branding (FitFlow logo)
- Navigation links: Home, Progress, Profile
- Workout streak counter at the bottom
- Responsive: slides in on mobile with overlay, always visible on desktop

## Design & UX
- Clean, modern design using existing shadcn/ui Card and Progress components
- Framer Motion animations for page transitions, card interactions, and exercise list staggering
- Fully responsive layout with mobile hamburger menu
- Difficulty color coding: green (Beginner), yellow (Intermediate), red (Advanced)
- 6 pre-built workout plans across categories: Strength, Cardio, Core, Flexibility, HIIT

## Technical Notes
- Add `framer-motion` as a new dependency
- All state managed locally (no backend needed)
- Adapts the provided Tailwind v4 styles to the existing Tailwind v3 configuration
- Reuses existing project components (Card, Progress) rather than overwriting them

