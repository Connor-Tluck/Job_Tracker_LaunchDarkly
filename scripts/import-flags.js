#!/usr/bin/env node

/**
 * Import LaunchDarkly flags using the CLI
 * 
 * This script uses the LaunchDarkly CLI to import all flags from flags-cli-format.json
 * 
 * Usage:
 *   node scripts/import-flags.js --project YOUR_PROJECT_KEY [--environment ENV_KEY]
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

if (!projectKey) {
  console.error('❌ Error: --project is required');
  console.error('Usage: node scripts/import-flags.js --project PROJECT_KEY [--environment ENV_KEY]');
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

// Check if flags-cli-format.json exists, if not convert it
const flagsFile = path.join(__dirname, '../launchdarkly/flags-cli-format.json');
if (!fs.existsSync(flagsFile)) {
  console.log('📦 Converting flags to CLI format...');
  require('./convert-flags-for-cli.js');
}

if (!fs.existsSync(flagsFile)) {
  console.error(`❌ Error: ${flagsFile} not found`);
  process.exit(1);
}

// Read flags
const flags = JSON.parse(fs.readFileSync(flagsFile, 'utf8'));

console.log('🚀 Importing flags to LaunchDarkly...');
console.log(`📁 Project: ${projectKey}`);
if (environmentKey) {
  console.log(`🌍 Environment: ${environmentKey}`);
}
console.log(`📊 Found ${flags.length} flags to import\n`);

let successCount = 0;
let failedCount = 0;

// Helper function to sleep/delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Import each flag (using async/await for delays)
(async () => {
  for (let i = 0; i < flags.length; i++) {
    const flag = flags[i];
    const flagKey = flag.key;
    const flagName = flag.name;
    
    console.log(`⏳ Creating flag: ${flagKey} (${flagName})...`);
    
    // Build flag definition object for CLI (outside try block for retry access)
    const flagDefinition = {
      key: flagKey,
      name: flagName,
      description: flag.description,
      variations: flag.variations,
      defaults: flag.defaults,
      clientSideAvailability: flag.clientSideAvailability,
      tags: flag.tags,
      temporary: flag.temporary || false
    };
    
    try {
      // LaunchDarkly CLI expects JSON data via -d flag
      // Escape JSON properly for shell command
      const flagJson = JSON.stringify(flagDefinition).replace(/"/g, '\\"');
      const cmd = `ldcli flags create --project ${projectKey} -d "${flagJson}"`;
      
      execSync(cmd, { stdio: 'pipe', shell: true });
      console.log(`✅ Created: ${flagKey}`);
      successCount++;
      
      // If environment is specified, set the flag variation for that environment
      if (environmentKey && flag.defaults.onVariation === 0) {
        try {
          execSync(
            `ldcli flags turn-on ${flagKey} --project ${projectKey} --environment ${environmentKey}`,
            { stdio: 'pipe' }
          );
          console.log(`   Set default to ON for environment: ${environmentKey}`);
        } catch (err) {
          // Ignore errors for setting environment defaults
        }
      }
    } catch (error) {
      const errorMsg = error.message || error.toString();
      
      // Check if flag already exists
      if (errorMsg.includes('already exists') || errorMsg.includes('409')) {
        console.log(`⚠️  Flag ${flagKey} already exists (skipping)`);
        // Don't count as failure if it already exists
      } else if (errorMsg.includes('rate_limited') || errorMsg.includes('rate limit')) {
        console.log(`⏸️  Rate limited - waiting 2 seconds before continuing...`);
        await sleep(2000); // Wait 2 seconds on rate limit
        // Retry once
        try {
          const flagJson = JSON.stringify(flagDefinition).replace(/"/g, '\\"');
          const cmd = `ldcli flags create --project ${projectKey} -d "${flagJson}"`;
          execSync(cmd, { stdio: 'pipe', shell: true });
          console.log(`✅ Created: ${flagKey} (after retry)`);
          successCount++;
        } catch (retryError) {
          const retryMsg = retryError.message || retryError.toString();
          console.error(`❌ Failed to create ${flagKey} after retry: ${retryMsg}`);
          failedCount++;
        }
      } else if (errorMsg.includes('forbidden') || errorMsg.includes('Access to the requested resource was denied')) {
        console.error(`❌ Permission denied for ${flagKey}`);
        console.error(`   Your access token may not have Writer/Admin permissions.`);
        console.error(`   Please check your token permissions in LaunchDarkly settings.`);
        failedCount++;
      } else if (errorMsg.includes('Tags are invalid') || errorMsg.includes('invalid_request')) {
        console.error(`❌ Invalid tag format for ${flagKey}: ${errorMsg}`);
        console.error(`   Tags: ${JSON.stringify(flag.tags)}`);
        failedCount++;
      } else {
        console.error(`❌ Failed to create ${flagKey}: ${errorMsg}`);
        failedCount++;
      }
    }
  
    // Add delay to avoid rate limiting (except for last flag)
    if (i < flags.length - 1) {
      await sleep(1000); // 1 second delay between requests to avoid rate limits
    }
    
    console.log('');
  }

  console.log('✨ Import complete!');
  console.log(`✅ Successfully created/updated: ${successCount} flags`);
  if (failedCount > 0) {
    console.log(`⚠️  Skipped/Failed: ${failedCount} flags`);
  }
})();

