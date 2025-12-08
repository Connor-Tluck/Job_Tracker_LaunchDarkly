"use client";

import { withLDProvider } from "launchdarkly-react-client-sdk";
import { ReactNode } from "react";

interface LaunchDarklyProviderProps {
  children: ReactNode;
}

function LaunchDarklyProviderComponent({ children }: LaunchDarklyProviderProps) {
  return <>{children}</>;
}

// Wrap with LaunchDarkly provider
export const LaunchDarklyProvider = withLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID || '',
  options: {
    bootstrap: 'localStorage', // Cache flags in localStorage for faster initial load
  },
  reactOptions: {
    useCamelCaseFlagKeys: false, // Use kebab-case flag keys as defined
  },
})(LaunchDarklyProviderComponent);

