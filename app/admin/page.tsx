"use client";

import { notFound } from "next/navigation";
import { useFeatureFlag, useFeatureFlags } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS, FLAG_METADATA } from "@/lib/launchdarkly/flags";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, XCircle, Copy, Search, Server } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { UserContextSwitcher } from "@/components/admin/UserContextSwitcher";
import { TargetingDemoCard } from "@/components/admin/TargetingDemoCard";
import { ChatTestCard } from "@/components/admin/ChatTestCard";

export default function AdminPage() {
  // Get all flags (must be called before any conditional returns)
  const allFlagKeys = Object.values(FLAG_KEYS) as Array<keyof typeof FLAG_KEYS>;
  const flags = useFeatureFlags(allFlagKeys);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    Object.values(FLAG_METADATA).forEach((meta) => {
      cats.add(meta.category);
    });
    return ["All", ...Array.from(cats).sort()];
  }, []);

  // Filter flags
  const filteredFlags = useMemo(() => {
    return allFlagKeys.filter((key) => {
      const metadata = FLAG_METADATA[key];
      const matchesSearch =
        metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || metadata.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, allFlagKeys]);

  // Page access check (after all hooks)
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_ADMIN_PAGE, true);
  if (!canAccess) {
    return notFound();
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Feature Flags</p>
        <h1 className="text-4xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-foreground-secondary mt-2">
          View and monitor all LaunchDarkly feature flags in real-time. Use this dashboard to see which flags are currently active, test user targeting by switching between different user contexts (Beta Tester, Premium User, Free User), and track AI model outputs based on active user groups. The Targeting Demo Card shows how flags respond to different user attributes, and the Chat Test Card allows you to test AI Config variations for different user segments.
        </p>
      </div>

      {/* Environment Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold">Current Environment</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                Production
              </span>
            </div>
            <p className="text-xs text-foreground-secondary">
              LaunchDarkly feature flags are retrieved from the production environment
            </p>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-foreground-secondary mb-1">Total Flags</p>
            <p className="text-2xl font-semibold">{allFlagKeys.length}</p>
          </div>
          <div>
            <p className="text-xs text-foreground-secondary mb-1">Enabled</p>
            <p className="text-2xl font-semibold text-success">
              {allFlagKeys.filter((key) => flags[key] ?? FLAG_METADATA[key].default).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground-secondary mb-1">Disabled</p>
            <p className="text-2xl font-semibold text-danger">
              {allFlagKeys.filter((key) => !(flags[key] ?? FLAG_METADATA[key].default)).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground-secondary mb-1">Filtered</p>
            <p className="text-2xl font-semibold">{filteredFlags.length}</p>
          </div>
        </div>
      </Card>

      {/* User Context Switcher & Targeting Demo */}
      <div className="grid md:grid-cols-2 gap-6">
        <UserContextSwitcher />
        <TargetingDemoCard />
      </div>

      {/* Chat Test Interface */}
      <ChatTestCard />

      {/* Search and Filter */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-secondary pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search flags by name, description, or key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-2 rounded-lg border border-border bg-background-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {/* Category Filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm border transition-colors whitespace-nowrap",
                  selectedCategory === category
                    ? "bg-primary text-white border-primary"
                    : "border-border text-foreground-secondary hover:text-foreground hover:bg-background-tertiary"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Flags Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFlags.map((flagKey) => {
          const metadata = FLAG_METADATA[flagKey];
          const isEnabled = flags[flagKey] ?? metadata.default;

          return (
            <Card key={flagKey} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{metadata.name}</h3>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                        isEnabled
                          ? "bg-success/10 text-success border border-success/20"
                          : "bg-danger/10 text-danger border border-danger/20"
                      )}
                    >
                      {isEnabled ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ON</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>OFF</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-foreground-secondary mb-2">{metadata.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-background-tertiary text-foreground-secondary">
                      {metadata.category}
                    </span>
                    <span className="text-foreground-muted">Default: {metadata.default ? "ON" : "OFF"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <code className="text-xs text-foreground-secondary font-mono bg-background-tertiary px-2 py-1 rounded">
                    {flagKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(flagKey)}
                    className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors"
                    title="Copy flag key"
                  >
                    <Copy className="w-4 h-4 text-foreground-secondary" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredFlags.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-foreground-secondary">No flags match your search criteria.</p>
        </Card>
      )}
    </div>
  );
}

