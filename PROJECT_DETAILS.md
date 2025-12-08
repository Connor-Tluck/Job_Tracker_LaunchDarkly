# Project Details

Technical documentation and project overview for the Job Tracker - LaunchDarkly Integration Demo.

---

## Overview

This application was built by converting an existing job tracker project to use LaunchDarkly's feature flag ecosystem. Using LaunchDarkly's SDK and CLI tools, the project integrates **30 feature flags** that control page access, component visibility, and feature toggles throughout the application.

### What Was Built

- **30 Feature Flags**: Comprehensive flag coverage across pages, components, and features
- **Real-time Flag Updates**: Instant UI changes without page reloads via LaunchDarkly streaming
- **Targeting System**: Individual and rule-based targeting with multiple user contexts
- **Experimentation**: Full experiment setup with metrics tracking and statistical analysis
- **AI Configs Integration**: Dynamic LLM model and prompt management via LaunchDarkly
- **Webhook Integrations**: Slack integration for experiment lifecycle tracking

### Key Technical Achievements

- Converted existing application to LaunchDarkly format using React Client SDK and Node.js Server SDK
- Implemented comprehensive user context system with 9+ attributes for targeting
- Created production-safe access control with 404 fallbacks when flags are OFF
- Built admin dashboard for real-time flag monitoring and user context switching
- Integrated LaunchDarkly AI Configs for dynamic chatbot prompt and model management

---

## About the Job Tracker Application

The Job Tracker is a comprehensive web application designed to help users manage their entire job search pipeline, from application tracking to interview preparation. The application consists of two main parts:

### 1. Core Job Tracker Application

The core application provides essential job search management tools:

**Job Tracking (`/jobs`)**
- Google Sheets-style table interface for tracking job applications
- CSV import functionality for bulk job entry
- Inline editing for quick updates
- Status tracking (Applied, Interviewing, Offer, Rejected, etc.)
- Filtering and search capabilities

**Company Prep Documents (`/prep/companies`)**
- Company-specific interview preparation documents
- Structured sections: Company Summary, Product Pillars, Interview Questions, STAR Stories
- Sidebar navigation for quick section access during interviews
- Inline editing for all sections

**STAR Stories Builder (`/star-stories`)**
- Create and manage behavioral interview stories
- Full Situation-Task-Action-Result format
- Tagging system for organization
- Attach stories to specific company prep docs

**Analytics Dashboard (`/analytics`)**
- Pipeline metrics and visualizations
- Weekly trends and conversion rates
- Timeline velocity tracking
- Upcoming actions and follow-ups

**Master Prep Hub (`/prep`)**
- Centralized location for general interview preparation
- Personal narrative and elevator pitch
- Question banks with prepared answers
- Reusable content library

**Dashboard (`/`)**
- Quick metrics overview
- Recent applications
- Upcoming actions timeline
- Quick links to all major sections

### 2. Customer-Facing Marketing Pages

The landing pages provide marketing and feature demonstration:

**Landing Page (`/landing`)**
- Marketing homepage with feature highlights
- Navigation to all landing page sections
- Support Bot access (when enabled)

**Job Tracker Landing (`/landing/job-tracker`)**
- Feature demonstration for job tracking
- Premium feature sections (flag-controlled)

**Prep Hub Landing (`/landing/prep-hub`)**
- Company prep document feature showcase

**Analytics Landing (`/landing/analytics`)**
- Analytics dashboard feature demonstration

**Support Bot (`/landing/support-bot`)**
- AI-powered chatbot interface
- Integrated with LaunchDarkly AI Configs
- Experimentation demo feature

### Key Routes

**Core Application Routes:**
- `/` - Main dashboard
- `/jobs` - Job tracking table
- `/jobs/[jobId]` - Individual job details
- `/prep` - Master prep library
- `/prep/companies` - Company prep documents list
- `/prep/companies/[companyId]` - Individual company prep doc
- `/star-stories` - STAR stories builder
- `/analytics` - Analytics dashboard

**Landing/Marketing Routes:**
- `/landing` - Marketing homepage
- `/landing/job-tracker` - Job tracker feature page
- `/landing/prep-hub` - Prep hub feature page
- `/landing/analytics` - Analytics feature page
- `/landing/support-bot` - Support chatbot (flag-controlled)

