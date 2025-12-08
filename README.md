# Job Tracker - LaunchDarkly Integration Demo

A comprehensive job search management application converted to use LaunchDarkly's feature flag ecosystem, demonstrating robust feature flag management, targeting, experimentation, and AI Config integration.

---

## For Reviewers: Important Pages

**CRITICAL: Please use the Assignment Docs page as your primary guide during the review process.**

### Assignment Docs Page (Primary Review Guide)
- **Route:** `/admin/assignment-satisfaction`
- **Purpose:** Comprehensive documentation of how the application satisfies LaunchDarkly technical exercise requirements
- **Use This Page:** As your primary guide during the review process - it contains detailed explanations of all requirements, implementation details, and testing instructions
- **Access:** Navigate to `http://localhost:3000/admin/assignment-satisfaction` after starting the application

### Admin Control Panel
- **Route:** `/admin`
- **Purpose:** Real-time flag monitoring, user context switching, and testing tools
- **Key Features:**
  - View all 30 feature flags and their status
  - Switch between demo user profiles to test targeting
  - Test AI Config variations with the chat interface
  - Visual demonstration of flag-controlled features
- **Access:** Navigate to `http://localhost:3000/admin` after starting the application

**Review Process:**
1. Start with the **Assignment Docs page** (`/admin/assignment-satisfaction`) to understand requirements and implementation
2. Use the **Admin Control Panel** (`/admin`) to test features, switch users, and verify flag behavior
3. Follow the testing instructions provided in the Assignment Docs page

---

## Installation

**IMPORTANT: Follow these steps carefully to ensure the application runs correctly. This guide assumes you have basic familiarity with Node.js, npm, and command-line tools.**

### Environment Assumptions

Before starting, ensure your environment meets these requirements:

- **Node.js**: Version 18.0.0 or higher (check with `node --version`)
- **npm**: Version 8.0.0 or higher (check with `npm --version`)
- **Operating System**: macOS, Linux, or Windows (with WSL recommended for Windows)
- **Browser**: Modern browser with JavaScript enabled (Chrome, Firefox, Safari, or Edge)
- **LaunchDarkly Account**: A LaunchDarkly account with access to create projects and feature flags
  - Sign up for a free trial at [launchdarkly.com/start-trial](https://launchdarkly.com/start-trial/) if needed
  - The application uses LaunchDarkly's **Production** environment by default
- **OpenAI Account**: An OpenAI account with API access (required for chatbot functionality)
  - Sign up at [platform.openai.com](https://platform.openai.com) if needed
  - You'll need API credits/billing set up to use the chatbot feature

### Step-by-Step Installation

#### Step 1: Clone the Repository

```bash
git clone https://github.com/Connor-Tluck/Job_Tracker_LaunchDarkly.git
cd Job_Tracker_LaunchDarkly
```

**Verification:** You should see the project files including `package.json`, `README.md`, and `env.template`.

#### Step 2: Install Dependencies

```bash
npm install
```

**What this does:** Installs all required Node.js packages including Next.js, LaunchDarkly SDKs, React, and other dependencies.

**Expected output:** Should complete without errors. Installation may take 1-2 minutes.

**Troubleshooting:** If you encounter errors:
- Ensure Node.js 18+ is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

#### Step 3: Set Up LaunchDarkly Account and Project

1. **Create or Access LaunchDarkly Account:**
   - Go to [app.launchdarkly.com](https://app.launchdarkly.com) and sign in
   - If you don't have an account, sign up at [launchdarkly.com/start-trial](https://launchdarkly.com/start-trial/)

2. **Create a New Project (or use existing):**
   - Navigate to Project Settings: [app.launchdarkly.com/settings/projects](https://app.launchdarkly.com/settings/projects)
   - Click "New Project" or select an existing project
   - **Important:** Note your project key (you'll need this for flag import)

3. **Get Your LaunchDarkly Credentials:**
   - Navigate to [Account Settings → Authorization](https://app.launchdarkly.com/settings/authorization)
   - Find your **Client-side ID** (starts with `sdk-` or similar)
   - Navigate to [Project Settings → Environments](https://app.launchdarkly.com/settings/projects)
   - Select the **Production** environment
   - Copy the **SDK Key** (this is your server-side key)

#### Step 4: Set Up Environment Variables

1. **Create `.env.local` file:**
   ```bash
   cp env.template .env.local
   ```

2. **Open `.env.local` in a text editor** and replace the placeholder values:

   ```bash
   # LaunchDarkly Client-side ID (for React SDK)
   # Get this from: Account Settings → Authorization
   # Format: sdk-xxxxx or similar
   NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID=your_launchdarkly_client_id_here

   # LaunchDarkly Server SDK Key (for Node.js SDK)
   # Get this from: Project Settings → Environments → Production → SDK Key
   # Format: sdk-xxxxx-xxxxx-xxxxx
   LAUNCHDARKLY_SDK_KEY=your_launchdarkly_sdk_key_here

   # OpenAI API Key (required for chatbot functionality)
   # Get this from: https://platform.openai.com/api-keys
   # Format: sk-xxxxx...
   OPENAI_API_KEY=your_openai_api_key_here

   # Authentication (set to false for demo mode)
   NEXT_PUBLIC_ENABLE_AUTH=false
   ```

   **Critical Notes:**
   - **DO NOT** commit `.env.local` to git (it's already in `.gitignore`)
   - Replace `your_launchdarkly_client_id_here` with your actual Client-side ID
   - Replace `your_launchdarkly_sdk_key_here` with your actual Production SDK Key
   - Replace `your_openai_api_key_here` with your actual OpenAI API key
   - The `NEXT_PUBLIC_ENABLE_AUTH=false` setting enables demo mode (no authentication required)

3. **Verify your `.env.local` file:**
   - Ensure all three keys are set (no `your_xxx_here` placeholders remain)
   - Ensure there are no extra spaces or quotes around the values
   - File should be in the project root directory (same level as `package.json`)

#### Step 5: Import LaunchDarkly Feature Flags

The application requires **30 feature flags** to be created in your LaunchDarkly project. You have two options:

**Option A: Using LaunchDarkly CLI (Recommended - Fastest Method)**

1. **Install LaunchDarkly CLI:**
   ```bash
   # macOS (using Homebrew)
   brew install launchdarkly/tap/ldcli
   
   # Linux/Windows - Download from: https://github.com/launchdarkly/ldcli/releases
   ```

2. **Authenticate CLI:**
   ```bash
   ldcli login
   ```
   - This will open your browser to authenticate
   - Follow the prompts to authorize the CLI

3. **Import all flags:**
   ```bash
   npm run ld:import -- --project YOUR_PROJECT_KEY
   ```
   - Replace `YOUR_PROJECT_KEY` with your actual LaunchDarkly project key
   - Example: `npm run ld:import -- --project default`
   - This imports all 30 flags from `launchdarkly/flags.json`

**Option B: Manual Creation (Alternative Method)**

If you prefer to create flags manually or CLI installation fails:

1. **Open `launchdarkly/flags.json`** in a text editor
2. **For each flag** in the file:
   - Go to LaunchDarkly dashboard → Feature Flags → Create Flag
   - Use the `key` value as the flag key
   - Set the flag name to the `name` value
   - Set description to the `description` value
   - Set default value to `true` (ON)
   - Save the flag
3. **Repeat for all 30 flags** listed in the JSON file

**Verification:** After importing flags:
- Go to LaunchDarkly dashboard → Feature Flags
- You should see 30 flags created
- All flags should default to `true` (ON)

#### Step 6: Set Up OpenAI API Key (For Chatbot Feature)

1. **Create OpenAI Account:**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Sign up or sign in

2. **Get API Key:**
   - Navigate to [API Keys](https://platform.openai.com/api-keys)
   - Click "Create new secret key"
   - Copy the key immediately (you won't be able to see it again)
   - **Important:** Ensure billing is set up if required

3. **Add to `.env.local`:**
   - Already done in Step 4, but verify the key is correct
   - Format should be: `sk-xxxxx...`

**Note:** The chatbot uses LaunchDarkly AI Configs for prompt and model management, but still requires your OpenAI API key for actual API calls. Without this key, the chatbot will not function.

#### Step 7: Run the Development Server

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Ready in X seconds
```

**What to expect:**
- Server starts on port 3000
- No errors in the terminal
- You may see LaunchDarkly connection messages in the console

**Troubleshooting:**
- If port 3000 is in use, Next.js will automatically use the next available port (3001, 3002, etc.)
- Check terminal output for the actual URL
- If you see LaunchDarkly connection errors, verify your `.env.local` credentials

#### Step 8: Open the Application

1. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

2. **First Load:**
   - The application should load without errors
   - You may see a brief loading state while LaunchDarkly initializes
   - The dashboard should appear with feature flags active

3. **Verify LaunchDarkly Connection:**
   - Open browser Developer Tools (F12 or Cmd+Option+I)
   - Check the Console tab
   - You should see LaunchDarkly connection messages (no errors)
   - Look for messages like "LaunchDarkly client initialized" or similar

### Verification Checklist

After installation, verify everything is working:

- [ ] **Application loads** at `http://localhost:3000` without errors
- [ ] **LaunchDarkly client connects** (check browser console for connection messages)
- [ ] **Feature flags are accessible** - Visit `/admin` to see flag status dashboard
- [ ] **User context switcher works** - Visit `/admin` and switch between users (Beta Tester, Premium User, Free User)
- [ ] **Flags control UI** - Toggle flags in LaunchDarkly dashboard and see instant changes
- [ ] **Chatbot works** (if OpenAI key is set) - Visit `/landing/support-bot` and send a message
- [ ] **No console errors** - Browser console should be free of critical errors

### Common Issues and Solutions

**Issue: "LaunchDarkly client not initialized"**
- **Solution:** Verify `.env.local` has correct `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID`
- Check that the Client-side ID is correct (not the SDK Key)
- Ensure there are no extra spaces or quotes

**Issue: "Feature flags not loading"**
- **Solution:** Verify flags are created in LaunchDarkly dashboard
- Check that you're using the correct project key
- Ensure flags match the keys in `launchdarkly/flags.json`

**Issue: "Chatbot returns errors"**
- **Solution:** Verify `OPENAI_API_KEY` is set correctly in `.env.local`
- Check OpenAI account has credits/billing set up
- Verify API key is valid at [platform.openai.com](https://platform.openai.com)

**Issue: "Port already in use"**
- **Solution:** Next.js will automatically use the next available port
- Check terminal output for the actual URL
- Or kill the process using port 3000: `lsof -ti:3000 | xargs kill`

**Issue: "Module not found" errors**
- **Solution:** Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`
- Ensure you're in the project root directory

### Next Steps After Installation

1. **Review Assignment Docs:** Navigate to `/admin/assignment-satisfaction` for detailed requirements documentation
2. **Explore Admin Panel:** Visit `/admin` to see all flags and test user switching
3. **Test Flag Toggling:** Toggle flags in LaunchDarkly dashboard and observe instant UI changes
4. **Review Examples:** Check `feature_walkthrough.md` for step-by-step walkthroughs of each feature

---

## Overview

This application was built by converting an existing job tracker project to use LaunchDarkly's feature flag ecosystem. Using LaunchDarkly's SDK and CLI tools, I integrated **30 feature flags** that control page access, component visibility, and feature toggles throughout the application.

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
