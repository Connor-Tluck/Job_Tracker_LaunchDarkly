# Support Bot Events & Experiment Setup - Correct Workflow

This guide follows the correct LaunchDarkly workflow: **Track Events → Verify in Event Explorer → Create Metrics → Set Up Experiment**

## Overview

**Correct Workflow:**
1. ✅ Events are already tracked in code (using `ldClient.track()`)
2. ⏭️ Verify events appear in LaunchDarkly **Event Explorer**
3. ⏭️ Create **Metrics** based on events from Event Explorer
4. ⏭️ Create **Experiment** using those metrics

---

## Step 1: Verify Events Are Being Tracked

First, we need to make sure events are actually being sent to LaunchDarkly and appearing in the Event Explorer.

### Events Currently Tracked in Code

The Support Bot page tracks these events:

1. **`support-bot-page-view`** - When user loads/visits the Support Bot page
2. **`support-bot-message-sent`** - When user sends a message to the bot
3. **`support-bot-response-received`** - When bot responds to user
4. **`support-bot-error`** - When there's an error (optional)

### Test Event Tracking

1. **Make sure flag is ON**:
   - Go to LaunchDarkly dashboard
   - Find flag: `show-chatbot`
   - Turn it ON for your test environment

2. **Visit the Support Bot page**:
   - Navigate to `/landing/support-bot` in your app
   - Open browser DevTools → Console
   - Look for LaunchDarkly tracking logs (if enabled)

3. **Interact with the bot**:
   - Send a message
   - Wait for response
   - This should trigger multiple events

4. **Check Event Explorer**:
   - Go to LaunchDarkly dashboard
   - Click **"Event Explorer"** in the left sidebar (or "Events" → "Event Explorer")
   - Wait 1-2 minutes for events to process
   - You should see events like:
     - `support-bot-page-view`
     - `support-bot-message-sent`
     - `support-bot-response-received`

**✅ If events appear in Event Explorer, proceed to Step 2**  
**❌ If events don't appear, check:**
   - Flag is ON
   - User context is being sent
   - Browser console for errors
   - Network tab to see if events are being sent

---

## Step 2: Create Metrics from Events

Once events appear in Event Explorer, create metrics based on them.

### Navigate to Metrics

1. Go to LaunchDarkly dashboard
2. Click **"Metrics"** in the left sidebar
3. Click **"Create metric"** button

---

### Metric 1: Support Bot Page Views

**Purpose**: Count how many times users visit the Support Bot page

1. **Basic Information**:
   - **Metric name**: `Support Bot Page Views`
   - **Metric key**: `support-bot-page-view` (auto-generated, can customize)
   - **Description**: `Tracks when users visit the Support Bot page`

2. **What do you want to measure?**:
   - Select: **"Count"** (number of times the event occurs)

3. **Event Configuration**:
   - **Event name**: `support-bot-page-view` 
     - ⚠️ This should match the event name from Event Explorer exactly
     - You can select it from a dropdown if events are already tracked
   - **Target Type**: Leave blank OR select "Simple match" if URL filtering needed
   - **Target URL**: Leave blank (events are already filtered by event name)

4. Click **"Create metric"**

---

### Metric 2: Support Bot Messages Sent

**Purpose**: Count how many messages users send

1. Click **"Create metric"** again

2. **Basic Information**:
   - **Metric name**: `Support Bot Messages Sent`
   - **Metric key**: `support-bot-message-sent`
   - **Description**: `Tracks when users send a message to the Support Bot`

3. **What do you want to measure?**:
   - Select: **"Count"**

4. **Event Configuration**:
   - **Event name**: `support-bot-message-sent`
   - **Target Type**: Leave blank
   - **Target URL**: Leave blank

5. Click **"Create metric"**

---

### Metric 3: Support Bot Responses Received

**Purpose**: Count how many responses users receive

1. Click **"Create metric"** again

2. **Basic Information**:
   - **Metric name**: `Support Bot Responses Received`
   - **Metric key**: `support-bot-response-received`
   - **Description**: `Tracks when users receive a response from the Support Bot`

3. **What do you want to measure?**:
   - Select: **"Count"**

4. **Event Configuration**:
   - **Event name**: `support-bot-response-received`
   - **Target Type**: Leave blank
   - **Target URL**: Leave blank

5. Click **"Create metric"**

---

### Metric 4: Support Bot Engagement Rate (PRIMARY METRIC)

**Purpose**: Calculate conversion rate (percentage of page visitors who send messages)

1. Click **"Create metric"** again

2. **Basic Information**:
   - **Metric name**: `Support Bot Engagement Rate`
   - **Metric key**: `support-bot-engagement-rate`
   - **Description**: `Percentage of Support Bot page visitors who send at least one message`

3. **What do you want to measure?**:
   - Select: **"Conversion"** (this calculates a percentage)

4. **Conversion Configuration**:
   - **Baseline event**: `support-bot-page-view` (the starting event - page visit)
   - **Conversion event**: `support-bot-message-sent` (the goal event - sending a message)
   - **Description**: This calculates: (Users who sent messages) / (Users who viewed page) × 100

5. Click **"Create metric"**

**✅ You should now have 4 metrics total**

---

## Step 3: Verify Metrics Are Working

After creating metrics, verify they're collecting data:

1. **Go to Metrics dashboard**
2. **Click on each metric** you created
3. **Check if data is appearing**:
   - You should see event counts increasing
   - If no data appears, wait a few minutes and refresh
   - Make sure events are still being tracked in your app

**✅ If metrics show data, proceed to Step 4**  
**❌ If metrics show no data:**
   - Verify events are appearing in Event Explorer
   - Check event names match exactly (case-sensitive)
   - Wait 2-3 minutes for data to process
   - Test by visiting the Support Bot page again

