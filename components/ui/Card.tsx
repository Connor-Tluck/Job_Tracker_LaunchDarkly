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
        "bg-background-secondary/90 backdrop-blur border border-border-subtle rounded-xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
        hover &&
          "hover:bg-background-elevated transition-colors cursor-pointer hover:shadow-[0_12px_32px_rgba(0,0,0,0.16)]",
        className
      )}
    >
      {children}
    </div>
  );
}

