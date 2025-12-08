# LaunchDarkly Targeting Setup Guide

This comprehensive guide explains how to set up and configure targeting rules in LaunchDarkly dashboard for the `show-premium-feature-demo` flag. This implementation demonstrates both individual targeting (targeting specific users) and rule-based targeting (targeting users based on attributes), which are core requirements for Part 2 of the LaunchDarkly technical exercise.

## Overview

The targeting system allows different users to see different variations of the premium feature based on their user context attributes. This is implemented using LaunchDarkly's powerful targeting capabilities, which evaluate user context against configured rules in real-time.

## Implementation Architecture

### User Context System

The application implements a comprehensive user context system with the following attributes:

- **key**: Unique user identifier (e.g., `user-001`)
- **email**: User email address
- **name**: User display name
- **role**: User role (`user`, `admin`, `beta-tester`)
- **subscriptionTier**: Subscription level (`free`, `premium`, `enterprise`)
- **signupDate**: Account creation date (ISO format)
- **betaTester**: Boolean flag for beta testers
- **companySize**: Company size category (`startup`, `small`, `medium`, `large`)
- **industry**: Industry classification (e.g., `Technology`, `Finance`, `Retail`)

### Demo Users

Three pre-configured demo users are available for testing:

1. **Beta Tester** (`user-001` / `beta.tester@example.com`)
   - Role: `beta-tester`
   - Subscription: `premium`
   - Beta Tester: `true`
   - Company Size: `medium`
   - Industry: `Technology`

2. **Premium User** (`user-002` / `premium.user@example.com`)
   - Role: `user`
   - Subscription: `premium`
   - Beta Tester: `false`
   - Company Size: `small`
   - Industry: `Finance`

3. **Free User** (`user-003` / `free.user@example.com`)
   - Role: `user`
   - Subscription: `free`
   - Beta Tester: `false`
   - Company Size: `startup`
   - Industry: `Retail`

## LaunchDarkly Dashboard Configuration

### Step 1: Access the Flag

1. Navigate to LaunchDarkly dashboard: https://app.launchdarkly.com
2. Select your project: `Interview_Job_Tracking_Project_Final`
3. Click on "Feature flags" in the left sidebar
4. Find and click on `show-premium-feature-demo` flag
5. Select the "Targeting" tab
6. Ensure you're viewing the correct environment (Production or Test)

### Step 2: Enable the Flag

1. At the top of the targeting configuration, toggle the flag **ON** for your environment
2. The flag must be ON for targeting rules to take effect

### Step 3: Configure Individual Targeting (Optional but Recommended)

Individual targeting allows you to target specific users by their key or email address. This is useful for testing and for targeting specific VIP users.

1. Scroll to the "Individual targeting" section
2. Click "Add individual target" (or the "+" button)
3. Add the following targets:
   - **Target 1**: User key `user-001` → Variation: "On"
   - **Target 2**: Email `beta.tester@example.com` → Variation: "On"
4. Click "Save" after adding each target

**Why Individual Targeting?**
- Provides a fallback for specific users
- Useful for testing specific user scenarios
- Can be used alongside rule-based targeting (individual targeting is evaluated first)

### Step 4: Configure Rule-Based Targeting

Rule-based targeting is the core of the implementation. It allows you to target users based on their context attributes, making it scalable and maintainable.

#### Rule 1: Premium Users

This rule targets all users with a premium subscription tier.

1. In the "Targeting" tab, click **"Add rule"** (or the "+" button next to "Rules")
2. Configure the rule:
   - **Rule name**: `Premium Users` (optional but helpful for documentation)
   - Click "Add condition"
   - **Attribute**: Type `subscriptionTier` in the search box and select it
   - **Operator**: Select `is one of` (or `is` if only one value)
   - **Values**: Enter `premium`
   - **Variation**: Select **"On"** (variation 0)
3. Click "Save"

**What this does**: Any user with `subscriptionTier: "premium"` will receive the flag ON, regardless of other attributes.

#### Rule 2: Beta Testers

