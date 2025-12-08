# Support Bot Experiment Setup - Step-by-Step Guide

This is a detailed, step-by-step guide to set up an experiment for the Support Bot feature tied to the `show-chatbot` flag.

## Overview

**Feature Flag**: `show-chatbot`  
**Feature**: Support Bot (accessible at `/landing/support-bot`)  
**Experiment Goal**: Measure user engagement with the Support Bot feature

**Events Being Tracked** (already implemented in code):
- `support-bot-page-view` - When user visits the Support Bot page
- `support-bot-message-sent` - When user sends a message
- `support-bot-response-received` - When bot responds to user

---

## Step 1: Create Metrics in LaunchDarkly

Metrics measure the events we're tracking. You need to create 4 metrics.

### Navigate to Metrics

1. Go to your LaunchDarkly dashboard: https://app.launchdarkly.com
2. Select your project: `Interview_Job_Tracking_Project_Final`
3. Click **"Metrics"** in the left sidebar
4. Click the **"Create metric"** button (top right)

---

### Metric 1: Support Bot Page Views

**Purpose**: Count how many users visit the Support Bot page

1. **Basic Information**:
   - **Metric name**: `Support Bot Page Views`
   - **Metric key**: `support-bot-page-view` ⚠️ **MUST MATCH EXACTLY** (case-sensitive)
   - **Description**: `Tracks when users visit the Support Bot page`

2. **Metric Type**:
   - Select: **"Count"** (this counts occurrences of the event)

3. **Event Configuration**:
   - **Event name**: `support-bot-page-view` ⚠️ **MUST MATCH EXACTLY**
   - Leave other fields as default

4. Click **"Create metric"**

**✅ Verification**: You should see the metric in your metrics list.

---

### Metric 2: Support Bot Messages Sent

**Purpose**: Count how many messages users send to the bot

1. Click **"Create metric"** again

2. **Basic Information**:
   - **Metric name**: `Support Bot Messages Sent`
   - **Metric key**: `support-bot-message-sent` ⚠️ **MUST MATCH EXACTLY**
   - **Description**: `Tracks when users send a message to the Support Bot`

3. **Metric Type**:
   - Select: **"Count"**

4. **Event Configuration**:
   - **Event name**: `support-bot-message-sent` ⚠️ **MUST MATCH EXACTLY**

5. Click **"Create metric"**

---

### Metric 3: Support Bot Responses Received

**Purpose**: Count how many responses users receive from the bot

1. Click **"Create metric"** again

2. **Basic Information**:
   - **Metric name**: `Support Bot Responses Received`
   - **Metric key**: `support-bot-response-received` ⚠️ **MUST MATCH EXACTLY**
   - **Description**: `Tracks when users receive a response from the Support Bot`

3. **Metric Type**:
   - Select: **"Count"**

4. **Event Configuration**:
   - **Event name**: `support-bot-response-received` ⚠️ **MUST MATCH EXACTLY**

5. Click **"Create metric"**

---

### Metric 4: Support Bot Engagement Rate (PRIMARY METRIC)

**Purpose**: Calculate the percentage of page visitors who send at least one message (conversion rate)

1. Click **"Create metric"** again

2. **Basic Information**:
   - **Metric name**: `Support Bot Engagement Rate`
   - **Metric key**: `support-bot-engagement-rate`
   - **Description**: `Percentage of Support Bot page visitors who send at least one message`

3. **Metric Type**:
   - Select: **"Conversion"** (this calculates a percentage)

4. **Conversion Configuration**:
   - **Baseline event**: `support-bot-page-view` (the starting event)
   - **Conversion event**: `support-bot-message-sent` (the goal event)
   - **Description**: This calculates: (Users who sent messages) / (Users who viewed page) × 100

5. Click **"Create metric"**

**✅ You should now have 4 metrics total**

---

## Step 2: Verify Your Feature Flag

Before creating the experiment, make sure your flag is set up correctly.

1. Go to **"Feature flags"** in the left sidebar
2. Find and click on: `show-chatbot`
3. Verify:
   - Flag exists and is active
   - Has two variations: **"On"** (true) and **"Off"** (false)
   - Is available in your environment (Production or Test)

