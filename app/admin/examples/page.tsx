"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, ImageIcon, Zap, Target, Bot, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExamplesPage() {
  // Page access check
  const canAccessAdmin = useFeatureFlag(FLAG_KEYS.SHOW_ADMIN_PAGE, true);
  const canAccessExamples = useFeatureFlag(FLAG_KEYS.SHOW_ADMIN_EXAMPLES_PAGE, true);
  if (!canAccessAdmin || !canAccessExamples) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Documentation</p>
        <h1 className="text-3xl font-semibold">Examples & Walkthroughs</h1>
        <p className="text-sm text-foreground-secondary">
          Step-by-step walkthroughs demonstrating each test scenario documented in Assignment Docs
        </p>
      </header>

      <div className="prose prose-invert max-w-none space-y-8">
        {/* Part 1: Release and Remediate Examples */}
        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-success/10">
              <Zap className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Part 1: Release and Remediate Examples</h2>
              <p className="text-foreground-secondary">
                Walkthroughs demonstrating instant flag toggles and real-time UI updates
              </p>
            </div>
          </div>

          <div className="space-y-8 pl-12">
            {/* Example 1: Analytics Page Toggle */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Example 1: Analytics Page Toggle
              </h3>
              <p className="text-foreground-secondary">
                <strong>Flag:</strong> <code className="bg-background-tertiary px-2 py-1 rounded">show-analytics-page</code>
              </p>
              
              <div className="bg-background-tertiary p-5 rounded-lg space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 1: Initial State</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Before toggling, verify the Analytics page is accessible and the sidebar link is visible.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: Sidebar with Analytics link visible</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/analytics-sidebar-before.png"
                        alt="Sidebar with Analytics link visible"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 2: LaunchDarkly Configuration</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Navigate to LaunchDarkly dashboard → Feature Flags → <code className="bg-background px-1.5 py-0.5 rounded">show-analytics-page</code>
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: LaunchDarkly flag configuration page</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/analytics-flag-config.png"
                        alt="LaunchDarkly flag configuration page"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 3: Toggle Flag OFF</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Toggle the flag to OFF in LaunchDarkly dashboard. Observe instant changes without page reload.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: Sidebar after toggle - Analytics link removed</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/analytics-sidebar-after.png"
                        alt="Sidebar after toggle - Analytics link removed"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 4: Verify 404 Page</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Navigate directly to <code className="bg-background px-1.5 py-0.5 rounded">/analytics</code> to see the 404 error page.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: 404 page when accessing /analytics</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/analytics-404-page.png"
                        alt="404 page when accessing /analytics"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Part 2: Targeting Examples */}
        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-success/10">
              <Target className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Part 2: Targeting Examples</h2>
              <p className="text-foreground-secondary">
                Walkthroughs demonstrating user-based targeting and real-time context switching
              </p>
            </div>
          </div>

          <div className="space-y-8 pl-12">
            {/* Example 1: Premium Feature Demo - Beta Tester */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Example 1: Premium Feature Demo - Beta Tester User
              </h3>
              <p className="text-foreground-secondary">
                <strong>Flag:</strong> <code className="bg-background-tertiary px-2 py-1 rounded">show-premium-feature-demo</code>
                <br />
                <strong>User:</strong> Beta Tester (<code className="bg-background-tertiary px-1.5 py-0.5 rounded">user-001</code> / <code className="bg-background-tertiary px-1.5 py-0.5 rounded">beta.tester@example.com</code>)
              </p>
              
              <div className="bg-background-tertiary p-5 rounded-lg space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 1: LaunchDarkly Targeting Configuration</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Configure individual targeting for Beta Tester user in LaunchDarkly dashboard.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: LaunchDarkly individual targeting configuration</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/targeting-individual-beta.png"
                        alt="LaunchDarkly individual targeting configuration"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 2: Switch to Beta Tester in Admin Page</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Navigate to <code className="bg-background px-1.5 py-0.5 rounded">/admin</code> and use the User Context Switcher to select Beta Tester.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: Admin page with Beta Tester selected</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/targeting-beta-selected.png"
                        alt="Admin page with Beta Tester selected"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 3: Premium Feature Working - Chatbot Accessible</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    With Beta Tester selected, navigate to <code className="bg-background px-1.5 py-0.5 rounded">/landing/support-bot</code> to verify the chatbot is accessible and working. This demonstrates the premium feature is enabled for Beta Tester.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: Support Bot page accessible and working for Beta Tester</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/targeting-beta-chatbot-working.png"
                        alt="Support Bot page accessible and working for Beta Tester"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 4: Switch to Free User</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Navigate back to <code className="bg-background px-1.5 py-0.5 rounded">/admin</code> and use the User Context Switcher to select Free User.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: Admin page with Free User selected</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/targeting-free-user-selected.png"
                        alt="Admin page with Free User selected"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 5: Free User - Chatbot Returns 404</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    With Free User selected, navigate to <code className="bg-background px-1.5 py-0.5 rounded">/landing/support-bot</code> to see the 404 error page. This demonstrates that the premium feature (chatbot) is not accessible for Free User.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: 404 page when Free User accesses /landing/support-bot</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/targeting-free-chatbot-404.png"
                        alt="404 page when Free User accesses /landing/support-bot"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Extra Credit: AI Configs Examples */}
        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-success/10">
              <Bot className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Extra Credit: AI Configs Examples</h2>
              <p className="text-foreground-secondary">
                Walkthroughs demonstrating LaunchDarkly AI Configs integration and dynamic chatbot behavior
              </p>
            </div>
          </div>

          <div className="space-y-8 pl-12">
            {/* Example 1: AI Configs - Beta Tester Grumpy Chatbot */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Example 1: AI Configs - Beta Tester Receives Grumpy Chatbot
              </h3>
              <p className="text-foreground-secondary">
                <strong>AI Config:</strong> <code className="bg-background-tertiary px-2 py-1 rounded">jobs-os-basic-chatbot</code>
                <br />
                <strong>Variation:</strong> <code className="bg-background-tertiary px-1.5 py-0.5 rounded">combative_open_ai</code> (Grumpy Sarcastic)
                <br />
                <strong>User:</strong> Beta Tester (<code className="bg-background-tertiary px-1.5 py-0.5 rounded">user-001</code>)
              </p>
              
              <div className="bg-background-tertiary p-5 rounded-lg space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 1: LaunchDarkly AI Config Setup</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Configure AI Config in LaunchDarkly with two variations: standard_open_ai (friendly) and combative_open_ai (grumpy).
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: LaunchDarkly AI Config variations configuration</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/ai-config-variations.png"
                        alt="LaunchDarkly AI Config variations configuration"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 2: Configure Model Behavior in Prompting</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Configure the system prompt and model parameters for each variation. For the <code className="bg-background px-1.5 py-0.5 rounded">combative_open_ai</code> variation, set a sarcastic, grumpy system prompt. Configure temperature, max tokens, and model selection (e.g., GPT-4) in the AI Config variation settings.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: LaunchDarkly AI Config variation prompting and model configuration</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/ai-config-prompting.png"
                        alt="LaunchDarkly AI Config variation prompting and model configuration"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 3: AI Config Individual Targeting</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Configure individual targeting: Beta Tester (<code className="bg-background px-1.5 py-0.5 rounded">user-001</code>) → <code className="bg-background px-1.5 py-0.5 rounded">combative_open_ai</code>
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: LaunchDarkly AI Config individual targeting for Beta Tester</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/ai-config-beta-targeting.png"
                        alt="LaunchDarkly AI Config individual targeting for Beta Tester"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 4: Switch to Beta Tester and Test Chatbot</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Navigate to <code className="bg-background px-1.5 py-0.5 rounded">/admin</code>, switch to Beta Tester, and use the Chat Test Interface to send a message.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: Chat Test Interface with Beta Tester selected</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/ai-config-beta-chat-interface.png"
                        alt="Chat Test Interface with Beta Tester selected"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 5: Grumpy Chatbot Response</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Observe the chatbot response showing grumpy, sarcastic tone (e.g., "Oh great, another question...").
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: Chatbot response with grumpy/sarcastic tone</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/ai-config-beta-grumpy-response.png"
                        alt="Chatbot response with grumpy/sarcastic tone"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 6: Test Other Configuration - Friendly Chatbot</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Switch to Premium User in the User Context Switcher and test the chatbot again. Premium User receives the <code className="bg-background px-1.5 py-0.5 rounded">standard_open_ai</code> variation, which has a friendly, helpful system prompt. Send the same message and observe the contrast in tone compared to Beta Tester&apos;s grumpy response.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: Chatbot response with friendly/helpful tone (Premium User)</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/ai-config-premium-friendly-response.png"
                        alt="Chatbot response with friendly/helpful tone (Premium User)"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Extra Credit: Experimentation Examples */}
        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-success/10">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Extra Credit: Experimentation Examples</h2>
              <p className="text-foreground-secondary">
                Walkthroughs demonstrating experiment setup and metric tracking
              </p>
            </div>
          </div>

          <div className="space-y-8 pl-12">
            {/* Example 1: Support Bot Experiment */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Example 1: Support Bot Experiment Setup
              </h3>
              <p className="text-foreground-secondary">
                <strong>Flag:</strong> <code className="bg-background-tertiary px-2 py-1 rounded">show-premium-feature-demo</code>
                <br />
                <strong>Experiment:</strong> Support Bot feature access experiment
              </p>
              
              <div className="bg-background-tertiary p-5 rounded-lg space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 1: Add Event Listeners</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Event tracking was implemented in the Support Bot page (<code className="bg-background px-1.5 py-0.5 rounded">app/landing/support-bot/page.tsx</code>) using LaunchDarkly&apos;s <code className="bg-background px-1.5 py-0.5 rounded">ldClient.track()</code> method. Three custom events are tracked:
                  </p>
                  <ul className="text-sm text-foreground-secondary mb-3 ml-6 list-disc space-y-1">
                    <li><code className="bg-background px-1.5 py-0.5 rounded">support-bot-page-view</code> - Tracked automatically when a user visits the Support Bot page via <code className="bg-background px-1.5 py-0.5 rounded">useEffect</code> hook</li>
                    <li><code className="bg-background px-1.5 py-0.5 rounded">support-bot-message-sent</code> - Tracked when a user sends a message, includes message content in event data</li>
                    <li><code className="bg-background px-1.5 py-0.5 rounded">support-bot-response-received</code> - Tracked when the bot responds, includes response length metadata</li>
                  </ul>
                  <p className="text-sm text-foreground-secondary mb-3">
                    All events include user context (user key, email, subscription tier, etc.) for proper segmentation. The tracking utility function (<code className="bg-background px-1.5 py-0.5 rounded">lib/launchdarkly/tracking.ts</code>) handles event queuing, flushing, and error handling.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 2: Check Event Explorer</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Navigate to LaunchDarkly Event Explorer to verify that events are being tracked correctly. Interact with the Support Bot page (visit the page, send a message) and check that events appear in the Event Explorer with proper user context.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: LaunchDarkly Event Explorer showing tracked events</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/experiment-event-explorer.png"
                        alt="LaunchDarkly Event Explorer showing tracked events"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 3: Configure Metrics</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    In LaunchDarkly, configure experiment metrics. Set the primary metric to <code className="bg-background px-1.5 py-0.5 rounded">support-bot-response-received</code> (conversion metric) and add secondary metrics for platform engagement (page clicks, navigation events). Configure engagement rate as a conversion metric from page view to message sent.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: LaunchDarkly experiment metrics configuration</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/experiment-metrics.png"
                        alt="LaunchDarkly experiment metrics configuration"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 4: Set Up Experiment</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Configure the experiment in LaunchDarkly: 50% sample size, 50/50 split between control and treatment groups, Bayesian statistical approach, 95% confidence threshold. The experiment tests whether users with access to the Support Bot feature show increased engagement with the platform overall.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: LaunchDarkly experiment configuration page</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/examples/experiment-config.png"
                        alt="LaunchDarkly experiment configuration page"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Extra Credit: Integrations */}
        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-success/10">
              <Zap className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Extra Credit: Integrations</h2>
              <p className="text-foreground-secondary">
                Walkthrough demonstrating Slack webhook integration for experiment lifecycle notifications
              </p>
            </div>
          </div>

          <div className="space-y-8 pl-12">
            {/* Example 1: Slack Webhook Setup */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Example 1: Slack Webhook for Experiment Updates
              </h3>
              <p className="text-foreground-secondary">
                <strong>Integration:</strong> LaunchDarkly Webhook → Slack App
                <br />
                <strong>Purpose:</strong> Automated notifications for experiment lifecycle events
              </p>
              
              <div className="bg-background-tertiary p-5 rounded-lg space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 1: Create Slack App and Webhook URL</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    In Slack, create a new Slack App: Go to <code className="bg-background px-1.5 py-0.5 rounded">api.slack.com/apps</code> → Create New App → Choose &quot;From scratch&quot;. Enable Incoming Webhooks: Go to Features → Incoming Webhooks → Activate Incoming Webhooks → Add New Webhook to Workspace. Copy the webhook URL (format: <code className="bg-background px-1.5 py-0.5 rounded">https://hooks.slack.com/services/...</code>).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 2: Configure LaunchDarkly Webhook</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    In LaunchDarkly dashboard, navigate to Integrations → Webhooks → Create Webhook. Configure the webhook:
                  </p>
                  <ul className="text-sm text-foreground-secondary mb-3 ml-6 list-disc space-y-1">
                    <li>Name: &quot;Slack Experiment Notifications&quot; (or similar)</li>
                    <li>URL: Paste the Slack webhook URL from Step 1</li>
                    <li>Events: Select <code className="bg-background px-1.5 py-0.5 rounded">experiment.started</code> and <code className="bg-background px-1.5 py-0.5 rounded">experiment.stopped</code></li>
                    <li>Method: POST</li>
                    <li>Headers: Add <code className="bg-background px-1.5 py-0.5 rounded">Content-Type: application/json</code></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Step 3: Verify Integration Setup</h4>
                  <p className="text-sm text-foreground-secondary mb-3">
                    Test the integration by starting or stopping an experiment in LaunchDarkly to trigger the webhook. Confirm the integration is working by checking LaunchDarkly webhook delivery logs and verifying Slack messages are received. The integration automatically tracks experiment beginnings and endings without manual intervention.
                  </p>
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <p className="text-xs text-foreground-secondary mb-2 font-medium">Screenshot: LaunchDarkly webhook configuration and Slack integration</p>
                    <div className="relative w-full max-w-xl mx-auto rounded-lg overflow-hidden border border-border">
                      <Image
                        src="/images/experiment-chatbot-integration.png"
                        alt="Experiment Chatbot Integration Screenshot"
                        width={600}
                        height={450}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