This rule targets all users who are beta testers.

1. Click "Add rule" again
2. Configure the rule:
   - **Rule name**: `Beta Testers`
   - Click "Add condition"
   - **Attribute**: Type `betaTester` in the search box and select it
   - **Operator**: Select `is`
   - **Value**: Select or enter `true` (boolean value)
   - **Variation**: Select **"On"** (variation 0)
3. Click "Save"

**What this does**: Any user with `betaTester: true` will receive the flag ON, even if they don't have a premium subscription.

#### Rule 3: Beta Tester Role (Optional)

This rule provides an additional way to target beta testers by their role attribute.

1. Click "Add rule" again
2. Configure the rule:
   - **Rule name**: `Beta Tester Role`
   - Click "Add condition"
   - **Attribute**: Type `role` in the search box and select it
   - **Operator**: Select `is one of`
   - **Values**: Enter `beta-tester` (with hyphen)
   - **Variation**: Select **"On"** (variation 0)
3. Click "Save"

**What this does**: Any user with `role: "beta-tester"` will receive the flag ON.

### Step 5: Configure Default Rule (Critical Step)

The default rule (also called "fallthrough") determines what happens when no targeting rules match. This is a critical configuration that determines the default behavior.

1. Scroll to the "Default rule" section (at the bottom)
2. Click "Edit" on the default rule
3. Change from "Serve On" to **"Serve Off"** (variation 1)
4. Click "Save"

**Why this matters**: 
- If default is "Serve On", ALL users get the flag ON, making targeting rules ineffective
- If default is "Serve Off", only users matching targeting rules get the flag ON
- This is the key to making targeting work correctly

### Step 6: Save All Changes

1. Review your configuration in the visual editor
2. Click "Review and save" button at the bottom right
3. Confirm the changes

## Expected Behavior After Configuration

After completing the setup, the flag will behave as follows:

| User | Key | Email | Subscription | Beta Tester | Role | Flag Value | Reason |
|------|-----|-------|--------------|-------------|------|------------|--------|
| Beta Tester | `user-001` | `beta.tester@example.com` | `premium` | `true` | `beta-tester` | ✅ **ON** | Matches: Individual target, Premium rule, Beta Tester rule, Role rule |
| Premium User | `user-002` | `premium.user@example.com` | `premium` | `false` | `user` | ✅ **ON** | Matches: Premium rule |
| Free User | `user-003` | `free.user@example.com` | `free` | `false` | `user` | ❌ **OFF** | No rules match → Default rule (OFF) |

## Rule Evaluation Order

LaunchDarkly evaluates targeting in this specific order:

1. **Individual Targeting** (evaluated first)
   - If the user's key or email matches an individual target, that variation is used immediately
   - Individual targeting takes precedence over all rules

2. **Rules** (evaluated top to bottom)
   - Rules are evaluated in the order they appear
   - First matching rule wins
   - If a rule matches, evaluation stops (subsequent rules are not checked)

3. **Default Rule (Fallthrough)** (evaluated last)
   - If no individual targets match and no rules match, the default rule is used
   - This is where "Serve Off" ensures users without matching attributes don't get the feature

## Testing the Implementation

### Using the Admin Dashboard

The application includes a built-in testing interface at `/admin` that allows you to test targeting in real-time:

1. **Navigate to Admin Dashboard**
   - Go to `/admin` in your application
   - You'll see two cards side-by-side: "User Context Switcher" and "Targeting Demo"

2. **Switch User Contexts**
   - Use the "User Context Switcher" on the left to switch between demo users
   - The buttons are large and clearly labeled with user information
   - Click any user button to switch context

3. **Observe Real-Time Updates**
   - The "Targeting Demo" card on the right updates immediately when you switch users
   - No page reload is required - updates happen in real-time via LaunchDarkly's streaming API
   - Watch for:
     - Flag status indicator (ON/OFF badge)
     - Premium feature content appearing/disappearing
     - User context details updating

