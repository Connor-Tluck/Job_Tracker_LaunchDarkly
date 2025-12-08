"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  Zap,
  CheckCircle2,
  Eye,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";

export default function AnalyticsPage() {
  // Page access check
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_LANDING_ANALYTICS, true);
  if (!canAccess) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Data/Insights Focus */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background-secondary to-background">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,163,127,0.1),transparent_50%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-5xl mx-auto text-center">
            <Link
              href="/landing"
              className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>Data-Driven Insights</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Know What&apos;s Working
                <br />
                <span className="text-primary">Optimize What&apos;s Not</span>
              </h1>
              <p className="text-xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed">
                Stop guessing. See exactly which applications get responses, how long each stage
                takes, and where to focus your efforts for maximum impact.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/analytics">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    View Analytics
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/landing">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View All Features
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual: Dashboard Preview */}
      <section className="py-16 border-b border-border bg-background-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <MetricCard label="Applications" value="24" change="+3 this week" trend="up" />
            <MetricCard label="Response Rate" value="42%" change="+5% vs last month" trend="up" />
            <MetricCard label="Interviews" value="8" change="3 scheduled" />
            <MetricCard label="Offers" value="2" change="1 pending" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Pipeline Status</h3>
                <PieChart className="w-5 h-5 text-foreground-secondary" />
              </div>
              <div className="space-y-3">
                {[
                  { label: "Applied", value: 14, color: "bg-foreground-secondary" },
                  { label: "Phone Screen", value: 5, color: "bg-warning" },
                  { label: "Interview", value: 3, color: "bg-primary" },
                  { label: "Offer", value: 2, color: "bg-success" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground-secondary">{item.label}</span>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-background-tertiary overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${(item.value / 24) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Weekly Trends</h3>
                <BarChart3 className="w-5 h-5 text-foreground-secondary" />
              </div>
              <div className="space-y-4">
                <div className="flex items-end gap-2 h-32">
                  {[65, 72, 68, 85, 78, 90, 88].map((height, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-primary rounded-t hover:bg-primary-hover transition-colors"
                      style={{ height: `${height}%` }}
                      title={`Week ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-foreground-secondary">
                  <span>Week 1</span>
                  <span>Week 7</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Insights That Drive Better Decisions
            </h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Understand your job search performance and optimize your strategy
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InsightCard
              icon={Eye}
              title="Response Rate Analysis"
              description="See which types of roles, companies, or application methods get the best response rates."
              insight="Engineering roles at startups have a 58% response rate vs 32% at large companies"
            />
            <InsightCard
              icon={Calendar}
              title="Timeline Velocity"
              description="Understand how long each stage takes. Set realistic expectations and identify bottlenecks."
              insight="Average time from application to response: 5 days. From interview to offer: 12 days"
            />
            <InsightCard
              icon={Target}
              title="Conversion Funnel"
              description="See where applications drop off. Identify which stages need the most improvement."
              insight="42% of applications get responses, 18% convert to interviews, 8% result in offers"
            />
            <InsightCard
              icon={TrendingUp}
              title="Performance Trends"
              description="Track your pipeline performance over time. See if your strategy is improving."
              insight="Response rate increased 12% this month after focusing on tailored applications"
            />
            <InsightCard
              icon={Lightbulb}
              title="Actionable Recommendations"
              description="Get suggestions based on your data. Know exactly what to do next."
              insight="Focus on startups in fintech—they have your highest conversion rate"
            />
            <InsightCard
              icon={Zap}
              title="Upcoming Actions"
              description="Never miss a follow-up. See all upcoming interviews, deadlines, and action items."
              insight="3 follow-ups due this week, 2 interviews scheduled for next week"
            />
          </div>
        </div>
      </section>

      {/* Problem/Solution - Data-Driven Focus */}
      <section className="py-24 bg-background-secondary/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground-secondary/10 border border-foreground-secondary/20 text-foreground-secondary text-sm font-medium mb-6">
                <Eye className="w-4 h-4" />
                <span>The Problem</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold mb-6">
                Flying Blind in Your Job Search
              </h2>
              <div className="space-y-4">
                <ProblemItem
                  text="You don't know which applications are getting responses"
                />
                <ProblemItem
                  text="No idea if your strategy is improving or getting worse"
                />
                <ProblemItem
                  text="Can't identify which types of roles convert best"
                />
                <ProblemItem
                  text="Missing follow-ups because you can't see what needs attention"
                />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Lightbulb className="w-4 h-4" />
                <span>The Solution</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold mb-6">
                Data-Driven Job Search
              </h2>
              <div className="space-y-4">
                <SolutionItem
                  text="See exactly which applications get responses and why"
                />
                <SolutionItem
                  text="Track performance trends over time to measure improvement"
                />
                <SolutionItem
                  text="Identify patterns: which roles, companies, or approaches work best"
                />
                <SolutionItem
                  text="Never miss an action item with automated reminders and timeline tracking"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Showcase */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            <StatBox
              number="3x"
              label="Better Response Rate"
              description="Users see 3x improvement after tracking and optimizing"
            />
            <StatBox
              number="50%"
              label="Faster Time to Offer"
              description="Data-driven approach reduces time to offer by 50%"
            />
            <StatBox
              number="85%"
              label="Never Miss Follow-ups"
              description="85% of users report never missing a follow-up"
            />
            <StatBox
              number="2.5x"
              label="More Interviews"
              description="Optimized applications lead to 2.5x more interviews"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-background-secondary to-background-tertiary p-12 lg:p-16">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Start Making Data-Driven Decisions
            </h2>
            <p className="text-lg text-foreground-secondary mb-8 max-w-2xl mx-auto">
              Stop guessing what works. See your data, understand your performance, and optimize
              your job search strategy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/analytics">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  View Analytics Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/landing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-sm text-foreground-muted mt-6">
              Automatic tracking • Real-time insights • Free forever
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  trend,
}: {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
}) {
  return (
    <Card className="p-6 text-center">
      <div className="text-xs text-foreground-secondary mb-2 uppercase tracking-wide">{label}</div>
      <div className="text-3xl font-bold text-primary mb-2">{value}</div>
      {change && (
        <div className="flex items-center justify-center gap-1 text-xs text-foreground-secondary">
          {trend === "up" && <ArrowUpRight className="w-3 h-3 text-success" />}
          <span>{change}</span>
        </div>
      )}
    </Card>
  );
}

function InsightCard({
  icon: Icon,
  title,
  description,
  insight,
}: {
  icon: any;
  title: string;
  description: string;
  insight: string;
}) {
  return (
    <Card className="p-6 space-y-4">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-foreground-secondary leading-relaxed">{description}</p>
      </div>
      <div className="pt-4 border-t border-border">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground-secondary italic">&quot;{insight}&quot;</p>
        </div>
      </div>
    </Card>
  );
}

function ProblemItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-danger text-xs">×</span>
      </div>
      <p className="text-foreground-secondary">{text}</p>
    </div>
  );
}

function SolutionItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle2 className="w-4 h-4 text-success" />
      </div>
      <p className="text-foreground-secondary">{text}</p>
    </div>
  );
}

function StatBox({
  number,
  label,
  description,
}: {
  number: string;
  label: string;
  description: string;
}) {
  return (
    <Card className="p-6 text-center">
      <div className="text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="font-semibold mb-2">{label}</div>
      <div className="text-xs text-foreground-secondary">{description}</div>
    </Card>
  );
}
