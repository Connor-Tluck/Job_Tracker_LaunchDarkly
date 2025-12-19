import { notFound, redirect } from "next/navigation";
import { jobs } from "@/lib/mock-data";

export default function CompanyPrepDetailPage({
  params,
}: {
  params: { companyId: string };
}) {
  // Back-compat: this route is deprecated; Company Prep lives on /jobs/[jobId].
  // Example: /prep/companies/prep-bex -> /jobs/bex
  const job = jobs.find((j) => j.prepDocId === params.companyId);
  if (job) {
    redirect(`/jobs/${job.id}`);
  }

  // Fallback for unexpected slugs: try stripping "prep-" and treating remainder as jobId.
  const maybeJobId = params.companyId.startsWith("prep-")
    ? params.companyId.replace(/^prep-/, "")
    : params.companyId;
  const jobById = jobs.find((j) => j.id === maybeJobId);
  if (jobById) {
    redirect(`/jobs/${jobById.id}`);
  }

  return notFound();
}