4. **Check Browser Console**
   - Open browser DevTools (F12) → Console tab
   - You'll see detailed logging:
     - `🔄 Switching user context` - When user is switched
     - `📤 Sending context to LaunchDarkly` - Context being sent
     - `✅ User identified with LaunchDarkly` - Confirmation
     - `🎯 Flag value after identify: true/false` - Flag evaluation result
     - `🎨 TargetingDemoCard render` - Component re-render with new values

### Expected Console Output

When switching to "Beta Tester":
```
🔄 Switching user context: {from: 'user-002', to: 'user-001', user: {...}}
📤 Sending context to LaunchDarkly: {key: 'user-001', email: 'beta.tester@example.com', ...}
✅ User identified with LaunchDarkly
🎯 Flag value after identify: true
🎯 Flag value after delay: true
🎨 TargetingDemoCard render: {showPremiumFeature: true, userContext: {...}}
```

When switching to "Free User":
```
🔄 Switching user context: {from: 'user-001', to: 'user-003', user: {...}}
📤 Sending context to LaunchDarkly: {key: 'user-003', email: 'free.user@example.com', ...}
✅ User identified with LaunchDarkly
🎯 Flag value after identify: false
🎯 Flag value after delay: false
🎨 TargetingDemoCard render: {showPremiumFeature: false, userContext: {...}}
```

### Testing on Landing Page

The premium feature is also implemented on the landing page:

1. Navigate to `/landing/job-tracker`
2. Switch user context in `/admin` first (or use browser console)
3. Navigate to `/landing/job-tracker`
4. The premium feature section will appear/disappear based on targeting rules
5. The section displays the current user context for verification

## Troubleshooting

### Flag Always Shows ON for All Users

**Problem:** Default rule is set to "Serve On"

**Symptoms:**
- All users see the flag as ON, regardless of targeting rules
- Console logs show flag value as `true` for all users
- Switching users doesn't change the flag value

**Solution:**
1. Go to LaunchDarkly dashboard → Flag → Targeting tab
2. Scroll to "Default rule" section
3. Click "Edit"
4. Change from "Serve On" to **"Serve Off"** (variation 1)
5. Click "Save"
6. Refresh your application

**Why This Happens:**
The default rule is the fallback when no targeting rules match. If it's set to "Serve On", all users get the flag ON by default, making targeting rules ineffective.

### Flag Doesn't Update When Switching Users

**Problem:** LaunchDarkly client might not be re-evaluating flags

**Symptoms:**
- User context switches successfully
- Console shows `✅ User identified with LaunchDarkly`
- But flag value doesn't change
- UI doesn't update

**Solutions:**

1. **Check Console Logs:**
   - Verify `identify()` is being called (look for `✅ User identified` log)
   - Check that flag value changes in console logs (`🎯 Flag value after identify`)
   - If flag value doesn't change, targeting rules might not be configured correctly

2. **Verify Targeting Rules:**
   - Check LaunchDarkly dashboard to ensure rules are saved
   - Verify attribute names match exactly (case-sensitive)
   - Verify values match exactly (e.g., `premium` not `Premium`)

3. **Check Flag Status:**
   - Ensure flag is ON in LaunchDarkly dashboard
   - Check that you're viewing the correct environment (Production vs Test)

4. **Hard Refresh:**
   - Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Clear browser cache if needed

5. **Check Network Tab:**
   - Open DevTools → Network tab
   - Filter by "launchdarkly"
   - Verify requests are being made
   - Check response status codes

### Rules Not Matching

**Problem:** Attribute names or values don't match user context

**Symptoms:**
- Targeting rules are configured but don't match users
- Flag value doesn't change when switching users
- Console shows flag value as default (OFF)

**Solutions:**

1. **Check Attribute Names (Case-Sensitive):**
   - `subscriptionTier` (not `subscription_tier` or `subscription`)
   - `betaTester` (not `beta_tester` or `isBetaTester`)
   - `role` (not `userRole`)

