"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FileText, MessageCircle } from "lucide-react";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { cn } from "@/lib/utils";
import { useFlags } from "launchdarkly-react-client-sdk";
import { useState, useEffect, useRef } from "react";
import { useFlagsReady } from "@/hooks/useFlagsReady";

// Stable navigation component - only updates when flag value actually changes
function Navigation() {
  const flags = useFlags();
  const flagsReady = useFlagsReady();
  const [showSupportBot, setShowSupportBot] = useState(false);
  const flagKey = FLAG_KEYS.SHOW_PREMIUM_FEATURE_DEMO;
  const previousValueRef = useRef<boolean | undefined>(undefined);

  useEffect(() => {
    if (!flagsReady) {
      return; // Don't update if flags aren't loaded yet
    }

    // Extract flag value
    const currentValue = flags[flagKey] ?? false;
    
    // Only update state if value actually changed (prevents unnecessary re-renders)
    if (previousValueRef.current !== currentValue) {
      setShowSupportBot(currentValue);
      previousValueRef.current = currentValue;
    }
  }, [flags, flagKey, flagsReady]);

  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link
        href="/landing/job-tracker"
        className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
      >
        Job Tracker
      </Link>
      <Link
        href="/landing/prep-hub"
        className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
      >
        Prep Hub
      </Link>
      <Link
        href="/landing/analytics"
        className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
      >
        Analytics
      </Link>
      {flagsReady && showSupportBot && (
        <Link
          href="/landing/support-bot"
          className="text-sm text-foreground-secondary hover:text-foreground flex items-center gap-1.5"
        >
          <MessageCircle className="w-4 h-4" />
          Support Bot
        </Link>
      )}
    </nav>
  );
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background-secondary/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/landing" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">Job Search OS</span>
            </Link>

            <Navigation />

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-background-secondary/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">Job Search OS</span>
              </div>
              <p className="text-sm text-foreground-secondary">
                Your complete job search management platform. Track applications, prepare for
                interviews, and land your dream job.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li>
                  <Link href="/landing/job-tracker" className="hover:text-foreground transition-colors">
                    Job Tracker
                  </Link>
                </li>
                <li>
                  <Link href="/landing/prep-hub" className="hover:text-foreground transition-colors">
                    Prep Hub
                  </Link>
                </li>
                <li>
                  <Link href="/landing/analytics" className="hover:text-foreground transition-colors">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/landing" className="hover:text-foreground transition-colors">
                    All Features
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/examples" className="hover:text-foreground transition-colors">
                    Examples
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-foreground-secondary">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground-muted">
              © {new Date().getFullYear()} Job Search OS. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-foreground-secondary">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

