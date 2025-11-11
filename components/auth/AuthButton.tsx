"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check if auth is enabled via environment variable
    const authEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === "true";
    
    if (!authEnabled) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const authEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === "true";
    if (!authEnabled) {
      alert("Authentication is not enabled. Set NEXT_PUBLIC_ENABLE_AUTH=true in your .env file.");
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-background-tertiary animate-pulse"></div>
    );
  }

  if (user) {
    return (
      <button
        onClick={handleSignOut}
        className="flex items-center space-x-2 px-3 py-1.5 text-sm text-foreground-secondary hover:text-foreground hover:bg-background-tertiary rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center space-x-2 px-3 py-1.5 text-sm text-foreground-secondary hover:text-foreground hover:bg-background-tertiary rounded-lg transition-colors"
    >
      <LogIn className="w-4 h-4" />
      <span>Sign In</span>
    </button>
  );
}

