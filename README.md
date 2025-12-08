# Job Tracker - LaunchDarkly Integration Demo

A comprehensive job search management application converted to use LaunchDarkly's feature flag ecosystem, demonstrating robust feature flag management, targeting, experimentation, and AI Config integration.

---

## For Reviewers: Suggested Review Path

Start with the Assignment Docs page as your primary guide during the review process.

### Assignment Docs Page (Suggested Starting Point)
- **Route:** `/admin/assignment-satisfaction`
- **Purpose:** Comprehensive documentation of how the application satisfies LaunchDarkly technical exercise requirements
- **Suggested Use:** This page contains detailed explanations of all requirements, implementation details, and testing instructions
- **Access:** Navigate to `http://localhost:3000/admin/assignment-satisfaction` after starting the application

### Admin Examples Page (Visual Walkthrough)
- **Route:** `/admin/examples`
- **Purpose:** Step-by-step walkthroughs with images demonstrating key features and LaunchDarkly integrations
- **Also Available:** The same content is available as `feature_walkthrough.md` in the repository root
- **Suggested Use:** Review this page to see visual examples of feature flag behavior, targeting, AI Configs, and experimentation in action
- **Access:** Navigate to `http://localhost:3000/admin/examples` after starting the application

### Admin Control Panel
- **Route:** `/admin`
- **Purpose:** Real-time flag monitoring, user context switching, and testing tools
- **Key Features:**
  - View all 30 feature flags and their status
  - Switch between demo user profiles to test targeting
  - Test AI Config variations with the chat interface
  - Visual demonstration of flag-controlled features
- **Access:** Navigate to `http://localhost:3000/admin` after starting the application

**Suggested Review Process:**
1. Start with the **Assignment Docs page** (`/admin/assignment-satisfaction`) to understand requirements and implementation
2. Review the **Admin Examples page** (`/admin/examples`) or `feature_walkthrough.md` to see visual walkthroughs of key features
3. Use the **Admin Control Panel** (`/admin`) to test features, switch users, and verify flag behavior
4. Follow the testing instructions provided in the Assignment Docs page

---

## Installation


### Quick Setup Summary (For Reviewers)

If you're a reviewer setting up the project, here are the essential commands to recreate all LaunchDarkly components:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (see Step 4 for details)
cp env.template .env.local
# Edit .env.local with your LaunchDarkly and OpenAI credentials

# 3. Install and authenticate LaunchDarkly CLI
brew install launchdarkly/tap/ldcli  # macOS
ldcli login

# 4. Import all 30 feature flags
npm run ld:import -- --project YOUR_PROJECT_KEY --environment production

# 5. Set up targeting rules for show-premium-feature-demo flag
npm run ld:setup-targeting -- --project YOUR_PROJECT_KEY --environment production

