"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
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

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Targeted Feature Testing Example Behavior
              </h3>
              <p className="text-foreground-secondary mb-3">
                Try toggling these flags in LaunchDarkly dashboard to see instant behavior changes:
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-2">
                    <code className="bg-background px-2 py-1 rounded">show-analytics-page</code>
                  </p>
                  <p className="text-foreground-secondary mb-2">
                    <strong>Behavior Change:</strong> When toggled OFF, this flag will:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                    <li>Turn off access to the Analytics page - navigating to <code className="bg-background px-1.5 py-0.5 rounded">/analytics</code> will return a 404 error</li>
                    <li>Remove the "Analytics" button from the sidebar navigation - the link will disappear immediately</li>
                    <li>Update in real-time without requiring a page reload</li>
                  </ul>
                  <p className="text-foreground-secondary mt-2">
                    <strong>How to Test:</strong> Go to LaunchDarkly dashboard → Feature Flags → <code className="bg-background px-1.5 py-0.5 rounded">show-analytics-page</code> → Toggle OFF. Watch the sidebar update instantly and try accessing <code className="bg-background px-1.5 py-0.5 rounded">/analytics</code> to see the 404 page.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">
                    <code className="bg-background px-2 py-1 rounded">show-dashboard-metrics</code>
                  </p>
                  <p className="text-foreground-secondary mb-2">
                    <strong>Behavior Change:</strong> When toggled OFF, the metric cards section (Applications, Response Rate, Active Interviews, Follow-ups Due) will disappear from the dashboard page.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">
                    <code className="bg-background px-2 py-1 rounded">show-dashboard-hero</code>
                  </p>
                  <p className="text-foreground-secondary mb-2">
                    <strong>Behavior Change:</strong> When toggled OFF, the hero section at the top of the dashboard (with "Track applications, prep smarter..." heading) will be hidden.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">
                    <code className="bg-background px-2 py-1 rounded">show-jobs-page</code>
                  </p>
                  <p className="text-foreground-secondary mb-2">
                    <strong>Behavior Change:</strong> When toggled OFF, access to the Jobs Table page will be disabled (404 error) and the "Jobs Table" link will be removed from the sidebar.
                  </p>
                </div>
              </div>
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

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Targeted Feature Testing Example Behavior
              </h3>
              <p className="text-foreground-secondary mb-3">
                Test targeting behavior by toggling between different user types and observing flag-controlled elements:
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-2">Testing User Targeting:</p>
                  <p className="text-foreground-secondary mb-3">
                    Go to the <code className="bg-background px-1.5 py-0.5 rounded">/admin</code> page and use the <strong>User Context Switcher</strong> to toggle between different user types. Observe the following behavior changes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground-secondary ml-4">
                    <li>
                      <strong>Targeting Demo Card:</strong> The card in the admin page will change to show "FLAG ON" (green) or "FLAG OFF" (red) based on the active user. Premium users and Beta Testers will see "FLAG ON" with the premium feature content visible, while Free Users will see "FLAG OFF" with the hidden content message.
                    </li>
                    <li>
                      <strong>Analytics Sidebar Button:</strong> When switching to the <strong>Free User</strong> tier, the "Analytics" button will disappear from the sidebar navigation. This is due to the targeting rule on the <code className="bg-background px-1.5 py-0.5 rounded">show-analytics-page</code> flag that serves the flag OFF to users with "free" in their email address. Premium and Beta users will continue to see the Analytics link.
                    </li>
                    <li>
                      <strong>Real-Time Updates:</strong> All changes happen instantly without page reload - watch the sidebar and admin cards update in real-time as you switch users.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">
                    <code className="bg-background px-2 py-1 rounded">show-premium-feature-demo</code> Flag
                  </p>
                  <p className="text-foreground-secondary mb-2">
                    This flag controls the following elements throughout the application:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground-secondary ml-4">
                    <li>
                      <strong>Landing Page Support Bot Link:</strong> Shows/hides the "Support Bot" link in the landing page navigation bar (<code className="bg-background px-1.5 py-0.5 rounded">app/landing/layout.tsx</code>). When the flag is ON, the link appears. When OFF, the link is hidden.
                    </li>
                    <li>
                      <strong>Support Bot Page Access:</strong> Controls access to <code className="bg-background px-1.5 py-0.5 rounded">/landing/support-bot</code> (<code className="bg-background px-1.5 py-0.5 rounded">app/landing/support-bot/page.tsx</code>). When the flag is ON, the page is accessible. When OFF, accessing the page returns a 404 error.
                    </li>
                    <li>
                      <strong>Admin Page Targeting Demo Card:</strong> Controls the rendering of the premium feature card in the admin dashboard (<code className="bg-background px-1.5 py-0.5 rounded">components/admin/TargetingDemoCard.tsx</code>). When the flag is ON (for premium users/beta testers), the card shows the premium feature content. When OFF (for free users), it shows the "Premium Feature Hidden" message.
                    </li>
                    <li>
                      <strong>Job Tracker Landing Page Premium Section:</strong> Controls a premium feature section on the job tracker landing page (<code className="bg-background px-1.5 py-0.5 rounded">app/landing/job-tracker/page.tsx</code>). When the flag is ON, the premium section is visible. When OFF, the section is hidden.
                    </li>
                    <li>
                      <strong>Targeting Rules:</strong> The flag uses rule-based targeting to serve different values to different user segments. Premium users and beta testers receive the flag ON, while free users receive the flag OFF by default.
                    </li>
                  </ul>
                  <p className="text-foreground-secondary mt-2">
                    <strong>How to Test:</strong> Switch between users in the admin page User Context Switcher and observe:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4 mt-1">
                    <li>The Targeting Demo Card changing between ON/OFF states in the admin page</li>
                    <li>The Support Bot link appearing/disappearing in the landing page navigation (visit <code className="bg-background px-1.5 py-0.5 rounded">/landing</code> to see)</li>
                    <li>Access to <code className="bg-background px-1.5 py-0.5 rounded">/landing/support-bot</code> being granted or denied based on user context</li>
                    <li>The premium feature section on <code className="bg-background px-1.5 py-0.5 rounded">/landing/job-tracker</code> appearing or disappearing</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">
                    <code className="bg-background px-2 py-1 rounded">show-analytics-page</code> Flag (Targeting Example)
                  </p>
                  <p className="text-foreground-secondary mb-2">
                    This flag demonstrates targeting based on email attributes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                    <li><strong>Targeting Rule:</strong> Email contains <code className="bg-background px-1.5 py-0.5 rounded">free</code> → Flag serves OFF</li>
                    <li><strong>Default Rule:</strong> All other users → Flag serves ON</li>
                    <li><strong>Behavior:</strong> Free User (email contains "free") gets flag OFF → Analytics page returns 404, sidebar link hidden. Premium and Beta users get flag ON → Analytics accessible.</li>
                  </ul>
                  <p className="text-foreground-secondary mt-2">
                    <strong>How to Test:</strong> Switch to Free User in the admin page and observe the Analytics sidebar link disappearing. Try navigating to <code className="bg-background px-1.5 py-0.5 rounded">/analytics</code> to see the 404 page. Switch back to Premium or Beta User to see the link reappear and page access restored.
                  </p>
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
                <strong className="text-success">✅ FULLY IMPLEMENTED</strong> - Support Bot feature with event tracking and experiment configured
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
                <strong>✅ Implemented:</strong> Using <code className="bg-background px-1.5 py-0.5 rounded">show-premium-feature-demo</code> flag to control Support Bot feature for experimentation.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-2 text-sm">
                <p className="text-foreground-secondary">
                  <strong>Support Bot Feature:</strong> <code className="bg-background px-1.5 py-0.5 rounded">/landing/support-bot</code>
                </p>
                <p className="text-foreground-secondary">
                  <strong>Behavior:</strong> When flag is ON, Support Bot link appears in landing page navigation and page is accessible. When flag is OFF, page returns 404 and link is hidden.
                </p>
                <p className="text-foreground-secondary">
                  <strong>Experiment Configuration:</strong> Flag configured in LaunchDarkly experiment with 50% sample size and 50/50 split between On and Off variations.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Metrics: Create metrics
              </h3>
              <p className="text-foreground-secondary mb-3">
                <strong>✅ Implemented:</strong> Multiple metrics created with automatic event tracking across core app and landing pages.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-2 text-sm">
                <p className="font-semibold text-foreground mb-2">Primary Metric:</p>
                <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                  <li><code className="bg-background px-1.5 py-0.5 rounded">support-bot-response-received</code> - Count metric for chatbot responses (Primary)</li>
                </ul>
                <p className="font-semibold text-foreground mb-2 mt-3">Support Bot Metrics:</p>
                <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                  <li><code className="bg-background px-1.5 py-0.5 rounded">support-bot-page-view</code> - Count metric for page visits</li>
                  <li><code className="bg-background px-1.5 py-0.5 rounded">support-bot-message-sent</code> - Count metric for messages sent</li>
                </ul>
                <p className="font-semibold text-foreground mb-2 mt-3">Platform Engagement Metrics:</p>
                <p className="text-foreground-secondary mb-2">
                  To assess overall platform engagement, the experiment tracks user clicks and page views across the core application:
                </p>
                <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                  <li><code className="bg-background px-1.5 py-0.5 rounded">page-view-jobs-table</code> - Count metric for Jobs Table page views</li>
                  <li><code className="bg-background px-1.5 py-0.5 rounded">page-view-dashboard</code> - Count metric for Dashboard page views</li>
                  <li><code className="bg-background px-1.5 py-0.5 rounded">page-view-prep</code> - Count metric for Prep page views</li>
                  <li><code className="bg-background px-1.5 py-0.5 rounded">page-view-star-stories</code> - Count metric for STAR Stories page views</li>
                </ul>
                <p className="text-foreground-secondary mt-2">
                  <strong>Event Tracking:</strong> All events automatically tracked via <code className="bg-background px-1.5 py-0.5 rounded">ldClient.track()</code> throughout the application.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Experiment: Create experiment using flag and metrics
              </h3>
              <p className="text-foreground-secondary mb-3">
                <strong>✅ Configured:</strong> Experiment created in LaunchDarkly dashboard with comprehensive metrics and statistical analysis.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-foreground mb-2">Experiment Configuration:</p>
                  <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                    <li><strong>Feature Flag:</strong> <code className="bg-background px-1.5 py-0.5 rounded">show-premium-feature-demo</code> (controls Support Bot access)</li>
                    <li><strong>Randomize by:</strong> User</li>
                    <li><strong>Sample Size:</strong> 50% of users included in the experiment</li>
                    <li><strong>Variation Split:</strong> 50% On (Support Bot access) / 50% Off (no Support Bot access)</li>
                    <li><strong>Users Outside Experiment:</strong> Receive "On" variation by default</li>
                    <li><strong>Statistical Approach:</strong> Bayesian</li>
                    <li><strong>Threshold:</strong> 95% confidence level</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Hypothesis:</p>
                  <p className="text-foreground-secondary italic bg-background p-3 rounded border border-border">
                    "Users who engage with the chatbot testing feature will spend more time in the platform as more engaged users who are effectively having questions answered and staying in tools longer with more Interactivity"
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-2">Experiment Approach & Rationale:</p>
                  <p className="text-foreground-secondary mb-2">
                    <strong>Core Hypothesis:</strong> Users who have access to the Support Bot feature will demonstrate higher overall platform engagement compared to users without access.
                  </p>
                  <p className="text-foreground-secondary mb-2">
                    <strong>Sample Size Selection (50%):</strong> A 50% sample size was chosen to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                    <li>Provide sufficient statistical power for meaningful analysis</li>
                    <li>Allow for rapid data collection while maintaining a control group</li>
                    <li>Balance between getting enough users in the experiment and maintaining a representative control group</li>
                    <li>Enable faster decision-making on feature impact</li>
                  </ul>
                  <p className="text-foreground-secondary mb-2 mt-3">
                    <strong>Metrics Strategy:</strong> The experiment tracks multiple engagement metrics to assess overall platform usage:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                    <li><strong>Direct Bot Engagement:</strong> Page views, messages sent, and responses received measure direct interaction with the Support Bot feature</li>
                    <li><strong>Platform-Wide Engagement:</strong> Page view metrics across core application pages (Jobs Table, Dashboard, Prep, STAR Stories) measure whether chatbot access correlates with increased overall platform usage</li>
                    <li><strong>Primary Metric:</strong> Support Bot Response Received serves as the primary metric, indicating users are not just visiting but actively engaging with the feature</li>
                  </ul>
                  <p className="text-foreground-secondary mb-2 mt-3">
                    <strong>Assessment Approach:</strong> By tracking user clicks and page views across both the landing page and core application, the experiment can assess:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                    <li>Whether chatbot access leads to increased time spent in the platform</li>
                    <li>If users with chatbot access explore more features (measured by page views across different sections)</li>
                    <li>Correlation between chatbot engagement and overall platform interactivity</li>
                    <li>Whether the chatbot effectively answers questions, leading to users staying longer and using more tools</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Measure: Run experiment to gather data
              </h3>
              <p className="text-foreground-secondary mb-3">
                <strong>✅ Implemented:</strong> Event tracking built-in, experiment configured and ready to collect data.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-2 text-sm">
                <p className="text-foreground-secondary">
                  <strong>Data Collection:</strong> LaunchDarkly automatically collects and aggregates metrics in real-time. Statistical significance calculated automatically using Bayesian approach with 95% credible interval.
                </p>
                <p className="text-foreground-secondary">
                  <strong>Analysis Capabilities:</strong> The experiment configuration allows for:
                </p>
                <ul className="list-disc list-inside space-y-1 text-foreground-secondary ml-4">
                  <li>Real-time comparison of engagement metrics between treatment (On) and control (Off) groups</li>
                  <li>Assessment of whether chatbot access correlates with increased platform-wide page views</li>
                  <li>Evaluation of user interactivity and time spent in the platform</li>
                  <li>Data-driven decisions on feature impact and user engagement</li>
                </ul>
                <p className="text-foreground-secondary mt-2">
                  <strong>Best Practices:</strong> Run for 1-2 weeks minimum, collect data from sufficient users per variation, monitor both primary and secondary metrics to understand full impact.
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
                  <p className="font-semibold text-foreground mb-2">Bot Variations (Product Knowledge Demonstration):</p>
                  <p className="text-foreground-secondary mb-3 text-xs">
                    Two variations configured to demonstrate LaunchDarkly AI Configs capability to deploy different versions of prompted language model builds. This is a product knowledge demonstration, not a real business case.
                  </p>
                  <div className="bg-background p-4 rounded-lg space-y-3 text-sm border border-border">
                    <div>
                      <p className="font-semibold text-foreground mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                        Standard Open AI (<code className="bg-background-tertiary px-1.5 py-0.5 rounded">standard_open_ai</code>)
                      </p>
                      <p className="text-foreground-secondary text-xs">
                        Friendly, helpful customer support bot behavior. Default variation served to all users except beta testers.
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Grumpy Sarcastic Open AI (<code className="bg-background-tertiary px-1.5 py-0.5 rounded">combative_open_ai</code>)
                      </p>
                      <p className="text-foreground-secondary text-xs">
                        Grumpy, sarcastic tone variation. Configured to demonstrate AI Config targeting - beta testers receive this variation via individual targeting rule. Intentionally contrasting to clearly show technical capability.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-foreground mb-2">Targeting Configuration:</p>
                    <div className="bg-background-tertiary p-3 rounded-lg border border-border text-xs">
                      <p className="font-medium text-foreground mb-2">Individual Targeting:</p>
                      <p className="text-foreground-secondary mb-2">Beta Tester (<code className="bg-background px-1 py-0.5 rounded">user-001</code>) → <code className="bg-background px-1 py-0.5 rounded">combative_open_ai</code></p>
                      <p className="font-medium text-foreground mb-2 mt-3">Default Rule:</p>
                      <p className="text-foreground-secondary">All other users → <code className="bg-background px-1 py-0.5 rounded">standard_open_ai</code></p>
                    </div>
                    <p className="text-foreground-secondary text-xs mt-3">
                      <strong>Testing:</strong> Switch to Beta Tester in <code className="bg-background-tertiary px-1.5 py-0.5 rounded">/admin</code> User Context Switcher to see grumpy chatbot. Switch to other users to see standard friendly chatbot.
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

        {/* Extra Credit: Integrations */}
        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">Extra Credit: Integrations</h2>
              <p className="text-foreground-secondary mb-4">
                <strong className="text-success">✅ FULLY IMPLEMENTED</strong> - Chatbot integration for experiment tracking
              </p>
            </div>
          </div>

          <div className="space-y-4 pl-12">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Experiment Tracking Integration
              </h3>
              <p className="text-foreground-secondary mb-3">
                <strong>✅ Implemented:</strong> Set up a chatbot integration to track experiment beginnings and endings automatically.
              </p>
              <div className="bg-background-tertiary p-4 rounded-lg space-y-3 text-sm">
                <p className="text-foreground-secondary">
                  A chatbot integration has been configured to monitor experiment lifecycle events and automatically track when experiments begin and end. This provides real-time notifications and automated monitoring of experiment status without requiring manual intervention.
                </p>
                <div className="bg-background-secondary/50 p-4 rounded-lg border border-border">
                  <p className="text-foreground-secondary font-semibold mb-2">Setup Process:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-foreground-secondary">
                    <li>Navigate to LaunchDarkly Integrations → Webhooks</li>
                    <li>Create a new webhook and configure it to listen for experiment lifecycle events (experiment.started, experiment.stopped)</li>
                    <li>In Slack, create a new Slack App and generate a webhook URL</li>
                    <li>Copy the Slack webhook URL and paste it into the LaunchDarkly webhook configuration</li>
                    <li>Test the integration by starting/stopping an experiment to verify Slack notifications</li>
                  </ol>
                </div>
                <div className="bg-background p-4 rounded-lg border border-border">
                  <div className="relative w-1/2 mx-auto rounded-lg overflow-hidden border border-border">
                    <Image
                      src="/images/experiment-chatbot-integration.png"
                      alt="Experiment Chatbot Integration Screenshot"
                      width={1200}
                      height={800}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
                <p className="text-foreground-secondary mt-3">
                  <strong>Benefits:</strong> Automated experiment monitoring, real-time notifications, and seamless integration with LaunchDarkly experiment lifecycle events.
                </p>
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

