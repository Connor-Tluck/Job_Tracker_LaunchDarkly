"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Notebook,
  Table as TableIcon,
  TrendingUp,
  Star,
  Layers,
  CalendarClock,
  LucideIcon,
  StickyNote,
  FolderTree,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "Pipeline",
    items: [
      { name: "Jobs Table", href: "/jobs", icon: TableIcon },
      { name: "Analytics", href: "/analytics", icon: TrendingUp },
      { name: "Timeline", href: "/jobs?view=timeline", icon: CalendarClock },
    ],
  },
  {
    title: "Preparation",
    items: [
      { name: "Master Prep", href: "/prep", icon: Notebook },
      { name: "Company Prep", href: "/prep/companies", icon: Building2 },
      { name: "STAR Stories", href: "/star-stories", icon: Star },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Component Library", href: "/components", icon: Layers },
      { name: "Examples", href: "/examples", icon: FolderTree },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background-secondary border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            P
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground">Job Search OS</div>
            <div className="text-xs text-foreground-secondary truncate">
              Local Workspace
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigation.map((section) => (
          <div key={section.title}>
            <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item, idx) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={`${section.title}-${item.name}-${idx}`}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-background-tertiary text-foreground"
                        : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border text-[11px] text-foreground-secondary leading-relaxed">
        <p>Next: wire up Google Sheets + Drive sync with Supabase or local cache.</p>
      </div>
    </aside>
  );
}