2. **Check Values (Exact Match Required):**
   - `premium` (not `Premium` or `PREMIUM`)
   - `true` (boolean, not string `"true"`)
   - `beta-tester` (with hyphen, not `beta_tester` or `betaTester`)

3. **Verify Context Being Sent:**
   - Check console logs for `📤 Sending context to LaunchDarkly`
   - Verify the context object matches what you expect
   - Compare with LaunchDarkly dashboard attribute names

4. **Test with Individual Targeting:**
   - Try adding individual targeting for a specific user
   - If individual targeting works but rules don't, the issue is with rule configuration
   - If neither works, check that flag is ON and default rule is OFF

### Console Shows Errors

**Problem:** LaunchDarkly client errors or network issues

**Common Errors:**

1. **"LaunchDarkly client not available"**
   - **Solution:** Ensure `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID` is set in `.env.local`
   - Restart dev server after adding environment variable

2. **Network errors or timeout**
   - **Solution:** Check internet connection
   - Verify LaunchDarkly service is accessible
   - Check firewall/proxy settings

3. **"Failed to identify user"**
   - **Solution:** Check that `ldClient` is initialized
   - Verify user context object is valid
   - Check console for specific error messages

## Advanced Configuration

### Using JSON Editor

For advanced users, you can configure targeting using JSON:

1. In LaunchDarkly dashboard → Flag → Targeting tab
2. Click "JSON" view (top right)
3. Paste the following JSON:

```json
{
  "on": true,
  "targets": [
    {
      "values": ["user-001"],
      "variation": 0
    },
    {
      "values": ["beta.tester@example.com"],
      "variation": 0
    }
  ],
  "rules": [
    {
      "description": "Premium Users",
      "variation": 0,
      "clauses": [
        {
          "contextKind": "user",
          "attribute": "subscriptionTier",
          "op": "in",
          "values": ["premium"],
          "negate": false
        }
      ],
      "trackEvents": false
    },
    {
      "description": "Beta Testers",
      "variation": 0,
      "clauses": [
        {
          "contextKind": "user",
          "attribute": "betaTester",
          "op": "in",
          "values": [true],
          "negate": false
        }
      ],
      "trackEvents": false
    }
  ],
  "fallthrough": {
    "variation": 1
  }
}
```

**Note:** The JSON editor might not support `targets` at the top level. If you see an error, configure individual targeting in the Visual editor and only use JSON for rules.

### Percentage Rollouts

You can also configure percentage-based rollouts:

1. In the "Default rule" section, click "Edit"
2. Instead of selecting a single variation, click "Percentage rollout"
3. Set percentages:
   - **"On"**: 25% (or any percentage)
   - **"Off"**: 75%
4. Click "Save"

**How It Works:**
- LaunchDarkly uses a consistent hash of the user key to determine which variation to serve
- The same user will always get the same variation (deterministic)
- Useful for gradual rollouts or A/B testing

## Additional Targeting Example: Analytics Page Access Control

Another excellent demonstration of targeting is the `show-analytics-page` flag, which shows page-level access control with email-based targeting.

### Configuration

1. Navigate to LaunchDarkly dashboard → `show-analytics-page` flag → "Targeting" tab
2. Ensure flag is ON for your environment
3. Click "Add rule"
4. Configure the rule:
   - **Rule name**: `Restrict Free Users`
   - Click "Add condition"
   - **Attribute**: `email` (type in search box and select)
   - **Operator**: `contains` (this is different from `is` or `in`)
   - **Value**: `free`
   - **Variation**: "Off" (variation 1)
5. Click "Save"
6. **Default Rule**: Set to "Serve On" (variation 0)

### How It Works

- **Users with "free" in email** (e.g., `free.user@example.com`):
  - Flag evaluates to OFF
  - Analytics page returns 404 (via `notFound()`)
  - Sidebar link to Analytics is hidden
  
- **All other users**:
  - Flag evaluates to ON
  - Analytics page is accessible
  - Sidebar link is visible

### Real-Time Demonstration