---

## Step 4: Create Experiment

Now that metrics are working, create the experiment.

### Navigate to Experiments

1. Go to LaunchDarkly dashboard
2. Click **"Experiments"** in the left sidebar
3. Click **"Create experiment"** button

---

### Step 4.1: Basic Information

1. **Experiment name**: `Support Bot Feature Impact`
2. **Description**: `Measure user engagement with the Support Bot feature. Compares users with access (flag ON) vs users without access (flag OFF).`
3. **Project**: Select `Interview_Job_Tracking_Project_Final`
4. Click **"Next"**

---

### Step 4.2: Select Feature Flag

1. **Feature flag**: Select `show-chatbot` from dropdown
2. **Environment**: Select `Production` (or `Test` for testing)
3. Click **"Next"**

---

### Step 4.3: Configure Variations

1. **Variation 1 (Control Group)**:
   - **Name**: `Control - No Support Bot`
   - **Variation**: Select **"Off"** (false)
   - **Description**: `Users without access to Support Bot`

2. **Variation 2 (Treatment Group)**:
   - **Name**: `Treatment - With Support Bot`
   - **Variation**: Select **"On"** (true)
   - **Description**: `Users with access to Support Bot`

3. Click **"Next"**

---

### Step 4.4: Select Metrics

1. **Add Metrics**: Click **"Add metric"** and select each metric:
   - ✅ `Support Bot Page Views`
   - ✅ `Support Bot Messages Sent`
   - ✅ `Support Bot Responses Received`
   - ✅ `Support Bot Engagement Rate` ⭐ **Mark as PRIMARY**

2. **Set Primary Metric**:
   - Find `Support Bot Engagement Rate` in the list
   - Click the star icon ⭐ or select "Primary"
   - **Why**: This is the most important metric - measures actual engagement

3. Click **"Next"**

---

### Step 4.5: Configure Targeting

1. **Traffic Allocation**:
   - Set to **50%** (or your preferred split)
   - This means:
     - 50% of users get flag **ON** (treatment group)
     - 50% of users get flag **OFF** (control group)

2. **Targeting Rules**:
   - The experiment will use existing targeting rules for `show-chatbot`
   - Or create experiment-specific rules if needed

3. Click **"Next"**

---

### Step 4.6: Review and Launch

1. **Review Summary**:
   - ✅ Experiment name
   - ✅ Feature flag: `show-chatbot`
   - ✅ 2 variations (Control: Off, Treatment: On)
   - ✅ 4 metrics (with Engagement Rate as primary)
   - ✅ 50% traffic allocation

2. **Launch**:
   - Click **"Launch experiment"** button
   - Experiment starts immediately

---

## Step 5: Monitor Results

### Viewing Results

1. Go to **"Experiments"** in sidebar
2. Click on: `Support Bot Feature Impact`
3. View dashboard with:
   - **Primary Metric**: Engagement Rate comparison
   - **Secondary Metrics**: Page views, messages, responses

### Key Things to Watch

1. **Engagement Rate** (Primary):
   - Higher in Treatment = ✅ Positive Impact
   - Similar in both = ⚠️ No Impact
   - Lower in Treatment = ❌ Negative Impact

2. **Sample Size**:
   - Wait for at least **100 users per group**
   - LaunchDarkly shows statistical significance

3. **Statistical Significance**:
   - Look for p-value < 0.05 (95% confidence)
   - LaunchDarkly highlights when significant

---

## Troubleshooting

### Events Not Appearing in Event Explorer

**Problem**: Events tracked but not showing in Event Explorer

**Solutions**:
1. ✅ Verify flag is ON for test users
2. ✅ Check user context is being sent (check browser console)
3. ✅ Wait 1-2 minutes for events to process
4. ✅ Check browser console for tracking errors
5. ✅ Verify `ldClient` is initialized (check LaunchDarklyProvider)

### Metrics Not Showing Data

**Problem**: Metrics created but showing no data

**Solutions**:
1. ✅ Verify events appear in Event Explorer first
2. ✅ Check event names match exactly (case-sensitive)
3. ✅ Wait 2-3 minutes for data to process
4. ✅ Test by visiting Support Bot page again
5. ✅ Check metric configuration matches event names

### Experiment Not Collecting Data

**Problem**: Experiment running but no data

**Solutions**:
1. ✅ Verify metrics are collecting data (Step 3)
2. ✅ Check flag is ON for treatment group
3. ✅ Verify traffic allocation is set correctly
4. ✅ Check targeting rules include test users
5. ✅ Wait longer for data to accumulate

---

## Quick Reference: Event Names

Make sure these match exactly in code and LaunchDarkly:

| Event Name | When It Fires | Metric Name |
|------------|---------------|-------------|
| `support-bot-page-view` | User visits Support Bot page | Support Bot Page Views |
| `support-bot-message-sent` | User sends a message | Support Bot Messages Sent |
| `support-bot-response-received` | Bot responds to user | Support Bot Responses Received |

**Conversion Metric**:
- Baseline: `support-bot-page-view`
- Conversion: `support-bot-message-sent`
- Result: Support Bot Engagement Rate

---

## Summary Checklist

Follow this order:

- [ ] **Step 1**: Verify events appear in Event Explorer
- [ ] **Step 2**: Create 4 metrics from events (3 count + 1 conversion)
- [ ] **Step 3**: Verify metrics are collecting data
- [ ] **Step 4**: Create experiment with flag and metrics
- [ ] **Step 5**: Monitor results and wait for significance

**Key Point**: Always verify events in Event Explorer FIRST before creating metrics!

