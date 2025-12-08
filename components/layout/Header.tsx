"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOrCreateUserContext, UserContext } from "@/lib/launchdarkly/userContext";

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

  // Get user initial and color
  const getUserDisplay = () => {
    if (!currentUser) {
      return { initial: 'C', color: 'bg-primary' };
    }

    // Get first letter of user's name
    const initial = currentUser.name.charAt(0).toUpperCase();
    
    // Assign distinct colors based on user key for the 3 demo users
    let color = 'bg-primary';
    switch (currentUser.key) {
      case 'user-001': // Beta Tester
        color = 'bg-blue-500'; // Blue
        break;
      case 'user-002': // Premium User
        color = 'bg-purple-500'; // Purple
        break;
      case 'user-003': // Free User
        color = 'bg-orange-500'; // Orange
        break;
      default:
        // Fallback for any other users
        if (currentUser.subscriptionTier === 'premium') {
          color = 'bg-success';
        } else if (currentUser.subscriptionTier === 'free') {
          color = 'bg-foreground-secondary';
        }
    }
    
    return { initial, color };
  };

  const userDisplay = getUserDisplay();

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
          <Link
            href="/"
            className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/docs"
            className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/api-reference"
            className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            API Reference
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-foreground-secondary hover:text-foreground hover:bg-background-tertiary rounded-lg transition-colors relative">
            <Settings className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
          </button>
          <button className="p-2 text-foreground-secondary hover:text-foreground hover:bg-background-tertiary rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white font-medium hover:opacity-80 transition-all",
            userDisplay.color
          )}>
            {userDisplay.initial}
          </button>
        </div>
      </div>
    </header>
  );
}

