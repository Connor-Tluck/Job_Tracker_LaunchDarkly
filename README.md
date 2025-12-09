# Job Tracker - LaunchDarkly Integration Demo

A comprehensive job search management application converted to use LaunchDarkly's feature flag ecosystem, demonstrating robust feature flag management, targeting, experimentation, and AI Config integration.

---

## Installation

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **LaunchDarkly Account** with access to create projects and feature flags
- **OpenAI Account** with API access (required for chatbot functionality)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Connor-Tluck/Job_Tracker_LaunchDarkly.git
cd Job_Tracker_LaunchDarkly
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up LaunchDarkly Account and Get Credentials

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

### Step 4: Set Up Environment Variables

1. **Create `.env.local` file:**
   ```bash
   cp env.template .env.local
   ```

2. **Open `.env.local` in a text editor** and replace the placeholder values:

   ```bash
   # LaunchDarkly Client-side ID (for React SDK)
   NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID=your_launchdarkly_client_id_here

   # LaunchDarkly Server SDK Key (for Node.js SDK)
   LAUNCHDARKLY_SDK_KEY=your_launchdarkly_sdk_key_here

   # OpenAI API Key (required for chatbot functionality)
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   **Important:** Replace all placeholder values with your actual credentials. Do not commit `.env.local` to git.

3. **Get OpenAI API Key (if using chatbot):**
   - Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new secret key
   - Copy the key and add it to `.env.local`

### Step 5: Import LaunchDarkly Feature Flags

**IMPORTANT:** The application requires **33 feature flags** to be created in your LaunchDarkly project. This step is mandatory.

**Using LaunchDarkly CLI (Recommended):**

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

3. **(Optional) Regenerate flags.json from your LaunchDarkly project:**
   
   If you want to ensure all flags from your LaunchDarkly project are included (including flags that are currently turned off), first export your flags, then regenerate the source file:
   
   ```bash
   # Export all flags from your LaunchDarkly project
   node scripts/export-flags-with-targeting.js --project YOUR_PROJECT_KEY --output launchdarkly-flags-export-full.json
   
   # Regenerate flags.json from the export (ensures all flags are included)
   node scripts/regenerate-flags-from-export.js --export-file launchdarkly-flags-export-full.json
   ```
   
   This step ensures that flags currently turned off in production are still included in the import. If you skip this step, the import will use the default `flags.json` file which may not include all flags.

4. **Import all flags:**
   ```bash
   npm run ld:import -- --project YOUR_PROJECT_KEY
   ```
   Replace `YOUR_PROJECT_KEY` with your actual LaunchDarkly project key.

   **What the import script does:**
   - Creates all feature flags in your LaunchDarkly project (from `flags.json` or regenerated file)
   - **Automatically enables all flags in production** after creation
   - Optionally applies targeting rules if you provide an export file (see step 5)
   - Includes built-in rate limiting protection to avoid API throttling
   - Generates a detailed log file with a complete report of the import process

5. **Optionally apply targeting rules from export (Recommended):**
   
   If you have an exported JSON file with targeting configurations (created using `scripts/export-flags-with-targeting.js`), you can apply targeting rules automatically:
   ```bash
   node scripts/import-flags.js --project YOUR_PROJECT_KEY --environment production --targeting-export launchdarkly-flags-export-full.json
   ```
   
   This will apply individual targeting and rule-based targeting from the export file. Note that some complex targeting configurations may still need manual setup in the LaunchDarkly dashboard.

6. **Review the import log:**
   
   After the import completes, check the log file in the `logs/` directory (e.g., `logs/import-2024-01-01T12-00-00-000Z.log`). The log contains:
   - A summary report showing how many flags were created, enabled, and had targeting applied
   - Detailed information about any failures or skipped flags
   - Timestamps for each operation
   - Error messages for troubleshooting
   
   The log file helps you verify that all flags were imported successfully and identify any issues that need manual attention.

**Note:** The import script creates the flag structure and default values. Without the `--targeting-export` option, **flag targeting rules and experiment configurations will not copy over**. You should verify and configure:
- Individual user targeting (if used)
- Rule-based targeting rules
- Experiment configurations
- AI Configs (see Step 6)

### Step 7: Review Import Log and Verify Flags

After the import completes, review the log file in the `logs/` directory to verify all flags were imported successfully. The log includes a summary report showing:
- Number of flags created
- Number of flags enabled in production
- Number of targeting rules applied (if using `--targeting-export`)
- Any failures or errors that occurred

If any flags failed to import or enable, you can manually create or enable them in the LaunchDarkly dashboard.

### Step 8: Import LaunchDarkly AI Configs (For Chatbot)

The chatbot feature uses LaunchDarkly AI Configs for dynamic prompt and model management. The export file is included in the repository.

**Import AI Configs:**

```bash
node scripts/import-ai-configs.js --project YOUR_PROJECT_KEY --export-file launchdarkly-ai-configs-export.json --environment production
```

**Configure Targeting Manually:**

After import, configure targeting in the LaunchDarkly dashboard:

1. Navigate to: `https://app.launchdarkly.com/YOUR_PROJECT_KEY/production/ai-configs/jobs-os-basic-chatbot/targeting`
2. Enable the AI Config (toggle "AI Config is" to **On**)
3. Add individual target: `user-001` → `combative_open_ai` variation
4. Set default rule: `standard_open_ai` variation

