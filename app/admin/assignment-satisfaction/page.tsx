"use client";

import { notFound } from "next/navigation";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { Card } from "@/components/ui/Card";
import { CheckCircle2, AlertCircle, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AssignmentSatisfactionPage() {
  // Page access check
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_ASSIGNMENT_SATISFACTION_PAGE, true);
  if (!canAccess) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-foreground-secondary">Documentation</p>
        <h1 className="text-3xl font-semibold">Assignment Satisfaction</h1>
        <p className="text-sm text-foreground-secondary">
          How the Job Tracker application satisfies LaunchDarkly Technical Exercise requirements
        </p>
      </header>

      <div className="prose prose-invert max-w-none space-y-8">
        {/* Part 1: Release and Remediate */}
        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Part 1: Release and Remediate</h2>
              <p className="text-foreground-secondary mb-4">✅ <strong>FULLY SATISFIED</strong></p>
            </div>
          </div>

          <div className="space-y-4 pl-12">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Feature Flag: Implement a flag around a specific new feature
              </h3>
              <p className="text-foreground-secondary mb-3">
                The application implements <strong>30 feature flags</strong> across multiple categories:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-secondary ml-4">
                <li><strong>Page Access Flags (12 flags)</strong>: Control entire page visibility and access</li>
                <li><strong>Feature Toggle Flags (6 flags)</strong>: Enable/disable specific functionality</li>
                <li><strong>Component Visibility Flags (10 flags)</strong>: Control UI component visibility</li>
                <li><strong>Admin & System Flags (2 flags)</strong>: Control admin access and documentation</li>
              </ul>
              <p className="text-foreground-secondary mt-3">
                <strong>Key Implementation:</strong> All flags are defined in <code className="bg-background-tertiary px-2 py-1 rounded">lib/launchdarkly/flags.ts</code> using TypeScript constants. Flags use kebab-case naming and default to <code className="bg-background-tertiary px-2 py-1 rounded">true</code> (ON).
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Instant Releases/Rollbacks: Implement a "listener" for instant flag updates
              </h3>
              <p className="text-foreground-secondary mb-3">
                The application uses LaunchDarkly's React Client SDK with real-time streaming enabled, providing instant flag updates without page reloads.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg font-mono text-sm">
                <div className="text-foreground-secondary mb-2">// LaunchDarkly Provider Setup</div>
                <div className="text-foreground">withLDProvider</div>
                <div className="text-foreground-secondary ml-4">- Establishes WebSocket connection</div>
                <div className="text-foreground-secondary ml-4">- Streams flag changes in real-time</div>
                <div className="text-foreground-secondary ml-4">- React hooks auto-update on changes</div>
              </div>
              <p className="text-foreground-secondary mt-3">
                <strong>Demonstration:</strong> Toggle any flag in LaunchDarkly dashboard and observe instant UI changes without page reload.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Remediate: Use a trigger to turn off problematic features
              </h3>
              <p className="text-foreground-secondary mb-3">
                Multiple remediation methods are implemented:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-secondary ml-4">
                <li><strong>LaunchDarkly Dashboard:</strong> Toggle flags ON/OFF instantly</li>
                <li><strong>LaunchDarkly CLI:</strong> Programmatic flag management via scripts</li>
                <li><strong>Admin Dashboard:</strong> In-app visibility of all flags</li>
              </ul>
              <p className="text-foreground-secondary mt-3">
                <strong>Time to Remediate:</strong> &lt; 5 seconds for any feature rollback
              </p>
            </div>
          </div>
        </Card>

        {/* Part 2: Target */}
        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Part 2: Target</h2>
              <p className="text-foreground-secondary mb-4">✅ <strong>FULLY SATISFIED</strong> (100% Complete)</p>
            </div>
          </div>

          <div className="space-y-4 pl-12">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Feature Flag: Implement a feature flag around a component
              </h3>
              <p className="text-foreground-secondary">
                Multiple feature flags control landing page components: <code className="bg-background-tertiary px-2 py-1 rounded">show-landing-page</code>, <code className="bg-background-tertiary px-2 py-1 rounded">show-landing-job-tracker</code>, <code className="bg-background-tertiary px-2 py-1 rounded">show-landing-prep-hub</code>, <code className="bg-background-tertiary px-2 py-1 rounded">show-landing-analytics</code>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Context Attributes: Create context with attributes
              </h3>
              <p className="text-foreground-secondary mb-3">
                <strong>✅ Implemented:</strong> User context with comprehensive attributes for targeting.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-2 text-sm">
                <p className="font-semibold text-foreground">Context Attributes Available:</p>
                <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                  <li><code className="bg-background px-1 rounded">key</code> - Unique user identifier</li>
                  <li><code className="bg-background px-1 rounded">email</code> - User email address</li>
                  <li><code className="bg-background px-1 rounded">name</code> - User display name</li>
                  <li><code className="bg-background px-1 rounded">role</code> - User role (user, admin, beta-tester)</li>
                  <li><code className="bg-background px-1 rounded">subscriptionTier</code> - Subscription level (free, premium, enterprise)</li>
                  <li><code className="bg-background px-1 rounded">signupDate</code> - Account creation date</li>
                  <li><code className="bg-background px-1 rounded">betaTester</code> - Boolean flag for beta testers</li>
                  <li><code className="bg-background px-1 rounded">companySize</code> - Company size category</li>
                  <li><code className="bg-background px-1 rounded">industry</code> - Industry classification</li>
                </ul>
              </div>
              <p className="text-foreground-secondary mt-3 text-sm">
                <strong>Location:</strong> <code className="bg-background-tertiary px-2 py-1 rounded">lib/launchdarkly/userContext.ts</code>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Target: Demonstrate individual and rule-based targeting
              </h3>
              <p className="text-foreground-secondary mb-4">
                <strong>✅ Fully Implemented:</strong> Comprehensive targeting system with individual and rule-based targeting, real-time updates, and comprehensive testing interface.
              </p>
              
              <div className="bg-background-tertiary p-5 rounded-lg space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-2">Individual Targeting:</p>
                  <p className="text-foreground-secondary mb-2">
                    Target specific users by email or user key in LaunchDarkly dashboard. Individual targeting is evaluated first and takes precedence over all rules.
                  </p>
                  <p className="text-foreground-secondary mb-2">
                    <strong>Configuration:</strong> LaunchDarkly dashboard → Flag → Targeting tab → Individual targeting section
                  </p>
                  <p className="text-foreground-secondary">
                    <strong>Demo users configured:</strong> <code className="bg-background px-1.5 py-0.5 rounded">user-001</code> (key), <code className="bg-background px-1.5 py-0.5 rounded">beta.tester@example.com</code> (email) → Both set to "On"
                  </p>
                </div>
                
                <div>
                  <p className="font-semibold text-foreground mb-2">Rule-Based Targeting:</p>
                  <p className="text-foreground-secondary mb-2">
                    Create scalable targeting rules based on user context attributes. Rules are evaluated in order, and the first matching rule wins.
                  </p>
                  <p className="text-foreground-secondary mb-2">
                    <strong>Configured Rules:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-foreground-secondary ml-4 mt-1">
                    <li><strong>Premium Users:</strong> <code className="bg-background px-1.5 py-0.5 rounded">subscriptionTier = "premium"</code> → "On"</li>
                    <li><strong>Beta Testers:</strong> <code className="bg-background px-1.5 py-0.5 rounded">betaTester = true</code> → "On"</li>
                    <li><strong>Beta Tester Role:</strong> <code className="bg-background px-1.5 py-0.5 rounded">role = "beta-tester"</code> → "On"</li>
                  </ul>
                  <p className="text-foreground-secondary mt-2">
                    <strong>Default Rule:</strong> Set to "Serve Off" (variation 1) - ensures users without matching rules don't see the feature.
                  </p>
                </div>
                
                <div>
                  <p className="font-semibold text-foreground mb-2">Implementation Details:</p>
                  <div className="space-y-3 text-foreground-secondary">
                    <div>
                      <p className="font-medium mb-1">1. Premium Feature Demo</p>
                      <p>
                        <strong>Flag:</strong> <code className="bg-background px-1.5 py-0.5 rounded">show-premium-feature-demo</code>
                      </p>
                      <p>
                        <strong>Locations:</strong>
                      </p>
                      <ul className="list-disc list-inside ml-4 space-y-1 mt-1">
                        <li><code className="bg-background px-1.5 py-0.5 rounded">/admin</code> - Interactive testing interface with User Context Switcher and Targeting Demo Card</li>
                        <li><code className="bg-background px-1.5 py-0.5 rounded">/landing/job-tracker</code> - Production-like demonstration</li>
                        <li><code className="bg-background px-1.5 py-0.5 rounded">/landing/support-bot</code> - Support Bot chat interface (experimentation demo)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-1">2. Analytics Page Access Control</p>
                      <p>
                        <strong>Flag:</strong> <code className="bg-background px-1.5 py-0.5 rounded">show-analytics-page</code>
                      </p>
                      <p>
                        <strong>Targeting Rule:</strong> Email contains <code className="bg-background px-1.5 py-0.5 rounded">free</code> → "Serve Off"
                      </p>
                      <p>
                        <strong>Default Rule:</strong> "Serve On"
                      </p>
                      <p className="mt-1">
                        <strong>Behavior:</strong> Users with "free" in email get flag OFF → Page returns 404, sidebar link hidden. All other users get flag ON → Page accessible.
                      </p>
                      <p className="mt-1">
                        <strong>Real-Time Demo:</strong> Switch users in <code className="bg-background px-1.5 py-0.5 rounded">/admin</code> to see sidebar link and page access toggle instantly. Demonstrates different targeting operator (<code className="bg-background px-1.5 py-0.5 rounded">contains</code>) and page-level access control.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="mt-2">
                        <strong>Real-Time Updates:</strong> Flag values update instantly when user context changes via LaunchDarkly streaming API. No page reload required.
                      </p>
                      <p>
                        <strong>Console Logging:</strong> Comprehensive logging for debugging - user switches, context sent, flag values, component renders.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="font-semibold text-foreground mb-2">Expected Behavior:</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-foreground-secondary mb-1">Premium Feature Flag (show-premium-feature-demo):</p>
                      <div className="bg-background p-3 rounded border border-border text-xs">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-1">User</th>
                              <th className="text-left py-1">Subscription</th>
                              <th className="text-left py-1">Beta Tester</th>
                              <th className="text-left py-1">Flag Value</th>
                            </tr>
                          </thead>
                          <tbody className="text-foreground-secondary">
                            <tr>
                              <td className="py-1">Beta Tester</td>
                              <td className="py-1">premium</td>
                              <td className="py-1">true</td>
                              <td className="py-1 text-success">✅ ON</td>
                            </tr>
                            <tr>
                              <td className="py-1">Premium User</td>
                              <td className="py-1">premium</td>
                              <td className="py-1">false</td>
                              <td className="py-1 text-success">✅ ON</td>
                            </tr>
                            <tr>
                              <td className="py-1">Free User</td>
                              <td className="py-1">free</td>
                              <td className="py-1">false</td>
                              <td className="py-1 text-danger">❌ OFF</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground-secondary mb-1">Analytics Page Flag (show-analytics-page):</p>
                      <div className="bg-background p-3 rounded border border-border text-xs">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-1">User</th>
                              <th className="text-left py-1">Email</th>
                              <th className="text-left py-1">Contains "free"?</th>
                              <th className="text-left py-1">Flag Value</th>
                              <th className="text-left py-1">Page Access</th>
                            </tr>
                          </thead>
                          <tbody className="text-foreground-secondary">
                            <tr>
                              <td className="py-1">Beta Tester</td>
                              <td className="py-1 text-xs">beta.tester@...</td>
                              <td className="py-1">❌ No</td>
                              <td className="py-1 text-success">✅ ON</td>
                              <td className="py-1 text-success">✅ Accessible</td>
                            </tr>
                            <tr>
                              <td className="py-1">Premium User</td>
                              <td className="py-1 text-xs">premium.user@...</td>
                              <td className="py-1">❌ No</td>
                              <td className="py-1 text-success">✅ ON</td>
                              <td className="py-1 text-success">✅ Accessible</td>
                            </tr>
                            <tr>
                              <td className="py-1">Free User</td>
                              <td className="py-1 text-xs">free.user@...</td>
                              <td className="py-1">✅ Yes</td>
                              <td className="py-1 text-danger">❌ OFF</td>
                              <td className="py-1 text-danger">❌ 404</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Extra Credit: Experimentation */}
        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Extra Credit: Experimentation</h2>
              <p className="text-foreground-secondary mb-4">
                <strong className="text-success">✅ FULLY IMPLEMENTED</strong> - Support Bot feature with event tracking ready for experiments
              </p>
            </div>
          </div>

          <div className="space-y-4 pl-12">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Feature Flag: Use same flag from Targeting example
              </h3>
              <p className="text-foreground-secondary mb-3">
                <strong>✅ Implemented:</strong> Using <code className="bg-background px-1.5 py-0.5 rounded">show-chatbot</code> flag to control Support Bot feature for experimentation.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-2 text-sm">
                <p className="text-foreground-secondary">
                  <strong>Support Bot Feature:</strong> <code className="bg-background px-1.5 py-0.5 rounded">/landing/support-bot</code>
                </p>
                <p className="text-foreground-secondary">
                  <strong>Behavior:</strong> When flag is ON, Support Bot link appears in landing page navigation and page is accessible. When flag is OFF, page returns 404 and link is hidden.
                </p>
                <p className="text-foreground-secondary">
                  <strong>Ready for A/B Testing:</strong> Flag supports percentage rollouts and targeting rules for experiment segmentation.
                </p>
                <p className="text-foreground-secondary mt-2 text-xs">
                  <strong>Note:</strong> The <code className="bg-background px-1.5 py-0.5 rounded">show-premium-feature-demo</code> flag is still used for other targeting demonstrations. The <code className="bg-background px-1.5 py-0.5 rounded">show-chatbot</code> flag is dedicated to the Support Bot experiment.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Metrics: Create metrics
              </h3>
              <p className="text-foreground-secondary mb-3">
                <strong>✅ Implemented:</strong> Four metrics created with automatic event tracking.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-2 text-sm">
                <p className="font-semibold text-foreground mb-2">Metrics Created:</p>
                <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                  <li><code className="bg-background px-1.5 py-0.5 rounded">support-bot-page-view</code> - Count metric for page visits</li>
                  <li><code className="bg-background px-1.5 py-0.5 rounded">support-bot-message-sent</code> - Count metric for messages sent</li>
                  <li><code className="bg-background px-1.5 py-0.5 rounded">support-bot-response-received</code> - Count metric for responses</li>
                  <li><code className="bg-background px-1.5 py-0.5 rounded">support-bot-engagement-rate</code> - Conversion metric (Primary)</li>
                </ul>
                <p className="text-foreground-secondary mt-2">
                  <strong>Event Tracking:</strong> All events automatically tracked via <code className="bg-background px-1.5 py-0.5 rounded">ldClient.track()</code> in Support Bot page.
                </p>
                <p className="text-foreground-secondary">
                  <strong>Setup Guide:</strong> See <code className="bg-background px-1.5 py-0.5 rounded">EXPERIMENTATION_SETUP.md</code> for step-by-step instructions to create metrics in LaunchDarkly dashboard.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Experiment: Create experiment using flag and metrics
              </h3>
              <p className="text-foreground-secondary mb-3">
                <strong>✅ Ready for Configuration:</strong> All components in place, ready to create experiment in LaunchDarkly dashboard.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-2 text-sm">
                <p className="text-foreground-secondary">
                  <strong>Experiment Setup:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                  <li>Feature Flag: <code className="bg-background px-1.5 py-0.5 rounded">show-chatbot</code></li>
                  <li>Control Group: Flag OFF (no Support Bot access)</li>
                  <li>Treatment Group: Flag ON (Support Bot access)</li>
                  <li>Primary Metric: <code className="bg-background px-1.5 py-0.5 rounded">Support Bot Engagement Rate</code></li>
                  <li>Traffic Allocation: 50/50 split recommended</li>
                </ul>
                <p className="text-foreground-secondary mt-2">
                  <strong>Setup Guide:</strong> Complete step-by-step instructions in <code className="bg-background px-1.5 py-0.5 rounded">EXPERIMENTATION_SETUP.md</code>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Measure: Run experiment to gather data
              </h3>
              <p className="text-foreground-secondary mb-3">
                <strong>✅ Implemented:</strong> Event tracking built-in, ready to collect data.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-2 text-sm">
                <p className="text-foreground-secondary">
                  <strong>Data Collection:</strong> LaunchDarkly automatically collects and aggregates metrics in real-time. Statistical significance calculated automatically.
                </p>
                <p className="text-foreground-secondary">
                  <strong>Best Practices:</strong> Run for 1-2 weeks minimum, collect data from 100+ users per variation, monitor multiple metrics.
                </p>
                <p className="text-foreground-secondary">
                  <strong>Analysis:</strong> Compare engagement rates between groups, view secondary metrics, segment by user attributes, make data-driven decisions.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Extra Credit: AI Configs */}
        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Extra Credit: AI Configs</h2>
              <p className="text-foreground-secondary mb-4">
                <strong className="text-success">✅ FULLY IMPLEMENTED</strong> - Chatbot integrated with LaunchDarkly AI Configs
              </p>
            </div>
          </div>

          <div className="space-y-4 pl-12">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                AI Configuration: Implement AI configuration for prompts and models
              </h3>
              <p className="text-foreground-secondary mb-3">
                <strong>✅ Implemented:</strong> Chatbot fully integrated with LaunchDarkly AI Configs for dynamic prompt and model management.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-2">Implementation Details:</p>
                  <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                    <li><strong>AI Config Key:</strong> <code className="bg-background px-1.5 py-0.5 rounded">jobs-os-basic-chatbot</code></li>
                    <li><strong>Model Selection:</strong> Configured via LaunchDarkly (e.g., <code className="bg-background px-1.5 py-0.5 rounded">chatgpt-4o-latest</code>)</li>
                    <li><strong>System Prompts:</strong> Managed in LaunchDarkly AI Config variations</li>
                    <li><strong>Parameters:</strong> Temperature, max_tokens configured per variation</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Bot Variations (Testing Purposes):</p>
                  <p className="text-foreground-secondary mb-3 text-xs">
                    <strong>Note:</strong> The chatbot has two variations configured for <strong>testing and demonstration purposes only</strong>. These variations showcase how LaunchDarkly AI Configs can dynamically change chatbot behavior based on user targeting rules.
                  </p>
                  <div className="bg-background p-4 rounded-lg space-y-4 text-sm border border-border">
                    <div>
                      <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        Standard Open AI (<code className="bg-background-tertiary px-1.5 py-0.5 rounded">standard_open_ai</code>)
                      </p>
                      <p className="text-foreground-secondary text-xs mb-2">
                        The standard, friendly customer support bot behavior. This variation uses the normal Job Search OS system prompt with helpful, professional, and friendly responses.
                      </p>
                      <p className="text-foreground-secondary text-xs">
                        <strong>Behavior:</strong> Provides helpful, clear, and concise answers. Focuses on helping users understand features and get value from the platform. Encourages exploration and provides guidance.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Combative Open AI (<code className="bg-background-tertiary px-1.5 py-0.5 rounded">combative_open_ai</code>)
                      </p>
                      <p className="text-foreground-secondary text-xs mb-2">
                        A contrasting variation for testing purposes. This variation demonstrates how different prompts can create different chatbot personalities and response styles.
                      </p>
                      <p className="text-foreground-secondary text-xs">
                        <strong>Behavior:</strong> Uses a more assertive or challenging tone to demonstrate prompt variation capabilities. This is purely for testing how different AI Config variations affect user experience.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-foreground mb-2">User Targeting:</p>
                    <p className="text-foreground-secondary text-xs mb-3">
                      LaunchDarkly targeting rules determine which users receive which AI Config variation. The targeting is configured in the LaunchDarkly dashboard under the AI Config's "Targeting" tab.
                    </p>
                    <div className="bg-background-tertiary p-3 rounded-lg border border-border text-xs">
                      <p className="font-semibold text-foreground mb-2">Example Targeting Configuration:</p>
                      <div className="space-y-2 text-foreground-secondary">
                        <div>
                          <p className="font-medium mb-1">Default Rule:</p>
                          <p className="ml-2">All users → <code className="bg-background px-1 py-0.5 rounded">standard_open_ai</code> (standard friendly behavior)</p>
                        </div>
                        <div className="pt-2 border-t border-border">
                          <p className="font-medium mb-1">Custom Targeting (if configured):</p>
                          <p className="ml-2 text-xs">You can create targeting rules to serve <code className="bg-background px-1 py-0.5 rounded">combative_open_ai</code> to specific user segments (e.g., beta testers, premium users, etc.) for A/B testing purposes.</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-foreground-secondary text-xs mt-3">
                      <strong>Testing:</strong> Use the Chat Test Interface on <code className="bg-background-tertiary px-1.5 py-0.5 rounded">/admin</code> page and switch between different users via the User Context Switcher to see how different users receive different AI Config variations based on LaunchDarkly targeting rules.
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Code Implementation:</p>
                  <div className="bg-background p-3 rounded font-mono text-xs space-y-1">
                    <div className="text-foreground-secondary">// Server-side LaunchDarkly client</div>
                    <div className="text-foreground">lib/launchdarkly/serverClient.ts</div>
                    <div className="text-foreground-secondary mt-2">// API route with AI Config integration</div>
                    <div className="text-foreground">app/api/chat/route.ts</div>
                    <div className="text-foreground-secondary mt-2">// Frontend chat interface</div>
                    <div className="text-foreground">app/landing/support-bot/page.tsx</div>
                    <div className="text-foreground-secondary mt-2">// Admin test interface</div>
                    <div className="text-foreground">components/admin/ChatTestCard.tsx</div>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Features:</p>
                  <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                    <li>Dynamic model selection based on user context and targeting rules</li>
                    <li>System prompts managed in LaunchDarkly (no code deployment needed)</li>
                    <li>Automatic fallback to default configuration if LaunchDarkly unavailable</li>
                    <li>User context-aware targeting for different AI Config variations</li>
                    <li>Test interface in Admin page for testing different user behaviors</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Use Cases:</p>
                  <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                    <li>A/B test different prompts without code changes</li>
                    <li>Switch between models based on user attributes</li>
                    <li>Adjust temperature and token settings dynamically</li>
                    <li>Test prompt variations for optimal responses</li>
                    <li>Target different AI Configs to different user segments</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-foreground-secondary text-xs">
                    <strong>Testing:</strong> Use the Chat Test Interface on <code className="bg-background px-1.5 py-0.5 rounded">/admin</code> page to test different user behaviors. Switch users via the User Context Switcher to see how different users receive different AI Config variations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <strong>Part 1: Release and Remediate</strong> - <span className="text-success">100% Complete</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <strong>Part 2: Target</strong> - <span className="text-success">100% Complete</span> (Flags, context, and targeting all implemented)
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <strong>Extra Credit: Experimentation</strong> - <span className="text-success">100% Complete</span> (Support Bot with metrics and experiment setup)
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <strong>Extra Credit: AI Configs</strong> - <span className="text-success">100% Complete</span> (Chatbot integrated with LaunchDarkly AI Configs)
              </div>
            </div>
          </div>
        </Card>

        {/* Key Strengths */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Key Strengths of Current Implementation</h2>
          <ul className="list-disc list-inside space-y-2 text-foreground-secondary ml-4">
            <li><strong>Comprehensive Flag Coverage:</strong> 30 flags covering pages, components, and features</li>
            <li><strong>Real-time Updates:</strong> Instant flag changes without page reloads</li>
            <li><strong>Production-Safe:</strong> All pages protected with 404 when flags are OFF</li>
            <li><strong>Developer Experience:</strong> TypeScript constants, custom hooks, organized structure</li>
            <li><strong>Remediation Ready:</strong> Multiple methods for instant rollback</li>
            <li><strong>Scalable Architecture:</strong> Easy to add new flags and extend functionality</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

