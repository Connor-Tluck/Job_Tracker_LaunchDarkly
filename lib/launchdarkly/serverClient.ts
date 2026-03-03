/**
 * LaunchDarkly Server SDK Client
 * 
 * This file handles LaunchDarkly server-side client initialization
 * for use in API routes and server components.
 */

import { init, LDClient, LDContext } from "@launchdarkly/node-server-sdk";
import { Observability } from "@launchdarkly/observability-node";
import { createMultiContext } from "@/lib/launchdarkly/multiContext";

let ldServerClient: LDClient | null = null;
let initPromise: Promise<LDClient | null> | null = null;

/**
 * Initialize and get the LaunchDarkly server client.
 * Uses a shared promise so concurrent callers wait on the same init.
 */
export async function getLDServerClient(): Promise<LDClient | null> {
  if (ldServerClient) {
    return ldServerClient;
  }

  if (initPromise) {
    return initPromise;
  }

  const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;

  if (!sdkKey) {
    console.warn(
      'LaunchDarkly SDK Key is not set. Please add LAUNCHDARKLY_SDK_KEY to your .env.local file.'
    );
    return null;
  }

  initPromise = (async () => {
    try {
      const client = init(sdkKey, {
        privateAttributes: ['email', 'signupDate'],
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

      await client.waitForInitialization();

      ldServerClient = client;
      return client;
    } catch (error) {
      console.error('Failed to initialize LaunchDarkly server client:', error);
      initPromise = null;
      return null;
    }
  })();

  return initPromise;
}

/**
 * Convert a UserContext (from userContext.ts) into an LDContext.
 *
 * Returns a single "user" context by default. If you also pass device /
 * organization attributes it returns a multi-context via createMultiContext.
 */
export function convertToLDContext(
  userContext: {
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
  },
  device?: { key: string; os: string; type: string; version: string },
  organization?: { key: string; name: string; region: string; employees?: number },
): LDContext {
  return createMultiContext({
    user: {
      key: userContext.key,
      name: userContext.name ?? '',
      email: userContext.email,
      role: userContext.role ?? 'user',
      subscriptionTier: userContext.subscriptionTier ?? 'free',
      metro: undefined,
      industry: userContext.industry,
      companySize: userContext.companySize,
      signupDate: userContext.signupDate,
      betaTester: userContext.betaTester,
    },
    device,
    organization,
  }) as unknown as LDContext;
}

