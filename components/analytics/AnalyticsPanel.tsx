"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { AnalyticsSummary } from "@/lib/mock-data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export function AnalyticsPanel({
  snapshot,
  showTopMetrics = true,
}: {
  snapshot: AnalyticsSummary;
  showTopMetrics?: boolean;
}) {
  return (
    <div className="space-y-8">
      {showTopMetrics && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Applications Submitted" value={snapshot.totals.applied} />
          <MetricCard label="Responses" value={snapshot.totals.responses} />
          <MetricCard label="Interviews" value={snapshot.totals.interviews} />
          <MetricCard label="Offers" value={snapshot.totals.offers} />
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-3">
        <ChartCard title="Weekly Pipeline">
          <Bar
            data={{
              labels: snapshot.velocity.map((item) => item.week),
              datasets: [
                {
                  label: "Applied",
                  backgroundColor: "#60A5FA",
                  borderRadius: 4,
                  data: snapshot.velocity.map((item) => item.applied),
                },
                {
                  label: "Responses",
                  backgroundColor: "#FB923C",
                  borderRadius: 4,
                  data: snapshot.velocity.map((item) => item.responses),
                },
                {
                  label: "Interviews",
                  backgroundColor: "#34D399",
                  borderRadius: 4,
                  data: snapshot.velocity.map((item) => item.interviews),
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom" } },
              scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            }}
          />
        </ChartCard>

        <ChartCard title="Pipeline Status">
          <Doughnut
            data={{
              labels: snapshot.pipeline.map((item) => item.label),
              datasets: [
                {
                  data: snapshot.pipeline.map((item) => item.value),
                  backgroundColor: ["#38bdf8", "#f97316", "#34d399", "#f43f5e"],
                  borderWidth: 0,
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
            }}
          />
        </ChartCard>

        <ChartCard title="Response vs Interview Rate">
          <Line
            data={{
              labels: snapshot.velocity.map((item) => item.week),
              datasets: [
                {
                  label: "Response Rate",
                  data: snapshot.velocity.map(
                    (item, idx) =>
                      cumulative(snapshot.velocity, idx, "responses") /
                      Math.max(1, cumulative(snapshot.velocity, idx, "applied"))
                  ),
                  fill: false,
                  borderColor: "#FBBF24",
                  tension: 0.3,
                },
                {
                  label: "Interview Rate",
                  data: snapshot.velocity.map(
                    (item, idx) =>
                      cumulative(snapshot.velocity, idx, "interviews") /
                      Math.max(1, cumulative(snapshot.velocity, idx, "applied"))
                  ),
                  fill: false,
                  borderColor: "#34D399",
                  tension: 0.3,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  ticks: {
                    callback: (value) => `${Math.round(Number(value) * 100)}%`,
                  },
                  beginAtZero: true,
                  max: 1,
                },
              },
              plugins: {
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.dataset.label}: ${Math.round(
                        Number(context.parsed.y) * 100
                      )}%`,
                  },
                },
              },
            }}
          />
        </ChartCard>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-background-secondary/40 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-foreground-secondary">
        {label}
      </p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-border bg-background-secondary/40 p-4 shadow-sm flex flex-col gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground-secondary">
        {title}
      </h3>
      <div className="flex-1">{children}</div>
    </article>
  );
}

type NumericKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

function cumulative<T>(
  arr: T[],
  idx: number,
  key: NumericKeys<T>
) {
  return arr.slice(0, idx + 1).reduce((sum, item) => sum + Number(item[key]), 0);
}


