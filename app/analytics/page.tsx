import { analyticsSummary } from "@/lib/mock-data";
import { AnalyticsPanel } from "@/components/analytics/AnalyticsPanel";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Insight</p>
        <h1 className="text-3xl font-semibold">Pipeline Analytics</h1>
        <p className="text-sm text-foreground-secondary">
          Track velocity, response trends, and stage conversions to focus your outreach.
        </p>
      </header>

      <AnalyticsPanel snapshot={analyticsSummary} />
    </div>
  );
}
