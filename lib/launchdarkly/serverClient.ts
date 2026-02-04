/**
 * LaunchDarkly Server SDK Client
 * 
 * This file handles LaunchDarkly server-side client initialization
 * for use in API routes and server components.
 */

import { init, LDClient, LDContext } from "@launchdarkly/node-server-sdk";
import { Observability } from "@launchdarkly/observability-node";

let ldServerClient: LDClient | null = null;

/**
 * Initialize and get the LaunchDarkly server client
 * Uses singleton pattern to reuse the same client instance
 */
export async function getLDServerClient(): Promise<LDClient | null> {
  if (ldServerClient) {
    return ldServerClient;
  }

  // IMPORTANT: Replace this SDK key with your LaunchDarkly Production SDK Key
  // Get your SDK Key from: LaunchDarkly Dashboard → Project Settings → Environments → Production → SDK Key
  // Add it to your .env.local file as: LAUNCHDARKLY_SDK_KEY=your_sdk_key_here
  const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;
  
  if (!sdkKey) {
    console.warn(
      'LaunchDarkly SDK Key is not set. Please add LAUNCHDARKLY_SDK_KEY to your .env.local file.'
    );
    return null;
  }

  try {
    // Initialize the Node server-side SDK with the observability plugin so spans/telemetry can be exported to LaunchDarkly.
    // See: https://launchdarkly.com/docs/sdk/observability/node-js
    const client = init(sdkKey, {
      plugins: [
        new Observability({
          serviceName: "career-stack-chat",
          serviceVersion:
            process.env.VERCEL_GIT_COMMIT_SHA ||
            process.env.GIT_SHA ||
            process.env.npm_package_version ||
            "dev",
          environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "local",
        }),
      ],
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
  timezone?: string;
  locale?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
}): LDContext {
  return {
    kind: 'user',
    key: userContext.key,
    email: userContext.email,
    name: userContext.name,
    role: userContext.role,
    subscriptionTier: userContext.subscriptionTier,
    custom: {
      role: userContext.role,
      subscriptionTier: userContext.subscriptionTier,
      signupDate: userContext.signupDate,
      betaTester: userContext.betaTester,
      companySize: userContext.companySize,
      industry: userContext.industry,
      timezone: userContext.timezone,
      locale: userContext.locale,
      location: userContext.location,
    },
  };
}

