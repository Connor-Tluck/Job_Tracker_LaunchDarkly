"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  FileText,
  Target,
  TrendingUp,
  Star,
  CheckCircle2,
  ArrowRight,
  Calendar,
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";

export default function LandingPage() {
  // Page access check
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_LANDING_PAGE, true);
  if (!canAccess) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              <span>Your Complete Job Search Operating System</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Master Your Job Search
              <br />
              <span className="text-primary">From Application to Offer</span>
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
              Track applications, prepare for interviews, and organize your entire job search pipeline
              in one powerful workspace. Built for professionals who take their career seriously.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/jobs">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-foreground-muted pt-2">
              No credit card required • Free forever for personal use
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              A comprehensive platform that combines application tracking, interview preparation,
              and analytics in one seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={FileText}
              title="Application Tracker"
              description="Google Sheets-style interface to track every application, contact, and response. Filter, search, and manage your entire pipeline with ease."
            />
            <FeatureCard
              icon={Target}
              title="Company Prep Documents"
              description="Create tailored preparation documents for each company. Organize product knowledge, interview questions, and your unique value proposition."
            />
            <FeatureCard
              icon={Star}
              title="STAR Stories Library"
              description="Build and organize your behavioral interview stories. Tag, categorize, and quickly access your best examples for any situation."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Analytics Dashboard"
              description="Track response rates, pipeline velocity, and conversion metrics. Understand what's working and optimize your approach."
            />
            <FeatureCard
              icon={MessageSquare}
              title="Interview Question Bank"
              description="Maintain a comprehensive library of common questions and your prepared answers. Never be caught off guard again."
            />
            <FeatureCard
              icon={Calendar}
              title="Action Timeline"
              description="Never miss a follow-up. Track upcoming interviews, deadlines, and action items in one centralized timeline."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-background-secondary/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
                  Stay Organized, Stay Prepared
                </h2>
                <p className="text-lg text-foreground-secondary">
                  Job searching is stressful enough. Our platform eliminates the chaos by giving you
                  one place to manage everything—from the moment you apply to the final interview.
                </p>
              </div>
              <div className="space-y-4">
                <BenefitItem
                  icon={Zap}
                  title="Save Time"
                  description="No more switching between spreadsheets, notes, and documents. Everything you need is in one place."
                />
                <BenefitItem
                  icon={CheckCircle2}
                  title="Never Miss a Follow-up"
                  description="Automated reminders and timeline tracking ensure you stay on top of every opportunity."
                />
                <BenefitItem
                  icon={Star}
                  title="Interview with Confidence"
                  description="Access your prep materials, STAR stories, and company research instantly during interviews."
                />
                <BenefitItem
                  icon={BarChart3}
                  title="Data-Driven Decisions"
                  description="Understand your response rates, identify what's working, and optimize your job search strategy."
                />
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-border bg-background-tertiary p-8 space-y-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Application Pipeline</h3>
                    <p className="text-sm text-foreground-secondary">24 active applications</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <MetricRow label="Response Rate" value="42%" trend="up" />
                  <MetricRow label="Interview Rate" value="18%" trend="up" />
                  <MetricRow label="Avg. Response Time" value="5 days" />
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-foreground-secondary mb-2">Upcoming Actions</p>
                  <div className="space-y-2">
                    <ActionItem date="Tomorrow" label="Follow up: Acme Corp" />
                    <ActionItem date="Dec 15" label="Phone screen: TechCo" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">How It Works</h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Get started in minutes and transform your job search process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number="1"
              title="Track Applications"
              description="Import your existing applications via CSV or add them manually. Our flexible tracker adapts to your workflow."
            />
            <StepCard
              number="2"
              title="Prepare for Interviews"
              description="Create company-specific prep documents with research, questions, and tailored STAR stories. Access everything during interviews."
            />
            <StepCard
              number="3"
              title="Analyze & Optimize"
              description="Review your pipeline metrics, identify patterns, and refine your approach based on real data."
            />
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-background-secondary/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <TrustItem
              icon={Shield}
              title="Secure & Private"
              description="Your data stays private. We never share your information with third parties."
            />
            <TrustItem
              icon={Zap}
              title="Lightning Fast"
              description="Built for speed. Access your prep materials and track applications instantly."
            />
            <TrustItem
              icon={Users}
              title="Built for Professionals"
              description="Designed by job seekers, for job seekers. Every feature serves a real need."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-background-secondary to-background-tertiary p-12 lg:p-16">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Ready to Transform Your Job Search?
            </h2>
            <p className="text-lg text-foreground-secondary mb-8 max-w-2xl mx-auto">
              Join professionals who are taking control of their job search with organized tracking,
              comprehensive prep, and data-driven insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/jobs">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Free Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/prep">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </Link>
            </div>
            <p className="text-sm text-foreground-muted mt-6">
              No setup required • Start tracking immediately • Free forever
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 space-y-3">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-foreground-secondary leading-relaxed">{description}</p>
    </Card>
  );
}

function BenefitItem({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-foreground-secondary">{description}</p>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: "up" | "down";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-foreground-secondary">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{value}</span>
        {trend === "up" && (
          <span className="text-xs text-success flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12%
          </span>
        )}
      </div>
    </div>
  );
}

function ActionItem({ date, label }: { date: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-xs text-foreground-muted w-16">{date}</span>
      <span className="text-foreground-secondary">{label}</span>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
        <span className="text-2xl font-bold text-primary">{number}</span>
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-foreground-secondary">{description}</p>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-foreground-secondary">{description}</p>
    </div>
  );
}

