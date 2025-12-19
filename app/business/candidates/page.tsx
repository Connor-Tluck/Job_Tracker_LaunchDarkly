"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useFlagsReady } from "@/hooks/useFlagsReady";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { notFound } from "next/navigation";
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  MapPin,
  Briefcase,
  Code,
  GraduationCap,
  Star,
  ChevronDown,
  X,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock candidate data
const MOCK_CANDIDATES = [
  {
    id: "cand-001",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    location: "San Francisco, CA",
    title: "Senior Software Engineer",
    experience: 7,
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    tags: ["full-stack", "remote-friendly", "startup-experience"],
    education: "MS Computer Science, Stanford",
    availability: "2 weeks",
    rating: 5,
    status: "new",
    lastContact: null,
  },
  {
    id: "cand-002",
    name: "Marcus Johnson",
    email: "mjohnson@techmail.com",
    location: "Austin, TX",
    title: "Full Stack Developer",
    experience: 4,
    techStack: ["Python", "Django", "React", "Docker", "GCP"],
    tags: ["backend-focus", "devops", "mentorship"],
    education: "BS Software Engineering, UT Austin",
    availability: "Immediately",
    rating: 4,
    status: "contacted",
    lastContact: "2024-01-10",
  },
  {
    id: "cand-003",
    name: "Emily Rodriguez",
    email: "emily.r@devs.io",
    location: "Remote",
    title: "Frontend Engineer",
    experience: 5,
    techStack: ["Vue.js", "TypeScript", "CSS", "Figma", "Storybook"],
    tags: ["design-systems", "accessibility", "ux-focused"],
    education: "BA Design & CS, UCLA",
    availability: "1 month",
    rating: 5,
    status: "interviewing",
    lastContact: "2024-01-08",
  },
  {
    id: "cand-004",
    name: "David Kim",
    email: "dkim.dev@gmail.com",
    location: "Seattle, WA",
    title: "Staff Engineer",
    experience: 10,
    techStack: ["Go", "Kubernetes", "Rust", "gRPC", "Redis"],
    tags: ["distributed-systems", "architecture", "team-lead"],
    education: "PhD Computer Science, MIT",
    availability: "3 weeks",
    rating: 5,
    status: "new",
    lastContact: null,
  },
  {
    id: "cand-005",
    name: "Lisa Patel",
    email: "lisa.patel@work.com",
    location: "New York, NY",
    title: "Backend Engineer",
    experience: 3,
    techStack: ["Java", "Spring Boot", "MongoDB", "Kafka", "AWS"],
    tags: ["enterprise", "microservices", "fintech"],
    education: "BS Computer Science, NYU",
    availability: "2 weeks",
    rating: 4,
    status: "new",
    lastContact: null,
  },
  {
    id: "cand-006",
    name: "Alex Thompson",
    email: "athompson@devmail.com",
    location: "Denver, CO",
    title: "DevOps Engineer",
    experience: 6,
    techStack: ["Terraform", "AWS", "Python", "Ansible", "Jenkins"],
    tags: ["infrastructure", "automation", "cloud-native"],
    education: "BS Information Systems, CU Boulder",
    availability: "Immediately",
    rating: 4,
    status: "contacted",
    lastContact: "2024-01-12",
  },
];

const TECH_OPTIONS = [
  "React", "TypeScript", "Node.js", "Python", "Go", "Rust", "Java",
  "PostgreSQL", "MongoDB", "Redis", "AWS", "GCP", "Kubernetes", "Docker",
];

const TAG_OPTIONS = [
  "full-stack", "backend-focus", "frontend-focus", "remote-friendly",
  "startup-experience", "enterprise", "team-lead", "mentorship",
];

const EXPERIENCE_RANGES = [
  { label: "All Experience", min: 0, max: 100 },
  { label: "0-2 years", min: 0, max: 2 },
  { label: "3-5 years", min: 3, max: 5 },
  { label: "5-8 years", min: 5, max: 8 },
  { label: "8+ years", min: 8, max: 100 },
];

