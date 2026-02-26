"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { jobs, analyticsSummary, starStories } from "@/lib/mock-data";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { PipelineOverviewCard } from "@/components/dashboard/PipelineOverviewCard";
import { DashboardCalendarCard } from "@/components/dashboard/DashboardCalendarCard";
import {
  Calendar,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useMemo, useEffect } from "react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext } from "@/lib/launchdarkly/userContext";
import { trackPageView } from "@/lib/launchdarkly/tracking";
import { useFlagsReady } from "@/hooks/useFlagsReady";

export default function Home() {
  // All hooks must be called before any conditional returns
  const router = useRouter();
  const flagsReady = useFlagsReady();
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_PAGE, true);
  const isBusinessMode = useFeatureFlag(FLAG_KEYS.SHOW_BUSINESS_USER_MODE, false);
  const ldClient = useLDClient();
  const userContext = getOrCreateUserContext();

  // Component visibility flags (must be declared before any early returns)
  const showMetrics = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_METRICS, true);
  const showPipelineStatus = useFeatureFlag(
    FLAG_KEYS.SHOW_DASHBOARD_PIPELINE_STATUS,
    true
  );
  const showRecentJobs = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_RECENT_JOBS, true);
  const showUpcomingActions = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_UPCOMING_ACTIONS, true);
  const showQuickLinks = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_QUICK_LINKS, true);
  const showFollowUpsAlert = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_FOLLOW_UPS_ALERT, true);

  // Derived data (hooks must be declared before any early returns)
  const recentJobs = useMemo(() => jobs.slice(0, 5), []);
  const upcomingActions = analyticsSummary.upcomingActions.slice(0, 3);
  const responseRate = Math.round(
    (jobs.filter((j) => j.response === "Yes").length / jobs.length) * 100
  );
  const activeInterviews = jobs.filter((j) => j.phase === "Interview" || j.phase === "Phone Screen")
    .length;
  const followUpsDue = jobs.filter((j) => j.nextStep && j.nextStep.includes("follow")).length;
  const pipelineItems = useMemo(() => {
    const applied = jobs.filter((j) => j.phase === "Applied").length;
    const phoneScreen = jobs.filter((j) => j.phase === "Phone Screen").length;
    const interview = jobs.filter((j) => j.phase === "Interview").length;
    const offer = jobs.filter((j) => j.phase === "Offer").length;

    return [
      { label: "Applied", value: applied, colorClass: "bg-foreground-secondary" },
      { label: "Phone Screen", value: phoneScreen, colorClass: "bg-warning" },
      { label: "Interview", value: interview, colorClass: "bg-primary" },
      { label: "Offer", value: offer, colorClass: "bg-success" },
    ];
  }, [jobs]);

  // Track page view
  useEffect(() => {
    if (flagsReady && canAccess && !isBusinessMode) {
      trackPageView(ldClient ?? null, userContext, "dashboard");
    }
  }, [ldClient, userContext, canAccess, flagsReady, isBusinessMode]);

  // Business users should land on the recruiting experience by default.
  // We redirect instead of 404 to avoid a confusing default experience.
  useEffect(() => {
    if (!flagsReady) return;
    if (isBusinessMode) {
      router.replace("/business/candidates");
    }
  }, [flagsReady, isBusinessMode, router]);

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

  // For business users, show a lightweight loading state while redirecting.
  if (isBusinessMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-foreground-secondary">Redirecting to Recruiting…</p>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      {(showMetrics || showPipelineStatus) && (
        <section>
          <PipelineOverviewCard
            subtitle={`${jobs.length} active applications`}
            metrics={
              showMetrics
                ? [
                    {
                      label: "Applications",
                      value: jobs.length,
                      subtext: "+3 this week",
                      trend: "up",
                    },
                    {
                      label: "Response Rate",
                      value: `${responseRate}%`,
                      subtext: `${jobs.filter((j) => j.response === "Yes").length} responses`,
                    },
                    {
                      label: "Active Interviews",
                      value: activeInterviews,
                      subtext: "Phone screens + interviews",
                    },
                    {
                      label: "Follow-ups Due",
                      value: followUpsDue,
                      subtext: "Action items pending",
                      trend: followUpsDue > 0 ? "alert" : undefined,
                    },
                  ]
                : undefined
            }
            statusItems={showPipelineStatus ? pipelineItems : undefined}
          />
        </section>
      )}

      {(showRecentJobs || showUpcomingActions) && (
        <div className={`grid gap-6 ${showRecentJobs ? "lg:grid-cols-[2fr,1fr]" : "lg:grid-cols-1"}`}>
          {showRecentJobs && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Applications</h2>
                <Link
                  href="/jobs"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <Card key={job.id} hover className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{job.company}</h3>
                          <JobStatusBadge status={job.phase} />
                        </div>
                        <p className="text-sm text-foreground-secondary">{job.title}</p>
                        <div className="flex items-center gap-4 text-xs text-foreground-secondary">
                          <span>Applied {job.applicationDate}</span>
                          {job.response === "Yes" && (
                            <span className="text-success">✓ Responded</span>
                          )}
                          {job.nextStep && (
                            <span className="text-warning">→ {job.nextStep}</span>
                          )}
                        </div>
                      </div>
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="ghost" size="sm">
                          Prep
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <div className="space-y-6">
            {showUpcomingActions && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Upcoming Actions</h2>
                  <Link
                    href="/analytics"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcomingActions.length > 0 ? (
                    upcomingActions.map((action, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{action.label}</p>
                            <p className="text-xs text-foreground-secondary flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {action.date}
                            </p>
                          </div>
                          <Link href={`/jobs/${action.jobId}`}>
                            <Button variant="ghost" size="xs">
                              Open
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-4 text-sm text-foreground-secondary">
                      No upcoming actions scheduled
                    </Card>
                  )}
                </div>
              </section>
            )}

            <section>
              <DashboardCalendarCard
                events={analyticsSummary.upcomingActions.map((a) => ({
                  date: a.date,
                  label: a.label,
                  href: `/jobs/${a.jobId}`,
                }))}
              />
            </section>
          </div>
        </div>
      )}


      {showFollowUpsAlert && followUpsDue > 0 && (
        <Card className="p-4 bg-warning/10 border-warning/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Follow-ups Due</h3>
              <p className="text-sm text-foreground-secondary">
                You have {followUpsDue} job{followUpsDue > 1 ? "s" : ""} with pending follow-up
                actions. Review your timeline to stay on top of outreach.
              </p>
              <Link href="/jobs">
                <Button variant="outline" size="sm" className="mt-3">
                  Review Jobs
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function QuickLinkCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: any;
}) {
  return (
    <Link href={href}>
      <Card hover className="p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-background-tertiary">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-foreground-secondary">{description}</p>
        <div className="flex items-center gap-1 text-sm text-primary">
          <span>Open</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </Card>
    </Link>
  );
}
