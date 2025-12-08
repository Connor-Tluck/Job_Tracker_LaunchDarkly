"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const isInternalUpdateRef = useRef(false);

  // Load user from localStorage
  const loadUser = useCallback(() => {
    const user = getOrCreateUserContext();
    setCurrentUser(user);
    return user;
  }, []);

  useEffect(() => {
    // Load initially
    loadUser();
    
    // Listen for user context changes from other components (like Header)
    // But NOT from this component itself (we update state directly)
    const handleUserContextChange = () => {
      // Skip if this is our own update
      if (isInternalUpdateRef.current) {
        isInternalUpdateRef.current = false;
        return;
      }
      // Use setTimeout to ensure localStorage write has completed
      setTimeout(() => {
        loadUser();
      }, 0);
    };
    
    // Listen for custom event
    window.addEventListener('ld-user-context-changed', handleUserContextChange);
    
    // Listen for storage events (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ld-user-context') {
        loadUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('ld-user-context-changed', handleUserContextChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadUser]);

  const switchUser = async (user: UserContext) => {
    if (currentUser?.key === user.key || isSwitching) return; // Already selected or switching
    
    console.log('🔄 Switching user context:', {
      from: currentUser?.key,
      to: user.key,
      user: user
    });
    
    setIsSwitching(true);
    
    // Save to localStorage FIRST (synchronously)
    setUserContext(user);
    
    // Update state IMMEDIATELY - use the user object directly, not a function
    // This ensures React sees it as a new value and updates immediately
    setCurrentUser({ ...user }); // Create new object reference to force update
    
    console.log('✅ State updated to:', user.name, user.key);
    
    // Mark this as an internal update so our event listener doesn't overwrite it
    isInternalUpdateRef.current = true;
    
    // Dispatch custom event for other components AFTER state update
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('ld-user-context-changed'));
    });
    
    // Re-identify with LaunchDarkly (async, but don't block UI)
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
      
      // Don't await - let it run in background
      ldClient.identify(ldContext)
        .then(() => {
          console.log('✅ User identified with LaunchDarkly');
        })
        .catch((error) => {
          console.error('❌ Failed to identify user:', error);
        })
        .finally(() => {
          setIsSwitching(false);
        });
    } else {
      console.warn('⚠️ LaunchDarkly client not available');
      setIsSwitching(false);
    }
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
          <div className="font-medium" key={`name-${currentUser.key}`}>{currentUser.name}</div>
          <div className="text-foreground-secondary text-xs mt-1" key={`details-${currentUser.key}`}>
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

