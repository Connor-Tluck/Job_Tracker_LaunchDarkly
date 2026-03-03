/**
 * Multi-Context Builder for LaunchDarkly
 *
 * Constructs valid multi-contexts (user + device + organization) that can be
 * used with both the client-side React SDK (identify) and the server-side
 * Node SDK (variation / track).
 *
 * Private attributes are configured at two levels:
 *  1. **Context level** — Each context kind declares `_meta.privateAttributes`
 *     so the SDK strips those fields from events sent to LD.
 *  2. **SDK client level** — See LaunchDarklyProvider.tsx (client) and
 *     serverClient.ts (server) for the `privateAttributes` SDK option.
 *
 * @see https://docs.launchdarkly.com/home/contexts/multi-contexts
 * @see https://launchdarkly.com/docs/sdk/features/private-attributes
 */

import type { LDContext } from 'launchdarkly-react-client-sdk';

// ---------------------------------------------------------------------------
// Context-kind interfaces
// ---------------------------------------------------------------------------

export interface UserContextAttrs {
  key: string;
  name: string;
  email?: string;
  role: string;
  subscriptionTier: string;
  metro?: string;
  industry?: string;
  companySize?: string;
  signupDate?: string;
  betaTester?: boolean;
}

export interface DeviceContextAttrs {
  key: string;
  os: string;
  type: string;
  version: string;
}

export interface OrganizationContextAttrs {
  key: string;
  name: string;
  region: string;
  employees?: number;
}

// ---------------------------------------------------------------------------
// Per-kind private attribute lists (context-level privacy)
//
// These attributes are still used for flag targeting, but the SDK will NOT
// send their values to the LaunchDarkly events endpoint.
// ---------------------------------------------------------------------------

const USER_PRIVATE_ATTRS = ['email', 'signupDate'];
const DEVICE_PRIVATE_ATTRS = ['os'];
const ORG_PRIVATE_ATTRS = ['employees'];

/** Exported so the admin UI can display which attributes are private. */
export const PRIVATE_ATTRIBUTES = {
  user: USER_PRIVATE_ATTRS,
  device: DEVICE_PRIVATE_ATTRS,
  organization: ORG_PRIVATE_ATTRS,
} as const;

// ---------------------------------------------------------------------------
// Single-context builders
// ---------------------------------------------------------------------------

/**
 * Build a single "user" context with context-level private attributes.
 */
export function createUserContext(attrs: UserContextAttrs): LDContext {
  return {
    kind: 'user',
    key: attrs.key,
    name: attrs.name,
    email: attrs.email,
    role: attrs.role,
    subscriptionTier: attrs.subscriptionTier,
    metro: attrs.metro,
    industry: attrs.industry,
    companySize: attrs.companySize,
    signupDate: attrs.signupDate,
    betaTester: attrs.betaTester,
    _meta: {
      privateAttributes: USER_PRIVATE_ATTRS,
    },
  };
}

/**
 * Build a single "device" context with context-level private attributes.
 */
export function createDeviceContext(attrs: DeviceContextAttrs): LDContext {
  return {
    kind: 'device',
    key: attrs.key,
    os: attrs.os,
    type: attrs.type,
    version: attrs.version,
    _meta: {
      privateAttributes: DEVICE_PRIVATE_ATTRS,
    },
  };
}

/**
 * Build a single "organization" context with context-level private attributes.
 */
export function createOrganizationContext(attrs: OrganizationContextAttrs): LDContext {
  return {
    kind: 'organization',
    key: attrs.key,
    name: attrs.name,
    region: attrs.region,
    employees: attrs.employees,
    _meta: {
      privateAttributes: ORG_PRIVATE_ATTRS,
    },
  };
}

// ---------------------------------------------------------------------------
// Anonymous context builder
// ---------------------------------------------------------------------------

/**
 * Build an anonymous context for a logged-out / unauthenticated visitor.
 *
 * In a real application a visitor who hasn't signed in still has a device and
 * a browser session, so we include those two context kinds. There is no "user"
 * kind because we don't know who they are yet.
 *
 * Setting `anonymous: true` tells the LD SDK to auto-generate and persist a
 * stable key so the same anonymous visitor gets consistent flag values across
 * page loads.
 */
export function createAnonymousContext(): LDContext {
  const platform = typeof navigator !== 'undefined' ? navigator.platform : 'unknown';
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  const device: LDContext = {
    kind: 'device',
    key: 'anonymous-device',
    anonymous: true,
    os: platform,
    type: /Mobi|Android/i.test(ua) ? 'mobile' : 'desktop',
    version: '1.0.0',
    _meta: {
      privateAttributes: DEVICE_PRIVATE_ATTRS,
    },
  };

  const session: LDContext = {
    kind: 'session',
    key: 'anonymous-session',
    anonymous: true,
    referrer: typeof document !== 'undefined' ? (document.referrer || 'direct') : 'server',
    locale: typeof navigator !== 'undefined' ? (navigator.language || 'unknown') : 'unknown',
    timezone: typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'unknown',
  };

  return {
    kind: 'multi',
    device,
    session,
  } as LDContext;
}

// ---------------------------------------------------------------------------
// Multi-context builder (authenticated)
// ---------------------------------------------------------------------------

/**
 * Combine a user, device, and organization context into a single multi-context.
 *
 * The returned object is a valid LDContext that can be passed to:
 * - Client SDK: `ldClient.identify(multiCtx)`
 * - Server SDK: `client.variation(flagKey, multiCtx, defaultValue)`
 *
 * You can also pass only the contexts you have — any omitted kind is simply
 * left out of the multi-context.
 */
export function createMultiContext(parts: {
  user: UserContextAttrs;
  device?: DeviceContextAttrs;
  organization?: OrganizationContextAttrs;
}): LDContext {
  const contexts: Record<string, LDContext> = {};

  contexts.user = createUserContext(parts.user);
  if (parts.device) contexts.device = createDeviceContext(parts.device);
  if (parts.organization) contexts.organization = createOrganizationContext(parts.organization);

  // If only a user context was supplied, return it directly (single-context)
  const kinds = Object.keys(contexts);
  if (kinds.length === 1) {
    return contexts[kinds[0]];
  }

  return {
    kind: 'multi',
    ...contexts,
  } as LDContext;
}
