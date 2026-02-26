"use client";

import { useFeatureFlag, useFeatureFlags } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { getOrCreateUserContext, UserContext } from "@/lib/launchdarkly/userContext";
import { Card } from "@/components/ui/Card";
import { Star, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { useFlagsReady } from "@/hooks/useFlagsReady";

export function TargetingDemoCard() {
  const flags = useFlags();
  const flagsReady = useFlagsReady();
  const [checkedFlagValue, setCheckedFlagValue] = useState(false);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [checkedFlagKey, setCheckedFlagKey] = useState<string>(FLAG_KEYS.SHOW_PREMIUM_FEATURE_DEMO);
  const previousValueRef = useRef<boolean | undefined>(undefined);

  // Load user context
  const loadUserContext = useCallback(() => {
    const user = getOrCreateUserContext();
    setUserContext(user);
  }, []);

  useEffect(() => {
    // Load initially
    loadUserContext();
    
    // Listen for user context changes
    const handleUserContextChange = () => {
      loadUserContext();
    };
    
    // Listen for custom event
    window.addEventListener('ld-user-context-changed', handleUserContextChange);
    
    // Listen for storage events (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ld-user-context') {
        loadUserContext();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('ld-user-context-changed', handleUserContextChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadUserContext]);

  useEffect(() => {
    if (!flagsReady) {
      return; // Don't update if flags aren't loaded yet
    }

    // Choose which flag to demonstrate based on user grouping:
    // - Job Seeker Role: show-premium-feature-demo
    // - Business Role: show-business-user-mode
    const isBusinessRole =
      userContext?.role === "business" ||
      userContext?.subscriptionTier === "business" ||
      userContext?.isBusinessUser === true;

    const activeKey = isBusinessRole
      ? FLAG_KEYS.SHOW_BUSINESS_USER_MODE
      : FLAG_KEYS.SHOW_PREMIUM_FEATURE_DEMO;

    // Update the UI label
    if (checkedFlagKey !== activeKey) {
      setCheckedFlagKey(activeKey);
    }

    // Extract flag value for the active key
    const currentValue = flags[activeKey] ?? false;
    
    // Only update state if value actually changed (prevents unnecessary re-renders)
    if (previousValueRef.current !== currentValue) {
      setCheckedFlagValue(currentValue);
      previousValueRef.current = currentValue;
    }
  }, [flags, flagsReady, userContext, checkedFlagKey]);
  
  const ldClient = useLDClient();
  
  // Debug logging
  useEffect(() => {
    if (flagsReady && userContext) {
    console.log('🎨 TargetingDemoCard render:', {
      checkedFlagValue,
      checkedFlagKey,
      userContext: {
        key: userContext.key,
        email: userContext.email,
        subscriptionTier: userContext.subscriptionTier,
        betaTester: userContext.betaTester,
        role: userContext.role
      }
    });
    
    // Also check flag value directly from client
    if (ldClient) {
      const directFlagValue = ldClient.variation('show-premium-feature-demo', false);
      console.log('🎯 Direct flag value from client:', directFlagValue);
    }
    }
  }, [checkedFlagValue, checkedFlagKey, userContext?.key, ldClient, flagsReady]);

  // Don't render until flags are ready and user context is loaded
  if (!flagsReady || !userContext) {
    return (
      <Card className="p-6 space-y-5">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-background-tertiary rounded w-1/2"></div>
          <div className="h-4 bg-background-tertiary rounded w-3/4"></div>
          <div className="h-32 bg-background-tertiary rounded"></div>
        </div>
      </Card>
    );
  }

  const isBusinessUser =
    userContext.role === "business" ||
    userContext.subscriptionTier === "business" ||
    userContext.isBusinessUser === true;

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Targeting Demo</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg text-xs border border-border bg-background-tertiary text-foreground-secondary font-mono">
            {checkedFlagKey}
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
            checkedFlagValue
              ? "bg-success/10 text-success border border-success/20"
              : "bg-danger/10 text-danger border border-danger/20"
          )}>
            {checkedFlagValue ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>FLAG ON</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4" />
              <span>FLAG OFF</span>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Demo content - depends on which flag we're checking */}
      {!isBusinessUser && checkedFlagValue ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold mb-3">
                  Premium Feature - Active
                </div>
                <h4 className="text-xl font-semibold mb-2">Exclusive Premium Feature</h4>
                <p className="text-sm text-foreground-secondary leading-relaxed">
                  This content is visible because your user context matches the targeting rules configured in LaunchDarkly!
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : isBusinessUser && checkedFlagValue ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-amber-500/20">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 text-xs font-semibold mb-3">
                  Business User
                </div>
                <h4 className="text-xl font-semibold mb-2">Business User Card</h4>
                <p className="text-sm text-foreground-secondary leading-relaxed">
                  Business User Content Shown
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-background-tertiary/50 border border-border-dashed rounded-lg p-8 text-center animate-in fade-in duration-300">
          <XCircle className="w-10 h-10 text-foreground-muted mx-auto mb-4" />
          <p className="text-sm font-semibold text-foreground mb-2">
            {isBusinessUser ? "Business Access Hidden" : "Premium Feature Hidden"}
          </p>
          <p className="text-xs text-foreground-secondary leading-relaxed">
            This content is hidden because your user context doesn&apos;t match the targeting rules.
            <br />
            <span className="mt-2 block">Switch users or configure targeting in LaunchDarkly dashboard.</span>
          </p>
        </div>
      )}

      {/* Current Context - Always visible regardless of flag state */}
      <div className="bg-background-tertiary p-5 rounded-lg border border-border">
        <p className="text-xs font-semibold text-foreground mb-4 uppercase tracking-wider">
          Your Current Context
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm" key={`context-${userContext.key}`}>
          <div>
            <span className="text-foreground-secondary text-xs">Email:</span>
            <div className="font-medium mt-1 break-all" key={`email-${userContext.key}`}>{userContext.email}</div>
          </div>
          <div>
            <span className="text-foreground-secondary text-xs">Role:</span>
            <div className="font-medium mt-1" key={`role-${userContext.key}`}>{userContext.role}</div>
          </div>
          <div>
            <span className="text-foreground-secondary text-xs">Subscription:</span>
            <div className="font-medium mt-1 capitalize" key={`subscription-${userContext.key}`}>{userContext.subscriptionTier}</div>
          </div>
          <div>
            <span className="text-foreground-secondary text-xs">Beta Tester:</span>
            <div className="font-medium mt-1" key={`beta-${userContext.key}`}>{userContext.betaTester ? 'Yes' : 'No'}</div>
          </div>
          {userContext.companySize && (
            <div>
              <span className="text-foreground-secondary text-xs">Company Size:</span>
              <div className="font-medium mt-1 capitalize" key={`company-${userContext.key}`}>{userContext.companySize}</div>
            </div>
          )}
          {userContext.industry && (
            <div>
              <span className="text-foreground-secondary text-xs">Industry:</span>
              <div className="font-medium mt-1" key={`industry-${userContext.key}`}>{userContext.industry}</div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-foreground-muted leading-relaxed">
          <strong className="text-foreground-secondary">Flag:</strong>{" "}
          <code className="bg-background-tertiary px-1.5 py-0.5 rounded text-xs font-mono">
            {checkedFlagKey}
          </code>
          <br />
          <span className="mt-1 block">Configure individual or rule-based targeting in LaunchDarkly dashboard to see this content appear/disappear in real-time.</span>
        </p>
      </div>
    </Card>
  );
}

