"use client";

import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";

function CodeBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
        {title}
      </div>
      <pre className="bg-background-tertiary border border-border rounded-lg p-4 overflow-x-auto text-xs leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function AdminQuickReferencePage() {
  const canAccessAdmin = useFeatureFlag(FLAG_KEYS.SHOW_ADMIN_PAGE, true);
  const canAccessQuickRef = useFeatureFlag(FLAG_KEYS.SHOW_ADMIN_QUICK_REFERENCE_PAGE, true);

  if (!canAccessAdmin || !canAccessQuickRef) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Admin</p>
        <h1 className="text-3xl font-semibold">Quick Reference</h1>
        <p className="text-sm text-foreground-secondary">
          Short, high-signal pointers for interview prep (code locations + copy/paste snippets).
        </p>
      </header>

      <div className="grid gap-6">
        <Card className="p-6 space-y-3 border border-amber-500/30 bg-amber-500/5">
          <h2 className="text-lg font-semibold">Demo note: feature flags vs “access control”</h2>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            This codebase intentionally uses <strong>client-side flag gating</strong> (hide links + render a Not Found UI)
            to demonstrate LaunchDarkly targeting in a self-contained demo. In production, feature flags are typically used
            for <strong>rollouts/experiments/UX toggles</strong> and any true authorization is enforced{" "}
            <strong>server-side</strong> (middleware / server components / API authorization).
          </p>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            <strong>What is server-side today?</strong> The chat API route evaluates an AI Config using the LaunchDarkly{" "}
            <strong>server SDK</strong> (<code className="bg-background-tertiary px-2 py-1 rounded">app/api/chat/route.ts</code>).
            Most page “access” in this demo is client-side.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">How do you implement user roles?</h2>
          <p className="text-sm text-foreground-secondary">
            Demo users (and their <strong>role</strong> + <strong>subscriptionTier</strong>) are defined in
            <code className="bg-background-tertiary px-2 py-1 rounded ml-2">lib/launchdarkly/userContext.ts</code>.
          </p>
          <CodeBlock title="Source: lib/launchdarkly/userContext.ts (UserContext + DEMO_USERS)">
{`export interface UserContext {
  role: 'user' | 'admin' | 'beta-tester' | 'business';
  subscriptionTier: 'free' | 'premium' | 'enterprise' | 'business';
  betaTester: boolean;
  // ...
}

const DEMO_USERS: UserContext[] = [
  { key: 'user-001', name: 'Beta Tester', role: 'beta-tester', subscriptionTier: 'premium', betaTester: true },
  { key: 'user-004', name: 'Business User', role: 'business', subscriptionTier: 'business', betaTester: false },
];`}
          </CodeBlock>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">How and where are those roles enforced?</h2>
          <p className="text-sm text-foreground-secondary">
            In this demo, “enforcement” is done by <strong>client-side rendering decisions</strong> once LaunchDarkly flags
            are available: we wait for flags, then render either the page or a Not Found UI via{" "}
            <code className="bg-background-tertiary px-2 py-1 rounded">notFound()</code>. Example: Support Bot premium access.
          </p>
          <CodeBlock title="Source: app/landing/support-bot/page.tsx (flag + 404 gate)">
{`const flagsReady = useFlagsReady();
const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_PREMIUM_FEATURE_DEMO, false);

if (!flagsReady) return <Loading />;
if (!canAccess) return notFound();`}
          </CodeBlock>
          <p className="text-sm text-foreground-secondary">
            Business mode pages also enforce access the same way:
            <code className="bg-background-tertiary px-2 py-1 rounded ml-2">app/business/*</code>.
          </p>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            <strong>Interview-safe clarification:</strong> this is great for demonstrating targeting + UX gating, but it is
            not a security boundary. A production app would enforce authorization server-side (and still use the same flags
            to control UI exposure).
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">How do you set up the LaunchDarkly SDK?</h2>
          <p className="text-sm text-foreground-secondary">
            Client-side: React SDK provider + identify with custom attributes. Server-side: Node SDK singleton used in API
            routes.
          </p>
          <CodeBlock title="Source: components/LaunchDarklyProvider.tsx (client identify)">
{`export const LaunchDarklyProvider = withLDProvider({
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID || '',
  options: { bootstrap: 'localStorage' },
})(LaunchDarklyProviderComponent);

ldClient.identify({
  key: userContext.key,
  custom: { role: userContext.role, subscriptionTier: userContext.subscriptionTier },
});`}
          </CodeBlock>
          <CodeBlock title="Source: lib/launchdarkly/serverClient.ts (server init)">
{`const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;
const client = LaunchDarkly.init(sdkKey);
await client.waitForInitialization();`}
          </CodeBlock>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">How do you control premium feature access in the codebase?</h2>
          <p className="text-sm text-foreground-secondary">
            Premium access is controlled with a flag (targeted in LaunchDarkly) and enforced via 404 gating in the route.
          </p>
          <CodeBlock title="Source: app/landing/support-bot/page.tsx (premium gate)">
{`const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_PREMIUM_FEATURE_DEMO, false);
if (!canAccess) return notFound();`}
          </CodeBlock>
          <p className="text-sm text-foreground-secondary">
            The marketing page also uses the same flag to show/hide premium demo content:
            <code className="bg-background-tertiary px-2 py-1 rounded ml-2">app/landing/job-tracker/page.tsx</code>.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Example: Free user blocked from Analytics</h2>
          <p className="text-sm text-foreground-secondary">
            Analytics access is controlled by the flag{" "}
            <code className="bg-background-tertiary px-2 py-1 rounded">show-analytics-page</code> (key:{" "}
            <code className="bg-background-tertiary px-2 py-1 rounded">FLAG_KEYS.SHOW_ANALYTICS_PAGE</code>).
            If the flag evaluates to <strong>false</strong> for a Free user, the client renders the Not Found UI for that
            route.
          </p>
          <p className="text-sm text-foreground-secondary">
            <strong>What is </strong>
            <code className="bg-background-tertiary px-2 py-1 rounded">canAccess</code>
            <strong>?</strong> It’s just a local boolean variable holding the result of the LaunchDarkly flag evaluation
            for the <em>current user context</em>. The flag can evaluate differently per user because LaunchDarkly
            targeting rules (for example: <code className="bg-background-tertiary px-1.5 py-0.5 rounded">subscriptionTier</code>)
            are applied at evaluation time.
          </p>
          <p className="text-sm text-foreground-secondary">
            <strong>How </strong>
            <code className="bg-background-tertiary px-2 py-1 rounded">useFeatureFlag(flagKey, defaultValue)</code>
            <strong> ties to access:</strong> the hook returns the evaluated boolean value of that flag. If the flag is
            missing/unavailable, it falls back to <code className="bg-background-tertiary px-2 py-1 rounded">defaultValue</code>.
            We then use that boolean to decide whether to render the page or return a 404.
          </p>
          <CodeBlock title="Source: app/analytics/page.tsx (page access gate)">
{`const flagsReady = useFlagsReady();
const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_ANALYTICS_PAGE, true);

// Avoid UI flash while LaunchDarkly initializes
if (!flagsReady) return <Loading />;

// Enforce access: if the flag evaluates to false for this user, return a 404
if (!canAccess) return notFound();`}
          </CodeBlock>
          <p className="text-sm text-foreground-secondary">
            <strong>Why both a sidebar hide and a Not Found gate?</strong> The sidebar hides navigation so users don’t see
            unavailable routes, and the gate handles “deep links” (users typing/pasting a URL). This is useful UX, but in
            production you would still enforce authorization server-side.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Where is the AI Config being set up?</h2>
          <p className="text-sm text-foreground-secondary">
            AI Config is fetched <strong>server-side</strong> in the chat API route using the LaunchDarkly server SDK.
          </p>
          <CodeBlock title="Source: app/api/chat/route.ts (AI Config variation fetch)">
{`const ldContext = convertToLDContext(userContext);
const aiConfig = await Promise.resolve(
  ldClient.variation('jobs-os-basic-chatbot', ldContext, null)
);`}
          </CodeBlock>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            <strong>Production note:</strong> the API currently accepts <code className="bg-background-tertiary px-2 py-1 rounded">userContext</code>{" "}
            from the request body (fine for demo/testing). In a real app, you would derive the user context server-side from
            your authenticated session and avoid trusting client-provided entitlements like{" "}
            <code className="bg-background-tertiary px-2 py-1 rounded">subscriptionTier</code>.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Where are user roles for AI Config implemented?</h2>
          <p className="text-sm text-foreground-secondary">
            The app passes role/tier/beta attributes into LaunchDarkly context; targeting for AI Config variations is then
            configured in LaunchDarkly (rules by <code className="bg-background-tertiary px-2 py-1 rounded">role</code>,
            <code className="bg-background-tertiary px-2 py-1 rounded ml-1">subscriptionTier</code>, etc.).
          </p>
          <CodeBlock title="Source: components/admin/UserContextSwitcher.tsx (identify includes role)">
{`custom: {
  role: user.role,
  subscriptionTier: user.subscriptionTier,
  betaTester: user.betaTester,
}`}
          </CodeBlock>
          <CodeBlock title="Source: lib/launchdarkly/serverClient.ts (server-side context mapping)">
{`custom: {
  role: userContext.role,
  subscriptionTier: userContext.subscriptionTier,
  betaTester: userContext.betaTester,
}`} 
          </CodeBlock>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">How can you use a script/CLI to create a new LaunchDarkly flag?</h2>
          <p className="text-sm text-foreground-secondary">
            The repo includes an import script that creates flags via <code className="bg-background-tertiary px-2 py-1 rounded">ldcli flags create</code>.
          </p>
          <CodeBlock title="Source: scripts/import-flags.js (flag creation command)">
{`const flagJson = JSON.stringify(flagDefinition).replace(/\"/g, '\\\\\"');
const cmd = \`ldcli flags create --project \${projectKey} -d \"\${flagJson}\"\`;
execSync(cmd, { stdio: 'pipe', shell: true });`}
          </CodeBlock>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">How can you use a script/CLI to manage LaunchDarkly access by “role”?</h2>
          <p className="text-sm text-foreground-secondary">
            In LaunchDarkly, “role access” is typically managed through targeting rules on attributes like{" "}
            <code className="bg-background-tertiary px-2 py-1 rounded">role</code> and{" "}
            <code className="bg-background-tertiary px-2 py-1 rounded">subscriptionTier</code>. The import script can
            apply targets/rules from an export to keep environments consistent.
          </p>
          <CodeBlock title="Source: scripts/import-flags.js (apply targets + rules to an environment)">
{`const envUpdate = {
  ...currentFlag.environments[environmentKey],
  targets: envConfig.targets || [],
  rules: envConfig.rules || [],
};`}
          </CodeBlock>
        </Card>
      </div>
    </div>
  );
}


