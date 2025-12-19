"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { notFound } from "next/navigation";
import { generalDocs as initialGeneralDocs, starStories, GeneralDoc } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import {
  FileText,
  Target,
  MessageSquare,
  Star,
  Edit2,
  Check,
  X,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { getOrCreateUserContext } from "@/lib/launchdarkly/userContext";
import { trackPageView } from "@/lib/launchdarkly/tracking";
import { useFlagsReady } from "@/hooks/useFlagsReady";

const initialInterviewQuestions = [
  "Tell me about a complex technical challenge you solved for a customer and how you approached it.",
  "Walk me through a time you uncovered the real problem behind a vague customer request.",
  "Describe a time you translated a very technical concept to a business audience.",
  "Tell me about a situation where two teams shipped conflicting changes and you helped resolve it.",
  "Give an example of a project where you partnered closely with product or engineering to influence the roadmap.",
  "Describe a time when an implementation or POC was going off track and you got it back under control.",
  "Walk me through how you run a discovery call with a technical buyer. What do you prioritize?",
  "Tell me about a time you had to push back on a feature request without losing trust.",
  "Give me an example of how you have used data to influence a technical decision.",
  "Describe a time you managed a customer who was not happy with performance or reliability.",
];

const initialQuestionsForThem = [
  "What does strong discovery look like on your team?",
  "Where do contributors most influence strategy?",
  "What defines a successful ninety day ramp?",
  "How do cross-functional teams partner here?",
  "How technical do implementations or PoCs usually get?",
];

export default function PrepPage() {
  // All hooks must be called before any conditional returns
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_PREP_PAGE, true);
  const flagsReady = useFlagsReady();
  const isBusinessMode = useFeatureFlag(FLAG_KEYS.SHOW_BUSINESS_USER_MODE, false);
  const ldClient = useLDClient();
  const userContext = getOrCreateUserContext();

  // State/hooks must be declared before any early returns to avoid hook-order issues
  const [generalDocs, setGeneralDocs] = useState<GeneralDoc[]>(initialGeneralDocs);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>(initialInterviewQuestions);
  const [questionsForThem, setQuestionsForThem] = useState<string[]>(initialQuestionsForThem);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string | string[]>("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const sections = useMemo(() => {
    return [
      {
        id: "narrative",
        label: "Personal Narrative",
        icon: FileText,
        field: "doc-master-prep",
        content: generalDocs.find((d) => d.id === "master-prep")?.content || "",
        isList: false,
      },
      {
        id: "strengths",
        label: "Strengths & Growth",
        icon: Target,
        field: "doc-strengths",
        content: generalDocs.find((d) => d.id === "strengths")?.content || "",
        isList: false,
      },
      {
        id: "common-questions",
        label: "Common Q&A",
        icon: MessageSquare,
        field: "doc-common-questions",
        content: generalDocs.find((d) => d.id === "common-questions")?.content || "",
        isList: false,
      },
      {
        id: "interview-questions",
        label: "Interview Question Bank",
        icon: MessageSquare,
        field: "interviewQuestions",
        content: interviewQuestions,
        isList: true,
      },
      {
        id: "questions-for-them",
        label: "Questions For Them",
        icon: MessageSquare,
        field: "questionsForThem",
        content: questionsForThem,
        isList: true,
      },
      {
        id: "star-stories",
        label: "STAR Story Shelf",
        icon: Star,
        field: null,
        content: starStories,
        isList: false,
        isStarStories: true,
      },
    ];
  }, [generalDocs, interviewQuestions, questionsForThem]);

  // Track page view
  useEffect(() => {
    if (flagsReady && canAccess && !isBusinessMode) {
      trackPageView(ldClient, userContext, "prep");
    }
  }, [ldClient, userContext, canAccess, flagsReady, isBusinessMode]);

  // Intersection Observer for scroll-based active section detection
  // IMPORTANT: this hook must run on every render (cannot be below conditional returns),
  // but we can safely NO-OP until flags are ready and the page is actually accessible.
  useEffect(() => {
    if (!flagsReady || !canAccess || isBusinessMode) return;

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        sectionRefs.current[section.id] = element;
        observer.observe(element);
      }
    });

    return () => {
      Object.values(sectionRefs.current).forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [flagsReady, canAccess, isBusinessMode, sections]);

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

  const startEdit = (field: string, currentValue: string | string[]) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveFieldEdit = () => {
    if (!editingField) return;

    if (editingField.startsWith("doc-")) {
      const docId = editingField.replace("doc-", "");
      const updatedDocs = generalDocs.map((doc) =>
        doc.id === docId ? { ...doc, content: editValue as string } : doc
      );
      setGeneralDocs(updatedDocs);
    } else if (editingField === "interviewQuestions") {
      setInterviewQuestions(editValue as string[]);
    } else if (editingField === "questionsForThem") {
      setQuestionsForThem(editValue as string[]);
    }

    setEditingField(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const addQuestion = (field: "interviewQuestions" | "questionsForThem") => {
    const newQuestion = prompt("Enter new question:");
    if (newQuestion) {
      if (field === "interviewQuestions") {
        setInterviewQuestions([...interviewQuestions, newQuestion]);
      } else {
        setQuestionsForThem([...questionsForThem, newQuestion]);
      }
    }
  };

  const removeQuestion = (field: "interviewQuestions" | "questionsForThem", index: number) => {
    if (field === "interviewQuestions") {
      setInterviewQuestions(interviewQuestions.filter((_, i) => i !== index));
    } else {
      setQuestionsForThem(questionsForThem.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar Navigation */}
      <aside className="w-56 bg-background-secondary border-r border-border overflow-y-auto p-4 flex-shrink-0">
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
                <div>
              <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary mb-3">
                Master Prep Library
              </p>
              <h1 className="text-4xl font-semibold mb-2">Interview Preparation Hub</h1>
                  <p className="text-sm text-foreground-secondary">
                Personal narrative, question banks, and reusable content for all interviews
                  </p>
                </div>
          </div>

          {/* Document Sections */}
          <div className="space-y-12">
            {sections.map((section) => {
              const Icon = section.icon;
              const isEditingThis = editingField === section.field;

              if (section.isStarStories) {
                return (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-8"
                    ref={(el) => {
                      sectionRefs.current[section.id] = el;
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <h2 className="text-2xl font-semibold">{section.label}</h2>
                      </div>
                      <Link href="/star-stories">
                        <Button variant="outline" size="sm">
                          Manage Stories
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {starStories.slice(0, 5).map((story) => (
                        <div
                          key={story.id}
                          className="p-4 rounded-lg bg-background-secondary border border-border-subtle"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{story.title}</h3>
                              <p className="text-xs text-foreground-secondary mt-1">{story.metrics}</p>
                            </div>
                            <span className="text-xs text-foreground-secondary">
                              {story.industries.join(" • ")}
                            </span>
              </div>
                          <p className="text-sm text-foreground-secondary line-clamp-2">{story.result}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {story.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-background-tertiary"
                              >
                                {tag}
                  </span>
                ))}
                          </div>
                        </div>
                      ))}
                      {starStories.length > 5 && (
                        <Link href="/star-stories">
                          <Button variant="ghost" size="sm" className="w-full">
                            View all {starStories.length} stories →
                          </Button>
                        </Link>
                      )}
                    </div>
                  </section>
                );
              }

              return (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-8"
                  ref={(el) => {
                    sectionRefs.current[section.id] = el;
                  }}
                >
                  <div className="flex items-center justify-between mb-4 group">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <h2 className="text-2xl font-semibold">{section.label}</h2>
                    </div>
                    {!isEditingThis && section.field && (
                      <div className="flex items-center gap-2">
                        {section.isList && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => addQuestion(section.field as "interviewQuestions" | "questionsForThem")}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        )}
                        <button
                          onClick={() => startEdit(section.field!, section.content)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-background-secondary rounded-lg transition-opacity"
                          title="Edit section"
                        >
                          <Edit2 className="w-4 h-4 text-foreground-secondary" />
                        </button>
                      </div>
                )}
              </div>

                  {isEditingThis ? (
                    <div className="space-y-3">
                      {section.isList ? (
                        <textarea
                          value={Array.isArray(editValue) ? editValue.join("\n") : editValue}
                          onChange={(e) => setEditValue(e.target.value.split("\n").filter(Boolean))}
                          className="w-full rounded-lg border border-primary bg-background-secondary px-4 py-3 text-sm leading-relaxed min-h-[300px] focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                          className="w-full rounded-lg border border-primary bg-background-secondary px-4 py-3 text-sm leading-relaxed min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                          className="flex items-start gap-3 text-foreground leading-relaxed py-2 border-b border-border-subtle last:border-0 group/item"
                        >
                          <span className="text-primary font-semibold text-sm mt-0.5 flex-shrink-0 w-6">
                            {idx + 1}.
                          </span>
                          <p className="flex-1">{item}</p>
                          <button
                            onClick={() => removeQuestion(section.field as "interviewQuestions" | "questionsForThem", idx)}
                            className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-background-secondary rounded text-danger text-xs transition-opacity"
                            title="Remove question"
                          >
                            <X className="w-3 h-3" />
                          </button>
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
    </div>
  );
}
