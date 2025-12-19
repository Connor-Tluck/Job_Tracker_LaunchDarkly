"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { PipelineStatusCard, type PipelineStatusItem } from "@/components/dashboard/PipelineStatusCard";
import type { AnalyticsSummary, Job } from "@/lib/mock-data";
import { BarChart3, Info, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

function pct(n: number) {
  return `${Math.round(n)}%`;
}

function safeRate(n: number, d: number) {
  return d > 0 ? (n / d) * 100 : 0;
}

function clampRecent<T>(arr: T[], n: number) {
  if (n <= 0) return [];
  return arr.slice(Math.max(0, arr.length - n));
}

function startOfWeekISO(date: Date) {
  // Monday-start week
  const d = new Date(date);
  const day = d.getDay(); // 0 Sun ... 6 Sat
  const diffToMonday = (day + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatWeekLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function formatISODate(date: Date) {
  // YYYY-MM-DD
  return date.toISOString().slice(0, 10);
}

function getTickIndices(count: number) {
  if (count <= 0) return [];

  // For short ranges, label every bar.
  if (count <= 8) return Array.from({ length: count }, (_, i) => i);

  // For medium ranges, label every other bar to reduce clutter.
  if (count <= 12) return Array.from({ length: count }, (_, i) => i).filter((i) => i % 2 === 0 || i === count - 1);

  // For long ranges, show 5 evenly-spaced ticks (start, quartiles, end).
  const positions = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round((count - 1) * p));
  return Array.from(new Set(positions)).sort((a, b) => a - b);
}

export function AnalyticsOverview({
  snapshot,
  jobs,
}: {
  snapshot: AnalyticsSummary;
  jobs: Job[];
}) {
  const [weekRange, setWeekRange] = useState<4 | 8 | 12 | 24>(8);

  const totalApplications = snapshot.totals.applied;
  const totalResponses = snapshot.totals.responses;
  const responseRate = safeRate(totalResponses, totalApplications);

  const weeklyBuckets = snapshot.velocity;
  const lastWeekApplied = weeklyBuckets.length > 0 ? weeklyBuckets[weeklyBuckets.length - 1].applied : 0;

  const last4 = clampRecent(weeklyBuckets, 4);
  const prev4 = weeklyBuckets.slice(Math.max(0, weeklyBuckets.length - 8), Math.max(0, weeklyBuckets.length - 4));
  const last4Rate = safeRate(
    last4.reduce((s, w) => s + w.responses, 0),
    last4.reduce((s, w) => s + w.applied, 0)
  );
  const prev4Rate = safeRate(
    prev4.reduce((s, w) => s + w.responses, 0),
    prev4.reduce((s, w) => s + w.applied, 0)
  );
  const monthDelta = last4.length > 0 && prev4.length > 0 ? last4Rate - prev4Rate : null;

  const phoneScreens = jobs.filter((j) => j.phase === "Phone Screen").length;
  const interviews = jobs.filter((j) => j.phase === "Interview").length;
  const offers = jobs.filter((j) => j.phase === "Offer").length;
  const pendingOffers = jobs.filter((j) => j.phase === "Offer" && j.response === "Pending").length;

  const pipelineItems: PipelineStatusItem[] = [
    { label: "Applied", value: jobs.filter((j) => j.phase === "Applied").length, colorClass: "bg-foreground-secondary" },
    { label: "Phone Screen", value: phoneScreens, colorClass: "bg-warning" },
    { label: "Interview", value: interviews, colorClass: "bg-primary" },
    { label: "Offer", value: offers, colorClass: "bg-success" },
  ];

  const weeklyApplied = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    // Use the most recent application date in the dataset as the "end" so the demo is stable.
    const maxApplied = jobs.reduce((max, j) => {
      const d = new Date(j.applicationDate);
      return d > max ? d : max;
    }, new Date(jobs[0].applicationDate));

    const endWeekStart = startOfWeekISO(maxApplied);
    const startWeekStart = addDays(endWeekStart, -(weekRange - 1) * 7);

    const buckets = new Map<number, number>();
    for (const j of jobs) {
      const d = new Date(j.applicationDate);
      const wk = startOfWeekISO(d);
      const key = wk.getTime();
      // Filter outside selected window (inclusive).
      if (wk < startWeekStart || wk > endWeekStart) continue;
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }

    const weeks = Array.from({ length: weekRange }, (_, i) => addDays(startWeekStart, i * 7));
    return weeks.map((wk) => {
      const start = wk;
      const end = addDays(wk, 6);
      const key = wk.getTime();
      const count = buckets.get(key) ?? 0;
      return {
        label: formatWeekLabel(wk),
        value: count,
        startISO: formatISODate(start),
        endISO: formatISODate(end),
      };
    });
  }, [jobs, weekRange]);

  const maxWeekly = Math.max(1, ...weeklyApplied.map((d) => d.value));
  const rangeLabel =
    weeklyApplied.length > 0
      ? `${weeklyApplied[0].startISO} → ${weeklyApplied[weeklyApplied.length - 1].endISO}`
      : "No data";

  const tickIndices = useMemo(() => getTickIndices(weeklyApplied.length), [weeklyApplied.length]);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatTile
          label="Applications"
          value={totalApplications}
          change={lastWeekApplied > 0 ? `+${lastWeekApplied} this week` : undefined}
          tone="success"
          valueClassName="text-foreground"
          className="text-center"
        />
        <StatTile
          label="Response Rate"
          value={pct(responseRate)}
          change={
            monthDelta === null
              ? `${totalResponses} responses`
              : `${monthDelta >= 0 ? "+" : ""}${pct(monthDelta)} vs last month`
          }
          tone="success"
          valueClassName="text-foreground"
          className="text-center"
        />
        <StatTile
          label="Interviews"
          value={phoneScreens + interviews}
          change={phoneScreens > 0 ? `${phoneScreens} phone screens` : undefined}
          tone="primary"
          valueClassName="text-foreground"
          className="text-center"
        />
        <StatTile
          label="Offers"
          value={offers}
          change={pendingOffers > 0 ? `${pendingOffers} pending` : undefined}
          tone="primary"
          valueClassName="text-foreground"
          className="text-center"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PipelineStatusCard
          items={pipelineItems}
          title="Pipeline Status"
          icon={PieChart}
          className="p-6"
        />

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Weekly Trends</h3>

              <div className="relative group">
                <button
                  type="button"
                  className="p-1 rounded-md text-foreground-secondary hover:text-foreground hover:bg-background-tertiary transition-colors"
                  aria-label="Weekly Trends info"
                >
                  <Info className="w-4 h-4" />
                </button>
                <div
                  className={cn(
                    "pointer-events-none absolute left-0 top-full mt-2 w-72 rounded-xl border border-border",
                    "bg-background-secondary shadow-lg p-3 text-xs text-foreground-secondary",
                    "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                  )}
                >
                  <div className="font-medium text-foreground mb-1">How this is calculated</div>
                  <div>
                    Bars show <span className="text-foreground">applications submitted</span> per week (Monday–Sunday),
                    computed from your sample jobs data.
                  </div>
                  <div className="mt-2">
                    <span className="font-medium text-foreground">Range:</span> {rangeLabel}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs text-foreground-secondary hidden sm:block">Range</label>
              <select
                className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground"
                value={weekRange}
                onChange={(e) => setWeekRange(Number(e.target.value) as 4 | 8 | 12 | 24)}
                aria-label="Weekly trends range"
              >
                <option value={4}>Last 4 weeks</option>
                <option value={8}>Last 8 weeks</option>
                <option value={12}>Last 12 weeks</option>
                <option value={24}>Last 24 weeks</option>
              </select>
              <BarChart3 className="w-5 h-5 text-foreground-secondary" />
            </div>
          </div>

          {weeklyApplied.length === 0 ? (
            <div className="text-sm text-foreground-secondary">No weekly data yet.</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-end gap-2 h-32">
                {weeklyApplied.map((d) => (
                  <div
                    key={`${d.startISO}`}
                    className="flex-1 bg-primary rounded-t hover:bg-primary-hover transition-colors"
                    style={{ height: `${Math.max(8, (d.value / maxWeekly) * 100)}%` }}
                    title={`${d.label} (${d.startISO}–${d.endISO}): ${d.value} applications`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-foreground-secondary">
                {weeklyApplied.map((d, idx) => {
                  const show = tickIndices.includes(idx);
                  return (
                    <div key={`${d.startISO}-tick`} className="flex-1 min-w-0">
                      {show ? (
                        <span className="block text-center truncate">{d.label}</span>
                      ) : (
                        // Keep row height consistent while avoiding visual clutter.
                        <span className="block text-center opacity-0 select-none">.</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}


