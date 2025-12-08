"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { jobs as initialJobs, Job } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { CSVImportModal } from "@/components/jobs/CSVImportModal";
import { EditableJobRow } from "@/components/jobs/EditableJobRow";
import { cn } from "@/lib/utils";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";

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
  
  // Feature flags
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_JOBS_PAGE, true);
  const enableCSVImport = useFeatureFlag(FLAG_KEYS.ENABLE_CSV_IMPORT, true);
  const enableTimelineView = useFeatureFlag(FLAG_KEYS.ENABLE_TIMELINE_VIEW, true);

  const viewMode = params.get("view");

  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All");
  const [isImportOpen, setIsImportOpen] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" || job.phase === status;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, status]);

  // Page access check (after all hooks)
  if (!canAccess) {
    return notFound();
  }

  const appliedCount = jobs.length;
  const responseCount = jobs.filter((job) => job.response === "Yes").length;
  const interviewingCount = jobs.filter((job) => job.phase === "Interview").length;
  const responseRate = appliedCount === 0 ? 0 : Math.round((responseCount / appliedCount) * 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Pipeline</p>
          <h1 className="text-3xl font-semibold">Job Tracker</h1>
          <p className="text-sm text-foreground-secondary">
            Sheets-style tracking with filters, next steps, and quick prep links.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => alert("Google Sheets sync placeholder. Replace with API call later.")}
          >
            Manual Sync
          </Button>
          {enableCSVImport && (
            <>
              <Button variant="primary" onClick={() => setIsImportOpen(true)}>
                Import CSV
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
      </div>

      <section className="grid gap-4 lg:grid-cols-4">
        <SummaryCard label="Applications logged" value={appliedCount} />
        <SummaryCard label="Responses" value={responseCount} />
        <SummaryCard label="Interviewing" value={interviewingCount} />
        <SummaryCard label="Response rate" value={`${responseRate}%`} />
      </section>

      <section className="rounded-2xl border border-border p-4 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setStatus(filter)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm border transition-colors",
                  status === filter
                    ? "bg-primary text-white border-primary"
                    : "border-border text-foreground-secondary hover:text-foreground"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company or job title"
              className="h-10 rounded-xl border border-border bg-background-secondary px-4 text-sm"
            />
            {enableTimelineView && (
              <Link
                href="/jobs?view=timeline"
                className={cn(
                  "text-sm px-3 py-2 rounded-lg border transition-colors",
                  viewMode === "timeline"
                    ? "bg-background-tertiary border-border"
                    : "border-border text-foreground-secondary hover:text-foreground"
                )}
              >
                Timeline
              </Link>
            )}
          </div>
        </div>

        {viewMode === "timeline" ? (
          <TimelineList jobs={filteredJobs} />
        ) : (
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
                <TableHead></TableHead>
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
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number | string }) {
  return (
    <article className="rounded-2xl border border-border bg-background-secondary/30 p-4 space-y-2">
      <p className="text-xs uppercase tracking-wide text-foreground-secondary">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
    </article>
  );
}

function TimelineList({ jobs }: { jobs: Job[] }) {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <article key={job.id} className="border border-border rounded-xl p-4 space-y-3">
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
