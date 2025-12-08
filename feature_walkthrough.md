# Examples & Walkthroughs

Step-by-step walkthroughs demonstrating each test scenario documented in Assignment Docs

---

## Part 1: Release and Remediate Examples

Walkthroughs demonstrating instant flag toggles and real-time UI updates

### Example 1: Analytics Page Toggle

**Flag:** `show-analytics-page`

#### Step 1: Initial State

Before toggling, verify the Analytics page is accessible and the sidebar link is visible.

**Screenshot:** Sidebar with Analytics link visible

![Sidebar with Analytics link visible](././public/images/examples/analytics-sidebar-before.png)

#### Step 2: LaunchDarkly Configuration

Navigate to LaunchDarkly dashboard → Feature Flags → `show-analytics-page`

**Screenshot:** LaunchDarkly flag configuration page

![LaunchDarkly flag configuration page](./public/images/examples/analytics-flag-config.png)

#### Step 3: Toggle Flag OFF

Toggle the flag to OFF in LaunchDarkly dashboard. Observe instant changes without page reload.

**Screenshot:** Sidebar after toggle - Analytics link removed

![Sidebar after toggle - Analytics link removed](./public/images/examples/analytics-sidebar-after.png)

#### Step 4: Verify 404 Page

Navigate directly to `/analytics` to see the 404 error page.

**Screenshot:** 404 page when accessing /analytics

![404 page when accessing /analytics](./public/images/examples/analytics-404-page.png)

---

## Part 2: Targeting Examples

Walkthroughs demonstrating user-based targeting and real-time context switching

### Example 1: Premium Feature Demo - Beta Tester User

**Flag:** `show-premium-feature-demo`  
**User:** Beta Tester (`user-001` / `beta.tester@example.com`)

#### Step 1: LaunchDarkly Targeting Configuration

Configure individual targeting for Beta Tester user in LaunchDarkly dashboard.

**Screenshot:** LaunchDarkly individual targeting configuration

![LaunchDarkly individual targeting configuration](./public/images/examples/targeting-individual-beta.png)

#### Step 2: Switch to Beta Tester in Admin Page

Navigate to `/admin` and use the User Context Switcher to select Beta Tester.

**Screenshot:** Admin page with Beta Tester selected

![Admin page with Beta Tester selected](./public/images/examples/targeting-beta-selected.png)

#### Step 3: Premium Feature Working - Chatbot Accessible

With Beta Tester selected, navigate to `/landing/support-bot` to verify the chatbot is accessible and working. This demonstrates the premium feature is enabled for Beta Tester.

**Screenshot:** Support Bot page accessible and working for Beta Tester

![Support Bot page accessible and working for Beta Tester](./public/images/examples/targeting-beta-chatbot-working.png)

#### Step 4: Switch to Free User

Navigate back to `/admin` and use the User Context Switcher to select Free User.

**Screenshot:** Admin page with Free User selected

![Admin page with Free User selected](./public/images/examples/targeting-free-user-selected.png)

#### Step 5: Free User - Chatbot Returns 404

With Free User selected, navigate to `/landing/support-bot` to see the 404 error page. This demonstrates that the premium feature (chatbot) is not accessible for Free User.

**Screenshot:** 404 page when Free User accesses /landing/support-bot

![404 page when Free User accesses /landing/support-bot](./public/images/examples/targeting-free-chatbot-404.png)

---

## Extra Credit: AI Configs Examples

Walkthroughs demonstrating LaunchDarkly AI Configs integration and dynamic chatbot behavior

### Example 1: AI Configs - Beta Tester Receives Grumpy Chatbot

**AI Config:** `jobs-os-basic-chatbot`  
**Variation:** `combative_open_ai` (Grumpy Sarcastic)  
**User:** Beta Tester (`user-001`)

#### Step 1: LaunchDarkly AI Config Setup

Configure AI Config in LaunchDarkly with two variations: standard_open_ai (friendly) and combative_open_ai (grumpy).

**Screenshot:** LaunchDarkly AI Config variations configuration

![LaunchDarkly AI Config variations configuration](./public/images/examples/ai-config-variations.png)

#### Step 2: Configure Model Behavior in Prompting

Configure the system prompt and model parameters for each variation. For the `combative_open_ai` variation, set a sarcastic, grumpy system prompt. Configure temperature, max tokens, and model selection (e.g., GPT-4) in the AI Config variation settings.

**Screenshot:** LaunchDarkly AI Config variation prompting and model configuration

![LaunchDarkly AI Config variation prompting and model configuration](./public/images/examples/ai-config-prompting.png)

#### Step 3: AI Config Individual Targeting

Configure individual targeting: Beta Tester (`user-001`) → `combative_open_ai`

**Screenshot:** LaunchDarkly AI Config individual targeting for Beta Tester

![LaunchDarkly AI Config individual targeting for Beta Tester](./public/images/examples/ai-config-beta-targeting.png)

#### Step 4: Switch to Beta Tester and Test Chatbot

Navigate to `/admin`, switch to Beta Tester, and use the Chat Test Interface to send a message.