**Admin Routes:**
- `/admin` - Admin dashboard with flag monitoring
- `/admin/readme` - Implementation documentation
- `/admin/assignment-satisfaction` - Assignment requirements documentation

---

## Components of Application

There are **2 main key parts** of the application:

### 1. Core Job Tracker Application

The core application provides the essential job search management functionality. This includes:
- Job application tracking and management
- Company-specific interview preparation
- STAR stories library
- Analytics and pipeline tracking
- Master prep materials

**Access:** Available via main navigation sidebar when flags are enabled. Pages are protected by feature flags - if a flag is OFF, the page returns 404 and the navigation link is hidden.

### 2. Customer-Facing Marketing Pages

The landing pages serve as marketing and feature demonstration pages. These pages showcase the application's capabilities and provide a customer-facing interface separate from the core application.

**Access:** Available via `/landing` route and landing page navigation. These pages are also controlled by feature flags for demonstration purposes.

**Key Distinction:** The core application is the functional job tracking tool, while the landing pages are marketing/demonstration pages that showcase features. Both are fully integrated with LaunchDarkly's feature flag system.

---

## Environments

### Production Environment

By default, the **production environment** is active. The application connects to LaunchDarkly's production environment to retrieve feature flag values.

### Required Environment Variables

**SDK and Client-side Keys Required:**

Both keys are required in the `.env.local` file for access to the production environment flags:

1. **Client-side ID** (`NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID`)
   - Used by the React Client SDK for browser-side flag evaluation
   - Enables real-time streaming and instant flag updates
   - Get from: LaunchDarkly Project Settings → Client-side ID

2. **Server SDK Key** (`LAUNCHDARKLY_SDK_KEY`)
   - Used by the Node.js Server SDK for server-side flag evaluation
   - Required for API routes and AI Configs integration
   - Get from: LaunchDarkly Project Settings → SDK Key

**Environment Setup:**
- Copy `env.template` to `.env.local`
- Add both keys to `.env.local`
- Restart the development server after adding keys

**Note:** The application defaults to production environment. To use a different environment, modify the LaunchDarkly client initialization in `components/LaunchDarklyProvider.tsx` and `lib/launchdarkly/serverClient.ts`.

---

## User Access

### Demo User Profiles

A number of demo user profiles have been created to test targeting controls within the LaunchDarkly ecosystem. These users can be switched in real-time via the Admin Dashboard's User Context Switcher.

### User Roles Created

**1. Beta Tester** (`user-001` / `beta.tester@example.com`)
- **Role:** `beta-tester`
- **Subscription Tier:** `premium`
- **Beta Tester:** `true`
- **Company Size:** `medium`
- **Industry:** `Technology`
- **Signup Date:** January 15, 2024
- **Use Case:** Tests beta features, receives premium features, gets special AI Config variations (grumpy chatbot)

**2. Premium User** (`user-002` / `premium.user@example.com`)
- **Role:** `user`
- **Subscription Tier:** `premium`
- **Beta Tester:** `false`
- **Company Size:** `small`
- **Industry:** `Finance`
- **Signup Date:** March 20, 2024
- **Use Case:** Standard premium subscriber, receives premium features but not beta variations

**3. Free User** (`user-003` / `free.user@example.com`)
- **Role:** `user`
- **Subscription Tier:** `free`
- **Beta Tester:** `false`
- **Company Size:** `startup`
- **Industry:** `Retail`
- **Signup Date:** June 10, 2024
- **Use Case:** Free tier user, limited feature access, used to demonstrate targeting rules

### User Context Attributes

Each user profile includes the following attributes for LaunchDarkly targeting:
- `key` - Unique user identifier
- `email` - User email address
- `name` - User display name
- `role` - User role (`user`, `admin`, `beta-tester`)
- `subscriptionTier` - Subscription level (`free`, `premium`, `enterprise`)
- `signupDate` - Account creation date (ISO format)
- `betaTester` - Boolean flag for beta testers
- `companySize` - Company size category (`startup`, `small`, `medium`, `large`)
- `industry` - Industry classification

### Switching Users

To test different user contexts:
1. Navigate to `/admin`
2. Use the **User Context Switcher** card
3. Select a different user profile
4. Observe flag-controlled elements update in real-time:
   - Sidebar navigation changes
   - Page access granted/denied
   - Component visibility toggles
   - AI Config variations (chatbot behavior)

