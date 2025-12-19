"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { FileText, TrendingUp } from "lucide-react";

type Trend = "up" | "down" | "alert";

type Metric = {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: Trend;
};

type UpcomingAction = {
  date: string;
  label: string;
  jobId: string;
};

export function PipelineSummaryCard({
  title = "Application Pipeline",
  subtitle,
  metrics,
  upcomingActions,
  actionsHrefPrefix = "/jobs/",
}: {
  title?: string;
  subtitle?: string;
  metrics: Metric[];
  upcomingActions?: UpcomingAction[];
  actionsHrefPrefix?: string;
}) {
  return (
    <Card className="rounded-2xl border-border bg-background-tertiary p-8 shadow-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            {subtitle && <p className="text-sm text-foreground-secondary">{subtitle}</p>}
          </div>
        </div>

        <div className="space-y-3">
          {metrics.map((m) => (
            <MetricRow
              key={m.label}
              label={m.label}
              value={m.value}
              subtext={m.subtext}
              trend={m.trend}
            />
          ))}
        </div>

        {upcomingActions && upcomingActions.length > 0 && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-foreground-secondary mb-2">Upcoming Actions</p>
            <div className="space-y-2">
              {upcomingActions.slice(0, 2).map((a) => (
                <ActionItem
                  key={`${a.jobId}-${a.date}-${a.label}`}
                  date={formatShortDateLabel(a.date)}
                  label={a.label}
                  href={`${actionsHrefPrefix}${a.jobId}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function MetricRow({
  label,
  value,
  subtext,
  trend,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: Trend;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="min-w-0">
        <span className="text-sm text-foreground-secondary">{label}</span>
        {subtext && <p className="text-xs text-foreground-muted mt-1">{subtext}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-semibold">{value}</span>
        {trend === "up" && (
          <span className="text-xs text-success flex items-center gap-1" aria-label="Trending up">
            <TrendingUp className="w-3 h-3" />
          </span>
        )}
        {trend === "alert" && (
          <span className="w-2 h-2 rounded-full bg-warning" aria-label="Attention" />
        )}
      </div>
    </div>
  );
}

function ActionItem({
  date,
  label,
  href,
}: {
  date: string;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="flex items-center gap-3 text-sm hover:opacity-90 transition-opacity">
        <span className="text-xs text-foreground-muted w-20">{date}</span>
        <span className="text-foreground-secondary truncate">{label}</span>
      </div>
    </Link>
  );
}

function formatShortDateLabel(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}


