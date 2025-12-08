#!/usr/bin/env node

/**
 * Turn on all feature flags for a specific environment
 * 
 * Usage:
 *   node scripts/turn-on-flags.js --project PROJECT_KEY --environment ENVIRONMENT_KEY
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let projectKey = null;
let environmentKey = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--project' && args[i + 1]) {
    projectKey = args[i + 1];
    i++;
  } else if (args[i] === '--environment' && args[i + 1]) {
    environmentKey = args[i + 1];
    i++;
  }
}

if (!projectKey || !environmentKey) {
  console.error('❌ Error: --project and --environment are required');
  console.error('Usage: node scripts/turn-on-flags.js --project PROJECT_KEY --environment ENVIRONMENT_KEY');
  process.exit(1);
}

// Check if ldcli is installed
try {
  execSync('ldcli --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Error: LaunchDarkly CLI (ldcli) is not installed');
  console.error('Install it from: https://docs.launchdarkly.com/home/getting-started/ldcli-commands');
  process.exit(1);
}

// Read flags from flags.json
const flagsFile = path.join(__dirname, '../launchdarkly/flags.json');
if (!fs.existsSync(flagsFile)) {
  console.error(`❌ Error: ${flagsFile} not found`);
  process.exit(1);
}

const flagsData = JSON.parse(fs.readFileSync(flagsFile, 'utf8'));
const flags = flagsData.flags;

console.log('🚀 Turning on flags for environment...');
console.log(`📁 Project: ${projectKey}`);
console.log(`🌍 Environment: ${environmentKey}`);
console.log(`📊 Found ${flags.length} flags to turn on\n`);

// Helper function to sleep/delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let successCount = 0;
let failedCount = 0;

// Turn on each flag
(async () => {
  for (let i = 0; i < flags.length; i++) {
    const flag = flags[i];
    const flagKey = flag.key;
    
    console.log(`⏳ Turning on: ${flagKey}...`);
    
    try {
      // Turn on the flag for the environment
      execSync(
        `ldcli flags toggle-on --flag ${flagKey} --project ${projectKey} --environment ${environmentKey}`,
        { stdio: 'pipe', shell: true }
      );
      console.log(`✅ Turned on: ${flagKey}`);
      successCount++;
    } catch (error) {
      const errorMsg = error.message || error.toString();
      
      if (errorMsg.includes('not found') || errorMsg.includes('404')) {
        console.log(`⚠️  Flag ${flagKey} not found (skipping)`);
        failedCount++;
      } else if (errorMsg.includes('rate_limited') || errorMsg.includes('rate limit')) {
        console.log(`⏸️  Rate limited - waiting 5 seconds before retrying...`);
        await sleep(5000); // Wait 5 seconds on rate limit
        // Retry once
        try {
          execSync(
            `ldcli flags toggle-on --flag ${flagKey} --project ${projectKey} --environment ${environmentKey}`,
            { stdio: 'pipe', shell: true }
          );
          console.log(`✅ Turned on: ${flagKey} (after retry)`);
          successCount++;
        } catch (retryError) {
          const retryMsg = retryError.message || retryError.toString();
          console.error(`❌ Failed to turn on ${flagKey} after retry: ${retryMsg}`);
          failedCount++;
        }
      } else if (errorMsg.includes('forbidden') || errorMsg.includes('Access to the requested resource was denied')) {
        console.error(`❌ Permission denied for ${flagKey}`);
        console.error(`   Your access token may not have Writer/Admin permissions.`);
        failedCount++;
      } else {
        console.error(`❌ Failed to turn on ${flagKey}: ${errorMsg}`);
        failedCount++;
      }
    }
    
    // Add delay to avoid rate limiting (except for last flag)
    if (i < flags.length - 1) {
      await sleep(1000); // 1 second delay between requests to avoid rate limits
    }
    
    console.log('');
  }

  console.log('✨ Complete!');
  console.log(`✅ Successfully turned on: ${successCount} flags`);
  if (failedCount > 0) {
    console.log(`⚠️  Failed/Skipped: ${failedCount} flags`);
  }
})();

