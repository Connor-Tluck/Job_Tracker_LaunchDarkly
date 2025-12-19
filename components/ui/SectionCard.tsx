import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <Card className={cn("p-0 overflow-hidden", className)}>
      {(title || description || actions) && (
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              {title ? (
                <div className="text-base font-semibold text-foreground">
                  {title}
                </div>
              ) : null}
              {description ? (
                <div className="text-sm text-foreground-secondary">
                  {description}
                </div>
              ) : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
        </div>
      )}
      <div className={cn("p-6", contentClassName)}>{children}</div>
    </Card>
  );
}




