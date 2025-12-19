"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Job, JobPhase } from "@/lib/mock-data";
import { AlertCircle } from "lucide-react";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (job: Job) => void;
}

const phaseOptions: JobPhase[] = ["Applied", "Phone Screen", "Interview", "Offer", "Rejected"];
const responseOptions: Job["response"][] = ["Pending", "Yes", "No"];
const messagedOptions: Job["messaged"][] = ["No", "Yes"];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function AddJobModal({ isOpen, onClose, onAdd }: AddJobModalProps) {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [applicationDate, setApplicationDate] = useState(todayISO());
  const [phase, setPhase] = useState<JobPhase>("Applied");
  const [response, setResponse] = useState<Job["response"]>("Pending");
  const [messaged, setMessaged] = useState<Job["messaged"]>("No");
  const [contactName, setContactName] = useState("");
  const [contactType, setContactType] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [error, setError] = useState<string>("");

  const canSubmit = useMemo(() => {
    return company.trim().length > 0 && title.trim().length > 0;
  }, [company, title]);

  const reset = () => {
    setCompany("");
    setTitle("");
    setApplicationDate(todayISO());
    setPhase("Applied");
    setResponse("Pending");
    setMessaged("No");
    setContactName("");
    setContactType("");
    setNextStep("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAdd = () => {
    const companyValue = company.trim();
    const titleValue = title.trim();

    if (!companyValue || !titleValue) {
      setError("Company and Role are required.");
      return;
    }

    const id = `job-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const prepDocId = `prep-${slugify(companyValue)}`;

    const newJob: Job = {
      id,
      company: companyValue,
      title: titleValue,
      applicationDate: applicationDate || todayISO(),
      contactName: contactName.trim() || undefined,
      contactType: contactType.trim() || undefined,
      messaged,
      response,
      phase,
      nextStep: nextStep.trim() || undefined,
      timeline: [
        { date: applicationDate || todayISO(), label: "Added to tracker" },
        ...(phase !== "Applied" ? [{ date: applicationDate || todayISO(), label: phase }] : []),
      ],
      prepDocId,
      metrics: {
        touchpoints: 0,
        daysSinceApply: 0,
        confidence: 50,
      },
      tags: [],
    };

    onAdd(newJob);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Job" size="lg">
      <div className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <div className="text-sm font-medium">Company *</div>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-background-secondary px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. LaunchDarkly"
              autoFocus
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm font-medium">Role *</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-background-secondary px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. Solutions Engineer"
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm font-medium">Applied date</div>
            <input
              type="date"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-background-secondary px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>

          <label className="space-y-1">
            <div className="text-sm font-medium">Stage</div>
            <select
              value={phase}
              onChange={(e) => setPhase(e.target.value as JobPhase)}
              className="w-full h-11 rounded-xl border border-border bg-background-secondary px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              {phaseOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-sm font-medium">Messaged</div>
            <select
              value={messaged}
              onChange={(e) => setMessaged(e.target.value as Job["messaged"])}
              className="w-full h-11 rounded-xl border border-border bg-background-secondary px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              {messagedOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <div className="text-sm font-medium">Response</div>
            <select
              value={response}
              onChange={(e) => setResponse(e.target.value as Job["response"])}
              className="w-full h-11 rounded-xl border border-border bg-background-secondary px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              {responseOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 sm:col-span-2">
            <div className="text-sm font-medium">Contact (optional)</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-background-secondary px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Name"
              />
              <input
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-background-secondary px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Type (Warm / Recruiter / Referral)"
              />
            </div>
          </label>

          <label className="space-y-1 sm:col-span-2">
            <div className="text-sm font-medium">Next step (optional)</div>
            <input
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-background-secondary px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. Follow up next Tuesday"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd} disabled={!canSubmit}>
            Add Job
          </Button>
        </div>
      </div>
    </Modal>
  );
}




