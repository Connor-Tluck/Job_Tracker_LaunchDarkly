# LaunchDarkly Access Token Guide

## Removing Your Current Access Token

If you need to remove your existing access token (e.g., for a new project):

```bash
ldcli config --unset access-token
```

This will remove the stored token from your CLI configuration.

## Finding/Creating Access Tokens in LaunchDarkly

### Option 1: Find Existing Tokens

1. **Log in to LaunchDarkly**:
   - Go to https://app.launchdarkly.com
   - Sign in to your account

2. **Navigate to Authorization Settings**:
   - Click the **gear icon** (⚙️) in the left sidebar
   - Select **Organization settings**
   - Click on **Authorization** in the left menu

3. **View Your Tokens**:
   - You'll see a list of all access tokens
   - Each token shows:
     - Name/Description
     - Creation date
     - Last used date
     - Roles/permissions
   - **Note**: Tokens are only shown once when created - you can't see the actual token value again

### Option 2: Create a New Access Token

1. **Go to Authorization Settings** (same as above):
   - Gear icon → Organization settings → Authorization

2. **Create New Token**:
   - Click the **"Create token"** button (usually at the top right)
   - Fill in the form:
     - **Name**: Give it a descriptive name (e.g., "Job Tracker CLI Token")
     - **Role**: Select appropriate role (usually "Writer" or "Admin" for CLI operations)
     - **API version**: Select the API version (usually "20220603" or latest)
     - **Service token**: Check this if it's for automated/CI use

3. **Save and Copy**:
   - Click **"Save token"**
   - **⚠️ IMPORTANT**: Copy the token immediately - it's only shown once!
   - Store it securely (password manager, etc.)

4. **Use the Token**:
   - Set it via environment variable:
     ```bash
     export LD_ACCESS_TOKEN=your_token_here
     ```
   - Or use `ldcli login` which will prompt you to enter it

## Re-authenticating After Removing Token

After removing the token, you can re-authenticate in two ways:

### Method 1: Interactive Login (Recommended)
```bash
ldcli login
```
This will open your browser to authenticate, or prompt you to enter a token.

### Method 2: Set Token Directly
```bash
export LD_ACCESS_TOKEN=your_new_token_here
```

Or set it in the config:
```bash
ldcli config --set access-token your_new_token_here
```

## Quick Reference

**Remove token:**
```bash
ldcli config --unset access-token
```

**View current config:**
```bash
ldcli config --list
```

**Set token:**
```bash
ldcli config --set access-token YOUR_TOKEN
```

**Login interactively:**
```bash
ldcli login
```

## Token Permissions

For importing flags, you need a token with **Writer** or **Admin** role. Reader-only tokens won't work for creating flags.

## Security Notes

- ⚠️ **Never commit tokens to git** - use environment variables or secure storage
- ⚠️ **Tokens are shown only once** - save them immediately when created
- ⚠️ **Delete unused tokens** - clean up old tokens you no longer need
- ✅ **Use service tokens** for automated/CI workflows
- ✅ **Use descriptive names** so you know what each token is for

