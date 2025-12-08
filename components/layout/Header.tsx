"use client";

import Link from "next/link";
import { Settings, HelpCircle } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-background-secondary border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Personal</span>
          <span className="text-foreground-secondary">/</span>
          <span className="text-sm text-foreground-secondary">Project Template</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/docs"
            className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/api-reference"
            className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
          >
            API Reference
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-foreground-secondary hover:text-foreground hover:bg-background-tertiary rounded-lg transition-colors relative">
            <Settings className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
          </button>
          <button className="p-2 text-foreground-secondary hover:text-foreground hover:bg-background-tertiary rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium hover:bg-primary-hover transition-colors">
            C
          </button>
        </div>
      </div>
    </header>
  );
}

