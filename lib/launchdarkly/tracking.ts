/**
 * LaunchDarkly Event Tracking Utilities
 * 
 * Helper functions for tracking events consistently across the application
 */

import { LDClient } from "launchdarkly-react-client-sdk";
import { UserContext } from "./userContext";

/**
 * Convert UserContext to LaunchDarkly context format
 */
export function convertToLDContext(userContext: UserContext) {
  return {
    key: userContext.key,
    email: userContext.email,
    name: userContext.name,
    custom: {
      role: userContext.role,
      subscriptionTier: userContext.subscriptionTier,
      signupDate: userContext.signupDate,
      betaTester: userContext.betaTester,
      companySize: userContext.companySize,
      industry: userContext.industry,
    }
  };
}

/**
 * Track a page view event
 */
export function trackPageView(
  ldClient: LDClient | null,
  userContext: UserContext,
  pageName: string,
  additionalData?: Record<string, any>
) {
  if (!ldClient) {
    console.warn(`⚠️ LaunchDarkly client not available for page view: ${pageName}`);
    return;
  }

  const ldContext = convertToLDContext(userContext);
  const eventName = `page-view-${pageName}`;

  // Wait for client to be ready, then track
  const trackEvent = () => {
    // Check for Do Not Track (LaunchDarkly respects DNT and won't send analytics events)
    if (typeof window !== 'undefined' && navigator.doNotTrack === '1') {
      console.warn(`⚠️ Do Not Track (DNT) is enabled in your browser. LaunchDarkly respects DNT and will NOT send analytics events.`);
      console.warn(`⚠️ To test events: Disable DNT in browser settings or use a different browser/profile.`);
      console.warn(`⚠️ Chrome: Settings → Privacy → Do Not Track → OFF`);
      console.warn(`⚠️ Firefox: Settings → Privacy → Uncheck "Tell websites I do not want to be tracked"`);
      return; // Don't track if DNT is enabled
    }

    console.log(`📊 Tracking page view: ${eventName}`, {
      context: ldContext,
      data: {
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        path: typeof window !== 'undefined' ? window.location.pathname : '',
        ...additionalData,
      },
      clientReady: ldClient.isOffline ? 'offline' : 'online'
    });

    try {
      // LaunchDarkly React SDK track signature: track(eventName, context, metricValue?, customData?)
      // For page views, we don't have a numeric metric value, so we pass undefined
      // and put our data in the customData parameter (4th parameter)
      ldClient.track(
        eventName,
        ldContext,
        undefined, // metricValue - undefined for page views (no numeric value)
        {
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : '',
          path: typeof window !== 'undefined' ? window.location.pathname : '',
          pageName,
          ...additionalData,
        }
      );
      
      console.log(`✅ Event queued: ${eventName}`);
      
      // Flush events to ensure they're sent immediately
      // Note: Client-side SDK batches events, so they might not appear immediately in Network tab
      if (ldClient.flush) {
        ldClient.flush();
        console.log(`🔄 Events flushed`);
      }
      
      console.log(`✅ Page view tracked successfully: ${eventName}`);
    } catch (error) {
      console.error(`❌ Error tracking page view ${eventName}:`, error);
    }
  };

  // Check if client is ready
  if (ldClient.waitForInitialization) {
    ldClient.waitForInitialization().then(() => {
      trackEvent();
    }).catch((error) => {
      console.error(`❌ Error waiting for LaunchDarkly initialization:`, error);
      // Try tracking anyway
      trackEvent();
    });
  } else {
    // Client might already be ready, try tracking
    trackEvent();
  }
}

/**
 * Track a custom event
 */
export function trackEvent(
  ldClient: LDClient | null,
  userContext: UserContext,
  eventName: string,
  eventData?: Record<string, any>
) {
  if (!ldClient) {
    console.warn(`⚠️ LaunchDarkly client not available for event: ${eventName}`);
    return;
  }

  const ldContext = convertToLDContext(userContext);

  // Wait for client to be ready, then track
  const track = () => {
    // Check for Do Not Track (LaunchDarkly respects DNT and won't send analytics events)
    if (typeof window !== 'undefined' && navigator.doNotTrack === '1') {
      console.warn(`⚠️ Do Not Track (DNT) is enabled in your browser. LaunchDarkly respects DNT and will NOT send analytics events.`);
      console.warn(`⚠️ To test events: Disable DNT in browser settings or use a different browser/profile.`);
      console.warn(`⚠️ Chrome: Settings → Privacy → Do Not Track → OFF`);
      console.warn(`⚠️ Firefox: Settings → Privacy → Uncheck "Tell websites I do not want to be tracked"`);
      return; // Don't track if DNT is enabled
    }

    console.log(`📊 Tracking event: ${eventName}`, {
      context: ldContext,
      data: eventData,
      clientReady: ldClient.isOffline ? 'offline' : 'online'
    });

    try {
      // LaunchDarkly React SDK track signature: track(eventName, context, metricValue?, customData?)
      // For custom events, we don't have a numeric metric value, so we pass undefined
      // and put our data in the customData parameter (4th parameter)
      ldClient.track(
        eventName,
        ldContext,
        undefined, // metricValue - undefined for custom events (no numeric value)
        {
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : '',
          path: typeof window !== 'undefined' ? window.location.pathname : '',
          ...eventData,
        }
      );
      
      console.log(`✅ Event queued: ${eventName}`);
      
      // Flush events to ensure they're sent immediately
      // Note: Client-side SDK batches events, so they might not appear immediately in Network tab
      if (ldClient.flush) {
        ldClient.flush();
        console.log(`🔄 Events flushed`);
      }
      
      console.log(`✅ Event tracked successfully: ${eventName}`);
    } catch (error) {
      console.error(`❌ Error tracking event ${eventName}:`, error);
    }
  };

  // Check if client is ready
  if (ldClient.waitForInitialization) {
    ldClient.waitForInitialization().then(() => {
      track();
    }).catch((error) => {
      console.error(`❌ Error waiting for LaunchDarkly initialization:`, error);
      // Try tracking anyway
      track();
    });
  } else {
    // Client might already be ready, try tracking
    track();
  }
}

