"use client";

import { notFound } from "next/navigation";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { FLAG_KEYS } from "@/lib/launchdarkly/flags";
import { Card } from "@/components/ui/Card";
import { 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Settings, 
  FileText, 
  MessageCircle, 
  Target, 
  Zap, 
  Sparkles,
  BookOpen,
  Code,
  Rocket,
  Users,
  GitBranch,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const tableOfContents = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "requirements", label: "Requirements", icon: CheckCircle2 },
  { id: "implementation", label: "Implementation Details", icon: FileText },
  { id: "testing", label: "Testing Guide", icon: Rocket },
  { id: "features", label: "Features", icon: Sparkles },
  { id: "files", label: "Key Files", icon: Code },
];

export default function ReadmePage() {
  const canAccess = useFeatureFlag(FLAG_KEYS.SHOW_ADMIN_PAGE, true);
  const [activeSection, setActiveSection] = useState("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = tableOfContents.map((item) => item.id);
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!canAccess) {
    return notFound();
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:block w-64 bg-background-secondary border-r border-border sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-1">Documentation</h2>
            <p className="text-xs text-foreground-secondary">Project Walkthrough</p>
          </div>
          
          <nav className="space-y-1">
            {tableOfContents.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                    isActive
                      ? "bg-primary text-white"
                      : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-border">
            <Link
              href="/admin/assignment-satisfaction"
              className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Assignment Docs</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 lg:px-12">
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <BookOpen className="w-3 h-3" />
            Documentation
          </div>
          <h1 className="text-4xl font-bold mb-4">Project Walkthrough</h1>
          <p className="text-lg text-foreground-secondary">
            A comprehensive guide to what was built and where to test each feature
          </p>
        </header>

        {/* Overview Section */}
        <section id="overview" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" />
            Overview
          </h2>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-foreground-secondary mb-6">
              This project started as a pre-built Career Stack application - a comprehensive job tracking and management 
              platform built with Next.js 14, TypeScript, and Tailwind CSS. The application was then converted and enhanced 
              to demonstrate advanced LaunchDarkly integration by leveraging the LaunchDarkly SDK and CLI tools.
            </p>

            <Card className="p-6 bg-primary/5 border-primary/20 my-6">
              <h3 className="text-lg font-semibold mb-3">Conversion Process</h3>
              <p className="text-sm text-foreground-secondary mb-4">
                The original application's features, page access controls, component visibility, and functionality were 
                systematically converted to use the LaunchDarkly ecosystem. This conversion involved:
              </p>
              <ul className="space-y-2 text-sm text-foreground-secondary list-disc list-inside">
                <li>Wrapping page routes with feature flag checks to control access</li>
                <li>Converting component visibility logic to use LaunchDarkly flags</li>
                <li>Replacing hardcoded feature toggles with LaunchDarkly feature flags</li>
                <li>Integrating LaunchDarkly React Client SDK for real-time flag updates</li>
                <li>Setting up LaunchDarkly Node.js Server SDK for server-side flag evaluation</li>
                <li>Configuring user context attributes for targeting and personalization</li>
                <li>Implementing AI Configs integration for dynamic chatbot management</li>
              </ul>
            </Card>

            <p className="text-lg text-foreground-secondary mb-6">
              The result is a production-ready application that showcases comprehensive feature flag management,
              user targeting, experimentation capabilities, and AI Configs integration - all managed through the 
              LaunchDarkly platform while maintaining the original application's functionality and user experience.
            </p>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              <Card className="p-6 border-l-4 border-l-primary">
                <div className="flex items-center gap-3 mb-2">
                  <GitBranch className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">31 Feature Flags</h3>
                </div>
                <p className="text-sm text-foreground-secondary">
                  Controlling page access, UI components, and core features throughout the application
                </p>
              </Card>

              <Card className="p-6 border-l-4 border-l-success">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-success" />
                  <h3 className="text-lg font-semibold">Real-Time Updates</h3>
                </div>
                <p className="text-sm text-foreground-secondary">
                  Instant flag changes without page reloads via LaunchDarkly streaming API
                </p>
              </Card>

              <Card className="p-6 border-l-4 border-l-primary">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">User Targeting</h3>
                </div>
                <p className="text-sm text-foreground-secondary">
                  Individual and rule-based targeting with 9 user context attributes
                </p>
              </Card>

              <Card className="p-6 border-l-4 border-l-purple-500">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold">AI Configs</h3>
                </div>
                <p className="text-sm text-foreground-secondary">
                  Dynamic chatbot prompts and models managed via LaunchDarkly
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section id="requirements" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-success" />
            Requirements Checklist
          </h2>

          <div className="space-y-6">
            <Card className="p-6 border-l-4 border-l-success">
              <h3 className="text-xl font-semibold mb-4">Part 1: Release and Remediate ✅</h3>
              <ul className="space-y-3 text-foreground-secondary">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Feature Flags:</strong> 31 flags implemented across pages, components, and features
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Instant Updates:</strong> Real-time flag changes via LaunchDarkly streaming API
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Remediation:</strong> Multiple rollback methods (Dashboard, CLI, Admin page)
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-success">
              <h3 className="text-xl font-semibold mb-4">Part 2: Target ✅</h3>
              <ul className="space-y-3 text-foreground-secondary">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Feature Flags:</strong> Flags around components and pages
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Context Attributes:</strong> 9 user attributes for targeting
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Targeting:</strong> Individual and rule-based targeting implemented
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-l-4 border-l-success">
              <h3 className="text-xl font-semibold mb-4">Extra Credit ✅</h3>
              <ul className="space-y-3 text-foreground-secondary">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Experimentation:</strong> Support Bot with metrics and experiment setup
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">AI Configs:</strong> Chatbot integrated with LaunchDarkly AI Configs
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Implementation Details Section */}
        <section id="implementation" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary" />
            Implementation Details
          </h2>

          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-primary" />
                Part 1: Release and Remediate
              </h3>
              
              <div className="space-y-4 text-foreground-secondary">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What Was Built</h4>
                  <p className="text-sm mb-3">
                    A comprehensive feature flag system covering 31 flags that control page access, component visibility, 
                    and feature functionality throughout the application. Each flag is integrated at the code level using 
                    LaunchDarkly's React Client SDK, which provides real-time flag updates via WebSocket connections.
                  </p>
                  <p className="text-sm mb-3">
                    The application implements multiple remediation methods, allowing instant rollback of features through 
                    the LaunchDarkly dashboard, CLI tools, or the built-in admin interface. All flags are evaluated in 
                    real-time, meaning changes in LaunchDarkly are reflected immediately in the application without 
                    requiring code deployments or page reloads.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Maintained in LaunchDarkly Interface</h4>
                  <ul className="text-sm space-y-2 list-disc list-inside ml-4">
                    <li><strong>Flag Configuration:</strong> All 31 flags are created and managed in the LaunchDarkly dashboard. Each flag has a unique key (e.g., <code className="bg-background-tertiary px-1.5 py-0.5 rounded">show-dashboard-page</code>), default values, and targeting rules.</li>
                    <li><strong>Flag States:</strong> Flags can be toggled ON/OFF globally or per environment (Production, Test) directly in the LaunchDarkly dashboard.</li>
                    <li><strong>Targeting Rules:</strong> Complex targeting rules can be configured in LaunchDarkly to serve different flag values to different user segments based on attributes like subscription tier, role, beta tester status, etc.</li>
                    <li><strong>Percentage Rollouts:</strong> Flags support gradual rollouts, allowing you to serve a flag to a percentage of users (e.g., 10%, 50%, 100%) for safe feature releases.</li>
                    <li><strong>Flag History:</strong> All flag changes are logged in LaunchDarkly, providing an audit trail of when flags were changed, by whom, and what the previous values were.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Direct in Application</h4>
                  <ul className="text-sm space-y-2 list-disc list-inside ml-4">
                    <li><strong>Flag Evaluation:</strong> The application uses the <code className="bg-background-tertiary px-1.5 py-0.5 rounded">useFeatureFlag()</code> hook to evaluate flags in React components. Flags are evaluated client-side using the LaunchDarkly React SDK.</li>
                    <li><strong>Real-Time Updates:</strong> The LaunchDarkly React SDK establishes a WebSocket connection to LaunchDarkly's streaming API. When a flag is changed in the dashboard, the change is pushed to all connected clients instantly.</li>
                    <li><strong>Page Protection:</strong> Pages use flag checks with <code className="bg-background-tertiary px-1.5 py-0.5 rounded">notFound()</code> to return 404 errors when flags are OFF, preventing unauthorized access.</li>
                    <li><strong>Component Visibility:</strong> UI components conditionally render based on flag values. For example, the sidebar navigation items appear/disappear based on flag states.</li>
                    <li><strong>Admin Dashboard:</strong> The <code className="bg-background-tertiary px-1.5 py-0.5 rounded">/admin</code> page provides a real-time view of all flags, their current values, and allows testing flag changes locally.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">How to Interact</h4>
                  <p className="text-sm mb-2">
                    <strong>In LaunchDarkly Dashboard:</strong> Navigate to Feature Flags → select any flag → toggle ON/OFF or configure targeting rules. Changes take effect immediately in the application.
                  </p>
                  <p className="text-sm mb-2">
                    <strong>In Application:</strong> Visit <Link href="/admin" className="text-primary hover:underline">/admin</Link> to see all flags and their real-time status. Toggle flags locally to test changes before committing them in LaunchDarkly.
                  </p>
                  <p className="text-sm">
                    <strong>Remediation:</strong> If a flag causes issues, immediately toggle it OFF in LaunchDarkly dashboard or use the LaunchDarkly CLI: <code className="bg-background-tertiary px-1.5 py-0.5 rounded">ld-flag toggle &lt;flag-key&gt; off</code>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Part 2: Target
              </h3>
              
              <div className="space-y-4 text-foreground-secondary">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What Was Built</h4>
                  <p className="text-sm mb-3">
                    A comprehensive user targeting system that allows different users to receive different flag values 
                    based on their attributes. The application defines 9 user context attributes (key, email, name, role, 
                    subscriptionTier, signupDate, betaTester, companySize, industry) that are sent to LaunchDarkly 
                    for flag evaluation.
                  </p>
                  <p className="text-sm mb-3">
                    The targeting system supports both individual targeting (targeting specific users by key) and 
                    rule-based targeting (targeting users based on attribute conditions like "subscriptionTier equals premium" 
                    or "betaTester equals true"). This allows for sophisticated user segmentation and personalized experiences.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Maintained in LaunchDarkly Interface</h4>
                  <ul className="text-sm space-y-2 list-disc list-inside ml-4">
                    <li><strong>Targeting Rules:</strong> In LaunchDarkly dashboard, each flag can have multiple targeting rules configured. Rules can target individual users by key or groups of users by attribute conditions.</li>
                    <li><strong>Individual Targeting:</strong> Specific users can be targeted by adding their user key to a flag's individual targeting list. For example, you can serve a flag ON to user-001 and OFF to user-002.</li>
                    <li><strong>Rule-Based Targeting:</strong> Rules can be created using attribute conditions. Examples: "subscriptionTier equals premium", "betaTester equals true", "role equals beta-tester". Multiple conditions can be combined with AND/OR logic.</li>
                    <li><strong>Rule Priority:</strong> Rules are evaluated in order. The first matching rule determines the flag value. Individual targeting takes precedence over rule-based targeting.</li>
                    <li><strong>Default Rule:</strong> A default rule serves all users who don't match any specific targeting rules. This is typically set to serve the flag OFF to all users by default.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Direct in Application</h4>
                  <ul className="text-sm space-y-2 list-disc list-inside ml-4">
                    <li><strong>User Context:</strong> The application maintains user context in <code className="bg-background-tertiary px-1.5 py-0.5 rounded">lib/launchdarkly/userContext.ts</code>. Three demo users are defined: Beta Tester (premium, betaTester: true), Premium User (premium, betaTester: false), and Free User (free, betaTester: false).</li>
                    <li><strong>Context Switching:</strong> The <code className="bg-background-tertiary px-1.5 py-0.5 rounded">UserContextSwitcher</code> component on <code className="bg-background-tertiary px-1.5 py-0.5 rounded">/admin</code> allows switching between demo users. When a user is selected, the LaunchDarkly client is updated with <code className="bg-background-tertiary px-1.5 py-0.5 rounded">ldClient.identify()</code>.</li>
                    <li><strong>Flag Evaluation:</strong> When flags are evaluated, the current user context is sent to LaunchDarkly. LaunchDarkly evaluates targeting rules against this context and returns the appropriate flag value.</li>
                    <li><strong>Real-Time Updates:</strong> When user context changes, all flags are re-evaluated immediately. Components that depend on flags automatically re-render with new values.</li>
                    <li><strong>Visual Feedback:</strong> The admin dashboard shows which user is active and displays flag values for that user. The sidebar navigation updates to show/hide links based on the active user's flag values.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">How to Interact</h4>
                  <p className="text-sm mb-2">
                    <strong>In LaunchDarkly Dashboard:</strong> Go to Feature Flags → select a flag → Targeting tab → Add rules or individual targets. Configure conditions like "subscriptionTier equals premium" to serve flag ON to premium users.
                  </p>
                  <p className="text-sm mb-2">
                    <strong>In Application:</strong> Use the User Context Switcher on <Link href="/admin" className="text-primary hover:underline">/admin</Link> to switch between demo users. Watch how flag values change in real-time. Try accessing <Link href="/analytics" className="text-primary hover:underline">/analytics</Link> as different users - Free User gets 404, Premium User can access.
                  </p>
                  <p className="text-sm">
                    <strong>Testing Targeting:</strong> The Targeting Demo Card on <code className="bg-background-tertiary px-1.5 py-0.5 rounded">/admin</code> shows how the <code className="bg-background-tertiary px-1.5 py-0.5 rounded">show-premium-feature-demo</code> flag changes based on user attributes. Switch users to see different flag values.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Extra Credit: Experimentation
              </h3>
              
              <div className="space-y-4 text-foreground-secondary">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What Was Built</h4>
                  <p className="text-sm mb-3">
                    A Support Bot feature with comprehensive event tracking ready for A/B testing experiments. The chatbot 
                    is integrated with LaunchDarkly feature flags and tracks four key metrics: page views, messages sent, 
                    responses received, and engagement rate (conversion from page view to message sent).
                  </p>
                  <p className="text-sm mb-3">
                    The experimentation system is designed to measure the impact of the Support Bot feature by comparing 
                    users who have access (flag ON) versus users who don't (flag OFF). All events are automatically 
                    tracked and sent to LaunchDarkly for experiment analysis.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Maintained in LaunchDarkly Interface</h4>
                  <ul className="text-sm space-y-2 list-disc list-inside ml-4">
                    <li><strong>Metrics:</strong> Four metrics are configured in LaunchDarkly Metrics section: <code className="bg-background-tertiary px-1.5 py-0.5 rounded">support-bot-page-view</code> (count), <code className="bg-background-tertiary px-1.5 py-0.5 rounded">support-bot-message-sent</code> (count), <code className="bg-background-tertiary px-1.5 py-0.5 rounded">support-bot-response-received</code> (count), and <code className="bg-background-tertiary px-1.5 py-0.5 rounded">support-bot-engagement-rate</code> (conversion metric).</li>
                    <li><strong>Experiments:</strong> Experiments can be created in LaunchDarkly Experiments section. An experiment compares the control group (flag OFF) vs treatment group (flag ON) and measures the impact on the defined metrics.</li>
                    <li><strong>Experiment Configuration:</strong> Experiments use the <code className="bg-background-tertiary px-1.5 py-0.5 rounded">show-premium-feature-demo</code> flag (or a dedicated chatbot flag) and automatically use existing targeting rules for user segmentation.</li>
                    <li><strong>Results Analysis:</strong> LaunchDarkly provides statistical analysis of experiment results, showing which variation performed better and whether results are statistically significant.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Direct in Application</h4>
                  <ul className="text-sm space-y-2 list-disc list-inside ml-4">
                    <li><strong>Event Tracking:</strong> Events are tracked using <code className="bg-background-tertiary px-1.5 py-0.5 rounded">ldClient.track()</code> in the Support Bot page (<code className="bg-background-tertiary px-1.5 py-0.5 rounded">app/landing/support-bot/page.tsx</code>). Events include user context for proper segmentation.</li>
                    <li><strong>Page View Tracking:</strong> When a user visits the Support Bot page, a <code className="bg-background-tertiary px-1.5 py-0.5 rounded">support-bot-page-view</code> event is automatically tracked.</li>
                    <li><strong>Message Tracking:</strong> When a user sends a message, a <code className="bg-background-tertiary px-1.5 py-0.5 rounded">support-bot-message-sent</code> event is tracked with the message content.</li>
                    <li><strong>Response Tracking:</strong> When the bot responds, a <code className="bg-background-tertiary px-1.5 py-0.5 rounded">support-bot-response-received</code> event is tracked with response metadata.</li>
                    <li><strong>Engagement Rate:</strong> The engagement rate metric is automatically calculated as the conversion from page view to message sent, providing a measure of user engagement.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">How to Interact</h4>
                  <p className="text-sm mb-2">
                    <strong>In LaunchDarkly Dashboard:</strong> Go to Metrics → Create the four metrics mentioned above. Then go to Experiments → Create experiment → Select the chatbot flag → Add metrics → Launch experiment.
                  </p>
                  <p className="text-sm mb-2">
                    <strong>In Application:</strong> Visit <Link href="/landing/support-bot" className="text-primary hover:underline">/landing/support-bot</Link> to interact with the chatbot. All events are automatically tracked. Check LaunchDarkly Experiments section to see real-time experiment data.
                  </p>
                  <p className="text-sm">
                    <strong>Testing:</strong> Use the Chat Test Interface on <Link href="/admin" className="text-primary hover:underline">/admin</Link> to test the chatbot with different user contexts. Switch users to see how different segments interact with the bot.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Extra Credit: AI Configs
              </h3>
              
              <div className="space-y-4 text-foreground-secondary">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">What Was Built</h4>
                  <p className="text-sm mb-3">
                    A chatbot system fully integrated with LaunchDarkly AI Configs, allowing dynamic management of AI model 
                    selection, system prompts, temperature settings, and max tokens without code changes. The chatbot uses 
                    OpenAI's API but receives its configuration from LaunchDarkly AI Configs, enabling A/B testing of 
                    different prompts and models.
                  </p>
                  <p className="text-sm mb-3">
                    Two distinct chatbot variations are configured for testing: "Standard Open AI" (helpful, friendly) and 
                    "Combative Open AI" (assertive, challenging). These variations demonstrate how AI Configs can drastically 
                    alter user experience based on targeting rules.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Maintained in LaunchDarkly Interface</h4>
                  <ul className="text-sm space-y-2 list-disc list-inside ml-4">
                    <li><strong>AI Config:</strong> An AI Config named <code className="bg-background-tertiary px-1.5 py-0.5 rounded">jobs-os-basic-chatbot</code> is created in LaunchDarkly AI Configs section. This config contains model selection, prompts, and parameters.</li>
                    <li><strong>Variations:</strong> Multiple variations are configured: <code className="bg-background-tertiary px-1.5 py-0.5 rounded">standard_open_ai</code> (default, helpful) and <code className="bg-background-tertiary px-1.5 py-0.5 rounded">combative_open_ai</code> (testing, assertive). Each variation has its own system prompt, model settings, temperature, and max tokens.</li>
                    <li><strong>Targeting Rules:</strong> AI Config variations can be targeted to different user segments. For example, beta testers might receive the combative variation while regular users receive the standard variation.</li>
                    <li><strong>Model Configuration:</strong> Models are configured per variation (e.g., gpt-4o-mini). Temperature and max_tokens are set as parameters within each variation.</li>
                    <li><strong>Prompt Management:</strong> System prompts are managed entirely in LaunchDarkly. Changes to prompts take effect immediately without code deployments.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Direct in Application</h4>
                  <ul className="text-sm space-y-2 list-disc list-inside ml-4">
                    <li><strong>Server-Side Integration:</strong> The API route (<code className="bg-background-tertiary px-1.5 py-0.5 rounded">app/api/chat/route.ts</code>) uses LaunchDarkly Node.js Server SDK to fetch AI Configs. The server client is initialized in <code className="bg-background-tertiary px-1.5 py-0.5 rounded">lib/launchdarkly/serverClient.ts</code>.</li>
                    <li><strong>AI Config Retrieval:</strong> When a chat request is made, the API calls <code className="bg-background-tertiary px-1.5 py-0.5 rounded">ldClient.variation('jobs-os-basic-chatbot', ldContext, null)</code> to get the AI Config for the current user.</li>
                    <li><strong>Dynamic Configuration:</strong> The AI Config response contains model ID, parameters (temperature, max_tokens), and messages array (including system prompt). These are used to configure the OpenAI API call.</li>
                    <li><strong>User Context:</strong> User context is sent from the frontend to the API route, allowing LaunchDarkly to evaluate targeting rules and serve the appropriate AI Config variation.</li>
                    <li><strong>Fallback Logic:</strong> If LaunchDarkly is unavailable or AI Config is not found, the application falls back to default values (gpt-4o-mini, temperature 0.7, default system prompt).</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">How to Interact</h4>
                  <p className="text-sm mb-2">
                    <strong>In LaunchDarkly Dashboard:</strong> Go to AI Configs → <code className="bg-background-tertiary px-1.5 py-0.5 rounded">jobs-os-basic-chatbot</code> → Edit variations → Modify system prompts, models, or parameters. Configure targeting rules to serve different variations to different user segments.
                  </p>
                  <p className="text-sm mb-2">
                    <strong>In Application:</strong> Use the Chat Test Interface on <Link href="/admin" className="text-primary hover:underline">/admin</Link> to test different AI Config variations. Switch users (especially Beta Tester) to see different chatbot behaviors. Visit <Link href="/landing/support-bot" className="text-primary hover:underline">/landing/support-bot</Link> for the production-like interface.
                  </p>
                  <p className="text-sm">
                    <strong>Testing Variations:</strong> Configure targeting rules in LaunchDarkly so Beta Tester receives <code className="bg-background-tertiary px-1.5 py-0.5 rounded">combative_open_ai</code> and other users receive <code className="bg-background-tertiary px-1.5 py-0.5 rounded">standard_open_ai</code>. Switch users in the admin panel and send messages to observe different chatbot personalities.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Testing Guide Section */}
        <section id="testing" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Rocket className="w-7 h-7 text-primary" />
            Testing Guide
          </h2>

          <div className="space-y-8">
            {/* Quick Start */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
              <ol className="space-y-4">
                {[
                  {
                    step: "Start at Admin Dashboard",
                    description: "Go to /admin to see all feature flags and testing tools",
                    link: "/admin",
                  },
                  {
                    step: "Test User Targeting",
                    description: "Use the User Context Switcher to switch between users. Watch how flags change based on user attributes",
                    link: "/admin",
                  },
                  {
                    step: "Test AI Configs",
                    description: "Use the Chat Test Interface on /admin. Switch users and send messages to see different AI Config variations",
                    link: "/admin",
                  },
                  {
                    step: "Test Real-Time Updates",
                    description: "Toggle any flag in LaunchDarkly dashboard or admin page. Watch UI update instantly without page reload",
                    link: "/admin",
                  },
                  {
                    step: "Review Detailed Documentation",
                    description: "See Assignment Docs for comprehensive requirement satisfaction details",
                    link: "/admin/assignment-satisfaction",
                  },
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold mb-1">{item.step}</p>
                      <p className="text-sm text-foreground-secondary mb-2">{item.description}</p>
                      <Link href={item.link} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                        {item.link}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Feature Testing */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Feature Testing</h3>
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Settings className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold">Feature Flags & Admin Dashboard</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <Link href="/admin" className="font-medium text-primary hover:underline">
                          /admin
                        </Link>
                        <p className="text-sm text-foreground-secondary mt-1">
                          View all 31 feature flags, their status, and toggle them. Includes User Context Switcher and Chat Test Interface.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold">User Targeting & Context</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <Link href="/admin" className="font-medium text-primary hover:underline">
                          /admin → User Context Switcher
                        </Link>
                        <p className="text-sm text-foreground-secondary mt-1">
                          Switch between demo users (Beta Tester, Premium User, Free User) to test targeting rules.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <Link href="/analytics" className="font-medium text-primary hover:underline">
                          /analytics
                        </Link>
                        <p className="text-sm text-foreground-secondary mt-1">
                          Test page-level targeting: Free users get 404, premium users can access.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h4 className="text-lg font-semibold">AI Configs & Chatbot</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <Link href="/admin" className="font-medium text-primary hover:underline">
                          /admin → Chat Test Interface
                        </Link>
                        <p className="text-sm text-foreground-secondary mt-1">
                          Test chatbot with different user contexts. Switch users to see different AI Config variations.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <Link href="/landing/support-bot" className="font-medium text-primary hover:underline">
                          /landing/support-bot
                        </Link>
                        <p className="text-sm text-foreground-secondary mt-1">
                          Production-like Support Bot interface using LaunchDarkly AI Configs.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold">Experimentation</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <Link href="/landing/support-bot" className="font-medium text-primary hover:underline">
                          /landing/support-bot
                        </Link>
                        <p className="text-sm text-foreground-secondary mt-1">
                          Support Bot feature with event tracking ready for experiments. Metrics automatically tracked.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-primary" />
            Key Features
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Real-Time Flag Updates</h3>
              <p className="text-sm text-foreground-secondary mb-4">
                Flags update instantly when toggled in LaunchDarkly dashboard without requiring page reloads.
              </p>
              <div className="bg-background-tertiary p-3 rounded-lg text-xs font-mono text-foreground-secondary">
                LaunchDarkly Streaming API
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">User Context Management</h3>
              <p className="text-sm text-foreground-secondary mb-4">
                Switch between demo users to test targeting rules and see flag variations in real-time.
              </p>
              <div className="bg-background-tertiary p-3 rounded-lg text-xs font-mono text-foreground-secondary">
                9 User Attributes
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">AI Configs Integration</h3>
              <p className="text-sm text-foreground-secondary mb-4">
                Dynamic chatbot prompts and models managed via LaunchDarkly AI Configs with multiple variations.
              </p>
              <div className="bg-background-tertiary p-3 rounded-lg text-xs font-mono text-foreground-secondary">
                jobs-os-basic-chatbot
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2">Event Tracking</h3>
              <p className="text-sm text-foreground-secondary mb-4">
                Built-in event tracking for experimentation with metrics ready for LaunchDarkly experiments.
              </p>
              <div className="bg-background-tertiary p-3 rounded-lg text-xs font-mono text-foreground-secondary">
                4 Tracked Events
              </div>
            </Card>
          </div>
        </section>

        {/* Key Files Section */}
        <section id="files" className="mb-16 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Code className="w-7 h-7 text-primary" />
            Key Implementation Files
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Feature Flags</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <code className="bg-background-tertiary px-2 py-1 rounded text-xs">lib/launchdarkly/flags.ts</code>
                </li>
                <li>
                  <code className="bg-background-tertiary px-2 py-1 rounded text-xs">hooks/useFeatureFlag.ts</code>
                </li>
                <li>
                  <code className="bg-background-tertiary px-2 py-1 rounded text-xs">components/LaunchDarklyProvider.tsx</code>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">User Context & Targeting</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <code className="bg-background-tertiary px-2 py-1 rounded text-xs">lib/launchdarkly/userContext.ts</code>
                </li>
                <li>
                  <code className="bg-background-tertiary px-2 py-1 rounded text-xs">components/admin/UserContextSwitcher.tsx</code>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI Configs</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <code className="bg-background-tertiary px-2 py-1 rounded text-xs">lib/launchdarkly/serverClient.ts</code>
                </li>
                <li>
                  <code className="bg-background-tertiary px-2 py-1 rounded text-xs">app/api/chat/route.ts</code>
                </li>
                <li>
                  <code className="bg-background-tertiary px-2 py-1 rounded text-xs">components/admin/ChatTestCard.tsx</code>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Documentation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <code className="bg-background-tertiary px-2 py-1 rounded text-xs">ASSIGNMENT_SATISFACTION.md</code>
                </li>
                <li>
                  <code className="bg-background-tertiary px-2 py-1 rounded text-xs">EXPERIMENTATION_SETUP.md</code>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-12 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-foreground-secondary">
              Need more details? Check out the{" "}
              <Link href="/admin/assignment-satisfaction" className="text-primary hover:underline">
                Assignment Docs
              </Link>
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Go to Admin Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
