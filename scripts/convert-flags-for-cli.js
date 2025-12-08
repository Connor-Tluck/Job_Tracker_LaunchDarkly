#!/usr/bin/env node

/**
 * Convert flags.json to LaunchDarkly CLI import format
 * 
 * This script converts the flags.json format to the format expected by
 * the LaunchDarkly CLI for bulk flag creation.
 */

const fs = require('fs');
const path = require('path');

const flagsJsonPath = path.join(__dirname, '../launchdarkly/flags.json');
const outputPath = path.join(__dirname, '../launchdarkly/flags-cli-format.json');

// Read the existing flags.json
const flagsData = JSON.parse(fs.readFileSync(flagsJsonPath, 'utf8'));

// Helper function to sanitize tags (only letters, numbers, '-', '_', '.')
const sanitizeTag = (tag) => {
  return tag
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9\-_.]/g, '-')  // Replace invalid chars with hyphens
    .replace(/-+/g, '-')             // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')           // Remove leading/trailing hyphens
    .substring(0, 64);                // Max 64 characters
};

// Convert to CLI format
const cliFlags = flagsData.flags.map(flag => ({
  name: flag.name,
  key: flag.key,
  description: flag.description,
  tags: [sanitizeTag(flag.category)], // Convert category to tag and sanitize
  variations: [
    { value: true, name: 'On' },
    { value: false, name: 'Off' }
  ],
  defaults: {
    onVariation: 0,  // true
    offVariation: 1  // false
  },
  clientSideAvailability: {
    usingEnvironmentId: true,  // Make available to client-side SDKs
    usingMobileKey: false
  },
  temporary: false
}));

// Write the converted format
fs.writeFileSync(outputPath, JSON.stringify(cliFlags, null, 2));

console.log(`✅ Converted ${cliFlags.length} flags to CLI format`);
console.log(`📄 Output file: ${outputPath}`);
console.log('\n📋 Next steps:');
console.log('1. Install LaunchDarkly CLI: https://docs.launchdarkly.com/home/getting-started/ldcli-commands');
console.log('2. Authenticate: ldcli login');
console.log('3. Run: npm run import-flags -- --project YOUR_PROJECT_KEY');