# 6. Start the development server
npm run dev
```

**Note:** Replace `YOUR_PROJECT_KEY` with your actual LaunchDarkly project key (e.g., `default`).

### Prerequisites

- Node.js 18+ and npm 8+
- LaunchDarkly account with Writer/Admin permissions
- OpenAI API key (for chatbot feature)

### Step-by-Step Installation

#### Step 1: Clone and Install

```bash
git clone https://github.com/Connor-Tluck/Job_Tracker_LaunchDarkly.git
cd Job_Tracker_LaunchDarkly
npm install
```

#### Step 2: Get LaunchDarkly Credentials

1. Create/access LaunchDarkly account and project
2. Get **Client-side ID** from Account Settings → Authorization
3. Get **SDK Key** from Project Settings → Environments → Production
4. Note your **project key** (needed for flag import)

#### Step 3: Set Up Environment Variables

```bash
cp env.template .env.local
```

Edit `.env.local` and replace placeholder values with your credentials:
- `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID` - Client-side ID from LaunchDarkly
- `LAUNCHDARKLY_SDK_KEY` - Server SDK Key from LaunchDarkly Production environment
- `OPENAI_API_KEY` - OpenAI API key (required for chatbot)

#### Step 4: Set Up LaunchDarkly Components

**Install LaunchDarkly CLI:**
```bash
brew install launchdarkly/tap/ldcli  # macOS
# Or download from: https://github.com/launchdarkly/ldcli/releases
ldcli login
```

**Import all 30 feature flags:**
```bash
npm run ld:import -- --project YOUR_PROJECT_KEY --environment production
```

**Set up targeting rules for `show-premium-feature-demo`:**
```bash
npm run ld:setup-targeting -- --project YOUR_PROJECT_KEY --environment production
```

This configures:
- Individual targeting: `user-001` and `user-002` → ON
- Rule-based targeting: `subscriptionTier = "premium"`, `betaTester = true`, `role = "beta-tester"` → ON
- Default: OFF

If CLI fails, configure manually in LaunchDarkly dashboard: Feature Flags → `show-premium-feature-demo` → Targeting

#### Step 5: Set Up AI Configs (Manual - Required for Chatbot)

**⚠️ IMPORTANT:** AI Configs cannot be automated via CLI and must be configured manually in the LaunchDarkly dashboard. **The chatbot will not work without this setup.**

1. Navigate to LaunchDarkly dashboard → **AI Configs** → **Create AI Config**
2. **AI Config Key:** `jobs-os-basic-chatbot`
3. **Create two variations:**
   - **Variation 1:** `standard_open_ai` (default)
     - System prompt: Friendly, helpful customer support bot (see `app/api/chat/route.ts` for fallback prompt)
     - Model: `gpt-4o-mini` (or your preferred model)
     - Temperature: `0.7`
     - Max tokens: `1000`
   - **Variation 2:** `combative_open_ai`
     - System prompt: Grumpy, sarcastic tone (e.g., "Oh great, another question...")
     - Model: `gpt-4o-mini`
     - Temperature: `0.9`
     - Max tokens: `1000`
4. **Configure targeting:**
   - Set default variation to `standard_open_ai`
   - Add individual targeting: `user-001` (Beta Tester) → `combative_open_ai`

**Note:** Without AI Configs, the chatbot will use a fallback prompt but won't demonstrate LaunchDarkly AI Configs functionality. See `feature_walkthrough.md` or `/admin/examples` for detailed setup instructions with screenshots.

#### Step 6: Run the Application

```bash
npm run dev
```

Open `http://localhost:3000` in your browser. Visit `/admin` to verify flags are working.

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

## Application Structure

The application consists of two main parts:

**Core Application** (`/`, `/jobs`, `/prep`, `/analytics`, `/star-stories`)
- Job tracking, company prep documents, STAR stories, analytics dashboard

**Marketing Pages** (`/landing/*`)
- Marketing pages and support bot (flag-controlled)

**Admin** (`/admin`, `/admin/assignment-satisfaction`, `/admin/examples`)
- Flag monitoring, user context switching, documentation

---


---

## Environments

The application uses LaunchDarkly's **Production** environment by default. Both `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID` (React Client SDK) and `LAUNCHDARKLY_SDK_KEY` (Node.js Server SDK) are required in `.env.local`.

---

## Demo Users

Three demo user profiles are available for testing targeting:

- **Beta Tester** (`user-001`) - `beta-tester` role, `premium` tier, `betaTester: true`
- **Premium User** (`user-002`) - `user` role, `premium` tier, `betaTester: false`
- **Free User** (`user-003`) - `user` role, `free` tier, `betaTester: false`

Switch users via `/admin` → User Context Switcher. User context attributes: `key`, `email`, `name`, `role`, `subscriptionTier`, `signupDate`, `betaTester`, `companySize`, `industry`.

---

## Admin Control Panel

The Admin Control Panel (`/admin`) provides:
- Real-time view of all 30 feature flags
- User context switcher for testing targeting
- Targeting demo card showing flag-controlled features
- Chat test interface for AI Config variations

---

## Assignment Docs

The Assignment Docs page (`/admin/assignment-satisfaction`) documents how the application satisfies LaunchDarkly technical exercise requirements, including Release & Remediate, Targeting, Experimentation, AI Configs, and Integrations.

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
npm run ld:convert    # Convert flags for CLI format
npm run ld:import     # Import flags via CLI
npm run ld:turn-on    # Turn on all flags
```

---

## Documentation

All documentation is now integrated into the application itself:

- **Assignment Docs Page** (`/admin/assignment-satisfaction`) - Complete assignment requirements documentation and implementation guide
- **Admin README Page** (`/admin/readme`) - Implementation walkthrough and testing guide

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