**Without AI Configs configured:** The chatbot may return errors or not function as expected.

### Step 9: Run the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### Step 10: Verify Installation

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Check LaunchDarkly Connection:** Open browser Developer Tools → Console tab. You should see LaunchDarkly connection messages (no errors).
3. **Verify Feature Flags:** Visit `/admin` to see the flag status dashboard. All 33 flags should be visible.
4. **Test User Switching:** Use the User Context Switcher on `/admin` to switch between demo users (Beta Tester, Premium User, Free User).

---

## Important Notes

- **Flag Targeting and Experiments:** The import script creates flags with default values. To copy targeting rules, use the `--targeting-export` option with an exported JSON file (see Step 5). Experiment configurations and AI Configs must be configured manually. Ensure your LaunchDarkly environment matches the expected configuration by reviewing the Assignment Docs page.
- **Exporting Flags with Targeting:** You can export all flags with their targeting rules using: `node scripts/export-flags-with-targeting.js --project YOUR_PROJECT_KEY --environment production`. This creates a JSON file that can be used with the import script's `--targeting-export` option.
- **AI Configs Setup:** The chatbot requires LaunchDarkly AI Configs to be manually configured in your LaunchDarkly project. See Step 6 above.
- **Environment Variables:** All sensitive keys are stored in `.env.local` which is gitignored. Never commit this file.

---

## For Reviewers: Key Admin Pages

The application includes admin pages built into the core app that can be accessed via URL or the sidebar navigation. **Suggest starting with the Assignment Docs page** as your primary guide during the review process. This document explains what was built as it pertains to the take-home assignment and provides the best way to confirm functionality. 

### Assignment Docs Page (Suggested Starting Point)
- **Purpose:** Comprehensive documentation of how the application satisfies LaunchDarkly technical exercise requirements
- **Route:** `/admin/assignment-satisfaction`
- **Suggested Use:** This page contains detailed explanations of all requirements, implementation details, and testing instructions
- **Access:** Navigate to `http://localhost:3000/admin/assignment-satisfaction` after starting the application

### Admin Examples Page (Visual Walkthrough)
- **Purpose:** Step-by-step walkthroughs with images demonstrating key features and LaunchDarkly integrations
- **Route:** `/admin/examples`
- **Also Available:** The same content is available as `FEATURE_WALKTHROUGH.md` in the repository root
- **Suggested Use:** Review this page to see visual examples of feature flag behavior, targeting, AI Configs, and experimentation in action
- **Access:** Navigate to `http://localhost:3000/admin/examples` after starting the application

### Admin Control Panel
- **Purpose:** Real-time flag monitoring, user context switching, and testing tools
- **Route:** `/admin`
- **Key Features:**
  - View all 33 feature flags and their status
  - Switch between demo user profiles to test targeting
  - Test AI Config variations with the chat interface
  - Visual demonstration of flag-controlled features
- **Access:** Navigate to `http://localhost:3000/admin` after starting the application


---

## Other Relevant Documentation

Additional markdown documentation files are available in the repository root for detailed reference:

### FEATURE_WALKTHROUGH.md
Step-by-step visual walkthroughs of key LaunchDarkly features and integrations with screenshots demonstrating Release & Remediate workflows, Targeting demonstrations, AI Configs setup, Experimentation, and Integration examples. NOTE: This is a copy of the Examples admin page. 

[View FEATURE_WALKTHROUGH.md](./FEATURE_WALKTHROUGH.md)

### PROJECT_DETAILS.md
Technical documentation and project overview covering LaunchDarkly features demonstrated, user context system, admin control panel, technical implementation details, and tech stack information.

[View PROJECT_DETAILS.md](./PROJECT_DETAILS.md)

---

Built to demonstrate comprehensive LaunchDarkly integration capabilities for feature flag management, targeting, experimentation, and AI Config management.
