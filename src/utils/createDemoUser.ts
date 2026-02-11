// Demo user creation utility
export const createDemoUser = () => {
  const MOCK_USERS_KEY = 'fitflow_users';
  
  const demoUser = {
    id: 'demo_user_123',
    email: 'demo@fitflow.com',
    password: 'demo123',
    name: 'Demo User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser',
    createdAt: new Date('2024-01-01').toISOString(),
  };

  const users = localStorage.getItem(MOCK_USERS_KEY);
  const usersArray = users ? JSON.parse(users) : [];

  // Check if demo user already exists
  const demoExists = usersArray.find((u: any) => u.email === 'demo@fitflow.com');
  
  if (!demoExists) {
    usersArray.push(demoUser);
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(usersArray));
    console.log('✅ Demo user created: demo@fitflow.com / demo123');
  }
};

// Auto-create demo user on app load
if (typeof window !== 'undefined') {
  createDemoUser();
}
