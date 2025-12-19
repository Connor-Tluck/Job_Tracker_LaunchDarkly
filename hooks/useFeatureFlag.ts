'use client';

import { useFlags } from 'launchdarkly-react-client-sdk';
import { FLAG_KEYS, FlagKey } from '@/lib/launchdarkly/flags';

/**
 * Custom hook to access LaunchDarkly feature flags
 * 
 * @param flagKey - The feature flag key from FLAG_KEYS
 * @param defaultValue - Default value if flag is not available (defaults to true)
 * @returns The flag value (boolean)
 * 
 * @example
 * const showAnalytics = useFeatureFlag(FLAG_KEYS.SHOW_ANALYTICS_PAGE);
 * if (showAnalytics) {
 *   // Show analytics page
 * }
 */
export function useFeatureFlag(flagKey: FlagKey, defaultValue: boolean = true): boolean {
  // useFlags() returns LaunchDarkly-evaluated flag values for the *currently identified* user context.
  // Before the SDK finishes bootstrapping/identify(), `flags[flagKey]` may be undefined → use a sane default.
  const flags = useFlags();
  return flags[flagKey] ?? defaultValue;
}

/**
 * Hook to get multiple feature flags at once
 * 
 * @param flagKeys - Array of flag keys to retrieve
 * @returns Object with flag keys as properties and their values
 * 
 * @example
 * const { showMetrics, showRecentJobs } = useFeatureFlags([
 *   FLAG_KEYS.SHOW_DASHBOARD_METRICS,
 *   FLAG_KEYS.SHOW_DASHBOARD_RECENT_JOBS
 * ]);
 */
export function useFeatureFlags(flagKeys: FlagKey[]): Record<FlagKey, boolean> {
  const flags = useFlags();
  return flagKeys.reduce((acc, key) => {
    acc[key] = flags[key] ?? true;
    return acc;
  }, {} as Record<FlagKey, boolean>);
}

