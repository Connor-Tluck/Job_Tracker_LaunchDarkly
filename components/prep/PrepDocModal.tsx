"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PrepDoc } from "@/lib/mock-data";
import { X } from "lucide-react";

interface PrepDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: Omit<PrepDoc, "id"> & { id?: string }) => void;
  prepDoc?: PrepDoc;
}

export function PrepDocModal({ isOpen, onClose, onSave, prepDoc }: PrepDocModalProps) {
  const [formData, setFormData] = useState({
    overview: "",
    companySummary: "",
    whyCompany: "",
    productPillars: "",
    customerProfiles: "",
    interviewQuestions: "",
    tailoredStories: "",
    questionsForThem: "",
    prepChecklist: "",
  });

  useEffect(() => {
    if (prepDoc) {
      setFormData({
        overview: prepDoc.overview,
        companySummary: prepDoc.companySummary,
        whyCompany: prepDoc.whyCompany,
        productPillars: prepDoc.productPillars.join("\n"),
        customerProfiles: prepDoc.customerProfiles.join("\n"),
        interviewQuestions: prepDoc.interviewQuestions.join("\n"),
        tailoredStories: prepDoc.tailoredStories.join("\n"),
        questionsForThem: prepDoc.questionsForThem.join("\n"),
        prepChecklist: prepDoc.prepChecklist.join("\n"),
      });
    } else {
      setFormData({
        overview: "",
        companySummary: "",
        whyCompany: "",
        productPillars: "",
        customerProfiles: "",
        interviewQuestions: "",
        tailoredStories: "",
        questionsForThem: "",
        prepChecklist: "",
      });
    }
  }, [prepDoc, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: prepDoc?.id,
      overview: formData.overview,
      companySummary: formData.companySummary,
      whyCompany: formData.whyCompany,
      productPillars: formData.productPillars.split("\n").filter(Boolean),
      customerProfiles: formData.customerProfiles.split("\n").filter(Boolean),
      interviewQuestions: formData.interviewQuestions.split("\n").filter(Boolean),
      tailoredStories: formData.tailoredStories.split("\n").filter(Boolean),
      questionsForThem: formData.questionsForThem.split("\n").filter(Boolean),
      prepChecklist: formData.prepChecklist.split("\n").filter(Boolean),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={prepDoc ? "Edit Company Prep Doc" : "Create Company Prep Doc"}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label className="block text-sm font-medium mb-1">Company Summary</label>
          <textarea
            value={formData.companySummary}
            onChange={(e) => setFormData({ ...formData, companySummary: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-24"
            placeholder="Brief overview of the company..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Overview</label>
          <textarea
            value={formData.overview}
            onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-20"
            placeholder="High-level prep focus areas..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Why This Company</label>
          <textarea
            value={formData.whyCompany}
            onChange={(e) => setFormData({ ...formData, whyCompany: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-24"
            placeholder="Why you're excited about this company..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Product Pillars (one per line)
          </label>
          <textarea
            value={formData.productPillars}
            onChange={(e) => setFormData({ ...formData, productPillars: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-32"
            placeholder="Pillar 1&#10;Pillar 2&#10;Pillar 3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Customer Profiles (one per line)
          </label>
          <textarea
            value={formData.customerProfiles}
            onChange={(e) => setFormData({ ...formData, customerProfiles: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-24"
            placeholder="Profile 1&#10;Profile 2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Interview Questions (one per line)
          </label>
          <textarea
            value={formData.interviewQuestions}
            onChange={(e) => setFormData({ ...formData, interviewQuestions: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-32"
            placeholder="Question 1&#10;Question 2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tailored STAR Stories (one per line)
          </label>
          <textarea
            value={formData.tailoredStories}
            onChange={(e) => setFormData({ ...formData, tailoredStories: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-24"
            placeholder="Story title 1&#10;Story title 2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Questions For Them (one per line)
          </label>
          <textarea
            value={formData.questionsForThem}
            onChange={(e) => setFormData({ ...formData, questionsForThem: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-24"
            placeholder="Question 1&#10;Question 2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Prep Checklist (one per line)
          </label>
          <textarea
            value={formData.prepChecklist}
            onChange={(e) => setFormData({ ...formData, prepChecklist: e.target.value })}
            className="w-full rounded-lg border border-border bg-background-secondary px-3 py-2 text-sm h-24"
            placeholder="Task 1&#10;Task 2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border sticky bottom-0 bg-background-secondary">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {prepDoc ? "Update" : "Create"} Prep Doc
          </Button>
        </div>
      </form>
    </Modal>
  );
}

