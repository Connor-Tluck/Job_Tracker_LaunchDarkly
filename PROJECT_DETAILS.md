# Project Details

Technical documentation and project overview for the Job Tracker - LaunchDarkly Integration Demo.

---

## Overview

This application demonstrates a comprehensive integration of LaunchDarkly's feature flag ecosystem into an existing job tracker application. The project showcases how LaunchDarkly can be used to control feature releases, implement user targeting, run experiments, and manage AI configurations dynamically.

The application integrates **38 feature flags** that control page access, component visibility, feature toggles, business user mode, and admin documentation pages throughout the application. These flags are managed through LaunchDarkly's React Client SDK for browser-side evaluation and Node.js Server SDK for server-side operations, enabling real-time flag updates without page reloads.

---

## LaunchDarkly Features Demonstrated

### Feature Flags and Release Management

The application uses feature flags to control access to entire pages and individual components. For example, the `show-analytics-page` flag controls access to the analytics dashboard. When toggled OFF in LaunchDarkly, the sidebar navigation link disappears instantly, and direct navigation to `/analytics` returns a 404 error. This demonstrates production-safe feature gating where flags control both UI visibility and page access.

Another example is `show-dashboard-metrics`, which controls the visibility of metric cards on the dashboard. When disabled, the entire metrics section disappears from the page without requiring a code deployment. This pattern is applied across 12 page access flags, 6 dashboard component flags, and 7 feature toggle flags.

### Real-Time Flag Updates

The application leverages LaunchDarkly's streaming capabilities to provide instant flag updates. When a flag is toggled in the LaunchDarkly dashboard, the React Client SDK receives the update via WebSocket connection, and the UI reflects the change immediately without page reload. This is demonstrated throughout the application, particularly visible in the admin dashboard where all 30 flags are monitored in real-time.

### User Targeting

The application implements both individual and rule-based targeting to demonstrate how different user segments receive different feature experiences. The `show-premium-feature-demo` flag serves as the primary example for premium demo targeting, and the `show-chatbot` flag controls access to the support chatbot feature.

**Individual Targeting:** Specific users like `user-001` (Beta Tester) and `user-002` (Premium User) are individually targeted to receive the flag ON, granting them access to premium features.

**Rule-Based Targeting:** Three targeting rules are configured:
- Users with `subscriptionTier = "premium"` receive the flag ON
- Users with `betaTester = true` receive the flag ON  
- Users with `role = "beta-tester"` receive the flag ON

Users who don't match any rules receive the default OFF variation, demonstrating how targeting rules can be combined to create complex targeting logic. The admin dashboard includes a User Context Switcher that allows testing these targeting rules in real-time by switching between Beta Tester, Premium User, and Free User profiles.

### AI Configs Integration

LaunchDarkly AI Configs are integrated to dynamically manage chatbot behavior based on user context. The `jobs-os-basic-chatbot` AI Config contains two variations: a friendly `standard_open_ai` variation and a grumpy `combative_open_ai` variation.

Beta Tester users are individually targeted to receive the grumpy chatbot variation, which uses a sarcastic system prompt and different model parameters (higher temperature for more creative responses). Premium and Free users receive the friendly variation by default. This demonstrates how AI Configs can be used to personalize AI experiences without code changes.

The implementation includes fallback logic: if LaunchDarkly AI Configs are unavailable, the chatbot uses default settings, ensuring the feature remains functional even if LaunchDarkly is temporarily unavailable.

### Experimentation

The support chatbot feature includes a full experimentation setup tracking three custom metrics: `support-bot-page-view`, `support-bot-message-sent`, and `support-bot-response-received`. The experiment is configured with a 50% sample size, 50/50 split between control and treatment variations, and uses Bayesian statistical analysis.

Event tracking is implemented using LaunchDarkly's `track()` method, sending events with custom attributes like message content and response length. These events are captured in LaunchDarkly's Event Explorer and used for experiment analysis.

### Webhook Integrations

A Slack webhook integration is configured to receive notifications about experiment lifecycle events. When experiments start, stop, or reach statistical significance, notifications are sent to a Slack channel, demonstrating how LaunchDarkly can integrate with external systems for automated workflows.

---

## About the Job Tracker Application