1. Navigate to `/admin` page
2. Switch to "Free User" (`free.user@example.com`)
3. Observe:
   - Analytics link disappears from sidebar immediately
   - Navigating to `/analytics` returns 404
4. Switch to "Premium User" or "Beta Tester"
5. Observe:
   - Analytics link appears in sidebar
   - Navigating to `/analytics` shows the page

### Why This Demo is Effective

- **Different Targeting Operator**: Uses `contains` instead of `is` or `in`, showing flexibility
- **Page-Level Control**: Demonstrates access control, not just content visibility
- **Visual Feedback**: Sidebar navigation provides immediate visual indication
- **Real-World Use Case**: Common pattern for restricting features by user tier
- **Real-Time Updates**: Changes happen instantly without page reload

### Expected Behavior

| User | Email | Email Contains "free"? | Flag Value | Analytics Page | Sidebar Link |
|------|-------|----------------------|------------|----------------|--------------|
| Beta Tester | `beta.tester@example.com` | ❌ No | ✅ **ON** | ✅ Accessible | ✅ Visible |
| Premium User | `premium.user@example.com` | ❌ No | ✅ **ON** | ✅ Accessible | ✅ Visible |
| Free User | `free.user@example.com` | ✅ Yes | ❌ **OFF** | ❌ 404 | ❌ Hidden |

## Next Steps

Once targeting is working correctly:

1. **Test with All Demo Users:**
   - Verify Beta Tester → Premium feature ON, Analytics ON
   - Verify Premium User → Premium feature ON, Analytics ON
   - Verify Free User → Premium feature OFF, Analytics OFF

2. **Verify Console Logs:**
   - Check that flag values change correctly
   - Verify user context is being sent properly
   - Confirm real-time updates are working

3. **Test Real-Time Updates:**
   - Switch users and verify UI updates without page reload
   - Check that TargetingDemoCard updates immediately
   - Verify sidebar links appear/disappear instantly
   - Verify landing page updates when navigating

4. **Apply to Other Flags:**
   - Use similar targeting patterns for other feature flags
   - Create rules based on different attributes
   - Test with different user segments
   - Experiment with different operators (`contains`, `startsWith`, `endsWith`, etc.)

5. **Production Considerations:**
   - Review targeting rules before deploying to production
   - Test with real user data (if available)
   - Monitor flag evaluation in LaunchDarkly dashboard
   - Set up alerts for unexpected flag behavior

### Step 1: Change Default Rule to "Off"

1. In LaunchDarkly dashboard, go to `show-premium-feature-demo` flag
2. Go to "Targeting" tab
3. Find the "Default rule" section
4. Change it from "Serve On" to **"Serve Off"**
5. This means: if no targeting rules match, the flag will be OFF

### Step 2: Add Rule-Based Targeting Rules

You have two options:

#### Option A: Use Visual Editor (Easier)

1. In the "Targeting" tab, click **"Add rule"** (or the "+" button)
2. **Rule 1: Premium Users**
   - Rule name: `Premium Users`
   - Click "Add condition"
   - Attribute: `subscriptionTier`
   - Operator: `is one of`
   - Values: `premium`
   - Variation: **"On"**
   - Click "Save"

3. **Rule 2: Beta Testers**
   - Click "Add rule" again
   - Rule name: `Beta Testers`
   - Click "Add condition"
   - Attribute: `betaTester`
   - Operator: `is`
   - Value: `true`
   - Variation: **"On"**
   - Click "Save"

4. **Rule 3: Beta Tester Role** (Optional)
   - Click "Add rule" again
   - Rule name: `Beta Tester Role`
   - Click "Add condition"
   - Attribute: `role`
   - Operator: `is one of`
   - Values: `beta-tester`
   - Variation: **"On"**
   - Click "Save"

#### Option B: Use JSON Editor

1. In the "Targeting" tab, click **"JSON"** view
2. Paste this JSON:

```json
{
  "on": true,
  "rules": [
    {
      "description": "Premium Users",
      "variation": 0,
      "clauses": [
        {
          "contextKind": "user",
          "attribute": "subscriptionTier",
          "op": "in",
          "values": ["premium"],
          "negate": false
        }
      ],
      "trackEvents": false
    },
    {
      "description": "Beta Testers",
      "variation": 0,
      "clauses": [
        {
          "contextKind": "user",
          "attribute": "betaTester",
          "op": "in",
          "values": [true],
          "negate": false
        }
      ],
      "trackEvents": false
    },
    {
      "description": "Beta Tester Role",
      "variation": 0,
      "clauses": [
        {
          "contextKind": "user",
          "attribute": "role",
          "op": "in",
          "values": ["beta-tester"],
          "negate": false
        }
      ],
      "trackEvents": false
    }
  ],
  "fallthrough": {
    "variation": 1
  }
}
```

**Important Notes:**
- `variation: 0` = "On" (true)
- `variation: 1` = "Off" (false)
- `fallthrough: { variation: 1 }` = Default to "Off" if no rules match

### Step 3: Keep Individual Targeting (Optional)

You can keep your individual targeting rules (`user-001` and `beta.tester@example.com`) as a backup, but the rule-based targeting should handle most cases.

## Expected Behavior After Setup

| User | Key | Email | Subscription | Beta Tester | Role | Flag Value |
|------|-----|-------|--------------|------------|------|------------|
| Beta Tester | `user-001` | `beta.tester@example.com` | `premium` | `true` | `beta-tester` | ✅ **ON** (matches all rules) |
| Premium User | `user-002` | `premium.user@example.com` | `premium` | `false` | `user` | ✅ **ON** (matches premium rule) |
| Free User | `user-003` | `free.user@example.com` | `free` | `false` | `user` | ❌ **OFF** (no rules match) |

## Testing

1. **Open browser console** (F12 → Console tab)
2. **Go to `/admin` page**
3. **Switch to "Beta Tester"** - You should see:
   - Console log: `🔄 Switching user context`
   - Console log: `📤 Sending context to LaunchDarkly`
   - Console log: `✅ User identified with LaunchDarkly`
   - Console log: `🎯 Flag value after identify: true`
   - TargetingDemoCard should show "FLAG ON" and premium content

4. **Switch to "Free User"** - You should see:
   - Console log: `🎯 Flag value after identify: false`
   - TargetingDemoCard should show "FLAG OFF" and hidden message

5. **Switch to "Premium User"** - You should see:
   - Console log: `🎯 Flag value after identify: true`
   - TargetingDemoCard should show "FLAG ON" and premium content

## Troubleshooting

### Flag Always Shows ON

**Problem:** Default rule is set to "Serve On"

**Solution:** Change default rule to "Serve Off" (variation 1)

### Flag Doesn't Update When Switching Users

**Problem:** LaunchDarkly client might be caching flag values

**Solution:**
1. Check browser console for errors
2. Verify `identify()` is being called (look for `✅ User identified` log)
3. Check that flag value changes in console logs
4. Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Rules Not Matching

**Problem:** Attribute names or values don't match

**Solution:**
1. Check console logs to see what context is being sent
2. Verify attribute names match exactly (case-sensitive):
   - `subscriptionTier` (not `subscription_tier` or `subscription`)
   - `betaTester` (not `beta_tester` or `isBetaTester`)
   - `role` (not `userRole`)
3. Verify values match exactly:
   - `premium` (not `Premium` or `PREMIUM`)
   - `true` (boolean, not string `"true"`)
   - `beta-tester` (with hyphen, not `beta_tester`)

## Rule Evaluation Order

LaunchDarkly evaluates rules in this order:

1. **Individual targeting** (checked first)
   - If user key or email matches, use that variation
2. **Rules** (evaluated top to bottom)
   - First matching rule wins
3. **Default rule (fallthrough)**
   - If no rules match, use this variation

## Next Steps

Once targeting is working correctly:
1. Test with all three demo users
2. Verify console logs show correct flag values
3. Confirm TargetingDemoCard updates in real-time
4. Apply similar targeting patterns to other feature flags

