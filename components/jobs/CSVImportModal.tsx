"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Upload, FileText, AlertCircle } from "lucide-react";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jobs: any[]) => void;
}

export function CSVImportModal({ isOpen, onClose, onImport }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please select a CSV file");
      return;
    }

    setFile(selectedFile);
    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = parseCSV(text);
        setPreview(parsed);
      } catch (err) {
        setError("Failed to parse CSV. Please check the format.");
      }
    };
    reader.readAsText(selectedFile);
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2) throw new Error("CSV must have at least a header and one data row");

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const jobs: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      if (values.length !== headers.length) continue;

      const job: any = {
        id: `imported-${i}-${Date.now()}`,
        company: "",
        title: "",
        applicationDate: new Date().toISOString().split("T")[0],
        messaged: "No" as const,
        response: "Pending" as const,
        phase: "Applied" as const,
        timeline: [],
        prepDocId: "",
        metrics: {
          touchpoints: 0,
          daysSinceApply: 0,
          confidence: 50,
        },
        tags: [],
      };

      headers.forEach((header, idx) => {
        const value = values[idx];
        if (header.includes("company")) job.company = value;
        else if (header.includes("title") || header.includes("role") || header.includes("position"))
          job.title = value;
        else if (header.includes("date") || header.includes("applied"))
          job.applicationDate = value || job.applicationDate;
        else if (header.includes("contact")) job.contactName = value;
        else if (header.includes("type")) job.contactType = value;
        else if (header.includes("messaged")) job.messaged = value === "Yes" ? "Yes" : "No";
        else if (header.includes("response"))
          job.response = value === "Yes" ? "Yes" : value === "No" ? "No" : "Pending";
        else if (header.includes("phase") || header.includes("status")) {
          const phaseMap: Record<string, any> = {
            applied: "Applied",
            "phone screen": "Phone Screen",
            interview: "Interview",
            offer: "Offer",
            rejected: "Rejected",
          };
          job.phase = phaseMap[value.toLowerCase()] || "Applied";
        } else if (header.includes("next") || header.includes("follow"))
          job.nextStep = value;
      });

      if (job.company && job.title) {
        job.prepDocId = `prep-${job.company.toLowerCase().replace(/\s+/g, "-")}`;
        jobs.push(job);
      }
    }

    return jobs;
  };

  const handleImport = () => {
    if (preview.length === 0) {
      setError("No valid jobs found in CSV");
      return;
    }
    onImport(preview);
    setFile(null);
    setPreview([]);
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Jobs from CSV" size="lg">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Select CSV File</label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer flex flex-col items-center gap-3"
            >
              <Upload className="w-8 h-8 text-foreground-secondary" />
              <span className="text-sm text-foreground-secondary">
                {file ? file.name : "Click to upload CSV file"}
              </span>
            </label>
          </div>
          <p className="text-xs text-foreground-secondary mt-2">
            Expected columns: Company, Job Title, Application Date, Contact Name, Contact Type,
            Messaged, Response, Phase/Status, Next Step
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg text-sm text-danger">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {preview.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Preview ({preview.length} jobs)</h3>
            </div>
            <div className="max-h-64 overflow-y-auto border border-border rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-background-tertiary sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">Company</th>
                    <th className="px-3 py-2 text-left">Title</th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 10).map((job, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="px-3 py-2">{job.company}</td>
                      <td className="px-3 py-2">{job.title}</td>
                      <td className="px-3 py-2">{job.applicationDate}</td>
                      <td className="px-3 py-2">{job.phase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 10 && (
                <div className="p-2 text-xs text-foreground-secondary text-center">
                  +{preview.length - 10} more jobs
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={preview.length === 0}
          >
            Import {preview.length > 0 && `${preview.length} `}Jobs
          </Button>
        </div>
      </div>
    </Modal>
  );
}

