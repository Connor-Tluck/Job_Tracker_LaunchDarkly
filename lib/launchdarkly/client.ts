/**
 * LaunchDarkly Client Configuration
 * 
 * This file handles LaunchDarkly client initialization.
 * The actual provider setup is done in app/layout.tsx using withLDProvider.
 */

export const LD_CLIENT_SIDE_ID = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID || '';

if (!LD_CLIENT_SIDE_ID && typeof window !== 'undefined') {
  console.warn(
    'LaunchDarkly Client ID is not set. Please add NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID to your .env.local file.'
  );
}

