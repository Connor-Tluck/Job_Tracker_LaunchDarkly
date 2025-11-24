import { JobPhase } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<JobPhase, string> = {
  Applied: "bg-sky-100 text-sky-900 border-sky-200",
  "Phone Screen": "bg-amber-100 text-amber-900 border-amber-200",
  Interview: "bg-emerald-100 text-emerald-900 border-emerald-200",
  Offer: "bg-purple-100 text-purple-900 border-purple-200",
  Rejected: "bg-rose-100 text-rose-900 border-rose-200",
};

export function JobStatusBadge({ status }: { status: JobPhase }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
