"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { getOrCreateUserContext, UserContext } from "@/lib/launchdarkly/userContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserMenu } from "@/components/user/UserMenu";

export function Header() {
  const [currentUser, setCurrentUser] = useState<UserContext | null>(null);

  // Listen for user context changes
  useEffect(() => {
    const checkUserContext = () => {
      const user = getOrCreateUserContext();
      setCurrentUser(user);
    };

    // Check immediately
    checkUserContext();

    // Listen for custom event dispatched by UserContextSwitcher
    const handleUserContextChange = () => {
      checkUserContext();
    };

    window.addEventListener('ld-user-context-changed', handleUserContextChange);
    
    // Also listen for storage events (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ld-user-context') {
        checkUserContext();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('ld-user-context-changed', handleUserContextChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getSubscriptionTierLabel = (): string => {
    if (!currentUser) return "Free";

    // For demo purposes, Beta users should display as "Beta" (even if their tier is premium)
    if (currentUser.role === "beta-tester" || currentUser.betaTester) {
      return "Beta";
    }

    const tier = currentUser.subscriptionTier;
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const subscriptionTierLabel = getSubscriptionTierLabel();

  return (
    <header className="h-16 bg-background-secondary border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Personal</span>
          <span className="text-foreground-secondary">/</span>
          <span className="text-sm text-foreground-secondary">Project Template</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex items-center space-x-4">
          <span
            className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground-secondary"
            aria-label={`Subscription tier: ${subscriptionTierLabel}`}
            title={`Subscription tier: ${subscriptionTierLabel}`}
          >
            {subscriptionTierLabel}
          </span>
          <Link
            href="/"
            className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <button className="p-2 text-foreground-secondary hover:text-foreground hover:bg-background-tertiary rounded-lg transition-colors relative">
            <Settings className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
          </button>
          <UserMenu align="right" variant="icon" />
        </div>
      </div>
    </header>
  );
}

