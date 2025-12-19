"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useFlagsReady } from "@/hooks/useFlagsReady";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { notFound } from "next/navigation";
import {
  Users,
  Phone,
  Video,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  ChevronRight,
  MoreHorizontal,
  Star,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Pipeline stages
const PIPELINE_STAGES = [
  // Neutral palettes to tone down color saturation
  { id: "applied", name: "Applied", icon: FileText, color: "bg-background-tertiary text-foreground" },
  { id: "screening", name: "Screening", icon: Phone, color: "bg-background-tertiary text-foreground" },
  { id: "interview", name: "Interview", icon: Video, color: "bg-background-tertiary text-foreground" },
  { id: "offer", name: "Offer", icon: CheckCircle, color: "bg-background-tertiary text-foreground" },
  { id: "hired", name: "Hired", icon: Star, color: "bg-background-tertiary text-foreground" },
  { id: "rejected", name: "Rejected", icon: XCircle, color: "bg-background-tertiary text-foreground" },
];

// Mock applicant data
const MOCK_APPLICANTS = [
  {
    id: "app-001",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    position: "Senior Software Engineer",
    stage: "interview",
    appliedDate: "2024-01-05",
    lastActivity: "2024-01-12",
    rating: 5,
    notes: "Strong technical skills, great culture fit. Moving to final round.",
    interviewScheduled: "2024-01-15T14:00:00Z",
    source: "LinkedIn",
  },
  {
    id: "app-002",
    name: "Marcus Johnson",
    email: "mjohnson@techmail.com",
    position: "Full Stack Developer",
    stage: "screening",
    appliedDate: "2024-01-08",
    lastActivity: "2024-01-10",
    rating: 4,
    notes: "Good portfolio, scheduling phone screen.",
    interviewScheduled: null,
    source: "Referral",
  },
  {
    id: "app-003",
    name: "Emily Rodriguez",
    email: "emily.r@devs.io",
    position: "Frontend Engineer",
    stage: "offer",
    appliedDate: "2023-12-20",
    lastActivity: "2024-01-11",
    rating: 5,
    notes: "Excellent interviews across all rounds. Offer sent, awaiting response.",
    interviewScheduled: null,
    source: "Job Board",
  },
  {
    id: "app-004",
    name: "David Kim",
    email: "dkim.dev@gmail.com",
    position: "Staff Engineer",
    stage: "interview",
    appliedDate: "2024-01-02",
    lastActivity: "2024-01-09",
    rating: 4,
    notes: "Very experienced, slight concerns about team fit. Second interview scheduled.",
    interviewScheduled: "2024-01-14T10:00:00Z",
    source: "Direct Apply",
  },
  {
    id: "app-005",
    name: "Lisa Patel",
    email: "lisa.patel@work.com",
    position: "Backend Engineer",
    stage: "applied",
    appliedDate: "2024-01-11",
    lastActivity: "2024-01-11",
    rating: 0,
    notes: "",
    interviewScheduled: null,
    source: "Career Page",
  },
  {
    id: "app-006",
    name: "Alex Thompson",
    email: "athompson@devmail.com",
    position: "DevOps Engineer",
    stage: "rejected",
    appliedDate: "2024-01-03",
    lastActivity: "2024-01-08",
    rating: 2,
    notes: "Did not meet technical requirements. Sent rejection email.",
    interviewScheduled: null,
    source: "LinkedIn",
  },
  {
    id: "app-007",
    name: "Jennifer Wu",
    email: "jwu@techcorp.io",
    position: "Senior Software Engineer",
    stage: "screening",
    appliedDate: "2024-01-09",
    lastActivity: "2024-01-10",
    rating: 4,
    notes: "Strong resume, good experience with our stack.",
    interviewScheduled: null,
    source: "Referral",
  },
  {
    id: "app-008",
    name: "Michael Brown",
    email: "mbrown@email.com",
    position: "Frontend Engineer",
    stage: "hired",
    appliedDate: "2023-12-01",
    lastActivity: "2024-01-02",
    rating: 5,
    notes: "Accepted offer! Start date: January 15, 2024",
    interviewScheduled: null,
    source: "LinkedIn",
  },
];

export default function ApplicantTrackerPage() {
  const flagsReady = useFlagsReady();
  const isBusinessMode = useFeatureFlag(FLAG_KEYS.SHOW_BUSINESS_USER_MODE);
  const showApplicantTracker = useFeatureFlag(FLAG_KEYS.SHOW_APPLICANT_TRACKER_PAGE);

  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline");

  // Loading state
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

  // Access control - must be business mode
  if (!isBusinessMode || !showApplicantTracker) {
    return notFound();
  }

  const getApplicantsByStage = (stageId: string) => {
    return MOCK_APPLICANTS.filter((a) => a.stage === stageId);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const filteredApplicants = selectedStage
    ? MOCK_APPLICANTS.filter((a) => a.stage === selectedStage)
    : MOCK_APPLICANTS;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background-secondary px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Applicant Tracker
            </h1>
            <p className="text-foreground-secondary mt-1">
              Manage your hiring pipeline and track candidate progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-background rounded-lg border border-border p-1">
              <button
                onClick={() => setViewMode("pipeline")}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  viewMode === "pipeline"
                    ? "bg-primary text-white"
                    : "text-foreground-secondary hover:text-foreground"
                )}
              >
                Pipeline
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "text-foreground-secondary hover:text-foreground"
                )}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="mt-6 grid grid-cols-6 gap-4">
          {PIPELINE_STAGES.map((stage) => {
            const count = getApplicantsByStage(stage.id).length;
            const Icon = stage.icon;
            const isSelected = selectedStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() =>
                  setSelectedStage(isSelected ? null : stage.id)
                }
                className={cn(
                  "p-4 rounded-lg border transition-all text-left",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-background hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center",
                      stage.color
                    )}
                  >
                    <Icon className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {count}
                    </div>
                    <div className="text-xs text-foreground-secondary">
                      {stage.name}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {viewMode === "pipeline" ? (
          /* Kanban Pipeline View */
          <div className="flex gap-4 overflow-x-auto pb-4">
            {PIPELINE_STAGES.filter((s) => s.id !== "rejected").map((stage) => {
              const applicants = getApplicantsByStage(stage.id);
              const Icon = stage.icon;
              return (
                <div
                  key={stage.id}
                  className="flex-shrink-0 w-80 bg-background-secondary rounded-lg border border-border"
                >
                  {/* Column Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-6 h-6 rounded flex items-center justify-center",
                            stage.color
                          )}
                        >
                          <Icon className="w-3 h-3 text-foreground" />
                        </div>
                        <span className="font-semibold text-foreground">
                          {stage.name}
                        </span>
                        <span className="text-sm text-foreground-secondary bg-background-tertiary px-2 py-0.5 rounded-full">
                          {applicants.length}
                        </span>
                      </div>
                      <button className="text-foreground-secondary hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Column Content */}
                  <div className="p-3 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                    {applicants.map((applicant) => (
                      <Card
                        key={applicant.id}
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-background-tertiary text-foreground flex items-center justify-center font-semibold border border-border">
                              {applicant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">
                                {applicant.name}
                              </h4>
                              <p className="text-xs text-foreground-secondary">
                                {applicant.position}
                              </p>
                            </div>
                          </div>
                          {applicant.rating > 0 && (
                            <div className="flex items-center gap-0.5 text-foreground-secondary">
                              <Star className="w-3 h-3" />
                              <span className="text-xs">{applicant.rating}</span>
                            </div>
                          )}
                        </div>

                        {applicant.interviewScheduled && (
                          <div className="mt-3 p-2 bg-primary/5 rounded-md flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-primary font-medium">
                              {formatDateTime(applicant.interviewScheduled)}
                            </span>
                          </div>
                        )}

                        {applicant.notes && (
                          <p className="mt-3 text-xs text-foreground-secondary line-clamp-2">
                            {applicant.notes}
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between text-xs text-foreground-muted">
                          <span>{applicant.source}</span>
                          <span>{formatDate(applicant.appliedDate)}</span>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <Button variant="ghost" size="sm" className="flex-1">
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1">
                            <ArrowRight className="w-3 h-3 mr-1" />
                            Move
                          </Button>
                        </div>
                      </Card>
                    ))}

                    {applicants.length === 0 && (
                      <div className="py-8 text-center text-foreground-secondary text-sm">
                        No applicants in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
              <div className="col-span-3">Candidate</div>
              <div className="col-span-2">Position</div>
              <div className="col-span-2">Stage</div>
              <div className="col-span-2">Applied</div>
              <div className="col-span-1">Rating</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Table Rows */}
            {filteredApplicants.map((applicant) => {
              const stage = PIPELINE_STAGES.find((s) => s.id === applicant.stage);
              const Icon = stage?.icon || FileText;
              return (
                <Card
                  key={applicant.id}
                  className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:shadow-md transition-shadow"
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-background-tertiary text-foreground flex items-center justify-center font-semibold border border-border">
                      {applicant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {applicant.name}
                      </h4>
                      <p className="text-xs text-foreground-secondary">
                        {applicant.email}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-sm text-foreground">
                      {applicant.position}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-foreground",
                        stage?.color
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {stage?.name}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <div className="text-sm text-foreground">
                      {formatDate(applicant.appliedDate)}
                    </div>
                    <div className="text-xs text-foreground-secondary">
                      via {applicant.source}
                    </div>
                  </div>

                  <div className="col-span-1">
                    {applicant.rating > 0 ? (
                      <div className="flex items-center gap-1 text-foreground-secondary">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">{applicant.rating}</span>
                      </div>
                    ) : (
                      <span className="text-foreground-muted text-sm">—</span>
                    )}
                  </div>

                  <div className="col-span-2 flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}

            {filteredApplicants.length === 0 && (
              <Card className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto text-foreground-secondary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">
                  No applicants found
                </h3>
                <p className="text-foreground-secondary">
                  {selectedStage
                    ? "No applicants in this stage"
                    : "Add candidates from the Candidates page to start tracking"}
                </p>
              </Card>
            )}
          </div>
        )}

        {/* Upcoming Interviews Alert */}
        {MOCK_APPLICANTS.filter((a) => a.interviewScheduled).length > 0 && (
          <Card className="mt-6 p-4 border-l-4 border-l-border">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-foreground-secondary mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground">
                  Upcoming Interviews
                </h4>
                <div className="mt-2 space-y-2">
                  {MOCK_APPLICANTS.filter((a) => a.interviewScheduled).map(
                    (applicant) => (
                      <div
                        key={applicant.id}
                        className="flex items-center gap-4 text-sm"
                      >
                        <span className="font-medium text-foreground">
                          {applicant.name}
                        </span>
                        <span className="text-foreground-secondary">
                          {applicant.position}
                        </span>
                        <span className="text-foreground font-medium">
                          {formatDateTime(applicant.interviewScheduled!)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

