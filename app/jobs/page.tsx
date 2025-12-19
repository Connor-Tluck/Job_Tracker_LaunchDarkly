"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { jobs as initialJobs, Job } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { CSVImportModal } from "@/components/jobs/CSVImportModal";
import { AddJobModal } from "@/components/jobs/AddJobModal";
import { EditableJobRow } from "@/components/jobs/EditableJobRow";
import { cn } from "@/lib/utils";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext } from "@/lib/launchdarkly/userContext";
import { trackPageView } from "@/lib/launchdarkly/tracking";
import { useFlagsReady } from "@/hooks/useFlagsReady";
import {
  Plus,
  ArrowRight,
  CalendarClock,
  RefreshCcw,
  Search as SearchIcon,
} from "lucide-react";

const statusFilters = [
  "All",
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
] as const;

export default function JobsPage() {
  // All hooks must be called before any conditional returns
  const router = useRouter();
  const params = useSearchParams();
  // LaunchDarkly client can be undefined until initialized; normalize to null for our tracking helpers.
  const ldClient = useLDClient() ?? null;
  const userContext = getOrCreateUserContext();
  const flagsReady = useFlagsReady();
  
  // Feature flags
  // Page access: if show-jobs-page is OFF, we do not render /jobs.
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_JOBS_PAGE, true);
  const isBusinessMode = useFeatureFlag(FLAG_KEYS.SHOW_BUSINESS_USER_MODE, false);
  const enableCSVImport = useFeatureFlag(FLAG_KEYS.ENABLE_CSV_IMPORT, true);
  // Feature access: if enable-timeline-view is OFF, we block /jobs?view=timeline.
  const enableTimelineView = useFeatureFlag(FLAG_KEYS.ENABLE_TIMELINE_VIEW, true);

  const viewMode = params.get("view");

  // State/hooks must be declared before any early returns to avoid hook-order issues
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" || job.phase === status;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, status]);

  // Track page view
  useEffect(() => {
    if (flagsReady && canAccess && !isBusinessMode) {
      const viewType = viewMode === "timeline" ? "timeline" : "table";
      trackPageView(ldClient, userContext, `jobs-${viewType}`, { viewMode: viewType });
    }
  }, [ldClient, userContext, canAccess, viewMode, flagsReady, isBusinessMode]);

  // Prevent UI flash while flags initialize (and enforce role-based app mode)
  if (!flagsReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-foreground-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Business users should not access Job Seeker pages
  if (isBusinessMode) {
    return notFound();
  }

  // Page access check (after all hooks)
  if (!canAccess) {
    return notFound();
  }

  // Feature access check: Timeline view must be enabled to render via deep link (?view=timeline)
  if (viewMode === "timeline" && !enableTimelineView) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <SectionCard
        title={
          <div className="flex items-center gap-2">
            <span>Applications</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background-tertiary text-foreground-secondary">
              {filteredJobs.length} shown
            </span>
          </div>
        }
        description="Filter by stage, then search by company or role."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="primary" size="sm" onClick={() => setIsAddJobOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Job
            </Button>
            <AddJobModal
              isOpen={isAddJobOpen}
              onClose={() => setIsAddJobOpen(false)}
              onAdd={(newJob) => {
                setJobs((prevJobs) => [newJob, ...prevJobs]);
              }}
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Google Sheets sync placeholder. Replace with API call later.")}
            >
              <RefreshCcw className="w-4 h-4" />
              Manual Sync
            </Button>

            {enableTimelineView && (
              <Link href={viewMode === "timeline" ? "/jobs" : "/jobs?view=timeline"}>
                <Button variant="outline" size="sm">
                  <CalendarClock className="w-4 h-4" />
                  {viewMode === "timeline" ? "Table" : "Timeline"}
                </Button>
              </Link>
            )}

            {enableCSVImport && (
              <>
                <Button variant="primary" size="sm" onClick={() => setIsImportOpen(true)}>
                  Import CSV <ArrowRight className="w-4 h-4" />
                </Button>
                <CSVImportModal
                  isOpen={isImportOpen}
                  onClose={() => setIsImportOpen(false)}
                  onImport={(importedJobs) => {
                    setJobs((prevJobs) => [...prevJobs, ...importedJobs]);
                  }}
                />
              </>
            )}
          </div>
        }
        contentClassName="space-y-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:w-[420px]">
            <div className="flex items-center gap-2 h-11 rounded-xl border border-border bg-background-secondary px-4">
              <SearchIcon className="w-4 h-4 text-foreground-secondary" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search company or job title"
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setStatus(filter)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm border transition-colors",
                  status === filter
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "border-border text-foreground-secondary hover:text-foreground hover:bg-background-tertiary"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {viewMode === "timeline" ? (
          <TimelineList jobs={filteredJobs} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Response</TableHead>
                  <TableHead>Next Step</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <EditableJobRow
                    key={job.id}
                    job={job}
                    onUpdate={(updatedJob) => {
                      setJobs((prevJobs) =>
                        prevJobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
                      );
                    }}
                    onRowClick={() => router.push(`/jobs/${job.id}`)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function TimelineList({ jobs }: { jobs: Job[] }) {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <article
          key={job.id}
          className="rounded-xl border border-border bg-background-secondary/40 p-4 shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{job.company}</h3>
              <p className="text-sm text-foreground-secondary">{job.title}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = `/jobs/${job.id}`)}
            >
              Open Prep
            </Button>
          </div>
          <div className="space-y-2">
            {job.timeline.map((event) => (
              <div key={`${job.id}-${event.date}-${event.label}`} className="flex items-center gap-3 text-sm">
                <span className="text-xs text-foreground-secondary w-24">{event.date}</span>
                <span className="flex-1">{event.label}</span>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
