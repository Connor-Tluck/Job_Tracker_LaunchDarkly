"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import type { ComponentType } from "react";

export type PipelineStatusItem = {
  label: string;
  value: number;
  colorClass: string;
};

export function PipelineStatusCard({
  items,
  title = "Pipeline Status",
  icon: Icon = Clock,
  className,
}: {
  items: PipelineStatusItem[];
  title?: string;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <Icon className="w-7 h-7 text-foreground-secondary" />
      </div>

      <div className="space-y-5">
        {items.map((item) => {
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
    </Card>
  );
}