---

## Admin Control Panel

The Admin Control Panel (`/admin`) provides comprehensive tools for managing and testing the LaunchDarkly integration.

### Features

**1. Feature Flag Monitoring**
- Real-time view of all 30 feature flags
- Flag status (ON/OFF) and metadata
- Filter and search capabilities
- Instant updates when flags change in LaunchDarkly dashboard

**2. User Context Switcher**
- Switch between demo user profiles
- Real-time flag updates based on user context
- Visual feedback showing current user
- Test targeting rules instantly

**3. Targeting Demo Card**
- Visual demonstration of flag-controlled features
- Shows premium feature content when flag is ON
- Shows hidden message when flag is OFF
- Updates instantly when user context changes

**4. Chat Test Interface**
- Test AI Config variations with different users
- See how different user contexts receive different chatbot behaviors
- Beta Tester receives grumpy chatbot, others receive friendly chatbot

**5. Flag Status Overview**
- Quick view of flag categories
- Page access flags
- Component visibility flags
- Feature toggle flags

### Access

- **Route:** `/admin`
- **Flag Control:** `show-admin-page` (defaults to ON)
- **Access:** Available to all users for demonstration purposes

---

## Assignment Docs

The Assignment Docs page (`/admin/assignment-satisfaction`) provides comprehensive documentation of how the application satisfies LaunchDarkly technical exercise requirements.

### Sections

**Part 1: Release and Remediate**
- Feature flag implementation (30 flags)
- Instant releases/rollbacks via streaming
- Remediation methods and time-to-remediate
- Recommended test feature toggles

**Part 2: Target**
- Context attributes and user context system
- Individual targeting (specific users)
- Rule-based targeting (attribute-based rules)
- Expected behavior tables
- Targeted feature testing examples

**Extra Credit: Experimentation**
- Feature flag used for experimentation
- Metrics created and tracked
- Experiment configuration (50% sample, 50/50 split, Bayesian)
- Hypothesis and approach rationale

**Extra Credit: AI Configs**
- AI Config integration implementation
- Bot variations (standard vs. grumpy)
- Targeting configuration
- Code implementation details

**Extra Credit: Integrations**
- Webhook setup process
- Slack integration for experiment tracking
- Setup instructions and benefits

### Access

- **Route:** `/admin/assignment-satisfaction`
- **Flag Control:** `show-assignment-satisfaction-page` (defaults to ON)
- **Purpose:** Comprehensive documentation for reviewers and hiring managers

---

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **LaunchDarkly React Client SDK** - Client-side feature flags
- **LaunchDarkly Node.js Server SDK** - Server-side feature flags and AI Configs
- **LaunchDarkly AI Configs** - Dynamic LLM model and prompt management (chatbot functionality)
- **Chart.js** - Data visualization
- **Lucide React** - Icon library

---

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# LaunchDarkly CLI commands
npm run ld:convert         # Convert flags for CLI format
npm run ld:import          # Import flags via CLI
npm run ld:turn-on         # Turn on all flags
npm run ld:setup-targeting # Set up targeting rules
```

---

## Documentation

All documentation is now integrated into the application itself:

- **Assignment Docs Page** (`/admin/assignment-satisfaction`) - Complete assignment requirements documentation and implementation guide
- **Admin README Page** (`/admin/readme`) - Implementation walkthrough and testing guide
- **Feature Walkthrough** (`feature_walkthrough.md`) - Step-by-step visual walkthroughs of key features

---

## Key Strengths

- **30 Feature Flags** covering pages, components, and features
- **Real-time Updates** - Instant flag changes without page reloads
- **Production-Safe** - All pages protected with 404 when flags are OFF
- **Comprehensive Targeting** - Individual and rule-based targeting
- **Full Experimentation** - Metrics, experiments, and statistical analysis
- **AI Configs Integration** - Dynamic LLM management via LaunchDarkly
- **Developer Experience** - TypeScript constants, custom hooks, organized structure
- **Remediation Ready** - Multiple methods for instant rollback

---

Built to demonstrate comprehensive LaunchDarkly integration capabilities for feature flag management, targeting, experimentation, and AI Config management.

