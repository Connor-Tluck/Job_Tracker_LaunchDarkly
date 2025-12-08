"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { jobs, analyticsSummary, starStories } from "@/lib/mock-data";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import {
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Star,
  AlertCircle,
} from "lucide-react";
import { useMemo } from "react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";

export default function Home() {
  // Page access check
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_PAGE, true);
  if (!canAccess) {
    return notFound();
  }

  // Component visibility flags
  const showHero = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_HERO, true);
  const showMetrics = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_METRICS, true);
  const showRecentJobs = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_RECENT_JOBS, true);
  const showUpcomingActions = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_UPCOMING_ACTIONS, true);
  const showQuickLinks = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_QUICK_LINKS, true);
  const showFollowUpsAlert = useFeatureFlag(FLAG_KEYS.SHOW_DASHBOARD_FOLLOW_UPS_ALERT, true);

  const recentJobs = useMemo(() => jobs.slice(0, 5), []);
  const upcomingActions = analyticsSummary.upcomingActions.slice(0, 3);
  const responseRate = Math.round(
    (jobs.filter((j) => j.response === "Yes").length / jobs.length) * 100
  );
  const activeInterviews = jobs.filter((j) => j.phase === "Interview" || j.phase === "Phone Screen")
    .length;
  const followUpsDue = jobs.filter((j) => j.nextStep && j.nextStep.includes("follow")).length;

  return (
    <div className="space-y-8">
      {showHero && (
        <section className="rounded-3xl border border-border bg-gradient-to-br from-background-secondary to-background-tertiary p-8 lg:p-10">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-foreground-secondary">
            Job Search OS
          </p>
          <h1 className="text-4xl lg:text-5xl font-semibold">
            Track applications, prep smarter, and keep interview stories ready in one workspace.
          </h1>
          <p className="text-lg text-foreground-secondary">
            Your centralized hub for managing the entire job search pipeline from application to offer.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="px-5 py-3 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              View Job Tracker →
            </Link>
            <Link
              href="/analytics"
              className="px-5 py-3 rounded-full border border-border text-sm font-semibold hover:bg-background-tertiary transition-colors"
            >
              See Analytics
            </Link>
          </div>
        </div>
      </section>
      )}

      {showMetrics && (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={FileText}
            label="Applications"
            value={jobs.length}
            change="+3 this week"
            trend="up"
          />
          <MetricCard
            icon={CheckCircle2}
            label="Response Rate"
            value={`${responseRate}%`}
            change={`${jobs.filter((j) => j.response === "Yes").length} responses`}
          />
          <MetricCard
            icon={Star}
            label="Active Interviews"
            value={activeInterviews}
            change="Phone screens + interviews"
          />
          <MetricCard
            icon={Clock}
            label="Follow-ups Due"
            value={followUpsDue}
            change="Action items pending"
            trend={followUpsDue > 0 ? "alert" : undefined}
          />
        </section>
      )}

      {(showRecentJobs || showUpcomingActions) && (
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
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
        </div>
      )}

      {showQuickLinks && (
        <section className="grid gap-6 lg:grid-cols-3">
          <QuickLinkCard
            title="Job Tracker"
            description="Sheets-style table with filters, status tracking, and quick prep links."
            href="/jobs"
            icon={FileText}
          />
          <QuickLinkCard
            title="Master Prep"
            description="Personal narrative, question banks, and reusable STAR stories."
            href="/prep"
            icon={Star}
          />
          <QuickLinkCard
            title="Analytics Dashboard"
            description="Response rates, pipeline velocity, and conversion trends."
            href="/analytics"
            icon={TrendingUp}
          />
        </section>
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

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  trend,
}: {
  icon: any;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "alert";
}) {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-foreground-secondary">{label}</p>
        <Icon
          className={`w-4 h-4 ${
            trend === "alert" ? "text-warning" : trend === "up" ? "text-success" : "text-foreground-secondary"
          }`}
        />
      </div>
      <p className="text-3xl font-semibold">{value}</p>
      {change && (
        <p className="text-xs text-foreground-secondary">{change}</p>
      )}
    </Card>
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
