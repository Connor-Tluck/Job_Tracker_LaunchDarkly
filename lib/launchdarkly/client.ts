/**
 * LaunchDarkly Client Configuration
 * 
 * This file handles LaunchDarkly client initialization.
 * The actual provider setup is done in app/layout.tsx using withLDProvider.
 */

// IMPORTANT: Replace this Client-side ID with your LaunchDarkly Client-side ID
// Get your Client-side ID from: LaunchDarkly Dashboard → Account Settings → Authorization
// Add it to your .env.local file as: NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID=your_client_id_here
// Note: This is different from the SDK Key - use the Client-side ID for React SDK
export const LD_CLIENT_SIDE_ID = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID || '';

if (!LD_CLIENT_SIDE_ID && typeof window !== 'undefined') {
  console.warn(
    'LaunchDarkly Client ID is not set. Please add NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID to your .env.local file.'
  );
}

