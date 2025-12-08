# LaunchDarkly Experimentation Setup Guide

This guide explains how to set up an experiment in LaunchDarkly to measure the impact of the Support Bot feature. This addresses the Extra Credit: Experimentation requirement from the take-home assignment.

## Overview

The Support Bot feature is controlled by the `show-chatbot` flag and includes built-in event tracking for experiment metrics. This allows you to measure:
- How many users visit the Support Bot page
- How many users send messages
- How many users receive responses
- Overall engagement with the feature

## Prerequisites

1. ✅ Support Bot feature implemented and accessible via `/landing/support-bot`
2. ✅ Feature flag `show-chatbot` controls access
3. ✅ Event tracking implemented in the Support Bot page
4. ✅ LaunchDarkly account with access to create metrics and experiments

## Step 1: Create Metrics in LaunchDarkly

Metrics measure user behavior and help you understand the impact of your feature. We'll create metrics for Support Bot engagement.

### Metric 1: Support Bot Page Views

1. **Navigate to Metrics**
   - Go to LaunchDarkly dashboard
   - Click "Metrics" in the left sidebar
   - Click "Create metric" button

2. **Configure the Metric**
   - **Metric name**: `Support Bot Page Views`
   - **Metric key**: `support-bot-page-view` (must match event name in code)
   - **Description**: "Tracks when users visit the Support Bot page"
   - **Event name**: `support-bot-page-view`
   - **Metric type**: Select "Count" (number of times the event occurs)
   - Click "Create metric"

### Metric 2: Support Bot Messages Sent

1. **Create Another Metric**
   - Click "Create metric" again
   - **Metric name**: `Support Bot Messages Sent`
   - **Metric key**: `support-bot-message-sent`
   - **Description**: "Tracks when users send a message to the Support Bot"
   - **Event name**: `support-bot-message-sent`
   - **Metric type**: Select "Count"
   - Click "Create metric"

### Metric 3: Support Bot Responses Received

1. **Create Third Metric**
   - Click "Create metric" again
   - **Metric name**: `Support Bot Responses Received`
   - **Metric key**: `support-bot-response-received`
   - **Description**: "Tracks when users receive a response from the Support Bot"
   - **Event name**: `support-bot-response-received`
   - **Metric type**: Select "Count"
   - Click "Create metric"

### Metric 4: Support Bot Engagement Rate (Conversion Metric)

1. **Create Conversion Metric**
   - Click "Create metric" again
   - **Metric name**: `Support Bot Engagement Rate`
   - **Metric key**: `support-bot-engagement-rate`
   - **Description**: "Percentage of page visitors who send at least one message"
   - **Metric type**: Select "Conversion"
   - **Conversion event**: `support-bot-message-sent`
   - **Baseline event**: `support-bot-page-view`
   - Click "Create metric"

**What This Measures:**
- Conversion rate = (Users who sent messages) / (Users who viewed page) × 100
- Higher conversion rate = more engaged users
- This is the key metric for measuring feature impact

## Step 2: Create an Experiment

Experiments allow you to A/B test your feature and measure its impact using metrics.

### Create the Experiment

1. **Navigate to Experiments**
   - Go to LaunchDarkly dashboard
   - Click "Experiments" in the left sidebar
   - Click "Create experiment" button

2. **Basic Information**
   - **Experiment name**: `Support Bot Feature Impact`
   - **Description**: "Measure the impact of the Support Bot feature on user engagement"
   - **Project**: Select your project (`Interview_Job_Tracking_Project_Final`)
   - Click "Next"

3. **Select Feature Flag**
   - **Feature flag**: Select `show-chatbot`
   - **Environment**: Select `Production` (or `Test` for testing)
   - Click "Next"

4. **Configure Variations**
   - **Variation 1 (Control)**: "Off" - Users without Support Bot access
   - **Variation 2 (Treatment)**: "On" - Users with Support Bot access
   - Click "Next"

5. **Select Metrics**
   - Add the metrics you created:
     - ✅ `Support Bot Page Views`
     - ✅ `Support Bot Messages Sent`
     - ✅ `Support Bot Responses Received`
     - ✅ `Support Bot Engagement Rate` (Primary metric)
   - **Primary metric**: Select `Support Bot Engagement Rate`
   - Click "Next"

6. **Configure Targeting**
   - **Traffic allocation**: 50% (or your preferred split)
     - 50% of users get flag ON (treatment group)
     - 50% of users get flag OFF (control group)
   - **Targeting rules**: You can use existing targeting rules or create experiment-specific rules
   - Click "Next"

7. **Review and Launch**
   - Review your experiment configuration
   - Click "Launch experiment"

## Step 3: Monitor the Experiment

Once the experiment is running, you can monitor results in real-time.

### Viewing Results

1. **Go to Experiments Dashboard**
   - Click "Experiments" in LaunchDarkly sidebar
   - Click on your experiment: `Support Bot Feature Impact`

