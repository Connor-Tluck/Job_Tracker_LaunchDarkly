/**
 * User Context for LaunchDarkly Targeting
 * 
 * In a production app, this would come from authentication/user profile.
 * For demo purposes, we'll use localStorage to persist a demo user.
 */

export interface UserContext {
  key: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'beta-tester';
  subscriptionTier: 'free' | 'premium' | 'enterprise';
  signupDate: string; // ISO date string
  betaTester: boolean;
  companySize?: 'startup' | 'small' | 'medium' | 'large';
  industry?: string;
}

const DEMO_USERS: UserContext[] = [
  {
    key: 'user-001',
    email: 'beta.tester@example.com',
    name: 'Beta Tester',
    role: 'beta-tester',
    subscriptionTier: 'premium',
    signupDate: '2024-01-15T00:00:00Z',
    betaTester: true,
    companySize: 'medium',
    industry: 'Technology',
  },
  {
    key: 'user-002',
    email: 'premium.user@example.com',
    name: 'Premium User',
    role: 'user',
    subscriptionTier: 'premium',
    signupDate: '2024-03-20T00:00:00Z',
    betaTester: false,
    companySize: 'small',
    industry: 'Finance',
  },
  {
    key: 'user-003',
    email: 'free.user@example.com',
    name: 'Free User',
    role: 'user',
    subscriptionTier: 'free',
    signupDate: '2024-06-10T00:00:00Z',
    betaTester: false,
    companySize: 'startup',
    industry: 'Retail',
  },
];

export function getOrCreateUserContext(): UserContext {
  if (typeof window === 'undefined') {
    // Server-side: return default user
    return DEMO_USERS[0];
  }

  // Check localStorage for existing user
  const stored = localStorage.getItem('ld-user-context');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid stored data, create new
    }
  }

  // Create new demo user (randomly select one)
  const user = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];
  localStorage.setItem('ld-user-context', JSON.stringify(user));
  return user;
}

export function setUserContext(user: UserContext): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ld-user-context', JSON.stringify(user));
  }
}

export function clearUserContext(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ld-user-context');
  }
}

/**
 * Get all available demo users for testing
 */
export function getDemoUsers(): UserContext[] {
  return DEMO_USERS;
}

