"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getOrCreateUserContext, setUserContext } from "@/lib/launchdarkly/userContext";
import { ArrowRight, CheckCircle2, CreditCard } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ldClient = useLDClient();

  const plan = searchParams?.get("plan") ?? "premium";
  const feature = searchParams?.get("feature") ?? undefined;
  const returnTo = searchParams?.get("returnTo") ?? "/analytics";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const title = useMemo(() => {
    if (plan === "premium") return "Sign up for Premium";
    return "Sign up";
  }, [plan]);

  const description = useMemo(() => {
    if (feature === "analytics") {
      return "Unlock Pipeline Analytics with Premium.";
    }
    return "Create an account to unlock Premium features.";
  }, [feature]);

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    // Demo signup: upgrade the local demo user and re-identify in LaunchDarkly.
    const current = getOrCreateUserContext();
    const upgraded = {
      ...current,
      name: name.trim() || current.name,
      email: email.trim() || current.email,
      subscriptionTier: "premium" as const,
      role: current.role === "business" ? "user" : current.role,
      betaTester: current.betaTester ?? false,
      signupDate: new Date().toISOString(),
    };

    setUserContext(upgraded);
    window.dispatchEvent(new CustomEvent("ld-user-context-changed"));

    if (ldClient) {
      try {
        await ldClient.identify({
          key: upgraded.key,
          email: upgraded.email,
          name: upgraded.name,
          custom: {
            role: upgraded.role,
            subscriptionTier: upgraded.subscriptionTier,
            signupDate: upgraded.signupDate,
            betaTester: upgraded.betaTester,
            companySize: upgraded.companySize,
            industry: upgraded.industry,
          },
        });
      } catch {
        // If identify fails, user context is still updated locally.
      }
    }

    setDone(true);
    setSubmitting(false);

    // Give the UI a beat, then continue.
    setTimeout(() => {
      router.replace(returnTo);
    }, 350);
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center">
      <Card className="w-full max-w-lg p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-sm text-foreground-secondary">{description}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <label className="block">
            <div className="text-sm font-medium mb-1">Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </label>
          <label className="block">
            <div className="text-sm font-medium mb-1">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="jane@example.com"
              autoComplete="email"
              inputMode="email"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={onSubmit}
            disabled={submitting}
          >
            {done ? "Upgraded!" : submitting ? "Upgrading…" : "Start Premium"}
            {done ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Button>
          <Link href="/jobs">
            <Button variant="outline" size="lg" className="w-full">
              Not now
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-xs text-foreground-muted">
          This demo app simulates signup by upgrading your local user context so LaunchDarkly targeting updates immediately.
        </p>
      </Card>
    </div>
  );
}


