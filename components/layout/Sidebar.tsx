"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Notebook,
  Table as TableIcon,
  TrendingUp,
  Star,
  CalendarClock,
  LucideIcon,
  StickyNote,
  Building2,
  LayoutDashboard,
  Settings,
  FileText,
  Briefcase,
  Home,
  BookOpen,
  Users,
  UserSearch,
  ClipboardList,
  MessageCircle,
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
    title: "Marketing Site",
    items: [
      { name: "Landing Page", href: "/landing", icon: Home },
      { name: "Support Bot", href: "/landing/support-bot", icon: MessageCircle },
    ],
  },
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
  const [showAdminQuickReference, setShowAdminQuickReference] = useState(false);
  const [showAdminExamples, setShowAdminExamples] = useState(false);
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [showCandidates, setShowCandidates] = useState(false);
  const [showApplicantTracker, setShowApplicantTracker] = useState(false);
  const [showSupportBot, setShowSupportBot] = useState(false);
  // Track when we've applied flag values at least once (prevents flash of unauthorized links)
  const [navReady, setNavReady] = useState(false);

  const previousValuesRef = useRef<Record<string, boolean | undefined>>({});

  useEffect(() => {
    if (!flagsReady) {
      // Reset readiness so we show skeleton until flags load again
      setNavReady(false);
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
    updateFlag(FLAG_KEYS.SHOW_ADMIN_QUICK_REFERENCE_PAGE, flags[FLAG_KEYS.SHOW_ADMIN_QUICK_REFERENCE_PAGE], true, setShowAdminQuickReference);
    updateFlag(FLAG_KEYS.SHOW_ADMIN_EXAMPLES_PAGE, flags[FLAG_KEYS.SHOW_ADMIN_EXAMPLES_PAGE], true, setShowAdminExamples);
    updateFlag(FLAG_KEYS.SHOW_BUSINESS_USER_MODE, flags[FLAG_KEYS.SHOW_BUSINESS_USER_MODE], false, setIsBusinessMode);
    updateFlag(FLAG_KEYS.SHOW_CANDIDATES_PAGE, flags[FLAG_KEYS.SHOW_CANDIDATES_PAGE], true, setShowCandidates);
    updateFlag(FLAG_KEYS.SHOW_APPLICANT_TRACKER_PAGE, flags[FLAG_KEYS.SHOW_APPLICANT_TRACKER_PAGE], true, setShowApplicantTracker);
    // Support Bot access is controlled by show-chatbot (separate from premium demo targeting).
    updateFlag(FLAG_KEYS.SHOW_CHATBOT, flags[FLAG_KEYS.SHOW_CHATBOT], false, setShowSupportBot);

    // Mark navigation as ready once we've applied the latest flag values
    setNavReady(true);
  }, [flags, flagsReady]);

  // Don't render navigation until flags are ready to prevent flash of links the user shouldn't see.
  // (Example: if `show-chatbot` is false for Free users, we don't want that link to briefly appear.)
  if (!flagsReady || !navReady) {
    return (
      <aside className="w-64 bg-background-secondary border-r border-border flex flex-col">
        <Link href="/landing" className="p-4 border-b border-border hover:bg-background-tertiary transition-colors">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">Career Stack</div>
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

  // Filter navigation items based on LaunchDarkly flags.
  // This is the "navigation layer" of gating; pages also gate themselves to prevent direct URL access.
  const filteredNavigation = navigation.map((section) => {
    if (section.title === "Marketing Site") {
      return {
        ...section,
        items: section.items.filter((item) => {
          if (item.href === "/landing/support-bot") return showSupportBot;
          return true;
        }),
      };
    }
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
  }).filter((section) => section.items.length > 0); // Remove empty sections

  return (
    <aside className="w-64 bg-background-secondary border-r border-border flex flex-col">
      <Link href="/landing" className="p-4 border-b border-border hover:bg-background-tertiary transition-colors">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground">Career Stack</div>
            <div className="text-xs text-foreground-secondary truncate">
              Local Workspace
            </div>
          </div>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Marketing Site - at top for Business mode */}
        {isBusinessMode && (
          <div>
            <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
              Marketing Site
            </div>
            <div className="space-y-1">
            <Link
              href="/landing"
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === "/landing" || pathname?.startsWith("/landing/")
                  ? "bg-background-tertiary text-foreground"
                  : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
              )}
            >
              <Home className="w-5 h-5" />
              <span>Landing Page</span>
            </Link>
            {showSupportBot && (
              <Link
                href="/landing/support-bot"
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  pathname === "/landing/support-bot"
                    ? "bg-background-tertiary text-foreground"
                    : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
                )}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Support Bot</span>
              </Link>
            )}
            </div>
          </div>
        )}

        {/* Business User Navigation - shown when business mode is enabled */}
        {isBusinessMode && (
          <div>
            <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
              Recruiting
            </div>
            <div className="space-y-1">
              {showCandidates && (
                <Link
                  href="/business/candidates"
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === "/business/candidates"
                      ? "bg-background-tertiary text-foreground"
                      : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
                  )}
                >
                  <UserSearch className="w-5 h-5" />
                  <span>Candidates</span>
                </Link>
              )}
              {showApplicantTracker && (
                <Link
                  href="/business/applicants"
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === "/business/applicants"
                      ? "bg-background-tertiary text-foreground"
                      : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
                  )}
                >
                  <ClipboardList className="w-5 h-5" />
                  <span>Applicant Tracker</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Job Seeker Navigation - hidden when business mode is enabled */}
        {!isBusinessMode && filteredNavigation.map((section) => (
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
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="truncate">{item.name}</span>
                      {item.href === "/analytics" && (
                        <span className="shrink-0 text-[10px] leading-4 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          Premium
                        </span>
                      )}
                    </span>
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
              {showAdminQuickReference && (
                <Link
                  href="/admin/quick-reference"
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === "/admin/quick-reference"
                      ? "bg-danger/10 text-danger border border-danger/20"
                      : "text-danger hover:bg-danger/10 hover:text-danger border border-danger/20"
                  )}
                >
                  <StickyNote className="w-5 h-5" />
                  <span>Quick Reference</span>
                </Link>
              )}
              {showAdminExamples && (
                <Link
                  href="/admin/examples"
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === "/admin/examples"
                      ? "bg-danger/10 text-danger border border-danger/20"
                      : "text-danger hover:bg-danger/10 hover:text-danger border border-danger/20"
                  )}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Examples</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}

