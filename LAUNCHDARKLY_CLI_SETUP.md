# LaunchDarkly CLI Setup Guide

This guide will help you import all 30 feature flags into LaunchDarkly using the CLI, avoiding manual creation.

## Prerequisites

1. **LaunchDarkly Account**: You need an active LaunchDarkly account
2. **Project Created**: Create a project in LaunchDarkly (or use an existing one)
3. **Client-side ID**: Already added to your `.env.local` file

## Step 1: Install LaunchDarkly CLI

### macOS
```bash
brew install launchdarkly/tap/ldcli
```

### Linux
```bash
# Download the latest release
curl -L https://github.com/launchdarkly/ldcli/releases/latest/download/ldcli_linux_amd64.tar.gz | tar -xz
sudo mv ldcli /usr/local/bin/
```

### Windows
Download from: https://github.com/launchdarkly/ldcli/releases

Or use Chocolatey:
```powershell
choco install ldcli
```

### Verify Installation
```bash
ldcli --version
```

## Step 2: Authenticate with LaunchDarkly

You have two options:

### Option A: Interactive Login (Recommended)
```bash
ldcli login
```
This will open your browser to authenticate.

### Option B: Use Access Token
1. Get your access token from LaunchDarkly:
   - Go to https://app.launchdarkly.com/settings/authorization
   - Create a new token or use an existing one
   - **IMPORTANT**: Make sure the token has **Writer** or **Admin** role (Reader-only tokens won't work for creating flags)
2. Set the token:
```bash
export LD_ACCESS_TOKEN=your_access_token_here
```

**⚠️ Permission Issues**: If you see "Access to the requested resource was denied (code: forbidden)" errors, your access token doesn't have sufficient permissions. Create a new token with Writer or Admin role.

## Step 3: Get Your Project Key

1. Go to your LaunchDarkly project: https://app.launchdarkly.com
2. Click on your project
3. The project key is shown in the URL or project settings
   - Example: If URL is `https://app.launchdarkly.com/default/projects/my-project`, the key is `my-project`

## Step 4: Convert Flags to CLI Format

The flags are already in the correct format, but you can regenerate the CLI format file:

```bash
npm run ld:convert
```

This creates `launchdarkly/flags-cli-format.json` with all flags in the LaunchDarkly CLI format.

## Step 5: Import All Flags

### Using npm script (Recommended)
```bash
npm run ld:import -- --project YOUR_PROJECT_KEY
```

Replace `YOUR_PROJECT_KEY` with your actual LaunchDarkly project key.

### Optional: Set Environment Defaults
If you want to set all flags to ON for a specific environment:

```bash
npm run ld:import -- --project YOUR_PROJECT_KEY --environment YOUR_ENVIRONMENT_KEY
```

### Using the script directly
```bash
node scripts/import-flags.js --project YOUR_PROJECT_KEY
```

### Using the shell script
```bash
chmod +x scripts/import-flags.sh
./scripts/import-flags.sh --project YOUR_PROJECT_KEY
```

## What Gets Created

The script will create all 30 feature flags with:
- ✅ Correct flag keys (e.g., `show-dashboard-page`)
- ✅ Descriptive names and descriptions
- ✅ Category tags for organization
- ✅ Boolean variations (On/Off)
- ✅ Default values set to `true` (ON)
- ✅ Client-side availability enabled (for React SDK)

## Flag Categories

The flags are organized into these categories (as tags):
- `page-access` - 12 flags
- `dashboard-components` - 6 flags
- `feature-toggles` - 6 flags
- `job-detail-components` - 4 flags
- `admin-system` - 1 flag

## Troubleshooting

### "Flag already exists" errors
If a flag already exists, the script will skip it. This is safe - it means the flag is already in LaunchDarkly.

### "ldcli: command not found"
Make sure the LaunchDarkly CLI is installed and in your PATH. Verify with:
```bash
ldcli --version
```

### "Authentication failed"
Make sure you're logged in:
```bash
ldcli login
```
Or set your access token:
```bash
export LD_ACCESS_TOKEN=your_token
```

### "Project not found"
Double-check your project key. You can list your projects:
```bash
ldcli projects list
```

## Verify Import

After importing, you can verify the flags were created:

1. **In LaunchDarkly Dashboard**:
   - Go to https://app.launchdarkly.com
   - Navigate to your project
   - Click on "Feature flags" in the sidebar
   - You should see all 30 flags listed

2. **Using CLI**:
```bash
ldcli flags list --project YOUR_PROJECT_KEY
```

3. **In Your App**:
   - Start your dev server: `npm run dev`
   - Visit `/admin` (if `show-admin-page` is enabled)
   - You should see all flags with their current values

## Next Steps

1. ✅ All flags are created with default value `true` (ON)
2. ✅ You can toggle flags in the LaunchDarkly dashboard
3. ✅ Flags are available to your React app via the client-side SDK
4. ✅ Test your app to ensure flags are working correctly

## Additional Resources

- [LaunchDarkly CLI Documentation](https://docs.launchdarkly.com/home/getting-started/ldcli-commands)
- [LaunchDarkly Feature Flags Guide](https://docs.launchdarkly.com/home/creating-flags/feature-flags)
- [LaunchDarkly React SDK](https://docs.launchdarkly.com/sdk/client-side/react/react-web)

