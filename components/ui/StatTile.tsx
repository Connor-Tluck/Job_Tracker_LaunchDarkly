import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type StatTone = "default" | "success" | "warning" | "danger" | "primary";

interface StatTileProps {
  label: string;
  value: string | number;
  change?: string;
  icon?: LucideIcon;
  tone?: StatTone;
  className?: string;
  rightSlot?: ReactNode;
  valueClassName?: string;
}

const toneToIconClass: Record<StatTone, string> = {
  default: "text-foreground-secondary",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export function StatTile({
  label,
  value,
  change,
  icon: Icon,
  tone = "default",
  className,
  rightSlot,
  valueClassName,
}: StatTileProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-foreground-secondary">
            {label}
          </p>
          <p className={cn("text-3xl font-semibold leading-none", valueClassName)}>
            {value}
          </p>
          {change ? (
            <p className="text-xs text-foreground-secondary">{change}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {rightSlot ? <div>{rightSlot}</div> : null}
          {Icon ? (
            <div className="w-9 h-9 rounded-lg bg-background-tertiary flex items-center justify-center">
              <Icon className={cn("w-4 h-4", toneToIconClass[tone])} />
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}


