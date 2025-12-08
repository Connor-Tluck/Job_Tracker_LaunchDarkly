"use client";

import { useState, useEffect } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext, setUserContext, getDemoUsers, UserContext } from "@/lib/launchdarkly/userContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RefreshCw, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserContextSwitcher() {
  const ldClient = useLDClient();
  const [currentUser, setCurrentUser] = useState<UserContext | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const demoUsers = getDemoUsers();

  useEffect(() => {
    // Load current user context
    const user = getOrCreateUserContext();
    setCurrentUser(user);
  }, []);

  const switchUser = async (user: UserContext) => {
    if (currentUser?.key === user.key || isSwitching) return; // Already selected or switching
    
    console.log('🔄 Switching user context:', {
      from: currentUser?.key,
      to: user.key,
      user: user
    });
    
    setIsSwitching(true);
    setUserContext(user);
    
    // Dispatch custom event for other components to react
    window.dispatchEvent(new CustomEvent('ld-user-context-changed'));
    
    // Re-identify with LaunchDarkly
    if (ldClient) {
      const ldContext = {
        key: user.key,
        email: user.email,
        name: user.name,
        custom: {
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          signupDate: user.signupDate,
          betaTester: user.betaTester,
          companySize: user.companySize,
          industry: user.industry,
        }
      };
      
      console.log('📤 Sending context to LaunchDarkly:', ldContext);
      
      try {
        await ldClient.identify(ldContext);
        console.log('✅ User identified with LaunchDarkly');
        
        // Check flag value immediately after identify
        const flagValue = ldClient.variation('show-premium-feature-demo', false);
        console.log('🎯 Flag value after identify:', flagValue);
        
        // Wait a bit longer for flags to propagate
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check flag value again
        const flagValueAfter = ldClient.variation('show-premium-feature-demo', false);
        console.log('🎯 Flag value after delay:', flagValueAfter);
        
        setCurrentUser(user);
      } catch (error) {
        console.error('❌ Failed to identify user:', error);
        setCurrentUser(user);
      }
    } else {
      console.warn('⚠️ LaunchDarkly client not available');
      setCurrentUser(user);
    }
    
    setIsSwitching(false);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-foreground-secondary" />
        <h3 className="font-semibold">User Context Switcher</h3>
      </div>
      <p className="text-sm text-foreground-secondary">
        Switch between demo users to test targeting rules. Flags update in real-time without page reload.
      </p>
      
      <div className="space-y-3">
        <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
          Current User
        </div>
        <div className={cn(
          "bg-background-tertiary p-4 rounded-lg text-sm transition-all duration-300",
          isSwitching && "opacity-50"
        )}>
          <div className="font-medium">{currentUser.name}</div>
          <div className="text-foreground-secondary text-xs mt-1">
            {currentUser.email} • {currentUser.role} • {currentUser.subscriptionTier}
            {currentUser.betaTester && " • Beta Tester"}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
          Switch To
        </div>
        <div className="space-y-3">
          {demoUsers.map((user) => {
            const isActive = currentUser.key === user.key;
            return (
              <Button
                key={user.key}
                variant={isActive ? "primary" : "outline"}
                size="lg"
                className={cn(
                  "w-full justify-start h-auto py-4 px-5 transition-all duration-200",
                  isActive && "ring-2 ring-primary/20 shadow-lg",
                  isSwitching && !isActive && "opacity-50"
                )}
                onClick={() => switchUser(user)}
                disabled={isSwitching}
              >
                <div className="flex-1 text-left">
                  <div className="font-semibold text-base">{user.name}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {user.email} • {user.subscriptionTier}
                    {user.betaTester && " • Beta"}
                  </div>
                </div>
                {isActive && (
                  <RefreshCw className={cn(
                    "w-5 h-5 ml-3 transition-transform",
                    isSwitching && "animate-spin"
                  )} />
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <p className="text-xs text-foreground-muted">
          💡 Use this to test targeting rules. Configure rules in LaunchDarkly dashboard for different user attributes.
        </p>
      </div>
    </Card>
  );
}

