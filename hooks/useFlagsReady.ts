'use client';

import { useFlags } from 'launchdarkly-react-client-sdk';
import { useState, useEffect, useRef } from 'react';
import { FLAG_KEYS } from '@/lib/launchdarkly/flags';

/**
 * Hook to check if LaunchDarkly flags are ready/loaded
 * Prevents flash of content by waiting for flags to be available before rendering
 * 
 * @returns boolean - true when flags are ready, false otherwise
 */
export function useFlagsReady(): boolean {
  const flags = useFlags();
  const [flagsReady, setFlagsReady] = useState(false);
  const flagsReadyRef = useRef(false);

  useEffect(() => {
    // Check if flags are loaded by verifying at least one known flag key exists
    // This ensures flags have been populated from bootstrap/localStorage or network
    const keyFlags = [
      FLAG_KEYS.SHOW_DASHBOARD_PAGE,
      FLAG_KEYS.SHOW_ADMIN_PAGE,
      FLAG_KEYS.SHOW_JOBS_PAGE,
      FLAG_KEYS.SHOW_ANALYTICS_PAGE,
    ];
    
    const hasFlags = keyFlags.some(key => key in flags) || Object.keys(flags).length > 0;
    
    if (hasFlags && !flagsReadyRef.current) {
      flagsReadyRef.current = true;
      setFlagsReady(true);
    }
  }, [flags]);

  return flagsReady;
}