**Note**: The flag can have targeting rules set up (for premium users, beta testers, etc.). The experiment will use these same rules.

---

## Step 3: Create the Experiment

Now we'll create the experiment that uses the flag and metrics.

### Navigate to Experiments

1. Click **"Experiments"** in the left sidebar
2. Click **"Create experiment"** button (top right)

---

### Step 3.1: Basic Information

1. **Experiment name**: `Support Bot Feature Impact`
2. **Description**: `Measure user engagement with the Support Bot feature. Compares users with access (flag ON) vs users without access (flag OFF).`
3. **Project**: Select `Interview_Job_Tracking_Project_Final`
4. Click **"Next"**

---

### Step 3.2: Select Feature Flag

1. **Feature flag**: Select `show-chatbot` from the dropdown
2. **Environment**: Select `Production` (or `Test` if you want to test first)
3. Click **"Next"**

---

### Step 3.3: Configure Variations

This defines what each group in the experiment sees.

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

### Step 3.4: Select Metrics

This is where you add the metrics you created.

1. **Add Metrics**: Click the **"Add metric"** button and select each metric:
   - ✅ `Support Bot Page Views`
   - ✅ `Support Bot Messages Sent`
   - ✅ `Support Bot Responses Received`
   - ✅ `Support Bot Engagement Rate` ⭐ **Mark this as PRIMARY**

2. **Set Primary Metric**:
   - Find `Support Bot Engagement Rate` in the list
   - Click the star icon ⭐ or select "Primary" to mark it as the primary metric
   - **Why**: This is the most important metric - it measures actual engagement

3. Click **"Next"**

---

### Step 3.5: Configure Targeting

This determines which users are included in the experiment.

1. **Traffic Allocation**:
   - Set to **50%** (or your preferred split)
   - This means:
     - 50% of users get flag **ON** (treatment group)
     - 50% of users get flag **OFF** (control group)

2. **Targeting Rules**:
   - The experiment will use the existing targeting rules for `show-chatbot`
   - If you have targeting rules already set up (e.g., premium users, beta testers), those will apply
   - **For testing**: You can create experiment-specific rules, but using existing rules is recommended

3. **Optional - Custom Targeting**:
   - If you want to test with specific user segments, you can add rules here
   - Example: Only test with users who have `subscriptionTier: 'premium'`

4. Click **"Next"**

---

### Step 3.6: Review and Launch

1. **Review Summary**:
   - Check that all settings are correct:
     - ✅ Experiment name
     - ✅ Feature flag: `show-chatbot`
     - ✅ 2 variations (Control: Off, Treatment: On)
     - ✅ 4 metrics (with Engagement Rate as primary)
     - ✅ 50% traffic allocation

2. **Launch**:
   - Click **"Launch experiment"** button
   - The experiment will start immediately

---

## Step 4: Monitor the Experiment

Once launched, you can monitor results in real-time.

### Viewing Results

1. Go to **"Experiments"** in the sidebar
2. Click on your experiment: `Support Bot Feature Impact`
3. You'll see a dashboard with:

   **Primary Metric (Engagement Rate)**:
   - Comparison between Control (OFF) and Treatment (ON) groups
   - Shows percentage of users who engaged
   - Example: "Control: 15% engagement | Treatment: 32% engagement"

   **Secondary Metrics**:
   - Page views count for each group
   - Messages sent count
   - Responses received count

### Key Metrics to Watch

1. **Engagement Rate** (Primary):
   - **Higher in Treatment = Positive Impact** ✅
   - **Similar in both = No Impact** ⚠️
   - **Lower in Treatment = Negative Impact** ❌

2. **Sample Size**:
   - Wait for at least **100 users per group** for meaningful results
   - LaunchDarkly will show when results are statistically significant

3. **Statistical Significance**:
   - Look for p-value < 0.05 (95% confidence)
   - LaunchDarkly will highlight when results are significant

### What Good Results Look Like

**✅ Positive Impact Example**:
- Control group (no Support Bot): 10% engagement rate
- Treatment group (with Support Bot): 25% engagement rate
- Statistically significant (p < 0.05)
- **Conclusion**: Support Bot increases engagement by 15 percentage points

---