**Screenshot:** Chat Test Interface with Beta Tester selected

![Chat Test Interface with Beta Tester selected](./public/images/examples/ai-config-beta-chat-interface.png)

#### Step 5: Grumpy Chatbot Response

Observe the chatbot response showing grumpy, sarcastic tone (e.g., "Oh great, another question...").

**Screenshot:** Chatbot response with grumpy/sarcastic tone

![Chatbot response with grumpy/sarcastic tone](./public/images/examples/ai-config-beta-grumpy-response.png)

#### Step 6: Test Other Configuration - Friendly Chatbot

Switch to Premium User in the User Context Switcher and test the chatbot again. Premium User receives the `standard_open_ai` variation, which has a friendly, helpful system prompt. Send the same message and observe the contrast in tone compared to Beta Tester's grumpy response.

**Screenshot:** Chatbot response with friendly/helpful tone (Premium User)

![Chatbot response with friendly/helpful tone (Premium User)](./public/images/examples/ai-config-premium-friendly-response.png)

---

## Extra Credit: Experimentation Examples

Walkthroughs demonstrating experiment setup and metric tracking

### Example 1: Support Bot Experiment Setup

**Flag:** `show-premium-feature-demo`  
**Experiment:** Support Bot feature access experiment

#### Step 1: Add Event Listeners

Event tracking was implemented in the Support Bot page (`app/landing/support-bot/page.tsx`) using LaunchDarkly's `ldClient.track()` method. Three custom events are tracked:

- `support-bot-page-view` - Tracked automatically when a user visits the Support Bot page via `useEffect` hook
- `support-bot-message-sent` - Tracked when a user sends a message, includes message content in event data
- `support-bot-response-received` - Tracked when the bot responds, includes response length metadata

All events include user context (user key, email, subscription tier, etc.) for proper segmentation. The tracking utility function (`lib/launchdarkly/tracking.ts`) handles event queuing, flushing, and error handling.

#### Step 2: Check Event Explorer

Navigate to LaunchDarkly Event Explorer to verify that events are being tracked correctly. Interact with the Support Bot page (visit the page, send a message) and check that events appear in the Event Explorer with proper user context.

**Screenshot:** LaunchDarkly Event Explorer showing tracked events

![LaunchDarkly Event Explorer showing tracked events](./public/images/examples/experiment-event-explorer.png)

#### Step 3: Configure Metrics

In LaunchDarkly, configure experiment metrics. Set the primary metric to `support-bot-response-received` (conversion metric) and add secondary metrics for platform engagement (page clicks, navigation events). Configure engagement rate as a conversion metric from page view to message sent.

**Screenshot:** LaunchDarkly experiment metrics configuration

![LaunchDarkly experiment metrics configuration](./public/images/examples/experiment-metrics.png)

#### Step 4: Set Up Experiment

Configure the experiment in LaunchDarkly: 50% sample size, 50/50 split between control and treatment groups, Bayesian statistical approach, 95% confidence threshold. The experiment tests whether users with access to the Support Bot feature show increased engagement with the platform overall.

**Screenshot:** LaunchDarkly experiment configuration page

![LaunchDarkly experiment configuration page](./public/images/examples/experiment-config.png)

---

## Extra Credit: Integrations

Walkthrough demonstrating Slack webhook integration for experiment lifecycle notifications

### Example 1: Slack Webhook for Experiment Updates

**Integration:** LaunchDarkly Webhook → Slack App  
**Purpose:** Automated notifications for experiment lifecycle events

#### Step 1: Create Slack App and Webhook URL

In Slack, create a new Slack App: Go to `api.slack.com/apps` → Create New App → Choose "From scratch". Enable Incoming Webhooks: Go to Features → Incoming Webhooks → Activate Incoming Webhooks → Add New Webhook to Workspace. Copy the webhook URL (format: `https://hooks.slack.com/services/...`).

#### Step 2: Configure LaunchDarkly Webhook

In LaunchDarkly dashboard, navigate to Integrations → Webhooks → Create Webhook. Configure the webhook:

- Name: "Slack Experiment Notifications" (or similar)
- URL: Paste the Slack webhook URL from Step 1
- Events: Select `experiment.started` and `experiment.stopped`
- Method: POST
- Headers: Add `Content-Type: application/json`

#### Step 3: Verify Integration Setup

Test the integration by starting or stopping an experiment in LaunchDarkly to trigger the webhook. Confirm the integration is working by checking LaunchDarkly webhook delivery logs and verifying Slack messages are received. The integration automatically tracks experiment beginnings and endings without manual intervention.

**Screenshot:** LaunchDarkly webhook configuration and Slack integration

![LaunchDarkly webhook configuration and Slack integration](./public/images/experiment-chatbot-integration.png)

---

## Notes

- All images referenced in this document are located in `./public/images/examples/`
- Screenshots demonstrate actual app behavior and LaunchDarkly configuration
- Each example can be tested independently by following the step-by-step instructions
- User context switching is done via the User Context Switcher on the `/admin` page

