"use client";

import { useFeatureFlag, useFeatureFlags } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { getOrCreateUserContext } from "@/lib/launchdarkly/userContext";
import { Card } from "@/components/ui/Card";
import { Star, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";

export function TargetingDemoCard() {
  const showPremiumFeature = useFeatureFlag(FLAG_KEYS.SHOW_PREMIUM_FEATURE_DEMO, false);
  const userContext = getOrCreateUserContext();
  const ldClient = useLDClient();
  
  // Debug logging
  useEffect(() => {
    console.log('🎨 TargetingDemoCard render:', {
      showPremiumFeature,
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
  }, [showPremiumFeature, userContext.key, ldClient]);

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Targeting Demo</h3>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
          showPremiumFeature
            ? "bg-success/10 text-success border border-success/20"
            : "bg-danger/10 text-danger border border-danger/20"
        )}>
          {showPremiumFeature ? (
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

      {/* Premium Feature Content - Only shows when flag is ON */}
      {showPremiumFeature ? (
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

          <div className="bg-background-tertiary p-5 rounded-lg border border-border">
            <p className="text-xs font-semibold text-foreground mb-4 uppercase tracking-wider">
              Your Current Context
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-foreground-secondary text-xs">Email:</span>
                <div className="font-medium mt-1 break-all">{userContext.email}</div>
              </div>
              <div>
                <span className="text-foreground-secondary text-xs">Role:</span>
                <div className="font-medium mt-1">{userContext.role}</div>
              </div>
              <div>
                <span className="text-foreground-secondary text-xs">Subscription:</span>
                <div className="font-medium mt-1 capitalize">{userContext.subscriptionTier}</div>
              </div>
              <div>
                <span className="text-foreground-secondary text-xs">Beta Tester:</span>
                <div className="font-medium mt-1">{userContext.betaTester ? 'Yes' : 'No'}</div>
              </div>
              {userContext.companySize && (
                <div>
                  <span className="text-foreground-secondary text-xs">Company Size:</span>
                  <div className="font-medium mt-1 capitalize">{userContext.companySize}</div>
                </div>
              )}
              {userContext.industry && (
                <div>
                  <span className="text-foreground-secondary text-xs">Industry:</span>
                  <div className="font-medium mt-1">{userContext.industry}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-background-tertiary/50 border border-border-dashed rounded-lg p-8 text-center animate-in fade-in duration-300">
          <XCircle className="w-10 h-10 text-foreground-muted mx-auto mb-4" />
          <p className="text-sm font-semibold text-foreground mb-2">Premium Feature Hidden</p>
          <p className="text-xs text-foreground-secondary leading-relaxed">
            This content is hidden because your user context doesn&apos;t match the targeting rules.
            <br />
            <span className="mt-2 block">Switch users or configure targeting in LaunchDarkly dashboard.</span>
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-border">
        <p className="text-xs text-foreground-muted leading-relaxed">
          <strong className="text-foreground-secondary">Flag:</strong> <code className="bg-background-tertiary px-1.5 py-0.5 rounded text-xs font-mono">show-premium-feature-demo</code>
          <br />
          <span className="mt-1 block">Configure individual or rule-based targeting in LaunchDarkly dashboard to see this content appear/disappear in real-time.</span>
        </p>
      </div>
    </Card>
  );
}

