"use client";

import { withLDProvider } from "launchdarkly-react-client-sdk";
import { ReactNode, useEffect } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext, UserContext } from "@/lib/launchdarkly/userContext";

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
    
    // Map our demo user → LD context (attributes used for targeting).
    const ldContext = {
      kind: "user",
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
      }
    };
    
    // Triggers LaunchDarkly to evaluate flags for this context and update flag values in the SDK.
    ldClient.identify(ldContext);
  }, [ldClient]);

  return <>{children}</>;
}

// Wrap with LaunchDarkly provider
// Note: We'll identify the user after the client is initialized
export const LaunchDarklyProvider = withLDProvider({
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
})(LaunchDarklyProviderComponent);
