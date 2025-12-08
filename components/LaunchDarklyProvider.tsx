"use client";

import { withLDProvider } from "launchdarkly-react-client-sdk";
import { ReactNode, useEffect } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext, UserContext } from "@/lib/launchdarkly/userContext";

interface LaunchDarklyProviderProps {
  children: ReactNode;
}

function LaunchDarklyProviderComponent({ children }: LaunchDarklyProviderProps) {
  const ldClient = useLDClient();
  
  useEffect(() => {
    if (!ldClient) return;
    
    // Get user context and identify with LaunchDarkly
    const userContext = getOrCreateUserContext();
    
    // Convert our UserContext to LaunchDarkly context format
    const ldContext = {
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
    
    // Identify user with LaunchDarkly for targeting
    ldClient.identify(ldContext);
  }, [ldClient]);

  return <>{children}</>;
}

// Wrap with LaunchDarkly provider
// Note: We'll identify the user after the client is initialized
export const LaunchDarklyProvider = withLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID || '',
  options: {
    bootstrap: 'localStorage', // Cache flags in localStorage for faster initial load
  },
  reactOptions: {
    useCamelCaseFlagKeys: false, // Use kebab-case flag keys as defined
  },
})(LaunchDarklyProviderComponent);
