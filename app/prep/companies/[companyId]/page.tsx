"use client";

import { notFound } from "next/navigation";
import { prepDocs as initialPrepDocs, PrepDoc } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Edit2, ArrowLeft, FileText, CheckCircle2, MessageSquare, Users, Target, ListChecks, Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PrepDocModal } from "@/components/prep/PrepDocModal";
import { cn } from "@/lib/utils";

export default function CompanyPrepDetailPage({
  params,
}: {
  params: { companyId: string };
}) {
  const [prepDocs, setPrepDocs] = useState<Record<string, PrepDoc>>(initialPrepDocs);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string | string[]>("");

  const prepDoc = prepDocs[params.companyId];

  if (!prepDoc) {
    return notFound();
  }

  const companyName = params.companyId
    .replace("prep-", "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleSave = (docData: Omit<PrepDoc, "id"> & { id?: string }) => {
    const updatedDoc: PrepDoc = {
      ...docData,
      id: prepDoc.id,
    } as PrepDoc;
    setPrepDocs((prev) => ({ ...prev, [prepDoc.id]: updatedDoc }));
    setIsEditing(false);
  };

  const startEdit = (field: string, currentValue: string | string[]) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveFieldEdit = () => {
    if (!editingField) return;

    const updatedDoc = { ...prepDoc };
    const value = typeof editValue === "string" ? editValue : editValue;

    if (editingField === "overview") updatedDoc.overview = value as string;
    else if (editingField === "companySummary") updatedDoc.companySummary = value as string;
    else if (editingField === "whyCompany") updatedDoc.whyCompany = value as string;
    else if (editingField === "productPillars") updatedDoc.productPillars = value as string[];
    else if (editingField === "customerProfiles") updatedDoc.customerProfiles = value as string[];
    else if (editingField === "interviewQuestions") updatedDoc.interviewQuestions = value as string[];
    else if (editingField === "tailoredStories") updatedDoc.tailoredStories = value as string[];
    else if (editingField === "questionsForThem") updatedDoc.questionsForThem = value as string[];
    else if (editingField === "prepChecklist") updatedDoc.prepChecklist = value as string[];

    setPrepDocs((prev) => ({ ...prev, [prepDoc.id]: updatedDoc }));
    setEditingField(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const sections = [
    { id: "overview", label: "Overview", icon: FileText, field: "overview", content: prepDoc.overview, isList: false },
    { id: "summary", label: "Company Summary", icon: FileText, field: "companySummary", content: prepDoc.companySummary, isList: false },
    { id: "why", label: "Why This Company", icon: Target, field: "whyCompany", content: prepDoc.whyCompany, isList: false },
    {
      id: "pillars",
      label: "Product Pillars",
      icon: CheckCircle2,
      field: "productPillars",
      content: prepDoc.productPillars,
      isList: true,
    },
    {
      id: "customers",
      label: "Customer Profiles",
      icon: Users,
      field: "customerProfiles",
      content: prepDoc.customerProfiles,
      isList: true,
    },
    {
      id: "questions",
      label: "Interview Questions",
      icon: MessageSquare,
      field: "interviewQuestions",
      content: prepDoc.interviewQuestions,
      isList: true,
    },
    {
      id: "stories",
      label: "Tailored STAR Stories",
      icon: FileText,
      field: "tailoredStories",
      content: prepDoc.tailoredStories,
      isList: true,
    },
    {
      id: "questionsForThem",
      label: "Questions For Them",
      icon: MessageSquare,
      field: "questionsForThem",
      content: prepDoc.questionsForThem,
      isList: true,
    },
    {
      id: "checklist",
      label: "Prep Checklist",
      icon: ListChecks,
      field: "prepChecklist",
      content: prepDoc.prepChecklist,
      isList: true,
    },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar Navigation */}
      <aside className="w-56 bg-background-secondary border-r border-border overflow-y-auto p-4 flex-shrink-0">
        <Link
          href="/prep/companies"
          className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                  isActive
                    ? "bg-primary text-white"
                    : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{section.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-3xl mx-auto p-8 lg:p-12 space-y-16">
          {/* Header */}
          <div className="sticky top-0 bg-background z-10 pb-6 border-b border-border -mt-8 pt-8 -mx-8 px-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary mb-3">
                  Company Prep Document
                </p>
                <h1 className="text-4xl font-semibold mb-2">{companyName}</h1>
                <p className="text-sm text-foreground-secondary">
                  Quick reference for interviews and prep sessions
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Full Edit
              </Button>
            </div>
          </div>

          {/* Document Sections */}
          <div className="space-y-12">
            {sections.map((section) => {
              const Icon = section.icon;
              const isEditingThis = editingField === section.field;

              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-8"
                  onMouseEnter={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center justify-between mb-4 group">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <h2 className="text-2xl font-semibold">{section.label}</h2>
                    </div>
                    {!isEditingThis && (
                      <button
                        onClick={() => startEdit(section.field, section.content)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-background-secondary rounded-lg transition-opacity"
                        title="Edit section"
                      >
                        <Edit2 className="w-4 h-4 text-foreground-secondary" />
                      </button>
                    )}
                  </div>

                  {isEditingThis ? (
                    <div className="space-y-3">
                      {section.isList ? (
                        <textarea
                          value={Array.isArray(editValue) ? editValue.join("\n") : editValue}
                          onChange={(e) => setEditValue(e.target.value.split("\n").filter(Boolean))}
                          className="w-full rounded-lg border border-primary bg-background-secondary px-4 py-3 text-sm leading-relaxed min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Escape") cancelEdit();
                            if (e.key === "Enter" && e.metaKey) saveFieldEdit();
                          }}
                        />
                      ) : (
                        <textarea
                          value={typeof editValue === "string" ? editValue : ""}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full rounded-lg border border-primary bg-background-secondary px-4 py-3 text-sm leading-relaxed min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Escape") cancelEdit();
                            if (e.key === "Enter" && e.metaKey) saveFieldEdit();
                          }}
                        />
                      )}
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="primary" onClick={saveFieldEdit}>
                          <Check className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                        <span className="text-xs text-foreground-secondary ml-2">
                          Press Cmd+Enter to save, Esc to cancel
                        </span>
                      </div>
                    </div>
                  ) : section.isList ? (
                    <div className="space-y-2">
                      {(section.content as string[]).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 text-foreground leading-relaxed py-2 border-b border-border-subtle last:border-0"
                        >
                          <span className="text-primary font-semibold text-sm mt-0.5 flex-shrink-0 w-6">
                            {idx + 1}.
                          </span>
                          <p className="flex-1">{item}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {section.content as string}
                      </p>
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          {/* Footer Spacing */}
          <div className="h-20" />
        </div>
      </main>

      <PrepDocModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
        prepDoc={prepDoc}
      />
    </div>
  );
}
