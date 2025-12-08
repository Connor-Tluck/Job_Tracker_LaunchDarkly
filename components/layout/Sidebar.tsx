"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";

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
  const searchParams = useSearchParams();

  // Feature flags for navigation items
  const showAnalytics = useFeatureFlag(FLAG_KEYS.SHOW_ANALYTICS_PAGE, true);
  const showPrep = useFeatureFlag(FLAG_KEYS.SHOW_PREP_PAGE, true);
  const showCompanyPrep = useFeatureFlag(FLAG_KEYS.SHOW_COMPANY_PREP_PAGE, true);
  const showStarStories = useFeatureFlag(FLAG_KEYS.SHOW_STAR_STORIES_PAGE, true);
  const showJobs = useFeatureFlag(FLAG_KEYS.SHOW_JOBS_PAGE, true);
  const enableTimelineView = useFeatureFlag(FLAG_KEYS.ENABLE_TIMELINE_VIEW, true);
  const showAdmin = useFeatureFlag(FLAG_KEYS.SHOW_ADMIN_PAGE, true);

  // Filter navigation items based on flags
  const filteredNavigation = navigation.map((section) => {
    if (section.title === "Pipeline") {
      return {
        ...section,
        items: section.items.filter((item) => {
          if (item.href === "/analytics") return showAnalytics;
          if (item.href === "/jobs") return showJobs;
          if (item.href === "/jobs?view=timeline") return showJobs && enableTimelineView;
          return true;
        }),
      };
    }
    if (section.title === "Preparation") {
      return {
        ...section,
        items: section.items.filter((item) => {
          if (item.href === "/prep") return showPrep;
          if (item.href === "/prep/companies") return showCompanyPrep;
          if (item.href === "/star-stories") return showStarStories;
          return true;
        }),
      };
    }
    return section;
  });

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
        {filteredNavigation.map((section) => (
          <div key={section.title}>
            <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
              {section.title}
            </div>
            {section.title === "Pipeline" && (
              <Link
                href="/"
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1",
                  pathname === "/"
                    ? "bg-background-tertiary text-foreground"
                    : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
                )}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            )}
            <div className="space-y-1">
              {section.items.map((item, idx) => {
                const Icon = item.icon;
                let isActive = false;
                
                // Special handling for Timeline with query parameter
                if (item.href === "/jobs?view=timeline") {
                  isActive = pathname === "/jobs" && searchParams?.get("view") === "timeline";
                } 
                // For Jobs Table, only active if on /jobs without the timeline view parameter
                else if (item.href === "/jobs") {
                  isActive = pathname === "/jobs" && searchParams?.get("view") !== "timeline";
                }
                // For Master Prep, only active if exactly /prep (not /prep/companies or other sub-routes)
                else if (item.href === "/prep") {
                  isActive = pathname === "/prep";
                }
                // For other items, check if the href matches the pathname or is a sub-route
                else {
                  isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                }
                
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

        {/* Admin Button - Red styling when visible */}
        {showAdmin && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
              Admin
            </div>
            <Link
              href="/admin"
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === "/admin"
                  ? "bg-danger/10 text-danger border border-danger/20"
                  : "text-danger hover:bg-danger/10 hover:text-danger border border-danger/20"
              )}
            >
              <Settings className="w-5 h-5" />
              <span>Feature Flags</span>
            </Link>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-border text-[11px] text-foreground-secondary leading-relaxed">
        <p>Next: wire up Google Sheets + Drive sync with local cache.</p>
      </div>
    </aside>
  );
}

