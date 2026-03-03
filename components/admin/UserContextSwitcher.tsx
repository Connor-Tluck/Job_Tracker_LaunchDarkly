"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext, setUserContext, clearUserContext, getDemoUsers, UserContext } from "@/lib/launchdarkly/userContext";
import { createMultiContext, createAnonymousContext, PRIVATE_ATTRIBUTES } from "@/lib/launchdarkly/multiContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RefreshCw, User, Monitor, Building2, EyeOff, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserContextSwitcher() {
  const ldClient = useLDClient();
  const [currentUser, setCurrentUser] = useState<UserContext | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const demoUsers = getDemoUsers();
  const isInternalUpdateRef = useRef(false);

  // UI grouping only: Job Seeker role vs Business role
  const { jobSeekerUsers, businessUsers } = useMemo(() => {
    const isBusiness = (u: UserContext) =>
      u.subscriptionTier === "business" || u.role === "business" || u.isBusinessUser === true;

    return {
      jobSeekerUsers: demoUsers.filter((u) => !isBusiness(u)),
      businessUsers: demoUsers.filter((u) => isBusiness(u)),
    };
  }, [demoUsers]);

  // Load user from localStorage — if nothing stored, we're anonymous
  const loadUser = useCallback(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('ld-user-context');
    if (!stored) {
      setCurrentUser(null);
      setIsAnonymous(true);
      return;
    }
    try {
      const user = JSON.parse(stored) as UserContext;
      setCurrentUser(user);
      setIsAnonymous(false);
    } catch {
      setCurrentUser(null);
      setIsAnonymous(true);
    }
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
    if (!isAnonymous && currentUser?.key === user.key) return;
    if (isSwitching) return;
    
    console.log('🔄 Switching user context:', {
      from: currentUser?.key,
      to: user.key,
      user: user
    });
    
    setIsSwitching(true);
    
    // Save to localStorage FIRST (synchronously) so the rest of the app can read the new "logged-in user".
    // Then we call `ldClient.identify()` so LaunchDarkly re-evaluates flags/experiments for this user.
    setUserContext(user);
    
    // Update state IMMEDIATELY - use the user object directly, not a function
    // This ensures React sees it as a new value and updates immediately
    setCurrentUser({ ...user });
    setIsAnonymous(false);
    
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
      const ldContext = buildMultiContext(user);
      
      console.log('📤 Sending multi-context to LaunchDarkly:', ldContext);
      
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

  const regenerateKey = async () => {
    if (!currentUser) return;
    if (isSwitching) return;

    setIsSwitching(true);

    const newKey =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto as Crypto).randomUUID()
        : `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const updated: UserContext = { ...currentUser, key: newKey };

    // Persist first, then update UI immediately.
    setUserContext(updated);
    setCurrentUser({ ...updated });
    isInternalUpdateRef.current = true;

    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent("ld-user-context-changed"));
    });

    if (ldClient) {
      const ldContext = buildMultiContext(updated);

      ldClient
        .identify(ldContext)
        .catch(() => {
          // ignore
        })
        .finally(() => {
          setIsSwitching(false);
        });
      return;
    }

    setIsSwitching(false);
  };

  const logOut = async () => {
    if (isAnonymous || isSwitching) return;
    setIsSwitching(true);

    clearUserContext();
    setCurrentUser(null);
    setIsAnonymous(true);
    isInternalUpdateRef.current = true;

    requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('ld-user-context-changed'));
    });

    if (ldClient) {
      const anonCtx = createAnonymousContext();
      ldClient
        .identify(anonCtx)
        .catch(() => {})
        .finally(() => setIsSwitching(false));
      return;
    }
    setIsSwitching(false);
  };

  const buildMultiContext = useCallback((user: UserContext) => {
    return createMultiContext({
      user: {
        key: user.key,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        industry: user.industry,
        companySize: user.companySize,
        signupDate: user.signupDate,
        betaTester: user.betaTester,
      },
      device: {
        key: `dvc-${user.key}`,
        os: navigator.platform || 'unknown',
        type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        version: '1.0.0',
      },
      organization: user.industry ? {
        key: `org-${user.key}`,
        name: user.industry,
        region: Intl.DateTimeFormat().resolvedOptions().timeZone?.startsWith('America') ? 'NA' : 'OTHER',
      } : undefined,
    });
  }, []);

  const renderAttr = (name: string, value: string | undefined, kind: keyof typeof PRIVATE_ATTRIBUTES) => {
    const isPrivate = (PRIVATE_ATTRIBUTES[kind] as readonly string[]).includes(name);
    return (
      <div className="flex items-center gap-1">
        <span className="text-foreground">{name}</span>: {value ?? 'n/a'}
        {isPrivate && <EyeOff className="w-3 h-3 text-warning ml-1 shrink-0" title="Private attribute" />}
      </div>
    );
  };

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-foreground-secondary" />
        <h3 className="font-semibold">User Context Switcher</h3>
      </div>
      <p className="text-sm text-foreground-secondary">
        Switch between demo users to test targeting rules, or log out to test anonymous context evaluation.
      </p>
      
      {/* Current User / Anonymous indicator */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
          Current User
        </div>
        <div className={cn(
          "bg-background-tertiary p-4 rounded-lg text-sm transition-all duration-300",
          isSwitching && "opacity-50"
        )}>
          {isAnonymous ? (
            <>
              <div className="font-medium text-foreground-muted">Anonymous User (No Login)</div>
              <div className="text-foreground-secondary text-xs mt-1">
                anonymous: true
              </div>
            </>
          ) : currentUser ? (
            <>
              <div className="font-medium">{currentUser.name}</div>
              <div className="text-foreground-secondary text-xs mt-1">
                {currentUser.email} • {currentUser.role} • {currentUser.subscriptionTier}
                {currentUser.betaTester && " • Beta Tester"}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Context Attributes */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
          {isAnonymous ? 'Anonymous Context' : 'Multi-Context Attributes'}
        </div>
        <div className="text-xs font-medium text-primary mb-1 px-1">kind: multi</div>

        {/* Authenticated contexts */}
        {!isAnonymous && currentUser && (
          <>
            <div className="bg-background-tertiary p-4 rounded-lg text-xs text-foreground-secondary space-y-1">
              <div className="flex items-center gap-1.5 mb-2">
                <User className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-foreground">User Context</span>
              </div>
              {renderAttr('key', currentUser.key, 'user')}
              {renderAttr('email', currentUser.email, 'user')}
              {renderAttr('name', currentUser.name, 'user')}
              {renderAttr('role', currentUser.role, 'user')}
              {renderAttr('subscriptionTier', currentUser.subscriptionTier, 'user')}
              {renderAttr('signupDate', currentUser.signupDate, 'user')}
              {renderAttr('betaTester', currentUser.betaTester ? "true" : "false", 'user')}
              {renderAttr('companySize', currentUser.companySize ?? "n/a", 'user')}
              {renderAttr('industry', currentUser.industry ?? "n/a", 'user')}
            </div>

            <div className="bg-background-tertiary p-4 rounded-lg text-xs text-foreground-secondary space-y-1">
              <div className="flex items-center gap-1.5 mb-2">
                <Monitor className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-foreground">Device Context</span>
              </div>
              {renderAttr('key', `dvc-${currentUser.key}`, 'device')}
              {renderAttr('os', typeof navigator !== 'undefined' ? navigator.platform : 'unknown', 'device')}
              {renderAttr('type', typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop', 'device')}
              {renderAttr('version', '1.0.0', 'device')}
            </div>

            {currentUser.industry && (
              <div className="bg-background-tertiary p-4 rounded-lg text-xs text-foreground-secondary space-y-1">
                <div className="flex items-center gap-1.5 mb-2">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-foreground">Organization Context</span>
                </div>
                {renderAttr('key', `org-${currentUser.key}`, 'organization')}
                {renderAttr('name', currentUser.industry!, 'organization')}
                {renderAttr('region', currentUser.timezone?.startsWith('America') ? 'NA' : 'OTHER', 'organization')}
                {renderAttr('employees', '—', 'organization')}
              </div>
            )}
          </>
        )}

        {/* Anonymous contexts */}
        {isAnonymous && (
          <>
            <div className="bg-background-tertiary p-4 rounded-lg text-xs text-foreground-secondary space-y-1">
              <div className="flex items-center gap-1.5 mb-2">
                <Monitor className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-foreground">Device Context</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-foreground-muted/10 text-foreground-muted">anonymous</span>
              </div>
              <div><span className="text-foreground">key</span>: <span className="italic text-foreground-muted">auto-generated by SDK</span></div>
              <div><span className="text-foreground">anonymous</span>: true</div>
              <div><span className="text-foreground">os</span>: {typeof navigator !== 'undefined' ? navigator.platform : 'unknown'}</div>
              <div><span className="text-foreground">type</span>: {typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'}</div>
              <div><span className="text-foreground">version</span>: 1.0.0</div>
            </div>

            <div className="bg-background-tertiary p-4 rounded-lg text-xs text-foreground-secondary space-y-1">
              <div className="flex items-center gap-1.5 mb-2">
                <LogOut className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-foreground">Session Context</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-foreground-muted/10 text-foreground-muted">anonymous</span>
              </div>
              <div><span className="text-foreground">key</span>: <span className="italic text-foreground-muted">auto-generated by SDK</span></div>
              <div><span className="text-foreground">anonymous</span>: true</div>
              <div><span className="text-foreground">referrer</span>: {typeof document !== 'undefined' ? (document.referrer || 'direct') : 'server'}</div>
              <div><span className="text-foreground">locale</span>: {typeof navigator !== 'undefined' ? navigator.language : 'unknown'}</div>
              <div><span className="text-foreground">timezone</span>: {typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'unknown'}</div>
            </div>
          </>
        )}

        <div className="flex items-center gap-1.5 text-[10px] text-foreground-muted px-1 pt-1">
          <EyeOff className="w-3 h-3" />
          <span>= private attribute (value hidden from LaunchDarkly events)</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
          Switch To
        </div>
        <div className="space-y-5">
          {/* Anonymous */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
              Anonymous
            </div>
            <Button
              variant={isAnonymous ? "primary" : "outline"}
              size="lg"
              className={cn(
                "w-full justify-start h-auto py-4 px-5 transition-all duration-200",
                isAnonymous && "ring-2 ring-primary/20 shadow-lg",
                isSwitching && !isAnonymous && "opacity-50"
              )}
              onClick={logOut}
              disabled={isSwitching || isAnonymous}
            >
              <div className="flex-1 text-left">
                <div className="font-semibold text-base">Anonymous User</div>
                <div className="text-xs opacity-75 mt-1">
                  No login • anonymous: true
                </div>
              </div>
            </Button>
          </div>

          {/* Job Seeker */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
              Job Seeker Role
            </div>
            <div className="space-y-3">
              {jobSeekerUsers.map((user) => {
                const isActive = !isAnonymous && currentUser?.key === user.key;
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
                      <RefreshCw
                        className={cn(
                          "w-5 h-5 ml-3 transition-transform",
                          isSwitching && "animate-spin"
                        )}
                      />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {businessUsers.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
                Business Role
              </div>
              <div className="space-y-3">
                {businessUsers.map((user) => {
                  const isActive = !isAnonymous && currentUser?.key === user.key;
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
                        </div>
                      </div>
                      {isActive && (
                        <RefreshCw
                          className={cn(
                            "w-5 h-5 ml-3 transition-transform",
                            isSwitching && "animate-spin"
                          )}
                        />
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-border space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-foreground-muted">
            {isAnonymous
              ? 'Logged out — viewing as anonymous visitor.'
              : 'Testing an experiment? Regenerate the user key to enter a new bucket.'}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isAnonymous && (
              <Button
                variant="outline"
                size="sm"
                onClick={regenerateKey}
                disabled={isSwitching}
              >
                <RefreshCw className={cn("w-4 h-4", isSwitching && "animate-spin")} />
                New bucket
              </Button>
            )}
            <Button
              variant={isAnonymous ? "primary" : "outline"}
              size="sm"
              onClick={isAnonymous ? undefined : logOut}
              disabled={isSwitching || isAnonymous}
              className={isAnonymous ? "opacity-50 cursor-default" : ""}
            >
              <LogOut className="w-4 h-4" />
              {isAnonymous ? 'Logged out' : 'Log out'}
            </Button>
          </div>
        </div>
        <p className="text-xs text-foreground-muted">
          💡 Log out to test anonymous context evaluation — only device and session contexts are sent.
        </p>
      </div>
    </Card>
  );
}

