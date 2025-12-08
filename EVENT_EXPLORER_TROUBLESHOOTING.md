# Event Explorer Troubleshooting Guide

If events aren't appearing in LaunchDarkly's Event Explorer, follow these steps:

## Step 1: Verify Events Are Being Sent

1. **Open Browser DevTools** (F12) → Console tab
2. **Visit a page** (e.g., `/` for dashboard)
3. **Look for these console messages**:
   - `📊 Tracking page view: page-view-dashboard`
   - `✅ Page view tracked successfully: page-view-dashboard`
4. **Check Network tab**:
   - Look for requests to LaunchDarkly API
   - Usually to `events.launchdarkly.com` or `clientstream.launchdarkly.com`
   - Check if requests are successful (200 status)

## Step 2: Check Event Explorer Settings

### Environment Match
1. **Verify Environment**: Make sure you're looking at the correct environment in Event Explorer
   - If your app is using `Production` environment, check Production Event Explorer
   - If using `Test`, check Test Event Explorer
   - **How to check**: Look at your LaunchDarkly dashboard URL - it should show the environment

### Time Range
1. **Set Time Range**: In Event Explorer, make sure time range includes recent events
   - Try "Last hour" or "Last 24 hours"
   - Events can take 1-2 minutes to appear

### Filters
1. **Check Filters**: Make sure no filters are hiding events
   - Clear all filters
   - Check if "Event type" filter is set to show custom events
   - Some Event Explorers have a filter for "Custom events" vs "Flag evaluations"

## Step 3: Verify LaunchDarkly Configuration

### Client-Side ID
1. **Check Environment Variable**:
   - Verify `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID` is set correctly
   - Should match the Client-side ID from LaunchDarkly dashboard
   - **Where to find**: LaunchDarkly Dashboard → Project Settings → Client-side ID

### Project Settings
1. **Check Project**: Make sure you're in the correct project
   - Your project: `Interview_Job_Tracking_Project_Final`
   - Verify Event Explorer is showing events for this project

## Step 4: Test with Simple Event

Try tracking a very simple event to verify the setup:

1. **In Browser Console**, run:
```javascript
// Get LaunchDarkly client (if available globally)
// Or check if ldClient is accessible in your component

// Simple test event
ldClient?.track('test-event', {
  key: 'test-user',
  email: 'test@example.com'
}, undefined, { test: true });
```

2. **Wait 2-3 minutes**
3. **Check Event Explorer** for `test-event`

## Step 5: Check LaunchDarkly Account Permissions

1. **Verify Permissions**: Make sure your account has access to view events
   - Some accounts might not have Event Explorer access
   - Check with LaunchDarkly admin if needed

## Step 6: Alternative - Check Metrics Instead

If Event Explorer isn't working, you can still create metrics directly:

1. **Go to Metrics** in LaunchDarkly dashboard
2. **Create metric** with event name: `page-view-dashboard`
3. **Check if metric shows data** - if it does, events are being sent correctly
4. **Event Explorer might just have a delay or filter issue**

## Step 7: Network Debugging

1. **Open Network tab** in DevTools
2. **Filter by "launchdarkly"** or "events"
3. **Visit a page** and look for:
   - POST requests to LaunchDarkly events endpoint
   - Check request payload - should contain your event data
   - Check response - should be 202 (Accepted) or 200 (OK)

## Common Issues

### Issue 1: Events Only Show for Flag Evaluations
**Solution**: LaunchDarkly might prioritize flag evaluation events. Custom events should still appear, but might be in a different section or require different filters.

### Issue 2: Wrong Environment
**Solution**: Make sure your app's environment matches Event Explorer environment. Check LaunchDarkly dashboard URL for environment name.

### Issue 3: Events Are Batched
**Solution**: Events might be batched and sent periodically. The `flush()` call should help, but there might still be a small delay.

### Issue 4: Event Explorer Requires Different View
**Solution**: Some LaunchDarkly accounts have Event Explorer in different locations:
- Try "Events" → "Event Explorer"
- Try "Analytics" → "Events"
- Try "Data Export" → "Events"

## Next Steps

If events still don't appear after checking all above:

1. **Check LaunchDarkly Documentation**: https://docs.launchdarkly.com/home/connecting/events
2. **Contact LaunchDarkly Support**: They can verify if events are being received
3. **Use Metrics Instead**: Create metrics directly - if they show data, events are working
4. **Check LaunchDarkly Status**: Verify LaunchDarkly service is operational

## Quick Test Checklist

- [ ] Console shows `✅ Event tracked successfully`
- [ ] Network tab shows requests to LaunchDarkly
- [ ] Environment matches (Production/Test)
- [ ] Time range includes recent events
- [ ] No filters hiding events
- [ ] Client-side ID is correct
- [ ] Waited 2-3 minutes for processing
- [ ] Tried creating a metric to verify events are received