## Step 5: Verify Events Are Being Tracked

To make sure everything is working, test the tracking:

1. **Test as a User with Flag ON**:
   - Visit `/landing/support-bot` (you should see the page)
   - Open browser DevTools → Console
   - You should see LaunchDarkly tracking events (if logging is enabled)
   - Send a message in the bot
   - Wait 2-3 minutes, then check the experiment dashboard

2. **Check Event Names Match**:
   - Events in code: `support-bot-page-view`, `support-bot-message-sent`, `support-bot-response-received`
   - Metrics in LaunchDarkly: Must have **exact same names** (case-sensitive)

3. **Verify Events Appear**:
   - Go to experiment dashboard
   - Events should start appearing within a few minutes
   - If no events appear after 5 minutes, check:
     - Event names match exactly
     - User context is being sent
     - Flag is ON for test users

---

## Step 6: Make Data-Driven Decisions

After running the experiment for **1-2 weeks** (or until statistically significant):

### Decision Criteria

**If Engagement Rate is Higher in Treatment Group**:
- ✅ Feature has positive impact
- ✅ Roll out to all users (keep flag ON)
- ✅ Document the improvement

**If No Significant Difference**:
- ⚠️ Feature may need improvement
- ⚠️ Consider testing different variations
- ⚠️ Gather user feedback

**If Engagement Rate is Lower**:
- ❌ Feature may not be valuable
- ❌ Consider removing or redesigning
- ❌ Keep flag OFF until improvements

### Ending the Experiment

1. Go to experiment dashboard
2. Click **"End experiment"**
3. Choose winning variation (or keep both if no clear winner)
4. Update flag targeting based on results

---

## Troubleshooting

### Events Not Appearing

**Problem**: Events tracked but not showing in LaunchDarkly

**Solutions**:
1. ✅ Verify event names match **exactly** (case-sensitive):
   - Code: `support-bot-page-view`
   - Metric: `support-bot-page-view`
2. ✅ Check metrics are configured with correct event names
3. ✅ Ensure user context is being sent (check browser console)
4. ✅ Wait 2-3 minutes for events to process
5. ✅ Verify flag is ON for test users

### Low Sample Size

**Problem**: Not enough users in experiment

**Solutions**:
1. Increase traffic allocation (e.g., 50% → 75%)
2. Run experiment longer (1-2 weeks minimum)
3. Expand targeting rules to include more users
4. Verify flag is actually ON for treatment group

### No Statistical Significance

**Problem**: Results not significant after running

**Solutions**:
1. Run experiment longer (need more data)
2. Increase sample size (more users)
3. Check if there's actually a difference (may be genuinely no impact)
4. Verify metrics are measuring the right thing

---

## Quick Reference: Event Names

Make sure these match exactly in your code and LaunchDarkly metrics:

| Event Name | Metric Name | Type |
|------------|-------------|------|
| `support-bot-page-view` | Support Bot Page Views | Count |
| `support-bot-message-sent` | Support Bot Messages Sent | Count |
| `support-bot-response-received` | Support Bot Responses Received | Count |
| N/A (conversion) | Support Bot Engagement Rate | Conversion |

**Conversion Metric Configuration**:
- Baseline: `support-bot-page-view`
- Conversion: `support-bot-message-sent`

---

## Summary Checklist

Before launching, verify:

- [ ] Created 4 metrics with correct event names
- [ ] Set `Support Bot Engagement Rate` as conversion metric
- [ ] Created experiment with `show-chatbot` flag
- [ ] Configured 2 variations (Control: Off, Treatment: On)
- [ ] Added all 4 metrics to experiment
- [ ] Set Engagement Rate as primary metric
- [ ] Set traffic allocation (50% recommended)
- [ ] Reviewed and launched experiment
- [ ] Tested that events are being tracked
- [ ] Monitoring results in experiment dashboard

---

## Next Steps After Setup

1. **Monitor Daily**: Check experiment dashboard for updates
2. **Wait for Significance**: Don't make decisions until statistically significant
3. **Document Results**: Record findings and insights
4. **Make Decision**: Roll out, improve, or remove based on results
5. **Iterate**: Test variations or improvements if needed

Good luck with your experiment! 🚀

