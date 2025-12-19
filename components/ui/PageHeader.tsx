import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background-secondary to-background p-6 lg:p-8",
        className
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(16,163,127,0.10),transparent_55%)]" />
      </div>

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          {badge ? <div>{badge}</div> : null}
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground">
            {title}
          </h1>
          {description ? (
            <div className="text-sm lg:text-base text-foreground-secondary max-w-2xl">
              {description}
            </div>
          ) : null}
        </div>

        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}