2. **Key Metrics to Watch**
   - **Primary Metric (Engagement Rate)**:
     - Compare engagement rate between control (OFF) and treatment (ON) groups
     - Higher engagement in treatment group = positive impact
   - **Secondary Metrics**:
     - Page views: How many users accessed the feature
     - Messages sent: How many users engaged with the bot
     - Responses received: How many interactions completed

3. **Statistical Significance**
   - LaunchDarkly will show when results are statistically significant
   - Wait for sufficient sample size (typically 100+ users per variation)
   - Look for confidence intervals and p-values

### Interpreting Results

**Positive Impact:**
- Treatment group (Support Bot ON) has higher engagement rate than control
- More messages sent in treatment group
- Statistically significant difference (p < 0.05)

**No Impact:**
- Similar engagement rates between groups
- No statistically significant difference
- May indicate feature needs improvement or different positioning

**Negative Impact:**
- Control group has higher engagement (rare but possible)
- May indicate feature is confusing or not valuable
- Consider redesigning or removing feature

## Step 4: Make Data-Driven Decisions

After running the experiment for sufficient time (typically 1-2 weeks), you can make informed decisions.

### Decision Criteria

1. **If Engagement Rate is Higher in Treatment Group:**
   - ✅ Feature has positive impact
   - ✅ Consider rolling out to all users
   - ✅ Keep flag ON for all targeted users

2. **If No Significant Difference:**
   - ⚠️ Feature may need improvement
   - ⚠️ Consider A/B testing different variations
   - ⚠️ Gather qualitative feedback from users

3. **If Engagement Rate is Lower:**
   - ❌ Feature may not be valuable
   - ❌ Consider removing or redesigning
   - ❌ Keep flag OFF until improvements made

### Ending the Experiment

1. **When to End:**
   - After reaching statistical significance
   - After sufficient sample size (100+ users per variation)
   - After running for 1-2 weeks minimum

2. **How to End:**
   - Go to experiment dashboard
   - Click "End experiment"
   - Choose winning variation (or keep both if no clear winner)
   - Update flag targeting based on results

## Event Tracking Implementation

The Support Bot page automatically tracks events for the experiment:

```typescript
// Track page view when component mounts
useEffect(() => {
  if (ldClient) {
    ldClient.track("support-bot-page-view", userContext, {
      timestamp: new Date().toISOString(),
    });
  }
}, [ldClient, userContext]);

// Track message sent
ldClient.track("support-bot-message-sent", userContext, {
  message: userMessage.content,
  timestamp: new Date().toISOString(),
});

// Track response received
ldClient.track("support-bot-response-received", userContext, {
  timestamp: new Date().toISOString(),
});
```

**Event Names (Must Match Metrics):**
- `support-bot-page-view` - Fired when user visits the page
- `support-bot-message-sent` - Fired when user sends a message
- `support-bot-response-received` - Fired when bot responds

## Best Practices

1. **Run Experiments Long Enough**
   - Minimum 1 week for meaningful data
   - Account for day-of-week effects
   - Ensure sufficient sample size

2. **Monitor Multiple Metrics**
   - Primary metric: Engagement rate
   - Secondary metrics: Page views, messages, responses
   - Look for unexpected patterns

3. **Segment Analysis**
   - Compare results by user segments (premium vs free, beta testers, etc.)
   - Identify which user groups benefit most

4. **Iterate Based on Results**
   - If positive: Roll out to more users
   - If neutral: Test variations or improvements
   - If negative: Investigate and improve

## Troubleshooting

### Events Not Appearing in Metrics

**Problem:** Events are being tracked but not showing up in LaunchDarkly

**Solutions:**
1. Verify event names match exactly (case-sensitive)
2. Check that metrics are configured with correct event names
3. Ensure user context is being sent with events
4. Wait a few minutes for events to process
5. Check browser console for tracking errors

### Low Sample Size

**Problem:** Not enough users in experiment

**Solutions:**
1. Increase traffic allocation percentage
2. Run experiment longer
3. Expand targeting rules to include more users
4. Check that flag is ON for treatment group

### No Statistical Significance

**Problem:** Results not statistically significant after running experiment

**Solutions:**
1. Run experiment longer to collect more data
2. Increase sample size (more users)
3. Check if there's actually a difference (may be genuinely no impact)
4. Consider if metric is appropriate for measuring impact

## Next Steps

After completing the experiment:

1. **Document Results**
   - Record engagement rates for both groups
   - Note statistical significance
   - Document any insights or patterns

2. **Make Decision**
   - Roll out feature if positive impact
   - Improve feature if neutral/negative
   - Share results with stakeholders

3. **Iterate**
   - Test variations of the feature
   - Try different messaging or positioning
   - Continue experimenting to optimize

4. **Scale**
   - Once validated, roll out to all users
   - Remove experiment-specific targeting
   - Keep flag ON for all targeted users

