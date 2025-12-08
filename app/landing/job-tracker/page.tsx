"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Search,
  Filter,
  Edit2,
  Upload,
  Calendar,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { getOrCreateUserContext } from "@/lib/launchdarkly/userContext";
import { Star } from "lucide-react";

export default function JobTrackerPage() {
  // Page access check
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_LANDING_JOB_TRACKER, true);
  if (!canAccess) {
    return notFound();
  }

  // Targeting demo - this flag uses targeting rules
  const showPremiumFeature = useFeatureFlag(FLAG_KEYS.SHOW_PREMIUM_FEATURE_DEMO, false);
  const userContext = getOrCreateUserContext();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Problem/Solution Focus */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-background-secondary">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f242d_1px,transparent_1px),linear-gradient(to_bottom,#1f242d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/landing"
              className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  <span>Application Tracking</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Never Lose Track
                  <br />
                  <span className="text-primary">of an Application</span>
                </h1>
                <p className="text-xl text-foreground-secondary leading-relaxed">
                  Stop juggling spreadsheets, emails, and sticky notes. One organized system to track
                  every application, response, and follow-up.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                  <Link href="/jobs">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      Start Tracking Free
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

              {/* Visual: Before/After */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20">
                  <div className="flex items-center gap-2 mb-3">
                    <X className="w-5 h-5 text-danger" />
                    <span className="font-semibold text-danger">The Problem</span>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-danger mt-1">•</span>
                      <span>Applications scattered across emails and spreadsheets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-danger mt-1">•</span>
                      <span>Forgot to follow up on that application from last week</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-danger mt-1">•</span>
                      <span>Can&apos;t remember which company you already applied to</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-danger mt-1">•</span>
                      <span>No visibility into your pipeline status</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="font-semibold text-success">The Solution</span>
                  </div>
                  <ul className="space-y-2 text-sm text-foreground-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-1">✓</span>
                      <span>All applications in one organized table</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-1">✓</span>
                      <span>Automated reminders for follow-ups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-1">✓</span>
                      <span>Instant search and filtering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-success mt-1">✓</span>
                      <span>Real-time pipeline visibility</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features - Table-like Layout */}
      <section className="py-24 border-b border-border bg-background-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Everything in One Organized Table
            </h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              A familiar spreadsheet interface with powerful features built for job searching
            </p>
          </div>

          {/* Mock Table Preview */}
          <div className="mb-12 rounded-xl border border-border bg-background-tertiary overflow-hidden">
            <div className="p-4 border-b border-border bg-background-secondary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-foreground-secondary" />
                  <span className="text-sm text-foreground-secondary">Search companies, roles...</span>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                    All
                  </div>
                  <div className="px-3 py-1 rounded-lg border border-border text-xs">Applied</div>
                  <div className="px-3 py-1 rounded-lg border border-border text-xs">Interview</div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[
                  { company: "TechCorp", role: "Senior Engineer", status: "Interview", date: "2 days ago" },
                  { company: "StartupXYZ", role: "Product Manager", status: "Applied", date: "1 week ago" },
                  { company: "BigCo", role: "Engineering Lead", status: "Phone Screen", date: "3 days ago" },
                ].map((job, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-background-secondary border border-border-subtle hover:border-primary/30 transition-colors"
                  >
                    <div>
                      <div className="font-semibold">{job.company}</div>
                      <div className="text-sm text-foreground-secondary">{job.role}</div>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {job.status}
                      </span>
                    </div>
                    <div className="text-sm text-foreground-secondary">{job.date}</div>
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="xs">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Search}
              title="Smart Search"
              description="Find any application instantly by company, role, or contact name."
            />
            <FeatureCard
              icon={Filter}
              title="Powerful Filters"
              description="Filter by status, response, date range, or any custom field."
            />
            <FeatureCard
              icon={Edit2}
              title="Inline Editing"
              description="Update information directly in the table. No forms, no clicks away."
            />
            <FeatureCard
              icon={Upload}
              title="CSV Import"
              description="Import your existing spreadsheet in seconds. No manual entry needed."
            />
          </div>
        </div>
      </section>

      {/* Pain Points & Solutions */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-danger" />
                </div>
                <h2 className="text-3xl font-semibold">Common Job Search Chaos</h2>
              </div>
              <div className="space-y-4">
                <PainPoint
                  title="Lost in the Spreadsheet"
                  description="Your job search data is scattered across multiple tabs, emails, and notes. Finding information takes forever."
                />
                <PainPoint
                  title="Forgotten Follow-ups"
                  description="You meant to follow up on that application, but it got buried in your inbox. Opportunities slip away."
                />
                <PainPoint
                  title="No Pipeline Visibility"
                  description="You have no idea how many applications are active, which ones responded, or what needs attention."
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-success" />
                </div>
                <h2 className="text-3xl font-semibold">How Job Tracker Helps</h2>
              </div>
              <div className="space-y-4">
                <Solution
                  title="One Centralized System"
                  description="All your applications, contacts, and notes in one organized table. Find anything in seconds."
                />
                <Solution
                  title="Never Miss a Follow-up"
                  description="Automated reminders and timeline tracking ensure you stay on top of every opportunity."
                />
                <Solution
                  title="Real-Time Pipeline View"
                  description="See your entire job search at a glance. Know exactly where each application stands."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-background-secondary/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="100+" label="Applications Tracked" />
            <StatCard number="42%" label="Average Response Rate" />
            <StatCard number="5 min" label="Setup Time" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-background-secondary to-background-tertiary p-12 lg:p-16">
            <Clock className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Stop Losing Track of Opportunities
            </h2>
            <p className="text-lg text-foreground-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who keep their applications organized and never miss a
              follow-up.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/jobs">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Tracking Free
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
              No credit card required • Import your existing data • Free forever
            </p>
          </div>
        </div>
      </section>

      {/* Premium Feature Demo - Targeting Example */}
      {showPremiumFeature && (
        <section className="py-16 bg-primary/5 border-y border-primary/20">
          <div className="max-w-7xl mx-auto px-6">
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-3">
                    Premium Feature - LaunchDarkly Targeting Demo
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Exclusive Premium Feature</h3>
                  <p className="text-foreground-secondary mb-4">
                    This section is only visible to users targeted by LaunchDarkly rules. 
                    You&apos;re seeing this because your user context matches our targeting rules!
                  </p>
                  <div className="bg-background-secondary/50 p-4 rounded-lg border border-border">
                    <p className="text-sm font-semibold text-foreground mb-2">Your Current Context:</p>
                    <div className="grid md:grid-cols-2 gap-3 text-sm text-foreground-secondary">
                      <div>
                        <span className="font-medium">Email:</span> {userContext.email}
                      </div>
                      <div>
                        <span className="font-medium">Role:</span> {userContext.role}
                      </div>
                      <div>
                        <span className="font-medium">Subscription:</span> {userContext.subscriptionTier}
                      </div>
                      <div>
                        <span className="font-medium">Beta Tester:</span> {userContext.betaTester ? 'Yes' : 'No'}
                      </div>
                      {userContext.companySize && (
                        <div>
                          <span className="font-medium">Company Size:</span> {userContext.companySize}
                        </div>
                      )}
                      {userContext.industry && (
                        <div>
                          <span className="font-medium">Industry:</span> {userContext.industry}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-foreground-muted mt-4">
                    💡 <strong>Tip:</strong> Configure targeting rules in LaunchDarkly dashboard to control who sees this feature.
                    Try targeting by subscriptionTier, betaTester, or role attributes.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}
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
    <Card className="p-6 space-y-3 text-center">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-foreground-secondary leading-relaxed">{description}</p>
    </Card>
  );
}

function PainPoint({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-background-secondary border-l-4 border-danger/50">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-foreground-secondary">{description}</p>
    </div>
  );
}

function Solution({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-background-secondary border-l-4 border-success/50">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-foreground-secondary">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-sm text-foreground-secondary">{label}</div>
    </div>
  );
}
