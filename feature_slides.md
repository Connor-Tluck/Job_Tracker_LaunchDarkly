## Slide 1: Feature Flags — Safe Release & Instant Rollback (Page Gating)
- **Customer story (what we shipped):** We introduced a new Business workflow (Applicant Tracker) and made it *launch-safe* using a feature flag.  
  When the flag is OFF (or the user isn’t eligible), the page returns a true 404 — no “hidden link but accessible by URL” loopholes.
- **How it works (in the app):** The route checks `show-business-user-mode` + `show-applicant-tracker-page` before rendering.
- **Proof (short code snippet):**

```typescript
const isBusinessMode = useFeatureFlag(FLAG_KEYS.SHOW_BUSINESS_USER_MODE);
const showApplicantTracker = useFeatureFlag(FLAG_KEYS.SHOW_APPLICANT_TRACKER_PAGE);

if (!isBusinessMode || !showApplicantTracker) return notFound();
```

- **Business value (why you care):**
  - **Reduce release risk:** Ship behind a switch, not a redeploy.
  - **Instant rollback:** Turn OFF in seconds if issues appear.
  - **Cleaner launches:** No partial exposure of unfinished premium surfaces.
- **Talk track (30 seconds):** “We can deploy this code any time, but only expose it when you’re ready — and if anything goes sideways, you can roll it back immediately without engineering involvement.”

## Slide 2: Targeting — The Right Experience for the Right User (No Forked Code)
- **Customer story (what we shipped):** A single codebase serves distinct experiences (Free/Premium/Beta/Business) based on LaunchDarkly context attributes.
- **How it works (in the app):** When you switch users, we re-identify the LaunchDarkly context and the UI updates in real time.
- **Proof (short code snippet):**

```typescript
await ldClient.identify({
  key: user.key,
  email: user.email,
  custom: { subscriptionTier: user.subscriptionTier, role: user.role },
});
```

- **Business value (why you care):**
  - **Monetization controls:** Gate Business-only workflows to paying tiers.
  - **Safer rollouts:** Enable features for a pilot cohort first (e.g., Business).
  - **Faster iteration:** Change targeting rules in LaunchDarkly without code changes.
- **Talk track (30 seconds):** “Targeting lets you run controlled rollouts by tier or cohort. You’re not maintaining separate apps — you’re configuring who sees what.”

## Slide 3: Experimentation — Measure Impact Before You Roll Out
- **Customer story (what we shipped):** We instrumented the Support Bot flow to capture product metrics (messages sent, responses received, etc.) so you can run A/B tests on experiences.
- **How it works (in the app):** The client emits events with context, which LaunchDarkly can use for metrics/experiments.
- **Proof (short code snippet):**

```typescript
ldClient.track("support-bot-message-sent", ldContext, {
  messageLength: message.length,
  tier: ldContext.custom.subscriptionTier,
});
```

- **Business value (why you care):**
  - **Data-driven decisions:** Roll out what *measurably* improves outcomes.
  - **Protect KPIs:** Catch regressions early before broad exposure.
  - **Quantify ROI:** Tie feature changes to engagement or conversion metrics.
- **Talk track (30 seconds):** “We’re not guessing whether an experience is better — we can measure it, validate lift, and only then roll it out.”

## Slide 4: AI Configs — Control Model + Prompt Without Redeploys
- **Customer story (what we shipped):** The Support Bot’s model behavior is controlled by LaunchDarkly AI Configs, so you can tune prompt/model/params without shipping code.
- **How it works (in the app):** The API requests the AI Config variation for the current user context, then uses it to drive model/prompt selection.
- **Proof (short code snippet):**

```typescript
const aiConfig = await ldClient.variation("jobs-os-basic-chatbot", ldContext, null);
const prompt = aiConfig?.prompt ?? DEFAULT_PROMPT;
const model = aiConfig?.model ?? "gpt-4o-mini";
```

- **Business value (why you care):**
  - **Speed:** Adjust tone/safety/cost controls immediately.
  - **Risk control:** Roll back a prompt/model change just like a feature flag.
  - **Personalization:** Serve different behaviors by cohort (e.g., Business vs Free).
- **Talk track (30 seconds):** “Your AI behavior becomes configurable, not hard-coded — so you can iterate fast and safely, with the same governance and rollback model as feature flags.”

---
### Presenter note
If you want, I can tailor these four slides to your customer’s *exact* goals (revenue, adoption, cost control, compliance) by rewriting the business-value bullets to match their KPIs and industry.

