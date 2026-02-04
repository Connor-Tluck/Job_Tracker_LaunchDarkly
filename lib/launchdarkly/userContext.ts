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
  // These attributes are the "inputs" to LaunchDarkly targeting rules.
  // We also reuse them for client-side gating decisions (upgrade vs 404).
  role: 'user' | 'admin' | 'beta-tester' | 'business';
  subscriptionTier: 'free' | 'premium' | 'enterprise' | 'business';
  signupDate: string; // ISO date string
  betaTester: boolean;
  companySize?: 'startup' | 'small' | 'medium' | 'large';
  industry?: string;
  isBusinessUser?: boolean;
  timezone?: string;
  locale?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
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
  {
    key: 'user-004',
    email: 'recruiter@techcorp.com',
    name: 'Business User',
    role: 'business',
    subscriptionTier: 'business',
    signupDate: '2024-02-01T00:00:00Z',
    betaTester: false,
    companySize: 'large',
    industry: 'Technology',
    isBusinessUser: true,
  },
];

export function getOrCreateUserContext(): UserContext {
  if (typeof window === 'undefined') {
    // Server-side: return default user
    // (Most pages are client components; this is mainly a safe fallback for SSR/import-time usage.)
    return DEMO_USERS[0];
  }

  // Check localStorage for existing user
  const stored = localStorage.getItem('ld-user-context');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return enrichWithLocale(parsed);
    } catch {
      // Invalid stored data, create new
    }
  }

  // Create new demo user (randomly select one)
  // This makes the demo more interesting: different users land in different LD segments/variations.
  const user = DEMO_USERS[Math.floor(Math.random() * DEMO_USERS.length)];
  const enriched = enrichWithLocale(user);
  localStorage.setItem('ld-user-context', JSON.stringify(enriched));
  return enriched;
}

export function setUserContext(user: UserContext): void {
  if (typeof window !== 'undefined') {
    const enriched = enrichWithLocale(user);
    localStorage.setItem('ld-user-context', JSON.stringify(enriched));
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

function enrichWithLocale(user: UserContext): UserContext {
  if (typeof window === 'undefined') {
    return user;
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = navigator.language || undefined;

  return {
    ...user,
    timezone,
    locale,
  };
}

export async function refreshUserLocation(): Promise<UserContext | null> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const stored = localStorage.getItem('ld-user-context');
        if (!stored) {
          resolve(null);
          return;
        }
        let current: UserContext;
        try {
          current = JSON.parse(stored);
        } catch {
          resolve(null);
          return;
        }
        const updated: UserContext = {
          ...current,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
        };
        localStorage.setItem('ld-user-context', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('ld-user-context-changed'));
        resolve(updated);
      },
      () => resolve(null),
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000,
      }
    );
  });
}