export default function CandidatesPage() {
  const flagsReady = useFlagsReady();
  const isBusinessMode = useFeatureFlag(FLAG_KEYS.SHOW_BUSINESS_USER_MODE);
  const showCandidates = useFeatureFlag(FLAG_KEYS.SHOW_CANDIDATES_PAGE);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [experienceRange, setExperienceRange] = useState(EXPERIENCE_RANGES[0]);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  // Filter candidates based on search and filters
  const filteredCandidates = useMemo(() => {
    return MOCK_CANDIDATES.filter((candidate) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = candidate.name.toLowerCase().includes(query);
        const matchesTitle = candidate.title.toLowerCase().includes(query);
        const matchesTech = candidate.techStack.some((t) =>
          t.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesTitle && !matchesTech) return false;
      }

      // Tech stack filter
      if (selectedTech.length > 0) {
        const hasMatch = selectedTech.some((tech) =>
          candidate.techStack.includes(tech)
        );
        if (!hasMatch) return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasMatch = selectedTags.some((tag) =>
          candidate.tags.includes(tag)
        );
        if (!hasMatch) return false;
      }

      // Experience filter
      if (
        candidate.experience < experienceRange.min ||
        candidate.experience > experienceRange.max
      ) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedTech, selectedTags, experienceRange]);

  const toggleCandidateSelection = (id: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

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
  if (!isBusinessMode || !showCandidates) {
    return notFound();
  }

  const getStatusColor = () => {
    // Soft, neutral badges to avoid bright, “AI-like” styling
    return "bg-background-tertiary text-foreground-secondary border border-border";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background-secondary">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Candidate Search
              </h1>
              <p className="text-foreground-secondary mt-1">
                Find and source top talent for your open positions
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedCandidates.length > 0 && (
                <Button variant="primary">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add {selectedCandidates.length} to Pipeline
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-2" />
                Filters
                <ChevronDown
                  className={cn(
                    "w-4 h-4 ml-2 transition-transform",
                    showFilters && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary" />
            <input
              type="text"
              placeholder="Search by name, title, or tech stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-6 pb-6 border-t border-border pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tech Stack Filter */}
              <div>
                <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2 block">
                  Tech Stack
                </label>
                <div className="flex flex-wrap gap-2">
                  {TECH_OPTIONS.slice(0, 8).map((tech) => (
                    <button
                      key={tech}
                      onClick={() =>
                        setSelectedTech((prev) =>
                          prev.includes(tech)
                            ? prev.filter((t) => t !== tech)
                            : [...prev, tech]
                        )
                      }
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-full border transition-colors",
                        selectedTech.includes(tech)
                          ? "bg-primary text-white border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      )}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Filter */}
              <div>
                <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2 block">
                  Experience Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_RANGES.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setExperienceRange(range)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-full border transition-colors",
                        experienceRange.label === range.label
                          ? "bg-primary text-white border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2 block">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.slice(0, 6).map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setSelectedTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        )
                      }
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-full border transition-colors",
                        selectedTags.includes(tag)
                          ? "bg-primary text-white border-primary"
                          : "bg-background border-border hover:border-primary/50"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedTech.length > 0 || selectedTags.length > 0 || experienceRange.label !== "All Experience") && (
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 flex-wrap">
                <span className="text-sm text-foreground-secondary">Active filters:</span>
                {selectedTech.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-background-tertiary text-foreground-secondary text-sm rounded-full border border-border"
                  >
                    {tech}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-foreground"
                      onClick={() => setSelectedTech((prev) => prev.filter((t) => t !== tech))}
                    />
                  </span>
                ))}
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-background-tertiary text-foreground-secondary text-sm rounded-full border border-border"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-foreground"
                      onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
                    />
                  </span>
                ))}
                {experienceRange.label !== "All Experience" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-background-tertiary text-foreground-secondary text-sm rounded-full border border-border">
                    {experienceRange.label}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-foreground"
                      onClick={() => setExperienceRange(EXPERIENCE_RANGES[0])}
                    />
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedTech([]);
                    setSelectedTags([]);
                    setExperienceRange(EXPERIENCE_RANGES[0]);
                  }}
                  className="text-sm text-foreground-secondary hover:text-foreground underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="p-6">
        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-foreground-secondary">
            Showing <span className="font-semibold text-foreground">{filteredCandidates.length}</span> candidates
          </p>
          <div className="flex items-center gap-4 text-sm text-foreground-secondary">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {MOCK_CANDIDATES.filter((c) => c.status === "new").length} new
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {MOCK_CANDIDATES.filter((c) => c.status === "contacted").length} contacted
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {MOCK_CANDIDATES.filter((c) => c.status === "interviewing").length} interviewing
            </span>
          </div>
        </div>

        {/* Candidate Cards */}
        <div className="grid gap-4">
          {filteredCandidates.map((candidate) => (
            <Card
              key={candidate.id}
              className={cn(
                "p-5 hover:shadow-lg transition-all cursor-pointer",
                selectedCandidates.includes(candidate.id) && "ring-2 ring-primary"
              )}
              onClick={() => toggleCandidateSelection(candidate.id)}
            >
              <div className="flex items-start gap-4">
                {/* Selection Checkbox */}
                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center mt-1 transition-colors",
                    selectedCandidates.includes(candidate.id)
                      ? "bg-primary border-primary"
                      : "border-border"
                  )}
                >
                  {selectedCandidates.includes(candidate.id) && (
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  )}
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-background-tertiary text-foreground flex items-center justify-center font-semibold text-lg border border-border">
                  {candidate.name.split(" ").map((n) => n[0]).join("")}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {candidate.name}
                        </h3>
                        <span
                          className={cn(
                            "px-2 py-0.5 text-xs rounded-full font-medium",
                            getStatusColor()
                          )}
                        >
                          {candidate.status}
                        </span>
                      </div>
                      <p className="text-foreground-secondary flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-4 h-4" />
                        {candidate.title} • {candidate.experience} years
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-foreground-secondary">
                      {[...Array(candidate.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4" />
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground-secondary">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {candidate.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {candidate.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {candidate.education}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Available: {candidate.availability}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {candidate.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-background-tertiary text-foreground-secondary text-xs rounded-md"
                      >
                        <Code className="w-3 h-3" />
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {candidate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-background-tertiary text-foreground-secondary text-xs rounded-full border border-border"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to pipeline logic
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add to Pipeline
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Contact logic
                    }}
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <Card className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-foreground-secondary mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No candidates found</h3>
            <p className="text-foreground-secondary">
              Try adjusting your search or filter criteria
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

