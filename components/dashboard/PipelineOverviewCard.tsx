"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { AlertCircle, FileText, TrendingDown, TrendingUp } from "lucide-react";
import type { ComponentType } from "react";

type Trend = "up" | "down" | "alert";

export type PipelineOverviewMetric = {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: Trend;
};

export type PipelineOverviewStatusItem = {
  label: string;
  value: number;
  colorClass: string;
};

export function PipelineOverviewCard({
  title = "Application Pipeline",
  subtitle,
  metrics,
  statusItems,
  icon: Icon = FileText,
  className,
}: {
  title?: string;
  subtitle?: string;
  metrics?: PipelineOverviewMetric[];
  statusItems?: PipelineOverviewStatusItem[];
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}) {
  const showMetrics = Boolean(metrics && metrics.length > 0);
  const showStatus = Boolean(statusItems && statusItems.length > 0);

  const total = (statusItems ?? []).reduce((sum, item) => sum + item.value, 0);

  return (
    <Card
      className={cn(
        // Keep this card visually consistent with other dashboard cards by
        // relying on the base `Card` surface/shadow styles.
        "p-6",
        className
      )}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold">{title}</h3>
            {subtitle && (
              <p className="text-sm text-foreground-secondary">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="border-t border-border-subtle pt-6" />

        <div
          className={cn(
            "grid gap-8",
            showMetrics && showStatus ? "lg:grid-cols-2" : "grid-cols-1"
          )}
        >
          {showStatus && (
            <div
              className={cn(
                showMetrics &&
                  showStatus &&
                  "border-t border-border-subtle pt-6 lg:border-t-0 lg:pt-0",
                // Status is left on desktop; it should not have a left divider.
                showMetrics && "lg:pr-8"
              )}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-semibold">Pipeline Status</h3>
              </div>

              <div className="space-y-5">
                {statusItems!.map((item) => {
                  const pct = total > 0 ? (item.value / total) * 100 : 0;
                  return (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-foreground-secondary">
                          {item.label}
                        </span>
                        <span className="text-xl font-semibold tabular-nums">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-background-tertiary overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", item.colorClass)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {showMetrics && (
            <div
              className={cn(
                "space-y-4",
                showStatus &&
                  "border-t border-border-subtle pt-6 lg:border-t-0 lg:pt-0 lg:border-l lg:border-border lg:pl-8"
              )}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-2xl font-semibold">Key Metrics</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {metrics!.map((m) => (
                  <MetricTile
                    key={m.label}
                    label={m.label}
                    value={m.value}
                    subtext={m.subtext}
                    trend={m.trend}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function MetricTile({
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
  const subtextStyle =
    trend === "up"
      ? "bg-success/15 text-success border-success/20"
      : trend === "down"
        ? "bg-danger/15 text-danger border-danger/20"
        : trend === "alert"
          ? "bg-warning/15 text-warning border-warning/20"
          : "bg-background-tertiary text-foreground-secondary border-border-subtle";

  return (
    <div className="rounded-xl border border-border-subtle bg-background-secondary/60 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground-muted tracking-wide uppercase">
            {label}
          </p>
          {subtext && (
            <div className="mt-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                  subtextStyle
                )}
              >
                {trend === "up" && <TrendingUp className="w-3 h-3" aria-hidden />}
                {trend === "down" && (
                  <TrendingDown className="w-3 h-3" aria-hidden />
                )}
                {trend === "alert" && (
                  <AlertCircle className="w-3 h-3" aria-hidden />
                )}
                <span className="truncate">{subtext}</span>
              </span>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 text-right">
          <p className="text-2xl font-semibold tabular-nums leading-none">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}


