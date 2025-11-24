"use client";

import { useState } from "react";
import { Job, JobPhase } from "@/lib/mock-data";
import { TableCell, TableRow } from "@/components/ui/Table";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Check, X, Edit2 } from "lucide-react";

interface EditableJobRowProps {
  job: Job;
  onUpdate: (updatedJob: Job) => void;
  onRowClick: () => void;
}

export function EditableJobRow({ job, onUpdate, onRowClick }: EditableJobRowProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingField) {
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
      onUpdate(updatedJob);
    }
    setEditingField(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const EditableCell = ({
    field,
    value,
    children,
    className,
    type = "text",
  }: {
    field: string;
    value: string;
    children?: React.ReactNode;
    className?: string;
    type?: "text" | "select" | "status" | "response";
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
          <div className="flex items-center gap-1">
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 rounded border border-border bg-background-secondary px-2 py-1 text-xs"
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
              className="p-1 text-success hover:bg-background-tertiary rounded"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1 text-danger hover:bg-background-tertiary rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 rounded border border-border bg-background-secondary px-2 py-1 text-xs"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") cancelEdit();
            }}
            onBlur={saveEdit}
          />
        </div>
      );
    }

    return (
      <div
        className={cn("group relative flex items-center gap-1", className)}
        onClick={(e) => e.stopPropagation()}
      >
        {children || value || "—"}
        <button
          onClick={() => startEdit(field, value || "")}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background-tertiary rounded transition-opacity"
          title="Click to edit"
        >
          <Edit2 className="w-3 h-3 text-foreground-secondary" />
        </button>
      </div>
    );
  };

  return (
    <TableRow
      key={job.id}
      className="cursor-pointer"
      onClick={onRowClick}
    >
      <TableCell>
        <EditableCell field="company" value={job.company} className="font-semibold">
          {job.company}
        </EditableCell>
      </TableCell>
      <TableCell>
        <EditableCell field="title" value={job.title}>
          {job.title}
        </EditableCell>
      </TableCell>
      <TableCell>
        <EditableCell field="applicationDate" value={job.applicationDate}>
          {job.applicationDate}
        </EditableCell>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
          <EditableCell field="contactName" value={job.contactName || ""}>
            {job.contactName ?? "—"}
          </EditableCell>
          <EditableCell
            field="contactType"
            value={job.contactType || ""}
            className="text-xs text-foreground-secondary"
          >
            {job.contactType && (
              <span className="text-xs text-foreground-secondary">{job.contactType}</span>
            )}
          </EditableCell>
        </div>
      </TableCell>
      <TableCell>
        <EditableCell field="response" value={job.response} type="response">
          {job.response}
        </EditableCell>
      </TableCell>
      <TableCell>
        <EditableCell field="nextStep" value={job.nextStep || ""}>
          {job.nextStep ?? "—"}
        </EditableCell>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <EditableCell field="phase" value={job.phase} type="status">
          <JobStatusBadge status={job.phase} />
        </EditableCell>
      </TableCell>
      <TableCell>
        <Link
          href={`/jobs/${job.id}`}
          className="text-primary text-xs font-semibold hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Prep →
        </Link>
      </TableCell>
    </TableRow>
  );
}

