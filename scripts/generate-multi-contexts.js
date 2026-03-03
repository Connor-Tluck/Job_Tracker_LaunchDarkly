#!/usr/bin/env node

/**
 * Quick demo / CLI helper for the multi-context builder.
 *
 * Generates sample multi-contexts and prints them as JSON so you can
 * verify the shape or pipe them into other tools.
 *
 * Usage:
 *   node scripts/generate-multi-contexts.js [--count N]
 */

const crypto = require('crypto');

// ---------------------------------------------------------------------------
// Random data pools (mirrors the attributes used in lib/launchdarkly/multiContext.ts)
// ---------------------------------------------------------------------------

const FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas',
];

const TIERS = ['free', 'premium', 'enterprise', 'business'];
const ROLES = ['user', 'admin', 'beta-tester', 'business'];
const METROS = ['New York', 'Chicago', 'Minneapolis', 'Atlanta', 'Los Angeles', 'San Francisco', 'Denver', 'Boston'];
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Education', 'Manufacturing'];
const COMPANY_SIZES = ['startup', 'small', 'medium', 'large'];
const OPERATING_SYSTEMS = ['Android', 'iOS', 'Mac OS', 'Windows', 'Linux'];
const DEVICE_TYPES = ['mobile', 'tablet', 'desktop', 'smart-tv', 'browser'];
const APP_VERSIONS = ['1.0.2', '1.0.4', '1.0.7', '1.1.0', '1.1.5', '2.0.0'];
const REGIONS = ['NA', 'EU', 'CN', 'IN', 'SA', 'APAC'];
const ORGANIZATIONS = [
  { key: 'org-7f9f58eb', name: 'Mayo Clinic', employees: 76000 },
  { key: 'org-40fad050', name: 'IBM', employees: 288000 },
  { key: 'org-fca878d0', name: '3M', employees: 92000 },
  { key: 'org-a1b2c3d4', name: 'Acme Corp', employees: 5000 },
  { key: 'org-b2c3d4e5', name: 'TechStart Inc', employees: 120 },
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function buildSampleMultiContext() {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const org = pick(ORGANIZATIONS);

  return {
    kind: 'multi',
    user: {
      kind: 'user',
      key: `usr-${crypto.randomUUID()}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      role: pick(ROLES),
      subscriptionTier: pick(TIERS),
      metro: pick(METROS),
      industry: pick(INDUSTRIES),
      companySize: pick(COMPANY_SIZES),
      signupDate: new Date(Date.now() - Math.random() * 7.776e10).toISOString(),
      betaTester: Math.random() < 0.2,
    },
    device: {
      kind: 'device',
      key: `dvc-${crypto.randomUUID()}`,
      os: pick(OPERATING_SYSTEMS),
      type: pick(DEVICE_TYPES),
      version: pick(APP_VERSIONS),
    },
    organization: {
      kind: 'organization',
      key: org.key,
      name: org.name,
      employees: org.employees,
      region: pick(REGIONS),
    },
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const countArg = process.argv.indexOf('--count');
const count = countArg !== -1 ? parseInt(process.argv[countArg + 1], 10) || 5 : 5;

console.log(`Generating ${count} sample multi-context(s):\n`);

for (let i = 0; i < count; i++) {
  const ctx = buildSampleMultiContext();
  console.log(`--- Context ${i + 1} ---`);
  console.log(JSON.stringify(ctx, null, 2));
  console.log();
}
