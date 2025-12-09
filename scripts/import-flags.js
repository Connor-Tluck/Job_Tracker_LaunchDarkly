#!/usr/bin/env node

/**
 * Import LaunchDarkly flags using the CLI
 * 
 * This script uses the LaunchDarkly CLI to import all flags from flags-cli-format.json
 * Optionally applies targeting rules from an exported JSON file
 * Automatically enables all flags in production after import
 * Generates a detailed log file with import results
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

// Initialize logging
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const logFile = path.join(logDir, `import-${timestamp}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message, toConsole = true) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  logStream.write(logMessage);
  if (toConsole) {
    console.log(message);
  }
}

function logError(message, toConsole = true) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ERROR: ${message}\n`;
  logStream.write(logMessage);
  if (toConsole) {
    console.error(message);
  }
}

// Track import results
const importResults = {
  flagsCreated: [],
  flagsSkipped: [],
  flagsFailed: [],
  flagsEnabled: [],
  flagsEnableFailed: [],
  targetingApplied: [],
  targetingFailed: [],
  startTime: new Date(),
  endTime: null
};

// Load targeting export if provided
let targetingData = null;
if (targetingExportFile) {
  const exportPath = path.isAbsolute(targetingExportFile) 
    ? targetingExportFile 
    : path.join(__dirname, '..', targetingExportFile);
  
  if (!fs.existsSync(exportPath)) {
    logError(`Targeting export file not found: ${exportPath}`);
    console.error(`❌ Error: Targeting export file not found: ${exportPath}`);
    process.exit(1);
  }
  
  try {
    targetingData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    log(`📋 Loaded targeting data from: ${targetingExportFile}`);
    log(`   Found ${targetingData.flags?.length || 0} flags with targeting configurations\n`);
  } catch (error) {
    logError(`Error reading targeting export file: ${error.message}`);
    console.error(`❌ Error reading targeting export file: ${error.message}`);
    process.exit(1);
  }
}

// Check if ldcli is installed
try {
  execSync('ldcli --version', { stdio: 'ignore' });
} catch (error) {
  logError('LaunchDarkly CLI (ldcli) is not installed');
  console.error('❌ Error: LaunchDarkly CLI (ldcli) is not installed');
  console.error('Install it from: https://docs.launchdarkly.com/home/getting-started/ldcli-commands');
  process.exit(1);
}

// Check if flags-cli-format.json exists, if not convert it
const flagsFile = path.join(__dirname, '../launchdarkly/flags-cli-format.json');
if (!fs.existsSync(flagsFile)) {
  log('📦 Converting flags to CLI format...');
  require('./convert-flags-for-cli.js');
}

if (!fs.existsSync(flagsFile)) {
  logError(`${flagsFile} not found`);
  console.error(`❌ Error: ${flagsFile} not found`);
  process.exit(1);
}

// Read flags
const flags = JSON.parse(fs.readFileSync(flagsFile, 'utf8'));

// Check if we have fewer flags than expected (33 is the expected count)
if (flags.length < 33) {
  log(`⚠️  Warning: Found only ${flags.length} flags to import (expected 33)`);
  log(`   This may be because some flags are turned off in production.`);
  if (targetingExportFile) {
    log(`   Since you provided a targeting export, you can regenerate flags.json to include all flags:`);
    log(`   node scripts/regenerate-flags-from-export.js --export-file ${targetingExportFile}`);
    log(`   Then run this import script again.\n`);
  } else {
    log(`   To include all flags (even those turned off), first export your flags:`);
    log(`   node scripts/export-flags-with-targeting.js --project ${projectKey}`);
    log(`   Then regenerate flags.json:`);
    log(`   node scripts/regenerate-flags-from-export.js --export-file launchdarkly-flags-export-full.json\n`);
  }
}

log('🚀 Importing flags to LaunchDarkly...');
log(`📁 Project: ${projectKey}`);
log(`🌍 Environment: ${environmentKey}`);
log(`📊 Found ${flags.length} flags to import\n`);
log(`📝 Logging to: ${logFile}\n`);

// Helper function to sleep/delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiting with exponential backoff
let consecutiveRateLimits = 0;
const BASE_DELAY = 2000; // 2 seconds base delay
const MAX_DELAY = 10000; // 10 seconds max delay

async function handleRateLimit() {
  consecutiveRateLimits++;
  const delay = Math.min(BASE_DELAY * Math.pow(2, consecutiveRateLimits - 1), MAX_DELAY);
  log(`⏸️  Rate limited (attempt ${consecutiveRateLimits}) - waiting ${delay/1000}s before continuing...`);
  await sleep(delay);
}

function resetRateLimitCounter() {
  consecutiveRateLimits = 0;
}

// Import each flag (using async/await for delays)
(async () => {
  try {
    // Step 1: Create flags
    log('\n=== STEP 1: Creating Flags ===\n');
    
    for (let i = 0; i < flags.length; i++) {
      const flag = flags[i];
      const flagKey = flag.key;
      const flagName = flag.name;
      
      log(`⏳ Creating flag: ${flagKey} (${flagName})...`);
      
      // Build flag definition object for CLI
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
      
      let retryCount = 0;
      const maxRetries = 3;
      let created = false;
      
      while (retryCount <= maxRetries && !created) {
        try {
          // LaunchDarkly CLI expects JSON data via -d flag
          const flagJson = JSON.stringify(flagDefinition).replace(/"/g, '\\"');
          const cmd = `ldcli flags create --project ${projectKey} -d "${flagJson}"`;
          
          execSync(cmd, { stdio: 'pipe', shell: true });
          log(`✅ Created: ${flagKey}`);
          importResults.flagsCreated.push({ key: flagKey, name: flagName });
          created = true;
          resetRateLimitCounter();
          
          // Add delay between requests to avoid rate limits (longer delay)
          if (i < flags.length - 1) {
            await sleep(1500); // 1.5 second delay between requests
          }
        } catch (error) {
          const errorMsg = error.message || error.toString();
          
          // Check if flag already exists
          if (errorMsg.includes('already exists') || errorMsg.includes('409')) {
            log(`⚠️  Flag ${flagKey} already exists (skipping)`);
            importResults.flagsSkipped.push({ key: flagKey, name: flagName, reason: 'already exists' });
            created = true;
            resetRateLimitCounter();
          } else if (errorMsg.includes('rate_limited') || errorMsg.includes('rate limit') || errorMsg.includes('429')) {
            if (retryCount < maxRetries) {
              await handleRateLimit();
              retryCount++;
            } else {
              logError(`Failed to create ${flagKey} after ${maxRetries} retries due to rate limiting`);
              importResults.flagsFailed.push({ key: flagKey, name: flagName, reason: 'rate limit exceeded' });
              created = true; // Give up on this flag
            }
          } else if (errorMsg.includes('forbidden') || errorMsg.includes('Access to the requested resource was denied')) {
            logError(`Permission denied for ${flagKey}`);
            logError(`   Your access token may not have Writer/Admin permissions.`);
            importResults.flagsFailed.push({ key: flagKey, name: flagName, reason: 'permission denied' });
            created = true;
          } else if (errorMsg.includes('Tags are invalid') || errorMsg.includes('invalid_request')) {
            logError(`Invalid tag format for ${flagKey}: ${errorMsg}`);
            logError(`   Tags: ${JSON.stringify(flag.tags)}`);
            importResults.flagsFailed.push({ key: flagKey, name: flagName, reason: 'invalid tags' });
            created = true;
          } else {
            if (retryCount < maxRetries) {
              log(`⚠️  Error creating ${flagKey}, retrying... (${retryCount + 1}/${maxRetries})`);
              await sleep(1000);
              retryCount++;
            } else {
              logError(`Failed to create ${flagKey}: ${errorMsg}`);
              importResults.flagsFailed.push({ key: flagKey, name: flagName, reason: errorMsg });
              created = true;
            }
          }
        }
      }
      
      log('');
    }

    log('\n✨ Flag creation complete!');
    log(`✅ Successfully created: ${importResults.flagsCreated.length} flags`);
    log(`⚠️  Skipped (already exists): ${importResults.flagsSkipped.length} flags`);
    if (importResults.flagsFailed.length > 0) {
      log(`❌ Failed: ${importResults.flagsFailed.length} flags`);
    }

    // Step 2: Enable all flags in production
    log('\n=== STEP 2: Enabling Flags in Production ===\n');
    
    const flagsToEnable = [...importResults.flagsCreated, ...importResults.flagsSkipped];
    log(`Attempting to enable ${flagsToEnable.length} flags in ${environmentKey}...\n`);
    
    for (let i = 0; i < flagsToEnable.length; i++) {
      const flag = flagsToEnable[i];
      const flagKey = flag.key;
      
      let retryCount = 0;
      const maxRetries = 3;
      let enabled = false;
      
      while (retryCount <= maxRetries && !enabled) {
        try {
          execSync(
            `ldcli flags turn-on ${flagKey} --project ${projectKey} --environment ${environmentKey}`,
            { stdio: 'pipe' }
          );
          log(`✅ Enabled: ${flagKey}`);
          importResults.flagsEnabled.push({ key: flagKey });
          enabled = true;
          resetRateLimitCounter();
          
          // Add delay between requests
          if (i < flagsToEnable.length - 1) {
            await sleep(1500); // 1.5 second delay
          }
        } catch (error) {
          const errorMsg = error.message || error.toString();
          
          if (errorMsg.includes('rate_limited') || errorMsg.includes('rate limit') || errorMsg.includes('429')) {
            if (retryCount < maxRetries) {
              await handleRateLimit();
              retryCount++;
            } else {
              logError(`Failed to enable ${flagKey} after ${maxRetries} retries due to rate limiting`);
              importResults.flagsEnableFailed.push({ key: flagKey, reason: 'rate limit exceeded' });
              enabled = true;
            }
          } else if (errorMsg.includes('already') || errorMsg.includes('is already')) {
            // Flag is already on, count as success
            log(`ℹ️  ${flagKey} is already enabled`);
            importResults.flagsEnabled.push({ key: flagKey });
            enabled = true;
            resetRateLimitCounter();
          } else {
            if (retryCount < maxRetries) {
              await sleep(1000);
              retryCount++;
            } else {
              logError(`Failed to enable ${flagKey}: ${errorMsg}`);
              importResults.flagsEnableFailed.push({ key: flagKey, reason: errorMsg });
              enabled = true;
            }
          }
        }
      }
    }
    
    log('\n✨ Flag enabling complete!');
    log(`✅ Successfully enabled: ${importResults.flagsEnabled.length} flags`);
    if (importResults.flagsEnableFailed.length > 0) {
      log(`⚠️  Failed to enable: ${importResults.flagsEnableFailed.length} flags`);
    }

    // Step 3: Apply targeting rules if export file was provided
    if (targetingData && targetingData.flags) {
      log('\n=== STEP 3: Applying Targeting Rules ===\n');
      log('Note: Targeting rules are applied using the update command with full flag configuration.\n');
      
      for (let i = 0; i < targetingData.flags.length; i++) {
        const exportedFlag = targetingData.flags[i];
        const flagKey = exportedFlag.key;
        const envConfig = exportedFlag.environments?.[environmentKey];
        
        if (!envConfig || (!envConfig.targets?.length && !envConfig.rules?.length)) {
          continue; // Skip if no targeting config for this environment
        }
        
        let retryCount = 0;
        const maxRetries = 3;
        let applied = false;
        
        while (retryCount <= maxRetries && !applied) {
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
            
            importResults.targetingApplied.push({ 
              key: flagKey, 
              targets: envConfig.targets?.length || 0, 
              rules: envConfig.rules?.length || 0 
            });
            log(`   ✅ Applied targeting for: ${flagKey} (${envConfig.targets?.length || 0} targets, ${envConfig.rules?.length || 0} rules)`);
            applied = true;
            resetRateLimitCounter();
            
            // Add delay between flags (longer for targeting updates)
            if (i < targetingData.flags.length - 1) {
              await sleep(2000); // 2 second delay for targeting updates
            }
          } catch (error) {
            const errorMsg = error.message || error.toString();
            
            if (errorMsg.includes('rate_limited') || errorMsg.includes('rate limit') || errorMsg.includes('429')) {
              if (retryCount < maxRetries) {
                await handleRateLimit();
                retryCount++;
              } else {
                logError(`Failed to apply targeting for ${flagKey} after ${maxRetries} retries due to rate limiting`);
                importResults.targetingFailed.push({ key: flagKey, reason: 'rate limit exceeded' });
                applied = true;
              }
            } else {
              if (retryCount < maxRetries) {
                await sleep(1000);
                retryCount++;
              } else {
                logError(`Could not apply targeting for ${flagKey}: ${errorMsg}`);
                importResults.targetingFailed.push({ key: flagKey, reason: errorMsg });
                applied = true;
              }
            }
          }
        }
      }
      
      log('\n✨ Targeting application complete!');
      log(`✅ Successfully applied targeting to: ${importResults.targetingApplied.length} flags`);
      if (importResults.targetingFailed.length > 0) {
        log(`⚠️  Failed to apply targeting to: ${importResults.targetingFailed.length} flags`);
        log(`   Note: Some targeting rules may need to be configured manually in the LaunchDarkly dashboard.`);
        log(`   The exported JSON file contains all targeting configurations for reference.`);
      }
    }

    // Generate final report
    importResults.endTime = new Date();
    const duration = Math.round((importResults.endTime - importResults.startTime) / 1000);
    
    log('\n' + '='.repeat(60));
    log('📊 IMPORT SUMMARY REPORT');
    log('='.repeat(60));
    log(`Start Time: ${importResults.startTime.toISOString()}`);
    log(`End Time: ${importResults.endTime.toISOString()}`);
    log(`Duration: ${duration} seconds (${Math.round(duration / 60)} minutes)`);
    log('');
    log('Flag Creation:');
    log(`  ✅ Created: ${importResults.flagsCreated.length}`);
    log(`  ⚠️  Skipped (already exists): ${importResults.flagsSkipped.length}`);
    log(`  ❌ Failed: ${importResults.flagsFailed.length}`);
    log('');
    log('Flag Enabling:');
    log(`  ✅ Enabled: ${importResults.flagsEnabled.length}`);
    log(`  ❌ Failed: ${importResults.flagsEnableFailed.length}`);
    log('');
    if (targetingData) {
      log('Targeting Rules:');
      log(`  ✅ Applied: ${importResults.targetingApplied.length}`);
      log(`  ❌ Failed: ${importResults.targetingFailed.length}`);
      log('');
    }
    log('='.repeat(60));
    
    if (importResults.flagsFailed.length > 0) {
      log('\n❌ Failed Flags:');
      importResults.flagsFailed.forEach(flag => {
        log(`  - ${flag.key}: ${flag.reason}`);
      });
      log('');
    }
    
    if (importResults.flagsEnableFailed.length > 0) {
      log('\n❌ Failed to Enable:');
      importResults.flagsEnableFailed.forEach(flag => {
        log(`  - ${flag.key}: ${flag.reason}`);
      });
      log('');
    }
    
    if (importResults.targetingFailed.length > 0) {
      log('\n❌ Failed Targeting Applications:');
      importResults.targetingFailed.forEach(flag => {
        log(`  - ${flag.key}: ${flag.reason}`);
      });
      log('');
    }
    
    log(`\n📝 Full log saved to: ${logFile}`);
    log('\n✨✨ All done! ✨✨\n');
    
    console.log(`\n📝 Full import log saved to: ${logFile}`);
    console.log('✨✨ All done! ✨✨\n');
    
  } catch (error) {
    logError(`Fatal error during import: ${error.message}`);
    logError(error.stack);
    console.error('❌ Fatal error during import:', error.message);
  } finally {
    logStream.end();
  }
})();
