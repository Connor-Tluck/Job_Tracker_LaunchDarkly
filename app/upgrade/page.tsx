"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TrendingUp, Lock, ArrowRight, MessageCircle } from "lucide-react";

const FEATURE_COPY: Record<
  string,
  { title: string; description: string; icon: ComponentType<{ className?: string }> }
> = {
  analytics: {
    title: "Analytics is a Premium feature",
    description:
      "Upgrade to Premium to unlock pipeline analytics, response trends, and conversion insights so you can optimize your job search strategy.",
    icon: TrendingUp,
  },
  "support-bot": {
    title: "Support Bot is a Premium feature",
    description:
      "Upgrade to Premium to unlock instant AI-powered help—answers about features, getting started, troubleshooting, and best practices.",
    icon: MessageCircle,
  },
};

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const feature = searchParams?.get("feature") ?? "analytics";
  const returnTo = searchParams?.get("returnTo") ?? "/analytics";

  const copy = FEATURE_COPY[feature] ?? {
    title: "This feature requires Premium",
    description: "Upgrade to Premium to unlock this feature.",
    icon: Lock,
  };

  const Icon = copy.icon;

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{copy.title}</h1>
            <p className="text-sm text-foreground-secondary">{copy.description}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/signup?plan=premium&feature=${encodeURIComponent(feature)}&returnTo=${encodeURIComponent(
              returnTo
            )}`}
          >
            <Button variant="primary" size="lg" className="w-full">
              Sign up for Premium
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/jobs">
            <Button variant="outline" size="lg" className="w-full">
              Back to Jobs
            </Button>
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-background-secondary p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Lock className="w-4 h-4 text-foreground-secondary" />
            What you’ll get with Premium
          </div>
          <ul className="mt-2 space-y-1 text-sm text-foreground-secondary list-disc pl-5">
            <li>Response rate and conversion insights</li>
            <li>Pipeline velocity and stage drop-off analysis</li>
            <li>Trend tracking to improve your strategy over time</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}