The Job Tracker is a comprehensive web application designed to help users manage their entire job search pipeline, from application tracking to interview preparation. The application consists of two main parts: a core job tracking application and customer-facing marketing pages.

### Core Job Tracker Application

The core application provides essential job search management tools including a Google Sheets-style table interface for tracking job applications, company-specific interview preparation documents, a STAR stories builder for behavioral interview preparation, an analytics dashboard for pipeline metrics, and a master prep hub for general interview materials.

All core application pages are protected by feature flags. When a flag is OFF, the page returns a 404 error and the navigation link is hidden from the sidebar. This ensures that features can be safely rolled back or gradually released without code deployments.

### Customer-Facing Marketing Pages

The landing pages serve as marketing and feature demonstration pages, showcasing the application's capabilities. These pages include feature highlights for job tracking, company prep documents, and analytics, as well as a support chatbot that demonstrates LaunchDarkly AI Configs integration.

The support chatbot (`/landing/support-bot`) is controlled by the `show-chatbot` flag, demonstrating how premium features can be gated behind feature flags and targeting rules. When accessed by a Free User, the page returns 404, while Premium and Beta Tester users can access the chatbot.

---

## User Context System

The application implements a comprehensive user context system with 9+ attributes for LaunchDarkly targeting. Each user profile includes attributes like `key`, `email`, `name`, `role`, `subscriptionTier`, `signupDate`, `betaTester`, `companySize`, and `industry`.

Three demo user profiles are available for testing:

**Beta Tester** (`user-001`) has the `beta-tester` role, `premium` subscription tier, and `betaTester: true`. This user receives premium features, beta feature access, and special AI Config variations (the grumpy chatbot).

**Premium User** (`user-002`) has the standard `user` role with `premium` subscription tier but `betaTester: false`. This user receives premium features but not beta variations, demonstrating how targeting rules can differentiate between user segments.

**Free User** (`user-003`) has `free` subscription tier and is used to demonstrate how targeting rules restrict feature access. This user cannot access premium features like the support chatbot.

The admin dashboard includes a User Context Switcher that allows switching between these profiles in real-time, with all flag-controlled elements updating instantly to reflect the new user context.

---

## Admin Control Panel

The Admin Control Panel (`/admin`) provides comprehensive tools for managing and testing the LaunchDarkly integration. It includes a real-time view of all 38 feature flags with their current status, a User Context Switcher for testing targeting rules, a Targeting Demo Card that visually demonstrates flag-controlled features, and a Chat Test Interface for testing AI Config variations.

The admin panel itself is controlled by the `show-admin-page` flag, demonstrating that even administrative tools can be feature-flagged. The panel updates in real-time as flags change in the LaunchDarkly dashboard, providing immediate visual feedback of flag states.

---

## Technical Implementation

The application uses LaunchDarkly's React Client SDK for client-side flag evaluation and the Node.js Server SDK for server-side operations. The client SDK establishes a WebSocket connection for real-time streaming, while the server SDK handles API route flag evaluation and AI Config retrieval.

Feature flags are defined as TypeScript constants in `lib/launchdarkly/flags.ts`, ensuring type safety and preventing typos. Custom React hooks (`useFeatureFlag`, `useFlagsReady`) provide a clean API for components to access flag values.

Production-safe access control is implemented using Next.js's `notFound()` function, which returns 404 errors when flags are OFF. This ensures that users cannot access features even via direct URL navigation.

---

## Tech Stack

The application is built with Next.js 14 using the App Router, TypeScript for type safety, and Tailwind CSS for styling. LaunchDarkly React Client SDK handles client-side feature flags, while LaunchDarkly Node.js Server SDK manages server-side flag evaluation and AI Configs integration. Chart.js provides data visualization, and Lucide React supplies the icon library.

---

## Key Strengths

The project demonstrates comprehensive LaunchDarkly integration capabilities including 38 feature flags covering pages, components, features, business user mode, and admin docs; real-time updates via streaming without page reloads; production-safe access control with 404 fallbacks; comprehensive targeting with individual and rule-based targeting; full experimentation with metrics, experiments, and statistical analysis; AI Configs integration for dynamic LLM management; and a developer-friendly structure with TypeScript constants, custom hooks, and organized codebase.

---

Built to demonstrate comprehensive LaunchDarkly integration capabilities for feature flag management, targeting, experimentation, and AI Config management.

