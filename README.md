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

**IMPORTANT: Follow these steps carefully to ensure the application runs correctly. This guide assumes you have basic familiarity with Node.js, npm, and command-line tools.**

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

#### Step 5: Set Up LaunchDarkly Project Components

**⚠️ IMPORTANT FOR REVIEWERS:** This step recreates all LaunchDarkly components (flags and targeting rules) in your LaunchDarkly workspace. This is **critical** - without completing this step, the application will not function correctly as many features depend on specific flag configurations and targeting rules.

**What gets created:**
- 30 feature flags (all application flags)
- Targeting rules for `show-premium-feature-demo` flag (individual targeting + rule-based targeting)
- Default flag states

**Time required:** Approximately 2-5 minutes depending on your connection speed.

**Prerequisites:**
- LaunchDarkly CLI installed (see instructions below)
- LaunchDarkly account with project created
- CLI authenticated (see instructions below)

**5A: Install and Authenticate LaunchDarkly CLI**

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
   - **Note:** You need Writer or Admin permissions in LaunchDarkly to create flags and targeting rules

**5B: Import All Feature Flags**

The application requires **30 feature flags** to be created in your LaunchDarkly project.

**Using CLI (Recommended):**
```bash
npm run ld:import -- --project YOUR_PROJECT_KEY --environment production
```
- Replace `YOUR_PROJECT_KEY` with your actual LaunchDarkly project key
- Example: `npm run ld:import -- --project default --environment production`
- This imports all 30 flags from `launchdarkly/flags.json`
- The script will create flags with a 1-second delay between each to avoid rate limiting

**Manual Creation (Alternative):**
If you prefer to create flags manually or CLI installation fails:

1. **Open `launchdarkly/flags.json`** in a text editor
2. **For each flag** in the file:
   - Go to LaunchDarkly dashboard → Feature Flags → Create Flag
   - Use the `key` value as the flag key
   - Set the flag name to the `name` value
   - Set description to the `description` value
   - Set default value to `true` (ON)
   - Enable "SDKs using Client-side ID" (for client-side availability)
   - Save the flag
3. **Repeat for all 30 flags** listed in the JSON file

**Verification:** After importing flags:
- Go to LaunchDarkly dashboard → Feature Flags
- You should see 30 flags created
- All flags should default to `true` (ON)

**5C: Set Up Targeting Rules**

The `show-premium-feature-demo` flag requires specific targeting rules to demonstrate user-based targeting. Run this script to configure them:

```bash
npm run ld:setup-targeting -- --project YOUR_PROJECT_KEY --environment production
```

**What this script configures:**
- **Individual Targeting:**
  - `user-001` (Beta Tester) → Flag ON
  - `user-002` (Premium User) → Flag ON
- **Rule-Based Targeting:**
  - `subscriptionTier = "premium"` → Flag ON
  - `betaTester = true` → Flag ON
  - `role = "beta-tester"` → Flag ON
- **Default:** Flag OFF (for all other users)

**Manual Configuration (If Script Fails):**
If the CLI script fails to set up targeting rules, configure them manually in LaunchDarkly dashboard:

1. Navigate to: **Feature Flags → `show-premium-feature-demo` → Targeting**
2. **Set Default Rule:** Set to "Serve Off" (variation 1)
3. **Add Individual Targeting:**
   - Add `user-001` → Serve "On" (variation 0)
   - Add `user-002` → Serve "On" (variation 0)
4. **Add Rule-Based Targeting (in order):**
   - Rule 1: `subscriptionTier` is in `["premium"]` → Serve "On"
   - Rule 2: `betaTester` is in `[true]` → Serve "On"
   - Rule 3: `role` is in `["beta-tester"]` → Serve "On"

**Verification:** After setting up targeting:
- Go to LaunchDarkly dashboard → Feature Flags → `show-premium-feature-demo` → Targeting
- Verify individual targeting shows `user-001` and `user-002` both set to "On"
- Verify three rule-based targeting rules are configured
- Verify default is set to "Off"

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

**AI Configs Setup (Optional):** LaunchDarkly AI Configs are **optional** for basic chatbot functionality. If AI Configs are not configured in your LaunchDarkly account, the chatbot will use fallback defaults (friendly system prompt, `gpt-4o-mini` model). However, to demonstrate the AI Configs feature (e.g., grumpy chatbot for Beta Tester users), you'll need to set up AI Configs manually in the LaunchDarkly dashboard. See `feature_walkthrough.md` or `/admin/examples` for AI Configs setup instructions.

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
- Application available at `http://localhost:3000`

---

## Next Steps

1. **Review Assignment Docs:** Navigate to `/admin/assignment-satisfaction` for detailed requirements documentation
2. **Explore Admin Panel:** Visit `/admin` to see all flags and test user switching
3. **Review Project Details:** See `PROJECT_DETAILS.md` for comprehensive project information

---

For detailed project information, architecture, and technical details, see [PROJECT_DETAILS.md](./PROJECT_DETAILS.md).
