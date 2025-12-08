"use client";

import { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
  jobs as initialJobs,
  prepDocs as initialPrepDocs,
  starStories,
  Job,
  JobPhase,
  TimelineEntry,
  PrepDoc,
} from "@/lib/mock-data";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Edit2, Check, X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";

export default function JobDetailPage() {
  // All hooks must be called before any conditional returns
  const params = useParams();
  const jobId = params?.jobId as string;
  
  // Component visibility flags
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_JOB_DETAIL_PAGE, true);
  const showTimeline = useFeatureFlag(FLAG_KEYS.SHOW_JOB_TIMELINE_SECTION, true);
  const showPrepChecklist = useFeatureFlag(FLAG_KEYS.SHOW_JOB_PREP_CHECKLIST, true);
  const showStarStories = useFeatureFlag(FLAG_KEYS.SHOW_JOB_STAR_STORIES, true);
  const showMetrics = useFeatureFlag(FLAG_KEYS.SHOW_JOB_METRICS_CARDS, true);
  const enableInlineEditing = useFeatureFlag(FLAG_KEYS.ENABLE_INLINE_EDITING, true);

  // Page access check (after all hooks)
  if (!canAccess) {
    return notFound();
  }

  const initialJob = initialJobs.find((entry) => entry.id === jobId);

  const [job, setJob] = useState<Job | null>(initialJob || null);
  const [prepDoc, setPrepDoc] = useState<PrepDoc | undefined>(initialJob ? initialPrepDocs[initialJob.prepDocId] : undefined);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editingTimelineIndex, setEditingTimelineIndex] = useState<number | null>(null);
  const [newTimelineEvent, setNewTimelineEvent] = useState<{ date: string; label: string; notes?: string } | null>(null);
  const [editingPrepField, setEditingPrepField] = useState<string | null>(null);
  const [editingPrepValue, setEditingPrepValue] = useState<string | string[]>("");

  // Conditional returns after all hooks
  if (!initialJob || !job) {
    return notFound();
  }

  if (!canAccess) {
    return notFound();
  }

  const relatedStories = job ? starStories.filter((story) => story.tags.some((tag) => job.tags.includes(tag))) : [];

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingField) return;

    const updatedJob = { ...job };
    if (editingField === "company") updatedJob.company = editValue;
    else if (editingField === "title") updatedJob.title = editValue;
    else if (editingField === "applicationDate") updatedJob.applicationDate = editValue;
    else if (editingField === "contactName") updatedJob.contactName = editValue;
    else if (editingField === "contactType") updatedJob.contactType = editValue;
    else if (editingField === "nextStep") updatedJob.nextStep = editValue;
    else if (editingField === "response") {
      updatedJob.response = editValue as "Yes" | "No" | "Pending";
    } else if (editingField === "phase") {
      updatedJob.phase = editValue as JobPhase;
    }

    setJob(updatedJob);
    setEditingField(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const startPrepEdit = (field: string, currentValue: string | string[]) => {
    setEditingPrepField(field);
    setEditingPrepValue(currentValue);
  };

  const savePrepEdit = () => {
    if (!editingPrepField || !prepDoc) return;

    const updatedPrepDoc = { ...prepDoc };
    if (editingPrepField === "companySummary") updatedPrepDoc.companySummary = editingPrepValue as string;
    else if (editingPrepField === "whyCompany") updatedPrepDoc.whyCompany = editingPrepValue as string;
    else if (editingPrepField === "overview") updatedPrepDoc.overview = editingPrepValue as string;
    else if (editingPrepField === "productPillars") updatedPrepDoc.productPillars = editingPrepValue as string[];
    else if (editingPrepField === "customerProfiles") updatedPrepDoc.customerProfiles = editingPrepValue as string[];
    else if (editingPrepField === "questionsForThem") updatedPrepDoc.questionsForThem = editingPrepValue as string[];
    else if (editingPrepField === "prepChecklist") updatedPrepDoc.prepChecklist = editingPrepValue as string[];

    setPrepDoc(updatedPrepDoc);
    setEditingPrepField(null);
    setEditingPrepValue("");
  };

  const cancelPrepEdit = () => {
    setEditingPrepField(null);
    setEditingPrepValue("");
  };

  const addTimelineEvent = () => {
    if (newTimelineEvent && newTimelineEvent.date && newTimelineEvent.label) {
      setJob({
        ...job,
        timeline: [...job.timeline, newTimelineEvent],
      });
      setNewTimelineEvent(null);
    }
  };

  const updateTimelineEvent = (index: number, field: "date" | "label" | "notes", value: string) => {
    const updatedTimeline = [...job.timeline];
    updatedTimeline[index] = { ...updatedTimeline[index], [field]: value };
    setJob({ ...job, timeline: updatedTimeline });
  };

  const deleteTimelineEvent = (index: number) => {
    setJob({
      ...job,
      timeline: job.timeline.filter((_, i) => i !== index),
    });
  };

  const addListItem = (field: "productPillars" | "customerProfiles" | "questionsForThem" | "prepChecklist") => {
    if (!prepDoc) return;
    const newItem = prompt(`Add new ${field.replace(/([A-Z])/g, " $1").toLowerCase()}:`);
    if (newItem) {
      const updatedPrepDoc = { ...prepDoc };
      updatedPrepDoc[field] = [...(updatedPrepDoc[field] || []), newItem];
      setPrepDoc(updatedPrepDoc);
    }
  };

  const removeListItem = (field: "productPillars" | "customerProfiles" | "questionsForThem" | "prepChecklist", index: number) => {
    if (!prepDoc) return;
    const updatedPrepDoc = { ...prepDoc };
    updatedPrepDoc[field] = (updatedPrepDoc[field] || []).filter((_, i) => i !== index);
    setPrepDoc(updatedPrepDoc);
  };

  const EditableField = ({
    field,
    value,
    children,
    className,
    type = "text",
    placeholder,
  }: {
    field: string;
    value: string;
    children?: React.ReactNode;
    className?: string;
    type?: "text" | "select" | "status" | "response";
    placeholder?: string;
  }) => {
    const isEditing = editingField === field;

    if (isEditing) {
      if (type === "select" || type === "status" || type === "response") {
        const options =
          type === "status"
            ? ["Applied", "Phone Screen", "Interview", "Offer", "Rejected"]
            : type === "response"
            ? ["Yes", "No", "Pending"]
            : [];

        return (
          <div className="flex items-center gap-2">
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 rounded-lg border border-primary bg-background-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") cancelEdit();
              }}
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <button
              onClick={saveEdit}
              className="p-2 text-success hover:bg-background-tertiary rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-2 text-danger hover:bg-background-tertiary rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 rounded-lg border border-primary bg-background-secondary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={placeholder}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            onBlur={saveEdit}
          />
          <button
            onClick={saveEdit}
            className="p-2 text-success hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={cancelEdit}
            className="p-2 text-danger hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className={cn("group relative flex items-center gap-2", className)}>
        {children || value || placeholder || "—"}
        {enableInlineEditing && (
          <button
            onClick={() => startEdit(field, value || "")}
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-background-tertiary rounded-lg transition-opacity"
            title="Click to edit"
          >
            <Edit2 className="w-4 h-4 text-foreground-secondary" />
          </button>
        )}
      </div>
    );
  };

  const EditableTextArea = ({
    field,
    value,
    placeholder,
    className,
  }: {
    field: string;
    value: string;
    placeholder?: string;
    className?: string;
  }) => {
    const isEditing = editingPrepField === field;

    if (isEditing) {
      return (
        <div className="space-y-2">
          <textarea
            value={editingPrepValue as string}
            onChange={(e) => setEditingPrepValue(e.target.value)}
            className="w-full rounded-lg border border-primary bg-background-secondary px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={placeholder}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") cancelPrepEdit();
              if (e.key === "Enter" && e.metaKey) savePrepEdit();
            }}
          />
          <div className="flex items-center gap-2">
            <Button size="sm" variant="primary" onClick={savePrepEdit}>
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={cancelPrepEdit}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <span className="text-xs text-foreground-secondary">Press Cmd+Enter to save</span>
          </div>
        </div>
      );
    }

    return (
      <div className="group relative">
        <p className={cn("text-sm text-foreground-secondary whitespace-pre-line", className)}>
          {value || placeholder || "Click to add content"}
        </p>
        <button
          onClick={() => startPrepEdit(field, value || "")}
          className="opacity-0 group-hover:opacity-100 absolute top-0 right-0 p-1.5 hover:bg-background-tertiary rounded-lg transition-opacity"
          title="Click to edit"
        >
          <Edit2 className="w-4 h-4 text-foreground-secondary" />
        </button>
      </div>
    );
  };

  const EditableList = ({
    field,
    items,
    title,
    placeholder,
  }: {
    field: "productPillars" | "customerProfiles" | "questionsForThem" | "prepChecklist";
    items: string[];
    title: string;
    placeholder?: string;
  }) => {
    const isEditing = editingPrepField === field;

    if (isEditing) {
      const itemsArray = Array.isArray(editingPrepValue) ? editingPrepValue : [];
      return (
        <div className="space-y-2">
          <textarea
            value={itemsArray.join("\n")}
            onChange={(e) => setEditingPrepValue(e.target.value.split("\n").filter(Boolean))}
            className="w-full rounded-lg border border-primary bg-background-secondary px-3 py-2 text-sm min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder={placeholder || "One item per line"}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") cancelPrepEdit();
              if (e.key === "Enter" && e.metaKey) savePrepEdit();
            }}
          />
          <div className="flex items-center gap-2">
            <Button size="sm" variant="primary" onClick={savePrepEdit}>
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={cancelPrepEdit}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between group/item">
          <div className="flex-1">
            {items.length > 0 ? (
              <ul className="space-y-2">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 group/list-item">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="flex-1 text-sm text-foreground-secondary">{item}</span>
                    <button
                      onClick={() => removeListItem(field, idx)}
                      className="opacity-0 group-hover/list-item:opacity-100 p-1 text-danger hover:bg-background-tertiary rounded transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-foreground-muted italic">{placeholder || "No items yet"}</p>
            )}
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
            <button
              onClick={() => startPrepEdit(field, items)}
              className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors"
              title="Edit list"
            >
              <Edit2 className="w-4 h-4 text-foreground-secondary" />
            </button>
            <button
              onClick={() => addListItem(field)}
              className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors"
              title="Add item"
            >
              <Plus className="w-4 h-4 text-foreground-secondary" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3 flex-1">
          <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Company Prep</p>
          <div className="flex items-center gap-3">
            <EditableField field="company" value={job.company} className="text-4xl font-semibold">
              <h1 className="text-4xl font-semibold">{job.company}</h1>
            </EditableField>
            <EditableField field="phase" value={job.phase} type="status">
              <JobStatusBadge status={job.phase} />
            </EditableField>
          </div>
          <EditableField field="title" value={job.title} className="text-lg text-foreground-secondary">
            <p className="text-lg text-foreground-secondary">{job.title}</p>
          </EditableField>
          <div className="flex flex-wrap items-center gap-3 text-sm text-foreground-secondary">
            <span>Applied</span>
            <EditableField field="applicationDate" value={job.applicationDate} type="text" placeholder="YYYY-MM-DD">
              {job.applicationDate}
            </EditableField>
            <span>·</span>
            <span>{job.metrics.touchpoints} touchpoints</span>
            <span>·</span>
            <span>Next step:</span>
            <EditableField field="nextStep" value={job.nextStep || ""} placeholder="Add next step">
              {job.nextStep || "—"}
            </EditableField>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-foreground-secondary">
            <span>Contact</span>
            <EditableField field="contactName" value={job.contactName || ""} placeholder="Contact name">
              {job.contactName || "N/A"}
            </EditableField>
            <span>·</span>
            <EditableField field="contactType" value={job.contactType || ""} placeholder="Contact type">
              {job.contactType || "—"}
            </EditableField>
            <span>·</span>
            <EditableField field="response" value={job.response} type="response">
              Response: {job.response}
            </EditableField>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => alert("Attach Google Doc placeholder")}>
            Link Drive Doc
          </Button>
          <Button variant="primary" onClick={() => alert("Start mock interview placeholder")}>
            Start Prep Session
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      {showMetrics && (
        <section className="grid gap-4 lg:grid-cols-4">
          <MetricCard label="Days since apply" value={job.metrics.daysSinceApply} />
          <MetricCard label="Touchpoints" value={job.metrics.touchpoints} />
          <MetricCard label="Confidence" value={`${job.metrics.confidence}%`} />
          <MetricCard label="Response" value={job.response} />
        </section>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        {/* Left Column - Timeline and Prep Content */}
        <div className="space-y-8">
          {/* Timeline Section */}
          {showTimeline && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Timeline</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNewTimelineEvent({ date: "", label: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add update
                </Button>
              </div>
              <Card className="p-6 space-y-4">
              {newTimelineEvent && (
                <div className="p-4 rounded-lg border-2 border-primary bg-background-secondary space-y-3">
                  <input
                    type="text"
                    placeholder="Date (YYYY-MM-DD)"
                    value={newTimelineEvent.date}
                    onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, date: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background-tertiary px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Event label"
                    value={newTimelineEvent.label}
                    onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, label: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background-tertiary px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={newTimelineEvent.notes || ""}
                    onChange={(e) => setNewTimelineEvent({ ...newTimelineEvent, notes: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background-tertiary px-3 py-2 text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="primary" onClick={addTimelineEvent}>
                      <Check className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setNewTimelineEvent(null)}>
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                {job.timeline.map((event, idx) => (
                  <div key={`${job.id}-${event.date}-${idx}`} className="flex gap-4 group">
                    <div className="w-28 flex-shrink-0">
                      {editingTimelineIndex === idx ? (
                        <input
                          type="text"
                          value={event.date}
                          onChange={(e) => updateTimelineEvent(idx, "date", e.target.value)}
                          className="w-full rounded-lg border border-primary bg-background-secondary px-2 py-1 text-sm"
                          onBlur={() => setEditingTimelineIndex(null)}
                          autoFocus
                        />
                      ) : (
                        <div
                          className="text-sm text-foreground-secondary cursor-pointer hover:text-foreground"
                          onClick={() => setEditingTimelineIndex(idx)}
                        >
                          {event.date}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      {editingTimelineIndex === idx ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={event.label}
                            onChange={(e) => updateTimelineEvent(idx, "label", e.target.value)}
                            className="w-full rounded-lg border border-primary bg-background-secondary px-2 py-1 text-sm font-medium"
                            onBlur={() => setEditingTimelineIndex(null)}
                          />
                          <input
                            type="text"
                            value={event.notes || ""}
                            onChange={(e) => updateTimelineEvent(idx, "notes", e.target.value)}
                            placeholder="Notes (optional)"
                            className="w-full rounded-lg border border-primary bg-background-secondary px-2 py-1 text-sm"
                            onBlur={() => setEditingTimelineIndex(null)}
                          />
                        </div>
                      ) : (
                        <>
                          <p
                            className="font-medium cursor-pointer hover:text-primary transition-colors"
                            onClick={() => setEditingTimelineIndex(idx)}
                          >
                            {event.label}
                          </p>
                          {event.notes && (
                            <p className="text-sm text-foreground-secondary">{event.notes}</p>
                          )}
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTimelineEvent(idx)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-danger hover:bg-background-tertiary rounded-lg transition-opacity flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </section>
          )}

          {/* Company Overview */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
            <Card className="p-6">
              <EditableTextArea
                field="companySummary"
                value={prepDoc?.companySummary || ""}
                placeholder="Add company summary..."
              />
            </Card>
          </section>

          {/* Why This Company */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Why This Company</h2>
            <Card className="p-6">
              <EditableTextArea
                field="whyCompany"
                value={prepDoc?.whyCompany || ""}
                placeholder="Add why statement..."
              />
            </Card>
          </section>

          {/* Product Pillars */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Product Pillars</h2>
            <Card className="p-6">
              <EditableList
                field="productPillars"
                items={prepDoc?.productPillars || []}
                title="Product Pillars"
                placeholder="Add product pillars..."
              />
            </Card>
          </section>

          {/* Customer Profiles */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Customer Profiles</h2>
            <Card className="p-6">
              <EditableList
                field="customerProfiles"
                items={prepDoc?.customerProfiles || []}
                title="Customer Profiles"
                placeholder="Add customer profiles..."
              />
            </Card>
          </section>

          {/* Interview Questions */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Questions to Ask</h2>
            <Card className="p-6">
              <EditableList
                field="questionsForThem"
                items={prepDoc?.questionsForThem || []}
                title="Questions"
                placeholder="Add interview questions..."
              />
            </Card>
          </section>
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="space-y-6">
          {/* Prep Checklist */}
          {showPrepChecklist && (
            <section>
              <h2 className="text-lg font-semibold mb-3">Prep Checklist</h2>
              <Card className="p-6">
                <EditableList
                  field="prepChecklist"
                  items={prepDoc?.prepChecklist || []}
                  title="Checklist"
                  placeholder="Add prep items..."
                />
              </Card>
            </section>
          )}

          {/* Tailored Stories */}
          {showStarStories && (
            <section>
              <h2 className="text-lg font-semibold mb-3">Tailored Stories</h2>
              <Card className="p-6 space-y-4">
                {relatedStories.length > 0 ? (
                  relatedStories.map((story) => (
                    <div key={story.id} className="rounded-lg border border-border-subtle p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{story.title}</p>
                        <Link href="/star-stories" className="text-xs text-primary hover:underline">
                          View →
                        </Link>
                      </div>
                      <p className="text-xs text-foreground-secondary line-clamp-2">{story.result}</p>
                      <div className="flex flex-wrap gap-1">
                        {story.tags.slice(0, 3).map((tag) => (
                          <span
                            key={`${story.id}-${tag}`}
                            className="text-[10px] uppercase tracking-wide text-foreground-secondary bg-background-tertiary px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-foreground-secondary">No mapped stories yet.</p>
                )}
              </Card>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="p-6 space-y-1">
      <p className="text-xs uppercase tracking-wide text-foreground-secondary">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
    </Card>
  );
}
