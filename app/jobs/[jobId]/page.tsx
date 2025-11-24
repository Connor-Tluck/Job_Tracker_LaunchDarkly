import { notFound } from "next/navigation";
import Link from "next/link";
import { jobs, prepDocs, starStories } from "@/lib/mock-data";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function JobDetailPage({ params }: { params: { jobId: string } }) {
  const job = jobs.find((entry) => entry.id === params.jobId);

  if (!job) {
    return notFound();
  }

  const prepDoc = prepDocs[job.prepDocId];
  const relatedStories = starStories.filter((story) =>
    story.tags.some((tag) => job.tags.includes(tag))
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Company Prep</p>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold">{job.company}</h1>
            <JobStatusBadge status={job.phase} />
          </div>
          <p className="text-foreground-secondary">{job.title}</p>
          <div className="text-sm text-foreground-secondary">
            Applied {job.applicationDate} · {job.metrics.touchpoints} touchpoints · Next step:{" "}
            {job.nextStep}
          </div>
          <div className="text-xs uppercase tracking-wide text-foreground-secondary">
            Contact {job.contactName ?? "N/A"} · {job.contactType}
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

      <section className="grid gap-4 lg:grid-cols-4">
        <MetricCard label="Days since apply" value={job.metrics.daysSinceApply} />
        <MetricCard label="Touchpoints" value={job.metrics.touchpoints} />
        <MetricCard label="Confidence" value={`${job.metrics.confidence}%`} />
        <MetricCard label="Response" value={job.response} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="space-y-6">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Timeline</h2>
            <Button size="sm" variant="ghost" onClick={() => alert("Add timeline event placeholder")}>
              Add update
            </Button>
          </header>
          <div className="space-y-4">
            {job.timeline.map((event) => (
              <div key={`${job.id}-${event.date}`} className="flex gap-4">
                <div className="w-28 text-sm text-foreground-secondary">{event.date}</div>
                <div className="flex-1">
                  <p className="font-medium">{event.label}</p>
                  {event.notes && <p className="text-sm text-foreground-secondary">{event.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="space-y-5">
          <header>
            <h2 className="text-xl font-semibold">Next prep steps</h2>
            <p className="text-sm text-foreground-secondary">Checklist keeps interviews moving.</p>
          </header>
          <ul className="space-y-3">
            {(prepDoc?.prepChecklist ?? []).map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <DocSection
          title="Company Overview"
          content={prepDoc?.companySummary ?? "Add company summary"}
          highlight={prepDoc?.productPillars}
        />
        <DocSection
          title="Why this company"
          content={prepDoc?.whyCompany ?? "Add why statement"}
          highlight={job.tags}
        />
        <DocSection
          title="Product pillars"
          pills={prepDoc?.productPillars ?? []}
          content={prepDoc?.overview}
        />
        <DocSection
          title="Customer profiles"
          pills={prepDoc?.customerProfiles ?? []}
          content="Who you’re prioritizing in discovery."
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <Card className="space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Interview questions to ask</h2>
              <p className="text-sm text-foreground-secondary">Tailor to business + technical audiences.</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => alert("Add question placeholder")}>
              Add
            </Button>
          </header>
          <ul className="space-y-3">
            {(prepDoc?.questionsForThem ?? []).map((question) => (
              <li
                key={question}
                className="rounded-xl border border-border-subtle bg-background-elevated/40 p-3 text-sm"
              >
                {question}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-4">
          <header>
            <h2 className="text-xl font-semibold">Tailored stories</h2>
            <p className="text-sm text-foreground-secondary">
              Pull STAR stories into this company’s prep doc.
            </p>
          </header>
          <div className="space-y-4">
            {relatedStories.map((story) => (
              <div key={story.id} className="rounded-lg border border-border-subtle p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{story.title}</p>
                  <Link href="/star-stories" className="text-xs text-primary">
                    View →
                  </Link>
                </div>
                <p className="text-xs text-foreground-secondary">{story.result}</p>
                <div className="flex flex-wrap gap-1">
                  {story.tags.map((tag) => (
                    <span key={`${story.id}-${tag}`} className="text-[10px] uppercase tracking-wide text-foreground-secondary bg-background-tertiary px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {relatedStories.length === 0 && (
              <p className="text-sm text-foreground-secondary">No mapped stories yet.</p>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-foreground-secondary">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
    </Card>
  );
}

function DocSection({
  title,
  content,
  highlight,
  pills,
}: {
  title: string;
  content?: string;
  highlight?: string[] | string;
  pills?: string[];
}) {
  const highlightItems = Array.isArray(highlight) ? highlight : highlight ? [highlight] : [];

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button size="sm" variant="ghost" onClick={() => alert("Edit placeholder")}>
          Edit
        </Button>
      </div>
      <p className="text-sm text-foreground-secondary whitespace-pre-line">{content}</p>
      {highlightItems.length > 0 && (
        <ul className="list-disc list-inside text-sm">
          {highlightItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {pills && pills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pills.map((pill) => (
            <span key={pill} className="px-3 py-1 rounded-full text-xs bg-background-tertiary">
              {pill}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}

export function generateStaticParams() {
  return jobs.map((job) => ({ jobId: job.id }));
}
