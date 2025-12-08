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
  FileText,
  Briefcase,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { useFlags } from "launchdarkly-react-client-sdk";
import { useState, useEffect, useRef } from "react";
import { useFlagsReady } from "@/hooks/useFlagsReady";

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
  const flags = useFlags();
  const flagsReady = useFlagsReady();

  // Stable flag values - only update when flag value actually changes (prevents unnecessary re-renders)
  // Initialize as false - will be set once flags are loaded
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPrep, setShowPrep] = useState(false);
  const [showCompanyPrep, setShowCompanyPrep] = useState(false);
  const [showStarStories, setShowStarStories] = useState(false);
  const [showJobs, setShowJobs] = useState(false);
  const [enableTimelineView, setEnableTimelineView] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAssignmentSatisfaction, setShowAssignmentSatisfaction] = useState(false);
  const [showReadme, setShowReadme] = useState(false);

  const previousValuesRef = useRef<Record<string, boolean | undefined>>({});

  useEffect(() => {
    if (!flagsReady) {
      return; // Don't update flags if they're not loaded yet
    }

    const updateFlag = (key: string, value: boolean | undefined, defaultValue: boolean, setter: (val: boolean) => void) => {
      // Only use defaultValue if flag doesn't exist in flags object
      // If flag exists (even if undefined), use the actual value
      const flagExists = key in flags;
      const currentValue = flagExists ? (value ?? defaultValue) : defaultValue;
      
      if (previousValuesRef.current[key] !== currentValue) {
        setter(currentValue);
        previousValuesRef.current[key] = currentValue;
      }
    };

    updateFlag(FLAG_KEYS.SHOW_DASHBOARD_PAGE, flags[FLAG_KEYS.SHOW_DASHBOARD_PAGE], true, setShowDashboard);
    updateFlag(FLAG_KEYS.SHOW_ANALYTICS_PAGE, flags[FLAG_KEYS.SHOW_ANALYTICS_PAGE], true, setShowAnalytics);
    updateFlag(FLAG_KEYS.SHOW_PREP_PAGE, flags[FLAG_KEYS.SHOW_PREP_PAGE], true, setShowPrep);
    updateFlag(FLAG_KEYS.SHOW_COMPANY_PREP_PAGE, flags[FLAG_KEYS.SHOW_COMPANY_PREP_PAGE], true, setShowCompanyPrep);
    updateFlag(FLAG_KEYS.SHOW_STAR_STORIES_PAGE, flags[FLAG_KEYS.SHOW_STAR_STORIES_PAGE], true, setShowStarStories);
    updateFlag(FLAG_KEYS.SHOW_JOBS_PAGE, flags[FLAG_KEYS.SHOW_JOBS_PAGE], true, setShowJobs);
    updateFlag(FLAG_KEYS.ENABLE_TIMELINE_VIEW, flags[FLAG_KEYS.ENABLE_TIMELINE_VIEW], true, setEnableTimelineView);
    updateFlag(FLAG_KEYS.SHOW_ADMIN_PAGE, flags[FLAG_KEYS.SHOW_ADMIN_PAGE], true, setShowAdmin);
    updateFlag(FLAG_KEYS.SHOW_ASSIGNMENT_SATISFACTION_PAGE, flags[FLAG_KEYS.SHOW_ASSIGNMENT_SATISFACTION_PAGE], true, setShowAssignmentSatisfaction);
    // Check if README page flag exists, otherwise default to true if admin is shown
    const readmeFlagKey = 'show-readme-page';
    const adminValue = flags[FLAG_KEYS.SHOW_ADMIN_PAGE] ?? true;
    const readmeValue = flags[readmeFlagKey] ?? (adminValue ? true : false);
    updateFlag(readmeFlagKey, readmeValue, true, setShowReadme);
  }, [flags, flagsReady]);

  // Don't render navigation until flags are ready to prevent flash
  if (!flagsReady) {
    return (
      <aside className="w-64 bg-background-secondary border-r border-border flex flex-col">
        <Link href="/landing" className="p-4 border-b border-border hover:bg-background-tertiary transition-colors">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">Job Search OS</div>
              <div className="text-xs text-foreground-secondary truncate">
                Local Workspace
              </div>
            </div>
          </div>
        </Link>
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-background-tertiary rounded w-3/4"></div>
            <div className="h-8 bg-background-tertiary rounded"></div>
            <div className="h-8 bg-background-tertiary rounded"></div>
            <div className="h-8 bg-background-tertiary rounded"></div>
          </div>
        </nav>
      </aside>
    );
  }

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
    if (section.title === "System") {
      // Hide Component Library and Examples
      return {
        ...section,
        items: [],
      };
    }
    return section;
  }).filter((section) => section.items.length > 0); // Remove empty sections

  return (
    <aside className="w-64 bg-background-secondary border-r border-border flex flex-col">
      <Link href="/landing" className="p-4 border-b border-border hover:bg-background-tertiary transition-colors">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground">Job Search OS</div>
            <div className="text-xs text-foreground-secondary truncate">
              Local Workspace
            </div>
          </div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Landing Page Link */}
        <Link
          href="/landing"
          className={cn(
            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors mb-4",
            pathname?.startsWith("/landing")
              ? "bg-background-tertiary text-foreground"
              : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
          )}
        >
          <Home className="w-5 h-5" />
          <span>Landing Page</span>
        </Link>

        {filteredNavigation.map((section) => (
          <div key={section.title}>
            <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
              {section.title}
            </div>
            {section.title === "Pipeline" && showDashboard && (
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
            <div className="space-y-1">
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
                <span>ADMIN</span>
              </Link>
              {showAssignmentSatisfaction && (
                <Link
                  href="/admin/assignment-satisfaction"
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === "/admin/assignment-satisfaction"
                      ? "bg-danger/10 text-danger border border-danger/20"
                      : "text-danger hover:bg-danger/10 hover:text-danger border border-danger/20"
                  )}
                >
                  <FileText className="w-5 h-5" />
                  <span>Assignment Docs</span>
                </Link>
              )}
              {showReadme && (
                <Link
                  href="/admin/readme"
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === "/admin/readme"
                      ? "bg-danger/10 text-danger border border-danger/20"
                      : "text-danger hover:bg-danger/10 hover:text-danger border border-danger/20"
                  )}
                >
                  <FileText className="w-5 h-5" />
                  <span>README</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-border text-[11px] text-foreground-secondary leading-relaxed">
        <p>Next: wire up Google Sheets + Drive sync with local cache.</p>
      </div>
    </aside>
  );
}

