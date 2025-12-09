#!/usr/bin/env node

/**
 * Import LaunchDarkly flags using the CLI
 * 
 * This script uses the LaunchDarkly CLI to import all flags from flags-cli-format.json
 * Optionally applies targeting rules from an exported JSON file
 * 
 * Usage:
 *   node scripts/import-flags.js --project YOUR_PROJECT_KEY [--environment ENV_KEY] [--targeting-export EXPORT_FILE.json]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let projectKey = null;
let environmentKey = null;
let targetingExportFile = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--project' && args[i + 1]) {
    projectKey = args[i + 1];
    i++;
  } else if (args[i] === '--environment' && args[i + 1]) {
    environmentKey = args[i + 1];
    i++;
  } else if (args[i] === '--targeting-export' && args[i + 1]) {
    targetingExportFile = args[i + 1];
    i++;
  }
}

if (!projectKey) {
  console.error('❌ Error: --project is required');
  console.error('Usage: node scripts/import-flags.js --project PROJECT_KEY [--environment ENV_KEY] [--targeting-export EXPORT_FILE.json]');
  process.exit(1);
}

// Default environment to production if not specified
if (!environmentKey) {
  environmentKey = 'production';
}

// Load targeting export if provided
let targetingData = null;
if (targetingExportFile) {
  const exportPath = path.isAbsolute(targetingExportFile) 
    ? targetingExportFile 
    : path.join(__dirname, '..', targetingExportFile);
  
  if (!fs.existsSync(exportPath)) {
    console.error(`❌ Error: Targeting export file not found: ${exportPath}`);
    process.exit(1);
  }
  
  try {
    targetingData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    console.log(`📋 Loaded targeting data from: ${targetingExportFile}`);
    console.log(`   Found ${targetingData.flags?.length || 0} flags with targeting configurations\n`);
  } catch (error) {
    console.error(`❌ Error reading targeting export file: ${error.message}`);
    process.exit(1);
  }
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

  console.log('✨ Flag import complete!');
  console.log(`✅ Successfully created/updated: ${successCount} flags`);
  if (failedCount > 0) {
    console.log(`⚠️  Skipped/Failed: ${failedCount} flags`);
  }

  // Step 3: Apply targeting rules if export file was provided
  if (targetingData && targetingData.flags) {
    console.log('\n🎯 Applying targeting rules from export file...');
    console.log('   Note: Targeting rules are applied using the update command with full flag configuration.');
    let targetingApplied = 0;
    let targetingFailed = 0;
    
    for (const exportedFlag of targetingData.flags) {
      const flagKey = exportedFlag.key;
      const envConfig = exportedFlag.environments?.[environmentKey];
      
      if (!envConfig || (!envConfig.targets?.length && !envConfig.rules?.length)) {
        continue; // Skip if no targeting config for this environment
      }
      
      try {
        // Get current flag to merge with targeting config
        const getCmd = `ldcli flags get --flag ${flagKey} --project ${projectKey} --env ${environmentKey} -o json`;
        const currentFlag = JSON.parse(execSync(getCmd, { encoding: 'utf-8', stdio: 'pipe' }));
        
        // Update the flag with targeting rules
        if (!currentFlag.environments) {
          currentFlag.environments = {};
        }
        if (!currentFlag.environments[environmentKey]) {
          currentFlag.environments[environmentKey] = {};
        }
        
        // Apply targeting configuration
        const envUpdate = {
          ...currentFlag.environments[environmentKey],
          targets: envConfig.targets || [],
          rules: envConfig.rules || [],
          fallthrough: envConfig.fallthrough || currentFlag.environments[environmentKey].fallthrough,
          offVariation: envConfig.offVariation !== undefined ? envConfig.offVariation : currentFlag.environments[environmentKey].offVariation
        };
        
        currentFlag.environments[environmentKey] = envUpdate;
        
        // Update flag using CLI
        const updateJson = JSON.stringify(currentFlag).replace(/"/g, '\\"');
        execSync(
          `ldcli flags update --flag ${flagKey} --project ${projectKey} -d "${updateJson}"`,
          { stdio: 'pipe', shell: true }
        );
        
        targetingApplied++;
        console.log(`   ✅ Applied targeting for: ${flagKey} (${envConfig.targets?.length || 0} targets, ${envConfig.rules?.length || 0} rules)`);
        
        await sleep(500); // Delay between flags
      } catch (error) {
        const errorMsg = error.message || error.toString();
        console.log(`   ⚠️  Could not apply targeting for ${flagKey}: ${errorMsg}`);
        targetingFailed++;
      }
    }
    
    console.log('\n✨ Targeting application complete!');
    console.log(`✅ Successfully applied targeting to: ${targetingApplied} flags`);
    if (targetingFailed > 0) {
      console.log(`⚠️  Failed to apply targeting to: ${targetingFailed} flags`);
      console.log(`   Note: Some targeting rules may need to be configured manually in the LaunchDarkly dashboard.`);
      console.log(`   The exported JSON file contains all targeting configurations for reference.`);
    }
  }
  
  console.log('\n✨✨ All done! ✨✨');
})();

