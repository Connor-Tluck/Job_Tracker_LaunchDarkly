"use client";

import { withLDProvider } from "launchdarkly-react-client-sdk";
import { ReactNode, useEffect, ComponentType } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext, refreshUserLocation } from "@/lib/launchdarkly/userContext";

/**
 * Client-side LaunchDarkly wiring.
 *
 * Interview TL;DR:
 * - `withLDProvider` boots the LD React SDK in the browser (using the *client-side ID*).
 * - Once the SDK is ready we call `identify()` with our user context, which triggers
 *   flag evaluation + targeting rules for that specific user.
 */
function LaunchDarklyProviderComponent({ children }: { children?: ReactNode }) {
  const ldClient = useLDClient();
  
  useEffect(() => {
    if (!ldClient) return;
    
    // Identify the current user with LaunchDarkly so targeting rules apply.
    // (In a real app, these attributes would come from your auth/session user profile.)
    const userContext = getOrCreateUserContext();
    
    const identifyWithContext = (ctx: typeof userContext) => {
      const ldContext = {
        kind: "user",
        key: ctx.key,
        email: ctx.email,
        name: ctx.name,
        role: ctx.role,
        subscriptionTier: ctx.subscriptionTier,
        custom: {
          role: ctx.role,
          subscriptionTier: ctx.subscriptionTier,
          signupDate: ctx.signupDate,
          betaTester: ctx.betaTester,
          companySize: ctx.companySize,
          industry: ctx.industry,
          timezone: ctx.timezone,
          locale: ctx.locale,
          location: ctx.location,
        }
      };
      ldClient.identify(ldContext);
    };

    // Triggers LaunchDarkly to evaluate flags for this context and update flag values in the SDK.
    identifyWithContext(userContext);

    // Best-effort: refresh location and re-identify to include lat/lng.
    refreshUserLocation().then((updated) => {
      if (updated) {
        identifyWithContext(updated);
      }
    });
  }, [ldClient]);

  return <>{children}</>;
}

// Wrap with LaunchDarkly provider
// Note: We'll identify the user after the client is initialized
const LaunchDarklyProviderInner = withLDProvider({
  // Client-side ID (safe to ship to browser). Do NOT use server SDK keys here.
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID || '',
  options: {
    // Bootstrapping means we can render using the last-known flag values immediately,
    // and then the SDK will refresh them in the background after identify().
    bootstrap: 'localStorage', // Cache flags in localStorage for faster initial load
  },
  reactOptions: {
    useCamelCaseFlagKeys: false, // Use kebab-case flag keys as defined
  },
})(LaunchDarklyProviderComponent) as ComponentType<{ children?: ReactNode }>;

export function LaunchDarklyProvider({ children }: { children?: ReactNode }) {
  return <LaunchDarklyProviderInner>{children}</LaunchDarklyProviderInner>;
}
