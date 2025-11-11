import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-background-secondary border border-border rounded-lg p-6",
        hover && "hover:bg-background-tertiary transition-colors cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

