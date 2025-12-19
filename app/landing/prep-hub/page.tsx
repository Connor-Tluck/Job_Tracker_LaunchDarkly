"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Target,
  ArrowRight,
  FileText,
  Star,
  MessageSquare,
  Edit2,
  CheckCircle2,
  Zap,
  Brain,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";

export default function PrepHubPage() {
  // Page access check
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_LANDING_PREP_HUB, true);
  if (!canAccess) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Confidence Focus */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-5xl mx-auto text-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Walk Into Every Interview
                <br />
                <span className="text-primary">Fully Prepared</span>
              </h1>
              <p className="text-xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed">
                Your complete interview preparation library. Build company-specific prep documents,
                organize STAR stories, and access everything you need—even during the interview.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/prep">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Start Preparing
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

      {/* Visual: Prep Structure */}
      <section className="py-16 border-b border-border bg-background-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Sidebar Navigation Preview */}
            <div className="lg:col-span-1">
              <Card className="p-4 space-y-2 bg-background-tertiary">
                <div className="text-xs font-semibold text-foreground-secondary mb-3 uppercase tracking-wide">
                  Navigation
                </div>
                {[
                  "Personal Narrative",
                  "Strengths & Growth",
                  "Common Q&A",
                  "Question Bank",
                  "STAR Stories",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg text-sm ${
                      idx === 0
                        ? "bg-primary text-white"
                        : "text-foreground-secondary hover:bg-background-secondary"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </Card>
            </div>

            {/* Content Preview */}
            <div className="lg:col-span-4">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Personal Narrative</h2>
                </div>
                <div className="space-y-4 text-foreground-secondary">
                  <p>
                    I'm a [role] with [X] years of experience in [industry/domain]. My background
                    combines [key skill 1] and [key skill 2], which has allowed me to...
                  </p>
                  <p>
                    I'm particularly passionate about [specific area] and have a track record of
                    [achievement]. In my previous role at [company], I...
                  </p>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-foreground-muted">
                      <Edit2 className="w-3 h-3" />
                      <span>Click to edit</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features - Organized Layout */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Everything You Need to Ace Interviews
            </h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Build comprehensive prep materials that you can access instantly, even during interviews
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <FeatureHighlight
                icon={FileText}
                title="Company Prep Documents"
                description="Create tailored preparation documents for each company. Include product knowledge, company culture, interview questions, and your unique value proposition."
                color="primary"
              />
              <FeatureHighlight
                icon={Star}
                title="STAR Stories Library"
                description="Build and organize your behavioral interview stories. Tag by industry, category, and theme. Access your best examples instantly."
                color="warning"
              />
            </div>
            <div className="space-y-6">
              <FeatureHighlight
                icon={MessageSquare}
                title="Question Banks"
                description="Maintain comprehensive libraries of common interview questions and your prepared answers. Never be caught off guard by a question."
                color="info"
              />
              <FeatureHighlight
                icon={Brain}
                title="Master Prep Library"
                description="Centralized location for your personal narrative, strengths, and reusable content that applies to all interviews."
                color="success"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases - During Interview Focus */}
      <section className="py-24 bg-background-secondary/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Perfect for Quick Reference During Interviews
            </h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Access your prep materials instantly, even while on a call
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <UseCaseCard
              icon={Zap}
              title="Quick Navigation"
              description="Sidebar navigation lets you jump between sections instantly. Find what you need in seconds."
              scenario="During the interview, they ask about your experience with X. You quickly navigate to your STAR stories section."
            />
            <UseCaseCard
              icon={BookOpen}
              title="Company Research"
              description="All your company research in one place. Product pillars, customer profiles, and why you're interested."
              scenario="They ask why you want to work here. You have your prepared answer ready, tailored to their specific products."
            />
            <UseCaseCard
              icon={Lightbulb}
              title="Questions for Them"
              description="Your prepared questions are ready. Show genuine interest and gather the information you need."
              scenario="When they ask if you have questions, you have thoughtful, prepared questions that show you've done your research."
            />
          </div>
        </div>
      </section>

      {/* Benefits - Confidence Focus */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <CheckCircle2 className="w-4 h-4" />
                <span>Interview Confidence</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-semibold mb-6">
                Never Feel Unprepared Again
              </h2>
              <div className="space-y-4">
                <BenefitItem
                  title="Walk In Confident"
                  description="You've prepared for every question. Your stories are polished, your research is complete, and you know exactly what to say."
                />
                <BenefitItem
                  title="Access Everything Instantly"
                  description="During the interview, quickly reference your prep materials. No fumbling, no blank moments."
                />
                <BenefitItem
                  title="Tailored to Each Company"
                  description="Every prep document is customized. Show you've done your homework and understand their specific needs."
                />
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-6 border-l-4 border-primary">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Before Prep Hub</h3>
                    <p className="text-sm text-foreground-secondary">
                      "I hope they don't ask about that project... I can't remember the details."
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-success">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">With Prep Hub</h3>
                    <p className="text-sm text-foreground-secondary">
                      "I have my STAR story ready, with all the metrics and details. I'm prepared for
                      anything they ask."
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-background-secondary to-background-tertiary p-12 lg:p-16">
            <Target className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Build Your Interview Confidence Today
            </h2>
            <p className="text-lg text-foreground-secondary mb-8 max-w-2xl mx-auto">
              Start building your prep library and walk into every interview fully prepared and
              confident.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/prep">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Preparing Free
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
              No setup required • Start building immediately • Free forever
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureHighlight({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  color: "primary" | "warning" | "info" | "success";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    info: "bg-info/10 text-info border-info/20",
    success: "bg-success/10 text-success border-success/20",
  };

  return (
    <Card className="p-6 space-y-3">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-foreground-secondary leading-relaxed">{description}</p>
    </Card>
  );
}

function UseCaseCard({
  icon: Icon,
  title,
  description,
  scenario,
}: {
  icon: any;
  title: string;
  description: string;
  scenario: string;
}) {
  return (
    <Card className="p-6 space-y-4">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-foreground-secondary leading-relaxed">{description}</p>
      <div className="pt-4 border-t border-border">
        <p className="text-sm italic text-foreground-muted">"{scenario}"</p>
      </div>
    </Card>
  );
}

function BenefitItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <CheckCircle2 className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-foreground-secondary">{description}</p>
      </div>
    </div>
  );
}
