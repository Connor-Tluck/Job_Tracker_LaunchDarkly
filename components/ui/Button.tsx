import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "outline" | "ghost" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default:
      "bg-background-tertiary text-foreground border border-border-subtle hover:bg-background-elevated",
    primary: "bg-primary text-white hover:bg-primary-hover",
    outline:
      "bg-background-secondary/60 border border-border text-foreground shadow-sm hover:bg-background-secondary hover:border-foreground-subtle",
    ghost:
      "text-foreground-secondary hover:text-foreground hover:bg-background-tertiary",
    danger: "bg-danger/90 text-white hover:bg-danger",
  };

  const sizes = {
    xs: "h-7 px-2 text-xs",
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

