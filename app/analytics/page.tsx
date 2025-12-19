"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";
import { analyticsSummary, jobs } from "@/lib/mock-data";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext } from "@/lib/launchdarkly/userContext";
import { trackPageView } from "@/lib/launchdarkly/tracking";
import { useFlagsReady } from "@/hooks/useFlagsReady";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Construction } from "lucide-react";

export default function AnalyticsPage() {
  // Page access check
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_ANALYTICS_PAGE, true);
  const flagsReady = useFlagsReady();
  const isBusinessMode = useFeatureFlag(FLAG_KEYS.SHOW_BUSINESS_USER_MODE, false);
  const ldClient = useLDClient();
  const userContext = getOrCreateUserContext();
  const router = useRouter();

  // Track page view
  useEffect(() => {
    if (flagsReady && canAccess && !isBusinessMode) {
      trackPageView(ldClient, userContext, "analytics");
    }
  }, [ldClient, userContext, canAccess, flagsReady, isBusinessMode]);

  // If access is denied due to targeting (e.g. free tier), send users to an upgrade/signup flow
  useEffect(() => {
    if (!flagsReady) return;
    if (isBusinessMode) return;
    if (canAccess) return;

    if (userContext?.subscriptionTier === "free") {
      const returnTo = encodeURIComponent("/analytics");
      router.replace(`/upgrade?feature=analytics&returnTo=${returnTo}`);
    }
  }, [flagsReady, isBusinessMode, canAccess, router, userContext]);

  // Prevent UI flash while flags initialize (and enforce role-based app mode)
  if (!flagsReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-foreground-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Business users should not access Job Seeker pages
  if (isBusinessMode) {
    return notFound();
  }

  if (!canAccess) {
    if (userContext?.subscriptionTier === "free") {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-foreground-secondary">Redirecting…</p>
          </div>
        </div>
      );
    }
    // For interview/demo purposes: if the analytics flag is toggled OFF for *everyone*,
    // premium users should see a friendly "feature disabled" page rather than a 404.
    // (Free users still go through the upgrade flow above.)
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Insight</p>
          <h1 className="text-3xl font-semibold">Pipeline Analytics</h1>
          <p className="text-sm text-foreground-secondary">
            This page is currently disabled via feature flag.
          </p>
        </header>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Construction className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="font-medium">Under construction</div>
              <p className="text-sm text-foreground-secondary">
                We’re iterating on the analytics experience. Check back soon, or continue using the
                rest of the app.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Link href="/">
                  <Button variant="primary" size="sm">
                    Back to Dashboard
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline" size="sm">
                    View Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Insight</p>
        <h1 className="text-3xl font-semibold">Pipeline Analytics</h1>
        <p className="text-sm text-foreground-secondary">
          Track velocity, response trends, and stage conversions to focus your outreach.
        </p>
      </header>

      <AnalyticsOverview snapshot={analyticsSummary} jobs={jobs} />
      <AnalyticsPanel snapshot={analyticsSummary} showTopMetrics={false} />
    </div>
  );
}
