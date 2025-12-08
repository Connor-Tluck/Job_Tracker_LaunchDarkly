/**
 * LaunchDarkly Server SDK Client
 * 
 * This file handles LaunchDarkly server-side client initialization
 * for use in API routes and server components.
 */

import * as LaunchDarkly from 'launchdarkly-node-server-sdk';

let ldServerClient: LaunchDarkly.LDClient | null = null;

/**
 * Initialize and get the LaunchDarkly server client
 * Uses singleton pattern to reuse the same client instance
 */
export async function getLDServerClient(): Promise<LaunchDarkly.LDClient | null> {
  if (ldServerClient) {
    return ldServerClient;
  }

  const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;
  
  if (!sdkKey) {
    console.warn(
      'LaunchDarkly SDK Key is not set. Please add LAUNCHDARKLY_SDK_KEY to your .env.local file.'
    );
    return null;
  }

  try {
    const client = LaunchDarkly.init(sdkKey, {
      // Optional: Add configuration options here
    });

    // Wait for client to be ready
    await client.waitForInitialization();
    
    ldServerClient = client;
    return client;
  } catch (error) {
    console.error('Failed to initialize LaunchDarkly server client:', error);
    return null;
  }
}

/**
 * Convert UserContext to LaunchDarkly context format
 */
export function convertToLDContext(userContext: {
  key: string;
  email?: string;
  name?: string;
  role?: string;
  subscriptionTier?: string;
  signupDate?: string;
  betaTester?: boolean;
  companySize?: string;
  industry?: string;
}): LaunchDarkly.LDContext {
  return {
    kind: 'user',
    key: userContext.key,
    email: userContext.email,
    name: userContext.name,
    custom: {
      role: userContext.role,
      subscriptionTier: userContext.subscriptionTier,
      signupDate: userContext.signupDate,
      betaTester: userContext.betaTester,
      companySize: userContext.companySize,
      industry: userContext.industry,
    },
  };
}

