"use client";

import { withLDProvider } from "launchdarkly-react-client-sdk";
import { ReactNode, useEffect, useRef, ComponentType } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { refreshUserLocation } from "@/lib/launchdarkly/userContext";
import type { UserContext } from "@/lib/launchdarkly/userContext";
import { createMultiContext, createAnonymousContext } from "@/lib/launchdarkly/multiContext";

function LaunchDarklyProviderComponent({ children }: { children?: ReactNode }) {
  const ldClient = useLDClient();
  const identifiedKeyRef = useRef<string | null>(null);
  const didInitRef = useRef(false);

  useEffect(() => {
    if (!ldClient) return;
    if (didInitRef.current) return;
    didInitRef.current = true;

    const buildLDContext = (ctx: UserContext) =>
      createMultiContext({
        user: {
          key: ctx.key,
          name: ctx.name,
          email: ctx.email,
          role: ctx.role,
          subscriptionTier: ctx.subscriptionTier,
          industry: ctx.industry,
          companySize: ctx.companySize,
          signupDate: ctx.signupDate,
          betaTester: ctx.betaTester,
        },
        device: {
          key: `dvc-${ctx.key}`,
          os: navigator.platform || 'unknown',
          type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          version: '1.0.0',
        },
        organization: ctx.industry ? {
          key: `org-${ctx.key}`,
          name: ctx.industry,
          region: ctx.timezone?.startsWith('America') ? 'NA' : 'OTHER',
        } : undefined,
      });

    const identifyFromStorage = () => {
      const stored = localStorage.getItem('ld-user-context');
      if (!stored) {
        if (identifiedKeyRef.current !== '__anon__') {
          identifiedKeyRef.current = '__anon__';
          ldClient.identify(createAnonymousContext());
        }
        return;
      }
      try {
        const ctx = JSON.parse(stored) as UserContext;
        if (identifiedKeyRef.current !== ctx.key) {
          identifiedKeyRef.current = ctx.key;
          ldClient.identify(buildLDContext(ctx));
        }
      } catch {
        if (identifiedKeyRef.current !== '__anon__') {
          identifiedKeyRef.current = '__anon__';
          ldClient.identify(createAnonymousContext());
        }
      }
    };

    identifyFromStorage();

    refreshUserLocation().then((updated) => {
      if (updated) {
        identifiedKeyRef.current = updated.key;
        ldClient.identify(buildLDContext(updated));
      }
    });

    const handleContextChanged = () => identifyFromStorage();
    window.addEventListener('ld-user-context-changed', handleContextChanged);
    return () => window.removeEventListener('ld-user-context-changed', handleContextChanged);
  }, [ldClient]);

  return <>{children}</>;
}

// Wrap with LaunchDarkly provider
// Note: We'll identify the user after the client is initialized
const LaunchDarklyProviderInner = withLDProvider({
  // Client-side ID (safe to ship to browser). Do NOT use server SDK keys here.
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID || '',
  options: {
    bootstrap: 'localStorage',

    // SDK-level private attributes — the SDK will never send these attribute
    // values in event data, regardless of which context kind they appear on.
    // This is in addition to the per-context _meta.privateAttributes set in
    // multiContext.ts, and demonstrates the SDK client-level configuration.
    // @see https://launchdarkly.com/docs/sdk/features/private-attributes#javascript
    privateAttributes: ['email', 'signupDate'],
  },
  reactOptions: {
    useCamelCaseFlagKeys: false,
  },
})(LaunchDarklyProviderComponent) as ComponentType<{ children?: ReactNode }>;

export function LaunchDarklyProvider({ children }: { children?: ReactNode }) {
  return <LaunchDarklyProviderInner>{children}</LaunchDarklyProviderInner>;
}
