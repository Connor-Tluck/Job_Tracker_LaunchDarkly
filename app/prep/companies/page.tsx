"use client";

import { useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { prepDocs as initialPrepDocs, PrepDoc, jobs } from "@/lib/mock-data";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Search, Building2 } from "lucide-react";
import Link from "next/link";
import { PrepDocModal } from "@/components/prep/PrepDocModal";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { useFlagsReady } from "@/hooks/useFlagsReady";

export default function CompanyPrepListPage() {
  // All hooks must be called before any conditional returns
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_COMPANY_PREP_PAGE, true);
  const flagsReady = useFlagsReady();
  const isBusinessMode = useFeatureFlag(FLAG_KEYS.SHOW_BUSINESS_USER_MODE, false);
  const [prepDocs, setPrepDocs] = useState<Record<string, PrepDoc>>(initialPrepDocs);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<PrepDoc | undefined>();

  const companyList = useMemo(() => {
    const docs = Object.values(prepDocs);
    const filtered = search
      ? docs.filter(
          (doc) =>
            doc.id.toLowerCase().includes(search.toLowerCase()) ||
            doc.companySummary.toLowerCase().includes(search.toLowerCase())
        )
      : docs;

    // Get company names from jobs or extract from prep doc IDs
    return filtered.map((doc) => {
      const companySlug = doc.id.replace("prep-", "");
      const relatedJob = jobs.find((j) => j.prepDocId === doc.id);
      const companyName =
        relatedJob?.company ||
        companySlug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      return {
        doc,
        companyName,
        relatedJob,
      };
    });
  }, [prepDocs, search]);

  // Page access check (after all hooks)
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

  if (isBusinessMode) {
    return notFound();
  }

  if (!canAccess) {
    return notFound();
  }

  const handleCreate = () => {
    setEditingDoc(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (doc: PrepDoc) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleSave = (docData: Omit<PrepDoc, "id"> & { id?: string }) => {
    const docId = docData.id || `prep-${docData.companySummary.split(" ")[0].toLowerCase()}-${Date.now()}`;
    const newDoc: PrepDoc = {
      ...docData,
      id: docId,
    } as PrepDoc;

    if (editingDoc) {
      setPrepDocs((prev) => {
        const updated = { ...prev };
        delete updated[editingDoc.id];
        updated[newDoc.id] = newDoc;
        return updated;
      });
    } else {
      setPrepDocs((prev) => ({ ...prev, [newDoc.id]: newDoc }));
    }
    setIsModalOpen(false);
    setEditingDoc(undefined);
  };

  const handleDelete = (docId: string) => {
    if (confirm("Are you sure you want to delete this prep doc?")) {
      setPrepDocs((prev) => {
        const updated = { ...prev };
        delete updated[docId];
        return updated;
      });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">
            Company Prep
          </p>
          <h1 className="text-3xl font-semibold">Company Prep Documents</h1>
          <p className="text-sm text-foreground-secondary">
            Create and manage company-specific interview prep documents.
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Prep Doc
        </Button>
      </header>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name or content..."
            className="w-full h-10 rounded-xl border border-border bg-background-secondary pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {companyList.map(({ doc, companyName, relatedJob }) => (
          <Card key={doc.id} className="p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-background-tertiary">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{companyName}</h3>
                  {relatedJob && (
                    <Link
                      href={`/jobs/${relatedJob.id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      View job →
                    </Link>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(doc)}
                  title="Edit prep doc"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-foreground-secondary line-clamp-2">{doc.companySummary}</p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary">Product Pillars</span>
                <span className="font-semibold">{doc.productPillars.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary">Customer Profiles</span>
                <span className="font-semibold">{doc.customerProfiles.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary">Interview Questions</span>
                <span className="font-semibold">{doc.interviewQuestions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary">STAR Stories</span>
                <span className="font-semibold">{doc.tailoredStories.length}</span>
              </div>
            </div>

            <div
              className="flex items-center gap-2 pt-2 border-t border-border overflow-x-auto"
              style={{ scrollbarWidth: "none" as any }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {doc.productPillars.slice(0, 3).map((pillar) => (
                <span
                  key={pillar}
                  title={pillar}
                  className="flex-shrink-0 text-xs px-2 py-1 rounded-full bg-background-tertiary border border-border whitespace-nowrap max-w-[14rem] truncate"
                >
                  {pillar}
                </span>
              ))}
              {doc.productPillars.length > 3 && (
                <span className="flex-shrink-0 text-xs text-foreground-secondary whitespace-nowrap">
                  +{doc.productPillars.length - 3} more
                </span>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <Link
                href={relatedJob ? `/jobs/${relatedJob.id}` : `/jobs/${doc.id.replace("prep-", "")}`}
                className="flex-1"
              >
                <Button variant="primary" size="sm" className="w-full">
                  Open Prep Doc
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(doc)}
                title="Quick edit"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(doc.id)}
                className="text-danger hover:text-danger"
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {companyList.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="w-12 h-12 text-foreground-secondary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No company prep docs yet</h3>
          <p className="text-sm text-foreground-secondary mb-4">
            {search
              ? "No prep docs match your search"
              : "Create your first company prep document to get started"}
          </p>
          {!search && (
            <Button variant="primary" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Prep Doc
            </Button>
          )}
        </Card>
      )}

      <PrepDocModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDoc(undefined);
        }}
        onSave={handleSave}
        prepDoc={editingDoc}
      />
    </div>
  );
}

